import { useState } from "react";
import { createFileRoute } from "@tanstack/react-router";
import AppHeader from "@/components/AppHeader";
import BottomNav, { type TabId } from "@/components/BottomNav";
import { getChapter } from "@/data/catalog";
import { useAuth } from "@/lib/auth";
import { useProfile } from "@/lib/profileSync";
import AuthView from "@/views/AuthView";
import ChallengeView from "@/views/ChallengeView";
import ChapterReader from "@/views/ChapterReader";
import HubView from "@/views/HubView";
import LandingView from "@/views/LandingView";
import LearningCenterView from "@/views/LearningCenterView";
import LibraryView from "@/views/LibraryView";
import OfflineVaultView from "@/views/OfflineVaultView";
import OnboardingView from "@/views/OnboardingView";
import TrackProgressView from "@/views/TrackProgressView";
import { useZeroBandwidthMode } from "@/lib/appMode";
import type { ChapterTab, SubjectId } from "@/types/study";

// The home route ships no og:image, so serve-time hosting can inject the
// project's social preview (explicit og:image or latest screenshot).
export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "StudySpace AI — STEM Learning Hub" },
      { name: "description", content: "Study biology, physics, chemistry, and mathematics with offline chapters, flashcards, quizzes, and progress tracking." },
      { property: "og:title", content: "StudySpace AI — STEM Learning Hub" },
      { property: "og:description", content: "Offline-first STEM study tools for Nigerian students." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: Index,
});

function Index() {
  const { user, loading } = useAuth();
  const profile = useProfile();
  const { enabled: zeroBandwidth } = useZeroBandwidthMode();
  const [authScreen, setAuthScreen] = useState(false);
  const [authMode, setAuthMode] = useState<"login" | "signup">("signup");
  const [activeTab, setActiveTab] = useState<TabId>("hub");
  const [activeSubject, setActiveSubject] = useState<SubjectId>("biology");
  const [openChapterId, setOpenChapterId] = useState<string | null>(null);
  const [chapterTab, setChapterTab] = useState<ChapterTab>("read");

  if (loading) {
    return <div className="flex min-h-screen items-center justify-center bg-slate-950 text-sm text-slate-300">Loading StudySpace…</div>;
  }

  if (!user) {
    if (authScreen) {
      return (
        <AuthView
          mode={authMode}
          onBack={() => setAuthScreen(false)}
          onSwitchMode={setAuthMode}
        />
      );
    }
    return (
      <LandingView
        onGetStarted={() => {
          setAuthMode("signup");
          setAuthScreen(true);
        }}
        onLogin={() => {
          setAuthMode("login");
          setAuthScreen(true);
        }}
      />
    );
  }

  if (!profile.onboarded) {
    return <OnboardingView onComplete={() => setActiveTab("hub")} />;
  }

  const openChapter = (chapterId: string, tab: ChapterTab) => {
    setOpenChapterId(chapterId);
    setChapterTab(tab);
  };

  return (
    <div className="min-h-screen bg-slate-950 pb-16">
      <AppHeader />
      <main className="mx-auto max-w-5xl space-y-5 px-4 py-5 sm:px-6">
        {activeTab === "hub" && (
          <HubView
            onNavigate={setActiveTab}
            onSelectSubject={(subject) => {
              setActiveSubject(subject);
              setActiveTab("learning");
            }}
          />
        )}
        {activeTab === "learning" && (
          <LearningCenterView
            initialSubject={activeSubject}
            onOpenChapter={openChapter}
          />
        )}
        {activeTab === "challenge" && <ChallengeView />}
        {activeTab === "library" && <LibraryView />}
        {activeTab === "progress" && <TrackProgressView />}
        {activeTab === "offline" && <OfflineVaultView onOpenChapter={openChapter} />}
      </main>
      <BottomNav active={activeTab} onChange={setActiveTab} />
      {openChapterId && (
        <ChapterReader
          chapter={zeroBandwidth && !profile.onboarded ? null : getChapter(openChapterId) ?? null}
          initialTab={chapterTab}
          onClose={() => setOpenChapterId(null)}
        />
      )}
    </div>
  );
}
