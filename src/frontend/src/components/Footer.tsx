import { Zap } from "lucide-react";
import { SiInstagram, SiX, SiYoutube } from "react-icons/si";
import { SiTiktok } from "react-icons/si";

export default function Footer() {
  const year = new Date().getFullYear();
  const utm = `utm_source=caffeine-footer&utm_medium=referral&utm_content=${encodeURIComponent(window.location.hostname)}`;

  return (
    <footer className="border-t border-border/50 bg-background/80 py-10">
      <div className="mx-auto max-w-[1200px] px-4">
        <div className="flex flex-col items-center gap-8 md:flex-row md:justify-between">
          {/* Brand */}
          <div className="flex items-center gap-2">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg gradient-cta">
              <Zap className="h-4 w-4 text-white" />
            </div>
            <span className="text-lg font-bold">
              <span className="text-gradient-purple-cyan">StorySnap</span>
              <span className="text-foreground"> AI</span>
            </span>
          </div>

          {/* Links */}
          <nav className="flex flex-wrap justify-center gap-x-6 gap-y-2">
            {["About", "Terms", "Privacy"].map((link) => (
              <a
                key={link}
                href="/"
                className="text-sm text-muted-foreground hover:text-foreground transition-colors"
              >
                {link}
              </a>
            ))}
          </nav>

          {/* Social */}
          <div className="flex items-center gap-4">
            {[
              { icon: SiInstagram, label: "Instagram" },
              { icon: SiTiktok, label: "TikTok" },
              { icon: SiX, label: "X" },
              { icon: SiYoutube, label: "YouTube" },
            ].map(({ icon: Icon, label }) => (
              <a
                key={label}
                href="/"
                aria-label={label}
                className="text-muted-foreground hover:text-foreground transition-colors"
              >
                <Icon className="h-4 w-4" />
              </a>
            ))}
          </div>
        </div>

        <div className="mt-8 text-center text-xs text-muted-foreground">
          © {year}. Built with ❤️ using{" "}
          <a
            href={`https://caffeine.ai?${utm}`}
            target="_blank"
            rel="noopener noreferrer"
            className="underline underline-offset-2 hover:text-foreground transition-colors"
          >
            caffeine.ai
          </a>
        </div>
      </div>
    </footer>
  );
}
