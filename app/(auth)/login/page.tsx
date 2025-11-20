"use client";

import React, { useState } from "react";
import Link from "next/link";

export default function LoginPage(): any {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [remember, setRemember] = useState(true);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [fieldErrors, setFieldErrors] = useState<{ email?: string; password?: string }>({});
  const [touched, setTouched] = useState<{ email?: boolean; password?: boolean }>({});

  // Real-time validation
  const validateEmail = (value: string) => {
    if (!value) return "Email is required";
    if (!/^\S+@\S+\.\S+$/.test(value)) return "Please enter a valid email address";
    return null;
  };

  const validatePassword = (value: string) => {
    if (!value) return "Password is required";
    if (value.length < 6) return "Password must be at least 6 characters";
    return null;
  };

  const handleEmailBlur = () => {
    setTouched((prev) => ({ ...prev, email: true }));
    const err = validateEmail(email);
    setFieldErrors((prev) => ({ ...prev, email: err || undefined }));
  };

  const handlePasswordBlur = () => {
    setTouched((prev) => ({ ...prev, password: true }));
    const err = validatePassword(password);
    setFieldErrors((prev) => ({ ...prev, password: err || undefined }));
  };

  const handleEmailChange = (value: string) => {
    setEmail(value);
    if (touched.email) {
      const err = validateEmail(value);
      setFieldErrors((prev) => ({ ...prev, email: err || undefined }));
    }
  };

  const handlePasswordChange = (value: string) => {
    setPassword(value);
    if (touched.password) {
      const err = validatePassword(value);
      setFieldErrors((prev) => ({ ...prev, password: err || undefined }));
    }
  };

  const validate = () => {
    const emailErr = validateEmail(email);
    const passErr = validatePassword(password);
    setFieldErrors({ email: emailErr || undefined, password: passErr || undefined });
    return !emailErr && !passErr;
  };

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setSuccess(null);
    setTouched({ email: true, password: true });

    if (!validate()) {
      setError("Please fix the errors above");
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
      
      setTimeout(() => {
        // router.push("/dashboard")
      }, 1500);
    } catch (err: any) {
      setError(err?.message || "Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="min-h-screen bg-[#0d0d0f] text-gray-200 flex items-center justify-center p-4 sm:p-6 lg:p-8">
      <div className="w-full max-w-[1400px] mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 lg:gap-8 xl:gap-12 items-stretch">
          
          {/* Left: Marketing / branding - Hidden on mobile, visible on large screens */}
          <div className="hidden lg:flex flex-col gap-8 p-8 xl:p-12 rounded-3xl bg-gradient-to-br from-[#0f1114] via-[#0d0e11] to-[#0b0b0d] border border-white/5 shadow-2xl relative overflow-hidden">
            {/* Decorative gradient orbs */}
            <div className="absolute top-0 right-0 w-64 h-64 bg-indigo-600/10 rounded-full blur-3xl"></div>
            <div className="absolute bottom-0 left-0 w-72 h-72 bg-violet-600/10 rounded-full blur-3xl"></div>
            
            <div className="relative z-10 flex flex-col h-full">
              {/* Header */}
              <div className="flex items-center gap-4 mb-8">
                <div className="rounded-xl bg-gradient-to-r from-indigo-600 to-violet-500 p-1.5 shadow-lg shadow-indigo-500/30">
                  <div className="bg-[#0d0d0f] rounded-lg px-4 py-2 font-bold text-lg text-indigo-400">
                    CollabBoard
                  </div>
                </div>
              </div>

              <div>
                <h2 className="text-4xl xl:text-5xl font-extrabold text-white mb-4 leading-tight">
                  Welcome back to your workspace
                </h2>
                <p className="text-lg text-gray-400 leading-relaxed">
                  Sign in to access your collaborative dashboards and team analytics
                </p>
              </div>

              {/* Feature list */}
              <div className="mt-12 space-y-6 flex-grow">
                <div className="flex items-start gap-4 group cursor-default">
                  <div className="mt-1.5 w-12 h-12 rounded-xl bg-gradient-to-br from-indigo-500/20 to-indigo-600/20 flex items-center justify-center border border-indigo-500/30 group-hover:scale-110 transition-transform duration-300">
                    <svg className="w-6 h-6 text-indigo-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                    </svg>
                  </div>
                  <div className="flex-1">
                    <h3 className="text-xl font-semibold text-white mb-2">Real-time Collaboration</h3>
                    <p className="text-gray-400 leading-relaxed">
                      Work together with your team in real-time with instant updates and seamless sync
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-4 group cursor-default">
                  <div className="mt-1.5 w-12 h-12 rounded-xl bg-gradient-to-br from-violet-500/20 to-violet-600/20 flex items-center justify-center border border-violet-500/30 group-hover:scale-110 transition-transform duration-300">
                    <svg className="w-6 h-6 text-violet-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                    </svg>
                  </div>
                  <div className="flex-1">
                    <h3 className="text-xl font-semibold text-white mb-2">Enterprise Security</h3>
                    <p className="text-gray-400 leading-relaxed">
                      Bank-grade encryption, SSO integration, and role-based access control
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-4 group cursor-default">
                  <div className="mt-1.5 w-12 h-12 rounded-xl bg-gradient-to-br from-indigo-500/20 to-violet-600/20 flex items-center justify-center border border-indigo-500/30 group-hover:scale-110 transition-transform duration-300">
                    <svg className="w-6 h-6 text-indigo-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                    </svg>
                  </div>
                  <div className="flex-1">
                    <h3 className="text-xl font-semibold text-white mb-2">Powerful Analytics</h3>
                    <p className="text-gray-400 leading-relaxed">
                      Get actionable insights with customizable widgets and exportable reports
                    </p>
                  </div>
                </div>
              </div>

              {/* Footer */}
              <div className="mt-auto pt-8 border-t border-white/10">
                <p className="text-sm text-gray-500 leading-relaxed">
                  By signing in you agree to our{" "}
                  <Link href="#" className="text-indigo-400 hover:text-indigo-300 hover:underline transition-colors">
                    Terms of Service
                  </Link>
                  {" "}and{" "}
                  <Link href="#" className="text-indigo-400 hover:text-indigo-300 hover:underline transition-colors">
                    Privacy Policy
                  </Link>
                </p>
              </div>
            </div>
          </div>

          {/* Right: Login form - Full width on mobile, half on large screens */}
          <div className="w-full">
            <div className="bg-[#101014] border border-white/10 rounded-3xl p-6 sm:p-8 lg:p-10 xl:p-12 shadow-2xl hover:border-white/15 transition-all duration-300 h-full flex flex-col">
              
              {/* Mobile logo - Only visible on small screens */}
              <div className="lg:hidden mb-8 flex justify-center">
                <div className="rounded-xl bg-gradient-to-r from-indigo-600 to-violet-500 p-1.5 shadow-lg shadow-indigo-500/30">
                  <div className="bg-[#0d0d0f] rounded-lg px-4 py-2 font-bold text-lg text-indigo-400">
                    CollabBoard
                  </div>
                </div>
              </div>

              {/* Header */}
              <div className="mb-8">
                <h1 className="text-3xl sm:text-4xl font-extrabold text-white mb-3">Sign in to your account</h1>
                <p className="text-gray-400 text-base sm:text-lg">
                  Enter your credentials to access your team dashboards
                </p>
              </div>

              <form onSubmit={onSubmit} className="space-y-6 flex-grow flex flex-col" noValidate>
                <div className="space-y-6 flex-grow">
                  {/* Global error message */}
                  {error && (
                    <div 
                      role="alert" 
                      aria-live="assertive"
                      className="text-sm sm:text-base text-red-300 bg-red-900/20 border border-red-800/30 p-4 rounded-xl flex items-start gap-3 animate-shake"
                    >
                      <svg className="w-5 h-5 sm:w-6 sm:h-6 flex-shrink-0 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                      </svg>
                      <span>{error}</span>
                    </div>
                  )}

                  {/* Success message */}
                  {success && (
                    <div 
                      role="alert" 
                      aria-live="polite"
                      className="text-sm sm:text-base text-green-200 bg-green-900/20 border border-green-800/30 p-4 rounded-xl flex items-start gap-3 animate-slide-down"
                    >
                      <svg className="w-5 h-5 sm:w-6 sm:h-6 flex-shrink-0 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                      </svg>
                      <span>{success}</span>
                    </div>
                  )}

                  {/* Email field */}
                  <div>
                    <label htmlFor="email" className="block text-sm sm:text-base font-medium text-gray-300 mb-3">
                      Email address
                    </label>
                    <div className="relative">
                      <input
                        id="email"
                        type="email"
                        value={email}
                        onChange={(e) => handleEmailChange(e.target.value)}
                        onBlur={handleEmailBlur}
                        autoComplete="email"
                        aria-invalid={!!fieldErrors.email}
                        aria-describedby={fieldErrors.email ? "email-error" : undefined}
                        className={`w-full rounded-xl bg-[#0b0b0c] border px-4 sm:px-5 py-3 sm:py-4 text-base sm:text-lg text-gray-100 placeholder-gray-500 focus:outline-none focus:ring-2 transition-all duration-200 ${
                          fieldErrors.email
                            ? "border-red-500/50 focus:ring-red-500/50 focus:border-red-500"
                            : "border-white/6 focus:ring-indigo-500/50 focus:border-indigo-500"
                        }`}
                        placeholder="you@company.com"
                      />
                      {email && !fieldErrors.email && touched.email && (
                        <div className="absolute right-4 top-1/2 -translate-y-1/2">
                          <svg className="w-6 h-6 text-green-400 animate-scale-in" fill="currentColor" viewBox="0 0 20 20">
                            <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                          </svg>
                        </div>
                      )}
                    </div>
                    {fieldErrors.email && touched.email && (
                      <p id="email-error" role="alert" className="mt-2 text-sm text-red-300 flex items-center gap-2 animate-slide-down">
                        <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                        </svg>
                        {fieldErrors.email}
                      </p>
                    )}
                  </div>

                  {/* Password field */}
                  <div>
                    <label htmlFor="password" className="block text-sm sm:text-base font-medium text-gray-300 mb-3">
                      Password
                    </label>
                    <div className="relative">
                      <input
                        id="password"
                        type={showPassword ? "text" : "password"}
                        value={password}
                        onChange={(e) => handlePasswordChange(e.target.value)}
                        onBlur={handlePasswordBlur}
                        autoComplete="current-password"
                        aria-invalid={!!fieldErrors.password}
                        aria-describedby={fieldErrors.password ? "password-error" : undefined}
                        className={`w-full rounded-xl bg-[#0b0b0c] border pr-14 px-4 sm:px-5 py-3 sm:py-4 text-base sm:text-lg text-gray-100 placeholder-gray-500 focus:outline-none focus:ring-2 transition-all duration-200 ${
                          fieldErrors.password
                            ? "border-red-500/50 focus:ring-red-500/50 focus:border-red-500"
                            : "border-white/6 focus:ring-indigo-500/50 focus:border-indigo-500"
                        }`}
                        placeholder="Enter your password"
                      />
                      <button
                        type="button"
                        aria-label={showPassword ? "Hide password" : "Show password"}
                        onClick={() => setShowPassword((s) => !s)}
                        className="absolute right-4 top-1/2 -translate-y-1/2 text-sm text-gray-400 hover:text-gray-200 transition-colors p-2 rounded-lg hover:bg-white/5"
                      >
                        {showPassword ? (
                          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21" />
                          </svg>
                        ) : (
                          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                          </svg>
                        )}
                      </button>
                    </div>
                    {fieldErrors.password && touched.password && (
                      <p id="password-error" role="alert" className="mt-2 text-sm text-red-300 flex items-center gap-2 animate-slide-down">
                        <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                        </svg>
                        {fieldErrors.password}
                      </p>
                    )}
                  </div>

                  {/* Remember & Forgot */}
                  <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 text-sm sm:text-base pt-2">
                    <label className="inline-flex items-center gap-3 text-gray-300 cursor-pointer group">
                      <input
                        type="checkbox"
                        checked={remember}
                        onChange={(e) => setRemember(e.target.checked)}
                        className="w-5 h-5 rounded-md bg-[#0b0b0c] border-white/10 text-indigo-600 focus:ring-2 focus:ring-indigo-500 focus:ring-offset-0 focus:ring-offset-[#101014] cursor-pointer transition-all"
                      />
                      <span className="group-hover:text-white transition-colors">Remember me for 30 days</span>
                    </label>

                    <Link href="#" className="text-indigo-400 hover:text-indigo-300 hover:underline transition-colors font-medium">
                      Forgot password?
                    </Link>
                  </div>
                </div>

                {/* Submit button */}
                <div className="space-y-6 pt-4">
                  <button
                    type="submit"
                    disabled={loading}
                    className="w-full inline-flex items-center justify-center gap-3 px-6 py-4 sm:py-5 text-base sm:text-lg rounded-xl bg-gradient-to-r from-indigo-600 to-violet-500 hover:from-indigo-500 hover:to-violet-400 disabled:opacity-60 disabled:cursor-not-allowed text-white font-bold shadow-lg shadow-indigo-500/30 hover:shadow-indigo-500/40 transform hover:-translate-y-1 active:translate-y-0 transition-all duration-200"
                  >
                    {loading ? (
                      <>
                        <svg
                          className="animate-spin h-6 w-6 text-white"
                          xmlns="http://www.w3.org/2000/svg"
                          fill="none"
                          viewBox="0 0 24 24"
                        >
                          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z"></path>
                        </svg>
                        <span>Signing in...</span>
                      </>
                    ) : (
                      <>
                        <span>Sign in to your account</span>
                        <svg className="w-5 h-5 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                        </svg>
                      </>
                    )}
                  </button>

                  {/* Divider */}
                  <div className="relative">
                    <div className="absolute inset-0 flex items-center">
                      <div className="w-full border-t border-white/10"></div>
                    </div>
                    <div className="relative flex justify-center text-sm sm:text-base">
                      <span className="px-4 bg-[#101014] text-gray-400">or continue with</span>
                    </div>
                  </div>

                  {/* Social login buttons */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <button
                      type="button"
                      onClick={() => alert("Implement Google OAuth")}
                      className="w-full inline-flex items-center justify-center gap-3 rounded-xl border border-white/10 px-5 py-3.5 sm:py-4 text-sm sm:text-base bg-[#0b0b0c] hover:bg-white/5 hover:border-white/20 transition-all duration-200 transform hover:-translate-y-0.5 active:translate-y-0 font-medium"
                    >
                      <svg width="20" height="20" viewBox="0 0 48 48">
                        <path fill="#EA4335" d="M24 9.5c3.54 0 6.71 1.22 9.21 3.6l6.85-6.85C35.9 2.38 30.47 0 24 0 14.62 0 6.51 5.38 2.56 13.22l7.98 6.19C12.43 13.72 17.74 9.5 24 9.5z"/>
                        <path fill="#4285F4" d="M46.98 24.55c0-1.57-.15-3.09-.38-4.55H24v9.02h12.94c-.58 2.96-2.26 5.48-4.78 7.18l7.73 6c4.51-4.18 7.09-10.36 7.09-17.65z"/>
                        <path fill="#FBBC05" d="M10.53 28.59c-.48-1.45-.76-2.99-.76-4.59s.27-3.14.76-4.59l-7.98-6.19C.92 16.46 0 20.12 0 24c0 3.88.92 7.54 2.56 10.78l7.97-6.19z"/>
                        <path fill="#34A853" d="M24 48c6.48 0 11.93-2.13 15.89-5.81l-7.73-6c-2.15 1.45-4.92 2.3-8.16 2.3-6.26 0-11.57-4.22-13.47-9.91l-7.98 6.19C6.51 42.62 14.62 48 24 48z"/>
                      </svg>
                      <span>Google</span>
                    </button>

                    <button
                      type="button"
                      onClick={() => alert("Implement SSO / SAML")}
                      className="w-full inline-flex items-center justify-center gap-3 rounded-xl border border-white/10 px-5 py-3.5 sm:py-4 text-sm sm:text-base bg-[#0b0b0c] hover:bg-white/5 hover:border-white/20 transition-all duration-200 transform hover:-translate-y-0.5 active:translate-y-0 font-medium"
                    >
                      <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
                        <path d="M12 2L2 7v7c0 5.55 3.84 10.74 10 12 6.16-1.26 10-6.45 10-12V7l-10-5zm0 10.99h7c-.53 4.12-3.28 7.79-7 8.94V12H5V8.3l7-3.11v8.8z"/>
                      </svg>
                      <span>SSO</span>
                    </button>
                  </div>
                </div>
              </form>

              <p className="mt-8 text-center text-sm sm:text-base text-gray-400">
                Don't have an account?{" "}
                <Link href="#" className="text-indigo-400 hover:text-indigo-300 hover:underline transition-colors font-semibold">
                  Create one for free
                </Link>
              </p>
            </div>
          </div>
        </div>
      </div>

      <style jsx>{`
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
        @keyframes scale-in {
          from {
            opacity: 0;
            transform: scale(0.5);
          }
          to {
            opacity: 1;
            transform: scale(1);
          }
        }
        .animate-shake {
          animation: shake 0.3s ease-in-out;
        }
        .animate-slide-down {
          animation: slide-down 0.3s ease-out;
        }
        .animate-scale-in {
          animation: scale-in 0.2s ease-out;
        }
      `}</style>
    </main>
  );
}
