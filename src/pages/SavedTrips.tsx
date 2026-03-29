import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Bookmark, MapPin, Calendar, Trash2, ArrowLeft, Loader2 } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import AnimatedBackground from "@/components/AnimatedBackground";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

interface SavedTrip {
  id: string;
  destination: string;
  departure_city: string;
  trip_duration: number;
  budget: string;
  currency: string;
  created_at: string;
  itinerary_data: any;
}

const SavedTrips = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [trips, setTrips] = useState<SavedTrip[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user) { navigate("/"); return; }
    fetchTrips();
  }, [user]);

  const fetchTrips = async () => {
    const { data } = await supabase
      .from("saved_trips")
      .select("*")
      .order("created_at", { ascending: false });
    setTrips((data as SavedTrip[]) || []);
    setLoading(false);
  };

  const deleteTrip = async (id: string) => {
    await supabase.from("saved_trips").delete().eq("id", id);
    setTrips((prev) => prev.filter((t) => t.id !== id));
  };

  const openTrip = (trip: SavedTrip) => {
    navigate("/", { state: { itinerary: trip.itinerary_data, fromHistory: true } });
  };

  return (
    <div className="relative min-h-screen">
      <AnimatedBackground />
      <Navbar />
      <div className="container max-w-4xl mx-auto pt-28 pb-16 px-4">
        <Link to="/" className="inline-flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground mb-6 transition-colors">
          <ArrowLeft className="w-4 h-4" /> Back to Planner
        </Link>
        <div className="flex items-center gap-3 mb-8">
          <div className="gradient-bg rounded-xl p-2.5">
            <Bookmark className="w-5 h-5 text-primary-foreground" />
          </div>
          <h1 className="text-2xl font-bold text-foreground">Saved Trips</h1>
        </div>

        {loading ? (
          <div className="flex justify-center py-20"><Loader2 className="w-6 h-6 animate-spin text-primary" /></div>
        ) : trips.length === 0 ? (
          <div className="glass-card rounded-2xl p-12 text-center">
            <Bookmark className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-foreground mb-2">No saved trips yet</h3>
            <p className="text-muted-foreground mb-4">Save your favorite travel plans to access them anytime.</p>
            <Link to="/" className="gradient-bg text-primary-foreground px-6 py-2.5 rounded-full text-sm font-semibold inline-block">Start Planning</Link>
          </div>
        ) : (
          <div className="grid gap-4 sm:grid-cols-2">
            {trips.map((trip) => (
              <div key={trip.id} className="glass-card rounded-xl p-5 hover:shadow-md transition-shadow group">
                <button onClick={() => openTrip(trip)} className="w-full text-left">
                  <div className="flex items-center gap-2 mb-2">
                    <MapPin className="w-4 h-4 text-primary" />
                    <span className="font-semibold text-foreground">{trip.destination}</span>
                  </div>
                  {trip.departure_city && <p className="text-sm text-muted-foreground mb-1">From: {trip.departure_city}</p>}
                  <div className="flex items-center gap-3 text-sm text-muted-foreground">
                    {trip.trip_duration && <span className="flex items-center gap-1"><Calendar className="w-3.5 h-3.5" />{trip.trip_duration} days</span>}
                    {trip.budget && <span>{trip.budget} {trip.currency}</span>}
                  </div>
                  <p className="text-xs text-muted-foreground mt-2">Saved {new Date(trip.created_at).toLocaleDateString()}</p>
                </button>
                <button onClick={() => deleteTrip(trip.id)} className="mt-3 text-xs text-muted-foreground hover:text-destructive transition-colors opacity-0 group-hover:opacity-100 flex items-center gap-1">
                  <Trash2 className="w-3.5 h-3.5" /> Remove
                </button>
              </div>
            ))}
          </div>
        )}
      </div>
      <Footer />
    </div>
  );
};

export default SavedTrips;
