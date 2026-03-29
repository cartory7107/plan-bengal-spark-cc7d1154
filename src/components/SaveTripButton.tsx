import { useState } from "react";
import { Bookmark, Check, Loader2 } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import { toast } from "sonner";
import type { Itinerary, FormData } from "@/lib/generateItinerary";
import AuthModal from "@/components/AuthModal";

interface Props {
  itinerary: Itinerary;
  formData: FormData | null;
}

const SaveTripButton = ({ itinerary, formData }: Props) => {
  const { user } = useAuth();
  const [saved, setSaved] = useState(false);
  const [saving, setSaving] = useState(false);
  const [showAuth, setShowAuth] = useState(false);

  const handleSave = async () => {
    if (!user) {
      setShowAuth(true);
      return;
    }
    setSaving(true);
    try {
      const { error } = await supabase.from("saved_trips").insert({
        user_id: user.id,
        destination: itinerary.destination,
        departure_city: formData?.from || "",
        trip_duration: formData?.days || itinerary.days.length,
        budget: formData?.budget || itinerary.total,
        currency: formData?.currency || "USD",
        itinerary_data: itinerary as any,
      });
      if (error) throw error;
      setSaved(true);
      toast.success("Trip saved successfully!");
    } catch (err: any) {
      toast.error(err.message || "Failed to save trip");
    } finally {
      setSaving(false);
    }
  };

  return (
    <>
      <button
        onClick={handleSave}
        disabled={saved || saving}
        className={`flex items-center gap-2 px-5 py-2.5 rounded-full text-sm font-semibold transition-all active:scale-95 ${
          saved
            ? "bg-primary/10 text-primary border border-primary/20"
            : "gradient-bg text-primary-foreground hover:shadow-lg hover:shadow-primary/20"
        } disabled:opacity-70`}
      >
        {saving ? (
          <Loader2 className="w-4 h-4 animate-spin" />
        ) : saved ? (
          <Check className="w-4 h-4" />
        ) : (
          <Bookmark className="w-4 h-4" />
        )}
        {saved ? "Trip Saved" : "Save Trip"}
      </button>
      <AuthModal isOpen={showAuth} onClose={() => setShowAuth(false)} defaultTab="signup" />
    </>
  );
};

export default SaveTripButton;
