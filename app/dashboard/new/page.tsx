"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";

export default function NewWhiteboard() {
  const router = useRouter();
  const [step, setStep] = useState<"template" | "settings" | "invite">("template");
  const [selectedTemplate, setSelectedTemplate] = useState<string | null>(null);
  const [boardName, setBoardName] = useState("");
  const [isPublic, setIsPublic] = useState(false);
  const [inviteEmails, setInviteEmails] = useState<string[]>([]);
  const [emailInput, setEmailInput] = useState("");
  const [collaborationFeatures, setCollaborationFeatures] = useState([
    { id: "cursors", label: "Show live cursors", enabled: true },
    { id: "comments", label: "Enable comments", enabled: true },
    { id: "reactions", label: "Allow emoji reactions", enabled: true },
    { id: "voice", label: "Voice/Video chat", enabled: false },
    { id: "timer", label: "Session timer", enabled: false },
  ]);

  const templates = [
    {
      id: "blank",
      name: "Blank Canvas",
      description: "Start from scratch with unlimited space",
      icon: "📄",
      gradient: "from-slate-500 to-gray-600",
      popular: false
    },
    {
      id: "brainstorm",
      name: "Brainstorming",
      description: "Organize ideas with sticky notes and mind maps",
      icon: "💡",
      gradient: "from-yellow-500 to-orange-500",
      popular: true
    },
    {
      id: "kanban",
      name: "Kanban Board",
      description: "Track tasks and workflows visually",
      icon: "📊",
      gradient: "from-blue-500 to-cyan-500",
      popular: true
    },
    {
      id: "wireframe",
      name: "Wireframe",
      description: "Design UI/UX mockups and prototypes",
      icon: "🎨",
      gradient: "from-purple-500 to-pink-500",
      popular: false
    },
    {
      id: "flowchart",
      name: "Flowchart",
      description: "Map processes and decision trees",
      icon: "🔀",
      gradient: "from-emerald-500 to-teal-500",
      popular: true
    },
    {
      id: "retrospective",
      name: "Retrospective",
      description: "Reflect on sprints with your team",
      icon: "🔄",
      gradient: "from-indigo-500 to-violet-500",
      popular: false
    },
    {
      id: "mindmap",
      name: "Mind Map",
      description: "Connect ideas and visualize concepts",
      icon: "🧠",
      gradient: "from-rose-500 to-pink-500",
      popular: false
    },
    {
      id: "presentation",
      name: "Presentation",
      description: "Create interactive slides and decks",
      icon: "📽️",
      gradient: "from-amber-500 to-red-500",
      popular: false
    },
  ];

  const collaborativeFeatures = [
    {
      icon: "👥",
      title: "Real-Time Collaboration",
      description: "See live cursors and edits from teammates instantly"
    },
    {
      icon: "💬",
      title: "Comments & Reactions",
      description: "Add feedback and reactions to any element"
    },
    {
      icon: "🎯",
      title: "Smart Templates",
      description: "Start quickly with AI-powered layouts"
    },
    {
      icon: "🔒",
      title: "Granular Permissions",
      description: "Control who can view, comment, or edit"
    },
    {
      icon: "📹",
      title: "Video & Voice Chat",
      description: "Built-in huddles for seamless communication"
    },
    {
      icon: "⚡",
      title: "Infinite Canvas",
      description: "Zoom, pan, and expand without limits"
    },
  ];

  const quickActions = [
    { icon: "✏️", label: "Drawing Tools", color: "from-pink-500 to-rose-500" },
    { icon: "📝", label: "Sticky Notes", color: "from-yellow-500 to-amber-500" },
    { icon: "🔷", label: "Shapes", color: "from-blue-500 to-cyan-500" },
    { icon: "📎", label: "File Upload", color: "from-purple-500 to-violet-500" },
    { icon: "🖼️", label: "Images", color: "from-emerald-500 to-teal-500" },
    { icon: "🔗", label: "Connectors", color: "from-indigo-500 to-blue-500" },
  ];

  const handleAddEmail = () => {
    if (emailInput && !inviteEmails.includes(emailInput)) {
      setInviteEmails([...inviteEmails, emailInput]);
      setEmailInput("");
    }
  };

  const handleCreateBoard = () => {
    // Create board logic here
    router.push(`/whiteboard/new-board-id`);
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

  return (
    <div className="min-h-screen bg-[#0c0c0f] text-gray-200">
      {/* Header */}
      <header className="sticky top-0 z-40 border-b border-white/10 bg-[#0f0f12]/95 backdrop-blur-xl">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="flex h-16 items-center justify-between">
            <div className="flex items-center gap-4">
              <Link href="/dashboard" className="flex items-center gap-2 text-gray-400 hover:text-white transition">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                </svg>
                <span className="text-sm font-medium">Back to Dashboard</span>
              </Link>
            </div>

            <div className="flex items-center gap-2">
              <div className="hidden sm:flex items-center gap-2 px-4 py-2 rounded-lg bg-white/5 border border-white/10">
                <div className={`w-2 h-2 rounded-full ${step === "template" ? "bg-indigo-500" : "bg-gray-600"}`}></div>
                <div className={`w-2 h-2 rounded-full ${step === "settings" ? "bg-indigo-500" : "bg-gray-600"}`}></div>
                <div className={`w-2 h-2 rounded-full ${step === "invite" ? "bg-indigo-500" : "bg-gray-600"}`}></div>
              </div>
            </div>
          </div>
        </div>
      </header>

      <main className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-8">
        {/* Step 1: Template Selection */}
        {step === "template" && (
          <div className="space-y-8">
            <div className="text-center space-y-3">
              <h1 className="text-4xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-indigo-300 via-purple-300 to-pink-300">
                Create New Whiteboard
              </h1>
              <p className="text-gray-400 text-lg">Choose a template to get started or start with a blank canvas</p>
            </div>

            {/* Template Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              {templates.map((template) => (
                <div
                  key={template.id}
                  onClick={() => setSelectedTemplate(template.id)}
                  className={`relative group cursor-pointer rounded-xl border-2 transition-all ${selectedTemplate === template.id
                    ? "border-indigo-500 bg-indigo-500/10"
                    : "border-white/10 bg-[#141418] hover:border-indigo-500/50 hover:bg-white/5"
                    }`}
                >
                  {template.popular && (
                    <div className="absolute -top-2 -right-2 z-10 px-3 py-1 rounded-full bg-gradient-to-r from-indigo-500 to-violet-500 text-xs font-bold text-white shadow-lg">
                      Popular
                    </div>
                  )}

                  <div className={`h-32 rounded-t-xl bg-gradient-to-br ${template.gradient} flex items-center justify-center text-5xl relative overflow-hidden`}>
                    <div className="absolute inset-0" style={{
                      backgroundImage: `linear-gradient(rgba(255,255,255,0.05) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.05) 1px, transparent 1px)`,
                      backgroundSize: "20px 20px"
                    }}></div>
                    <span className="relative z-10">{template.icon}</span>
                  </div>

                  <div className="p-4">
                    <h3 className="font-bold text-white mb-1 flex items-center justify-between">
                      {template.name}
                      {selectedTemplate === template.id && (
                        <svg className="w-5 h-5 text-indigo-400" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                        </svg>
                      )}
                    </h3>
                    <p className="text-sm text-gray-400">{template.description}</p>
                  </div>
                </div>
              ))}
            </div>

            {/* Collaborative Features */}
            <div className="bg-gradient-to-br from-indigo-500/10 to-violet-500/10 border border-indigo-500/20 rounded-2xl p-8">
              <h2 className="text-2xl font-bold text-white mb-6 text-center">Collaborative Features Included</h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {collaborativeFeatures.map((feature, index) => (
                  <div key={index} className="flex items-start gap-3">
                    <div className="text-3xl flex-shrink-0">{feature.icon}</div>
                    <div>
                      <h3 className="font-semibold text-white mb-1">{feature.title}</h3>
                      <p className="text-sm text-gray-400">{feature.description}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="flex justify-end">
              <button
                onClick={() => setStep("settings")}
                disabled={!selectedTemplate}
                className="px-8 py-3 rounded-lg bg-gradient-to-r from-indigo-600 to-violet-500 hover:from-indigo-500 hover:to-violet-400 text-white font-semibold shadow-lg shadow-indigo-500/30 transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
              >
                Continue
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </button>
            </div>
          </div>
        )}

        {/* Step 2: Board Settings */}
        {step === "settings" && (
          <div className="max-w-3xl mx-auto space-y-8">
            <div className="text-center space-y-3">
              <h1 className="text-4xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-indigo-300 via-purple-300 to-pink-300">
                Configure Your Board
              </h1>
              <p className="text-gray-400">Set up board details and collaborative tools</p>
            </div>

            <div className="bg-[#141418] border border-white/10 rounded-2xl p-8 space-y-6">
              {/* Board Name */}
              <div>
                <label className="block text-sm font-semibold text-white mb-2">Board Name</label>
                <input
                  type="text"
                  value={boardName}
                  onChange={(e) => setBoardName(e.target.value)}
                  placeholder="e.g., Q1 Marketing Strategy"
                  className="w-full px-4 py-3 rounded-lg bg-[#0c0c0f] border border-white/10 text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                />
              </div>

              {/* Quick Actions Preview */}
              <div>
                <label className="block text-sm font-semibold text-white mb-3">Available Tools</label>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                  {quickActions.map((action, index) => (
                    <div
                      key={index}
                      className="flex items-center gap-3 p-3 rounded-lg bg-white/5 border border-white/10"
                    >
                      <div className={`w-10 h-10 rounded-lg bg-gradient-to-br ${action.color} flex items-center justify-center text-xl flex-shrink-0`}>
                        {action.icon}
                      </div>
                      <span className="text-sm font-medium text-gray-300">{action.label}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Privacy Settings */}
              <div>
                <label className="block text-sm font-semibold text-white mb-3">Privacy</label>
                <div className="space-y-3">
                  <div
                    onClick={() => setIsPublic(false)}
                    className={`flex items-start gap-4 p-4 rounded-lg border-2 cursor-pointer transition-all ${!isPublic
                      ? "border-indigo-500 bg-indigo-500/10"
                      : "border-white/10 bg-white/5 hover:border-indigo-500/50"
                      }`}
                  >
                    <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center flex-shrink-0 mt-0.5 ${!isPublic ? "border-indigo-500" : "border-gray-500"
                      }`}>
                      {!isPublic && <div className="w-3 h-3 rounded-full bg-indigo-500"></div>}
                    </div>
                    <div>
                      <h4 className="font-semibold text-white mb-1">Private</h4>
                      <p className="text-sm text-gray-400">Only invited members can access this board</p>
                    </div>
                  </div>

                  <div
                    onClick={() => setIsPublic(true)}
                    className={`flex items-start gap-4 p-4 rounded-lg border-2 cursor-pointer transition-all ${isPublic
                      ? "border-indigo-500 bg-indigo-500/10"
                      : "border-white/10 bg-white/5 hover:border-indigo-500/50"
                      }`}
                  >
                    <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center flex-shrink-0 mt-0.5 ${isPublic ? "border-indigo-500" : "border-gray-500"
                      }`}>
                      {isPublic && <div className="w-3 h-3 rounded-full bg-indigo-500"></div>}
                    </div>
                    <div>
                      <h4 className="font-semibold text-white mb-1">Public</h4>
                      <p className="text-sm text-gray-400">Anyone with the link can view (requires login to edit)</p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Collaborative Features Toggle */}
              <div>
                <label className="block text-sm font-semibold text-white mb-3">Collaboration Features</label>
                <div className="space-y-3">
                  {collaborationFeatures.map((feature) => (
                    <div key={feature.id} className="flex items-center justify-between p-3 rounded-lg bg-white/5 border border-white/10">
                      <span className="text-sm text-gray-300">{feature.label}</span>
                      <button
                        onClick={() => handleToggleFeature(feature.id)}
                        className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${feature.enabled ? "bg-indigo-600" : "bg-gray-600"
                          }`}
                      >
                        <span
                          className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${feature.enabled ? "translate-x-6" : "translate-x-1"
                            }`}
                        />
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            <div className="flex justify-between">
              <button
                onClick={() => setStep("template")}
                className="px-6 py-3 rounded-lg border border-white/20 hover:bg-white/5 text-gray-300 font-semibold transition-all flex items-center gap-2"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                </svg>
                Back
              </button>
              <button
                onClick={() => setStep("invite")}
                className="px-8 py-3 rounded-lg bg-gradient-to-r from-indigo-600 to-violet-500 hover:from-indigo-500 hover:to-violet-400 text-white font-semibold shadow-lg shadow-indigo-500/30 transition-all flex items-center gap-2"
              >
                Continue
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </button>
            </div>
          </div>
        )}

        {/* Step 3: Invite Team */}
        {step === "invite" && (
          <div className="max-w-3xl mx-auto space-y-8">
            <div className="text-center space-y-3">
              <h1 className="text-4xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-indigo-300 via-purple-300 to-pink-300">
                Invite Your Team
              </h1>
              <p className="text-gray-400">Collaborate in real-time with your teammates</p>
            </div>

            <div className="bg-[#141418] border border-white/10 rounded-2xl p-8 space-y-6">
              {/* Email Invite */}
              <div>
                <label className="block text-sm font-semibold text-white mb-2">Invite by Email</label>
                <div className="flex gap-2">
                  <input
                    type="email"
                    value={emailInput}
                    onChange={(e) => setEmailInput(e.target.value)}
                    onKeyPress={(e) => e.key === "Enter" && handleAddEmail()}
                    placeholder="colleague@company.com"
                    className="flex-1 px-4 py-3 rounded-lg bg-[#0c0c0f] border border-white/10 text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  />
                  <button
                    onClick={handleAddEmail}
                    className="px-6 py-3 rounded-lg bg-indigo-600 hover:bg-indigo-500 text-white font-semibold transition-all"
                  >
                    Add
                  </button>
                </div>

                {/* Invited Members */}
                {inviteEmails.length > 0 && (
                  <div className="mt-4 space-y-2">
                    {inviteEmails.map((email, index) => (
                      <div
                        key={index}
                        className="flex items-center justify-between p-3 rounded-lg bg-white/5 border border-white/10"
                      >
                        <div className="flex items-center gap-3">
                          <div className="w-8 h-8 rounded-full bg-gradient-to-br from-indigo-500 to-violet-500 flex items-center justify-center text-xs font-bold">
                            {email[0].toUpperCase()}
                          </div>
                          <span className="text-sm text-gray-300">{email}</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <select className="px-3 py-1 rounded-lg bg-[#0c0c0f] border border-white/10 text-sm text-gray-300 focus:outline-none focus:ring-2 focus:ring-indigo-500">
                            <option>Can edit</option>
                            <option>Can view</option>
                            <option>Can comment</option>
                          </select>
                          <button
                            onClick={() => setInviteEmails(inviteEmails.filter((_, i) => i !== index))}
                            className="p-1 rounded hover:bg-white/10 transition"
                          >
                            <svg className="w-5 h-5 text-gray-400 hover:text-red-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                            </svg>
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* Share Link */}
              <div>
                <label className="block text-sm font-semibold text-white mb-2">Share Link</label>
                <div className="flex gap-2">
                  <input
                    type="text"
                    readOnly
                    value="https://collabboard.app/invite/abc123..."
                    className="flex-1 px-4 py-3 rounded-lg bg-[#0c0c0f] border border-white/10 text-gray-400 focus:outline-none"
                  />
                  <button className="px-6 py-3 rounded-lg bg-white/10 hover:bg-white/20 text-white font-semibold transition-all flex items-center gap-2">
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
                    </svg>
                    Copy
                  </button>
                </div>
              </div>

              {/* Quick Invite Options */}
              <div>
                <label className="block text-sm font-semibold text-white mb-3">Quick Invite</label>
                <div className="grid grid-cols-2 gap-3">
                  <button className="flex items-center justify-center gap-2 p-3 rounded-lg bg-white/5 border border-white/10 hover:bg-white/10 transition-all">
                    <svg className="w-5 h-5 text-blue-400" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
                    </svg>
                    <span className="text-sm font-medium text-gray-300">Slack</span>
                  </button>
                  <button className="flex items-center justify-center gap-2 p-3 rounded-lg bg-white/5 border border-white/10 hover:bg-white/10 transition-all">
                    <svg className="w-5 h-5 text-purple-400" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M5.042 15.165a2.528 2.528 0 0 1-2.52 2.523A2.528 2.528 0 0 1 0 15.165a2.527 2.527 0 0 1 2.522-2.52h2.52v2.52zM6.313 15.165a2.527 2.527 0 0 1 2.521-2.52 2.527 2.527 0 0 1 2.521 2.52v6.313A2.528 2.528 0 0 1 8.834 24a2.528 2.528 0 0 1-2.521-2.522v-6.313zM8.834 5.042a2.528 2.528 0 0 1-2.521-2.52A2.528 2.528 0 0 1 8.834 0a2.528 2.528 0 0 1 2.521 2.522v2.52H8.834zM8.834 6.313a2.528 2.528 0 0 1 2.521 2.521 2.528 2.528 0 0 1-2.521 2.521H2.522A2.528 2.528 0 0 1 0 8.834a2.528 2.528 0 0 1 2.522-2.521h6.312zM18.956 8.834a2.528 2.528 0 0 1 2.522-2.521A2.528 2.528 0 0 1 24 8.834a2.528 2.528 0 0 1-2.522 2.521h-2.522V8.834zM17.688 8.834a2.528 2.528 0 0 1-2.523 2.521 2.527 2.527 0 0 1-2.52-2.521V2.522A2.527 2.527 0 0 1 15.165 0a2.528 2.528 0 0 1 2.523 2.522v6.312zM15.165 18.956a2.528 2.528 0 0 1 2.523 2.522A2.528 2.528 0 0 1 15.165 24a2.527 2.527 0 0 1-2.52-2.522v-2.522h2.52zM15.165 17.688a2.527 2.527 0 0 1-2.52-2.523 2.526 2.526 0 0 1 2.52-2.52h6.313A2.527 2.527 0 0 1 24 15.165a2.528 2.528 0 0 1-2.522 2.523h-6.313z" />
                    </svg>
                    <span className="text-sm font-medium text-gray-300">Teams</span>
                  </button>
                </div>
              </div>

              {/* Skip Option */}
              <div className="text-center">
                <button
                  onClick={handleCreateBoard}
                  className="text-sm text-gray-400 hover:text-white transition-colors"
                >
                  Skip for now, I'll invite later
                </button>
              </div>
            </div>

            <div className="flex justify-between">
              <button
                onClick={() => setStep("settings")}
                className="px-6 py-3 rounded-lg border border-white/20 hover:bg-white/5 text-gray-300 font-semibold transition-all flex items-center gap-2"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                </svg>
                Back
              </button>
              <button
                onClick={handleCreateBoard}
                className="px-8 py-3 rounded-lg bg-gradient-to-r from-indigo-600 to-violet-500 hover:from-indigo-500 hover:to-violet-400 text-white font-semibold shadow-lg shadow-indigo-500/30 transition-all flex items-center gap-2"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
                Create Board
              </button>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}
