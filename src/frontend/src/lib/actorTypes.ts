// Re-export backend types with cast helper
// The generated backend.ts has an empty interface; the actual methods
// are defined in backend.d.ts. We cast here to bridge the gap.
import type { backendInterface as GeneratedBackend } from "../backend";
import type {
  CreateStoryResult,
  Option,
  Story,
  StoryMode,
  UserQuota,
} from "../backend.d";

export type { Story, StoryMode, UserQuota, CreateStoryResult, Option };

export interface AppBackend extends GeneratedBackend {
  initSeed(): Promise<void>;
  getTrendingStories(limit: bigint): Promise<Story[]>;
  getStory(id: string): Promise<Option<Story>>;
  createStory(
    title: string,
    storyText: string,
    mode: StoryMode,
    authorHandle: string,
    isPublic: boolean,
  ): Promise<CreateStoryResult>;
  likeStory(id: string): Promise<boolean>;
  shareStory(id: string): Promise<boolean>;
  getUserQuota(): Promise<UserQuota>;
  setPremium(premium: boolean): Promise<void>;
}

export function asAppBackend(
  actor: GeneratedBackend | null,
): AppBackend | null {
  return actor as unknown as AppBackend | null;
}
