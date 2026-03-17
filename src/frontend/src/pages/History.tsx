import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useNavigate } from "react-router-dom";
import { BookingStatus, PaymentStatus } from "../backend.d";
import Header from "../components/Header";
import { useActor } from "../hooks/useActor";

const statusColors: Record<BookingStatus, string> = {
  [BookingStatus.active]: "#22C55E",
  [BookingStatus.completed]: "#2563EB",
  [BookingStatus.cancelled]: "#EF4444",
};

export default function History() {
  const { actor } = useActor();
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  const { data: bookings = [], isLoading } = useQuery({
    queryKey: ["userBookings"],
    queryFn: () => actor!.getUserBookings(),
    enabled: !!actor,
  });

  const cancelMutation = useMutation({
    mutationFn: (id: string) => actor!.cancelBooking(id),
    onSuccess: () =>
      queryClient.invalidateQueries({ queryKey: ["userBookings"] }),
  });

  const formatDate = (ts: bigint) =>
    new Date(Number(ts)).toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    });
  const formatTime = (ts: bigint) =>
    new Date(Number(ts)).toLocaleTimeString("en-US", {
      hour: "2-digit",
      minute: "2-digit",
    });

  return (
    <div className="min-h-screen" style={{ background: "#F3F6F9" }}>
      <Header />
      <main className="max-w-4xl mx-auto px-4 sm:px-6 py-8">
        <div className="mb-8">
          <h1 className="text-2xl font-bold" style={{ color: "#0B2F4A" }}>
            Booking History
          </h1>
          <p className="text-slate-500 mt-1">
            All your past and upcoming parking bookings
          </p>
        </div>
        {isLoading ? (
          <div className="flex justify-center py-20">
            <div
              className="animate-spin rounded-full h-10 w-10 border-b-2"
              style={{ borderColor: "#0B2F4A" }}
            />
          </div>
        ) : bookings.length === 0 ? (
          <div className="bg-white rounded-2xl shadow-sm border border-slate-100 p-12 text-center">
            <div className="text-5xl mb-4">🅿️</div>
            <h3 className="font-bold text-lg mb-2" style={{ color: "#0B2F4A" }}>
              No bookings yet
            </h3>
            <p className="text-slate-500 mb-6">
              Book your first parking slot to see it here
            </p>
            <button
              type="button"
              onClick={() => navigate("/booking")}
              className="px-6 py-2 rounded-lg text-white font-medium"
              style={{ background: "#0B2F4A" }}
            >
              Book Now
            </button>
          </div>
        ) : (
          <div className="space-y-4">
            {[...bookings].reverse().map((b) => (
              <div
                key={b.id}
                className="bg-white rounded-2xl shadow-sm border border-slate-100 p-5"
              >
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <span className="font-bold" style={{ color: "#0B2F4A" }}>
                        Slot: {b.slotId}
                      </span>
                      <span
                        className="px-2 py-0.5 rounded-full text-xs font-medium text-white"
                        style={{ background: statusColors[b.status] }}
                      >
                        {b.status}
                      </span>
                      {b.paymentStatus === PaymentStatus.paid && (
                        <span
                          className="px-2 py-0.5 rounded-full text-xs font-medium"
                          style={{ background: "#dcfce7", color: "#15803d" }}
                        >
                          Paid
                        </span>
                      )}
                    </div>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-3 text-sm">
                      <div>
                        <div className="text-slate-400 text-xs">Vehicle</div>
                        <div className="font-medium">{b.vehicleNumber}</div>
                      </div>
                      <div>
                        <div className="text-slate-400 text-xs">Date</div>
                        <div className="font-medium">
                          {formatDate(b.startTime)}
                        </div>
                      </div>
                      <div>
                        <div className="text-slate-400 text-xs">Time</div>
                        <div className="font-medium">
                          {formatTime(b.startTime)}
                        </div>
                      </div>
                      <div>
                        <div className="text-slate-400 text-xs">Duration</div>
                        <div className="font-medium">
                          {Number(b.durationHours)}h
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className="flex gap-2 ml-4">
                    {b.status === BookingStatus.active && (
                      <>
                        <button
                          type="button"
                          onClick={() => navigate(`/qr/${b.id}`)}
                          className="px-3 py-1.5 rounded-lg text-xs font-medium text-white"
                          style={{ background: "#0B2F4A" }}
                        >
                          QR Code
                        </button>
                        <button
                          type="button"
                          onClick={() => cancelMutation.mutate(b.id)}
                          disabled={cancelMutation.isPending}
                          className="px-3 py-1.5 rounded-lg text-xs font-medium border border-red-200 text-red-600 hover:bg-red-50"
                        >
                          Cancel
                        </button>
                      </>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </main>
    </div>
  );
}
