# StorySnap AI

## Current State
New project — no existing application files.

## Requested Changes (Diff)

### Add
- Full StorySnap AI app: upload chat screenshots, select a story mode, generate a cinematic story output
- Story modes: Funny, Emotional, Bollywood, Dark/Thriller, Motivational
- Template-based story generation (simulated AI pipeline) with randomized cinematic outputs per mode
- Story output view: slide-style card with story text, background gradient/image, watermark "Made with StorySnap AI"
- Voice narration using browser Web Speech API (male/female toggle)
- Trending stories feed on home page with real stored community stories
- Leaderboard / most viral stories sorted by share count
- Sharing system: copy link, share to WhatsApp/X/Instagram with watermark branding
- Daily story limit for guest/free users (3/day), tracked in backend
- Stripe-powered premium upgrade UI (placeholder, not live checkout)
- Authorization (login/guest mode)
- Blob storage for uploaded screenshots (auto-deleted after story generation)
- Dark/light mode toggle
- Mobile-responsive layout
- Privacy notice (GDPR-style)

### Modify
N/A — new project

### Remove
N/A — new project

## Implementation Plan
1. Backend (Motoko):
   - User profiles with daily story count and premium flag
   - Story records: id, title, mode, storyText, authorHandle, likes, shares, createdAt
   - APIs: createStory, getStory, listTrendingStories, likeStory, incrementShareCount, getUserQuota
   - Blob storage for screenshot uploads
   - Authorization integration for identity

2. Frontend:
   - Landing/home page: hero upload CTA, category chips, trending stories grid
   - Upload flow: drag & drop + mobile file picker, screenshot preview
   - Story mode selector (5 modes with emoji)
   - Processing screen (animated, simulates OCR + AI pipeline)
   - Story output: full-screen cinematic card with text, background, watermark
   - Voice narration toggle (Web Speech API)
   - Share sheet: WhatsApp, X, copy link
   - Trending feed page
   - Auth modal (login/guest)
   - Premium upgrade modal (Stripe UI placeholder)
   - Dark/light mode
