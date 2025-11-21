"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";

export default function SignupPage(): any {
  const router = useRouter();
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
  });
  const [showPassword, setShowPassword] = useState(false);
  const [agreeTerms, setAgreeTerms] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  const validate = () => {
    if (!formData.name) return "Please enter your name.";
    if (!formData.email) return "Please enter your email.";
    if (!/^\S+@\S+\.\S+$/.test(formData.email)) return "Please enter a valid email.";
    if (!formData.password) return "Please enter a password.";
    if (formData.password.length < 8) return "Password must be at least 8 characters.";
    if (!agreeTerms) return "Please agree to the terms and conditions.";
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

      const res = await fetch("/api/auth/signup", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: formData.name,
          email: formData.email,
          password: formData.password,
        }),
      });

      if (!res.ok) {
        const payload = await res.json().catch(() => ({}));
        const msg = payload?.message || `Signup failed (${res.status})`;
        throw new Error(msg);
      }

      const data = await res.json();
      setSuccess("Account created successfully — redirecting...");
      console.log("signup success:", data);
      
      setTimeout(() => {
        router.push("/login");
      }, 2000);
    } catch (err: any) {
      setError(err?.message || "Something went wrong. Try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="h-screen w-screen bg-[#0c0c0f] text-gray-200 flex items-center justify-center p-4 sm:p-6 overflow-hidden">
      {/* Loading Overlay */}
      {loading && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 animate-fade-in">
          <div className="bg-[#0f1013] border border-white/10 rounded-2xl p-8 flex flex-col items-center gap-4 shadow-2xl animate-scale-in">
            <div className="relative">
              <div className="w-16 h-16 border-4 border-indigo-500/30 border-t-indigo-500 rounded-full animate-spin-fast"></div>
              <div className="absolute inset-0 w-16 h-16 border-4 border-transparent border-r-violet-500 rounded-full animate-spin-reverse"></div>
            </div>
            <div className="text-center">
              <p className="text-white font-semibold text-lg mb-1">Creating your account</p>
              <p className="text-gray-400 text-sm animate-pulse">Please wait a moment...</p>
            </div>
            <div className="flex gap-1">
              <div className="w-2 h-2 bg-indigo-500 rounded-full animate-bounce" style={{ animationDelay: '0ms' }}></div>
              <div className="w-2 h-2 bg-violet-500 rounded-full animate-bounce" style={{ animationDelay: '150ms' }}></div>
              <div className="w-2 h-2 bg-indigo-400 rounded-full animate-bounce" style={{ animationDelay: '300ms' }}></div>
            </div>
          </div>
        </div>
      )}

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

      <div className="w-full max-w-5xl grid grid-cols-1 lg:grid-cols-2 gap-6 items-center">
        
        {/* Left: Branding (hidden on mobile/tablet) */}
        <aside className="hidden lg:flex flex-col justify-between max-h-[550px] rounded-xl p-6 bg-gradient-to-b from-[#0f1114] to-[#0b0b0d] border border-white/6 shadow-lg">
          <div>
            <div className="flex items-center gap-2 mb-4">
              <div className="rounded-lg bg-gradient-to-r from-indigo-600 to-violet-500 p-0.5">
                <div className="bg-[#0c0c0f] rounded-md px-3 py-1 font-bold text-sm text-indigo-300">
                  CollabBoard
                </div>
              </div>
            </div>
            
            <h2 className="text-2xl font-extrabold text-white mb-2">Start your journey</h2>
            <p className="text-gray-400 text-sm leading-relaxed">
              Join thousands of teams collaborating better every day
            </p>

            <div className="mt-6 space-y-3">
              <div className="flex items-start gap-2">
                <div className="w-1.5 h-1.5 rounded-full bg-indigo-500 mt-1.5"></div>
                <p className="text-sm text-gray-300">Free forever for small teams</p>
              </div>
              <div className="flex items-start gap-2">
                <div className="w-1.5 h-1.5 rounded-full bg-violet-500 mt-1.5"></div>
                <p className="text-sm text-gray-300">No credit card required</p>
              </div>
              <div className="flex items-start gap-2">
                <div className="w-1.5 h-1.5 rounded-full bg-indigo-400 mt-1.5"></div>
                <p className="text-sm text-gray-300">Start collaborating in minutes</p>
              </div>
            </div>
          </div>

          <div className="text-xs text-gray-500 mt-4 pt-4 border-t border-white/5">
            By signing up you agree to our{" "}
            <Link href="#" className="text-indigo-400 hover:underline">Terms</Link> and{" "}
            <Link href="#" className="text-indigo-400 hover:underline">Privacy</Link>
          </div>
        </aside>

        {/* Right: Signup Card */}
        <section className="flex items-center justify-center">
          <div className="w-full max-w-md bg-[#0f1013] border border-white/7 rounded-xl p-6 sm:p-7 shadow-lg">
            
            {/* Mobile logo */}
            <div className="lg:hidden flex justify-center mb-5">
              <div className="rounded-lg bg-gradient-to-r from-indigo-600 to-violet-500 p-0.5">
                <div className="bg-[#0c0c0f] rounded-md px-3 py-1 font-bold text-sm text-indigo-300">
                  CollabBoard
                </div>
              </div>
            </div>

            <header className="mb-5">
              <h1 className="text-2xl sm:text-3xl font-extrabold text-white">Create account</h1>
              <p className="mt-1.5 text-sm text-gray-400">
                Get started with your free account
              </p>
            </header>

            <form onSubmit={onSubmit} className="space-y-3.5">
              {error && (
                <div className="rounded-lg bg-red-900/20 border border-red-800/20 p-2 text-red-300 text-xs sm:text-sm animate-shake">
                  {error}
                </div>
              )}
              {success && (
                <div className="rounded-lg bg-green-900/20 border border-green-800/20 p-2 text-green-200 text-xs sm:text-sm animate-slide-down">
                  {success}
                </div>
              )}

              <label className="block">
                <span className="text-xs sm:text-sm font-medium text-gray-300">Full Name</span>
                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  autoComplete="name"
                  required
                  disabled={loading}
                  className="mt-1.5 w-full px-3 py-2.5 rounded-lg bg-[#0b0b0c] border border-white/6 text-gray-100 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-indigo-500 transition text-sm disabled:opacity-50 disabled:cursor-not-allowed"
                  placeholder="John Doe"
                />
              </label>

              <label className="block">
                <span className="text-xs sm:text-sm font-medium text-gray-300">Email</span>
                <input
                  type="email"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  autoComplete="email"
                  required
                  disabled={loading}
                  className="mt-1.5 w-full px-3 py-2.5 rounded-lg bg-[#0b0b0c] border border-white/6 text-gray-100 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-indigo-500 transition text-sm disabled:opacity-50 disabled:cursor-not-allowed"
                  placeholder="you@company.com"
                />
              </label>

              <label className="block relative">
                <span className="text-xs sm:text-sm font-medium text-gray-300">Password</span>
                <input
                  type={showPassword ? "text" : "password"}
                  value={formData.password}
                  onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                  autoComplete="new-password"
                  required
                  disabled={loading}
                  className="mt-1.5 w-full px-3 py-2.5 rounded-lg bg-[#0b0b0c] border border-white/6 text-gray-100 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-indigo-500 transition text-sm disabled:opacity-50 disabled:cursor-not-allowed"
                  placeholder="Min. 8 characters"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword((s) => !s)}
                  disabled={loading}
                  className="absolute right-3 top-[35px] text-xs text-gray-400 hover:text-gray-200 disabled:opacity-50"
                  aria-label={showPassword ? "Hide password" : "Show password"}
                >
                  {showPassword ? "Hide" : "Show"}
                </button>
              </label>

              <div className="pt-0.5">
                <label className="inline-flex items-start gap-1.5 text-xs text-gray-300 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={agreeTerms}
                    onChange={(e) => setAgreeTerms(e.target.checked)}
                    disabled={loading}
                    className="w-3.5 h-3.5 mt-0.5 rounded bg-[#0b0b0c] border-white/8 focus:ring-indigo-400 disabled:opacity-50 disabled:cursor-not-allowed"
                  />
                  <span>
                    I agree to the{" "}
                    <Link href="#" className="text-indigo-400 hover:underline">
                      Terms & Conditions
                    </Link>{" "}
                    and{" "}
                    <Link href="#" className="text-indigo-400 hover:underline">
                      Privacy Policy
                    </Link>
                  </span>
                </label>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full mt-3 inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-lg bg-gradient-to-r from-indigo-600 to-violet-500 hover:from-indigo-500 hover:to-violet-400 disabled:opacity-70 disabled:cursor-not-allowed text-white font-semibold text-sm shadow-lg shadow-indigo-500/20 hover:shadow-indigo-500/30 transition-all transform hover:-translate-y-0.5 active:translate-y-0 disabled:transform-none"
              >
                {loading ? (
                  <>
                    <svg className="animate-spin h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z"></path>
                    </svg>
                    Creating account...
                  </>
                ) : (
                  "Create account"
                )}
              </button>

              <div className="relative py-2">
                <div className="absolute inset-0 flex items-center">
                  <div className="w-full border-t border-white/10"></div>
                </div>
                <div className="relative flex justify-center text-xs">
                  <span className="px-2 bg-[#0f1013] text-gray-400">or</span>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-2.5">
                <button
                  type="button"
                  onClick={() => alert("Implement Google OAuth")}
                  disabled={loading}
                  className="w-full inline-flex items-center justify-center gap-1.5 rounded-lg border border-white/8 px-2.5 py-2 text-xs bg-[#0b0b0c] hover:bg-white/5 transition disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <svg width="14" height="14" viewBox="0 0 48 48" aria-hidden="true">
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
                  disabled={loading}
                  className="w-full inline-flex items-center justify-center gap-1.5 rounded-lg border border-white/8 px-2.5 py-2 text-xs bg-[#0b0b0c] hover:bg-white/5 transition disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
                    <path d="M12 2L2 7v7c0 5.55 3.84 10.74 10 12 6.16-1.26 10-6.45 10-12V7l-10-5zm0 10.99h7c-.53 4.12-3.28 7.79-7 8.94V12H5V8.3l7-3.11v8.8z"/>
                  </svg>
                  <span className="hidden sm:inline">SSO</span>
                </button>
              </div>
            </form>

            <p className="mt-4 text-center text-xs text-gray-400">
              Already have an account?{" "}
              <Link href="/login" className="text-indigo-400 hover:underline font-medium">Sign in</Link>
            </p>
          </div>
        </section>
      </div>

      <style jsx>{`
        @keyframes spin-fast {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
        @keyframes spin-reverse {
          from { transform: rotate(360deg); }
          to { transform: rotate(0deg); }
        }
        @keyframes fade-in {
          from {
            opacity: 0;
          }
          to {
            opacity: 1;
          }
        }
        @keyframes scale-in {
          from {
            opacity: 0;
            transform: scale(0.9);
          }
          to {
            opacity: 1;
            transform: scale(1);
          }
        }
        @keyframes shake {
          0%, 100% { transform: translateX(0); }
          25% { transform: translateX(-4px); }
          75% { transform: translateX(4px); }
        }
        @keyframes slide-down {
          from {
            opacity: 0;
            transform: translateY(-8px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        .animate-spin-fast {
          animation: spin-fast 0.8s linear infinite;
        }
        .animate-spin-reverse {
          animation: spin-reverse 1.2s linear infinite;
        }
        .animate-fade-in {
          animation: fade-in 0.2s ease-out;
        }
        .animate-scale-in {
          animation: scale-in 0.3s ease-out;
        }
        .animate-shake {
          animation: shake 0.3s ease-in-out;
        }
        .animate-slide-down {
          animation: slide-down 0.3s ease-out;
        }
      `}</style>
    </main>
  );
}
