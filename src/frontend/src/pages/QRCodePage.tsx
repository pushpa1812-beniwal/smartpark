import { useQuery } from "@tanstack/react-query";
import { useNavigate, useParams } from "react-router-dom";
import Header from "../components/Header";
import { useActor } from "../hooks/useActor";

export default function QRCodePage() {
  const { bookingId } = useParams<{ bookingId: string }>();
  const { actor } = useActor();
  const navigate = useNavigate();

  const { data: bookings = [], isLoading } = useQuery({
    queryKey: ["userBookings"],
    queryFn: () => actor!.getUserBookings(),
    enabled: !!actor,
  });

  const booking = bookings.find((b) => b.id === bookingId);

  return (
    <div className="min-h-screen" style={{ background: "#F3F6F9" }}>
      <Header />
      <main className="max-w-md mx-auto px-4 py-8">
        <button
          type="button"
          onClick={() => navigate(-1)}
          className="text-sm text-slate-500 hover:text-slate-700 mb-6 flex items-center gap-1"
        >
          ← Back
        </button>
        {isLoading ? (
          <div className="flex justify-center py-20">
            <div
              className="animate-spin rounded-full h-10 w-10 border-b-2"
              style={{ borderColor: "#0B2F4A" }}
            />
          </div>
        ) : !booking ? (
          <div className="bg-white rounded-2xl p-8 text-center">
            <p className="text-slate-500">Booking not found.</p>
          </div>
        ) : (
          <div className="bg-white rounded-2xl shadow-sm border border-slate-100 p-8 text-center">
            <h1
              className="text-2xl font-bold mb-2"
              style={{ color: "#0B2F4A" }}
            >
              Your Entry QR Code
            </h1>
            <p className="text-slate-500 mb-6">
              Show this at the parking entrance
            </p>
            {/* QR Code display */}
            <div className="bg-slate-50 rounded-xl p-6 mb-6 inline-block">
              <div
                className="w-48 h-48 mx-auto grid"
                style={{ gridTemplateColumns: "repeat(10, 1fr)", gap: "2px" }}
              >
                {booking.qrCode
                  .split("")
                  .slice(0, 100)
                  .map((ch, i) => (
                    <div
                      // biome-ignore lint/suspicious/noArrayIndexKey: QR display grid
                      key={i}
                      className="rounded-sm"
                      style={{
                        background:
                          ch.charCodeAt(0) % 2 === 0
                            ? "#0B2F4A"
                            : "transparent",
                        aspectRatio: "1",
                      }}
                    />
                  ))}
              </div>
            </div>
            <div className="text-sm font-mono text-slate-400 mb-6 break-all">
              {booking.qrCode.slice(0, 32)}...
            </div>
            <div className="grid grid-cols-2 gap-3 text-sm text-left">
              <div className="bg-slate-50 rounded-xl p-3">
                <div className="text-slate-400 text-xs mb-1">Slot</div>
                <div className="font-bold" style={{ color: "#0B2F4A" }}>
                  {booking.slotId}
                </div>
              </div>
              <div className="bg-slate-50 rounded-xl p-3">
                <div className="text-slate-400 text-xs mb-1">Vehicle</div>
                <div className="font-bold" style={{ color: "#0B2F4A" }}>
                  {booking.vehicleNumber}
                </div>
              </div>
              <div className="bg-slate-50 rounded-xl p-3">
                <div className="text-slate-400 text-xs mb-1">Duration</div>
                <div className="font-bold" style={{ color: "#0B2F4A" }}>
                  {Number(booking.durationHours)}h
                </div>
              </div>
              <div className="bg-slate-50 rounded-xl p-3">
                <div className="text-slate-400 text-xs mb-1">Status</div>
                <div className="font-bold" style={{ color: "#22C55E" }}>
                  {booking.status}
                </div>
              </div>
            </div>
            <div
              className="mt-6 p-3 rounded-xl text-sm"
              style={{ background: "#EAF1F8" }}
            >
              <p className="text-slate-600">
                📍 <strong>Navigation:</strong> Take elevator to Floor {0}, turn
                right and follow Zone signs. Your slot will be marked with a
                green indicator.
              </p>
            </div>
            <button
              type="button"
              onClick={() => navigate("/history")}
              className="mt-4 w-full py-3 rounded-xl text-slate-600 font-medium border border-slate-200 hover:bg-slate-50"
            >
              View All Bookings
            </button>
          </div>
        )}
      </main>
    </div>
  );
}
