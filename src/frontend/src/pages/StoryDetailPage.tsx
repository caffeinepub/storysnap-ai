import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import {
  ChevronLeft,
  Copy,
  Heart,
  Loader2,
  MessageCircle,
  Share2,
} from "lucide-react";
import { motion } from "motion/react";
import { useState } from "react";
import { toast } from "sonner";
import type { AppRoute } from "../App";
import Footer from "../components/Footer";
import Navbar from "../components/Navbar";
import PremiumModal from "../components/PremiumModal";
import { useLikeStory, useShareStory, useStory } from "../hooks/useQueries";
import { getModeConfig, getModeFromStory } from "../lib/storyTemplates";

interface StoryDetailPageProps {
  id: string;
  onNavigate: (route: AppRoute) => void;
}

export default function StoryDetailPage({
  id,
  onNavigate,
}: StoryDetailPageProps) {
  const { data: story, isLoading } = useStory(id);
  const likeMutation = useLikeStory();
  const shareMutation = useShareStory();
  const [localLikes, setLocalLikes] = useState<bigint | null>(null);
  const [premiumOpen, setPremiumOpen] = useState(false);

  const handleLike = async () => {
    if (!story) return;
    setLocalLikes((story.likes ?? 0n) + 1n);
    await likeMutation.mutateAsync(story.id);
    toast.success("❤️ Liked!");
  };

  const handleShare = async () => {
    if (!story) return;
    await shareMutation.mutateAsync(story.id);
    await navigator.clipboard.writeText(window.location.href);
    toast.success("Link copied to clipboard!");
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background">
        <Navbar
          onNavigate={onNavigate}
          onPremiumClick={() => setPremiumOpen(true)}
        />
        <main
          className="mx-auto max-w-2xl px-4 py-12"
          data-ocid="story.loading_state"
        >
          <Skeleton className="h-8 w-48 mb-6 rounded-full" />
          <Skeleton className="h-96 w-full rounded-3xl" />
          <Skeleton className="h-24 w-full mt-4 rounded-xl" />
        </main>
      </div>
    );
  }

  if (!story) {
    return (
      <div className="min-h-screen bg-background">
        <Navbar
          onNavigate={onNavigate}
          onPremiumClick={() => setPremiumOpen(true)}
        />
        <main
          className="mx-auto max-w-2xl px-4 py-12 text-center"
          data-ocid="story.error_state"
        >
          <p className="text-4xl mb-4">😔</p>
          <p className="text-lg font-semibold mb-2">Story not found</p>
          <p className="text-sm text-muted-foreground mb-6">
            This story may have been removed.
          </p>
          <Button
            data-ocid="story.primary_button"
            className="gradient-cta border-0 text-white rounded-full"
            onClick={() => onNavigate({ page: "home" })}
          >
            Back to Home
          </Button>
        </main>
      </div>
    );
  }

  const modeKey = getModeFromStory(story);
  const config = getModeConfig(modeKey);
  const displayLikes = localLikes ?? story.likes;

  return (
    <div className="min-h-screen bg-background">
      <Navbar
        onNavigate={onNavigate}
        onPremiumClick={() => setPremiumOpen(true)}
      />
      <PremiumModal open={premiumOpen} onClose={() => setPremiumOpen(false)} />

      <main className="mx-auto max-w-2xl px-4 py-10">
        <button
          type="button"
          data-ocid="story.button"
          onClick={() => onNavigate({ page: "home" })}
          className="mb-6 flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground transition-colors"
        >
          <ChevronLeft className="h-4 w-4" /> Back to Trending
        </button>

        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          {/* Hero card */}
          <div
            data-ocid="story.card"
            className="relative overflow-hidden rounded-3xl"
            style={{ minHeight: "520px" }}
          >
            <img
              src={config.bgImage}
              alt={story.title}
              className="absolute inset-0 h-full w-full object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/95 via-black/55 to-black/20" />

            <div className="relative p-8">
              {/* Author row */}
              <div className="flex items-center gap-3 mb-6">
                <div className="flex h-10 w-10 items-center justify-center rounded-full gradient-cta text-sm font-bold text-white">
                  {story.authorHandle.charAt(0).toUpperCase()}
                </div>
                <div>
                  <p className="text-sm font-semibold text-white">
                    @{story.authorHandle}
                  </p>
                  <span
                    className="inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-xs font-medium text-white"
                    style={{ background: config.chipGradient }}
                  >
                    {config.emoji} {config.label}
                  </span>
                </div>
              </div>

              <h1 className="text-3xl font-black text-white leading-tight mb-4">
                {story.title}
              </h1>

              <p className="text-sm text-white/85 leading-relaxed whitespace-pre-line">
                {story.storyText}
              </p>

              <p className="mt-8 text-xs text-white/40 text-center">
                Made with StorySnap AI ✨
              </p>
            </div>
          </div>

          {/* Engagement row */}
          <div className="mt-6 flex items-center justify-between rounded-2xl border border-border/60 bg-card px-6 py-4">
            <div className="flex items-center gap-4">
              <button
                type="button"
                data-ocid="story.toggle"
                onClick={handleLike}
                disabled={likeMutation.isPending}
                className="flex items-center gap-2 text-sm font-medium text-muted-foreground hover:text-brand-pink transition-colors"
              >
                <Heart className="h-5 w-5" />
                {displayLikes.toString()} Likes
              </button>
              <button
                type="button"
                data-ocid="story.secondary_button"
                onClick={handleShare}
                disabled={shareMutation.isPending}
                className="flex items-center gap-2 text-sm font-medium text-muted-foreground hover:text-brand-cyan transition-colors"
              >
                <Share2 className="h-5 w-5" />
                {story.shares.toString()} Shares
              </button>
            </div>
            <Button
              data-ocid="story.primary_button"
              size="sm"
              className="gradient-cta border-0 text-white rounded-full hover:opacity-90"
              onClick={handleShare}
            >
              <Copy className="mr-1.5 h-3.5 w-3.5" /> Share
            </Button>
          </div>

          {/* CTA */}
          <div className="mt-8 rounded-2xl border border-border/60 bg-card p-6 text-center">
            <p className="text-2xl mb-2">💬</p>
            <h3 className="text-lg font-bold mb-1">Try Your Chat</h3>
            <p className="text-sm text-muted-foreground mb-4">
              Upload your own screenshot and create a cinematic story in
              seconds.
            </p>
            <Button
              data-ocid="story.primary_button"
              className="gradient-cta border-0 text-white rounded-full px-8 hover:opacity-90 hover:scale-105 transition-all"
              onClick={() => onNavigate({ page: "create" })}
            >
              <MessageCircle className="mr-2 h-4 w-4" /> Create My Story
            </Button>
          </div>
        </motion.div>
      </main>

      <Footer />
    </div>
  );
}
