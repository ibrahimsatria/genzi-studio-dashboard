"use client";

import {
  createContext,
  useCallback,
  useContext,
  useMemo,
  useRef,
  useSyncExternalStore,
} from "react";
import type { PanelId } from "@/content/panels";
import { type Progress, EMPTY_PROGRESS } from "@/lib/progress-types";
import { levelFromXP } from "@/lib/xp";
import {
  awardSectionRead as awardSectionReadAction,
  toggleTask as toggleTaskAction,
  setActivePanel as setActivePanelAction,
  setSoundEnabled as setSoundEnabledAction,
  resetProgress as resetProgressAction,
} from "@/lib/progress-server";

type Listener = () => void;
type LevelUpHandler = (level: number) => void;

type Store = {
  getState: () => Progress;
  subscribe: (l: Listener) => () => void;
  awardSectionRead: (panelId: PanelId, sectionXp: number) => void;
  toggleTask: (taskId: string, xpDelta: number) => boolean; // returns NEW checked state
  setActivePanel: (panelId: PanelId) => void;
  setSoundEnabled: (on: boolean) => void;
  reset: () => void;
  onLevelUp: (handler: LevelUpHandler) => () => void;
};

const Ctx = createContext<Store | null>(null);

export function ProgressProvider({
  initial,
  children,
}: {
  initial: Progress;
  children: React.ReactNode;
}) {
  const stateRef = useRef<Progress>(initial);
  const listenersRef = useRef<Set<Listener>>(new Set());
  const levelUpListenersRef = useRef<Set<LevelUpHandler>>(new Set());

  const store = useMemo<Store>(() => {
    const emit = () => listenersRef.current.forEach((l) => l());
    const set = (next: Progress, prevLevel: number) => {
      stateRef.current = next;
      emit();
      if (next.level > prevLevel) {
        levelUpListenersRef.current.forEach((h) => h(next.level));
      }
    };

    return {
      getState: () => stateRef.current,
      subscribe(l) {
        listenersRef.current.add(l);
        return () => listenersRef.current.delete(l);
      },
      onLevelUp(h) {
        levelUpListenersRef.current.add(h);
        return () => levelUpListenersRef.current.delete(h);
      },
      awardSectionRead(panelId, sectionXp) {
        const cur = stateRef.current;
        if (cur.sectionsRead.includes(panelId)) return;
        const xp = Math.max(0, cur.xp + sectionXp);
        set(
          {
            ...cur,
            xp,
            level: levelFromXP(xp).n,
            sectionsRead: [...cur.sectionsRead, panelId],
          },
          cur.level,
        );
        awardSectionReadAction(panelId, sectionXp).catch(() => {});
      },
      toggleTask(taskId, xpDelta) {
        const cur = stateRef.current;
        const isChecked = cur.checkedTasks.includes(taskId);
        const nextChecked = isChecked
          ? cur.checkedTasks.filter((t) => t !== taskId)
          : [...cur.checkedTasks, taskId];
        const delta = isChecked ? -xpDelta : xpDelta;
        const xp = Math.max(0, cur.xp + delta);
        set(
          { ...cur, xp, level: levelFromXP(xp).n, checkedTasks: nextChecked },
          cur.level,
        );
        toggleTaskAction(taskId, xpDelta).catch(() => {});
        return !isChecked;
      },
      setActivePanel(panelId) {
        const cur = stateRef.current;
        if (cur.activePanel === panelId) return;
        set({ ...cur, activePanel: panelId }, cur.level);
        setActivePanelAction(panelId).catch(() => {});
      },
      setSoundEnabled(on) {
        const cur = stateRef.current;
        if (cur.soundEnabled === on) return;
        set({ ...cur, soundEnabled: on }, cur.level);
        setSoundEnabledAction(on).catch(() => {});
      },
      reset() {
        const cur = stateRef.current;
        set({ ...EMPTY_PROGRESS, soundEnabled: cur.soundEnabled }, cur.level);
        resetProgressAction().catch(() => {});
      },
    };
  }, []);

  return <Ctx.Provider value={store}>{children}</Ctx.Provider>;
}

export function useProgress(): Progress {
  const store = useContext(Ctx);
  if (!store) throw new Error("useProgress must be used inside ProgressProvider");
  return useSyncExternalStore(
    store.subscribe,
    store.getState,
    store.getState,
  );
}

export function useProgressStore(): Store {
  const store = useContext(Ctx);
  if (!store) throw new Error("useProgressStore must be used inside ProgressProvider");
  return store;
}

// Convenience: derived selector with memoization-friendly equality.
export function useTaskChecked(taskId: string): boolean {
  const progress = useProgress();
  return progress.checkedTasks.includes(taskId);
}

export function useSectionRead(panelId: PanelId): boolean {
  const progress = useProgress();
  return progress.sectionsRead.includes(panelId);
}

// Stable handle to mutation actions only (avoid re-rendering on every state change).
export function useProgressActions() {
  const store = useProgressStore();
  const awardSectionRead = useCallback(store.awardSectionRead, [store]);
  const toggleTask = useCallback(store.toggleTask, [store]);
  const setActivePanel = useCallback(store.setActivePanel, [store]);
  const setSoundEnabled = useCallback(store.setSoundEnabled, [store]);
  const reset = useCallback(store.reset, [store]);
  const onLevelUp = useCallback(store.onLevelUp, [store]);
  return { awardSectionRead, toggleTask, setActivePanel, setSoundEnabled, reset, onLevelUp };
}
