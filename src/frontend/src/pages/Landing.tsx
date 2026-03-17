import { useNavigate } from "react-router-dom";
import { useInternetIdentity } from "../hooks/useInternetIdentity";

export default function Landing() {
  const navigate = useNavigate();
  const { identity, login } = useInternetIdentity();

  const handleBookNow = () => {
    if (identity) navigate("/dashboard");
    else login();
  };

  return (
    <div className="min-h-screen bg-white">
      {/* Header */}
      <header className="sticky top-0 z-50 bg-white border-b border-slate-200 shadow-sm">
        <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div
              className="w-8 h-8 rounded-lg flex items-center justify-center"
              style={{
                background: "linear-gradient(135deg, #0B2F4A, #059669)",
              }}
            >
              <span className="text-white font-bold text-sm">SP</span>
            </div>
            <span className="text-xl font-bold" style={{ color: "#0B2F4A" }}>
              SmartPark
            </span>
          </div>
          <nav className="hidden md:flex items-center gap-8">
            <a
              href="#features"
              className="text-slate-600 hover:text-slate-900 text-sm font-medium"
            >
              Features
            </a>
            <a
              href="#how-it-works"
              className="text-slate-600 hover:text-slate-900 text-sm font-medium"
            >
              How It Works
            </a>
            <a
              href="#benefits"
              className="text-slate-600 hover:text-slate-900 text-sm font-medium"
            >
              Benefits
            </a>
          </nav>
          <div className="flex items-center gap-3">
            {identity ? (
              <button
                type="button"
                onClick={() => navigate("/dashboard")}
                className="px-4 py-2 rounded-lg text-white text-sm font-medium"
                style={{ background: "#0B2F4A" }}
              >
                Dashboard
              </button>
            ) : (
              <button
                type="button"
                onClick={login}
                className="px-4 py-2 rounded-lg text-white text-sm font-medium"
                style={{ background: "#0B2F4A" }}
              >
                Login
              </button>
            )}
          </div>
        </div>
      </header>

      {/* Hero */}
      <section
        className="relative overflow-hidden"
        style={{
          background:
            "linear-gradient(135deg, #0B2F4A 0%, #0e3a5b 50%, #065f46 100%)",
        }}
      >
        <div className="absolute inset-0 opacity-10">
          <div
            className="absolute top-20 left-20 w-64 h-64 rounded-full"
            style={{ background: "#22C55E", filter: "blur(80px)" }}
          />
          <div
            className="absolute bottom-20 right-20 w-96 h-96 rounded-full"
            style={{ background: "#2563EB", filter: "blur(100px)" }}
          />
        </div>
        <div className="max-w-7xl mx-auto px-6 py-24 relative">
          <div className="max-w-3xl">
            <div
              className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-medium mb-6"
              style={{ background: "rgba(34,197,94,0.2)", color: "#4ade80" }}
            >
              <span className="w-2 h-2 rounded-full bg-green-400 animate-pulse" />
              Live Availability Tracking
            </div>
            <h1 className="text-5xl md:text-6xl font-bold text-white mb-6 leading-tight">
              Smart Parking
              <br />
              <span style={{ color: "#4ade80" }}>Made Easy</span>
            </h1>
            <p className="text-xl text-slate-300 mb-8 leading-relaxed">
              Book your parking slot in seconds. Real-time availability, QR code
              entry, and seamless navigation to your spot.
            </p>
            <div className="flex flex-wrap gap-4">
              <button
                type="button"
                onClick={handleBookNow}
                className="px-8 py-4 rounded-xl text-white font-semibold text-lg transition-transform hover:scale-105"
                style={{ background: "#059669" }}
              >
                Book Now
              </button>
              <button
                type="button"
                onClick={() => navigate(identity ? "/dashboard" : "/login")}
                className="px-8 py-4 rounded-xl font-semibold text-lg border-2 border-white/30 text-white hover:bg-white/10 transition-colors"
              >
                Check Availability
              </button>
            </div>
            <div className="flex items-center gap-8 mt-12">
              {[
                { num: "2,400+", label: "Slots Available" },
                { num: "98%", label: "Satisfaction Rate" },
                { num: "< 30s", label: "Booking Time" },
              ].map((s) => (
                <div key={s.label}>
                  <div className="text-2xl font-bold text-white">{s.num}</div>
                  <div className="text-sm text-slate-400">{s.label}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Features */}
      <section id="features" className="py-20 bg-slate-50">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-16">
            <h2
              className="text-4xl font-bold mb-4"
              style={{ color: "#0B2F4A" }}
            >
              Everything You Need
            </h2>
            <p className="text-lg text-slate-500">
              Powerful features designed for modern parking management
            </p>
          </div>
          <div className="grid md:grid-cols-3 gap-8">
            {[
              {
                icon: "🅿️",
                title: "Real-time Availability",
                desc: "See live slot availability with color-coded indicators across all zones and floors.",
              },
              {
                icon: "📱",
                title: "QR Code Entry",
                desc: "Receive a unique QR code after booking. Simply scan at the gate for instant entry.",
              },
              {
                icon: "🧭",
                title: "Slot Navigation",
                desc: "Get turn-by-turn directions to your exact parking spot within the mall.",
              },
              {
                icon: "💳",
                title: "Easy Payments",
                desc: "Pay securely via UPI or card. Instant confirmation and digital receipts.",
              },
              {
                icon: "⏰",
                title: "Time Reminders",
                desc: "Get alerts before your parking time expires. Never overstay again.",
              },
              {
                icon: "📊",
                title: "Smart Recommendations",
                desc: "AI-powered slot suggestions based on your location and destination.",
              },
            ].map((f) => (
              <div
                key={f.title}
                className="bg-white rounded-2xl p-6 shadow-sm border border-slate-100 hover:shadow-md transition-shadow"
              >
                <div className="text-4xl mb-4">{f.icon}</div>
                <h3
                  className="text-lg font-bold mb-2"
                  style={{ color: "#0B2F4A" }}
                >
                  {f.title}
                </h3>
                <p className="text-slate-500 text-sm leading-relaxed">
                  {f.desc}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* How it Works */}
      <section id="how-it-works" className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-16">
            <h2
              className="text-4xl font-bold mb-4"
              style={{ color: "#0B2F4A" }}
            >
              How It Works
            </h2>
            <p className="text-lg text-slate-500">
              4 simple steps to park smarter
            </p>
          </div>
          <div className="grid md:grid-cols-4 gap-8">
            {[
              {
                step: "01",
                title: "Check Availability",
                desc: "View real-time slot availability for your preferred mall and time.",
              },
              {
                step: "02",
                title: "Book Your Slot",
                desc: "Select your preferred slot, enter vehicle details, and confirm booking.",
              },
              {
                step: "03",
                title: "Pay Securely",
                desc: "Complete payment via UPI, credit or debit card.",
              },
              {
                step: "04",
                title: "Scan & Enter",
                desc: "Show your QR code at the entrance and navigate to your slot.",
              },
            ].map((s, i) => (
              <div key={s.step} className="text-center">
                <div className="relative inline-block">
                  <div
                    className="w-16 h-16 rounded-2xl flex items-center justify-center text-white font-bold text-lg mx-auto mb-4"
                    style={{ background: i % 2 === 0 ? "#0B2F4A" : "#059669" }}
                  >
                    {s.step}
                  </div>
                  {i < 3 && (
                    <div className="hidden md:block absolute top-8 left-full w-full h-0.5 bg-slate-200" />
                  )}
                </div>
                <h3 className="font-bold mb-2" style={{ color: "#0B2F4A" }}>
                  {s.title}
                </h3>
                <p className="text-slate-500 text-sm">{s.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Benefits */}
      <section
        id="benefits"
        className="py-20"
        style={{
          background: "linear-gradient(135deg, #0B2F4A 0%, #065f46 100%)",
        }}
      >
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold mb-4 text-white">
              Why Choose SmartPark?
            </h2>
            <p className="text-lg text-slate-300">
              Trusted by thousands of shoppers every day
            </p>
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              {
                icon: "⚡",
                title: "Instant Booking",
                desc: "Book a slot in under 30 seconds",
              },
              {
                icon: "🔒",
                title: "Secure & Safe",
                desc: "End-to-end encrypted transactions",
              },
              {
                icon: "💰",
                title: "Best Rates",
                desc: "Competitive pricing, no hidden fees",
              },
              {
                icon: "🌟",
                title: "24/7 Support",
                desc: "Always here when you need help",
              },
            ].map((b) => (
              <div
                key={b.title}
                className="bg-white/10 rounded-2xl p-6 text-center backdrop-blur-sm border border-white/10"
              >
                <div className="text-4xl mb-3">{b.icon}</div>
                <h3 className="font-bold text-white mb-2">{b.title}</h3>
                <p className="text-slate-300 text-sm">{b.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-slate-900 text-slate-400 py-8">
        <div className="max-w-7xl mx-auto px-6 flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <div
              className="w-6 h-6 rounded flex items-center justify-center"
              style={{ background: "#059669" }}
            >
              <span className="text-white text-xs font-bold">SP</span>
            </div>
            <span className="text-white font-semibold">SmartPark</span>
          </div>
          <div className="flex gap-6 text-sm">
            <span className="hover:text-white cursor-pointer">About</span>
            <span className="hover:text-white cursor-pointer">Terms</span>
            <span className="hover:text-white cursor-pointer">Privacy</span>
            <span className="hover:text-white cursor-pointer">Contact</span>
          </div>
          <p className="text-sm">
            © 2026 SmartPark Systems. All rights reserved.
          </p>
        </div>
      </footer>
    </div>
  );
}
