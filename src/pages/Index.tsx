import { useState, useRef, useEffect } from "react";
import { useLocation } from "react-router-dom";
import AnimatedBackground from "@/components/AnimatedBackground";
import Navbar from "@/components/Navbar";
import HeroSection from "@/components/HeroSection";
import TravelForm from "@/components/TravelForm";
import ItineraryResult from "@/components/ItineraryResult";
import Footer from "@/components/Footer";
import AIChatBubble from "@/components/AIChatBubble";
import SignUpBanner from "@/components/SignUpBanner";
import WelcomePopup from "@/components/WelcomePopup";
import SaveTripButton from "@/components/SaveTripButton";
import { generateDynamicItinerary } from "@/lib/travelApi";
import type { Itinerary, FormData } from "@/lib/generateItinerary";
import { toast } from "sonner";
import { detectUserCurrency } from "@/hooks/useCurrencyRates";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/integrations/supabase/client";

const Index = () => {
  const location = useLocation();
  const [itinerary, setItinerary] = useState<Itinerary | null>(null);
  const [lastFormData, setLastFormData] = useState<FormData | null>(null);
  const [loading, setLoading] = useState(false);
  const [language, setLanguage] = useState("English");
  const [displayCurrency, setDisplayCurrency] = useState(() => detectUserCurrency());
  const [originalCurrency, setOriginalCurrency] = useState("USD");
  const resultRef = useRef<HTMLDivElement>(null);
  const { user } = useAuth();

  // Handle reopening trips from history/saved
  useEffect(() => {
    const state = location.state as any;
    if (state?.itinerary && state?.fromHistory) {
      setItinerary(state.itinerary);
      setOriginalCurrency(state.itinerary?.weather?.currency || "USD");
      setDisplayCurrency(state.itinerary?.weather?.currency || detectUserCurrency());
      setTimeout(() => resultRef.current?.scrollIntoView({ behavior: "smooth" }), 200);
      // Clear state to avoid re-triggering
      window.history.replaceState({}, document.title);
    }
  }, [location.state]);

  const handleSubmit = async (form: FormData) => {
    setLoading(true);
    setOriginalCurrency(form.currency);
    setDisplayCurrency(form.currency);
    setLastFormData(form);
    try {
      const result = await generateDynamicItinerary(form);
      setItinerary(result);
      toast.success("Your AI travel plan is ready!");
      setTimeout(() => resultRef.current?.scrollIntoView({ behavior: "smooth" }), 100);

      // Save to search history if logged in
      if (user) {
        await supabase.from("search_history").insert({
          user_id: user.id,
          departure_city: form.from,
          destination_city: form.destination,
          trip_duration: form.days,
          season: form.season,
          budget: form.budget,
          currency: form.currency,
          travel_type: form.travelType,
          transport: form.transport,
          hotel: form.hotel,
          food: form.food,
          itinerary_data: result as any,
        });
      }
    } catch (err) {
      console.error("Plan generation error:", err);
      toast.error("Failed to generate plan. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="relative min-h-screen">
      <AnimatedBackground />
      <Navbar language={language} onLanguageChange={setLanguage} />
      <HeroSection language={language} />
      <TravelForm onSubmit={handleSubmit} loading={loading} language={language} />
      {itinerary && (
        <div ref={resultRef}>
          <ItineraryResult
            data={itinerary}
            language={language}
            originalCurrency={originalCurrency}
            displayCurrency={displayCurrency}
            onCurrencyChange={setDisplayCurrency}
          />
          <div className="container max-w-4xl mx-auto px-4 -mt-4 mb-8">
            <SaveTripButton itinerary={itinerary} formData={lastFormData} />
          </div>
          {!user && <SignUpBanner />}
        </div>
      )}
      <Footer language={language} />
      <AIChatBubble />
    </div>
  );
};

export default Index;
