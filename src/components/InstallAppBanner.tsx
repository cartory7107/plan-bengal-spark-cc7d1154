import { Link } from "react-router-dom";
import { Smartphone, ChevronRight, Star } from "lucide-react";

const InstallAppBanner = () => {
  return (
    <div className="container max-w-4xl mx-auto px-4 pt-20 md:pt-24">
      <Link
        to="/install"
        className="group relative flex items-center gap-3 rounded-2xl overflow-hidden border border-white/60 bg-white/70 backdrop-blur-xl px-4 py-3 shadow-sm hover:shadow-md active:scale-[0.99] transition"
      >
        <span className="absolute inset-0 bg-gradient-to-r from-primary/10 via-emerald-50 to-teal-50/40 pointer-events-none" />
        <span className="absolute -left-8 -top-8 w-24 h-24 rounded-full bg-primary/20 blur-2xl pointer-events-none" />

        <div className="relative shrink-0 w-11 h-11 rounded-xl bg-gradient-to-br from-primary to-teal-500 flex items-center justify-center shadow-md">
          <Smartphone className="w-5 h-5 text-white" />
        </div>

        <div className="relative flex-1 min-w-0">
          <div className="flex items-center gap-1.5">
            <span className="text-sm font-bold text-foreground truncate">Install Traveltics App</span>
            <span className="hidden sm:inline-flex items-center gap-0.5 text-[11px] font-semibold text-amber-600">
              <Star className="w-3 h-3 fill-amber-400 text-amber-400" /> 4.9
            </span>
          </div>
          <p className="text-xs text-muted-foreground truncate">
            Free • 12 MB • Add to Home Screen for full-screen experience
          </p>
        </div>

        <span className="relative inline-flex items-center gap-1 text-xs font-semibold text-primary shrink-0">
          <span className="hidden sm:inline">Install</span>
          <ChevronRight className="w-4 h-4 transition-transform group-hover:translate-x-0.5" />
        </span>
      </Link>
    </div>
  );
};

export default InstallAppBanner;
