import { useState, useRef, useEffect } from "react";
import { Link } from "react-router-dom";
import { User, History, Bookmark, LogOut, ChevronDown } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";

const UserMenu = () => {
  const { user, signOut } = useAuth();
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  const avatarUrl = user?.user_metadata?.avatar_url;
  const displayName = user?.user_metadata?.full_name || user?.user_metadata?.name || user?.email?.split("@")[0] || "User";

  return (
    <div ref={ref} className="relative">
      <button
        onClick={() => setOpen(!open)}
        className="flex items-center gap-2 py-1.5 px-3 rounded-full glass-card hover:bg-accent/50 transition-all"
      >
        {avatarUrl ? (
          <img src={avatarUrl} alt="" className="w-7 h-7 rounded-full object-cover" />
        ) : (
          <div className="w-7 h-7 rounded-full gradient-bg flex items-center justify-center">
            <User className="w-3.5 h-3.5 text-primary-foreground" />
          </div>
        )}
        <span className="text-sm font-medium text-foreground hidden sm:block max-w-[100px] truncate">{displayName}</span>
        <ChevronDown className={`w-3.5 h-3.5 text-muted-foreground transition-transform ${open ? "rotate-180" : ""}`} />
      </button>

      {open && (
        <div className="absolute right-0 mt-2 w-52 glass-card-solid rounded-xl shadow-xl border border-border overflow-hidden animate-in fade-in slide-in-from-top-2 duration-150 z-50">
          <div className="px-4 py-3 border-b border-border">
            <p className="text-sm font-semibold text-foreground truncate">{displayName}</p>
            <p className="text-xs text-muted-foreground truncate">{user?.email}</p>
          </div>
          <div className="py-1">
            <Link to="/my-history" onClick={() => setOpen(false)} className="flex items-center gap-2.5 px-4 py-2.5 text-sm text-foreground hover:bg-accent/50 transition-colors">
              <History className="w-4 h-4 text-primary" /> My History
            </Link>
            <Link to="/saved-trips" onClick={() => setOpen(false)} className="flex items-center gap-2.5 px-4 py-2.5 text-sm text-foreground hover:bg-accent/50 transition-colors">
              <Bookmark className="w-4 h-4 text-primary" /> Saved Trips
            </Link>
          </div>
          <div className="border-t border-border py-1">
            <button onClick={() => { signOut(); setOpen(false); }} className="flex items-center gap-2.5 px-4 py-2.5 text-sm text-destructive hover:bg-destructive/10 transition-colors w-full">
              <LogOut className="w-4 h-4" /> Logout
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default UserMenu;
