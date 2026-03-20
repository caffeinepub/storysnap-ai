import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import {
  Check,
  ChevronLeft,
  Copy,
  Loader2,
  RefreshCw,
  Share2,
  Upload,
  Volume2,
  VolumeX,
} from "lucide-react";
import { AnimatePresence, motion } from "motion/react";
import { useRef, useState } from "react";
import { toast } from "sonner";
import type { AppRoute } from "../App";
import Footer from "../components/Footer";
import Navbar from "../components/Navbar";
import PremiumModal from "../components/PremiumModal";
import { useCreateStory, useUserQuota } from "../hooks/useQueries";
import {
  MODES,
  type StoryModeKey,
  getModeConfig,
  getRandomStory,
} from "../lib/storyTemplates";

type Step = 1 | 2 | 3 | 4;

const PROCESSING_STEPS = [
  { label: "Reading chat...", emoji: "📱" },
  { label: "Detecting tone...", emoji: "🧠" },
  { label: "Crafting your story...", emoji: "✍️" },
  { label: "Adding cinematic touch...", emoji: "🎬" },
];

interface CreatorPageProps {
  onNavigate: (route: AppRoute) => void;
}

export default function CreatorPage({ onNavigate }: CreatorPageProps) {
  const [step, setStep] = useState<Step>(1);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [selectedMode, setSelectedMode] = useState<StoryModeKey | null>(null);
  const [processingStep, setProcessingStep] = useState(0);
  const [generatedStory, setGeneratedStory] = useState<{
    title: string;
    text: string;
  } | null>(null);
  const [authorHandle, setAuthorHandle] = useState("");
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [voicePitch, setVoicePitch] = useState<"female" | "male">("female");
  const [premiumOpen, setPremiumOpen] = useState(false);
  const [isDragging, setIsDragging] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const createStoryMutation = useCreateStory();
  const { data: quota } = useUserQuota();

  const handleFile = (file: File) => {
    if (!file.type.match(/image\/(jpeg|png)/)) {
      toast.error("Please upload a JPG or PNG image");
      return;
    }
    const reader = new FileReader();
    reader.onload = (e) => setImagePreview(e.target?.result as string);
    reader.readAsDataURL(file);
    setStep(2);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    const file = e.dataTransfer.files[0];
    if (file) handleFile(file);
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = () => setIsDragging(false);

  const handleFileInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) handleFile(file);
  };

  const handleGenerate = async () => {
    if (!selectedMode) return;
    if (quota && !quota.canCreate && !quota.isPremium) {
      setPremiumOpen(true);
      return;
    }
    setStep(3);
    setProcessingStep(0);
    // Simulate processing
    for (let i = 0; i < PROCESSING_STEPS.length; i++) {
      await new Promise((r) => setTimeout(r, 800));
      setProcessingStep(i + 1);
    }
    const story = getRandomStory(selectedMode);
    setGeneratedStory(story);
    setStep(4);
  };

  const handleVoice = () => {
    if (!generatedStory) return;
    if (isSpeaking) {
      window.speechSynthesis.cancel();
      setIsSpeaking(false);
      return;
    }
    const utter = new SpeechSynthesisUtterance(
      `${generatedStory.title}. ${generatedStory.text}`,
    );
    utter.pitch = voicePitch === "female" ? 1.4 : 0.7;
    utter.rate = 0.95;
    utter.onend = () => setIsSpeaking(false);
    setIsSpeaking(true);
    window.speechSynthesis.speak(utter);
  };

  const handleSaveToTrending = async () => {
    if (!generatedStory || !selectedMode) return;
    const handle = authorHandle.trim() || "anonymous";
    const config = getModeConfig(selectedMode);
    try {
      await createStoryMutation.mutateAsync({
        title: generatedStory.title,
        storyText: generatedStory.text,
        mode: config.mode,
        authorHandle: handle,
        isPublic: true,
      });
      toast.success("📖 Story saved to Trending!");
    } catch {
      toast.error("Failed to save story");
    }
  };

  const handleShare = async (platform: "whatsapp" | "x" | "copy") => {
    const text = "Check out my cinematic story made with StorySnap AI! 🎬✨";
    if (platform === "whatsapp") {
      window.open(
        `https://wa.me/?text=${encodeURIComponent(`${text} ${window.location.href}`)}`,
        "_blank",
      );
    } else if (platform === "x") {
      window.open(
        `https://twitter.com/intent/tweet?text=${encodeURIComponent(text)}&url=${encodeURIComponent(window.location.href)}`,
        "_blank",
      );
    } else {
      await navigator.clipboard.writeText(`${text} ${window.location.href}`);
      toast.success("Copied to clipboard!");
    }
  };

  const handleGenerateAnother = () => {
    window.speechSynthesis.cancel();
    setIsSpeaking(false);
    setStep(1);
    setImagePreview(null);
    setSelectedMode(null);
    setGeneratedStory(null);
    setAuthorHandle("");
  };

  const modeConfig = selectedMode ? getModeConfig(selectedMode) : null;

  return (
    <div className="min-h-screen bg-background">
      <Navbar
        onNavigate={onNavigate}
        onPremiumClick={() => setPremiumOpen(true)}
      />
      <PremiumModal open={premiumOpen} onClose={() => setPremiumOpen(false)} />

      <main className="mx-auto max-w-2xl px-4 py-10">
        {/* Back button */}
        {step < 4 && (
          <button
            type="button"
            data-ocid="creator.button"
            onClick={() => {
              if (step === 1) onNavigate({ page: "home" });
              else setStep((s) => (s - 1) as Step);
            }}
            className="mb-6 flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground transition-colors"
          >
            <ChevronLeft className="h-4 w-4" /> Back
          </button>
        )}

        {/* Step indicator */}
        {step < 4 && (
          <div className="mb-8 flex items-center gap-3">
            {[1, 2, 3].map((s) => (
              <div key={s} className="flex items-center gap-3">
                <div
                  className={`flex h-7 w-7 items-center justify-center rounded-full text-xs font-bold transition-all ${
                    step > s
                      ? "gradient-cta text-white"
                      : step === s
                        ? "border-2 border-brand-purple text-brand-purple"
                        : "border border-border/60 text-muted-foreground"
                  }`}
                >
                  {step > s ? <Check className="h-3.5 w-3.5" /> : s}
                </div>
                {s < 3 && (
                  <div
                    className={`h-px w-8 transition-all ${
                      step > s ? "bg-brand-purple" : "bg-border/60"
                    }`}
                  />
                )}
              </div>
            ))}
            <span className="ml-2 text-xs text-muted-foreground">
              {step === 1 && "Upload Screenshot"}
              {step === 2 && "Choose Vibe"}
              {step === 3 && "AI Processing..."}
            </span>
          </div>
        )}

        <AnimatePresence mode="wait">
          {/* ── STEP 1: UPLOAD ── */}
          {step === 1 && (
            <motion.div
              key="step1"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              transition={{ duration: 0.3 }}
            >
              <h1 className="mb-2 text-2xl font-bold">
                Upload Your Chat Screenshot
              </h1>
              <p className="mb-8 text-sm text-muted-foreground">
                WhatsApp, Instagram, SMS, iMessage — any chat works!
              </p>

              <button
                type="button"
                data-ocid="creator.dropzone"
                onDrop={handleDrop}
                onDragOver={handleDragOver}
                onDragLeave={handleDragLeave}
                onClick={() => fileInputRef.current?.click()}
                className={`relative flex cursor-pointer flex-col items-center justify-center rounded-2xl border-2 border-dashed p-16 text-center transition-all ${
                  isDragging
                    ? "border-brand-purple bg-brand-purple/10"
                    : "border-border/60 hover:border-brand-purple/50 hover:bg-muted/30"
                }`}
              >
                <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-2xl gradient-cta">
                  <Upload className="h-7 w-7 text-white" />
                </div>
                <p className="text-base font-semibold">
                  {isDragging ? "Drop it here!" : "Drop Screenshot Here"}
                </p>
                <p className="mt-1 text-sm text-muted-foreground">
                  or click to browse
                </p>
                <p className="mt-3 text-xs text-muted-foreground">
                  JPG, PNG • Max 10MB
                </p>

                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/jpeg,image/png"
                  className="hidden"
                  onChange={handleFileInput}
                />
              </button>

              <Button
                data-ocid="creator.upload_button"
                className="mt-4 w-full gradient-cta border-0 text-white rounded-xl h-12 hover:opacity-90"
                onClick={() => fileInputRef.current?.click()}
              >
                <Upload className="mr-2 h-4 w-4" /> Choose File
              </Button>
            </motion.div>
          )}

          {/* ── STEP 2: CHOOSE MODE ── */}
          {step === 2 && (
            <motion.div
              key="step2"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              transition={{ duration: 0.3 }}
            >
              <h1 className="mb-2 text-2xl font-bold">
                Choose Your Story Vibe
              </h1>
              <p className="mb-6 text-sm text-muted-foreground">
                How should AI transform your chat?
              </p>

              {/* Preview thumbnail */}
              {imagePreview && (
                <div className="mb-6 flex items-center gap-3 rounded-xl border border-border/60 bg-muted/30 p-3">
                  <img
                    src={imagePreview}
                    alt="Uploaded screenshot"
                    className="h-14 w-14 rounded-lg object-cover"
                  />
                  <div>
                    <p className="text-sm font-medium">Screenshot uploaded ✓</p>
                    <p className="text-xs text-muted-foreground">
                      Ready for AI processing
                    </p>
                  </div>
                </div>
              )}

              <div
                data-ocid="creator.section"
                className="grid grid-cols-1 gap-3 sm:grid-cols-2"
              >
                {MODES.map((mode) => (
                  <button
                    type="button"
                    key={mode.key}
                    data-ocid="creator.toggle"
                    onClick={() => setSelectedMode(mode.key)}
                    className={`flex items-start gap-4 rounded-xl border p-4 text-left transition-all hover:scale-[1.01] ${
                      selectedMode === mode.key
                        ? "border-brand-purple bg-brand-purple/10"
                        : "border-border/60 bg-muted/20 hover:border-border"
                    }`}
                  >
                    <span className="text-3xl">{mode.emoji}</span>
                    <div>
                      <p className="font-semibold">{mode.label}</p>
                      <p className="mt-0.5 text-xs text-muted-foreground">
                        {mode.tagline}
                      </p>
                    </div>
                    {selectedMode === mode.key && (
                      <Check className="ml-auto h-4 w-4 shrink-0 text-brand-purple" />
                    )}
                  </button>
                ))}
              </div>

              <Button
                data-ocid="creator.primary_button"
                className="mt-6 w-full gradient-cta border-0 text-white rounded-xl h-12 hover:opacity-90 disabled:opacity-50"
                disabled={!selectedMode}
                onClick={handleGenerate}
              >
                Generate My Story ✨
              </Button>
            </motion.div>
          )}

          {/* ── STEP 3: PROCESSING ── */}
          {step === 3 && (
            <motion.div
              key="step3"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              transition={{ duration: 0.4 }}
              className="flex flex-col items-center py-16 text-center"
              data-ocid="creator.loading_state"
            >
              <div className="relative mb-8">
                <div className="h-24 w-24 rounded-full gradient-cta flex items-center justify-center shadow-glow">
                  <Loader2 className="h-10 w-10 text-white animate-spin" />
                </div>
                <div className="absolute inset-0 rounded-full gradient-cta opacity-30 blur-xl" />
              </div>

              <h2 className="text-2xl font-bold mb-2">
                AI is weaving your story...
              </h2>
              <p className="text-sm text-muted-foreground mb-10">
                Sit tight, cinematic magic takes a moment
              </p>

              <div className="w-full max-w-xs space-y-3">
                {PROCESSING_STEPS.map((ps) => (
                  <motion.div
                    key={ps.label}
                    initial={{ opacity: 0, x: -10 }}
                    animate={{
                      opacity:
                        processingStep > PROCESSING_STEPS.indexOf(ps) ? 1 : 0.3,
                      x: 0,
                    }}
                    transition={{ delay: PROCESSING_STEPS.indexOf(ps) * 0.1 }}
                    className="flex items-center gap-3 rounded-xl bg-muted/30 px-4 py-3"
                  >
                    <span className="text-lg">{ps.emoji}</span>
                    <span
                      className={`text-sm ${
                        processingStep > PROCESSING_STEPS.indexOf(ps)
                          ? "text-foreground font-medium"
                          : "text-muted-foreground"
                      }`}
                    >
                      {ps.label}
                    </span>
                    {processingStep > PROCESSING_STEPS.indexOf(ps) && (
                      <Check className="ml-auto h-4 w-4 text-brand-cyan" />
                    )}
                  </motion.div>
                ))}
              </div>
            </motion.div>
          )}

          {/* ── STEP 4: STORY OUTPUT ── */}
          {step === 4 && generatedStory && selectedMode && modeConfig && (
            <motion.div
              key="step4"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              data-ocid="creator.card"
            >
              {/* Story Card */}
              <div
                className="relative overflow-hidden rounded-3xl"
                style={{ minHeight: "480px" }}
              >
                <img
                  src={modeConfig.bgImage}
                  alt="Story background"
                  className="absolute inset-0 h-full w-full object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/95 via-black/60 to-black/30" />

                <div className="relative p-8">
                  {/* Mode badge */}
                  <span
                    className="inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-xs font-semibold text-white"
                    style={{ background: modeConfig.chipGradient }}
                  >
                    {modeConfig.emoji} {modeConfig.label}
                  </span>

                  <h2 className="mt-4 text-2xl font-black text-white leading-tight">
                    {generatedStory.title}
                  </h2>

                  <div className="mt-4 max-h-64 overflow-y-auto pr-1">
                    <p className="text-sm text-white/85 leading-relaxed whitespace-pre-line">
                      {generatedStory.text}
                    </p>
                  </div>

                  {/* Watermark */}
                  <p className="mt-6 text-xs text-white/40 text-center">
                    Made with StorySnap AI ✨
                  </p>
                </div>
              </div>

              {/* Controls */}
              <div className="mt-6 space-y-4">
                {/* Author handle */}
                <div>
                  <Label htmlFor="handle" className="text-sm mb-1.5 block">
                    Your handle (optional)
                  </Label>
                  <Input
                    data-ocid="creator.input"
                    id="handle"
                    placeholder="@yourname"
                    value={authorHandle}
                    onChange={(e) => setAuthorHandle(e.target.value)}
                    className="rounded-xl"
                  />
                </div>

                {/* Voice narration */}
                <div className="flex items-center justify-between rounded-xl border border-border/60 bg-muted/30 p-4">
                  <div className="flex items-center gap-3">
                    {isSpeaking ? (
                      <Volume2 className="h-5 w-5 text-brand-cyan animate-pulse" />
                    ) : (
                      <VolumeX className="h-5 w-5 text-muted-foreground" />
                    )}
                    <div>
                      <p className="text-sm font-medium">Voice Narration</p>
                      <p className="text-xs text-muted-foreground">
                        AI reads your story aloud
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <span className="text-xs text-muted-foreground">
                      {voicePitch === "female" ? "♀ Female" : "♂ Male"}
                    </span>
                    <Switch
                      data-ocid="creator.switch"
                      checked={voicePitch === "male"}
                      onCheckedChange={(v) =>
                        setVoicePitch(v ? "male" : "female")
                      }
                    />
                    <Button
                      data-ocid="creator.toggle"
                      variant="outline"
                      size="sm"
                      className="rounded-full"
                      onClick={handleVoice}
                    >
                      {isSpeaking ? "Stop" : "Play"}
                    </Button>
                  </div>
                </div>

                {/* Share buttons */}
                <div>
                  <p className="text-sm font-medium mb-3">Share your story</p>
                  <div className="flex gap-2">
                    <Button
                      data-ocid="creator.secondary_button"
                      variant="outline"
                      size="sm"
                      className="flex-1 rounded-xl gap-2 text-xs"
                      onClick={() => handleShare("whatsapp")}
                    >
                      💬 WhatsApp
                    </Button>
                    <Button
                      data-ocid="creator.secondary_button"
                      variant="outline"
                      size="sm"
                      className="flex-1 rounded-xl gap-2 text-xs"
                      onClick={() => handleShare("x")}
                    >
                      𝕏 Twitter
                    </Button>
                    <Button
                      data-ocid="creator.button"
                      variant="outline"
                      size="sm"
                      className="rounded-xl"
                      onClick={() => handleShare("copy")}
                    >
                      <Copy className="h-4 w-4" />
                    </Button>
                  </div>
                </div>

                {/* Save + Generate again */}
                <div className="flex gap-3">
                  <Button
                    data-ocid="creator.save_button"
                    className="flex-1 gradient-cta border-0 text-white rounded-xl h-12 hover:opacity-90"
                    onClick={handleSaveToTrending}
                    disabled={createStoryMutation.isPending}
                  >
                    {createStoryMutation.isPending ? (
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    ) : null}
                    {createStoryMutation.isPending
                      ? "Saving..."
                      : "Save to Trending 🔥"}
                  </Button>
                  <Button
                    data-ocid="creator.secondary_button"
                    variant="outline"
                    size="icon"
                    className="rounded-xl h-12 w-12"
                    onClick={handleGenerateAnother}
                  >
                    <RefreshCw className="h-4 w-4" />
                  </Button>
                </div>

                {createStoryMutation.isSuccess && (
                  <motion.p
                    data-ocid="creator.success_state"
                    initial={{ opacity: 0, y: 4 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="text-center text-sm text-brand-cyan"
                  >
                    ✓ Story saved! Check it in Trending.
                  </motion.p>
                )}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </main>

      <Footer />
    </div>
  );
}
