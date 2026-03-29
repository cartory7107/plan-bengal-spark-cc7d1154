import { useState, useEffect } from "react";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";

const floatingEmojis = [
  { emoji: "✈️", style: "top-4 left-6 animate-[bounce_3s_ease-in-out_infinite]" },
  { emoji: "🌍", style: "top-6 right-8 animate-[bounce_2.5s_ease-in-out_infinite_0.5s]" },
  { emoji: "🗺️", style: "bottom-16 left-8 animate-[bounce_2.8s_ease-in-out_infinite_0.3s]" },
  { emoji: "🏖️", style: "bottom-14 right-6 animate-[bounce_3.2s_ease-in-out_infinite_0.7s]" },
  { emoji: "🧳", style: "top-1/2 left-2 animate-[bounce_2.6s_ease-in-out_infinite_0.2s]" },
  { emoji: "🌴", style: "top-1/2 right-2 animate-[bounce_3s_ease-in-out_infinite_0.9s]" },
];

const WelcomePopup = () => {
  const [open, setOpen] = useState(false);

  useEffect(() => {
    if (sessionStorage.getItem("welcomeShown")) return;

    const timer = setTimeout(() => {
      setOpen(true);
      sessionStorage.setItem("welcomeShown", "true");
    }, 500);

    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    if (!open) return;
    const auto = setTimeout(() => setOpen(false), 8000);
    return () => clearTimeout(auto);
  }, [open]);

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogContent className="sm:max-w-md border-0 bg-white/10 backdrop-blur-xl shadow-2xl rounded-2xl overflow-visible p-0 [&>button]:hidden">
        <div className="relative px-8 py-10 text-center">
          {floatingEmojis.map((item, i) => (
            <span
              key={i}
              className={`absolute text-2xl sm:text-3xl select-none ${item.style}`}
            >
              {item.emoji}
            </span>
          ))}

          <div className="space-y-4">
            <p className="text-4xl sm:text-5xl">🌟</p>
            <h2 className="text-2xl sm:text-3xl font-bold text-foreground leading-tight">
              Plan Your Perfect Trip
              <br />
              in Seconds ✨
            </h2>
            <p className="text-muted-foreground text-sm sm:text-base max-w-xs mx-auto">
              AI-powered itineraries, real-time weather, local tips — all free! 🎉
            </p>
            <Button
              onClick={() => setOpen(false)}
              className="mt-4 bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 text-white font-semibold px-8 py-3 rounded-full text-base shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105"
              size="lg"
            >
              Let's Go! 🚀
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default WelcomePopup;
