"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";

export default function WhiteboardsDashboard(): any {
  const router = useRouter();
  const [view, setView] = useState<"grid" | "list">("grid");
  const [searchQuery, setSearchQuery] = useState("");

  const whiteboards = [
    { 
      id: 1, 
      title: "Marketing Campaign 2025", 
      thumbnail: "indigo",
      lastEdited: "2 hours ago", 
      members: 4,
      isStarred: true,
      folder: "Work"
    },
    { 
      id: 2, 
      title: "Product Roadmap Q1", 
      thumbnail: "violet",
      lastEdited: "5 hours ago", 
      members: 6,
      isStarred: false,
      folder: "Work"
    },
    { 
      id: 3, 
      title: "Design System Workshop", 
      thumbnail: "emerald",
      lastEdited: "Yesterday", 
      members: 3,
      isStarred: true,
      folder: "Design"
    },
    { 
      id: 4, 
      title: "Sprint Planning Week 12", 
      thumbnail: "amber",
      lastEdited: "2 days ago", 
      members: 5,
      isStarred: false,
      folder: "Work"
    },
    { 
      id: 5, 
      title: "User Research Findings", 
      thumbnail: "pink",
      lastEdited: "3 days ago", 
      members: 2,
      isStarred: false,
      folder: "Research"
    },
    { 
      id: 6, 
      title: "Team Retrospective", 
      thumbnail: "blue",
      lastEdited: "1 week ago", 
      members: 8,
      isStarred: false,
      folder: "Work"
    },
  ];

  const recentActivity = [
    { user: "Sarah Chen", action: "edited", board: "Marketing Campaign 2025", time: "5 min ago" },
    { user: "Mike Johnson", action: "commented on", board: "Product Roadmap Q1", time: "1 hour ago" },
    { user: "Emma Wilson", action: "created", board: "Design System Workshop", time: "3 hours ago" },
    { user: "You", action: "shared", board: "Sprint Planning Week 12", time: "Yesterday" },
  ];

  const folders = [
    { name: "Work", count: 12, color: "indigo" },
    { name: "Design", count: 5, color: "violet" },
    { name: "Research", count: 3, color: "emerald" },
  ];

  const teamMembers = [
    { name: "Sarah Chen", avatar: "SC", status: "online", color: "indigo" },
    { name: "Mike Johnson", avatar: "MJ", status: "online", color: "violet" },
    { name: "Emma Wilson", avatar: "EW", status: "away", color: "emerald" },
    { name: "Alex Park", avatar: "AP", status: "offline", color: "amber" },
  ];

  return (
    <div className="min-h-screen bg-[#0c0c0f] text-gray-200">
      {/* Top Navigation */}
      <header className="sticky top-0 z-40 border-b border-white/10 bg-[#0f0f12]/95 backdrop-blur-xl">
        <div className="mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex h-16 items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="rounded-lg bg-gradient-to-r from-indigo-600 to-violet-500 p-0.5">
                <div className="bg-[#0c0c0f] rounded-md px-3 py-1 font-bold text-sm text-indigo-300">
                  CollabBoard
                </div>
              </div>
              <nav className="hidden md:flex items-center gap-1">
                <Link href="/dashboard" className="px-3 py-2 rounded-lg bg-indigo-600 text-white text-sm font-medium">
                  My Boards
                </Link>
                <Link href="/shared" className="px-3 py-2 rounded-lg hover:bg-white/5 text-gray-400 text-sm">
                  Shared
                </Link>
                <Link href="/team" className="px-3 py-2 rounded-lg hover:bg-white/5 text-gray-400 text-sm">
                  Team
                </Link>
              </nav>
            </div>

            <div className="flex items-center gap-3">
              <button className="p-2 rounded-lg hover:bg-white/5 transition relative">
                <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
                </svg>
                <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-indigo-500 rounded-full animate-pulse"></span>
              </button>

              <Link href="/settings" className="p-2 rounded-lg hover:bg-white/5 transition">
                <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                </svg>
              </Link>

              <div className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-white/5 border border-white/10">
                <div className="w-7 h-7 rounded-full bg-gradient-to-br from-indigo-500 to-violet-500 flex items-center justify-center text-xs font-bold">
                  JD
                </div>
                <span className="hidden sm:inline text-sm font-medium">John Doe</span>
              </div>
            </div>
          </div>
        </div>
      </header>

      <main className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          {/* Left Sidebar */}
          <aside className="lg:col-span-1 space-y-6">
            {/* Quick Stats */}
            <div className="bg-[#141418] border border-white/10 rounded-xl p-5">
              <h3 className="text-sm font-semibold text-white mb-4">Overview</h3>
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-400">Total Boards</span>
                  <span className="text-lg font-bold text-white">24</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-400">Shared</span>
                  <span className="text-lg font-bold text-indigo-400">12</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-400">Starred</span>
                  <span className="text-lg font-bold text-yellow-400">8</span>
                </div>
              </div>
            </div>

            {/* Folders */}
            <div className="bg-[#141418] border border-white/10 rounded-xl p-5">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-sm font-semibold text-white">Folders</h3>
                <button className="text-indigo-400 hover:text-indigo-300 transition">
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                  </svg>
                </button>
              </div>
              <div className="space-y-2">
                {folders.map((folder) => (
                  <button
                    key={folder.name}
                    className="w-full flex items-center justify-between p-2 rounded-lg hover:bg-white/5 transition text-left"
                  >
                    <div className="flex items-center gap-2">
                      <svg className={`w-5 h-5 text-${folder.color}-400`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 7v10a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-6l-2-2H5a2 2 0 00-2 2z" />
                      </svg>
                      <span className="text-sm text-gray-300">{folder.name}</span>
                    </div>
                    <span className="text-xs text-gray-500">{folder.count}</span>
                  </button>
                ))}
              </div>
            </div>

            {/* Storage */}
            <div className="bg-gradient-to-br from-indigo-500/10 to-violet-500/10 border border-indigo-500/20 rounded-xl p-5">
              <h3 className="text-sm font-semibold text-white mb-3">Storage</h3>
              <div className="space-y-2">
                <div className="flex items-center justify-between text-xs text-gray-400">
                  <span>2.4 GB used</span>
                  <span>5 GB</span>
                </div>
                <div className="w-full h-2 bg-white/10 rounded-full overflow-hidden">
                  <div className="h-full w-[48%] bg-gradient-to-r from-indigo-500 to-violet-500 rounded-full"></div>
                </div>
                <button className="w-full mt-3 py-2 rounded-lg bg-white/10 hover:bg-white/20 transition text-xs font-medium">
                  Upgrade Storage
                </button>
              </div>
            </div>

            {/* Team Members */}
            <div className="bg-[#141418] border border-white/10 rounded-xl p-5">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-sm font-semibold text-white">Team</h3>
                <button className="text-indigo-400 hover:text-indigo-300 transition text-xs">
                  Invite
                </button>
              </div>
              <div className="space-y-2">
                {teamMembers.map((member) => (
                  <div key={member.name} className="flex items-center gap-2">
                    <div className="relative">
                      <div className={`w-8 h-8 rounded-full bg-gradient-to-br from-${member.color}-500 to-${member.color}-600 flex items-center justify-center text-xs font-bold`}>
                        {member.avatar}
                      </div>
                      <span className={`absolute bottom-0 right-0 w-2.5 h-2.5 rounded-full border-2 border-[#141418] ${
                        member.status === "online" ? "bg-emerald-500" :
                        member.status === "away" ? "bg-amber-500" : "bg-gray-500"
                      }`}></span>
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm text-white truncate">{member.name}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </aside>

          {/* Main Content */}
          <div className="lg:col-span-3 space-y-6">
            {/* Search & Actions */}
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
              <div className="relative w-full sm:w-96">
                <input
                  type="search"
                  placeholder="Search boards..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full px-4 py-2.5 pl-10 rounded-lg bg-[#141418] border border-white/10 text-sm text-gray-200 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                />
                <svg className="absolute left-3 top-3 w-4 h-4 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
              </div>

              <div className="flex items-center gap-3 w-full sm:w-auto">
                <div className="hidden sm:flex items-center gap-1 bg-[#141418] border border-white/10 rounded-lg p-1">
                  <button
                    onClick={() => setView("grid")}
                    className={`p-2 rounded transition ${view === "grid" ? "bg-indigo-600 text-white" : "text-gray-400 hover:text-white"}`}
                  >
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z" />
                    </svg>
                  </button>
                  <button
                    onClick={() => setView("list")}
                    className={`p-2 rounded transition ${view === "list" ? "bg-indigo-600 text-white" : "text-gray-400 hover:text-white"}`}
                  >
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                    </svg>
                  </button>
                </div>

                <Link
                  href="/dashboard/new"
                  className="flex-1 sm:flex-none px-5 py-2.5 rounded-lg bg-gradient-to-r from-indigo-600 to-violet-500 hover:from-indigo-500 hover:to-violet-400 text-white font-semibold shadow-lg shadow-indigo-500/20 transition-all flex items-center justify-center gap-2"
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                  </svg>
                  New Board
                </Link>
              </div>
            </div>

            {/* Recent Activity */}
            <div className="bg-[#141418] border border-white/10 rounded-xl p-5">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-lg font-bold text-white">Recent Activity</h2>
                <span className="flex items-center gap-1 text-xs text-emerald-400">
                  <span className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse"></span>
                  Live
                </span>
              </div>
              <div className="space-y-3">
                {recentActivity.map((activity, index) => (
                  <div key={index} className="flex items-center gap-3 text-sm">
                    <div className="w-2 h-2 bg-indigo-500 rounded-full"></div>
                    <p className="text-gray-300">
                      <span className="font-semibold text-white">{activity.user}</span>{" "}
                      <span className="text-gray-400">{activity.action}</span>{" "}
                      <span className="font-medium text-indigo-400">{activity.board}</span>
                    </p>
                    <span className="ml-auto text-xs text-gray-500">{activity.time}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Boards Grid */}
            <div>
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-lg font-semibold text-white">My Boards</h2>
                <div className="flex items-center gap-2 text-sm">
                  <button className="text-indigo-400 hover:text-indigo-300 transition">All</button>
                  <span className="text-gray-600">•</span>
                  <button className="text-gray-400 hover:text-white transition">Starred</button>
                  <span className="text-gray-600">•</span>
                  <button className="text-gray-400 hover:text-white transition">Shared</button>
                </div>
              </div>

              {view === "grid" && (
                <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4">
                  {whiteboards.map((board) => (
                    <div
                      key={board.id}
                      className="group relative rounded-xl border border-white/10 bg-[#141418] hover:border-indigo-500/50 transition-all overflow-hidden cursor-pointer"
                      onClick={() => router.push(`/whiteboard/${board.id}`)}
                    >
                      <div className={`h-40 bg-gradient-to-br from-${board.thumbnail}-500/20 to-${board.thumbnail}-600/10 flex items-center justify-center relative`}>
                        <div className="absolute inset-0" style={{
                          backgroundImage: `linear-gradient(rgba(255,255,255,0.03) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.03) 1px, transparent 1px)`,
                          backgroundSize: "20px 20px"
                        }}></div>
                        <svg className="w-12 h-12 text-white/20" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M7 21a4 4 0 01-4-4V5a2 2 0 012-2h4a2 2 0 012 2v12a4 4 0 01-4 4zm0 0h12a2 2 0 002-2v-4a2 2 0 00-2-2h-2.343M11 7.343l1.657-1.657a2 2 0 012.828 0l2.829 2.829a2 2 0 010 2.828l-8.486 8.485M7 17h.01" />
                        </svg>
                        
                        <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                          <button className="px-4 py-2 bg-white text-gray-900 rounded-lg font-semibold hover:bg-gray-100 transition">
                            Open
                          </button>
                        </div>
                      </div>

                      <div className="p-4">
                        <div className="flex items-start justify-between mb-2">
                          <h3 className="font-semibold text-white truncate flex-1">{board.title}</h3>
                          <button
                            onClick={(e) => e.stopPropagation()}
                            className="ml-2 text-gray-400 hover:text-yellow-400 transition"
                          >
                            <svg className={`w-5 h-5 ${board.isStarred ? "fill-yellow-400 text-yellow-400" : ""}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z" />
                            </svg>
                          </button>
                        </div>
                        <div className="flex items-center justify-between text-xs">
                          <span className="text-gray-400">{board.lastEdited}</span>
                          <div className="flex items-center gap-1 text-gray-400">
                            <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
                            </svg>
                            <span>{board.members}</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}

              {view === "list" && (
                <div className="space-y-2">
                  {whiteboards.map((board) => (
                    <div
                      key={board.id}
                      className="flex items-center gap-4 p-4 rounded-lg border border-white/10 bg-[#141418] hover:bg-white/5 hover:border-indigo-500/50 transition-all cursor-pointer group"
                      onClick={() => router.push(`/whiteboard/${board.id}`)}
                    >
                      <div className={`w-12 h-12 rounded-lg bg-gradient-to-br from-${board.thumbnail}-500/20 to-${board.thumbnail}-600/10 flex items-center justify-center flex-shrink-0`}>
                        <svg className="w-6 h-6 text-white/30" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M7 21a4 4 0 01-4-4V5a2 2 0 012-2h4a2 2 0 012 2v12a4 4 0 01-4 4zm0 0h12a2 2 0 002-2v-4a2 2 0 00-2-2h-2.343M11 7.343l1.657-1.657a2 2 0 012.828 0l2.829 2.829a2 2 0 010 2.828l-8.486 8.485M7 17h.01" />
                        </svg>
                      </div>
                      <div className="flex-1 min-w-0">
                        <h3 className="font-semibold text-white mb-1">{board.title}</h3>
                        <p className="text-sm text-gray-400">{board.lastEdited} • {board.members} members • {board.folder}</p>
                      </div>
                      <button onClick={(e) => e.stopPropagation()} className="text-gray-400 hover:text-yellow-400 transition">
                        <svg className={`w-5 h-5 ${board.isStarred ? "fill-yellow-400 text-yellow-400" : ""}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z" />
                        </svg>
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
