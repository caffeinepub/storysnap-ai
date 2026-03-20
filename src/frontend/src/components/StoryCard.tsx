import { Eye, Heart, Share2 } from "lucide-react";
import { motion } from "motion/react";
import { useState } from "react";
import { toast } from "sonner";
import type { AppRoute } from "../App";
import type { Story } from "../backend.d";
import { useLikeStory, useShareStory } from "../hooks/useQueries";
import { getModeConfig, getModeFromStory } from "../lib/storyTemplates";

interface StoryCardProps {
  story: Story;
  index: number;
  onNavigate: (route: AppRoute) => void;
}

export default function StoryCard({
  story,
  index,
  onNavigate,
}: StoryCardProps) {
  const modeKey = getModeFromStory(story);
  const config = getModeConfig(modeKey);
  const likeMutation = useLikeStory();
  const shareMutation = useShareStory();
  const [localLikes, setLocalLikes] = useState(story.likes);

  const handleLike = async (e: React.MouseEvent) => {
    e.stopPropagation();
    setLocalLikes((prev) => prev + 1n);
    await likeMutation.mutateAsync(story.id);
  };

  const handleShare = async (e: React.MouseEvent) => {
    e.stopPropagation();
    await shareMutation.mutateAsync(story.id);
    await navigator.clipboard.writeText(
      `${window.location.href}#story/${story.id}`,
    );
    toast.success("Link copied to clipboard!");
  };

  const timeAgo = () => {
    const now = Date.now();
    const created = Number(story.createdAt / 1_000_000n);
    const diffMs = now - created;
    const diffH = Math.floor(diffMs / 3_600_000);
    if (diffH < 1) return "Just now";
    if (diffH < 24) return `${diffH}h ago`;
    return `${Math.floor(diffH / 24)}d ago`;
  };

  return (
    <motion.div
      data-ocid={`trending.item.${index + 1}`}
      initial={{ opacity: 0, y: 24 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.06, duration: 0.4, ease: "easeOut" }}
      className="group relative cursor-pointer overflow-hidden rounded-2xl"
      style={{ aspectRatio: "2/3" }}
      onClick={() => onNavigate({ page: "story", id: story.id })}
    >
      {/* Background image */}
      <img
        src={config.bgImage}
        alt={story.title}
        className="absolute inset-0 h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
        loading="lazy"
      />

      {/* Gradient overlay */}
      <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/40 to-black/10" />

      {/* Top: author + mode badge */}
      <div className="absolute top-3 left-3 right-3 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="h-7 w-7 rounded-full gradient-cta flex items-center justify-center text-xs font-bold text-white">
            {story.authorHandle.charAt(0).toUpperCase()}
          </div>
          <span className="text-xs font-medium text-white/90 drop-shadow">
            @{story.authorHandle}
          </span>
        </div>
        <span className="rounded-full bg-white/15 backdrop-blur-sm px-2 py-0.5 text-xs text-white">
          {config.emoji} {config.label}
        </span>
      </div>

      {/* Bottom content */}
      <div className="absolute bottom-0 left-0 right-0 p-4">
        <p className="text-sm font-bold text-white line-clamp-2 mb-3 drop-shadow-lg">
          {story.title}
        </p>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <button
              type="button"
              data-ocid={`trending.toggle.${index + 1}`}
              onClick={handleLike}
              disabled={likeMutation.isPending}
              className="flex items-center gap-1 rounded-full bg-white/15 backdrop-blur-sm px-2.5 py-1 text-xs text-white hover:bg-white/25 transition-colors"
            >
              <Heart className="h-3 w-3 fill-brand-pink text-brand-pink" />
              {localLikes.toString()}
            </button>
            <div className="flex items-center gap-1 text-xs text-white/70">
              <Eye className="h-3 w-3" />
              {story.shares.toString()}
            </div>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-xs text-white/50">{timeAgo()}</span>
            <button
              type="button"
              data-ocid={`trending.secondary_button.${index + 1}`}
              onClick={handleShare}
              className="flex h-7 w-7 items-center justify-center rounded-full bg-white/15 backdrop-blur-sm text-white hover:bg-white/25 transition-colors"
            >
              <Share2 className="h-3 w-3" />
            </button>
          </div>
        </div>
      </div>
    </motion.div>
  );
}
