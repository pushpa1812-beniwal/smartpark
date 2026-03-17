import { BrowserRouter, Navigate, Route, Routes } from "react-router-dom";
import { useInternetIdentity } from "./hooks/useInternetIdentity";
import Admin from "./pages/Admin";
import Booking from "./pages/Booking";
import Dashboard from "./pages/Dashboard";
import History from "./pages/History";
import Landing from "./pages/Landing";
import Login from "./pages/Login";
import Payment from "./pages/Payment";
import QRCodePage from "./pages/QRCodePage";

function ProtectedRoute({ children }: { children: React.ReactNode }) {
  const { identity, isInitializing } = useInternetIdentity();
  if (isInitializing) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50">
        <div
          className="animate-spin rounded-full h-12 w-12 border-b-2 border-navy-600"
          style={{ borderColor: "#0B2F4A" }}
        />
      </div>
    );
  }
  if (!identity) return <Navigate to="/login" replace />;
  return <>{children}</>;
}

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Landing />} />
        <Route path="/login" element={<Login />} />
        <Route
          path="/dashboard"
          element={
            <ProtectedRoute>
              <Dashboard />
            </ProtectedRoute>
          }
        />
        <Route
          path="/booking"
          element={
            <ProtectedRoute>
              <Booking />
            </ProtectedRoute>
          }
        />
        <Route
          path="/payment/:bookingId"
          element={
            <ProtectedRoute>
              <Payment />
            </ProtectedRoute>
          }
        />
        <Route
          path="/history"
          element={
            <ProtectedRoute>
              <History />
            </ProtectedRoute>
          }
        />
        <Route
          path="/admin"
          element={
            <ProtectedRoute>
              <Admin />
            </ProtectedRoute>
          }
        />
        <Route
          path="/qr/:bookingId"
          element={
            <ProtectedRoute>
              <QRCodePage />
            </ProtectedRoute>
          }
        />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  );
}
