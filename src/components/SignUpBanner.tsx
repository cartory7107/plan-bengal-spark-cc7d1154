import { useState } from "react";
import { Sparkles, Bookmark, History, RotateCcw } from "lucide-react";
import AuthModal from "@/components/AuthModal";

const SignUpBanner = () => {
  const [showAuth, setShowAuth] = useState(false);

  return (
    <>
      <div className="container max-w-4xl mx-auto px-4 mb-10">
        <div className="glass-card rounded-2xl p-6 text-center">
          <div className="flex items-center justify-center gap-2 mb-3">
            <Sparkles className="w-5 h-5 text-primary" />
            <h3 className="text-lg font-bold text-foreground">Just sign up for a better experience</h3>
          </div>
          <div className="flex flex-wrap justify-center gap-6 text-sm text-muted-foreground mb-4">
            <span className="flex items-center gap-1.5"><Bookmark className="w-4 h-4 text-primary" /> Save your trips</span>
            <span className="flex items-center gap-1.5"><History className="w-4 h-4 text-primary" /> Access search history</span>
            <span className="flex items-center gap-1.5"><RotateCcw className="w-4 h-4 text-primary" /> Reopen previous plans</span>
          </div>
          <button
            onClick={() => setShowAuth(true)}
            className="gradient-bg text-primary-foreground px-6 py-2.5 rounded-full text-sm font-semibold transition-all hover:shadow-lg hover:shadow-primary/20 active:scale-95"
          >
            Create Free Account
          </button>
        </div>
      </div>
      <AuthModal isOpen={showAuth} onClose={() => setShowAuth(false)} defaultTab="signup" />
    </>
  );
};

export default SignUpBanner;
