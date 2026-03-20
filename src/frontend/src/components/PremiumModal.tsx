import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Check, Crown, Zap } from "lucide-react";
import { toast } from "sonner";
import { useSetPremium } from "../hooks/useQueries";

interface PremiumModalProps {
  open: boolean;
  onClose: () => void;
}

const FEATURES_FREE = [
  "3 stories per day",
  "All 5 story modes",
  "Basic sharing",
];

const FEATURES_PREMIUM = [
  "Unlimited story generation",
  "HD export quality",
  "No watermark",
  "Priority AI processing",
  "Voice narration",
  "Exclusive templates",
];

export default function PremiumModal({ open, onClose }: PremiumModalProps) {
  const setPremiumMutation = useSetPremium();

  const handleUpgrade = async () => {
    await setPremiumMutation.mutateAsync(true);
    toast.success("🎉 Premium activated! Enjoy unlimited stories.");
    onClose();
  };

  return (
    <Dialog open={open} onOpenChange={(o) => !o && onClose()}>
      <DialogContent
        data-ocid="premium.dialog"
        className="max-w-md border-border/50 bg-card p-0 overflow-hidden"
      >
        {/* Gradient header */}
        <div className="gradient-cta px-6 py-8 text-center">
          <Crown className="mx-auto mb-3 h-10 w-10 text-white" />
          <DialogHeader>
            <DialogTitle className="text-2xl font-bold text-white">
              Upgrade to Premium
            </DialogTitle>
          </DialogHeader>
          <p className="mt-1 text-sm text-white/80">
            Unlock the full StorySnap AI experience
          </p>
        </div>

        <div className="p-6 space-y-6">
          <div className="grid grid-cols-2 gap-4">
            {/* Free */}
            <div className="rounded-xl border border-border/60 bg-muted/30 p-4">
              <p className="mb-3 text-sm font-semibold text-muted-foreground">
                Free
              </p>
              <ul className="space-y-2">
                {FEATURES_FREE.map((f) => (
                  <li
                    key={f}
                    className="flex items-start gap-2 text-xs text-muted-foreground"
                  >
                    <Check className="mt-0.5 h-3 w-3 shrink-0 text-muted-foreground" />
                    {f}
                  </li>
                ))}
              </ul>
            </div>

            {/* Premium */}
            <div className="rounded-xl border border-brand-purple/40 bg-brand-purple/10 p-4">
              <p className="mb-3 text-sm font-semibold text-brand-purple">
                Premium
              </p>
              <ul className="space-y-2">
                {FEATURES_PREMIUM.map((f) => (
                  <li
                    key={f}
                    className="flex items-start gap-2 text-xs text-foreground"
                  >
                    <Check className="mt-0.5 h-3 w-3 shrink-0 text-brand-purple" />
                    {f}
                  </li>
                ))}
              </ul>
            </div>
          </div>

          {/* Price */}
          <div className="text-center">
            <p className="text-3xl font-bold">
              $9.99{" "}
              <span className="text-sm font-normal text-muted-foreground">
                /month
              </span>
            </p>
            <p className="mt-1 text-xs text-muted-foreground">Cancel anytime</p>
          </div>

          <Button
            data-ocid="premium.primary_button"
            className="w-full gradient-cta border-0 text-white hover:opacity-90 h-11"
            onClick={handleUpgrade}
            disabled={setPremiumMutation.isPending}
          >
            <Zap className="mr-2 h-4 w-4" />
            {setPremiumMutation.isPending ? "Activating..." : "Upgrade Now"}
          </Button>

          <button
            type="button"
            data-ocid="premium.cancel_button"
            onClick={onClose}
            className="w-full text-center text-xs text-muted-foreground hover:text-foreground transition-colors py-1"
          >
            Maybe later
          </button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
