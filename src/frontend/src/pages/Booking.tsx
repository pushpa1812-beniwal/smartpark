import { useMutation, useQuery } from "@tanstack/react-query";
import { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import type { ParkingSlot } from "../backend.d";
import { SlotStatus } from "../backend.d";
import Header from "../components/Header";
import { useActor } from "../hooks/useActor";

export default function Booking() {
  const { actor } = useActor();
  const navigate = useNavigate();
  const location = useLocation();
  const preSelected = location.state?.selectedSlot as ParkingSlot | undefined;

  const [selectedSlot, setSelectedSlot] = useState<ParkingSlot | null>(
    preSelected || null,
  );
  const [vehicleNumber, setVehicleNumber] = useState("");
  const [date, setDate] = useState(
    () => new Date().toISOString().split("T")[0],
  );
  const [time, setTime] = useState("10:00");
  const [duration, setDuration] = useState(2);
  const [error, setError] = useState("");

  const { data: slots = [] } = useQuery({
    queryKey: ["parkingSlots"],
    queryFn: () => actor!.getParkingSlots(),
    enabled: !!actor,
  });

  const availableSlots = slots.filter((s) => s.status === SlotStatus.available);
  const totalPrice = selectedSlot ? selectedSlot.pricePerHour * duration : 0;

  const bookMutation = useMutation({
    mutationFn: async () => {
      if (!actor || !selectedSlot) throw new Error("No slot selected");
      const startTime = BigInt(new Date(`${date}T${time}`).getTime());
      return actor.bookSlot(
        selectedSlot.id,
        vehicleNumber,
        startTime,
        BigInt(duration),
      );
    },
    onSuccess: (booking) => {
      navigate(`/payment/${booking.id}`, { state: { booking, totalPrice } });
    },
    onError: (err: Error) => setError(err.message),
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    if (!selectedSlot) return setError("Please select a parking slot");
    if (!vehicleNumber.trim())
      return setError("Please enter your vehicle number");
    bookMutation.mutate();
  };

  return (
    <div className="min-h-screen" style={{ background: "#F3F6F9" }}>
      <Header />
      <main className="max-w-2xl mx-auto px-4 sm:px-6 py-8">
        <div className="mb-6">
          <button
            type="button"
            onClick={() => navigate(-1)}
            className="text-sm text-slate-500 hover:text-slate-700 mb-4 flex items-center gap-1"
          >
            ← Back
          </button>
          <h1 className="text-2xl font-bold" style={{ color: "#0B2F4A" }}>
            Book a Parking Slot
          </h1>
        </div>
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Slot Selection */}
          <div className="bg-white rounded-2xl shadow-sm border border-slate-100 p-6">
            <h2 className="font-bold mb-4" style={{ color: "#0B2F4A" }}>
              Select Slot
            </h2>
            {selectedSlot ? (
              <div
                className="flex items-center justify-between p-3 rounded-xl border-2"
                style={{ borderColor: "#22C55E", background: "#f0fdf4" }}
              >
                <div>
                  <div className="font-bold" style={{ color: "#0B2F4A" }}>
                    Zone {selectedSlot.zone}, Slot {selectedSlot.slotNumber}
                  </div>
                  <div className="text-sm text-slate-500">
                    Floor {Number(selectedSlot.floor)} · $
                    {selectedSlot.pricePerHour}/hr
                  </div>
                </div>
                <button
                  type="button"
                  onClick={() => setSelectedSlot(null)}
                  className="text-sm text-red-500 hover:text-red-700"
                >
                  Change
                </button>
              </div>
            ) : (
              <div className="grid grid-cols-4 gap-2">
                {availableSlots.map((slot) => (
                  <button
                    type="button"
                    key={slot.id}
                    onClick={() => setSelectedSlot(slot)}
                    className="p-2 rounded-lg text-xs font-bold text-white transition-transform hover:scale-105"
                    style={{ background: "#22C55E" }}
                  >
                    {slot.zone}
                    {slot.slotNumber}
                  </button>
                ))}
                {availableSlots.length === 0 && (
                  <p className="text-slate-400 col-span-4 text-center py-4">
                    No slots available
                  </p>
                )}
              </div>
            )}
          </div>

          {/* Details */}
          <div className="bg-white rounded-2xl shadow-sm border border-slate-100 p-6 space-y-4">
            <h2 className="font-bold" style={{ color: "#0B2F4A" }}>
              Booking Details
            </h2>
            <div>
              <label
                htmlFor="vehicle-number"
                className="block text-sm font-medium text-slate-600 mb-1"
              >
                Vehicle Number
              </label>
              <input
                id="vehicle-number"
                type="text"
                value={vehicleNumber}
                onChange={(e) => setVehicleNumber(e.target.value.toUpperCase())}
                placeholder="e.g. MH01AB1234"
                className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label
                  htmlFor="booking-date"
                  className="block text-sm font-medium text-slate-600 mb-1"
                >
                  Date
                </label>
                <input
                  id="booking-date"
                  type="date"
                  value={date}
                  min={new Date().toISOString().split("T")[0]}
                  onChange={(e) => setDate(e.target.value)}
                  className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <div>
                <label
                  htmlFor="booking-time"
                  className="block text-sm font-medium text-slate-600 mb-1"
                >
                  Time
                </label>
                <input
                  id="booking-time"
                  type="time"
                  value={time}
                  onChange={(e) => setTime(e.target.value)}
                  className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
            </div>
            <div>
              <label
                htmlFor="duration"
                className="block text-sm font-medium text-slate-600 mb-1"
              >
                Duration: {duration} hour{duration > 1 ? "s" : ""}
              </label>
              <input
                id="duration"
                type="range"
                min="1"
                max="12"
                value={duration}
                onChange={(e) => setDuration(Number(e.target.value))}
                className="w-full"
              />
              <div className="flex justify-between text-xs text-slate-400 mt-1">
                <span>1 hr</span>
                <span>12 hrs</span>
              </div>
            </div>
          </div>

          {/* Price Summary */}
          <div className="bg-white rounded-2xl shadow-sm border border-slate-100 p-6">
            <h2 className="font-bold mb-3" style={{ color: "#0B2F4A" }}>
              Price Summary
            </h2>
            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="text-slate-500">Rate</span>
                <span>${selectedSlot?.pricePerHour ?? 0}/hr</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">Duration</span>
                <span>
                  {duration} hour{duration > 1 ? "s" : ""}
                </span>
              </div>
              <div className="flex justify-between font-bold text-base pt-2 border-t border-slate-100">
                <span style={{ color: "#0B2F4A" }}>Total</span>
                <span style={{ color: "#059669" }}>
                  ${totalPrice.toFixed(2)}
                </span>
              </div>
            </div>
          </div>

          {error && <p className="text-red-500 text-sm">{error}</p>}

          <button
            type="submit"
            disabled={bookMutation.isPending || !selectedSlot}
            className="w-full py-4 rounded-xl text-white font-semibold text-lg transition-all hover:opacity-90 disabled:opacity-50 flex items-center justify-center gap-2"
            style={{ background: "#0B2F4A" }}
          >
            {bookMutation.isPending ? (
              <>
                <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white" />
                Processing...
              </>
            ) : (
              "Confirm Booking →"
            )}
          </button>
        </form>
      </main>
    </div>
  );
}
