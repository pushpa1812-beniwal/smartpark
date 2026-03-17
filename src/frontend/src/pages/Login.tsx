import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useInternetIdentity } from "../hooks/useInternetIdentity";

export default function Login() {
  const { identity, login, isLoggingIn, isInitializing } =
    useInternetIdentity();
  const navigate = useNavigate();

  useEffect(() => {
    if (identity) navigate("/dashboard");
  }, [identity, navigate]);

  return (
    <div
      className="min-h-screen flex items-center justify-center"
      style={{
        background: "linear-gradient(135deg, #F3F6F9 0%, #EAF1F8 100%)",
      }}
    >
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <div
            className="w-16 h-16 rounded-2xl flex items-center justify-center mx-auto mb-4"
            style={{ background: "linear-gradient(135deg, #0B2F4A, #059669)" }}
          >
            <span className="text-white font-bold text-2xl">SP</span>
          </div>
          <h1 className="text-3xl font-bold" style={{ color: "#0B2F4A" }}>
            Welcome back
          </h1>
          <p className="text-slate-500 mt-2">Sign in to manage your parking</p>
        </div>
        <div className="bg-white rounded-2xl shadow-lg border border-slate-100 p-8">
          <div className="space-y-4">
            <div
              className="p-4 rounded-xl text-sm text-slate-600"
              style={{ background: "#EAF1F8" }}
            >
              <p className="font-medium mb-1" style={{ color: "#0B2F4A" }}>
                Secure Authentication
              </p>
              <p>
                SmartPark uses Internet Identity for secure, passwordless login.
                Your data is always private and encrypted.
              </p>
            </div>
            <button
              type="button"
              onClick={login}
              disabled={isLoggingIn || isInitializing}
              className="w-full py-4 rounded-xl text-white font-semibold text-lg transition-all hover:opacity-90 disabled:opacity-50 flex items-center justify-center gap-3"
              style={{
                background: "linear-gradient(135deg, #0B2F4A, #0e3a5b)",
              }}
            >
              {isLoggingIn || isInitializing ? (
                <>
                  <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white" />
                  Connecting...
                </>
              ) : (
                <>
                  <span>🔐</span>Sign In with Internet Identity
                </>
              )}
            </button>
            <p className="text-center text-sm text-slate-400">
              New user? Just click Sign In — an account will be created
              automatically.
            </p>
          </div>
        </div>
        <p className="text-center mt-6">
          <button
            type="button"
            onClick={() => navigate("/")}
            className="text-sm text-slate-500 hover:text-slate-700"
          >
            ← Back to Home
          </button>
        </p>
      </div>
    </div>
  );
}
