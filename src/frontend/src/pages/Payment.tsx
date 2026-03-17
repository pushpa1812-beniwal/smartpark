import { useMutation } from "@tanstack/react-query";
import { useState } from "react";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import type { Booking } from "../backend.d";
import Header from "../components/Header";
import { useActor } from "../hooks/useActor";

export default function Payment() {
  const { bookingId } = useParams<{ bookingId: string }>();
  const location = useLocation();
  const navigate = useNavigate();
  const { actor } = useActor();
  const booking = location.state?.booking as Booking | undefined;
  const totalPrice = location.state?.totalPrice as number | undefined;

  const [payMethod, setPayMethod] = useState<"upi" | "card">("upi");
  const [upiId, setUpiId] = useState("");
  const [cardNum, setCardNum] = useState("");
  const [expiry, setExpiry] = useState("");
  const [cvv, setCvv] = useState("");
  const [success, setSuccess] = useState(false);

  const payMutation = useMutation({
    mutationFn: async () => {
      if (!actor || !bookingId) throw new Error("No booking");
      await actor.confirmPayment(bookingId);
    },
    onSuccess: () => setSuccess(true),
  });

  if (success) {
    return (
      <div className="min-h-screen" style={{ background: "#F3F6F9" }}>
        <Header />
        <main className="max-w-md mx-auto px-4 py-16 text-center">
          <div className="bg-white rounded-2xl shadow-sm border border-slate-100 p-8">
            <div
              className="w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-6"
              style={{ background: "#dcfce7" }}
            >
              <span className="text-4xl">✅</span>
            </div>
            <h2
              className="text-2xl font-bold mb-2"
              style={{ color: "#0B2F4A" }}
            >
              Payment Successful!
            </h2>
            <p className="text-slate-500 mb-6">
              Your parking slot is confirmed. Your QR code is ready.
            </p>
            <div className="space-y-3">
              <button
                type="button"
                onClick={() => navigate(`/qr/${bookingId}`)}
                className="w-full py-3 rounded-xl text-white font-semibold"
                style={{ background: "#0B2F4A" }}
              >
                View QR Code
              </button>
              <button
                type="button"
                onClick={() => navigate("/history")}
                className="w-full py-3 rounded-xl text-slate-600 font-semibold border border-slate-200"
              >
                My Bookings
              </button>
            </div>
          </div>
        </main>
      </div>
    );
  }

  return (
    <div className="min-h-screen" style={{ background: "#F3F6F9" }}>
      <Header />
      <main className="max-w-md mx-auto px-4 sm:px-6 py-8">
        <div className="mb-6">
          <button
            type="button"
            onClick={() => navigate(-1)}
            className="text-sm text-slate-500 hover:text-slate-700 mb-4 flex items-center gap-1"
          >
            ← Back
          </button>
          <h1 className="text-2xl font-bold" style={{ color: "#0B2F4A" }}>
            Payment
          </h1>
        </div>

        {/* Order Summary */}
        <div className="bg-white rounded-2xl shadow-sm border border-slate-100 p-5 mb-5">
          <h2 className="font-bold mb-3" style={{ color: "#0B2F4A" }}>
            Order Summary
          </h2>
          <div className="flex justify-between text-sm mb-1">
            <span className="text-slate-500">Booking ID</span>
            <span className="font-mono text-xs">
              {bookingId?.slice(0, 12)}...
            </span>
          </div>
          <div className="flex justify-between text-sm">
            <span className="text-slate-500">Vehicle</span>
            <span>{booking?.vehicleNumber || "-"}</span>
          </div>
          <div className="flex justify-between font-bold text-base mt-3 pt-3 border-t border-slate-100">
            <span style={{ color: "#0B2F4A" }}>Total Due</span>
            <span style={{ color: "#059669" }}>
              ${totalPrice?.toFixed(2) ?? "0.00"}
            </span>
          </div>
        </div>

        {/* Payment Method */}
        <div className="bg-white rounded-2xl shadow-sm border border-slate-100 p-6">
          <div className="flex gap-2 mb-5">
            {(["upi", "card"] as const).map((m) => (
              <button
                type="button"
                key={m}
                onClick={() => setPayMethod(m)}
                className="flex-1 py-2 rounded-lg text-sm font-medium capitalize transition-colors"
                style={{
                  background: payMethod === m ? "#0B2F4A" : "#F3F6F9",
                  color: payMethod === m ? "white" : "#475569",
                }}
              >
                {m.toUpperCase()}
              </button>
            ))}
          </div>

          {payMethod === "upi" ? (
            <div>
              <label
                htmlFor="upi-id"
                className="block text-sm font-medium text-slate-600 mb-1"
              >
                UPI ID
              </label>
              <input
                id="upi-id"
                value={upiId}
                onChange={(e) => setUpiId(e.target.value)}
                placeholder="yourname@upi"
                className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
          ) : (
            <div className="space-y-3">
              <div>
                <label
                  htmlFor="card-num"
                  className="block text-sm font-medium text-slate-600 mb-1"
                >
                  Card Number
                </label>
                <input
                  id="card-num"
                  value={cardNum}
                  onChange={(e) => setCardNum(e.target.value)}
                  placeholder="1234 5678 9012 3456"
                  className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label
                    htmlFor="expiry"
                    className="block text-sm font-medium text-slate-600 mb-1"
                  >
                    Expiry
                  </label>
                  <input
                    id="expiry"
                    value={expiry}
                    onChange={(e) => setExpiry(e.target.value)}
                    placeholder="MM/YY"
                    className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                <div>
                  <label
                    htmlFor="cvv"
                    className="block text-sm font-medium text-slate-600 mb-1"
                  >
                    CVV
                  </label>
                  <input
                    id="cvv"
                    value={cvv}
                    onChange={(e) => setCvv(e.target.value)}
                    placeholder="123"
                    type="password"
                    className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
              </div>
            </div>
          )}

          <button
            type="button"
            onClick={() => payMutation.mutate()}
            disabled={payMutation.isPending}
            className="w-full mt-5 py-4 rounded-xl text-white font-semibold flex items-center justify-center gap-2 transition-all hover:opacity-90 disabled:opacity-50"
            style={{ background: "#059669" }}
          >
            {payMutation.isPending ? (
              <>
                <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white" />
                Processing...
              </>
            ) : (
              `Pay $${totalPrice?.toFixed(2) ?? "0.00"}`
            )}
          </button>
        </div>
      </main>
    </div>
  );
}
