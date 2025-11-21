"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";

export default function LoginPage(): any {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [remember, setRemember] = useState(true);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  const validate = () => {
    if (!email) return "Please enter your email.";
    if (!/^\S+@\S+\.\S+$/.test(email)) return "Please enter a valid email.";
    if (!password) return "Please enter your password.";
    if (password.length < 6) return "Password must be at least 6 characters.";
    return null;
  };

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setSuccess(null);

    const v = validate();
    if (v) {
      setError(v);
      return;
    }

    try {
      setLoading(true);

      const res = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password, remember }),
      });

      if (!res.ok) {
        const payload = await res.json().catch(() => ({}));
        const msg = payload?.message || `Login failed (${res.status})`;
        throw new Error(msg);
      }

      const data = await res.json();
      setSuccess("Logged in successfully — redirecting...");
      console.log("login success:", data);
    } catch (err: any) {
      setError(err?.message || "Something went wrong. Try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="h-screen w-screen bg-[#0c0c0f] text-gray-200 flex items-center justify-center p-4 sm:p-6 overflow-hidden">
      {/* Back Button */}
      <button
        onClick={() => router.back()}
        className="absolute top-4 left-4 sm:top-6 sm:left-6 inline-flex items-center gap-2 px-3 py-2 rounded-lg border border-white/10 bg-[#0f1013] hover:bg-white/5 hover:border-white/20 text-gray-300 hover:text-white transition-all group z-10"
        aria-label="Go back"
      >
        <svg 
          className="w-5 h-5 transition-transform group-hover:-translate-x-1" 
          fill="none" 
          stroke="currentColor" 
          viewBox="0 0 24 24"
        >
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
        </svg>
        <span className="hidden sm:inline font-medium text-sm">Back</span>
      </button>

      <div className="w-full max-w-6xl h-full max-h-[95vh] grid grid-cols-1 lg:grid-cols-2 gap-4 lg:gap-6 items-center">
        
        {/* Left: Branding (hidden on mobile/tablet) */}
        <aside className="hidden lg:flex flex-col justify-between h-full max-h-[700px] rounded-2xl p-6 xl:p-8 bg-gradient-to-b from-[#0f1114] to-[#0b0b0d] border border-white/6 shadow-xl">
          <div>
            <div className="flex items-center gap-3 mb-6">
              <div className="rounded-lg bg-gradient-to-r from-indigo-600 to-violet-500 p-1">
                <div className="bg-[#0c0c0f] rounded-md px-3 py-1.5 font-bold text-indigo-300">
                  CollabBoard
                </div>
              </div>
            </div>
            
            <h2 className="text-3xl font-extrabold text-white mb-3">Welcome back</h2>
            <p className="text-gray-400 text-lg leading-relaxed">
              Fast collaboration for teams of any size
            </p>

            <div className="mt-8 space-y-4">
              <div className="flex items-start gap-3">
                <div className="w-2 h-2 rounded-full bg-indigo-500 mt-2"></div>
                <p className="text-gray-300">Shared dashboards with real-time editing</p>
              </div>
              <div className="flex items-start gap-3">
                <div className="w-2 h-2 rounded-full bg-violet-500 mt-2"></div>
                <p className="text-gray-300">Enterprise-grade security & SSO</p>
              </div>
              <div className="flex items-start gap-3">
                <div className="w-2 h-2 rounded-full bg-indigo-400 mt-2"></div>
                <p className="text-gray-300">Powerful analytics and insights</p>
              </div>
            </div>
          </div>

          <div className="text-xs text-gray-500 mt-6">
            By continuing you agree to our{" "}
            <Link href="#" className="text-indigo-400 hover:underline">Terms</Link> and{" "}
            <Link href="#" className="text-indigo-400 hover:underline">Privacy</Link>
          </div>
        </aside>

        {/* Right: Compact Login Card */}
        <section className="flex items-center justify-center h-full max-h-[700px]">
          <div className="w-full max-w-md bg-[#0f1013] border border-white/7 rounded-2xl p-6 sm:p-8 shadow-xl">
            
            {/* Mobile logo */}
            <div className="lg:hidden flex justify-center mb-6">
              <div className="rounded-lg bg-gradient-to-r from-indigo-600 to-violet-500 p-1">
                <div className="bg-[#0c0c0f] rounded-md px-3 py-1.5 font-bold text-indigo-300">
                  CollabBoard
                </div>
              </div>
            </div>

            <header className="mb-6">
              <h1 className="text-2xl sm:text-3xl font-extrabold text-white">Sign in</h1>
              <p className="mt-2 text-sm text-gray-400">
                Access your workspace and collaborate
              </p>
            </header>

            <form onSubmit={onSubmit} className="space-y-4">
              {error && (
                <div className="rounded-lg bg-red-900/20 border border-red-800/20 p-2.5 text-red-300 text-xs sm:text-sm">
                  {error}
                </div>
              )}
              {success && (
                <div className="rounded-lg bg-green-900/20 border border-green-800/20 p-2.5 text-green-200 text-xs sm:text-sm">
                  {success}
                </div>
              )}

              <label className="block">
                <span className="text-sm font-medium text-gray-300">Email</span>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  autoComplete="email"
                  required
                  className="mt-2 w-full px-4 py-3 rounded-lg bg-[#0b0b0c] border border-white/6 text-gray-100 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-indigo-500 transition text-sm sm:text-base"
                  placeholder="you@company.com"
                />
              </label>

              <label className="block relative">
                <span className="text-sm font-medium text-gray-300">Password</span>
                <input
                  type={showPassword ? "text" : "password"}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  autoComplete="current-password"
                  required
                  className="mt-2 w-full px-4 py-3 rounded-lg bg-[#0b0b0c] border border-white/6 text-gray-100 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-indigo-500 transition text-sm sm:text-base"
                  placeholder="Enter your password"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword((s) => !s)}
                  className="absolute right-3 top-[42px] text-xs sm:text-sm text-gray-400 hover:text-gray-200"
                  aria-label={showPassword ? "Hide password" : "Show password"}
                >
                  {showPassword ? "Hide" : "Show"}
                </button>
              </label>

              <div className="flex items-center justify-between text-xs sm:text-sm pt-1">
                <label className="inline-flex items-center gap-2 text-gray-300 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={remember}
                    onChange={(e) => setRemember(e.target.checked)}
                    className="w-4 h-4 rounded bg-[#0b0b0c] border-white/8 focus:ring-indigo-400"
                  />
                  <span>Remember me</span>
                </label>

                <Link href="#" className="text-indigo-400 hover:underline">
                  Forgot?
                </Link>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full mt-4 inline-flex items-center justify-center gap-2 px-5 py-3 rounded-lg bg-gradient-to-r from-indigo-600 to-violet-500 hover:from-indigo-500 hover:to-violet-400 disabled:opacity-60 text-white font-semibold text-sm sm:text-base shadow-lg shadow-indigo-500/20 transition-all"
              >
                {loading ? (
                  <>
                    <svg className="animate-spin h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z"></path>
                    </svg>
                    Signing in...
                  </>
                ) : (
                  "Sign in"
                )}
              </button>

              <div className="relative py-3">
                <div className="absolute inset-0 flex items-center">
                  <div className="w-full border-t border-white/10"></div>
                </div>
                <div className="relative flex justify-center text-xs">
                  <span className="px-3 bg-[#0f1013] text-gray-400">or</span>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <button
                  type="button"
                  onClick={() => alert("Implement Google OAuth")}
                  className="w-full inline-flex items-center justify-center gap-2 rounded-lg border border-white/8 px-3 py-2.5 text-xs sm:text-sm bg-[#0b0b0c] hover:bg-white/5 transition"
                >
                  <svg width="16" height="16" viewBox="0 0 48 48" aria-hidden="true">
                    <path fill="#EA4335" d="M24 9.5c3.54 0 6.71 1.22 9.21 3.6l6.85-6.85C35.9 2.38 30.47 0 24 0 14.62 0 6.51 5.38 2.56 13.22l7.98 6.19C12.43 13.72 17.74 9.5 24 9.5z"/>
                    <path fill="#4285F4" d="M46.98 24.55c0-1.57-.15-3.09-.38-4.55H24v9.02h12.94c-.58 2.96-2.26 5.48-4.78 7.18l7.73 6c4.51-4.18 7.09-10.36 7.09-17.65z"/>
                    <path fill="#FBBC05" d="M10.53 28.59c-.48-1.45-.76-2.99-.76-4.59s.27-3.14.76-4.59l-7.98-6.19C.92 16.46 0 20.12 0 24c0 3.88.92 7.54 2.56 10.78l7.97-6.19z"/>
                    <path fill="#34A853" d="M24 48c6.48 0 11.93-2.13 15.89-5.81l-7.73-6c-2.15 1.45-4.92 2.3-8.16 2.3-6.26 0-11.57-4.22-13.47-9.91l-7.98 6.19C6.51 42.62 14.62 48 24 48z"/>
                  </svg>
                  <span className="hidden sm:inline">Google</span>
                </button>

                <button
                  type="button"
                  onClick={() => alert("Implement SSO / SAML")}
                  className="w-full inline-flex items-center justify-center gap-2 rounded-lg border border-white/8 px-3 py-2.5 text-xs sm:text-sm bg-[#0b0b0c] hover:bg-white/5 transition"
                >
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
                    <path d="M12 2L2 7v7c0 5.55 3.84 10.74 10 12 6.16-1.26 10-6.45 10-12V7l-10-5zm0 10.99h7c-.53 4.12-3.28 7.79-7 8.94V12H5V8.3l7-3.11v8.8z"/>
                  </svg>
                  <span className="hidden sm:inline">SSO</span>
                </button>
              </div>
            </form>

            <p className="mt-5 text-center text-xs sm:text-sm text-gray-400">
              No account?{" "}
              <Link href="#" className="text-indigo-400 hover:underline font-medium">Create one</Link>
            </p>
          </div>
        </section>
      </div>
    </main>
  );
}
