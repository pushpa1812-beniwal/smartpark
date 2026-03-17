import { useQuery } from "@tanstack/react-query";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import type { ParkingSlot } from "../backend.d";
import { SlotStatus } from "../backend.d";
import Header from "../components/Header";
import { useActor } from "../hooks/useActor";

const statusColor: Record<SlotStatus, string> = {
  [SlotStatus.available]: "#22C55E",
  [SlotStatus.booked]: "#2563EB",
  [SlotStatus.occupied]: "#EF4444",
};

const statusLabel: Record<SlotStatus, string> = {
  [SlotStatus.available]: "Available",
  [SlotStatus.booked]: "Booked",
  [SlotStatus.occupied]: "Occupied",
};

export default function Dashboard() {
  const { actor } = useActor();
  const navigate = useNavigate();
  const [selectedZone, setSelectedZone] = useState<string>("all");

  const { data: slots = [], isLoading } = useQuery({
    queryKey: ["parkingSlots"],
    queryFn: () => actor!.getParkingSlots(),
    enabled: !!actor,
    refetchInterval: 10000,
  });

  const zones = [
    "all",
    ...Array.from(new Set(slots.map((s) => s.zone))).sort(),
  ];
  const filtered =
    selectedZone === "all"
      ? slots
      : slots.filter((s) => s.zone === selectedZone);
  const available = slots.filter(
    (s) => s.status === SlotStatus.available,
  ).length;
  const occupied = slots.filter((s) => s.status === SlotStatus.occupied).length;
  const booked = slots.filter((s) => s.status === SlotStatus.booked).length;
  const totalSlots = slots.length || 1;
  const occupancy = Math.round(((occupied + booked) / totalSlots) * 100);

  const recommended = slots.find((s) => s.status === SlotStatus.available);

  const handleSlotClick = (slot: ParkingSlot) => {
    if (slot.status === SlotStatus.available) {
      navigate("/booking", { state: { selectedSlot: slot } });
    }
  };

  return (
    <div className="min-h-screen" style={{ background: "#F3F6F9" }}>
      <Header />
      <main className="max-w-7xl mx-auto px-4 sm:px-6 py-8">
        <div className="mb-8">
          <h1 className="text-2xl font-bold" style={{ color: "#111827" }}>
            Parking Dashboard
          </h1>
          <p className="text-slate-500 mt-1">
            Real-time slot availability across all zones
          </p>
        </div>

        {/* Stats Row */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          {[
            { label: "Total Slots", value: slots.length, color: "#0B2F4A" },
            { label: "Available", value: available, color: "#22C55E" },
            { label: "Booked", value: booked, color: "#2563EB" },
            { label: "Occupied", value: occupied, color: "#EF4444" },
          ].map((stat) => (
            <div
              key={stat.label}
              className="bg-white rounded-xl p-4 shadow-sm border border-slate-100"
            >
              <div className="text-2xl font-bold" style={{ color: stat.color }}>
                {stat.value}
              </div>
              <div className="text-sm text-slate-500 mt-1">{stat.label}</div>
            </div>
          ))}
        </div>

        <div className="grid lg:grid-cols-3 gap-6">
          {/* Slot Grid */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-2xl shadow-sm border border-slate-100 p-6">
              <div className="flex items-center justify-between mb-4">
                <h2 className="font-bold text-lg" style={{ color: "#0B2F4A" }}>
                  Parking Layout
                </h2>
                <div className="flex gap-2">
                  {zones.map((z) => (
                    <button
                      type="button"
                      key={z}
                      onClick={() => setSelectedZone(z)}
                      className="px-3 py-1 rounded-lg text-sm font-medium capitalize transition-colors"
                      style={{
                        background: selectedZone === z ? "#0B2F4A" : "#F3F6F9",
                        color: selectedZone === z ? "white" : "#475569",
                      }}
                    >
                      {z === "all" ? "All" : `Zone ${z}`}
                    </button>
                  ))}
                </div>
              </div>
              {isLoading ? (
                <div className="flex items-center justify-center h-48">
                  <div
                    className="animate-spin rounded-full h-10 w-10 border-b-2"
                    style={{ borderColor: "#0B2F4A" }}
                  />
                </div>
              ) : (
                <div className="grid grid-cols-6 gap-2">
                  {filtered.map((slot) => (
                    <button
                      type="button"
                      key={slot.id}
                      onClick={() => handleSlotClick(slot)}
                      title={`${slot.zone}${slot.slotNumber} - ${statusLabel[slot.status]} - $${slot.pricePerHour}/hr`}
                      className="aspect-square rounded-lg flex flex-col items-center justify-center text-white text-xs font-bold transition-transform hover:scale-105"
                      style={{
                        background: statusColor[slot.status],
                        cursor:
                          slot.status === SlotStatus.available
                            ? "pointer"
                            : "default",
                        opacity: slot.status !== SlotStatus.available ? 0.7 : 1,
                      }}
                    >
                      <span>{slot.zone}</span>
                      <span>{slot.slotNumber}</span>
                    </button>
                  ))}
                </div>
              )}
              {/* Legend */}
              <div className="flex items-center gap-4 mt-4 pt-4 border-t border-slate-100">
                {Object.entries(statusLabel).map(([status, label]) => (
                  <div key={status} className="flex items-center gap-1.5">
                    <div
                      className="w-3 h-3 rounded"
                      style={{ background: statusColor[status as SlotStatus] }}
                    />
                    <span className="text-xs text-slate-500">{label}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Sidebar */}
          <div className="space-y-4">
            {/* Occupancy */}
            <div className="bg-white rounded-2xl shadow-sm border border-slate-100 p-6">
              <h3 className="font-bold mb-3" style={{ color: "#0B2F4A" }}>
                Live Occupancy
              </h3>
              <div
                className="text-3xl font-bold mb-1"
                style={{ color: "#0B2F4A" }}
              >
                {occupancy}% Full
              </div>
              <div className="text-sm text-slate-500 mb-3">
                {occupied + booked}/{slots.length} slots
              </div>
              <div
                className="w-full h-2 rounded-full"
                style={{ background: "#E5E7EB" }}
              >
                <div
                  className="h-2 rounded-full transition-all"
                  style={{
                    width: `${occupancy}%`,
                    background:
                      occupancy > 80
                        ? "#EF4444"
                        : occupancy > 60
                          ? "#F59E0B"
                          : "#0B2F4A",
                  }}
                />
              </div>
            </div>

            {/* Recommendation */}
            {recommended && (
              <div className="bg-white rounded-2xl shadow-sm border border-slate-100 p-6">
                <h3 className="font-bold mb-3" style={{ color: "#0B2F4A" }}>
                  Recommended Slot
                </h3>
                <div className="flex items-center gap-3 mb-3">
                  <div
                    className="w-12 h-12 rounded-xl flex items-center justify-center text-white font-bold"
                    style={{ background: "#22C55E" }}
                  >
                    {recommended.zone}
                    {recommended.slotNumber}
                  </div>
                  <div>
                    <div className="font-semibold" style={{ color: "#0B2F4A" }}>
                      Zone {recommended.zone}, Slot {recommended.slotNumber}
                    </div>
                    <div className="text-sm text-slate-500">
                      Floor {Number(recommended.floor)} · $
                      {recommended.pricePerHour}/hr
                    </div>
                  </div>
                </div>
                <button
                  type="button"
                  onClick={() =>
                    navigate("/booking", {
                      state: { selectedSlot: recommended },
                    })
                  }
                  className="w-full py-2 rounded-lg text-white text-sm font-medium"
                  style={{ background: "#0B2F4A" }}
                >
                  Book This Slot
                </button>
              </div>
            )}

            {/* Quick Actions */}
            <div className="bg-white rounded-2xl shadow-sm border border-slate-100 p-6">
              <h3 className="font-bold mb-3" style={{ color: "#0B2F4A" }}>
                Quick Actions
              </h3>
              <div className="space-y-2">
                <button
                  type="button"
                  onClick={() => navigate("/history")}
                  className="w-full py-2 px-4 rounded-lg text-sm font-medium text-left flex items-center gap-2 hover:bg-slate-50"
                >
                  <span>📋</span> My Bookings
                </button>
                <button
                  type="button"
                  onClick={() => navigate("/booking")}
                  className="w-full py-2 px-4 rounded-lg text-sm font-medium text-left flex items-center gap-2 hover:bg-slate-50"
                >
                  <span>🅿️</span> Book a Slot
                </button>
              </div>
            </div>

            {/* Alerts */}
            <div className="bg-white rounded-2xl shadow-sm border border-slate-100 p-6">
              <h3 className="font-bold mb-3" style={{ color: "#0B2F4A" }}>
                System Alerts
              </h3>
              <div className="space-y-2">
                <div className="flex items-start gap-2 text-sm">
                  <span className="text-amber-500 mt-0.5">⚠️</span>
                  <span className="text-slate-600">
                    Zone B nearing capacity (85%)
                  </span>
                </div>
                <div className="flex items-start gap-2 text-sm">
                  <span className="text-green-500 mt-0.5">✅</span>
                  <span className="text-slate-600">
                    Zone A has plenty of space
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
