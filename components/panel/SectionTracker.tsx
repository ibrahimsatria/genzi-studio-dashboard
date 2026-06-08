"use client";

import { useEffect, useRef } from "react";
import { useProgress, useProgressActions } from "@/lib/progress-store";
import { useEffects } from "@/components/shell/Effects";
import { useToast } from "@/components/shell/Toast";
import { sound } from "@/lib/audio";
import { SECTION_XP } from "@/lib/xp";
import type { PanelId } from "@/content/panels";

// Wraps a panel and fires "section read" when the user scrolls to (near) the
// bottom of the panel content, OR when the content fits entirely in view.
//
// Lives next to the panel content (server-rendered). Self-cleans on unmount.
export function SectionTracker({ panelId }: { panelId: PanelId }) {
  const progress = useProgress();
  const { awardSectionRead, setActivePanel } = useProgressActions();
  const effects = useEffects();
  const toast = useToast();
  const fired = useRef(false);

  // Mark this panel as the active panel as soon as it mounts.
  useEffect(() => {
    setActivePanel(panelId);
  }, [panelId, setActivePanel]);

  useEffect(() => {
    if (progress.sectionsRead.includes(panelId)) {
      fired.current = true;
      return;
    }

    const checkComplete = () => {
      if (fired.current) return;
      const doc = document.documentElement;
      const fitsInView = doc.scrollHeight <= window.innerHeight + 8;
      const reachedBottom =
        window.scrollY + window.innerHeight >= doc.scrollHeight - 56;
      if (fitsInView || reachedBottom) {
        fired.current = true;
        awardSectionRead(panelId, SECTION_XP);
        sound.section();
        effects.flash();
        toast("Section unlocked", `+${SECTION_XP} XP`);
      }
    };

    let ticking = false;
    const onScroll = () => {
      if (ticking) return;
      ticking = true;
      requestAnimationFrame(() => {
        checkComplete();
        ticking = false;
      });
    };

    // Wait two frames so layout has settled, then check fit-in-view.
    requestAnimationFrame(() => requestAnimationFrame(checkComplete));

    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);
    return () => {
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
    };
  }, [panelId, progress.sectionsRead, awardSectionRead, effects, toast]);

  return null;
}
