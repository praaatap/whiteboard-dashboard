

'use client'
import React, { useState, useEffect } from 'react';
import { 
  Zap, 
  Shield, 
  BarChart3, 
  Users, 
  Layers, 
  ArrowRight, 
  CheckCircle2, 
  Menu, 
  X,
  Play,
  Layout,
  Lock,
  Globe,
  MousePointer2,
  Server,
  Activity
} from 'lucide-react';
import Link from 'next/link';

export default function ModernLanding() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  // Handle scroll effect for navbar
  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const features = [
    {
      icon: <MousePointer2 className="w-6 h-6 text-blue-400" />,
      title: "Real-time Cursors",
      description: "See exactly where your team is working. Zero latency multiplayer editing engine.",
      colSpan: "col-span-1 md:col-span-2",
      bg: "from-blue-500/10 to-cyan-500/10"
    },
    {
      icon: <Shield className="w-6 h-6 text-emerald-400" />,
      title: "Enterprise Security",
      description: "SOC2 compliant encryption ensuring your data stays yours.",
      colSpan: "col-span-1",
      bg: "from-emerald-500/10 to-teal-500/10"
    },
    {
      icon: <BarChart3 className="w-6 h-6 text-purple-400" />,
      title: "Live Analytics",
      description: "Visualize team velocity and project health with drag-and-drop widgets.",
      colSpan: "col-span-1",
      bg: "from-purple-500/10 to-pink-500/10"
    },
    {
      icon: <Layout className="w-6 h-6 text-orange-400" />,
      title: "Infinite Canvas",
      description: "A whiteboard that grows with your ideas. Never run out of space again.",
      colSpan: "col-span-1 md:col-span-2",
      bg: "from-orange-500/10 to-red-500/10"
    },
  ];

  const testimonials = [
    {
      quote: "It feels like working in the same room. The latency is practically non-existent.",
      author: "Sarah Chen",
      role: "Product @ TechCorp",
      avatar: "SC"
    },
    {
      quote: "We switched from 3 different tools to just CollabBoard. Our workflow is 2x faster.",
      author: "Marcus Ray",
      role: "CTO @ StartupLabs",
      avatar: "MR"
    },
    {
      quote: "Finally, a free tier that is actually usable for small teams. Incredible value.",
      author: "Emma Wilson",
      role: "Lead @ DesignCo",
      avatar: "EW"
    },
  ];

  return (
    <div className="min-h-screen bg-[#050507] text-slate-300 font-sans selection:bg-indigo-500/30 overflow-x-hidden">
      
      {/* Background Ambience - Optimized for performance */}
      <div className="fixed inset-0 z-0 pointer-events-none">
        <div className="absolute top-[-10%] left-[-10%] w-[300px] md:w-[500px] h-[300px] md:h-[500px] bg-indigo-600/20 rounded-full blur-[80px] md:blur-[128px] opacity-40 mix-blend-screen animate-pulse" />
        <div className="absolute bottom-[-10%] right-[-10%] w-[300px] md:w-[500px] h-[300px] md:h-[500px] bg-purple-600/10 rounded-full blur-[80px] md:blur-[128px] opacity-40 mix-blend-screen" />
        <div className="absolute top-[20%] left-[50%] w-[200px] md:w-[800px] h-[300px] bg-blue-900/10 rounded-full blur-[64px] md:blur-[96px] opacity-30 transform -translate-x-1/2" />
        <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-[0.03]"></div>
      </div>

      {/* Navigation */}
      <nav className={`fixed top-0 w-full z-50 transition-all duration-300 ${scrolled ? 'bg-[#050507]/90 backdrop-blur-xl border-b border-white/5 shadow-2xl shadow-black/50' : 'bg-transparent'}`}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16 md:h-20">
            
            {/* Logo */}
            <div className="flex items-center gap-2 cursor-pointer z-50">
              <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center text-white font-bold shadow-lg shadow-indigo-500/20">
                C
              </div>
              <span className="text-white font-semibold text-lg tracking-tight">CollabBoard</span>
            </div>
            
            {/* Desktop Nav */}
            <div className="hidden md:flex items-center gap-8">
              <a href="#features" className="text-sm font-medium hover:text-white transition-colors">Features</a>
              <a href="#testimonials" className="text-sm font-medium hover:text-white transition-colors">Testimonials</a>
              <a href="#pricing" className="text-sm font-medium hover:text-white transition-colors">Pricing</a>
            </div>

            {/* Desktop Auth */}
            <div className="hidden md:flex items-center gap-4">
              <Link href="/login" className="text-sm font-medium hover:text-white transition-colors cursor-pointer">Sign in</Link>
              <Link href="/signup" className="group relative px-4 py-2 bg-white text-black text-sm font-semibold rounded-full hover:bg-slate-100 cursor-pointer transition-all flex items-center gap-2 shadow-[0_0_20px_rgba(255,255,255,0.3)] hover:shadow-[0_0_25px_rgba(255,255,255,0.4)]">
                Get Started
                <ArrowRight className="w-3 h-3 transition-transform group-hover:translate-x-0.5" />
              </Link>
            </div>

            {/* Mobile Menu Button */}
            <div className="md:hidden z-50">
              <button 
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)} 
                className="text-slate-300 hover:text-white p-2"
                aria-label="Toggle menu"
              >
                {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
              </button>
            </div>
          </div>
        </div>

        {/* Mobile Menu Overlay */}
        <div className={`fixed inset-0 bg-[#050507]/95 backdrop-blur-xl z-40 md:hidden transition-transform duration-300 ease-in-out ${mobileMenuOpen ? 'translate-x-0' : 'translate-x-full'}`}>
          <div className="flex flex-col h-full justify-center px-8 space-y-8 text-center">
             <a href="#features" className="text-2xl font-medium text-slate-200" onClick={() => setMobileMenuOpen(false)}>Features</a>
             <a href="#pricing" className="text-2xl font-medium text-slate-200" onClick={() => setMobileMenuOpen(false)}>Pricing</a>
             <a href="/login" className="text-2xl font-medium text-slate-200" onClick={() => setMobileMenuOpen(false)}>Sign in</a>
             <a href="/signup" className="w-full py-4 bg-white text-black text-xl font-bold rounded-xl" onClick={() => setMobileMenuOpen(false)}>Get Started Free</a>
          </div>
        </div>
      </nav>

      <main className="relative z-10 pt-32 pb-16">
        
        {/* Hero Section */}
        <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center mb-16 md:mb-24">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/5 border border-white/10 text-xs font-medium text-indigo-300 mb-8 animate-fade-in-up">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-indigo-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-indigo-500"></span>
            </span>
            v2.0 is now live for everyone
          </div>
          
          <h1 className="text-4xl sm:text-5xl md:text-7xl font-bold text-white tracking-tight mb-6 leading-[1.1] max-w-4xl mx-auto">
            Collaboration for the <br className="hidden md:block" />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 via-purple-400 to-indigo-400 animate-gradient">
              modern era
            </span>
          </h1>
          
          <p className="text-base sm:text-lg md:text-xl text-slate-400 max-w-2xl mx-auto mb-10 leading-relaxed px-4">
            The free, open-source inspired dashboard for teams who ship fast. 
            Real-time editing, secure by default, and beautifully designed.
          </p>
          
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-16 px-4">
            <a href="/signup" className="w-full sm:w-auto px-8 py-4 bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl font-semibold transition-all shadow-lg shadow-indigo-500/25 hover:shadow-indigo-500/40 flex items-center justify-center gap-2">
              Start Building Free
              <ArrowRight className="w-4 h-4" />
            </a>
            <a href="#demo" className="w-full sm:w-auto px-8 py-4 bg-white/5 hover:bg-white/10 border border-white/10 text-white rounded-xl font-semibold transition-all flex items-center justify-center gap-2 backdrop-blur-sm">
              <Play className="w-4 h-4 fill-current" />
              Watch Demo
            </a>
          </div>

          {/* CSS-Only Dashboard Mockup */}
          {/* Mobile: Flat / Desktop: 3D Tilt */}
          <div className="relative max-w-5xl mx-auto perspective-1000 group px-2 sm:px-4">
            {/* Glow effect behind the dashboard */}
            <div className="absolute -inset-1 bg-gradient-to-r from-indigo-500 to-purple-600 rounded-2xl blur-2xl opacity-20 group-hover:opacity-30 transition duration-1000"></div>
            
            <div className="relative bg-[#0F0F12] border border-white/10 rounded-xl overflow-hidden shadow-2xl md:transform md:rotate-x-12 transition-transform duration-700 md:hover:rotate-x-0">
              
              {/* Fake Window Header */}
              <div className="bg-[#1a1a1e] border-b border-white/5 px-4 py-3 flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="flex gap-1.5">
                    <div className="w-3 h-3 rounded-full bg-red-500/20 border border-red-500/50"></div>
                    <div className="w-3 h-3 rounded-full bg-yellow-500/20 border border-yellow-500/50"></div>
                    <div className="w-3 h-3 rounded-full bg-green-500/20 border border-green-500/50"></div>
                  </div>
                </div>
                {/* User Avatars - simplified on mobile */}
                <div className="flex items-center gap-3">
                   <div className="flex -space-x-2">
                      <div className="w-6 h-6 rounded-full bg-blue-500 border border-[#1a1a1e] flex items-center justify-center text-[8px] text-white font-bold">JD</div>
                      <div className="w-6 h-6 rounded-full bg-purple-500 border border-[#1a1a1e] flex items-center justify-center text-[8px] text-white font-bold">AS</div>
                      <div className="w-6 h-6 rounded-full bg-green-500 border border-[#1a1a1e] flex items-center justify-center text-[8px] text-white font-bold hidden sm:flex">MK</div>
                   </div>
                   <div className="h-6 px-3 bg-indigo-500/20 text-indigo-400 rounded text-xs flex items-center font-medium">Share</div>
                </div>
              </div>

              {/* Fake UI Content - Scrollable on very small screens */}
              <div className="flex h-[350px] sm:h-[400px] md:h-[500px] overflow-x-auto sm:overflow-hidden bg-[#0F0F12]">
                {/* Sidebar - Hidden on mobile */}
                <div className="w-64 border-r border-white/5 bg-[#141418] p-4 hidden md:flex flex-col gap-4 flex-shrink-0">
                   <div className="h-8 w-32 bg-white/5 rounded animate-pulse"></div>
                   <div className="space-y-2 mt-4">
                      <div className="h-4 w-full bg-white/5 rounded opacity-50"></div>
                      <div className="h-4 w-3/4 bg-white/5 rounded opacity-50"></div>
                      <div className="h-4 w-5/6 bg-white/5 rounded opacity-50"></div>
                   </div>
                   <div className="mt-auto space-y-2">
                      <div className="h-12 w-full bg-indigo-500/10 border border-indigo-500/20 rounded-lg"></div>
                   </div>
                </div>

                {/* Main Content */}
                <div className="flex-1 bg-[#0F0F12] p-4 sm:p-6 relative min-w-[320px]">
                   {/* Header Stats */}
                   <div className="grid grid-cols-3 gap-3 sm:gap-4 mb-6 sm:mb-8">
                      <div className="h-20 sm:h-24 bg-[#1a1a1e] border border-white/5 rounded-lg p-3 sm:p-4">
                        <div className="w-6 h-6 sm:w-8 sm:h-8 bg-green-500/20 rounded mb-2"></div>
                        <div className="h-2 w-12 sm:w-16 bg-white/20 rounded"></div>
                      </div>
                      <div className="h-20 sm:h-24 bg-[#1a1a1e] border border-white/5 rounded-lg p-3 sm:p-4">
                        <div className="w-6 h-6 sm:w-8 sm:h-8 bg-blue-500/20 rounded mb-2"></div>
                        <div className="h-2 w-12 sm:w-16 bg-white/20 rounded"></div>
                      </div>
                      <div className="h-20 sm:h-24 bg-[#1a1a1e] border border-white/5 rounded-lg p-3 sm:p-4">
                        <div className="w-6 h-6 sm:w-8 sm:h-8 bg-purple-500/20 rounded mb-2"></div>
                        <div className="h-2 w-12 sm:w-16 bg-white/20 rounded"></div>
                      </div>
                   </div>
                   
                   {/* Main Chart Area */}
                   <div className="h-48 sm:h-64 bg-[#1a1a1e] border border-white/5 rounded-lg p-6 relative overflow-hidden">
                      <div className="absolute inset-x-0 bottom-0 h-32 sm:h-40 flex items-end justify-between px-4 sm:px-6 pb-6 gap-2 opacity-50">
                         {[40, 70, 45, 90, 65, 80, 50, 95, 75, 60, 90, 100].map((h, i) => (
                           <div key={i} className="w-full bg-indigo-500 rounded-t-sm" style={{ height: `${h}%` }}></div>
                         ))}
                      </div>
                      
                      {/* Floating cursors simulating live collab */}
                      <div className="absolute top-1/3 left-1/4 animate-bounce duration-[2000ms]">
                         <MousePointer2 className="w-5 h-5 text-pink-500 fill-pink-500 drop-shadow-lg" />
                         <div className="bg-pink-500 text-white text-[10px] px-1.5 py-0.5 rounded ml-4 mt-1 font-bold shadow-lg">Sarah</div>
                      </div>
                      <div className="absolute bottom-1/3 right-1/4 animate-bounce duration-[2500ms]">
                         <MousePointer2 className="w-5 h-5 text-blue-500 fill-blue-500 drop-shadow-lg" />
                         <div className="bg-blue-500 text-white text-[10px] px-1.5 py-0.5 rounded ml-4 mt-1 font-bold shadow-lg">Mike</div>
                      </div>
                   </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Social Proof */}
        <section className="py-10 sm:py-12 border-y border-white/5 bg-white/[0.02]">
          <div className="max-w-7xl mx-auto px-4 text-center">
             <p className="text-xs sm:text-sm text-slate-500 mb-6 sm:mb-8 font-medium uppercase tracking-wider">Trusted by innovative teams everywhere</p>
             <div className="flex flex-wrap justify-center items-center gap-8 md:gap-16 opacity-50 grayscale hover:grayscale-0 transition-all duration-500">
                {['Stripe', 'Vercel', 'Figma', 'Linear', 'Raycast'].map((brand) => (
                  <span key={brand} className="text-lg sm:text-xl font-bold text-white hover:text-white cursor-default select-none">{brand}</span>
                ))}
             </div>
          </div>
        </section>

        {/* Bento Grid Features */}
        <section id="features" className="py-20 sm:py-24 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="mb-12 sm:mb-16">
            <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold text-white mb-6">Built for speed, <br /><span className="text-slate-500">designed for scale.</span></h2>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {features.map((feature, idx) => (
              <div key={idx} className={`group relative overflow-hidden rounded-3xl border border-white/10 bg-[#0F0F12] p-6 sm:p-8 hover:border-white/20 transition-all duration-300 ${feature.colSpan}`}>
                <div className={`absolute inset-0 bg-gradient-to-br ${feature.bg} opacity-0 group-hover:opacity-100 transition-opacity duration-500`}></div>
                
                <div className="relative z-10">
                  <div className="w-12 h-12 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300 shadow-inner">
                    {feature.icon}
                  </div>
                  <h3 className="text-xl font-bold text-white mb-3">{feature.title}</h3>
                  <p className="text-slate-400 leading-relaxed text-sm sm:text-base">{feature.description}</p>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Pricing */}
        <section id="pricing" className="py-20 sm:py-24 relative overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-b from-transparent to-indigo-900/10 pointer-events-none"></div>
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
            <div className="text-center mb-16">
               <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold text-white mb-6">Simple, transparent pricing</h2>
               <p className="text-slate-400 max-w-2xl mx-auto text-sm sm:text-base">
                 We believe in empowering small teams. That's why our core features are free forever.
               </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto">
              
              {/* Free Plan - Highlighted as requested */}
              <div className="relative rounded-3xl border border-indigo-500/30 bg-[#0F0F12] p-8 shadow-2xl shadow-indigo-900/20 transform hover:-translate-y-1 transition-transform duration-300">
                <div className="absolute top-0 right-0 bg-indigo-600 text-white text-xs font-bold px-3 py-1 rounded-bl-xl rounded-tr-2xl">
                   POPULAR
                </div>
                <div className="mb-6">
                  <h3 className="text-lg font-medium text-indigo-400 mb-2">Starter</h3>
                  <div className="flex items-baseline gap-1">
                    <span className="text-4xl font-bold text-white">$0</span>
                    <span className="text-slate-500">/forever</span>
                  </div>
                  <p className="text-sm text-slate-400 mt-2">Perfect for side projects and small teams.</p>
                </div>
                
                <ul className="space-y-4 mb-8">
                  {['Unlimited Public Projects', 'Up to 5 Team Members', 'Basic Analytics', 'Community Support'].map((item) => (
                    <li key={item} className="flex items-center gap-3 text-sm text-slate-300">
                      <CheckCircle2 className="w-4 h-4 text-indigo-500 flex-shrink-0" />
                      {item}
                    </li>
                  ))}
                </ul>
                
                <a href="/signup" className="block w-full py-3 px-6 text-center rounded-xl bg-white text-black font-bold hover:bg-slate-200 transition-colors shadow-lg shadow-white/10">
                  Get Started Free
                </a>
              </div>

              {/* Pro Plan */}
              <div className="rounded-3xl border border-white/5 bg-white/[0.02] p-8 hover:bg-white/[0.04] transition-colors">
                <div className="mb-6">
                  <h3 className="text-lg font-medium text-slate-300 mb-2">Pro</h3>
                  <div className="flex items-baseline gap-1">
                    <span className="text-4xl font-bold text-white">$12</span>
                    <span className="text-slate-500">/seat/mo</span>
                  </div>
                  <p className="text-sm text-slate-400 mt-2">For growing teams needing more power.</p>
                </div>
                
                <ul className="space-y-4 mb-8">
                  {['Everything in Starter', 'Unlimited Private Projects', 'Advanced Permissions', 'Priority Support', '30-day Version History'].map((item) => (
                    <li key={item} className="flex items-center gap-3 text-sm text-slate-300">
                      <CheckCircle2 className="w-4 h-4 text-slate-500 flex-shrink-0" />
                      {item}
                    </li>
                  ))}
                </ul>
                
                <a href="/signup" className="block w-full py-3 px-6 text-center rounded-xl border border-white/10 text-white font-semibold hover:bg-white/5 transition-colors">
                  Start 14-Day Trial
                </a>
              </div>

            </div>
          </div>
        </section>

        {/* Testimonials */}
        <section id="testimonials" className="py-20 sm:py-24 max-w-7xl mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {testimonials.map((t, i) => (
              <div key={i} className="bg-[#141418] p-8 rounded-2xl border border-white/5 relative hover:border-white/10 transition-colors">
                <div className="text-4xl text-indigo-900 absolute top-4 right-6 font-serif opacity-50">"</div>
                <p className="text-slate-300 mb-6 relative z-10 text-sm sm:text-base leading-relaxed">{t.quote}</p>
                <div className="flex items-center gap-4">
                  <div className="w-10 h-10 rounded-full bg-slate-800 flex items-center justify-center text-xs font-bold text-white shrink-0">
                    {t.avatar}
                  </div>
                  <div>
                    <div className="text-white font-medium text-sm">{t.author}</div>
                    <div className="text-slate-500 text-xs">{t.role}</div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Footer */}
        <footer className="border-t border-white/10 bg-[#050507] pt-16 pb-8">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-8 mb-12">
              <div className="col-span-2 md:col-span-1">
                <div className="flex items-center gap-2 mb-4">
                  <div className="w-6 h-6 rounded bg-gradient-to-br from-indigo-500 to-purple-600"></div>
                  <span className="text-white font-bold">CollabBoard</span>
                </div>
                <p className="text-slate-500 text-sm mb-6">
                  Making teamwork feel less like work and more like magic.
                </p>
                {/* Reliability Indicators */}
                <div className="flex items-center gap-2 text-xs text-emerald-400 font-medium bg-emerald-500/10 px-3 py-1.5 rounded-full w-fit">
                  <span className="relative flex h-2 w-2">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                    <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
                  </span>
                  System Operational
                </div>
              </div>
              
              <div>
                <h4 className="text-white font-semibold mb-4 text-sm">Product</h4>
                <ul className="space-y-2 text-sm text-slate-400">
                  <li><a href="#" className="hover:text-indigo-400 transition">Features</a></li>
                  <li><a href="#" className="hover:text-indigo-400 transition">Integrations</a></li>
                  <li><a href="#" className="hover:text-indigo-400 transition">Pricing</a></li>
                  <li><a href="#" className="hover:text-indigo-400 transition">Changelog</a></li>
                </ul>
              </div>

              <div>
                <h4 className="text-white font-semibold mb-4 text-sm">Company</h4>
                <ul className="space-y-2 text-sm text-slate-400">
                  <li><a href="#" className="hover:text-indigo-400 transition">About</a></li>
                  <li><a href="#" className="hover:text-indigo-400 transition">Blog</a></li>
                  <li><a href="#" className="hover:text-indigo-400 transition">Careers</a></li>
                </ul>
              </div>

              <div>
                <h4 className="text-white font-semibold mb-4 text-sm">Security</h4>
                <ul className="space-y-2 text-sm text-slate-400">
                  <li><a href="#" className="hover:text-indigo-400 transition">Privacy Policy</a></li>
                  <li><a href="#" className="hover:text-indigo-400 transition">Terms of Service</a></li>
                  <li className="flex items-center gap-2 pt-2">
                     <Lock className="w-3 h-3 text-slate-500" />
                     <span className="text-xs text-slate-500">SOC2 Type II</span>
                  </li>
                </ul>
              </div>
            </div>
            
            <div className="border-t border-white/5 pt-8 flex flex-col md:flex-row justify-between items-center gap-4">
              <p className="text-slate-600 text-sm">© 2024 CollabBoard Inc. All rights reserved.</p>
              <div className="flex gap-4">
                <a href="#" className="text-slate-400 hover:text-white transition"><Globe className="w-4 h-4" /></a>
                <a href="#" className="text-slate-400 hover:text-white transition"><Users className="w-4 h-4" /></a>
              </div>
            </div>
          </div>
        </footer>

      </main>
    </div>
  );
}