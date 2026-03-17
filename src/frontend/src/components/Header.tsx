import { useQuery } from "@tanstack/react-query";
import { useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { useActor } from "../hooks/useActor";
import { useInternetIdentity } from "../hooks/useInternetIdentity";

export default function Header() {
  const { identity, clear } = useInternetIdentity();
  const { actor } = useActor();
  const location = useLocation();
  const navigate = useNavigate();
  const [menuOpen, setMenuOpen] = useState(false);

  const { data: isAdmin } = useQuery({
    queryKey: ["isAdmin"],
    queryFn: () => actor!.isCallerAdmin(),
    enabled: !!actor && !!identity,
  });

  const navLinks = [
    { href: "/dashboard", label: "Dashboard", icon: "📊" },
    { href: "/booking", label: "Book Slot", icon: "🅿️" },
    { href: "/history", label: "My Bookings", icon: "📋" },
    ...(isAdmin ? [{ href: "/admin", label: "Admin", icon: "⚙️" }] : []),
  ];

  const isActive = (href: string) => location.pathname === href;

  return (
    <header className="sticky top-0 z-50 bg-white border-b border-slate-200 shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-3 flex items-center justify-between">
        <Link to="/dashboard" className="flex items-center gap-2">
          <div
            className="w-8 h-8 rounded-lg flex items-center justify-center"
            style={{ background: "linear-gradient(135deg, #0B2F4A, #059669)" }}
          >
            <span className="text-white font-bold text-sm">SP</span>
          </div>
          <span className="text-lg font-bold" style={{ color: "#0B2F4A" }}>
            SmartPark
          </span>
        </Link>

        {/* Desktop nav */}
        <nav className="hidden md:flex items-center gap-1">
          {navLinks.map((link) => (
            <Link
              key={link.href}
              to={link.href}
              className="flex items-center gap-1.5 px-3 py-2 rounded-lg text-sm font-medium transition-colors"
              style={{
                background: isActive(link.href) ? "#EAF1F8" : "transparent",
                color: isActive(link.href) ? "#0B2F4A" : "#475569",
              }}
            >
              <span>{link.icon}</span>
              {link.label}
            </Link>
          ))}
        </nav>

        <div className="flex items-center gap-3">
          {identity ? (
            <div className="relative">
              <button
                type="button"
                onClick={() => setMenuOpen(!menuOpen)}
                className="flex items-center gap-2 px-3 py-2 rounded-lg hover:bg-slate-50"
              >
                <div
                  className="w-7 h-7 rounded-full flex items-center justify-center text-white text-xs font-bold"
                  style={{ background: "#0B2F4A" }}
                >
                  U
                </div>
                <span className="hidden sm:block text-sm font-medium text-slate-700">
                  Account
                </span>
                <span className="text-slate-400 text-xs">▼</span>
              </button>
              {menuOpen && (
                <div className="absolute right-0 top-full mt-1 bg-white border border-slate-200 rounded-xl shadow-lg py-1 w-40 z-50">
                  <button
                    type="button"
                    onClick={() => {
                      clear();
                      navigate("/");
                      setMenuOpen(false);
                    }}
                    className="w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-red-50"
                  >
                    Sign Out
                  </button>
                </div>
              )}
            </div>
          ) : (
            <Link
              to="/login"
              className="px-4 py-2 rounded-lg text-white text-sm font-medium"
              style={{ background: "#0B2F4A" }}
            >
              Login
            </Link>
          )}
        </div>
      </div>
    </header>
  );
}
