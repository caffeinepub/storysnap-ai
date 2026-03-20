import { Toaster } from "@/components/ui/sonner";
import { useEffect, useState } from "react";
import { useActor } from "./hooks/useActor";
import { asAppBackend } from "./lib/actorTypes";
import CreatorPage from "./pages/CreatorPage";
import HomePage from "./pages/HomePage";
import StoryDetailPage from "./pages/StoryDetailPage";

export type AppRoute =
  | { page: "home" }
  | { page: "create" }
  | { page: "story"; id: string };

function AppInner() {
  const [route, setRoute] = useState<AppRoute>({ page: "home" });
  const { actor } = useActor();
  const backend = asAppBackend(actor);

  useEffect(() => {
    if (backend) {
      void backend.initSeed();
    }
  }, [backend]);

  const navigate = (r: AppRoute) => {
    setRoute(r);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  if (route.page === "create") {
    return <CreatorPage onNavigate={navigate} />;
  }
  if (route.page === "story") {
    return <StoryDetailPage id={route.id} onNavigate={navigate} />;
  }
  return <HomePage onNavigate={navigate} />;
}

export default function App() {
  return (
    <>
      <AppInner />
      <Toaster richColors position="top-right" />
    </>
  );
}
