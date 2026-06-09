import { Sidebar } from "@/components/shell/Sidebar";
import { BgCanvas } from "@/components/shell/BgCanvas";
import { EffectsProvider } from "@/components/shell/Effects";
import { ToastProvider } from "@/components/shell/Toast";
import { LevelUpOverlay } from "@/components/shell/LevelUpOverlay";
import { ProgressProvider } from "@/lib/progress-store";
import { fetchProgress } from "@/lib/progress-server";
import { MetricsProvider } from "@/lib/metrics-store";
import { fetchMetrics } from "@/lib/metrics-server";
import { RhythmProvider } from "@/lib/rhythm-store";
import { fetchRhythm } from "@/lib/rhythm-server";

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [progress, metrics, rhythm] = await Promise.all([
    fetchProgress(),
    fetchMetrics(),
    fetchRhythm(),
  ]);

  return (
    <ProgressProvider initial={progress}>
      <MetricsProvider initial={metrics}>
        <RhythmProvider initial={rhythm}>
          <ToastProvider>
            <EffectsProvider>
              <BgCanvas />
              <div className="relative z-10 md:grid md:grid-cols-[16rem_1fr]">
                <Sidebar />
                <main className="min-h-screen">{children}</main>
              </div>
              <LevelUpOverlay />
            </EffectsProvider>
          </ToastProvider>
        </RhythmProvider>
      </MetricsProvider>
    </ProgressProvider>
  );
}
