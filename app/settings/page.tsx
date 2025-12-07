"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";

function classNames(...classes: string[]) {
  return classes.filter(Boolean).join(" ");
}

export default function ProfileSettings() {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState("profile");
  const [isSaving, setIsSaving] = useState(false);

  const [formData, setFormData] = useState({
    fullName: "John Doe",
    email: "john.doe@example.com",
    username: "johndoe",
    bio: "Product designer & developer passionate about creating intuitive experiences.",
    company: "CollabBoard Inc.",
    location: "San Francisco, CA",
    website: "https://johndoe.com",
  });

  const [notifications, setNotifications] = useState({
    emailNotifications: true,
    pushNotifications: true,
    boardUpdates: true,
    comments: true,
    mentions: true,
    weeklyDigest: false,
  });

  const [privacy, setPrivacy] = useState({
    profileVisibility: "public",
    showEmail: false,
    allowIndexing: true,
    twoFactorAuth: false,
  });

  const [appearance, setAppearance] = useState({
    theme: "dark",
    compactMode: false,
    animations: true,
  });

  const handleSave = () => {
    setIsSaving(true);
    setTimeout(() => setIsSaving(false), 1500);
  };

  const tabs = [
    { id: "profile", label: "Profile", icon: "M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" },
    { id: "account", label: "Account", icon: "M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065zM15 12a3 3 0 11-6 0 3 3 0 016 0z" },
    { id: "notifications", label: "Notifications", icon: "M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" },
    { id: "privacy", label: "Privacy & Security", icon: "M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" },
    { id: "appearance", label: "Appearance", icon: "M7 21a4 4 0 01-4-4V5a2 2 0 012-2h4a2 2 0 012 2v12a4 4 0 01-4 4zm0 0h12a2 2 0 002-2v-4a2 2 0 00-2-2h-2.343M11 7.343l1.657-1.657a2 2 0 012.828 0l2.829 2.829a2 2 0 010 2.828l-8.486 8.485M7 17h.01" },
  ];

  const profileComplete = Math.min(
    100,
    20 +
      (formData.fullName ? 20 : 0) +
      (formData.bio ? 15 : 0) +
      (formData.company ? 10 : 0) +
      (formData.website ? 10 : 0) +
      (formData.location ? 10 : 0) +
      (privacy.twoFactorAuth ? 15 : 0)
  );

  return (
    <div className="min-h-screen bg-[#0c0c0f] text-gray-200">
      {/* Header */}
      <header className="sticky top-0 z-40 border-b border-white/10 bg-[#0f0f12]/95 backdrop-blur-xl">
        <div className="mx-auto px-4 sm:px-6 lg:px-8 flex h-16 items-center justify-between">
          <div className="flex items-center gap-4">
            <button
              onClick={() => router.back()}
              className="p-2 rounded-lg hover:bg-white/10 transition"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
              </svg>
            </button>
            <div className="rounded-lg bg-gradient-to-r from-indigo-600 to-violet-500 p-0.5">
              <div className="bg-[#0c0c0f] rounded-md px-3 py-1 font-bold text-sm text-indigo-300">
                CollabBoard
              </div>
            </div>
            <h1 className="text-lg font-semibold text-white">Settings</h1>
          </div>
          <button
            onClick={handleSave}
            disabled={isSaving}
            className={classNames(
              "px-5 py-2 rounded-lg bg-gradient-to-r from-indigo-600 to-violet-500",
              "hover:from-indigo-500 hover:to-violet-400",
              "text-white font-semibold shadow-lg shadow-indigo-500/20 transition-all",
              "disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
            )}
          >
            {isSaving ? (
              <>
                <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                Saving...
              </>
            ) : (
              "Save Changes"
            )}
          </button>
        </div>
      </header>

      <main className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-10">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Sidebar */}
          <aside className="lg:col-span-1">
            <nav className="sticky top-28 bg-[#141418] border border-white/10 rounded-xl p-2 flex flex-col gap-1">
              {tabs.map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={classNames(
                    "flex items-center gap-3 px-4 py-3 rounded-lg font-medium text-left transition-all",
                    activeTab === tab.id
                      ? "bg-gradient-to-r from-indigo-600 to-violet-500 text-white"
                      : "text-gray-400 hover:bg-white/5 hover:text-white"
                  )}
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d={tab.icon} />
                  </svg>
                  <span className="text-sm">{tab.label}</span>
                </button>
              ))}
            </nav>
          </aside>

          {/* Main Content */}
          <div className="lg:col-span-3 space-y-8">
            <AnimatePresence mode="wait">
              {/* PROFILE TAB */}
              {activeTab === "profile" && (
                <motion.div
                  key="profile"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  transition={{ duration: 0.2 }}
                  className="space-y-8"
                >
                  {/* Profile Header */}
                  <div className="relative overflow-hidden rounded-xl border border-white/10 bg-[#141418]">
                    <div className="h-32 bg-gradient-to-r from-indigo-600 to-violet-500" />
                    <div className="relative px-8 pb-8 -mt-16 flex items-end gap-6">
                      <div className="relative">
                        <div className="w-28 h-28 rounded-full bg-gradient-to-br from-indigo-500 to-violet-500 flex items-center justify-center text-4xl font-bold border-4 border-[#141418]">
                          JD
                          <span className="absolute bottom-2 right-2 w-4 h-4 rounded-full ring-2 ring-[#141418] bg-emerald-400" />
                        </div>
                      </div>
                      <div className="flex-1 pt-16">
                        <div className="flex items-center gap-3 mb-2">
                          <h2 className="text-2xl font-bold text-white">{formData.fullName}</h2>
                          <span className="px-2 py-1 bg-emerald-500/20 text-emerald-300 rounded-full text-xs font-semibold">
                            Online
                          </span>
                        </div>
                        <p className="text-sm text-gray-400">@{formData.username}</p>
                        
                        {/* Progress */}
                        <div className="mt-4 max-w-md">
                          <div className="flex justify-between text-xs mb-2">
                            <span className="text-gray-400">Profile completeness</span>
                            <span className="font-semibold text-indigo-400">{profileComplete}%</span>
                          </div>
                          <div className="w-full h-2 bg-[#0c0c0f] rounded-full overflow-hidden">
                            <div
                              className="h-full rounded-full bg-gradient-to-r from-indigo-600 to-violet-500 transition-all duration-500"
                              style={{ width: `${profileComplete}%` }}
                            />
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Profile Form */}
                  <div className="bg-[#141418] border border-white/10 rounded-xl p-8">
                    <h3 className="text-xl font-semibold text-white mb-6">Profile Information</h3>
                    <div className="space-y-6">
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                        <div>
                          <label className="block text-sm font-medium text-gray-300 mb-2">Full Name</label>
                          <input
                            type="text"
                            value={formData.fullName}
                            onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
                            className="w-full px-4 py-3 rounded-lg bg-[#0c0c0f] border border-white/10 text-gray-200 focus:outline-none focus:ring-2 focus:ring-indigo-500 transition"
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-300 mb-2">Username</label>
                          <input
                            type="text"
                            value={formData.username}
                            onChange={(e) => setFormData({ ...formData, username: e.target.value })}
                            className="w-full px-4 py-3 rounded-lg bg-[#0c0c0f] border border-white/10 text-gray-200 focus:outline-none focus:ring-2 focus:ring-indigo-500 transition"
                          />
                        </div>
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-300 mb-2">Email</label>
                        <input
                          type="email"
                          value={formData.email}
                          onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                          className="w-full px-4 py-3 rounded-lg bg-[#0c0c0f] border border-white/10 text-gray-200 focus:outline-none focus:ring-2 focus:ring-indigo-500 transition"
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-300 mb-2">Bio</label>
                        <textarea
                          value={formData.bio}
                          onChange={(e) => setFormData({ ...formData, bio: e.target.value })}
                          rows={4}
                          className="w-full px-4 py-3 rounded-lg bg-[#0c0c0f] border border-white/10 text-gray-200 focus:outline-none focus:ring-2 focus:ring-indigo-500 resize-none transition"
                        />
                        <p className="text-xs text-gray-500 mt-2">Brief description. Max 200 characters.</p>
                      </div>

                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                        <div>
                          <label className="block text-sm font-medium text-gray-300 mb-2">Company</label>
                          <input
                            type="text"
                            value={formData.company}
                            onChange={(e) => setFormData({ ...formData, company: e.target.value })}
                            className="w-full px-4 py-3 rounded-lg bg-[#0c0c0f] border border-white/10 text-gray-200 focus:outline-none focus:ring-2 focus:ring-indigo-500 transition"
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-300 mb-2">Location</label>
                          <input
                            type="text"
                            value={formData.location}
                            onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                            className="w-full px-4 py-3 rounded-lg bg-[#0c0c0f] border border-white/10 text-gray-200 focus:outline-none focus:ring-2 focus:ring-indigo-500 transition"
                          />
                        </div>
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-300 mb-2">Website</label>
                        <input
                          type="url"
                          value={formData.website}
                          onChange={(e) => setFormData({ ...formData, website: e.target.value })}
                          className="w-full px-4 py-3 rounded-lg bg-[#0c0c0f] border border-white/10 text-gray-200 focus:outline-none focus:ring-2 focus:ring-indigo-500 transition"
                        />
                      </div>
                    </div>
                  </div>
                </motion.div>
              )}

              {/* ACCOUNT TAB */}
              {activeTab === "account" && (
                <motion.div
                  key="account"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  transition={{ duration: 0.2 }}
                  className="space-y-8"
                >
                  <div className="bg-[#141418] border border-white/10 rounded-xl p-8">
                    <h3 className="text-xl font-semibold text-white mb-6">Change Password</h3>
                    <div className="space-y-6">
                      <div>
                        <label className="block text-sm font-medium text-gray-300 mb-2">Current Password</label>
                        <input
                          type="password"
                          placeholder="••••••••"
                          className="w-full px-4 py-3 rounded-lg bg-[#0c0c0f] border border-white/10 text-gray-200 focus:outline-none focus:ring-2 focus:ring-indigo-500 transition"
                        />
                      </div>
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                        <div>
                          <label className="block text-sm font-medium text-gray-300 mb-2">New Password</label>
                          <input
                            type="password"
                            placeholder="••••••••"
                            className="w-full px-4 py-3 rounded-lg bg-[#0c0c0f] border border-white/10 text-gray-200 focus:outline-none focus:ring-2 focus:ring-indigo-500 transition"
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-300 mb-2">Confirm Password</label>
                          <input
                            type="password"
                            placeholder="••••••••"
                            className="w-full px-4 py-3 rounded-lg bg-[#0c0c0f] border border-white/10 text-gray-200 focus:outline-none focus:ring-2 focus:ring-indigo-500 transition"
                          />
                        </div>
                      </div>
                      <button className="px-6 py-3 rounded-lg bg-gradient-to-r from-indigo-600 to-violet-500 hover:from-indigo-500 hover:to-violet-400 text-white font-semibold transition shadow-lg shadow-indigo-500/20">
                        Update Password
                      </button>
                    </div>
                  </div>

                  <div className="bg-[#141418] border border-white/10 rounded-xl p-8">
                    <h3 className="text-xl font-semibold text-white mb-6">Connected Accounts</h3>
                    <div className="space-y-4">
                      {[
                        { name: "Google", connected: true, icon: "G", color: "from-red-500 to-orange-500" },
                        { name: "GitHub", connected: true, icon: "GH", color: "from-gray-700 to-gray-900" },
                        { name: "Slack", connected: false, icon: "S", color: "from-purple-500 to-pink-500" },
                      ].map((account) => (
                        <div key={account.name} className="flex items-center justify-between p-5 rounded-lg bg-[#0c0c0f] border border-white/10 hover:border-white/20 transition">
                          <div className="flex items-center gap-4">
                            <div className={`w-12 h-12 rounded-lg bg-gradient-to-br ${account.color} flex items-center justify-center font-bold text-white shadow`}>
                              {account.icon}
                            </div>
                            <div>
                              <p className="text-white font-semibold">{account.name}</p>
                              <p className="text-sm text-gray-400">
                                {account.connected ? "Connected" : "Not connected"}
                              </p>
                            </div>
                          </div>
                          <button
                            className={`px-5 py-2 rounded-lg font-semibold transition ${
                              account.connected
                                ? "bg-red-500/10 hover:bg-red-500/20 text-red-400 border border-red-500/30"
                                : "bg-gradient-to-r from-indigo-600 to-violet-500 hover:from-indigo-500 hover:to-violet-400 text-white"
                            }`}
                          >
                            {account.connected ? "Disconnect" : "Connect"}
                          </button>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className="bg-red-500/10 border border-red-500/30 rounded-xl p-8">
                    <h3 className="text-xl font-semibold text-red-400 mb-6 flex items-center gap-2">
                      <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                      </svg>
                      Danger Zone
                    </h3>
                    <div className="flex items-center justify-between p-5 rounded-lg bg-black/20 border border-red-500/20">
                      <div>
                        <p className="text-white font-semibold">Delete Account</p>
                        <p className="text-sm text-gray-400">Permanently delete your account</p>
                      </div>
                      <button className="px-5 py-2 rounded-lg bg-red-600 hover:bg-red-500 text-white font-semibold transition">
                        Delete
                      </button>
                    </div>
                  </div>
                </motion.div>
              )}

              {/* NOTIFICATIONS TAB */}
              {activeTab === "notifications" && (
                <motion.div
                  key="notifications"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  transition={{ duration: 0.2 }}
                  className="bg-[#141418] border border-white/10 rounded-xl p-8"
                >
                  <h3 className="text-xl font-semibold text-white mb-6">Notification Preferences</h3>
                  <div className="space-y-6">
                    {Object.entries(notifications).map(([key, value]) => (
                      <div key={key} className="flex items-center justify-between py-4 border-b border-white/5 last:border-0">
                        <div>
                          <p className="text-white font-semibold capitalize">
                            {key.replace(/([A-Z])/g, " $1").trim()}
                          </p>
                          <p className="text-sm text-gray-400">
                            Receive notifications about {key.replace(/([A-Z])/g, " $1").toLowerCase()}
                          </p>
                        </div>
                        <button
                          onClick={() => setNotifications({ ...notifications, [key]: !value })}
                          className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                            value ? "bg-indigo-600" : "bg-gray-600"
                          }`}
                        >
                          <span
                            className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                              value ? "translate-x-6" : "translate-x-1"
                            }`}
                          />
                        </button>
                      </div>
                    ))}
                  </div>
                </motion.div>
              )}

              {/* PRIVACY TAB */}
              {activeTab === "privacy" && (
                <motion.div
                  key="privacy"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  transition={{ duration: 0.2 }}
                  className="space-y-8"
                >
                  <div className="bg-[#141418] border border-white/10 rounded-xl p-8">
                    <h3 className="text-xl font-semibold text-white mb-6">Privacy Settings</h3>
                    <div className="space-y-6">
                      <div>
                        <label className="block text-sm font-medium text-gray-300 mb-4">Profile Visibility</label>
                        <div className="space-y-3">
                          {[
                            { value: "public", label: "Public", desc: "Anyone can see your profile" },
                            { value: "private", label: "Private", desc: "Only you can see" },
                            { value: "team", label: "Team Only", desc: "Only team members" },
                          ].map((option) => (
                            <button
                              key={option.value}
                              onClick={() => setPrivacy({ ...privacy, profileVisibility: option.value })}
                              className={`w-full flex items-center gap-4 p-4 rounded-lg border transition ${
                                privacy.profileVisibility === option.value
                                  ? "border-indigo-500 bg-indigo-500/10"
                                  : "border-white/10 bg-[#0c0c0f] hover:bg-white/5"
                              }`}
                            >
                              <div
                                className={`w-5 h-5 rounded-full border-2 flex items-center justify-center ${
                                  privacy.profileVisibility === option.value
                                    ? "border-indigo-500"
                                    : "border-gray-500"
                                }`}
                              >
                                {privacy.profileVisibility === option.value && (
                                  <div className="w-2.5 h-2.5 rounded-full bg-indigo-500" />
                                )}
                              </div>
                              <div className="text-left">
                                <p className="text-white font-semibold">{option.label}</p>
                                <p className="text-sm text-gray-400">{option.desc}</p>
                              </div>
                            </button>
                          ))}
                        </div>
                      </div>

                      {["showEmail", "allowIndexing"].map((key) => (
                        <div key={key} className="flex items-center justify-between py-4 border-t border-white/5">
                          <div>
                            <p className="text-white font-semibold">
                              {key === "showEmail" ? "Show Email" : "Allow Indexing"}
                            </p>
                            <p className="text-sm text-gray-400">
                              {key === "showEmail" ? "Display email on profile" : "Let search engines index"}
                            </p>
                          </div>
                          <button
                            onClick={() => setPrivacy({ ...privacy, [key]: !privacy[key as keyof typeof privacy] })}
                            className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                              privacy[key as keyof typeof privacy] ? "bg-indigo-600" : "bg-gray-600"
                            }`}
                          >
                            <span
                              className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                                privacy[key as keyof typeof privacy] ? "translate-x-6" : "translate-x-1"
                              }`}
                            />
                          </button>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className="bg-[#141418] border border-white/10 rounded-xl p-8">
                    <h3 className="text-xl font-semibold text-white mb-6">Security</h3>
                    <div className="space-y-4">
                      <div className="flex items-center justify-between p-5 rounded-lg bg-[#0c0c0f] border border-white/10">
                        <div>
                          <p className="text-white font-semibold">Two-Factor Authentication</p>
                          <p className="text-sm text-gray-400">Extra security layer</p>
                        </div>
                        <button
                          onClick={() => setPrivacy({ ...privacy, twoFactorAuth: !privacy.twoFactorAuth })}
                          className={`px-4 py-2 rounded-lg font-semibold transition ${
                            privacy.twoFactorAuth
                              ? "bg-emerald-500/10 text-emerald-400 border border-emerald-500/30"
                              : "bg-gradient-to-r from-indigo-600 to-violet-500 text-white"
                          }`}
                        >
                          {privacy.twoFactorAuth ? "✓ Enabled" : "Enable"}
                        </button>
                      </div>
                    </div>
                  </div>
                </motion.div>
              )}

              {/* APPEARANCE TAB */}
              {activeTab === "appearance" && (
                <motion.div
                  key="appearance"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  transition={{ duration: 0.2 }}
                  className="bg-[#141418] border border-white/10 rounded-xl p-8"
                >
                  <h3 className="text-xl font-semibold text-white mb-6">Appearance</h3>
                  <div className="space-y-8">
                    <div>
                      <label className="block text-sm font-medium text-gray-300 mb-4">Theme</label>
                      <div className="grid grid-cols-3 gap-4">
                        {[
                          { value: "light", label: "Light", bg: "bg-gray-100" },
                          { value: "dark", label: "Dark", bg: "bg-gray-900" },
                          { value: "auto", label: "System", bg: "bg-gradient-to-r from-gray-100 to-gray-900" },
                        ].map((theme) => (
                          <button
                            key={theme.value}
                            onClick={() => setAppearance({ ...appearance, theme: theme.value })}
                            className={`p-4 rounded-lg border transition ${
                              appearance.theme === theme.value
                                ? "border-indigo-500 bg-indigo-500/10"
                                : "border-white/10 bg-[#0c0c0f] hover:bg-white/5"
                            }`}
                          >
                            <div className={`w-full h-16 rounded-lg mb-3 ${theme.bg}`} />
                            <p className="text-white font-semibold">{theme.label}</p>
                          </button>
                        ))}
                      </div>
                    </div>

                    {["compactMode", "animations"].map((key) => (
                      <div key={key} className="flex items-center justify-between py-4 border-t border-white/5">
                        <div>
                          <p className="text-white font-semibold">
                            {key === "compactMode" ? "Compact Mode" : "Animations"}
                          </p>
                          <p className="text-sm text-gray-400">
                            {key === "compactMode" ? "Reduce spacing" : "Enable transitions"}
                          </p>
                        </div>
                        <button
                          onClick={() => setAppearance({ ...appearance, [key]: !appearance[key as keyof typeof appearance] })}
                          className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                            appearance[key as keyof typeof appearance] ? "bg-indigo-600" : "bg-gray-600"
                          }`}
                        >
                          <span
                            className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                              appearance[key as keyof typeof appearance] ? "translate-x-6" : "translate-x-1"
                            }`}
                          />
                        </button>
                      </div>
                    ))}
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>
      </main>
    </div>
  );
}
