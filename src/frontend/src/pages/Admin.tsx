import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { SlotStatus } from "../backend.d";
import Header from "../components/Header";
import { useActor } from "../hooks/useActor";

export default function Admin() {
  const { actor } = useActor();
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const [tab, setTab] = useState<"analytics" | "slots" | "bookings">(
    "analytics",
  );
  const [zone, setZone] = useState("A");
  const [slotNum, setSlotNum] = useState("");
  const [floor, setFloor] = useState(1);
  const [price, setPrice] = useState(5);

  const { data: isAdmin, isLoading: checkingAdmin } = useQuery({
    queryKey: ["isAdmin"],
    queryFn: () => actor!.isCallerAdmin(),
    enabled: !!actor,
  });

  useEffect(() => {
    if (!checkingAdmin && isAdmin === false) navigate("/dashboard");
  }, [isAdmin, checkingAdmin, navigate]);

  const { data: analytics } = useQuery({
    queryKey: ["analytics"],
    queryFn: () => actor!.getAnalytics(),
    enabled: !!actor && isAdmin === true,
  });

  const { data: allBookings = [] } = useQuery({
    queryKey: ["allBookings"],
    queryFn: () => actor!.getAllBookings(),
    enabled: !!actor && isAdmin === true && tab === "bookings",
  });

  const { data: slots = [] } = useQuery({
    queryKey: ["parkingSlots"],
    queryFn: () => actor!.getParkingSlots(),
    enabled: !!actor && isAdmin === true,
  });

  const addSlotMutation = useMutation({
    mutationFn: () => actor!.addSlot(zone, slotNum, BigInt(floor), price),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["parkingSlots"] });
      setSlotNum("");
    },
  });

  const removeSlotMutation = useMutation({
    mutationFn: (id: string) => actor!.removeSlot(id),
    onSuccess: () =>
      queryClient.invalidateQueries({ queryKey: ["parkingSlots"] }),
  });

  const updateStatusMutation = useMutation({
    mutationFn: ({ id, status }: { id: string; status: SlotStatus }) =>
      actor!.updateSlotStatus(id, status),
    onSuccess: () =>
      queryClient.invalidateQueries({ queryKey: ["parkingSlots"] }),
  });

  if (checkingAdmin) {
    return (
      <div className="min-h-screen" style={{ background: "#F3F6F9" }}>
        <Header />
        <div className="flex justify-center py-20">
          <div
            className="animate-spin rounded-full h-10 w-10 border-b-2"
            style={{ borderColor: "#0B2F4A" }}
          />
        </div>
      </div>
    );
  }

  if (!isAdmin) return null;

  return (
    <div className="min-h-screen" style={{ background: "#F3F6F9" }}>
      <Header />
      <main className="max-w-6xl mx-auto px-4 sm:px-6 py-8">
        <div className="mb-8">
          <h1 className="text-2xl font-bold" style={{ color: "#0B2F4A" }}>
            Admin Panel
          </h1>
          <p className="text-slate-500 mt-1">
            Manage parking slots, bookings, and view analytics
          </p>
        </div>

        <div className="flex gap-2 mb-6">
          {(["analytics", "slots", "bookings"] as const).map((t) => (
            <button
              type="button"
              key={t}
              onClick={() => setTab(t)}
              className="px-4 py-2 rounded-lg text-sm font-medium capitalize transition-colors"
              style={{
                background: tab === t ? "#0B2F4A" : "#F3F6F9",
                color: tab === t ? "white" : "#475569",
              }}
            >
              {t}
            </button>
          ))}
        </div>

        {tab === "analytics" && (
          <div className="grid md:grid-cols-3 gap-6">
            {[
              {
                label: "Total Bookings",
                value: Number(analytics?.totalBookings ?? 0),
                icon: "📋",
                color: "#0B2F4A",
              },
              {
                label: "Available Slots",
                value: Number(analytics?.availableSlots ?? 0),
                icon: "🟢",
                color: "#22C55E",
              },
              {
                label: "Occupied Slots",
                value: Number(analytics?.occupiedSlots ?? 0),
                icon: "🔴",
                color: "#EF4444",
              },
            ].map((stat) => (
              <div
                key={stat.label}
                className="bg-white rounded-2xl shadow-sm border border-slate-100 p-6"
              >
                <div className="text-3xl mb-2">{stat.icon}</div>
                <div
                  className="text-3xl font-bold mb-1"
                  style={{ color: stat.color }}
                >
                  {stat.value}
                </div>
                <div className="text-slate-500">{stat.label}</div>
              </div>
            ))}
            {/* Occupancy bar */}
            <div className="bg-white rounded-2xl shadow-sm border border-slate-100 p-6 md:col-span-3">
              <h3 className="font-bold mb-4" style={{ color: "#0B2F4A" }}>
                Slot Utilization
              </h3>
              <div className="space-y-3">
                {[
                  {
                    label: "Available",
                    count: Number(analytics?.availableSlots ?? 0),
                    color: "#22C55E",
                  },
                  {
                    label: "Occupied",
                    count: Number(analytics?.occupiedSlots ?? 0),
                    color: "#EF4444",
                  },
                  { label: "Total", count: slots.length, color: "#0B2F4A" },
                ].map((item) => (
                  <div key={item.label}>
                    <div className="flex justify-between text-sm mb-1">
                      <span className="text-slate-600">{item.label}</span>
                      <span className="font-medium">{item.count}</span>
                    </div>
                    <div
                      className="w-full h-2 rounded-full"
                      style={{ background: "#E5E7EB" }}
                    >
                      <div
                        className="h-2 rounded-full"
                        style={{
                          width: `${slots.length ? (item.count / slots.length) * 100 : 0}%`,
                          background: item.color,
                        }}
                      />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {tab === "slots" && (
          <div className="space-y-6">
            {/* Add Slot */}
            <div className="bg-white rounded-2xl shadow-sm border border-slate-100 p-6">
              <h3 className="font-bold mb-4" style={{ color: "#0B2F4A" }}>
                Add New Slot
              </h3>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
                <div>
                  <label
                    htmlFor="admin-zone"
                    className="block text-xs text-slate-500 mb-1"
                  >
                    Zone
                  </label>
                  <select
                    id="admin-zone"
                    value={zone}
                    onChange={(e) => setZone(e.target.value)}
                    className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm"
                  >
                    {["A", "B", "C", "D", "E"].map((z) => (
                      <option key={z}>{z}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label
                    htmlFor="admin-slot"
                    className="block text-xs text-slate-500 mb-1"
                  >
                    Slot #
                  </label>
                  <input
                    id="admin-slot"
                    value={slotNum}
                    onChange={(e) => setSlotNum(e.target.value)}
                    placeholder="e.g. 07"
                    className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm"
                  />
                </div>
                <div>
                  <label
                    htmlFor="admin-floor"
                    className="block text-xs text-slate-500 mb-1"
                  >
                    Floor
                  </label>
                  <input
                    id="admin-floor"
                    type="number"
                    value={floor}
                    onChange={(e) => setFloor(Number(e.target.value))}
                    min="0"
                    max="10"
                    className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm"
                  />
                </div>
                <div>
                  <label
                    htmlFor="admin-price"
                    className="block text-xs text-slate-500 mb-1"
                  >
                    Price/hr ($)
                  </label>
                  <input
                    id="admin-price"
                    type="number"
                    value={price}
                    onChange={(e) => setPrice(Number(e.target.value))}
                    min="1"
                    className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm"
                  />
                </div>
              </div>
              <button
                type="button"
                onClick={() => addSlotMutation.mutate()}
                disabled={addSlotMutation.isPending || !slotNum}
                className="px-6 py-2 rounded-lg text-white text-sm font-medium disabled:opacity-50"
                style={{ background: "#0B2F4A" }}
              >
                {addSlotMutation.isPending ? "Adding..." : "+ Add Slot"}
              </button>
            </div>
            {/* Slot list */}
            <div className="bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden">
              <div className="p-4 border-b border-slate-100">
                <h3 className="font-bold" style={{ color: "#0B2F4A" }}>
                  All Slots ({slots.length})
                </h3>
              </div>
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="bg-slate-50">
                      {[
                        "Zone",
                        "Slot #",
                        "Floor",
                        "Price/hr",
                        "Status",
                        "Actions",
                      ].map((h) => (
                        <th
                          key={h}
                          className="text-left px-4 py-3 text-xs font-medium text-slate-500 uppercase"
                        >
                          {h}
                        </th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {slots.map((s) => (
                      <tr
                        key={s.id}
                        className="border-t border-slate-50 hover:bg-slate-50"
                      >
                        <td className="px-4 py-3 font-medium">{s.zone}</td>
                        <td className="px-4 py-3">{s.slotNumber}</td>
                        <td className="px-4 py-3">{Number(s.floor)}</td>
                        <td className="px-4 py-3">${s.pricePerHour}/hr</td>
                        <td className="px-4 py-3">
                          <select
                            value={s.status}
                            onChange={(e) =>
                              updateStatusMutation.mutate({
                                id: s.id,
                                status: e.target.value as SlotStatus,
                              })
                            }
                            className="text-xs px-2 py-1 rounded-lg border border-slate-200"
                          >
                            {Object.values(SlotStatus).map((st) => (
                              <option key={st} value={st}>
                                {st}
                              </option>
                            ))}
                          </select>
                        </td>
                        <td className="px-4 py-3">
                          <button
                            type="button"
                            onClick={() => removeSlotMutation.mutate(s.id)}
                            className="text-xs text-red-500 hover:text-red-700 font-medium"
                          >
                            Remove
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {tab === "bookings" && (
          <div className="bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden">
            <div className="p-4 border-b border-slate-100">
              <h3 className="font-bold" style={{ color: "#0B2F4A" }}>
                All Bookings ({allBookings.length})
              </h3>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="bg-slate-50">
                    {[
                      "Booking ID",
                      "Slot",
                      "Vehicle",
                      "Duration",
                      "Status",
                      "Payment",
                    ].map((h) => (
                      <th
                        key={h}
                        className="text-left px-4 py-3 text-xs font-medium text-slate-500 uppercase"
                      >
                        {h}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {allBookings.map((b) => (
                    <tr
                      key={b.id}
                      className="border-t border-slate-50 hover:bg-slate-50"
                    >
                      <td className="px-4 py-3 font-mono text-xs">
                        {b.id.slice(0, 8)}...
                      </td>
                      <td className="px-4 py-3 font-medium">{b.slotId}</td>
                      <td className="px-4 py-3">{b.vehicleNumber}</td>
                      <td className="px-4 py-3">{Number(b.durationHours)}h</td>
                      <td className="px-4 py-3">
                        <span
                          className="px-2 py-0.5 rounded-full text-xs font-medium text-white"
                          style={{
                            background:
                              b.status === "active"
                                ? "#22C55E"
                                : b.status === "cancelled"
                                  ? "#EF4444"
                                  : "#2563EB",
                          }}
                        >
                          {b.status}
                        </span>
                      </td>
                      <td className="px-4 py-3">
                        <span
                          className="px-2 py-0.5 rounded-full text-xs font-medium"
                          style={{
                            background:
                              b.paymentStatus === "paid"
                                ? "#dcfce7"
                                : "#fef3c7",
                            color:
                              b.paymentStatus === "paid"
                                ? "#15803d"
                                : "#92400e",
                          }}
                        >
                          {b.paymentStatus}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
              {allBookings.length === 0 && (
                <p className="text-center text-slate-400 py-8">
                  No bookings yet
                </p>
              )}
            </div>
          </div>
        )}
      </main>
    </div>
  );
}
