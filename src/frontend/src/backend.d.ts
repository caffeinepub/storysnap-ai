import type { Principal } from "@icp-sdk/core/principal";
export interface Some<T> {
    __kind__: "Some";
    value: T;
}
export interface None {
    __kind__: "None";
}
export type Option<T> = Some<T> | None;

export type StoryMode = { funny: null } | { emotional: null } | { bollywood: null } | { thriller: null } | { motivational: null };

export interface Story {
    id: string;
    title: string;
    storyText: string;
    mode: StoryMode;
    authorHandle: string;
    authorId: string;
    likes: bigint;
    shares: bigint;
    createdAt: bigint;
    isPublic: boolean;
}

export interface UserQuota {
    dailyCount: bigint;
    isPremium: boolean;
    canCreate: boolean;
}

export type CreateStoryResult = { ok: Story } | { err: string };

export interface backendInterface {
    _initializeAccessControlWithSecret(secret: string): Promise<void>;
    initSeed(): Promise<void>;
    getTrendingStories(limit: bigint): Promise<Story[]>;
    getStory(id: string): Promise<Option<Story>>;
    createStory(title: string, storyText: string, mode: StoryMode, authorHandle: string, isPublic: boolean): Promise<CreateStoryResult>;
    likeStory(id: string): Promise<boolean>;
    shareStory(id: string): Promise<boolean>;
    getUserQuota(): Promise<UserQuota>;
    setPremium(premium: boolean): Promise<void>;
}
