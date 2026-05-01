import { useEffect, useState, useRef } from "react";
import { Link } from "react-router-dom";
import {
  Download,
  Star,
  Shield,
  Zap,
  BadgeCheck,
  ArrowLeft,
  Share,
  ChevronLeft,
  ChevronRight,
  CheckCircle2,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import logoImg from "@/assets/logo.png";

interface BeforeInstallPromptEvent extends Event {
  prompt: () => Promise<void>;
  userChoice: Promise<{ outcome: "accepted" | "dismissed" }>;
}

const screenshots = [
  {
    title: "AI Itinerary",
    desc: "Day-by-day plans tailored to you",
    gradient: "from-emerald-400 via-teal-500 to-cyan-500",
  },
  {
    title: "Smart Budgets",
    desc: "Auto-estimated in 20+ currencies",
    gradient: "from-green-400 via-emerald-500 to-teal-600",
  },
  {
    title: "Live Weather",
    desc: "Real-time forecasts on the go",
    gradient: "from-sky-400 via-blue-500 to-indigo-500",
  },
  {
    title: "Plan Bengal AI",
    desc: "Chat with your travel assistant",
    gradient: "from-violet-400 via-fuchsia-500 to-pink-500",
  },
];

const Install = () => {
  const [deferredPrompt, setDeferredPrompt] = useState<BeforeInstallPromptEvent | null>(null);
  const [installed, setInstalled] = useState(false);
  const [installing, setInstalling] = useState(false);
  const [progress, setProgress] = useState(0);
  const [slide, setSlide] = useState(0);
  const sliderRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const isStandalone =
      window.matchMedia("(display-mode: standalone)").matches ||
      // @ts-ignore
      window.navigator.standalone === true;
    if (isStandalone) setInstalled(true);

    const handler = (e: Event) => {
      e.preventDefault();
      setDeferredPrompt(e as BeforeInstallPromptEvent);
    };
    const installedHandler = () => {
      setInstalled(true);
      setInstalling(false);
      toast.success("Traveltics installed!");
    };
    window.addEventListener("beforeinstallprompt", handler);
    window.addEventListener("appinstalled", installedHandler);
    return () => {
      window.removeEventListener("beforeinstallprompt", handler);
      window.removeEventListener("appinstalled", installedHandler);
    };
  }, []);

  const runFakeInstall = async () => {
    setInstalling(true);
    setProgress(0);
    return new Promise<void>((resolve) => {
      const start = Date.now();
      const duration = 2200;
      const tick = () => {
        const elapsed = Date.now() - start;
        const pct = Math.min(100, (elapsed / duration) * 100);
        setProgress(pct);
        if (pct < 100) requestAnimationFrame(tick);
        else resolve();
      };
      requestAnimationFrame(tick);
    });
  };

  const handleInstall = async () => {
    await runFakeInstall();
    if (deferredPrompt) {
      try {
        await deferredPrompt.prompt();
        const { outcome } = await deferredPrompt.userChoice;
        if (outcome === "accepted") {
          setInstalled(true);
          toast.success("Installing Traveltics…");
          setTimeout(() => (window.location.href = "/?source=pwa"), 1200);
        } else {
          toast.info("Install cancelled");
        }
        setDeferredPrompt(null);
      } catch {
        toast.error("Install failed. Try again.");
      } finally {
        setInstalling(false);
      }
    } else {
      setInstalling(false);
      // iOS / unsupported fallback
      const isIOS = /iPad|iPhone|iPod/.test(navigator.userAgent);
      toast.info(
        isIOS
          ? "Tap the Share icon, then 'Add to Home Screen'"
          : "Open this page in Chrome and tap 'Add to Home Screen'"
      );
    }
  };

  const goSlide = (dir: number) => {
    const next = (slide + dir + screenshots.length) % screenshots.length;
    setSlide(next);
    sliderRef.current?.scrollTo({
      left: next * (sliderRef.current.clientWidth * 0.78),
      behavior: "smooth",
    });
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-emerald-50 via-white to-teal-50/50 pb-32">
      {/* Top bar */}
      <header className="sticky top-0 z-30 backdrop-blur-xl bg-white/70 border-b border-border/40">
        <div className="container max-w-2xl mx-auto px-4 h-14 flex items-center justify-between">
          <Link
            to="/"
            className="inline-flex items-center justify-center w-10 h-10 rounded-full hover:bg-secondary active:scale-95 transition"
            aria-label="Back"
          >
            <ArrowLeft className="w-5 h-5 text-foreground" />
          </Link>
          <span className="text-sm font-semibold text-foreground/80">Install App</span>
          <button
            onClick={() =>
              navigator.share?.({ title: "Traveltics", url: window.location.origin }) ||
              navigator.clipboard.writeText(window.location.origin).then(() => toast.success("Link copied"))
            }
            className="inline-flex items-center justify-center w-10 h-10 rounded-full hover:bg-secondary active:scale-95 transition"
            aria-label="Share"
          >
            <Share className="w-5 h-5 text-foreground" />
          </button>
        </div>
      </header>

      <main className="container max-w-2xl mx-auto px-4 pt-6 space-y-8">
        {/* Hero */}
        <section className="reveal flex items-center gap-4">
          <div className="relative">
            <div className="absolute inset-0 rounded-[28%] bg-primary/30 blur-2xl animate-pulse" />
            <div className="relative w-24 h-24 rounded-[28%] bg-white shadow-xl border border-white/60 p-2 flex items-center justify-center">
              <img src={logoImg} alt="Traveltics app icon" className="w-full h-full rounded-[22%] object-contain" />
            </div>
          </div>
          <div className="flex-1 min-w-0">
            <h1 className="text-2xl font-extrabold tracking-tight text-foreground truncate">
              Traveltics
            </h1>
            <p className="text-sm text-muted-foreground">AI Travel Planner • Cartory BD</p>
            <div className="mt-1.5 flex items-center gap-1.5 text-sm">
              <span className="font-semibold text-foreground">4.9</span>
              <div className="flex">
                {[0, 1, 2, 3, 4].map((i) => (
                  <Star key={i} className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
                ))}
              </div>
              <span className="text-muted-foreground">• 12K+</span>
            </div>
          </div>
        </section>

        {/* Stats row */}
        <section className="reveal reveal-d1 grid grid-cols-3 divide-x divide-border/60 rounded-2xl bg-white/70 backdrop-blur-xl border border-white/60 shadow-sm py-3">
          <div className="text-center px-2">
            <div className="text-base font-bold text-foreground">12 MB</div>
            <div className="text-[11px] uppercase tracking-wide text-muted-foreground">Size</div>
          </div>
          <div className="text-center px-2">
            <div className="text-base font-bold text-foreground">v1.0.4</div>
            <div className="text-[11px] uppercase tracking-wide text-muted-foreground">Version</div>
          </div>
          <div className="text-center px-2">
            <div className="text-base font-bold text-foreground">Today</div>
            <div className="text-[11px] uppercase tracking-wide text-muted-foreground">Updated</div>
          </div>
        </section>

        {/* Install button */}
        <section className="reveal reveal-d2 sticky-cta">
          <button
            onClick={handleInstall}
            disabled={installing || installed}
            className="group relative w-full h-14 rounded-2xl overflow-hidden font-bold text-white shadow-[0_15px_40px_-15px_hsl(var(--primary)/0.7)] active:scale-[0.98] transition disabled:opacity-90"
          >
            <span className="absolute inset-0 bg-gradient-to-r from-primary via-emerald-500 to-teal-500" />
            <span className="absolute inset-0 bg-gradient-to-r from-primary via-emerald-400 to-teal-500 opacity-0 group-hover:opacity-100 transition-opacity" />
            <span
              className="absolute inset-0 -inset-x-full bg-gradient-to-r from-transparent via-white/30 to-transparent animate-[shimmer_2.4s_linear_infinite]"
              style={{ animationPlayState: installing ? "paused" : "running" }}
            />
            {installing && (
              <span
                className="absolute left-0 top-0 bottom-0 bg-white/20 transition-[width] duration-100"
                style={{ width: `${progress}%` }}
              />
            )}
            <span className="relative flex items-center justify-center gap-2">
              {installed ? (
                <>
                  <CheckCircle2 className="w-5 h-5" /> Installed
                </>
              ) : installing ? (
                <>Installing… {Math.floor(progress)}%</>
              ) : (
                <>
                  <Download className="w-5 h-5" /> Install App
                </>
              )}
            </span>
          </button>
          <p className="mt-2 text-center text-xs text-muted-foreground">
            Free • No account required • Works offline-ready
          </p>
        </section>

        {/* Trust badges */}
        <section className="reveal reveal-d2 grid grid-cols-3 gap-3">
          {[
            { icon: Shield, label: "Secure", sub: "HTTPS" },
            { icon: Zap, label: "Fast", sub: "<1s load" },
            { icon: BadgeCheck, label: "Verified", sub: "Trusted" },
          ].map(({ icon: Icon, label, sub }) => (
            <div
              key={label}
              className="rounded-2xl bg-white/70 backdrop-blur-xl border border-white/60 px-3 py-3 text-center shadow-sm hover:shadow-md hover:-translate-y-0.5 active:scale-95 transition"
            >
              <Icon className="w-5 h-5 mx-auto text-primary" />
              <div className="mt-1 text-sm font-semibold text-foreground">{label}</div>
              <div className="text-[11px] text-muted-foreground">{sub}</div>
            </div>
          ))}
        </section>

        {/* Screenshots */}
        <section className="reveal reveal-d3">
          <div className="flex items-center justify-between mb-3 px-1">
            <h2 className="text-base font-bold text-foreground">Preview</h2>
            <div className="flex gap-1">
              <button
                onClick={() => goSlide(-1)}
                className="w-8 h-8 rounded-full bg-white/80 border border-border/60 flex items-center justify-center active:scale-90 transition"
                aria-label="Previous"
              >
                <ChevronLeft className="w-4 h-4" />
              </button>
              <button
                onClick={() => goSlide(1)}
                className="w-8 h-8 rounded-full bg-white/80 border border-border/60 flex items-center justify-center active:scale-90 transition"
                aria-label="Next"
              >
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          </div>

          <div
            ref={sliderRef}
            className="flex gap-3 overflow-x-auto snap-x snap-mandatory scrollbar-hide pb-2 -mx-4 px-4"
            style={{ scrollbarWidth: "none" }}
          >
            {screenshots.map((s, i) => (
              <div
                key={i}
                className="snap-start shrink-0 w-[78%] aspect-[9/16] rounded-3xl overflow-hidden border border-white/60 shadow-lg relative"
              >
                <div className={`absolute inset-0 bg-gradient-to-br ${s.gradient}`} />
                <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_20%,rgba(255,255,255,0.4),transparent_60%)]" />
                <div className="relative h-full flex flex-col justify-between p-5 text-white">
                  <div className="flex items-center gap-2">
                    <img src={logoImg} alt="" className="w-7 h-7 rounded-lg bg-white/30 p-0.5" />
                    <span className="text-xs font-semibold opacity-90">Traveltics</span>
                  </div>
                  <div>
                    <div className="text-2xl font-extrabold leading-tight drop-shadow">{s.title}</div>
                    <div className="text-sm opacity-90 mt-1">{s.desc}</div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* About */}
        <section className="reveal reveal-d4 rounded-2xl bg-white/70 backdrop-blur-xl border border-white/60 p-5 shadow-sm">
          <h2 className="text-base font-bold text-foreground mb-2">About this app</h2>
          <p className="text-sm text-muted-foreground leading-relaxed">
            Traveltics is your AI-powered travel companion. Plan trips to anywhere in the world with smart
            itineraries, real-time weather, multi-currency budgets, and a built-in chat assistant — all in one
            beautiful app.
          </p>
          <div className="mt-4 grid grid-cols-2 gap-x-4 gap-y-2 text-sm">
            <div className="flex justify-between">
              <span className="text-muted-foreground">Category</span>
              <span className="font-medium">Travel</span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">Developer</span>
              <span className="font-medium">Cartory BD</span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">Requires</span>
              <span className="font-medium">Modern browser</span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">Offered by</span>
              <span className="font-medium">Traveltics</span>
            </div>
          </div>
        </section>
      </main>

      <style>{`
        @keyframes shimmer {
          0% { transform: translateX(0%); }
          100% { transform: translateX(200%); }
        }
        .scrollbar-hide::-webkit-scrollbar { display: none; }
      `}</style>
    </div>
  );
};

export default Install;
