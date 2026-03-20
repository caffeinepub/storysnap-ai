import type { StoryMode } from "../backend.d";

export type StoryModeKey =
  | "funny"
  | "emotional"
  | "bollywood"
  | "thriller"
  | "motivational";

export interface ModeConfig {
  key: StoryModeKey;
  label: string;
  emoji: string;
  tagline: string;
  gradient: string;
  bgImage: string;
  chipGradient: string;
  mode: StoryMode;
}

export const MODES: ModeConfig[] = [
  {
    key: "funny",
    label: "Funny",
    emoji: "😂",
    tagline: "Turn the chaos into comedy gold",
    gradient: "from-amber-500 via-orange-500 to-yellow-400",
    bgImage: "/assets/generated/story-bg-funny.dim_400x600.jpg",
    chipGradient: "linear-gradient(135deg, #F59E0B, #EF4444)",
    mode: { funny: null },
  },
  {
    key: "emotional",
    label: "Emotional",
    emoji: "💔",
    tagline: "Every unsent message, every blue tick",
    gradient: "from-blue-600 via-violet-600 to-purple-700",
    bgImage: "/assets/generated/story-bg-emotional.dim_400x600.jpg",
    chipGradient: "linear-gradient(135deg, #4F46E5, #8B5CF6)",
    mode: { emotional: null },
  },
  {
    key: "bollywood",
    label: "Bollywood",
    emoji: "🎬",
    tagline: "Filmy drama, masala aur thoda pyaar",
    gradient: "from-pink-500 via-rose-500 to-orange-400",
    bgImage: "/assets/generated/story-bg-bollywood.dim_400x600.jpg",
    chipGradient: "linear-gradient(135deg, #EC4899, #F59E0B)",
    mode: { bollywood: null },
  },
  {
    key: "thriller",
    label: "Thriller",
    emoji: "🕵️",
    tagline: "Every text hides a darker truth",
    gradient: "from-slate-900 via-teal-900 to-green-950",
    bgImage: "/assets/generated/story-bg-thriller.dim_400x600.jpg",
    chipGradient: "linear-gradient(135deg, #0D9488, #1E293B)",
    mode: { thriller: null },
  },
  {
    key: "motivational",
    label: "Motivational",
    emoji: "🔥",
    tagline: "One message changed everything",
    gradient: "from-red-600 via-orange-500 to-amber-400",
    bgImage: "/assets/generated/story-bg-motivational.dim_400x600.jpg",
    chipGradient: "linear-gradient(135deg, #EF4444, #F59E0B)",
    mode: { motivational: null },
  },
];

export const STORY_TEMPLATES: Record<
  StoryModeKey,
  { titles: string[]; texts: string[] }
> = {
  funny: {
    titles: [
      "The Great Pizza Misunderstanding",
      "How One Typo Ended a Friendship (Not Really)",
      "The Group Chat That Summoned Everyone",
    ],
    texts: [
      `It started, as all great disasters do, with autocorrect.\n\nRaj sent "Let's meet at 7" to the family group. Simple enough. Except autocorrect had other plans — what they received was "Let's MEAT at 7", followed immediately by a string of panicked messages debating whether Raj had finally lost it, started a barbecue cult, or was proposing some kind of midnight ritualistic gathering.\n\nMaa forwarded it to the relatives group. Chacha called. Bua showed up with a tiffin box.\n\nBy 7 PM, seventeen people were standing outside Raj's apartment, three dhabas had been called for catering, and someone had already made a WhatsApp status: "Family meat at Raj's place. Don't ask questions."\n\nRaj opened the door in pajamas, holding a half-eaten sandwich, absolutely horrified.\n\n"I meant MEET. I was literally just asking Priya if she wanted to watch Netflix."\n\nPriya, who had been in the group the whole time, had simply reacted with 👀 and watched the chaos unfold with ceremonial popcorn.\n\nThree hours later, with half a biryani consumed and Chacha demanding someone explain Instagram Reels, Raj quietly texted Priya: "Worth it."\n\nShe sent back: 😂😂😂\n\nMade with StorySnap AI`,
    ],
  },
  emotional: {
    titles: [
      "Two Blue Ticks and Silence",
      "The Message I Never Sent",
      "Read at 11:47 PM",
    ],
    texts: [
      `There are 47 unsent messages sitting in her drafts folder.\n\nShe knows because she counted them once, at 2 AM, when sleep felt like a country she'd been denied a visa to. Each one written, rewritten, and finally abandoned — because what do you say to someone who made you feel everything, and then chose nothing?\n\nThe conversation still sits there. Two blue ticks under every message she finally did send. He read them. He just never found the words to come back.\n\nOr maybe he found too many words. Maybe he, too, has a drafts folder.\n\nShe'll never know. That's the part that stays.\n\nNot the silence itself — she'd learned to live inside silence. It was the in-between. The three dots that appeared once at midnight and then disappeared without a message. The read receipt that proved someone was on the other side, breathing, thinking, choosing to let it go dark again.\n\nShe deleted his contact three times. Added it back twice.\n\nThe last message in the thread, still unreplied, still glowing faintly on her screen:\n\n"I just wanted to say I'm proud of you."\n\nRead at 11:47 PM.\n\nMade with StorySnap AI`,
    ],
  },
  bollywood: {
    titles: [
      "Good Morning, Jaanu: A Love Story",
      "Ek Message Ki Kahani",
      "The 8 AM Signal",
    ],
    texts: [
      `SCENE ONE: The Setup\n\nKabir sends "good morning" every day at 8:03 AM. Has done so for 247 days.\nAisha replies every day at 8:04 AM. Has done so for 247 days.\nNeither has mentioned it. Neither will.\n\nSCENE TWO: The Twist\n\nOn day 248, Kabir's alarm doesn't go off. He wakes at 8:06 AM in a cold sweat.\n"Good morning!!" — Aisha, 8:04 AM.\nKabir stares at his phone. She texted FIRST.\nIs this love? Is this fate? Is this the universe screaming "BAAT KAR USSE"?\n\nSCENE THREE: The Interval\n\nHis best friend Siddharth, who has heard approximately 247 morning updates, grabs his collar:\n"Ek message bhej. Bas ek. 'Tujhe dekhna chahta hoon.' That's it. Interval."\n\nSCENE FOUR: The Send\n\nKabir types. Deletes. Types again. Breathes like a man about to defuse a bomb.\nHits send.\n\nThree dots appear immediately.\n\n"Main bhi."\n\nBackground score: violin, tabla, and the soft chaos of two hearts finally syncing up.\n\nEND CREDITS roll over 247 good-morning screenshots in a digital photo album.\n\nMade with StorySnap AI`,
    ],
  },
  thriller: {
    titles: [
      "The Coded Messages",
      "They Were Never Just Texting",
      "Signal in the Static",
    ],
    texts: [
      `I wasn't supposed to find the screenshots.\n\nBut once I started reading them — really reading them — I couldn't unsee it.\n\n"Can we meet tonight?" — timestamp 11:12 PM. Three days before the incident.\n"Same place as last time" — no address. Never an address.\n"Don't tell anyone" — always this line. Always.\n\nThe investigators had dismissed it as a casual conversation. Friendly. Innocuous.\n\nThey didn't notice what I noticed: the first letter of every third message. P. A. R. K. W. A. Y.\n\nParkway. The abandoned lot on Parkway Drive that flooded in February.\n\nI enlarged the last message, timestamp 2:47 AM — sent seven minutes before the blackout that knocked out power to the entire east district.\n\n"See you on the other side 😊"\n\nMy hands were shaking. My screen cast a pale glow across the dark room.\n\nBehind me, a floorboard creaked.\n\nI hadn't heard the front door open.\n\nI hadn't heard anyone come in.\n\nSlowly, I turned my phone face-down — and turned around.\n\n[To be continued...]\n\nMade with StorySnap AI`,
    ],
  },
  motivational: {
    titles: [
      "The 3 AM Message That Changed Everything",
      "What You Almost Didn't Send",
      "Reply. It Matters.",
    ],
    texts: [
      `It was 3:12 AM when she typed it.\n\nNot to anyone in particular — just to a name she'd been meaning to check in on for weeks. A simple, stupid, honest message:\n\n"Hey. I know it's late. I just wanted to say I see you, and I think you're doing better than you think you are."\n\nShe almost deleted it.\nThe voice in her head said it was weird. Too much. Too random. You'll make it awkward.\n\nShe hit send anyway.\n\nThree hours later, at 6 AM, a reply appeared:\n\n"I was about to make a really bad decision tonight. Your message came through at exactly the right moment. Thank you for not talking yourself out of sending it."\n\nShe read it five times. Six. She sat with it for a long time.\n\nWe spend so much energy calculating the risk of reaching out — what if it's weird, what if they don't reply, what if I'm overstepping?\n\nWe forget to calculate the other risk: what if they needed to hear it, and no one said it?\n\nThe text you're scared to send might be the exact one someone is waiting for.\n\nSend it.\n\nMade with StorySnap AI`,
    ],
  },
};

export function getModeConfig(key: StoryModeKey): ModeConfig {
  return MODES.find((m) => m.key === key) ?? MODES[0];
}

export function getRandomStory(key: StoryModeKey): {
  title: string;
  text: string;
} {
  const template = STORY_TEMPLATES[key];
  const idx = Math.floor(Math.random() * template.titles.length);
  return { title: template.titles[idx], text: template.texts[0] };
}

export function getModeFromStory(story: { mode: StoryMode }): StoryModeKey {
  const mode = story.mode;
  if ("funny" in mode) return "funny";
  if ("emotional" in mode) return "emotional";
  if ("bollywood" in mode) return "bollywood";
  if ("thriller" in mode) return "thriller";
  if ("motivational" in mode) return "motivational";
  return "funny";
}
