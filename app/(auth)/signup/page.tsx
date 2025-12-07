'use client'
import React, { useState, useEffect } from "react";
import { signIn, useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { 
  Mail, Lock, User as UserIcon, ArrowLeft, CheckCircle2, 
  AlertCircle, Loader2, Eye, EyeOff, Shield, 
  Zap, Layout, Check 
} from 'lucide-react';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000';

const Card = ({ children, className = "" }: { children: React.ReactNode; className?: string }) => (
  <div className={`relative overflow-hidden border border-white/10 bg-zinc-900/50 ${className}`}>
    <div className="relative z-10 h-full">{children}</div>
  </div>
);

export default function SignupPage() {
  const router = useRouter();
  const { data: session } = useSession();
  
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
  });
  const [showPassword, setShowPassword] = useState(false);
  const [agreeTerms, setAgreeTerms] = useState(false);
  const [loading, setLoading] = useState(false);
  const [googleLoading, setGoogleLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  // If already logged in via Google/NextAuth, redirect
  useEffect(() => {
    if (session) {
      router.replace("/workspace");
    }
  }, [session, router]);

  const validate = (): string | null => {
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
      
      const res = await fetch(`${API_URL}/api/auth/signup`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.message || "Signup failed");
      }

      // Save token for Dashboard
      localStorage.setItem('auth_token', data.token);
      localStorage.setItem('user', JSON.stringify(data.user));

      setSuccess("Account created successfully — redirecting...");
      setTimeout(() => {
        router.push("/workspace");
      }, 1000);

    } catch (err: any) {
      setError(err.message || "Something went wrong. Try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleSignIn = async () => {
    try {
      setGoogleLoading(true);
      setError(null);
      await signIn("google", { 
        callbackUrl: "/workspace",
        redirect: true 
      });
    } catch (err: any) {
      setError("Google sign-in failed.");
      setGoogleLoading(false);
    }
  };

  return (
    <div className="min-h-screen w-full bg-[#050505] text-slate-300 font-sans selection:bg-indigo-500/30 flex items-center justify-center p-4 relative overflow-hidden">
      
      <div className="absolute inset-0 z-0 pointer-events-none">
        <div className="absolute inset-0 bg-black bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:24px_24px]"></div>
        <div className="absolute top-[-10%] left-[-10%] w-[500px] h-[500px] bg-indigo-600/20 rounded-full blur-[128px] opacity-40 mix-blend-screen animate-pulse" />
      </div>

      <button onClick={() => router.back()} className="fixed top-6 cursor-pointer left-6 inline-flex items-center gap-2 px-4 py-2 rounded-full border border-white/5 bg-white/5 hover:bg-white/10 text-slate-400 hover:text-white transition-all group z-20 backdrop-blur-md">
        <ArrowLeft className="w-4 h-4 transition-transform group-hover:-translate-x-1" />
        <span className="hidden sm:inline font-medium text-sm">Back</span>
      </button>

      <div className="w-full max-w-6xl grid grid-cols-1 lg:grid-cols-2 gap-0 lg:gap-12 items-center relative z-10 animate-in fade-in zoom-in-95 duration-500">
        <div className="hidden lg:flex h-full min-h-[650px] flex-col justify-between p-1 rounded-3xl relative overflow-hidden group">
            <Card className="h-full rounded-3xl">
                <div className="relative z-10 h-full flex flex-col justify-between p-12">
                    <div>
                        <div className="flex items-center gap-3 mb-12">
                            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center text-white font-bold shadow-lg shadow-indigo-500/20">C</div>
                            <span className="text-white font-bold text-xl tracking-tight">CollabBoard</span>
                        </div>
                        <h2 className="text-5xl font-bold text-white leading-tight mb-6">
                            Start your journey <br/>
                            <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 to-purple-400">with us today.</span>
                        </h2>
                        <p className="text-slate-400 text-lg max-w-md leading-relaxed">Join thousands of teams collaborating better every day.</p>
                    </div>
                    {/* Features list ... */}
                    <div className="space-y-6">
                        {[{ icon: Zap, text: "Free forever for small teams" }, { icon: Shield, text: "No credit card required" }, { icon: Layout, text: "Start collaborating in minutes" }]
                        .map((feature, idx) => (
                            <div key={idx} className="flex items-center gap-4 group/item">
                                <div className="w-10 h-10 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center text-indigo-400 group-hover/item:bg-indigo-500/20 transition-all"><feature.icon className="w-5 h-5" /></div>
                                <p className="text-slate-300 font-medium">{feature.text}</p>
                            </div>
                        ))}
                    </div>
                    <div className="mt-12 pt-8 border-t border-white/5 text-xs text-slate-500 flex gap-6"><span>© 2024 CollabBoard Inc.</span></div>
                </div>
            </Card>
        </div>

        <div className="flex justify-center w-full px-4 lg:px-0">
           <Card className="w-full max-w-[480px] rounded-3xl p-8 sm:p-10 shadow-2xl">
              <header className="mb-8 text-center lg:text-left">
                <h1 className="text-2xl sm:text-3xl font-bold text-white mb-2 tracking-tight">Create account</h1>
                <p className="text-slate-400 text-sm">Get started with your free account</p>
              </header>

              <button type="button" onClick={handleGoogleSignIn} disabled={loading || googleLoading} className="w-full mb-6 flex items-center justify-center gap-3 px-4 py-3 bg-zinc-900 border border-white/10 text-slate-200 font-medium rounded-xl hover:bg-zinc-800 hover:border-white/20 transition-all active:scale-[0.98] disabled:opacity-50 group">
                {googleLoading ? <Loader2 className="w-5 h-5 animate-spin" /> : (
                    <>
                        <svg className="w-5 h-5" viewBox="0 0 24 24"><path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" /><path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" /><path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" /><path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" /></svg>
                        <span>Continue with Google</span>
                    </>
                )}
              </button>

              <div className="relative py-4 mb-6">
                <div className="absolute inset-0 flex items-center"><div className="w-full border-t border-white/10"></div></div>
                <div className="relative flex justify-center text-xs uppercase tracking-wider"><span className="px-4 bg-[#0F0F12] text-slate-500">or sign up with email</span></div>
              </div>

              <form onSubmit={onSubmit} className="space-y-5">
                {error && <div className="flex items-start gap-3 bg-red-500/10 border border-red-500/20 p-4 rounded-xl text-red-400 text-sm"><AlertCircle className="w-5 h-5 flex-shrink-0 mt-0.5" /><span>{error}</span></div>}
                {success && <div className="flex items-start gap-3 bg-emerald-500/10 border border-emerald-500/20 p-4 rounded-xl text-emerald-400 text-sm"><CheckCircle2 className="w-5 h-5 flex-shrink-0 mt-0.5" /><span>{success}</span></div>}

                {/* Form Fields: Name, Email, Password */}
                <div className="space-y-1.5">
                  <label className="text-xs font-medium text-slate-400 ml-1">Full Name</label>
                  <div className="relative group">
                    <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-slate-500 group-focus-within:text-indigo-400 transition-colors"><UserIcon className="w-5 h-5" /></div>
                    <input type="text" value={formData.name} onChange={(e) => setFormData({...formData, name: e.target.value})} disabled={loading || googleLoading} className="w-full pl-11 pr-4 py-3 bg-zinc-900/50 border border-white/10 text-slate-200 placeholder-slate-600 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500/50 focus:border-indigo-500/50 transition-all disabled:opacity-50" placeholder="John Doe" />
                  </div>
                </div>
                <div className="space-y-1.5">
                  <label className="text-xs font-medium text-slate-400 ml-1">Email</label>
                  <div className="relative group">
                    <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-slate-500 group-focus-within:text-indigo-400 transition-colors"><Mail className="w-5 h-5" /></div>
                    <input type="email" value={formData.email} onChange={(e) => setFormData({...formData, email: e.target.value})} disabled={loading || googleLoading} className="w-full pl-11 pr-4 py-3 bg-zinc-900/50 border border-white/10 text-slate-200 placeholder-slate-600 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500/50 focus:border-indigo-500/50 transition-all disabled:opacity-50" placeholder="you@company.com" />
                  </div>
                </div>
                <div className="space-y-1.5">
                  <label className="text-xs font-medium text-slate-400 ml-1">Password</label>
                  <div className="relative group">
                    <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-slate-500 group-focus-within:text-indigo-400 transition-colors"><Lock className="w-5 h-5" /></div>
                    <input type={showPassword ? "text" : "password"} value={formData.password} onChange={(e) => setFormData({...formData, password: e.target.value})} disabled={loading || googleLoading} className="w-full pl-11 pr-12 py-3 bg-zinc-900/50 border border-white/10 text-slate-200 placeholder-slate-600 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500/50 focus:border-indigo-500/50 transition-all disabled:opacity-50" placeholder="Min. 8 characters" />
                    <button type="button" onClick={() => setShowPassword(!showPassword)} disabled={loading || googleLoading} className="absolute inset-y-0 right-0 pr-4 flex items-center text-slate-500 hover:text-slate-300 transition-colors">{showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}</button>
                  </div>
                </div>

                <div className="pt-2">
                  <label className="flex items-start gap-3 cursor-pointer group">
                    <div className="relative flex items-center mt-0.5">
                      <input type="checkbox" checked={agreeTerms} onChange={(e) => setAgreeTerms(e.target.checked)} disabled={loading || googleLoading} className="peer h-5 w-5 appearance-none rounded border border-white/10 bg-zinc-900 checked:bg-indigo-500 checked:border-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-500/50 focus:ring-offset-0 disabled:opacity-50 transition-all" />
                      <Check className="pointer-events-none absolute left-1/2 top-1/2 h-3.5 w-3.5 -translate-x-1/2 -translate-y-1/2 text-white opacity-0 peer-checked:opacity-100 transition-opacity" />
                    </div>
                    <span className="text-sm text-slate-400 group-hover:text-slate-300 transition-colors">I agree to the <a href="#" className="text-indigo-400 hover:text-indigo-300 hover:underline">Terms of Service</a> and <a href="#" className="text-indigo-400 hover:text-indigo-300 hover:underline">Privacy Policy</a></span>
                  </label>
                </div>

                <button type="submit" disabled={loading || googleLoading} className="w-full mt-4 flex items-center justify-center gap-2 py-3.5 bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500 text-white font-bold rounded-xl shadow-lg shadow-indigo-500/25 transition-all transform hover:-translate-y-0.5 active:translate-y-0 disabled:opacity-60 disabled:cursor-not-allowed">
                  {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : "Create Account"}
                </button>
              </form>

              <p className="mt-8 text-center text-sm text-slate-400">
                Already have an account?{" "}
                <a href="/login" className="text-indigo-400 hover:text-indigo-300 font-semibold hover:underline decoration-2 underline-offset-4">Sign in</a>
              </p>
           </Card>
        </div>
      </div>
    </div>
  );
}