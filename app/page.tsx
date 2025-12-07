'use client'
import React, { useState, useEffect, useRef } from 'react';
import { 
  Zap, Shield, BarChart3, Users, Layers, ArrowRight, 
  CheckCircle2, Menu, X, Play, Layout, Lock, Globe, 
  MousePointer2, Server, Activity, ChevronRight, Star,
  MessageSquare, ChevronDown, Plus, Minus, Mail
} from 'lucide-react';
import Link from 'next/link';

/**
 * Utility: Scroll Animation Wrapper
 */
interface FadeInProps {
  children: React.ReactNode;
  delay?: number;
  className?: string;
}

const FadeIn: React.FC<FadeInProps> = ({ children, delay = 0, className = "" }) => {
  const [isVisible, setIsVisible] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
          observer.unobserve(entry.target);
        }
      },
      { threshold: 0.1 }
    );
    if (ref.current) observer.observe(ref.current);
    return () => {
      if (ref.current) observer.unobserve(ref.current);
    };
  }, []);

  return (
    <div
      ref={ref}
      className={`transition-all duration-1000 ease-out transform ${
        isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'
      } ${className}`}
      style={{ transitionDelay: `${delay}ms` }}
    >
      {children}
    </div>
  );
};

/**
 * Utility Component: SpotlightCard
 */
interface SpotlightCardProps {
  children: React.ReactNode;
  className?: string;
  spotlightColor?: string;
}

const SpotlightCard: React.FC<SpotlightCardProps> = ({ children, className = "", spotlightColor = "rgba(255, 255, 255, 0.15)" }) => {
  const divRef = useRef<HTMLDivElement>(null);
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const [opacity, setOpacity] = useState(0);

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!divRef.current) return;
    const rect = divRef.current.getBoundingClientRect();
    setPosition({ x: e.clientX - rect.left, y: e.clientY - rect.top });
  };

  const handleMouseEnter = () => setOpacity(1);
  const handleMouseLeave = () => setOpacity(0);

  return (
    <div
      ref={divRef}
      onMouseMove={handleMouseMove}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      className={`relative overflow-hidden rounded-3xl border border-white/10 bg-zinc-900/50 ${className}`}
    >
      <div
        className="pointer-events-none absolute -inset-px opacity-0 transition duration-300"
        style={{
          opacity,
          background: `radial-gradient(600px circle at ${position.x}px ${position.y}px, ${spotlightColor}, transparent 40%)`,
        }}
      />
      <div className="relative h-full">{children}</div>
    </div>
  );
};

interface FAQItemProps {
  question: string;
  answer: string;
}

const FAQItem: React.FC<FAQItemProps> = ({ question, answer }) => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="border-b border-white/10">
      <button 
        className="w-full py-6 flex items-center justify-between text-left focus:outline-none group"
        onClick={() => setIsOpen(!isOpen)}
      >
        <span className="text-lg font-medium text-slate-200 group-hover:text-white transition-colors">{question}</span>
        <span className={`ml-6 flex-shrink-0 text-indigo-400 transition-transform duration-300 ${isOpen ? 'rotate-45' : ''}`}>
          <Plus className="w-6 h-6" />
        </span>
      </button>
      <div 
        className={`overflow-hidden transition-all duration-300 ease-in-out ${isOpen ? 'max-h-48 opacity-100 mb-6' : 'max-h-0 opacity-0'}`}
      >
        <p className="text-slate-400 leading-relaxed pr-12">
          {answer}
        </p>
      </div>
    </div>
  );
};

export default function ModernLanding() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [billingCycle, setBillingCycle] = useState<'monthly' | 'yearly'>('monthly');

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const features = [
    {
      icon: <MousePointer2 className="w-6 h-6 text-indigo-400" />,
      title: "Real-time Cursors",
      description: "Multiplayer editing engine with zero latency. Feel present.",
      colSpan: "md:col-span-2",
    },
    {
      icon: <Shield className="w-6 h-6 text-emerald-400" />,
      title: "Enterprise Security",
      description: "SOC2 compliant encryption ensuring your data stays yours.",
      colSpan: "md:col-span-1",
    },
    {
      icon: <BarChart3 className="w-6 h-6 text-purple-400" />,
      title: "Live Analytics",
      description: "Visualize team velocity.",
      colSpan: "md:col-span-1",
    },
    {
      icon: <Layout className="w-6 h-6 text-orange-400" />,
      title: "Infinite Canvas",
      description: "A whiteboard that grows with your ideas. Never run out of space again.",
      colSpan: "md:col-span-2",
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

  const workflowSteps = [
    {
      id: "01",
      title: "Connect",
      description: "Sync your existing data sources or start fresh on our infinite canvas."
    },
    {
      id: "02",
      title: "Collaborate",
      description: "Invite your team and work together in real-time with zero friction."
    },
    {
      id: "03",
      title: "Ship",
      description: "Export code-ready assets or publish directly to the web with one click."
    }
  ];

  return (
    <div className="min-h-screen bg-black text-slate-300 font-sans selection:bg-indigo-500/30 overflow-x-hidden">
      
      {/* CSS for custom animations */}
      <style>{`
        @keyframes blob {
          0% { transform: translate(0px, 0px) scale(1); }
          33% { transform: translate(30px, -50px) scale(1.1); }
          66% { transform: translate(-20px, 20px) scale(0.9); }
          100% { transform: translate(0px, 0px) scale(1); }
        }
        .animate-blob { animation: blob 7s infinite; }
        .animation-delay-2000 { animation-delay: 2s; }
        .animation-delay-4000 { animation-delay: 4s; }
        
        .bg-grid-white {
          background-size: 40px 40px;
          background-image: linear-gradient(to right, rgba(255, 255, 255, 0.05) 1px, transparent 1px),
                            linear-gradient(to bottom, rgba(255, 255, 255, 0.05) 1px, transparent 1px);
        }
      `}</style>

      {/* Dynamic Background */}
      <div className="fixed inset-0 z-0 pointer-events-none">
        <div className="absolute inset-0 bg-black bg-grid-white [mask-image:radial-gradient(ellipse_at_center,transparent_20%,black)]"></div>
        {/* Animated Orbs */}
        <div className="absolute top-0 -left-4 w-72 h-72 bg-purple-500 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob"></div>
        <div className="absolute top-0 -right-4 w-72 h-72 bg-indigo-500 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob animation-delay-2000"></div>
        <div className="absolute -bottom-8 left-20 w-72 h-72 bg-blue-500 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob animation-delay-4000"></div>
        {/* Grain Overlay */}
        <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-[0.03]"></div>
      </div>

      {/* Floating Navbar */}
      <div className="fixed top-0 w-full z-50 flex justify-center pt-4 px-4">
        <nav className={`w-full max-w-5xl rounded-full border border-white/10 transition-all duration-300 backdrop-blur-xl ${scrolled ? 'bg-black/80 shadow-2xl shadow-indigo-500/10 py-3' : 'bg-white/5 py-4'}`}>
          <div className="px-6 flex items-center justify-between">
            {/* Logo */}
            <div className="flex items-center gap-2 cursor-pointer">
              <div className="w-8 h-8 rounded-lg bg-gradient-to-tr from-indigo-500 via-purple-500 to-indigo-500 flex items-center justify-center text-white font-bold shadow-lg shadow-indigo-500/20">
                C
              </div>
              <span className="text-white font-semibold tracking-tight">CollabBoard</span>
            </div>

            {/* Desktop Nav */}
            <div className="hidden md:flex items-center gap-8">
              {['Features', 'Testimonials', 'Pricing', 'FAQ'].map((item) => (
                <a key={item} href={`#${item.toLowerCase()}`} className="text-sm font-medium text-slate-400 hover:text-white transition-colors relative group">
                  {item}
                  <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-indigo-500 transition-all group-hover:w-full"></span>
                </a>
              ))}
            </div>

            {/* Auth Buttons */}
            <div className="hidden md:flex items-center gap-4">
              <Link href="/login" className="text-sm font-medium text-slate-300 hover:text-white transition-colors">Sign in</Link>
              <Link href="/signup" className="group relative px-5 py-2 bg-white text-black text-sm font-semibold rounded-full hover:bg-slate-200 transition-all flex items-center gap-2 shadow-[0_0_20px_rgba(255,255,255,0.2)] hover:shadow-[0_0_25px_rgba(255,255,255,0.4)] overflow-hidden cursor-pointer">
                <span className="relative z-10">Get Started</span>
                <ArrowRight className="w-3 h-3 relative z-10 transition-transform group-hover:translate-x-0.5" />
                <div className="absolute inset-0 bg-gradient-to-r from-transparent via-slate-100 to-transparent translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-700"></div>
              </Link>
            </div>

            {/* Mobile Toggle */}
            <button onClick={() => setMobileMenuOpen(!mobileMenuOpen)} className="md:hidden text-slate-300">
              {mobileMenuOpen ? <X /> : <Menu />}
            </button>
          </div>
        </nav>
      </div>

      {/* Mobile Menu Overlay */}
      {mobileMenuOpen && (
        <div className="fixed inset-0 bg-black/95 backdrop-blur-2xl z-40 md:hidden pt-32 px-6">
          <div className="flex flex-col space-y-6 text-center">
            {['Features', 'Pricing', 'Login'].map((item) => (
               <a key={item} href="#" className="text-2xl font-medium text-slate-200" onClick={() => setMobileMenuOpen(false)}>{item}</a>
            ))}
            <a href="#" className="w-full py-4 bg-indigo-600 text-white text-xl font-bold rounded-2xl" onClick={() => setMobileMenuOpen(false)}>Get Started</a>
          </div>
        </div>
      )}

      <main className="relative z-10">
        
        {/* Hero Section */}
        <section className="pt-40 pb-20 md:pt-52 md:pb-32 px-4 text-center max-w-7xl mx-auto">
          <FadeIn>
            {/* Badge */}
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full border border-indigo-500/30 bg-indigo-500/10 text-xs font-medium text-indigo-300 mb-8 hover:bg-indigo-500/20 transition-colors cursor-pointer group">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-indigo-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-indigo-500"></span>
              </span>
              v2.0 Released
              <ChevronRight className="w-3 h-3 ml-1 text-indigo-400 group-hover:translate-x-0.5 transition-transform" />
            </div>

            <h1 className="text-5xl sm:text-6xl md:text-8xl font-bold tracking-tight text-white mb-8">
              Ship faster with <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 via-purple-400 to-white animate-pulse">
                Collaborative Magic
              </span>
            </h1>

            <p className="text-lg md:text-xl text-slate-400 max-w-2xl mx-auto mb-12 leading-relaxed">
              The open-source inspired workspace. Real-time collaboration, 
              infinite canvas, and enterprise security. <span className="text-slate-200">Built for modern teams.</span>
            </p>

            <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-20">
              <button className="w-full sm:w-auto px-8 py-4 bg-indigo-600 hover:bg-indigo-500 text-white rounded-full font-semibold transition-all shadow-[0_0_40px_-10px_rgba(79,70,229,0.5)] hover:shadow-[0_0_60px_-15px_rgba(79,70,229,0.6)] hover:-translate-y-1 flex items-center justify-center gap-2">
                Start Building Free <ArrowRight className="w-4 h-4" />
              </button>
              <button className="w-full sm:w-auto px-8 py-4 bg-zinc-900 border border-zinc-800 hover:bg-zinc-800 text-white rounded-full font-semibold transition-all flex items-center justify-center gap-2 group">
                <Play className="w-4 h-4 fill-white group-hover:scale-110 transition-transform" /> Watch Demo
              </button>
            </div>
          </FadeIn>

          {/* 3D Dashboard Mockup */}
          <FadeIn delay={200}>
            <div className="relative max-w-6xl mx-auto perspective-[2000px] group">
              <div className="relative rounded-xl border border-white/10 bg-zinc-900/50 backdrop-blur-sm shadow-2xl overflow-hidden transform rotate-x-[15deg] group-hover:rotate-x-0 transition-all duration-1000 ease-out">
                {/* Fake UI Header */}
                <div className="h-10 bg-zinc-900/80 border-b border-white/5 flex items-center px-4 justify-between">
                  <div className="flex gap-2">
                    <div className="w-3 h-3 rounded-full bg-red-500/20 border border-red-500/50"></div>
                    <div className="w-3 h-3 rounded-full bg-yellow-500/20 border border-yellow-500/50"></div>
                    <div className="w-3 h-3 rounded-full bg-green-500/20 border border-green-500/50"></div>
                  </div>
                  <div className="px-3 py-1 rounded bg-zinc-800 text-[10px] font-mono text-zinc-400">read-only</div>
                </div>
                
                {/* Fake UI Body */}
                <div className="grid grid-cols-12 h-[400px] md:h-[600px] bg-black/40">
                  <div className="col-span-2 border-r border-white/5 p-4 hidden md:block">
                    <div className="space-y-3">
                      {[1,2,3].map(i => <div key={i} className="h-2 bg-zinc-800 rounded w-full animate-pulse" style={{animationDelay: `${i*100}ms`}}></div>)}
                    </div>
                  </div>
                  <div className="col-span-12 md:col-span-10 p-6 relative">
                    {/* Abstract Chart */}
                    <div className="absolute bottom-0 left-0 right-0 h-64 bg-gradient-to-t from-indigo-500/10 to-transparent"></div>
                    <div className="flex items-end justify-between h-full px-10 pb-10 gap-4">
                        {[40, 70, 45, 90, 65, 80, 50, 95].map((h, i) => (
                          <div key={i} className="w-full bg-indigo-500/80 rounded-t-sm hover:bg-indigo-400 transition-colors" style={{ height: `${h}%` }}></div>
                        ))}
                    </div>
                    
                    {/* Floating Cursors */}
                    <div className="absolute top-1/3 left-1/4 animate-bounce duration-[3000ms]">
                        <MousePointer2 className="w-5 h-5 text-pink-500 fill-pink-500" />
                        <div className="bg-pink-500 text-white text-[10px] px-2 py-0.5 rounded-full ml-3 mt-1 font-bold">Sarah</div>
                    </div>
                  </div>
                </div>
              </div>
              {/* Glow under dashboard */}
              <div className="absolute -inset-4 bg-indigo-500/20 blur-3xl -z-10 rounded-[3rem] opacity-40 group-hover:opacity-60 transition-opacity"></div>
            </div>
          </FadeIn>
        </section>

        {/* Social Proof Marquee */}
        <div className="py-12 border-y border-white/5 bg-white/[0.01] overflow-hidden">
           <div className="flex gap-20 animate-[marquee_20s_linear_infinite] min-w-max px-4">
             {['Stripe', 'Linear', 'Vercel', 'Raycast', 'Figma', 'OpenAI', 'Shopify'].map((brand) => (
               <span key={brand} className="text-xl font-bold text-zinc-600 font-mono hover:text-zinc-300 transition-colors cursor-default">{brand}</span>
             ))}
             {['Stripe', 'Linear', 'Vercel', 'Raycast', 'Figma', 'OpenAI', 'Shopify'].map((brand) => (
               <span key={`${brand}-2`} className="text-xl font-bold text-zinc-600 font-mono hover:text-zinc-300 transition-colors cursor-default">{brand}</span>
             ))}
           </div>
           <style>{`
             @keyframes marquee {
               0% { transform: translateX(0); }
               100% { transform: translateX(-50%); }
             }
           `}</style>
        </div>

        {/* Stats Section */}
        <section className="py-20 border-b border-white/5 bg-zinc-900/20">
          <div className="max-w-7xl mx-auto px-6 grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
            {[
              { label: "Active Users", value: "100k+" },
              { label: "Countries", value: "150+" },
              { label: "Uptime", value: "99.99%" },
              { label: "Team Productivity", value: "3.5x" }
            ].map((stat, i) => (
              <FadeIn key={i} delay={i * 100}>
                <div className="space-y-2">
                  <div className="text-4xl md:text-5xl font-bold text-white tracking-tight">{stat.value}</div>
                  <div className="text-sm font-medium text-indigo-400 uppercase tracking-wider">{stat.label}</div>
                </div>
              </FadeIn>
            ))}
          </div>
        </section>

        {/* Bento Grid Features */}
        <section id="features" className="py-24 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <FadeIn>
            <div className="mb-16 md:text-center max-w-3xl mx-auto">
              <h2 className="text-3xl md:text-5xl font-bold text-white mb-6">Everything you need, <br /><span className="text-indigo-400">nothing you don't.</span></h2>
              <p className="text-slate-400 text-lg">We stripped away the complexity to leave you with a tool that feels like an extension of your mind.</p>
            </div>
          </FadeIn>
          
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            {features.map((feature, idx) => (
              <FadeIn key={idx} delay={idx * 100} className={feature.colSpan}>
                <SpotlightCard className={`p-8 flex flex-col justify-between group h-full`}>
                  <div className="mb-4 w-12 h-12 rounded-full bg-zinc-800/50 flex items-center justify-center border border-white/5 group-hover:scale-110 transition-transform">
                    {feature.icon}
                  </div>
                  <div>
                    <h3 className="text-xl font-bold text-white mb-2">{feature.title}</h3>
                    <p className="text-slate-400 leading-relaxed text-sm">{feature.description}</p>
                  </div>
                </SpotlightCard>
              </FadeIn>
            ))}
          </div>
        </section>

        {/* Workflow Section */}
        <section className="py-24 bg-zinc-900/30 border-y border-white/5">
          <div className="max-w-7xl mx-auto px-6">
            <FadeIn>
              <div className="text-center mb-20">
                <h2 className="text-3xl md:text-5xl font-bold text-white mb-6">Seamless Workflow</h2>
                <p className="text-slate-400 text-lg">From idea to execution in record time.</p>
              </div>
            </FadeIn>
            
            <div className="grid md:grid-cols-3 gap-12 relative">
              {/* Connector Line */}
              <div className="hidden md:block absolute top-12 left-[16%] right-[16%] h-0.5 bg-gradient-to-r from-indigo-500/20 via-purple-500/20 to-indigo-500/20 border-t border-dashed border-white/20"></div>

              {workflowSteps.map((step, i) => (
                <FadeIn key={i} delay={i * 200}>
                  <div className="relative flex flex-col items-center text-center z-10">
                    <div className="w-24 h-24 rounded-full bg-zinc-900 border border-white/10 flex items-center justify-center mb-8 shadow-xl shadow-black/50 group hover:border-indigo-500/50 transition-colors">
                      <span className="text-3xl font-bold text-white group-hover:text-indigo-400 transition-colors">{step.id}</span>
                    </div>
                    <h3 className="text-xl font-bold text-white mb-3">{step.title}</h3>
                    <p className="text-slate-400 leading-relaxed max-w-xs">{step.description}</p>
                  </div>
                </FadeIn>
              ))}
            </div>
          </div>
        </section>

        {/* Testimonials */}
        <section id="testimonials" className="py-24 max-w-7xl mx-auto px-6">
          <FadeIn>
            <div className="text-center mb-16">
              <h2 className="text-3xl md:text-5xl font-bold text-white mb-6">Loved by Builders</h2>
              <p className="text-slate-400 text-lg">Join thousands of teams who trust us with their workflow.</p>
            </div>
          </FadeIn>
          <div className="grid md:grid-cols-3 gap-6">
            {testimonials.map((t, i) => (
              <FadeIn key={i} delay={i * 100} className="h-full">
                <SpotlightCard className="p-8 h-full" spotlightColor="rgba(255, 255, 255, 0.05)">
                  <div className="flex gap-1 text-yellow-500 mb-6">
                    {[...Array(5)].map((_, i) => <Star key={i} className="w-4 h-4 fill-current" />)}
                  </div>
                  <p className="text-slate-300 mb-8 leading-relaxed">"{t.quote}"</p>
                  <div className="flex items-center gap-4 mt-auto">
                    <div className="w-10 h-10 rounded-full bg-gradient-to-br from-indigo-500 to-purple-500 flex items-center justify-center text-white font-bold text-sm">
                      {t.avatar}
                    </div>
                    <div>
                      <div className="text-white font-medium text-sm">{t.author}</div>
                      <div className="text-slate-500 text-xs">{t.role}</div>
                    </div>
                  </div>
                </SpotlightCard>
              </FadeIn>
            ))}
          </div>
        </section>

        {/* Pricing */}
        <section id="pricing" className="py-24 relative bg-zinc-900/20 border-y border-white/5">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <FadeIn>
              <div className="text-center mb-10">
                <h2 className="text-3xl md:text-5xl font-bold text-white mb-6">Simple Pricing</h2>
                <p className="text-slate-400 text-lg">Start for free, scale when you're ready.</p>
              </div>

              {/* Billing Toggle */}
              <div className="flex justify-center mb-16">
                <div className="bg-zinc-900 border border-white/10 p-1 rounded-xl flex items-center relative">
                  <button 
                    onClick={() => setBillingCycle('monthly')}
                    className={`px-6 py-2 rounded-lg text-sm font-medium transition-all duration-300 ${billingCycle === 'monthly' ? 'bg-indigo-600 text-white shadow-lg' : 'text-slate-400 hover:text-white'}`}
                  >
                    Monthly
                  </button>
                  <button 
                    onClick={() => setBillingCycle('yearly')}
                    className={`px-6 py-2 rounded-lg text-sm font-medium transition-all duration-300 ${billingCycle === 'yearly' ? 'bg-indigo-600 text-white shadow-lg' : 'text-slate-400 hover:text-white'}`}
                  >
                    Yearly
                  </button>
                  <span className="absolute -top-3 -right-3 bg-emerald-500 text-white text-[10px] font-bold px-2 py-0.5 rounded-full animate-bounce">
                    SAVE 20%
                  </span>
                </div>
              </div>
            </FadeIn>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto">
              
              {/* Starter Plan */}
              <FadeIn delay={100}>
                <SpotlightCard className="p-10 relative h-full" spotlightColor="rgba(79, 70, 229, 0.1)">
                  <div className="absolute top-0 right-0 p-4">
                     <span className="bg-indigo-500/20 text-indigo-300 text-xs font-bold px-3 py-1 rounded-full border border-indigo-500/20">POPULAR</span>
                  </div>
                  <h3 className="text-2xl font-bold text-white mb-2">Starter</h3>
                  <div className="flex items-baseline gap-1 mb-6">
                    <span className="text-4xl font-bold text-white">$0</span>
                    <span className="text-slate-500">/forever</span>
                  </div>
                  <p className="text-slate-400 mb-8">Perfect for hobbyists and side projects.</p>
                  <button className="w-full py-3 rounded-xl bg-white text-black font-bold hover:bg-slate-200 transition-colors shadow-lg shadow-white/5">
                    Get Started Free
                  </button>
                  <div className="mt-8 space-y-4">
                    {['Unlimited Projects', '3 Collaborators', '7-day History'].map(i => (
                      <div key={i} className="flex items-center gap-3 text-slate-300 text-sm">
                        <CheckCircle2 className="w-4 h-4 text-indigo-500" /> {i}
                      </div>
                    ))}
                  </div>
                </SpotlightCard>
              </FadeIn>

              {/* Pro Plan */}
              <FadeIn delay={200}>
                <SpotlightCard className="p-10 h-full" spotlightColor="rgba(255, 255, 255, 0.05)">
                  <h3 className="text-2xl font-bold text-white mb-2">Pro</h3>
                  <div className="flex items-baseline gap-1 mb-6">
                    <span className="text-4xl font-bold text-white">${billingCycle === 'monthly' ? '12' : '10'}</span>
                    <span className="text-slate-500">/mo</span>
                  </div>
                  <p className="text-slate-400 mb-8">For serious teams shipping daily.</p>
                  <button className="w-full py-3 rounded-xl bg-zinc-800 border border-zinc-700 text-white font-bold hover:bg-zinc-700 transition-colors">
                    Start Trial
                  </button>
                  <div className="mt-8 space-y-4">
                    {['Everything in Starter', 'Unlimited Collaborators', 'Unlimited History', 'SSO & Advanced Security'].map(i => (
                      <div key={i} className="flex items-center gap-3 text-slate-300 text-sm">
                        <CheckCircle2 className="w-4 h-4 text-slate-600" /> {i}
                      </div>
                    ))}
                  </div>
                </SpotlightCard>
              </FadeIn>

            </div>
          </div>
        </section>

        {/* FAQ Section */}
        <section id="faq" className="py-24 max-w-3xl mx-auto px-6">
          <FadeIn>
            <div className="text-center mb-16">
              <h2 className="text-3xl md:text-5xl font-bold text-white mb-6">Common Questions</h2>
            </div>
          </FadeIn>
          <div className="space-y-2">
            {[
              { q: "Is there a free trial for the Pro plan?", a: "Yes, every new workspace comes with a 14-day free trial of Pro features. No credit card required." },
              { q: "Can I invite guests to my projects?", a: "Absolutely. Guests are unlimited on all plans and can be given view or edit access per project." },
              { q: "How secure is my data?", a: "We are SOC2 Type II compliant and encrypt all data at rest and in transit. Your intellectual property is safe with us." },
              { q: "Do you offer discounts for non-profits?", a: "Yes! We offer a 50% discount for registered non-profits and educational institutions. Contact support to apply." }
            ].map((faq, i) => (
              <FadeIn key={i} delay={i * 50}>
                <FAQItem question={faq.q} answer={faq.a} />
              </FadeIn>
            ))}
          </div>
        </section>

        {/* Final CTA */}
        <section className="py-24 px-6">
          <FadeIn>
            <div className="max-w-5xl mx-auto rounded-[3rem] bg-gradient-to-br from-indigo-900 via-purple-900 to-indigo-900 border border-white/10 p-8 md:p-16 text-center relative overflow-hidden group">
              {/* Background Texture */}
              <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-20"></div>
              <div className="absolute top-0 left-0 w-full h-full bg-indigo-500/20 blur-3xl rounded-full scale-150 opacity-0 group-hover:opacity-50 transition-opacity duration-700"></div>

              <div className="relative z-10">
                <h2 className="text-4xl md:text-6xl font-bold text-white mb-8 tracking-tight">Ready to build the future?</h2>
                <p className="text-indigo-200 text-lg md:text-xl mb-10 max-w-2xl mx-auto">
                  Join 100,000+ developers and designers who are changing the way they work today.
                </p>
                <div className="flex flex-col sm:flex-row justify-center gap-4">
                  <button className="px-8 py-4 bg-white text-black font-bold rounded-full text-lg hover:bg-indigo-50 transition-colors shadow-2xl shadow-indigo-500/50">
                    Get Started for Free
                  </button>
                  <button className="px-8 py-4 bg-indigo-800/50 border border-indigo-500/30 text-white font-bold rounded-full text-lg hover:bg-indigo-800 transition-colors">
                    Contact Sales
                  </button>
                </div>
              </div>
            </div>
          </FadeIn>
        </section>

        {/* Minimal Footer */}
        <footer className="border-t border-white/5 bg-black pt-16 pb-12">
           <div className="max-w-7xl mx-auto px-6 grid md:grid-cols-4 gap-12 mb-12">
              <div className="col-span-1 md:col-span-1">
                <div className="flex items-center gap-2 mb-4">
                   <div className="w-6 h-6 rounded bg-indigo-500"></div>
                   <span className="text-white font-bold">CollabBoard</span>
                </div>
                <p className="text-slate-500 text-sm mb-6">Making teamwork feel less like work and more like magic.</p>
              </div>
              
              <div className="col-span-1">
                <h4 className="text-white font-bold mb-4">Product</h4>
                <ul className="space-y-2 text-sm text-slate-500">
                  <li className="hover:text-white cursor-pointer transition-colors">Features</li>
                  <li className="hover:text-white cursor-pointer transition-colors">Integrations</li>
                  <li className="hover:text-white cursor-pointer transition-colors">Pricing</li>
                </ul>
              </div>

              <div className="col-span-1">
                <h4 className="text-white font-bold mb-4">Company</h4>
                <ul className="space-y-2 text-sm text-slate-500">
                  <li className="hover:text-white cursor-pointer transition-colors">About</li>
                  <li className="hover:text-white cursor-pointer transition-colors">Blog</li>
                  <li className="hover:text-white cursor-pointer transition-colors">Careers</li>
                </ul>
              </div>

              <div className="col-span-1">
                <h4 className="text-white font-bold mb-4">Subscribe</h4>
                <p className="text-slate-500 text-sm mb-4">Get the latest updates.</p>
                <div className="flex gap-2">
                  <input type="email" placeholder="Enter your email" className="bg-zinc-900 border border-white/10 rounded-lg px-4 py-2 text-sm text-white focus:outline-none focus:border-indigo-500 w-full" />
                  <button className="p-2 bg-indigo-600 rounded-lg hover:bg-indigo-500 transition-colors">
                    <ArrowRight className="w-4 h-4 text-white" />
                  </button>
                </div>
              </div>
           </div>
           
           <div className="max-w-7xl mx-auto px-6 border-t border-white/5 pt-8 flex flex-col md:flex-row justify-between items-center gap-6">
              <div className="text-slate-500 text-sm">
                 © 2024 CollabBoard Inc. <span className="mx-2">•</span> Privacy <span className="mx-2">•</span> Terms
              </div>
              <div className="flex gap-4">
                 <Globe className="w-5 h-5 text-slate-500 hover:text-white transition-colors cursor-pointer" />
                 <Users className="w-5 h-5 text-slate-500 hover:text-white transition-colors cursor-pointer" />
              </div>
           </div>
        </footer>

      </main>
    </div>
  );
}