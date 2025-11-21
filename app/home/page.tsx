"use client";

import React, { useState, useRef, useEffect } from "react";
import Link from "next/link";

export default function WhiteboardDashboard(): any {
  const [selectedTool, setSelectedTool] = useState<string>("select");
  const [isDrawing, setIsDrawing] = useState(false);
  const [color, setColor] = useState("#818cf8");
  const [users, setUsers] = useState([
    { name: "You", color: "#818cf8", x: 45, y: 45 },
    { name: "Sarah", color: "#a78bfa", x: 65, y: 30 },
    { name: "Mike", color: "#34d399", x: 25, y: 60 },
  ]);

  const canvasRef = useRef<HTMLDivElement>(null);

  const tools = [
    { id: "select", icon: "cursor", label: "Select", shortcut: "V" },
    { id: "pen", icon: "pencil", label: "Pen", shortcut: "P" },
    { id: "sticky", icon: "note", label: "Sticky Note", shortcut: "S" },
    { id: "text", icon: "text", label: "Text", shortcut: "T" },
    { id: "shape", icon: "square", label: "Shapes", shortcut: "R" },
    { id: "line", icon: "minus", label: "Line", shortcut: "L" },
    { id: "eraser", icon: "eraser", label: "Eraser", shortcut: "E" },
  ];

  const colors = [
    "#818cf8", "#a78bfa", "#34d399", "#fbbf24", "#f87171", "#60a5fa", "#fb923c"
  ];

  return (
    <div className="h-screen w-screen bg-[#0c0c0f] flex flex-col overflow-hidden">
      {/* Top Toolbar */}
      <header className="h-16 border-b border-white/10 bg-[#0f0f12]/95 backdrop-blur flex items-center justify-between px-4 z-50">
        {/* Left - Logo & Board Name */}
        <div className="flex items-center gap-4">
          <Link href="/dashboard" className="flex items-center gap-2">
            <div className="rounded-lg bg-gradient-to-r from-indigo-600 to-violet-500 p-0.5">
              <div className="bg-[#0c0c0f] rounded-md px-3 py-1 font-bold text-sm text-indigo-300">
                CollabBoard
              </div>
            </div>
          </Link>
          <div className="hidden sm:block h-6 w-px bg-white/10"></div>
          <input 
            type="text" 
            defaultValue="Marketing Brainstorm" 
            className="hidden sm:block bg-transparent border-none text-white font-semibold focus:outline-none focus:bg-white/5 px-2 py-1 rounded"
          />
        </div>

        {/* Center - Quick Actions */}
        <div className="hidden md:flex items-center gap-2">
          <button className="px-3 py-1.5 rounded-lg hover:bg-white/5 transition text-sm text-gray-300 flex items-center gap-2">
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12" />
            </svg>
            Export
          </button>
          <button className="px-3 py-1.5 rounded-lg hover:bg-white/5 transition text-sm text-gray-300 flex items-center gap-2">
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
            </svg>
            Templates
          </button>
        </div>

        {/* Right - Collaborators & Share */}
        <div className="flex items-center gap-3">
          {/* Online Users */}
          <div className="flex items-center -space-x-2">
            {users.map((user, i) => (
              <div
                key={i}
                className="w-8 h-8 rounded-full border-2 border-[#0f0f12] flex items-center justify-center text-xs font-bold text-white"
                style={{ backgroundColor: user.color }}
              >
                {user.name[0]}
              </div>
            ))}
            <button className="w-8 h-8 rounded-full border-2 border-white/20 border-dashed flex items-center justify-center text-gray-400 hover:bg-white/5 transition">
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
              </svg>
            </button>
          </div>

          <button className="px-4 py-2 rounded-lg bg-indigo-600 hover:bg-indigo-500 text-white text-sm font-semibold transition">
            Share
          </button>
        </div>
      </header>

      <div className="flex flex-1 overflow-hidden">
        {/* Left Toolbar */}
        <aside className="w-16 border-r border-white/10 bg-[#0f0f12]/95 backdrop-blur flex flex-col items-center py-4 gap-2">
          {tools.map((tool) => (
            <button
              key={tool.id}
              onClick={() => setSelectedTool(tool.id)}
              className={`w-12 h-12 rounded-lg flex items-center justify-center transition-all relative group ${
                selectedTool === tool.id
                  ? "bg-indigo-600 text-white shadow-lg shadow-indigo-500/50"
                  : "text-gray-400 hover:bg-white/5 hover:text-white"
              }`}
              title={`${tool.label} (${tool.shortcut})`}
            >
              {tool.icon === "cursor" && (
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 15l-2 5L9 9l11 4-5 2zm0 0l5 5M7.188 2.239l.777 2.897M5.136 7.965l-2.898-.777M13.95 4.05l-2.122 2.122m-5.657 5.656l-2.12 2.122" />
                </svg>
              )}
              {tool.icon === "pencil" && (
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
                </svg>
              )}
              {tool.icon === "note" && (
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 8h10M7 12h4m1 8l-4-4H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-3l-4 4z" />
                </svg>
              )}
              {tool.icon === "text" && (
                <span className="font-bold text-xl">T</span>
              )}
              {tool.icon === "square" && (
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <rect x="4" y="4" width="16" height="16" strokeWidth={2} rx="2" />
                </svg>
              )}
              {tool.icon === "minus" && (
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 12H4" />
                </svg>
              )}
              {tool.icon === "eraser" && (
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                </svg>
              )}
              <span className="absolute left-full ml-2 px-2 py-1 bg-gray-900 text-white text-xs rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap pointer-events-none">
                {tool.label} ({tool.shortcut})
              </span>
            </button>
          ))}

          <div className="my-2 w-8 h-px bg-white/10"></div>

          {/* Color Picker */}
          <div className="flex flex-col gap-1.5">
            {colors.map((c) => (
              <button
                key={c}
                onClick={() => setColor(c)}
                className={`w-7 h-7 rounded-full transition-all ${
                  color === c ? "ring-2 ring-white ring-offset-2 ring-offset-[#0f0f12] scale-110" : "hover:scale-105"
                }`}
                style={{ backgroundColor: c }}
              />
            ))}
          </div>
        </aside>

        {/* Main Canvas Area */}
        <main className="flex-1 relative overflow-hidden bg-[#0d0d0f]">
          {/* Grid Background */}
          <div 
            className="absolute inset-0"
            style={{
              backgroundImage: `
                linear-gradient(rgba(255,255,255,0.03) 1px, transparent 1px),
                linear-gradient(90deg, rgba(255,255,255,0.03) 1px, transparent 1px)
              `,
              backgroundSize: "30px 30px"
            }}
          ></div>

          {/* Canvas */}
          <div ref={canvasRef} className="absolute inset-0 overflow-auto">
            <div className="min-w-[200%] min-h-[200%] relative p-20">
              {/* Sample Sticky Notes */}
              <div 
                className="absolute w-48 h-48 bg-amber-400 rounded-lg shadow-xl cursor-move p-4 rotate-2 hover:rotate-0 transition-transform"
                style={{ left: "20%", top: "15%" }}
              >
                <textarea 
                  className="w-full h-full bg-transparent border-none resize-none focus:outline-none text-gray-900 placeholder-gray-700 font-medium"
                  placeholder="Write your idea..."
                  defaultValue="User research findings"
                ></textarea>
              </div>

              <div 
                className="absolute w-48 h-48 bg-emerald-400 rounded-lg shadow-xl cursor-move p-4 -rotate-1 hover:rotate-0 transition-transform"
                style={{ left: "45%", top: "20%" }}
              >
                <textarea 
                  className="w-full h-full bg-transparent border-none resize-none focus:outline-none text-gray-900 placeholder-gray-700 font-medium"
                  placeholder="Write your idea..."
                  defaultValue="Design mockups ready"
                ></textarea>
              </div>

              <div 
                className="absolute w-48 h-48 bg-pink-400 rounded-lg shadow-xl cursor-move p-4 rotate-1 hover:rotate-0 transition-transform"
                style={{ left: "70%", top: "18%" }}
              >
                <textarea 
                  className="w-full h-full bg-transparent border-none resize-none focus:outline-none text-gray-900 placeholder-gray-700 font-medium"
                  placeholder="Write your idea..."
                  defaultValue="Schedule team meeting"
                ></textarea>
              </div>

              {/* Sample Text */}
              <div 
                className="absolute cursor-text"
                style={{ left: "30%", top: "50%" }}
              >
                <h2 className="text-3xl font-bold text-white mb-2">Brainstorming Session</h2>
                <p className="text-gray-400 max-w-md">Add your ideas, connect thoughts, and collaborate in real-time</p>
              </div>

              {/* Sample Shape */}
              <div 
                className="absolute w-64 h-40 border-4 border-indigo-500 rounded-xl cursor-move flex items-center justify-center hover:bg-indigo-500/10 transition"
                style={{ left: "15%", top: "60%" }}
              >
                <span className="text-white font-semibold">Action Items</span>
              </div>

              {/* User Cursors */}
              {users.slice(1).map((user, i) => (
                <div
                  key={i}
                  className="absolute pointer-events-none transition-all duration-100"
                  style={{ left: `${user.x}%`, top: `${user.y}%` }}
                >
                  <svg className="w-6 h-6" viewBox="0 0 24 24" fill={user.color}>
                    <path d="M5.5 3.5L12 20l2-6 6-2L5.5 3.5z"/>
                  </svg>
                  <div 
                    className="mt-1 px-2 py-0.5 rounded text-xs font-medium text-white whitespace-nowrap"
                    style={{ backgroundColor: user.color }}
                  >
                    {user.name}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Zoom Controls */}
          <div className="absolute bottom-6 right-6 flex items-center gap-2 bg-[#141418] border border-white/10 rounded-lg p-2 shadow-xl">
            <button className="w-8 h-8 rounded hover:bg-white/5 transition flex items-center justify-center">
              <svg className="w-4 h-4 text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 12H4" />
              </svg>
            </button>
            <span className="text-sm text-gray-300 px-2">100%</span>
            <button className="w-8 h-8 rounded hover:bg-white/5 transition flex items-center justify-center">
              <svg className="w-4 h-4 text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
              </svg>
            </button>
            <div className="w-px h-6 bg-white/10 mx-1"></div>
            <button className="w-8 h-8 rounded hover:bg-white/5 transition flex items-center justify-center" title="Fit to screen">
              <svg className="w-4 h-4 text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 8V4m0 0h4M4 4l5 5m11-1V4m0 0h-4m4 0l-5 5M4 16v4m0 0h4m-4 0l5-5m11 5l-5-5m5 5v-4m0 4h-4" />
              </svg>
            </button>
          </div>

          {/* Quick Help */}
          <div className="absolute bottom-6 left-6 bg-[#141418] border border-white/10 rounded-lg px-4 py-2 text-xs text-gray-400 shadow-xl">
            Press <kbd className="px-1.5 py-0.5 bg-white/10 rounded">Space</kbd> + drag to pan • 
            <kbd className="px-1.5 py-0.5 bg-white/10 rounded ml-2">Ctrl</kbd> + scroll to zoom
          </div>
        </main>

        {/* Right Panel - Comments & Activity */}
        <aside className="w-80 border-l border-white/10 bg-[#0f0f12]/95 backdrop-blur hidden xl:flex flex-col">
          <div className="p-4 border-b border-white/10">
            <div className="flex gap-2">
              <button className="flex-1 px-3 py-2 rounded-lg bg-indigo-600 text-white text-sm font-semibold">
                Comments
              </button>
              <button className="flex-1 px-3 py-2 rounded-lg hover:bg-white/5 text-gray-400 text-sm">
                Activity
              </button>
            </div>
          </div>

          <div className="flex-1 overflow-y-auto p-4 space-y-4">
            <div className="flex gap-3">
              <div className="w-8 h-8 rounded-full bg-violet-500 flex items-center justify-center text-xs font-bold text-white flex-shrink-0">
                S
              </div>
              <div className="flex-1">
                <div className="bg-white/5 rounded-lg p-3">
                  <div className="flex items-center gap-2 mb-1">
                    <span className="text-sm font-semibold text-white">Sarah</span>
                    <span className="text-xs text-gray-500">2m ago</span>
                  </div>
                  <p className="text-sm text-gray-300">Love this direction! Can we add more details to the user flow?</p>
                </div>
              </div>
            </div>

            <div className="flex gap-3">
              <div className="w-8 h-8 rounded-full bg-emerald-500 flex items-center justify-center text-xs font-bold text-white flex-shrink-0">
                M
              </div>
              <div className="flex-1">
                <div className="bg-white/5 rounded-lg p-3">
                  <div className="flex items-center gap-2 mb-1">
                    <span className="text-sm font-semibold text-white">Mike</span>
                    <span className="text-xs text-gray-500">5m ago</span>
                  </div>
                  <p className="text-sm text-gray-300">Added the technical requirements to the board</p>
                </div>
              </div>
            </div>
          </div>

          <div className="p-4 border-t border-white/10">
            <div className="flex gap-2">
              <input 
                type="text" 
                placeholder="Add a comment..."
                className="flex-1 px-3 py-2 rounded-lg bg-white/5 border border-white/10 text-sm text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-indigo-500"
              />
              <button className="px-4 py-2 rounded-lg bg-indigo-600 hover:bg-indigo-500 text-white transition">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
                </svg>
              </button>
            </div>
          </div>
        </aside>
      </div>
    </div>
  );
}
