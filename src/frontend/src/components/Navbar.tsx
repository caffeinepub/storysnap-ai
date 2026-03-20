import { Button } from "@/components/ui/button";
import { Crown, LogOut, Moon, Sun, Zap } from "lucide-react";
import { useTheme } from "next-themes";
import type { AppRoute } from "../App";
import { useInternetIdentity } from "../hooks/useInternetIdentity";
import { useUserQuota } from "../hooks/useQueries";

interface NavbarProps {
  onNavigate: (route: AppRoute) => void;
  onPremiumClick: () => void;
}

export default function Navbar({ onNavigate, onPremiumClick }: NavbarProps) {
  const { theme, setTheme } = useTheme();
  const { identity, login, clear, isLoggingIn } = useInternetIdentity();
  const { data: quota } = useUserQuota();

  const isLoggedIn = !!identity;
  const principalShort = identity
    ? `${identity.getPrincipal().toString().slice(0, 8)}...`
    : null;

  return (
    <header className="sticky top-0 z-50 w-full border-b border-border/50 bg-background/80 backdrop-blur-xl">
      <div className="mx-auto flex max-w-[1200px] items-center justify-between px-4 py-3">
        {/* Logo */}
        <button
          type="button"
          data-ocid="nav.link"
          onClick={() => onNavigate({ page: "home" })}
          className="flex items-center gap-2 group"
        >
          <div className="flex h-8 w-8 items-center justify-center rounded-lg gradient-cta">
            <Zap className="h-4 w-4 text-white" />
          </div>
          <span className="text-lg font-bold tracking-tight">
            <span className="text-gradient-purple-cyan">StorySnap</span>
            <span className="text-foreground"> AI</span>
          </span>
        </button>

        {/* Nav links */}
        <nav className="hidden md:flex items-center gap-6">
          <button
            type="button"
            data-ocid="nav.link"
            onClick={() => onNavigate({ page: "home" })}
            className="text-sm text-muted-foreground hover:text-foreground transition-colors"
          >
            How it Works
          </button>
          <button
            type="button"
            data-ocid="nav.link"
            onClick={onPremiumClick}
            className="text-sm text-muted-foreground hover:text-foreground transition-colors"
          >
            Pricing
          </button>
          <button
            type="button"
            data-ocid="nav.link"
            onClick={() => onNavigate({ page: "home" })}
            className="text-sm text-muted-foreground hover:text-foreground transition-colors"
          >
            Explore
          </button>
        </nav>

        {/* Right side */}
        <div className="flex items-center gap-2">
          {/* Quota badge */}
          {isLoggedIn && quota && !quota.isPremium && (
            <button
              type="button"
              data-ocid="nav.toggle"
              onClick={onPremiumClick}
              className="hidden sm:flex items-center gap-1.5 rounded-full border border-brand-amber/30 bg-brand-amber/10 px-3 py-1 text-xs text-brand-amber hover:bg-brand-amber/20 transition-colors"
            >
              <Crown className="h-3 w-3" />
              {(3n - quota.dailyCount).toString()} left today
            </button>
          )}
          {isLoggedIn && quota?.isPremium && (
            <span className="hidden sm:flex items-center gap-1 rounded-full border border-brand-purple/30 bg-brand-purple/10 px-3 py-1 text-xs text-brand-purple">
              <Crown className="h-3 w-3" /> Premium
            </span>
          )}

          {/* Theme toggle */}
          <button
            type="button"
            data-ocid="nav.toggle"
            onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
            className="flex h-8 w-8 items-center justify-center rounded-full border border-border/60 bg-muted/50 text-muted-foreground hover:text-foreground hover:bg-muted transition-colors"
            aria-label="Toggle theme"
          >
            {theme === "dark" ? (
              <Sun className="h-4 w-4" />
            ) : (
              <Moon className="h-4 w-4" />
            )}
          </button>

          {/* Auth */}
          {isLoggedIn ? (
            <div className="flex items-center gap-2">
              <span className="hidden sm:block text-xs text-muted-foreground font-mono">
                {principalShort}
              </span>
              <Button
                data-ocid="nav.button"
                variant="ghost"
                size="sm"
                onClick={clear}
                className="h-8 gap-1.5 text-xs"
              >
                <LogOut className="h-3.5 w-3.5" />
                Sign Out
              </Button>
            </div>
          ) : (
            <div className="flex items-center gap-2">
              <Button
                data-ocid="nav.button"
                variant="ghost"
                size="sm"
                onClick={login}
                disabled={isLoggingIn}
                className="h-8 text-sm rounded-full border border-border/60"
              >
                {isLoggingIn ? "Signing in..." : "Sign In"}
              </Button>
              <Button
                data-ocid="nav.primary_button"
                size="sm"
                onClick={login}
                disabled={isLoggingIn}
                className="h-8 text-sm rounded-full gradient-cta text-white border-0 hover:opacity-90"
              >
                Sign Up
              </Button>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}
