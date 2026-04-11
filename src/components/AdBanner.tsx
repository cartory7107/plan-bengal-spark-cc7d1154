import { useEffect, useRef } from "react";

interface AdBannerProps {
  className?: string;
}

const AD_SCRIPT_SRC =
  "https://pl29117536.profitablecpmratenetwork.com/318264ea7d4834bf865e7b0054e30ca0/invoke.js";
const AD_CONTAINER_ID = "container-318264ea7d4834bf865e7b0054e30ca0";

const AdBanner = ({ className = "" }: AdBannerProps) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const loaded = useRef(false);

  useEffect(() => {
    if (loaded.current || !containerRef.current) return;
    loaded.current = true;

    // Create a unique container div for this instance
    const id = `${AD_CONTAINER_ID}-${Math.random().toString(36).slice(2, 8)}`;
    const adDiv = document.createElement("div");
    adDiv.id = AD_CONTAINER_ID;
    containerRef.current.appendChild(adDiv);

    // Load script async
    const script = document.createElement("script");
    script.src = AD_SCRIPT_SRC;
    script.async = true;
    script.setAttribute("data-cfasync", "false");
    containerRef.current.appendChild(script);
  }, []);

  return (
    <div
      className={`w-full flex justify-center my-6 min-h-[90px] ${className}`}
      ref={containerRef}
      aria-hidden="true"
    />
  );
};

export default AdBanner;
