import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import type { Story, StoryMode, UserQuota } from "../lib/actorTypes";
import { asAppBackend } from "../lib/actorTypes";
import { useActor } from "./useActor";

export function useTrendingStories(limit = 12n) {
  const { actor, isFetching } = useActor();
  const backend = asAppBackend(actor);
  return useQuery<Story[]>({
    queryKey: ["trending", limit.toString()],
    queryFn: async () => {
      if (!backend) return [];
      return backend.getTrendingStories(limit);
    },
    enabled: !!backend && !isFetching,
    staleTime: 30_000,
  });
}

export function useStory(id: string) {
  const { actor, isFetching } = useActor();
  const backend = asAppBackend(actor);
  return useQuery({
    queryKey: ["story", id],
    queryFn: async () => {
      if (!backend) return null;
      const result = await backend.getStory(id);
      if (result.__kind__ === "Some") return result.value;
      return null;
    },
    enabled: !!backend && !isFetching && !!id,
  });
}

export function useUserQuota() {
  const { actor, isFetching } = useActor();
  const backend = asAppBackend(actor);
  return useQuery<UserQuota>({
    queryKey: ["quota"],
    queryFn: async () => {
      if (!backend)
        return { dailyCount: 0n, isPremium: false, canCreate: true };
      return backend.getUserQuota();
    },
    enabled: !!backend && !isFetching,
  });
}

export function useCreateStory() {
  const { actor } = useActor();
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({
      title,
      storyText,
      mode,
      authorHandle,
      isPublic,
    }: {
      title: string;
      storyText: string;
      mode: StoryMode;
      authorHandle: string;
      isPublic: boolean;
    }) => {
      const backend = asAppBackend(actor);
      if (!backend) throw new Error("Not connected");
      const result = await backend.createStory(
        title,
        storyText,
        mode,
        authorHandle,
        isPublic,
      );
      if ("err" in result) throw new Error(result.err);
      return result.ok;
    },
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: ["trending"] });
      void queryClient.invalidateQueries({ queryKey: ["quota"] });
    },
  });
}

export function useLikeStory() {
  const { actor } = useActor();
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (id: string) => {
      const backend = asAppBackend(actor);
      if (!backend) throw new Error("Not connected");
      return backend.likeStory(id);
    },
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: ["trending"] });
    },
  });
}

export function useShareStory() {
  const { actor } = useActor();
  return useMutation({
    mutationFn: async (id: string) => {
      const backend = asAppBackend(actor);
      if (!backend) throw new Error("Not connected");
      return backend.shareStory(id);
    },
  });
}

export function useSetPremium() {
  const { actor } = useActor();
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (premium: boolean) => {
      const backend = asAppBackend(actor);
      if (!backend) throw new Error("Not connected");
      return backend.setPremium(premium);
    },
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: ["quota"] });
    },
  });
}
