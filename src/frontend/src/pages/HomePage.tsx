import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { Loader2, TrendingUp, Upload } from "lucide-react";
import { AnimatePresence, motion } from "motion/react";
import { useState } from "react";
import type { AppRoute } from "../App";
import Footer from "../components/Footer";
import Navbar from "../components/Navbar";
import PremiumModal from "../components/PremiumModal";
import StoryCard from "../components/StoryCard";
import { useTrendingStories } from "../hooks/useQueries";
import { MODES, type StoryModeKey } from "../lib/storyTemplates";

interface HomePageProps {
  onNavigate: (route: AppRoute) => void;
}

export default function HomePage({ onNavigate }: HomePageProps) {
  const [activeMode, setActiveMode] = useState<StoryModeKey | null>(null);
  const [premiumOpen, setPremiumOpen] = useState(false);
  const { data: stories, isLoading } = useTrendingStories(12n);

  const filteredStories = activeMode
    ? stories?.filter((s) => activeMode in s.mode)
    : stories;

  return (
    <div className="min-h-screen bg-background">
      <Navbar
        onNavigate={onNavigate}
        onPremiumClick={() => setPremiumOpen(true)}
      />
      <PremiumModal open={premiumOpen} onClose={() => setPremiumOpen(false)} />

      <main>
        {/* ── HERO ── */}
        <section className="relative overflow-hidden px-4 py-20 md:py-32">
          {/* Background glow */}
          <div
            className="pointer-events-none absolute inset-0 opacity-30"
            style={{
              background:
                "radial-gradient(ellipse 80% 60% at 50% 0%, oklch(0.558 0.217 293 / 0.4) 0%, transparent 70%)",
            }}
          />

          <div className="relative mx-auto max-w-[900px] text-center">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
            >
              <span className="inline-flex items-center gap-2 rounded-full border border-brand-purple/30 bg-brand-purple/10 px-4 py-1.5 text-xs font-medium text-brand-purple mb-6">
                <span className="h-1.5 w-1.5 rounded-full bg-brand-purple animate-pulse" />
                AI-Powered Story Generation
              </span>
            </motion.div>

            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.1 }}
              className="text-4xl font-black leading-tight tracking-tight md:text-6xl lg:text-7xl"
            >
              Turn Your Chat Drama Into{" "}
              <span className="gradient-cta-text">Epic Cinematic Stories</span>{" "}
              with AI.
            </motion.h1>

            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="mx-auto mt-6 max-w-xl text-base text-muted-foreground md:text-lg"
            >
              Upload any chat screenshot and watch AI transform it into a funny,
              emotional, Bollywood, thriller, or motivational masterpiece —
              ready to share.
            </motion.p>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.3 }}
              className="mt-10 flex flex-col items-center gap-3"
            >
              <Button
                data-ocid="hero.primary_button"
                size="lg"
                className="h-14 gap-3 rounded-full gradient-cta border-0 text-white text-base font-semibold px-8 hover:opacity-90 shadow-glow transition-all hover:scale-105"
                onClick={() => onNavigate({ page: "create" })}
              >
                <Upload className="h-5 w-5" />
                Start Your Story
              </Button>
              <p className="text-xs text-muted-foreground">
                Drop Screenshots or Click to Upload
              </p>
            </motion.div>
          </div>
        </section>

        {/* ── CATEGORY CHIPS ── */}
        <section className="px-4 pb-8">
          <div className="mx-auto max-w-[1200px]">
            <motion.h2
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true }}
              className="mb-5 text-center text-xl font-bold"
            >
              Story Vibe Categories
            </motion.h2>
            <div
              data-ocid="categories.section"
              className="flex flex-wrap justify-center gap-3"
            >
              <button
                type="button"
                data-ocid="categories.tab"
                onClick={() => setActiveMode(null)}
                className={`flex items-center gap-2 rounded-full px-5 py-2.5 text-sm font-semibold transition-all border ${
                  activeMode === null
                    ? "border-foreground/20 bg-foreground/10 text-foreground"
                    : "border-border/50 text-muted-foreground hover:text-foreground hover:border-border"
                }`}
              >
                ✨ All
              </button>
              {MODES.map((mode) => (
                <button
                  type="button"
                  key={mode.key}
                  data-ocid="categories.tab"
                  onClick={() =>
                    setActiveMode(activeMode === mode.key ? null : mode.key)
                  }
                  className={`flex items-center gap-2 rounded-full px-5 py-2.5 text-sm font-semibold transition-all border ${
                    activeMode === mode.key
                      ? "border-transparent text-white"
                      : "border-border/50 text-muted-foreground hover:text-foreground hover:border-border"
                  }`}
                  style={
                    activeMode === mode.key
                      ? { background: mode.chipGradient }
                      : {}
                  }
                >
                  {mode.emoji} {mode.label}
                </button>
              ))}
            </div>
          </div>
        </section>

        {/* ── TRENDING STORIES ── */}
        <section className="px-4 pb-20">
          <div className="mx-auto max-w-[1200px]">
            <div className="mb-8 flex items-center justify-between">
              <motion.h2
                initial={{ opacity: 0, x: -16 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                className="flex items-center gap-2 text-xl font-bold"
              >
                <TrendingUp className="h-5 w-5 text-brand-pink" />
                Trending Stories
              </motion.h2>
              <Button
                data-ocid="trending.secondary_button"
                variant="outline"
                size="sm"
                className="rounded-full text-xs"
                onClick={() => onNavigate({ page: "create" })}
              >
                Create Yours →
              </Button>
            </div>

            {isLoading ? (
              <div
                data-ocid="trending.loading_state"
                className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4"
              >
                {["sk1", "sk2", "sk3", "sk4", "sk5", "sk6", "sk7", "sk8"].map(
                  (sk) => (
                    <Skeleton
                      key={sk}
                      className="rounded-2xl"
                      style={{ aspectRatio: "2/3" }}
                    />
                  ),
                )}
              </div>
            ) : !filteredStories?.length ? (
              <div
                data-ocid="trending.empty_state"
                className="flex flex-col items-center justify-center rounded-2xl border border-dashed border-border/60 py-20 text-center"
              >
                <p className="text-3xl mb-3">📭</p>
                <p className="text-sm text-muted-foreground">
                  No stories yet. Be the first to create one!
                </p>
                <Button
                  data-ocid="trending.primary_button"
                  className="mt-4 gradient-cta border-0 text-white rounded-full"
                  size="sm"
                  onClick={() => onNavigate({ page: "create" })}
                >
                  Create Story
                </Button>
              </div>
            ) : (
              <AnimatePresence mode="wait">
                <motion.div
                  key={activeMode ?? "all"}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.3 }}
                  className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4"
                >
                  {filteredStories?.map((story, i) => (
                    <StoryCard
                      key={story.id}
                      story={story}
                      index={i}
                      onNavigate={onNavigate}
                    />
                  ))}
                </motion.div>
              </AnimatePresence>
            )}
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}
