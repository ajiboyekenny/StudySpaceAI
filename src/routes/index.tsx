import { createFileRoute } from "@tanstack/react-router";
import App from "@/App";

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
  return <App />;
}
