import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { History, MapPin, Calendar, ArrowRight, Trash2, ArrowLeft, Loader2 } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import AnimatedBackground from "@/components/AnimatedBackground";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

interface HistoryItem {
  id: string;
  departure_city: string;
  destination_city: string;
  trip_duration: number;
  budget: string;
  currency: string;
  season: string;
  created_at: string;
  itinerary_data: any;
}

const MyHistory = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [items, setItems] = useState<HistoryItem[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user) { navigate("/"); return; }
    fetchHistory();
  }, [user]);

  const fetchHistory = async () => {
    const { data } = await supabase
      .from("search_history")
      .select("*")
      .order("created_at", { ascending: false });
    setItems((data as HistoryItem[]) || []);
    setLoading(false);
  };

  const deleteItem = async (id: string) => {
    await supabase.from("search_history").delete().eq("id", id);
    setItems((prev) => prev.filter((i) => i.id !== id));
  };

  const openTrip = (item: HistoryItem) => {
    navigate("/", { state: { itinerary: item.itinerary_data, fromHistory: true } });
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
            <History className="w-5 h-5 text-primary-foreground" />
          </div>
          <h1 className="text-2xl font-bold text-foreground">My Search History</h1>
        </div>

        {loading ? (
          <div className="flex justify-center py-20"><Loader2 className="w-6 h-6 animate-spin text-primary" /></div>
        ) : items.length === 0 ? (
          <div className="glass-card rounded-2xl p-12 text-center">
            <History className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-foreground mb-2">No search history yet</h3>
            <p className="text-muted-foreground mb-4">Your travel searches will appear here after you generate itineraries.</p>
            <Link to="/" className="gradient-bg text-primary-foreground px-6 py-2.5 rounded-full text-sm font-semibold inline-block">Start Planning</Link>
          </div>
        ) : (
          <div className="space-y-3">
            {items.map((item) => (
              <div key={item.id} className="glass-card rounded-xl p-4 flex items-center justify-between gap-4 hover:shadow-md transition-shadow group">
                <button onClick={() => openTrip(item)} className="flex-1 flex items-center gap-4 text-left">
                  <div className="flex items-center gap-2 text-foreground font-semibold">
                    <MapPin className="w-4 h-4 text-primary shrink-0" />
                    <span>{item.departure_city}</span>
                    <ArrowRight className="w-3.5 h-3.5 text-muted-foreground" />
                    <span>{item.destination_city}</span>
                  </div>
                  <div className="hidden sm:flex items-center gap-3 text-sm text-muted-foreground">
                    <span className="flex items-center gap-1"><Calendar className="w-3.5 h-3.5" />{item.trip_duration} days</span>
                    <span>{item.budget} {item.currency}</span>
                    <span className="text-xs">{new Date(item.created_at).toLocaleDateString()}</span>
                  </div>
                </button>
                <button onClick={() => deleteItem(item.id)} className="text-muted-foreground hover:text-destructive transition-colors opacity-0 group-hover:opacity-100">
                  <Trash2 className="w-4 h-4" />
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

export default MyHistory;
