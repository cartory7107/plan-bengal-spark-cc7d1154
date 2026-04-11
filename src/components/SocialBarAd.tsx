import { useEffect } from "react";

const SOCIAL_SCRIPT_SRC =
  "https://pl29117536.profitablecpmratenetwork.com/318264ea7d4834bf865e7b0054e30ca0/invoke.js";
const SESSION_KEY = "socialBarShown";
const COOLDOWN_KEY = "socialBarLastShown";
const COOLDOWN_MS = 2 * 60 * 1000; // 2 minutes
const DELAY_MS = 6000; // 6 seconds

const SocialBarAd = () => {
  useEffect(() => {
    // Only once per session
    if (sessionStorage.getItem(SESSION_KEY)) return;

    // Respect 2-min cooldown
    const lastShown = localStorage.getItem(COOLDOWN_KEY);
    if (lastShown && Date.now() - Number(lastShown) < COOLDOWN_MS) return;

    const timer = setTimeout(() => {
      sessionStorage.setItem(SESSION_KEY, "1");
      localStorage.setItem(COOLDOWN_KEY, String(Date.now()));

      const container = document.createElement("div");
      container.id = "container-318264ea7d4834bf865e7b0054e30ca0";
      container.style.position = "fixed";
      container.style.bottom = "0";
      container.style.left = "0";
      container.style.right = "0";
      container.style.zIndex = "40"; // below nav (z-50)
      container.style.pointerEvents = "auto";
      document.body.appendChild(container);

      const script = document.createElement("script");
      script.src = SOCIAL_SCRIPT_SRC;
      script.async = true;
      script.setAttribute("data-cfasync", "false");
      document.body.appendChild(script);
    }, DELAY_MS);

    return () => clearTimeout(timer);
  }, []);

  return null;
};

export default SocialBarAd;
