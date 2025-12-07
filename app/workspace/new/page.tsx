"use client";

import React, { useState, useCallback } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react"; // ✅ Added
import { dashboardService } from '@/app/(service)/dashboard.service';
import { motion, AnimatePresence } from "framer-motion";

export default function NewWhiteboard() {
  const router = useRouter();
  const { data: session, status } = useSession(); // ✅ Added NextAuth support
  
  const [step, setStep] = useState<"template" | "settings" | "invite">("template");
  const [selectedTemplate, setSelectedTemplate] = useState<string | null>(null);
  const [boardName, setBoardName] = useState("");
  const [isPublic, setIsPublic] = useState(false);
  const [inviteEmails, setInviteEmails] = useState<string[]>([]);
  const [emailInput, setEmailInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null); // ✅ Added error state
  
  const [collaborationFeatures, setCollaborationFeatures] = useState([
    { id: "cursors", label: "Show live cursors", enabled: true },
    { id: "comments", label: "Enable comments", enabled: true },
    { id: "reactions", label: "Allow emoji reactions", enabled: true },
    { id: "voice", label: "Voice/Video chat", enabled: false },
    { id: "timer", label: "Session timer", enabled: false },
  ]);

  const templates = [
    { id: "blank", name: "Blank Canvas", description: "Start from scratch with unlimited space", icon: "📄", gradient: "from-slate-500 to-gray-600", popular: false },
    { id: "brainstorm", name: "Brainstorming", description: "Organize ideas with sticky notes and mind maps", icon: "💡", gradient: "from-yellow-500 to-orange-500", popular: true },
    { id: "kanban", name: "Kanban Board", description: "Track tasks and workflows visually", icon: "📊", gradient: "from-blue-500 to-cyan-500", popular: true },
    { id: "wireframe", name: "Wireframe", description: "Design UI/UX mockups and prototypes", icon: "🎨", gradient: "from-purple-500 to-pink-500", popular: false },
    { id: "flowchart", name: "Flowchart", description: "Map processes and decision trees", icon: "🔀", gradient: "from-emerald-500 to-teal-500", popular: true },
    { id: "retrospective", name: "Retrospective", description: "Reflect on sprints with your team", icon: "🔄", gradient: "from-indigo-500 to-violet-500", popular: false },
    { id: "mindmap", name: "Mind Map", description: "Connect ideas and visualize concepts", icon: "🧠", gradient: "from-rose-500 to-pink-500", popular: false },
    { id: "presentation", name: "Presentation", description: "Create interactive slides and decks", icon: "📽️", gradient: "from-amber-500 to-red-500", popular: false },
  ];

  // ✅ UNIFIED TOKEN GETTER (matches workspace logic)
  const getToken = useCallback(() => {
    // Try NextAuth session first
    if (session && (session as any).accessToken) {
      return (session as any).accessToken;
    }
    // Fallback to LocalStorage
    if (typeof window !== "undefined") {
      return localStorage.getItem("auth_token");
    }
    return null;
  }, [session]);

  const handleAddEmail = () => {
    if (emailInput && !inviteEmails.includes(emailInput)) {
      setInviteEmails([...inviteEmails, emailInput]);
      setEmailInput("");
    }
  };

  // ✅ IMPROVED CREATE BOARD WITH BETTER ERROR HANDLING
  const handleCreateBoard = async () => {
    try {
      setIsLoading(true);
      setError(null);
      
      // ✅ Use unified token getter
      const token = getToken();

      if (!token) {
        setError("Please login first");
        setTimeout(() => router.push('/login'), 1500);
        return;
      }

      const finalTitle:any = boardName.trim() || 
        (selectedTemplate ? templates.find(t => t.id === selectedTemplate)?.name : "Untitled Board");
      
      console.log("📤 Creating dashboard with:", {
        title: finalTitle,
        template: selectedTemplate,
        isPublic,
      });

      // ✅ Better error handling for API call
      const response:any = await dashboardService.createDashboard(token, {
        title: finalTitle,
        description: `Created from ${selectedTemplate || 'blank'} template`,
        template: selectedTemplate || 'blank',
        isPublic: isPublic,
      });

      console.log("✅ Dashboard created:", response);

      // ✅ More robust ID extraction
      const dashboardId = response?.dashboard?.id || response?.data?.id || response?.id;
      
      if (!dashboardId) {
        throw new Error("Dashboard created but no ID returned from server");
      }

      // ✅ Navigate to the new dashboard
      router.push(`/workspace/${dashboardId}`);

    } catch (error: any) {
      console.error("❌ Failed to create board:", error);
      
      // ✅ Better error messages
      let errorMessage = "Failed to create dashboard";
      
      if (error.response?.status === 401) {
        errorMessage = "Session expired. Please login again.";
        setTimeout(() => router.push('/login'), 2000);
      } else if (error.response?.status === 403) {
        errorMessage = "You don't have permission to create dashboards.";
      } else if (error.response?.data?.message) {
        errorMessage = error.response.data.message;
      } else if (error.message) {
        errorMessage = error.message;
      }
      
      setError(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  const handleToggleFeature = (featureId: string) => {
    setCollaborationFeatures(prevFeatures =>
      prevFeatures.map(feature =>
        feature.id === featureId
          ? { ...feature, enabled: !feature.enabled }
          : feature
      )
    );
  };

  const pageVariants = {
    initial: { opacity: 0, y: 20 },
    animate: { opacity: 1, y: 0 },
    exit: { opacity: 0, y: -20 }
  };

  // ✅ Show loading state while checking auth
  if (status === "loading") {
    return (
      <div className="min-h-screen bg-[#0c0c0f] flex items-center justify-center">
        <motion.div
          className="text-center"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
        >
          <div className="w-12 h-12 border-4 border-indigo-500/30 border-t-indigo-500 rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-400">Loading...</p>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#0c0c0f] text-gray-200">
      {/* Header */}
      <motion.header 
        className="sticky top-0 z-40 border-b border-white/10 bg-[#0f0f12]/95 backdrop-blur-xl"
        initial={{ y: -100 }}
        animate={{ y: 0 }}
        transition={{ type: "spring", stiffness: 100 }}
      >
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="flex h-16 items-center justify-between">
            <Link href="/workspace">
              <motion.div 
                className="flex items-center gap-2 text-gray-400 hover:text-white transition"
                whileHover={{ x: -5 }}
                whileTap={{ scale: 0.95 }}
              >
                <motion.svg 
                  className="w-5 h-5" 
                  fill="none" 
                  stroke="currentColor" 
                  viewBox="0 0 24 24"
                  animate={{ x: [-2, 0, -2] }}
                  transition={{ duration: 1.5, repeat: Infinity }}
                >
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                </motion.svg>
                <span className="text-sm font-medium">Back to Workspace</span>
              </motion.div>
            </Link>

            {/* Step Indicators */}
            <div className="flex items-center gap-2">
              <div className="hidden sm:flex items-center gap-2 px-4 py-2 rounded-lg bg-white/5 border border-white/10">
                <motion.div 
                  className={`w-2 h-2 rounded-full`}
                  animate={{ 
                    backgroundColor: step === "template" ? "#6366f1" : "#4b5563",
                    scale: step === "template" ? [1, 1.3, 1] : 1
                  }}
                  transition={{ duration: 0.3 }}
                />
                <motion.div 
                  className={`w-2 h-2 rounded-full`}
                  animate={{ 
                    backgroundColor: step === "settings" ? "#6366f1" : "#4b5563",
                    scale: step === "settings" ? [1, 1.3, 1] : 1
                  }}
                  transition={{ duration: 0.3 }}
                />
                <motion.div 
                  className={`w-2 h-2 rounded-full`}
                  animate={{ 
                    backgroundColor: step === "invite" ? "#6366f1" : "#4b5563",
                    scale: step === "invite" ? [1, 1.3, 1] : 1
                  }}
                  transition={{ duration: 0.3 }}
                />
              </div>
              <motion.span 
                className="text-sm font-medium text-gray-400"
                key={step}
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3 }}
              >
                {step === "template" ? "Select Template" : step === "settings" ? "Board Settings" : "Invite Team"}
              </motion.span>
            </div>

            <div className="w-24"></div>
          </div>
        </div>
      </motion.header>

      <main className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8 py-12">
        {/* ✅ GLOBAL ERROR DISPLAY */}
        <AnimatePresence>
          {error && (
            <motion.div
              className="mb-6 bg-red-500/10 border border-red-500/20 p-4 rounded-xl flex items-center justify-between"
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
            >
              <span className="text-red-300 text-sm flex items-center gap-2">
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                </svg>
                {error}
              </span>
              <button onClick={() => setError(null)} className="text-red-300 hover:text-white">
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </motion.div>
          )}
        </AnimatePresence>

        <AnimatePresence mode="wait">
          {/* Step 1: Template Selection */}
          {step === "template" && (
            <motion.div 
              key="template"
              variants={pageVariants}
              initial="initial"
              animate="animate"
              exit="exit"
              transition={{ duration: 0.4 }}
              className="space-y-8"
            >
              <motion.div 
                className="text-center"
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 }}
              >
                <h1 className="text-3xl font-bold text-white mb-3">Choose a Template</h1>
                <p className="text-gray-400">Start with a pre-built structure or create your own</p>
              </motion.div>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                {templates.map((template, index) => (
                  <motion.div
                    key={template.id}
                    initial={{ opacity: 0, scale: 0.8, y: 20 }}
                    animate={{ opacity: 1, scale: 1, y: 0 }}
                    transition={{ delay: index * 0.05, type: "spring", stiffness: 300, damping: 20 }}
                    onClick={() => setSelectedTemplate(template.id)}
                    className={`group relative p-6 rounded-xl border cursor-pointer transition-all ${
                      selectedTemplate === template.id
                        ? "bg-[#1a1a1f] border-indigo-500 ring-2 ring-indigo-500/20"
                        : "bg-[#141418] border-white/10 hover:border-white/20 hover:bg-[#1a1a1f]"
                    }`}
                    whileHover={{ 
                      y: -8, 
                      scale: 1.02,
                      boxShadow: "0 20px 25px -5px rgba(99, 102, 241, 0.3)"
                    }}
                    whileTap={{ scale: 0.98 }}
                  >
                    <motion.div 
                      className={`w-12 h-12 rounded-lg bg-gradient-to-br ${template.gradient} bg-opacity-10 flex items-center justify-center text-2xl mb-4`}
                      whileHover={{ scale: 1.2, rotate: 5 }}
                      transition={{ type: "spring", stiffness: 400, damping: 10 }}
                    >
                      {template.icon}
                    </motion.div>
                    <h3 className="font-semibold text-white mb-1">{template.name}</h3>
                    <p className="text-sm text-gray-400">{template.description}</p>
                    
                    {template.popular && (
                      <motion.span 
                        className="absolute top-3 right-3 px-2 py-0.5 rounded-full bg-indigo-500/20 text-indigo-300 text-xs font-medium"
                        initial={{ scale: 0, rotate: -180 }}
                        animate={{ scale: 1, rotate: 0 }}
                        transition={{ delay: index * 0.05 + 0.3, type: "spring", stiffness: 500 }}
                      >
                        Popular
                      </motion.span>
                    )}

                    {selectedTemplate === template.id && (
                      <motion.div
                        className="absolute inset-0 rounded-xl border-2 border-indigo-500"
                        initial={{ scale: 0.9, opacity: 0 }}
                        animate={{ scale: 1, opacity: 1 }}
                        transition={{ type: "spring", stiffness: 500, damping: 30 }}
                      />
                    )}
                  </motion.div>
                ))}
              </div>

              <motion.div 
                className="flex justify-center mt-8"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.6 }}
              >
                <motion.button
                  onClick={() => setStep("settings")}
                  disabled={!selectedTemplate}
                  className="px-8 py-3 rounded-lg bg-gradient-to-r from-indigo-600 to-violet-500 hover:from-indigo-500 hover:to-violet-400 text-white font-semibold disabled:opacity-50 disabled:cursor-not-allowed transition-all"
                  whileHover={{ scale: 1.05, boxShadow: "0 20px 25px -5px rgba(99, 102, 241, 0.5)" }}
                  whileTap={{ scale: 0.95 }}
                  animate={selectedTemplate ? { opacity: 1 } : { opacity: 0.5 }}
                >
                  Continue
                </motion.button>
              </motion.div>
            </motion.div>
          )}

          {/* Step 2: Board Settings */}
          {step === "settings" && (
            <motion.div 
              key="settings"
              variants={pageVariants}
              initial="initial"
              animate="animate"
              exit="exit"
              transition={{ duration: 0.4 }}
              className="max-w-2xl mx-auto space-y-8"
            >
              <motion.div 
                className="text-center"
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 }}
              >
                <h1 className="text-3xl font-bold text-white mb-3">Board Settings</h1>
                <p className="text-gray-400">Configure your board&apos;s preferences</p>
              </motion.div>

              <motion.div 
                className="bg-[#141418] border border-white/10 rounded-xl p-6 space-y-6"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
              >
                <motion.div
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.3 }}
                >
                  <label className="block text-sm font-medium text-gray-300 mb-2">Board Name</label>
                  <motion.input
                    type="text"
                    value={boardName}
                    onChange={(e) => setBoardName(e.target.value)}
                    placeholder={templates.find(t => t.id === selectedTemplate)?.name || "Untitled Board"}
                    className="w-full px-4 py-3 rounded-lg bg-[#0c0c0f] border border-white/10 text-gray-200 focus:outline-none focus:border-indigo-500 transition"
                    whileFocus={{ scale: 1.02 }}
                  />
                </motion.div>

                <motion.div
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.4 }}
                >
                  <label className="block text-sm font-medium text-gray-300 mb-2">Visibility</label>
                  <div className="grid grid-cols-2 gap-4">
                    <motion.button
                      onClick={() => setIsPublic(false)}
                      className={`p-4 rounded-lg border text-left transition ${
                        !isPublic
                          ? "bg-indigo-600/10 border-indigo-500"
                          : "bg-[#0c0c0f] border-white/10 hover:border-white/20"
                      }`}
                      whileHover={{ scale: 1.03 }}
                      whileTap={{ scale: 0.98 }}
                    >
                      <div className="font-semibold text-white mb-1">Private</div>
                      <div className="text-xs text-gray-400">Only invited members can access</div>
                    </motion.button>
                    <motion.button
                      onClick={() => setIsPublic(true)}
                      className={`p-4 rounded-lg border text-left transition ${
                        isPublic
                          ? "bg-indigo-600/10 border-indigo-500"
                          : "bg-[#0c0c0f] border-white/10 hover:border-white/20"
                      }`}
                      whileHover={{ scale: 1.03 }}
                      whileTap={{ scale: 0.98 }}
                    >
                      <div className="font-semibold text-white mb-1">Public</div>
                      <div className="text-xs text-gray-400">Anyone with the link can view</div>
                    </motion.button>
                  </div>
                </motion.div>

                <motion.div
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.5 }}
                >
                  <label className="block text-sm font-medium text-gray-300 mb-2">Features</label>
                  <div className="space-y-2">
                    {collaborationFeatures.map((feature, index) => (
                      <motion.div 
                        key={feature.id} 
                        className="flex items-center justify-between p-3 rounded-lg bg-[#0c0c0f] border border-white/5"
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: 0.6 + index * 0.05 }}
                        whileHover={{ x: 5, backgroundColor: "rgba(255,255,255,0.02)" }}
                      >
                        <span className="text-sm text-gray-300">{feature.label}</span>
                        <motion.button
                          onClick={() => handleToggleFeature(feature.id)}
                          className={`w-10 h-5 rounded-full relative transition-colors ${
                            feature.enabled ? "bg-indigo-500" : "bg-gray-600"
                          }`}
                          whileTap={{ scale: 0.95 }}
                        >
                          <motion.span 
                            className="absolute top-1 w-3 h-3 rounded-full bg-white"
                            animate={{ 
                              left: feature.enabled ? "20px" : "4px"
                            }}
                            transition={{ type: "spring", stiffness: 700, damping: 30 }}
                          />
                        </motion.button>
                      </motion.div>
                    ))}
                  </div>
                </motion.div>
              </motion.div>

              <motion.div 
                className="flex justify-between pt-4"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.8 }}
              >
                <motion.button
                  onClick={() => setStep("template")}
                  className="text-gray-400 hover:text-white transition"
                  whileHover={{ x: -5 }}
                  whileTap={{ scale: 0.95 }}
                >
                  Back
                </motion.button>
                <motion.button
                  onClick={() => setStep("invite")}
                  className="px-8 py-3 rounded-lg bg-gradient-to-r from-indigo-600 to-violet-500 hover:from-indigo-500 hover:to-violet-400 text-white font-semibold transition-all"
                  whileHover={{ scale: 1.05, boxShadow: "0 20px 25px -5px rgba(99, 102, 241, 0.5)" }}
                  whileTap={{ scale: 0.95 }}
                >
                  Next
                </motion.button>
              </motion.div>
            </motion.div>
          )}

          {/* Step 3: Invite Team */}
          {step === "invite" && (
            <motion.div 
              key="invite"
              variants={pageVariants}
              initial="initial"
              animate="animate"
              exit="exit"
              transition={{ duration: 0.4 }}
              className="max-w-2xl mx-auto space-y-8"
            >
              <motion.div 
                className="text-center"
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 }}
              >
                <h1 className="text-3xl font-bold text-white mb-3">Invite Team</h1>
                <p className="text-gray-400">Start collaborating right away</p>
              </motion.div>

              <motion.div 
                className="bg-[#141418] border border-white/10 rounded-xl p-6 space-y-6"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
              >
                <motion.div
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.3 }}
                >
                  <label className="block text-sm font-medium text-gray-300 mb-2">Email Addresses</label>
                  <div className="flex gap-2">
                    <motion.input
                      type="email"
                      value={emailInput}
                      onChange={(e) => setEmailInput(e.target.value)}
                      onKeyDown={(e) => e.key === 'Enter' && handleAddEmail()}
                      placeholder="colleague@company.com"
                      className="flex-1 px-4 py-3 rounded-lg bg-[#0c0c0f] border border-white/10 text-gray-200 focus:outline-none focus:border-indigo-500 transition"
                      whileFocus={{ scale: 1.01 }}
                    />
                    <motion.button
                      onClick={handleAddEmail}
                      className="px-4 py-3 rounded-lg bg-white/5 border border-white/10 hover:bg-white/10 text-white transition"
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                    >
                      Add
                    </motion.button>
                  </div>
                </motion.div>

                <AnimatePresence mode="popLayout">
                  {inviteEmails.length > 0 && (
                    <motion.div 
                      className="flex flex-wrap gap-2"
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: "auto" }}
                      exit={{ opacity: 0, height: 0 }}
                    >
                      {inviteEmails.map((email, index) => (
                        <motion.span 
                          key={email} 
                          className="flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-500/20 text-indigo-300 border border-indigo-500/30 text-sm"
                          initial={{ opacity: 0, scale: 0 }}
                          animate={{ opacity: 1, scale: 1 }}
                          exit={{ opacity: 0, scale: 0 }}
                          transition={{ delay: index * 0.05 }}
                          whileHover={{ scale: 1.05 }}
                        >
                          {email}
                          <motion.button
                            onClick={() => setInviteEmails(inviteEmails.filter(e => e !== email))}
                            className="hover:text-white"
                            whileHover={{ scale: 1.3, rotate: 90 }}
                            whileTap={{ scale: 0.9 }}
                          >
                            ×
                          </motion.button>
                        </motion.span>
                      ))}
                    </motion.div>
                  )}
                </AnimatePresence>

                <motion.div 
                  className="bg-indigo-500/10 border border-indigo-500/20 rounded-lg p-4 flex items-start gap-3"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.4 }}
                >
                  <motion.div 
                    className="p-2 bg-indigo-500/20 rounded-lg"
                    animate={{ rotate: [0, 5, -5, 0] }}
                    transition={{ duration: 2, repeat: Infinity, repeatType: "reverse" }}
                  >
                    <svg className="w-5 h-5 text-indigo-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                  </motion.div>
                  <div>
                    <h4 className="text-sm font-semibold text-indigo-300 mb-1">Pro Tip</h4>
                    <p className="text-xs text-gray-400">You can also share a public link later if you skipped inviting people now.</p>
                  </div>
                </motion.div>
              </motion.div>

              <motion.div 
                className="flex justify-between pt-4"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.5 }}
              >
                <motion.button
                  onClick={() => setStep("settings")}
                  className="text-gray-400 hover:text-white transition"
                  whileHover={{ x: -5 }}
                  whileTap={{ scale: 0.95 }}
                >
                  Back
                </motion.button>
                <motion.button
                  onClick={handleCreateBoard}
                  disabled={isLoading}
                  className="px-8 py-3 rounded-lg bg-gradient-to-r from-indigo-600 to-violet-500 hover:from-indigo-500 hover:to-violet-400 text-white font-semibold transition-all flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
                  whileHover={!isLoading ? { scale: 1.05, boxShadow: "0 20px 25px -5px rgba(99, 102, 241, 0.5)" } : {}}
                  whileTap={!isLoading ? { scale: 0.95 } : {}}
                >
                  {isLoading ? (
                    <>
                      <motion.div 
                        className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full"
                        animate={{ rotate: 360 }}
                        transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                      />
                      Creating...
                    </>
                  ) : (
                    <>
                      <motion.span
                        initial={{ rotate: 0 }}
                        whileHover={{ rotate: 90 }}
                        transition={{ type: "spring", stiffness: 300 }}
                      >
                        ✨
                      </motion.span>
                      Create Board
                    </>
                  )}
                </motion.button>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      </main>
    </div>
  );
}
