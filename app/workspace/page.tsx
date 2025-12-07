"use client";

import React, { useState, useEffect, useCallback } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { useSession, signOut } from "next-auth/react";

interface Dashboard {
  id: string;
  title: string;
  description?: string;
  slug: string;
  thumbnail?: string;
  isPublic: boolean;
  template: string;
  isArchived: boolean;
  viewCount: number;
  folderId?: string | null;
  ownerId: string;
  createdAt: string;
  updatedAt: string;
  lastAccessedAt: string;
}

interface Folder {
  id: string;
  name: string;
  color: string;
  icon?: string | null;
  userId: string;
  dashboards?: Dashboard[];
  createdAt: string;
  updatedAt: string;
}

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000";

export default function WhiteboardsDashboard() {
  const router = useRouter();
  const { data: session, status } = useSession();

  const [view, setView] = useState<"grid" | "list">("grid");
  const [searchQuery, setSearchQuery] = useState("");
  const [dashboards, setDashboards] = useState<Dashboard[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [folders, setFolders] = useState<Folder[]>([]);
  const [selectedFolder, setSelectedFolder] = useState<Folder | null>(null);
  const [showCreateFolderModal, setShowCreateFolderModal] = useState(false);
  const [newFolderName, setNewFolderName] = useState("");
  const [newFolderColor, setNewFolderColor] = useState("indigo");

  const [draggedDashboard, setDraggedDashboard] = useState<Dashboard | null>(null);
  const [dropTargetFolder, setDropTargetFolder] = useState<string | null>(null);

  // ✅ UNIFIED TOKEN GETTER
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

  // ✅ UNIFIED AUTH HEADERS
  const getAuthHeaders = useCallback(() => {
    const token = getToken();
    const headers: Record<string, string> = {
      "Content-Type": "application/json",
    };
    if (token) {
      headers["Authorization"] = `Bearer ${token}`;
    }
    return headers;
  }, [getToken]);

  // ✅ FETCH DASHBOARDS WITH useCallback
  const fetchDashboards = useCallback(async () => {
    try {
      if (dashboards.length === 0) setLoading(true);
      setError(null);

      const response = await fetch(`${API_URL}/api/dashboards`, {
        headers: getAuthHeaders(),
      });

      if (!response.ok) {
        if (response.status === 401 || response.status === 403) {
          setError("Your session for boards expired. Please sign in again.");
          setDashboards([]);
          setLoading(false);
          return;
        }
        throw new Error("Failed to load dashboards");
      }

      const data = await response.json();
      const dashboardsArray = Array.isArray(data) ? data : data.dashboards || [];

      if (Array.isArray(dashboardsArray)) {
        setDashboards(dashboardsArray);
      } else {
        console.error("Dashboards API did not return an array:", data);
        setDashboards([]);
        setError("Invalid dashboard data received");
      }
    } catch (err: any) {
      console.error("Fetch dashboards error:", err);
      setError(err.message || "Failed to load dashboards");
      setDashboards([]);
    } finally {
      setLoading(false);
    }
  }, [getAuthHeaders]);

  // ✅ FETCH FOLDERS WITH useCallback
  const fetchFolders = useCallback(async () => {
    try {
      const response = await fetch(`${API_URL}/api/folders`, {
        headers: getAuthHeaders(),
      });

      if (!response.ok) {
        if (response.status === 401 || response.status === 403) {
          console.warn("Folder fetch unauthorized.");
          setFolders([]);
          return;
        }
        throw new Error("Failed to fetch folders");
      }

      const data = await response.json();

      if (Array.isArray(data)) {
        setFolders(data);
      } else {
        console.error("Folders API did not return an array:", data);
        setFolders([]);
      }
    } catch (err) {
      console.error("Fetch folders error:", err);
      setFolders([]);
    }
  }, [getAuthHeaders]);

  // ✅ AUTH CHECK & DATA FETCH
  useEffect(() => {
    if (status === "loading") return;

    const hasLocalToken = typeof window !== "undefined" && localStorage.getItem("auth_token");

    // Redirect if absolutely no auth
    if (status === "unauthenticated" && !hasLocalToken) {
      router.replace("/login");
      return;
    }

    // Fetch if we have some form of auth
    if (status === "authenticated" || hasLocalToken) {
      fetchDashboards();
      fetchFolders();
    }
  }, [status, router, fetchDashboards, fetchFolders]);

  const handleCreateFolder = async () => {
    if (!newFolderName.trim()) return;

    try {
      const response = await fetch(`${API_URL}/api/folders`, {
        method: "POST",
        headers: getAuthHeaders(),
        body: JSON.stringify({
          name: newFolderName.trim(),
          color: newFolderColor,
        }),
      });

      if (!response.ok) throw new Error("Failed to create folder");

      const newFolder = await response.json();
      setFolders([...folders, { ...newFolder, dashboards: [] }]);
      setNewFolderName("");
      setNewFolderColor("indigo");
      setShowCreateFolderModal(false);
    } catch (err) {
      console.error("Create folder error:", err);
      alert("Failed to create folder");
    }
  };

  const handleDeleteFolder = async (folderId: string) => {
    if (!confirm("Delete this folder? Dashboards will not be deleted.")) return;

    try {
      const response = await fetch(`${API_URL}/api/folders/${folderId}`, {
        method: "DELETE",
        headers: getAuthHeaders(),
      });

      if (!response.ok) throw new Error("Failed to delete folder");

      setFolders(folders.filter((f) => f.id !== folderId));
      if (selectedFolder?.id === folderId) {
        setSelectedFolder(null);
      }
      await fetchDashboards();
    } catch (err) {
      console.error("Delete folder error:", err);
      alert("Failed to delete folder");
    }
  };

  const handleMoveDashboardToFolder = async (
    dashboardId: string,
    folderId: string | null
  ) => {
    try {
      // Optimistic UI update
      setDashboards(prev => prev.map(d => d.id === dashboardId ? { ...d, folderId } : d));

      const response = await fetch(`${API_URL}/api/folders/move-dashboard`, {
        method: "POST",
        headers: getAuthHeaders(),
        body: JSON.stringify({ dashboardId, folderId }),
      });

      if (!response.ok) {
        // Revert on failure
        await fetchDashboards();
        throw new Error("Failed to move dashboard");
      }

      await fetchFolders();
    } catch (err) {
      console.error("Move dashboard error:", err);
      alert("Failed to move dashboard");
    }
  };

  const handleDragStart = (dashboard: Dashboard) => {
    setDraggedDashboard(dashboard);
  };

  const handleDragEnd = () => {
    setDraggedDashboard(null);
    setDropTargetFolder(null);
  };

  const handleDropOnFolder = async (folderId: string) => {
    if (!draggedDashboard) return;
    if (draggedDashboard.folderId === folderId) {
      handleDragEnd();
      return;
    }
    await handleMoveDashboardToFolder(draggedDashboard.id, folderId);
    handleDragEnd();
  };

  const handleCreateDashboard = () => {
    const token = getToken();
    if (!token && status !== 'authenticated') {
      alert("Your board session expired. Please sign in again.");
      return;
    }
    router.push("/workspace/new");
  };

  const handleLogout = async () => {
    localStorage.removeItem("auth_token");
    localStorage.removeItem("user");
    await signOut({ callbackUrl: "/login" });
  };

  const getFolderDashboards = (folderId: string) => {
    if (!Array.isArray(dashboards)) return [];
    return dashboards.filter((d) => d.folderId === folderId);
  };

  const getRootDashboards = () => {
    if (!Array.isArray(dashboards)) return [];
    return dashboards.filter((d) => !d.folderId);
  };

  const filteredDashboards =
    selectedFolder !== null
      ? getFolderDashboards(selectedFolder.id).filter((board) =>
          board.title.toLowerCase().includes(searchQuery.toLowerCase())
        )
      : getRootDashboards().filter((board) =>
          board.title.toLowerCase().includes(searchQuery.toLowerCase())
        );

  // ✅ USER FROM SESSION OR LOCALSTORAGE
  const user = session?.user || (typeof window !== "undefined" ? JSON.parse(localStorage.getItem("user") || "{}") : {});

  if (status === "loading") {
    return (
      <div className="min-h-screen bg-[#0c0c0f] flex items-center justify-center">
        <motion.div
          className="text-center"
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.3 }}
        >
          <motion.div
            className="w-16 h-16 border-4 border-indigo-500/30 border-t-indigo-500 rounded-full mx-auto mb-4"
            animate={{ rotate: 360 }}
            transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
          />
          <p className="text-gray-400">Loading...</p>
        </motion.div>
      </div>
    );
  }

  const recentActivity = [
    {
      user: "Sarah Chen",
      action: "edited",
      board: "Marketing Campaign 2025",
      time: "5 min ago",
    },
    {
      user: "Mike Johnson",
      action: "commented on",
      board: "Product Roadmap Q1",
      time: "1 hour ago",
    },
    {
      user: "Emma Wilson",
      action: "created",
      board: "Design System Workshop",
      time: "3 hours ago",
    },
    {
      user: "You",
      action: "shared",
      board: "Sprint Planning Week 12",
      time: "Yesterday",
    },
  ];

  const teamMembers = [
    { name: "Sarah Chen", avatar: "SC", status: "online", color: "indigo" },
    { name: "Mike Johnson", avatar: "MJ", status: "online", color: "violet" },
    { name: "Emma Wilson", avatar: "EW", status: "away", color: "emerald" },
    { name: "Alex Park", avatar: "AP", status: "offline", color: "amber" },
  ];

  const colorOptions = ["indigo", "violet", "emerald", "amber", "rose", "cyan", "pink"];

  return (
    <div className="min-h-screen bg-[#0c0c0f] text-gray-200">
      {/* Top Navigation */}
      <motion.header
        className="sticky top-0 z-40 border-b border-white/10 bg-[#0f0f12]/95 backdrop-blur-xl"
        initial={{ y: -100 }}
        animate={{ y: 0 }}
        transition={{ type: "spring", stiffness: 100, damping: 20 }}
      >
        <div className="mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex h-16 items-center justify-between">
            <motion.div className="flex items-center gap-4" whileHover={{ scale: 1.02 }}>
              <div className="rounded-lg bg-gradient-to-r from-indigo-600 to-violet-500 p-0.5">
                <div className="bg-[#0c0c0f] rounded-md px-3 py-1 font-bold text-sm text-indigo-300">
                  CollabBoard
                </div>
              </div>
            </motion.div>
            <div className="flex items-center gap-3">
              <motion.button
                className="p-2 rounded-lg hover:bg-white/5 transition relative"
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.95 }}
              >
                <svg
                  className="w-5 h-5 text-gray-400"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9"
                  />
                </svg>
                <motion.span
                  className="absolute top-1.5 right-1.5 w-2 h-2 bg-indigo-500 rounded-full"
                  animate={{ scale: [1, 1.2, 1] }}
                  transition={{ duration: 2, repeat: Infinity }}
                />
              </motion.button>
              <Link href="/settings">
                <motion.div
                  className="p-2 rounded-lg hover:bg-white/5 transition"
                  whileHover={{ scale: 1.1, rotate: 90 }}
                  whileTap={{ scale: 0.95 }}
                  transition={{ type: "spring", stiffness: 400, damping: 10 }}
                >
                  <svg
                    className="w-5 h-5 text-gray-400"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z"
                    />
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                    />
                  </svg>
                </motion.div>
              </Link>
              <div className="relative group">
                <motion.div
                  className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-white/5 border border-white/10 cursor-pointer hover:bg-white/10 transition"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.98 }}
                >
                  <div className="w-7 h-7 rounded-full bg-gradient-to-br from-indigo-500 to-violet-500 flex items-center justify-center text-xs font-bold">
                    {user?.name?.charAt(0).toUpperCase() || "U"}
                  </div>
                  <span className="hidden sm:inline text-sm font-medium">
                    {user?.name || "User"}
                  </span>
                </motion.div>
                <motion.div
                  className="absolute right-0 mt-2 w-48 bg-[#1a1a1f] border border-white/10 rounded-lg shadow-xl opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all"
                  initial={{ opacity: 0, y: -10 }}
                  whileInView={{ opacity: 1, y: 0 }}
                >
                  <div className="p-2">
                    <Link
                      href="/profile"
                      className="block px-3 py-2 text-sm text-gray-300 hover:bg-white/5 rounded transition"
                    >
                      Profile
                    </Link>
                    <Link
                      href="/settings"
                      className="block px-3 py-2 text-sm text-gray-300 hover:bg-white/5 rounded transition"
                    >
                      Settings
                    </Link>
                    <hr className="my-2 border-white/10" />
                    <button
                      onClick={handleLogout}
                      className="w-full text-left px-3 py-2 text-sm text-red-400 hover:bg-white/5 rounded transition"
                    >
                      Logout
                    </button>
                  </div>
                </motion.div>
              </div>
            </div>
          </div>
        </div>
      </motion.header>

      <main className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          {/* Left Sidebar */}
          <motion.aside
            className="lg:col-span-1 space-y-6"
            initial={{ opacity: 0, x: -50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
          >
            {/* Quick Stats */}
            <motion.div
              className="bg-[#141418] border border-white/10 rounded-xl p-5"
              whileHover={{ scale: 1.02 }}
              transition={{ type: "spring", stiffness: 300 }}
            >
              <h3 className="text-sm font-semibold text-white mb-4">Overview</h3>
              <div className="space-y-3">
                <motion.div
                  className="flex items-center justify-between"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.2 }}
                >
                  <span className="text-sm text-gray-400">Total Boards</span>
                  <motion.span
                    className="text-lg font-bold text-white"
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ type: "spring", stiffness: 500, delay: 0.3 }}
                  >
                    {Array.isArray(dashboards) ? dashboards.length : 0}
                  </motion.span>
                </motion.div>
                <motion.div
                  className="flex items-center justify-between"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.3 }}
                >
                  <span className="text-sm text-gray-400">Folders</span>
                  <motion.span
                    className="text-lg font-bold text-indigo-400"
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ type: "spring", stiffness: 500, delay: 0.4 }}
                  >
                    {folders.length}
                  </motion.span>
                </motion.div>
                <motion.div
                  className="flex items-center justify-between"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.4 }}
                >
                  <span className="text-sm text-gray-400">Public</span>
                  <motion.span
                    className="text-lg font-bold text-emerald-400"
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ type: "spring", stiffness: 500, delay: 0.5 }}
                  >
                    {Array.isArray(dashboards)
                      ? dashboards.filter((d) => d.isPublic).length
                      : 0}
                  </motion.span>
                </motion.div>
              </div>
            </motion.div>

            {/* Folders Section with Drag & Drop */}
            <motion.div
              className="bg-[#141418] border border-white/10 rounded-xl p-5"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
            >
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-sm font-semibold text-white">Folders</h3>
                <motion.button
                  onClick={() => setShowCreateFolderModal(true)}
                  className="text-indigo-400 hover:text-indigo-300 transition"
                  whileHover={{ scale: 1.2, rotate: 90 }}
                  whileTap={{ scale: 0.9 }}
                  title="Create new folder"
                >
                  <svg
                    className="w-4 h-4"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M12 4v16m8-8H4"
                    />
                  </svg>
                </motion.button>
              </div>

              {/* All Boards Option */}
              <motion.button
                onClick={() => setSelectedFolder(null)}
                className={`w-full flex items-center justify-between p-2 rounded-lg transition text-left mb-2 ${
                  !selectedFolder
                    ? "bg-indigo-500/20 border border-indigo-500/50"
                    : "hover:bg-white/5"
                }`}
                whileHover={{ x: 5 }}
                whileTap={{ scale: 0.98 }}
              >
                <div className="flex items-center gap-2">
                  <svg
                    className="w-5 h-5 text-gray-400"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10"
                    />
                  </svg>
                  <span className="text-sm text-gray-300 font-medium">
                    All Boards
                  </span>
                </div>
                <span className="text-xs text-gray-500">
                  {getRootDashboards().length}
                </span>
              </motion.button>

              {/* Draggable Folder List */}
              <AnimatePresence mode="popLayout">
                <div className="space-y-2">
                  {folders.map((folder, index) => (
                    <motion.div
                      key={folder.id}
                      className="relative group"
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: -20 }}
                      transition={{ delay: index * 0.05 }}
                      onDragOver={(e) => {
                        e.preventDefault();
                        setDropTargetFolder(folder.id);
                      }}
                      onDragLeave={() => setDropTargetFolder(null)}
                      onDrop={() => handleDropOnFolder(folder.id)}
                    >
                      <motion.button
                        onClick={() => setSelectedFolder(folder)}
                        className={`w-full flex items-center justify-between p-3 rounded-lg transition text-left ${
                          dropTargetFolder === folder.id
                            ? "ring-2 ring-indigo-500 bg-indigo-500/20 scale-105"
                            : selectedFolder?.id === folder.id
                            ? "bg-indigo-500/20 border border-indigo-500/50"
                            : "hover:bg-white/5"
                        }`}
                        whileHover={{ x: 5, scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                        transition={{ type: "spring", stiffness: 400, damping: 25 }}
                      >
                        <div className="flex items-center gap-2">
                          <motion.svg
                            className={`w-5 h-5 text-${folder.color}-400`}
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                            animate={
                              dropTargetFolder === folder.id
                                ? { scale: [1, 1.2, 1] }
                                : {}
                            }
                            transition={{ duration: 0.3 }}
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M3 7v10a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-6l-2-2H5a2 2 0 00-2 2z"
                            />
                          </motion.svg>
                          <span className="text-sm text-gray-300 font-medium">
                            {folder.name}
                          </span>
                        </div>
                        <span className="text-xs text-gray-500">
                          {getFolderDashboards(folder.id).length}
                        </span>
                      </motion.button>
                      <motion.button
                        onClick={(e) => {
                          e.stopPropagation();
                          handleDeleteFolder(folder.id);
                        }}
                        className="absolute right-1 top-1/2 -translate-y-1/2 opacity-0 group-hover:opacity-100 p-1 rounded bg-red-500/20 hover:bg-red-500/30 transition"
                        whileHover={{ scale: 1.2 }}
                        whileTap={{ scale: 0.9 }}
                        title="Delete folder"
                      >
                        <svg
                          className="w-3 h-3 text-red-400"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M6 18L18 6M6 6l12 12"
                          />
                        </svg>
                      </motion.button>
                    </motion.div>
                  ))}
                </div>
              </AnimatePresence>
            </motion.div>

            {/* Team Members */}
            <motion.div
              className="bg-[#141418] border border-white/10 rounded-xl p-5"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
            >
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-sm font-semibold text-white">Team</h3>
                <button className="text-indigo-400 hover:text-indigo-300 transition text-xs">
                  Invite
                </button>
              </div>
              <div className="space-y-2">
                {teamMembers.map((member, index) => (
                  <motion.div
                    key={member.name}
                    className="flex items-center gap-2"
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.4 + index * 0.1 }}
                    whileHover={{ x: 5 }}
                  >
                    <div className="relative">
                      <div
                        className={`w-8 h-8 rounded-full bg-gradient-to-br from-${member.color}-500 to-${member.color}-600 flex items-center justify-center text-xs font-bold`}
                      >
                        {member.avatar}
                      </div>
                      <motion.span
                        className={`absolute bottom-0 right-0 w-2.5 h-2.5 rounded-full border-2 border-[#141418] ${
                          member.status === "online"
                            ? "bg-emerald-500"
                            : member.status === "away"
                            ? "bg-amber-500"
                            : "bg-gray-500"
                        }`}
                        animate={
                          member.status === "online"
                            ? { scale: [1, 1.2, 1] }
                            : {}
                        }
                        transition={{ duration: 2, repeat: Infinity }}
                      />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm text-white truncate">
                        {member.name}
                      </p>
                    </div>
                  </motion.div>
                ))}
              </div>
            </motion.div>
          </motion.aside>

          {/* Main Content */}
          <motion.div
            className="lg:col-span-3 space-y-6"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
          >
            {/* Search & Actions */}
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
              <motion.div
                className="relative w-full sm:w-96"
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.3 }}
              >
                <input
                  type="search"
                  placeholder="Search boards..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full px-4 py-2.5 pl-10 rounded-lg bg-[#141418] border border-white/10 text-sm text-gray-200 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-indigo-500 transition"
                />
                <svg
                  className="absolute left-3 top-3 w-4 h-4 text-gray-500"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                  />
                </svg>
              </motion.div>
              <motion.div
                className="flex items-center gap-3 w-full sm:w-auto"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.4 }}
              >
                <div className="hidden sm:flex items-center gap-1 bg-[#141418] border border-white/10 rounded-lg p-1">
                  <motion.button
                    onClick={() => setView("grid")}
                    className={`p-2 rounded transition ${
                      view === "grid"
                        ? "bg-indigo-600 text-white"
                        : "text-gray-400 hover:text-white"
                    }`}
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    <svg
                      className="w-4 h-4"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z"
                      />
                    </svg>
                  </motion.button>
                  <motion.button
                    onClick={() => setView("list")}
                    className={`p-2 rounded transition ${
                      view === "list"
                        ? "bg-indigo-600 text-white"
                        : "text-gray-400 hover:text-white"
                    }`}
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    <svg
                      className="w-4 h-4"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M4 6h16M4 12h16M4 18h16"
                      />
                    </svg>
                  </motion.button>
                </div>
                <motion.button
                  onClick={handleCreateDashboard}
                  className="flex-1 sm:flex-none px-5 py-2.5 rounded-lg bg-gradient-to-r from-indigo-600 to-violet-500 hover:from-indigo-500 hover:to-violet-400 text-white font-semibold shadow-lg shadow-indigo-500/20 transition-all flex items-center justify-center gap-2"
                  whileHover={{
                    scale: 1.05,
                    boxShadow:
                      "0 20px 25px -5px rgba(99, 102, 241, 0.3)",
                  }}
                  whileTap={{ scale: 0.95 }}
                >
                  <svg
                    className="w-5 h-5"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M12 4v16m8-8H4"
                    />
                  </svg>
                  New Board
                </motion.button>
              </motion.div>
            </div>

            {/* Selected Folder Badge */}
            <AnimatePresence>
              {selectedFolder && (
                <motion.div
                  className="flex items-center gap-2"
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                >
                  <span className="text-sm text-gray-400">Showing:</span>
                  <motion.span
                    className="px-3 py-1 bg-indigo-500/20 text-indigo-300 rounded-full text-sm flex items-center gap-2"
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    exit={{ scale: 0 }}
                    transition={{ type: "spring", stiffness: 500, damping: 25 }}
                  >
                    <svg
                      className={`w-4 h-4 text-${selectedFolder.color}-400`}
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M3 7v10a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-6l-2-2H5a2 2 0 00-2 2z"
                      />
                    </svg>
                    {selectedFolder.name}
                    <motion.button
                      onClick={() => setSelectedFolder(null)}
                      className="hover:text-white"
                      whileHover={{ rotate: 90, scale: 1.2 }}
                      whileTap={{ scale: 0.9 }}
                    >
                      <svg
                        className="w-3 h-3"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M6 18L18 6M6 6l12 12"
                        />
                      </svg>
                    </motion.button>
                  </motion.span>
                </motion.div>
              )}
            </AnimatePresence>

            {/* Recent Activity */}
            <motion.div
              className="bg-[#141418] border border-white/10 rounded-xl p-5"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5 }}
            >
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-lg font-bold text-white">Recent Activity</h2>
                <span className="flex items-center gap-1 text-xs text-emerald-400">
                  <motion.span
                    className="w-2 h-2 bg-emerald-500 rounded-full"
                    animate={{
                      scale: [1, 1.5, 1],
                      opacity: [1, 0.5, 1],
                    }}
                    transition={{ duration: 2, repeat: Infinity }}
                  />
                  Live
                </span>
              </div>
              <div className="space-y-3">
                {recentActivity.map((activity, index) => (
                  <motion.div
                    key={index}
                    className="flex items-center gap-3 text-sm"
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.6 + index * 0.1 }}
                    whileHover={{
                      x: 5,
                      backgroundColor: "rgba(255,255,255,0.02)",
                    }}
                  >
                    <div className="w-2 h-2 bg-indigo-500 rounded-full"></div>
                    <p className="text-gray-300">
                      <span className="font-semibold text-white">
                        {activity.user}
                      </span>{" "}
                      <span className="text-gray-400">{activity.action}</span>{" "}
                      <span className="font-medium text-indigo-400">
                        {activity.board}
                      </span>
                    </p>
                    <span className="ml-auto text-xs text-gray-500">
                      {activity.time}
                    </span>
                  </motion.div>
                ))}
              </div>
            </motion.div>

            {/* Error Message */}
            <AnimatePresence>
              {error && (
                <motion.div
                  className="bg-red-900/20 border border-red-800/20 p-4 rounded-lg text-red-300"
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: "auto" }}
                  exit={{ opacity: 0, height: 0 }}
                >
                  {error}
                </motion.div>
              )}
            </AnimatePresence>

            {/* Boards Grid/List */}
            <div>
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-lg font-semibold text-white">
                  {selectedFolder ? `${selectedFolder.name}` : "My Boards"}
                </h2>
                <div className="flex items-center gap-2 text-sm">
                  <button className="text-indigo-400 hover:text-indigo-300 transition">
                    All
                  </button>
                  <span className="text-gray-600">•</span>
                  <button className="text-gray-400 hover:text-white transition">
                    Recent
                  </button>
                  <span className="text-gray-600">•</span>
                  <button className="text-gray-400 hover:text-white transition">
                    Shared
                  </button>
                </div>
              </div>

              {filteredDashboards.length === 0 ? (
                <motion.div
                  className="text-center py-12 bg-[#141418] border border-white/10 rounded-xl"
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ type: "spring", stiffness: 100 }}
                >
                  <motion.svg
                    className="w-16 h-16 text-gray-600 mx-auto mb-4"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                    initial={{ rotate: -10 }}
                    animate={{ rotate: 10 }}
                    transition={{
                      duration: 1,
                      repeat: Infinity,
                      repeatType: "reverse",
                    }}
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={1}
                      d="M9 13h6m-3-3v6m5 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                    />
                  </motion.svg>
                  <h3 className="text-lg font-semibold text-white mb-2">
                    No dashboards found
                  </h3>
                  <p className="text-gray-400 mb-4">
                    {selectedFolder
                      ? "This folder is empty - drag boards here"
                      : "Create your first dashboard to get started"}
                  </p>
                  <motion.button
                    onClick={handleCreateDashboard}
                    className="px-5 py-2.5 rounded-lg bg-gradient-to-r from-indigo-600 to-violet-500 hover:from-indigo-500 hover:to-violet-400 text-white font-semibold"
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    Create Dashboard
                  </motion.button>
                </motion.div>
              ) : view === "grid" ? (
                <motion.div
                  className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4"
                  layout
                >
                  <AnimatePresence mode="popLayout">
                    {filteredDashboards.map((board, index) => (
                      <motion.div
                        key={board.id}
                        layout
                        initial={{ opacity: 0, scale: 0.8 }}
                        animate={{ opacity: 1, scale: 1 }}
                        exit={{ opacity: 0, scale: 0.8 }}
                        transition={{
                          type: "spring",
                          stiffness: 300,
                          damping: 25,
                          delay: index * 0.05,
                        }}
                        drag
                        dragConstraints={{
                          left: 0,
                          right: 0,
                          top: 0,
                          bottom: 0,
                        }}
                        dragElastic={0.7}
                        onDragStart={() => handleDragStart(board)}
                        onDragEnd={handleDragEnd}
                        whileDrag={{
                          scale: 1.1,
                          rotate: 5,
                          zIndex: 999,
                          boxShadow:
                            "0 25px 50px -12px rgba(99, 102, 241, 0.5)",
                        }}
                        className="group relative rounded-xl border border-white/10 bg-[#141418] hover:border-indigo-500/50 transition-all overflow-hidden cursor-move"
                        whileHover={{
                          y: -5,
                          boxShadow:
                            "0 20px 25px -5px rgba(0, 0, 0, 0.3)",
                        }}
                        onClick={(e) => {
                          if (
                            (e.target as HTMLElement).tagName !== "BUTTON" &&
                            !draggedDashboard
                          ) {
                            router.push(`/workspace/${board.id}`);
                          }
                        }}
                      >
                        <motion.div
                          className="h-40 bg-gradient-to-br from-indigo-500/20 to-violet-600/10 flex items-center justify-center relative"
                          whileHover={{ scale: 1.05 }}
                          transition={{
                            type: "spring",
                            stiffness: 400,
                            damping: 10,
                          }}
                        >
                          <div
                            className="absolute inset-0 opacity-20"
                            style={{
                              backgroundImage:
                                "linear-gradient(rgba(255,255,255,0.03) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.03) 1px, transparent 1px)",
                              backgroundSize: "20px 20px",
                            }}
                          ></div>
                          <motion.svg
                            className="w-12 h-12 text-white/20"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                            animate={{ rotate: [0, 5, -5, 0] }}
                            transition={{
                              duration: 5,
                              repeat: Infinity,
                              repeatType: "reverse",
                            }}
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={1}
                              d="M7 21a4 4 0 01-4-4V5a2 2 0 012-2h4a2 2 0 012 2v12a4 4 0 01-4 4zm0 0h12a2 2 0 002-2v-4a2 2 0 00-2-2h-2.343M11 7.343l1.657-1.657a2 2 0 012.828 0l2.829 2.829a2 2 0 010 2.828l-8.486 8.485M7 17h.01"
                            />
                          </motion.svg>

                          <motion.div
                            className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center backdrop-blur-sm"
                            initial={{ opacity: 0 }}
                            whileHover={{ opacity: 1 }}
                          >
                            <motion.button
                              className="px-4 py-2 bg-white text-gray-900 rounded-lg font-semibold hover:bg-gray-100 transition"
                              whileHover={{ scale: 1.1 }}
                              whileTap={{ scale: 0.95 }}
                            >
                              Open
                            </motion.button>
                          </motion.div>
                        </motion.div>
                        <div className="p-4">
                          <div className="flex items-start justify-between mb-2">
                            <h3 className="font-semibold text-white truncate flex-1">
                              {board.title}
                            </h3>
                            {board.isPublic && (
                              <motion.span
                                className="ml-2 px-2 py-0.5 bg-emerald-500/20 text-emerald-400 text-xs rounded-full"
                                initial={{ scale: 0 }}
                                animate={{ scale: 1 }}
                                transition={{
                                  type: "spring",
                                  stiffness: 500,
                                  delay: 0.2,
                                }}
                              >
                                Public
                              </motion.span>
                            )}
                          </div>
                          <div className="flex items-center justify-between text-xs">
                            <span className="text-gray-400">
                              {new Date(
                                board.updatedAt
                              ).toLocaleDateString()}
                            </span>
                            <div className="flex items-center gap-1 text-gray-400">
                              <svg
                                className="w-3 h-3"
                                fill="none"
                                stroke="currentColor"
                                viewBox="0 0 24 24"
                              >
                                <path
                                  strokeLinecap="round"
                                  strokeLinejoin="round"
                                  strokeWidth={2}
                                  d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                                />
                                <path
                                  strokeLinecap="round"
                                  strokeLinejoin="round"
                                  strokeWidth={2}
                                  d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"
                                />
                              </svg>
                              <span>{board.viewCount}</span>
                            </div>
                          </div>
                        </div>
                      </motion.div>
                    ))}
                  </AnimatePresence>
                </motion.div>
              ) : (
                <motion.div className="space-y-2" layout>
                  <AnimatePresence mode="popLayout">
                    {filteredDashboards.map((board, index) => (
                      <motion.div
                        key={board.id}
                        layout
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: -20 }}
                        transition={{ delay: index * 0.05 }}
                        drag="x"
                        dragConstraints={{ left: 0, right: 0 }}
                        dragElastic={0.2}
                        onDragStart={() => handleDragStart(board)}
                        onDragEnd={handleDragEnd}
                        whileDrag={{
                          scale: 1.02,
                          boxShadow:
                            "0 20px 25px -5px rgba(99, 102, 241, 0.3)",
                        }}
                        className="flex items-center gap-4 p-4 rounded-lg border border-white/10 bg-[#141418] hover:bg-white/5 hover:border-indigo-500/50 transition-all cursor-move group"
                        whileHover={{ x: 5 }}
                        onClick={() =>
                          !draggedDashboard &&
                          router.push(`/workspace/${board.id}`)
                        }
                      >
                        <motion.div
                          className="w-12 h-12 rounded-lg bg-gradient-to-br from-indigo-500/20 to-violet-600/10 flex items-center justify-center flex-shrink-0"
                          whileHover={{ scale: 1.1, rotate: 5 }}
                        >
                          <svg
                            className="w-6 h-6 text-white/30"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={1}
                              d="M7 21a4 4 0 01-4-4V5a2 2 0 012-2h4a2 2 0 012 2v12a4 4 0 01-4 4zm0 0h12a2 2 0 002-2v-4a2 2 0 00-2-2h-2.343M11 7.343l1.657-1.657a2 2 0 012.828 0l2.829 2.829a2 2 0 010 2.828l-8.486 8.485M7 17h.01"
                            />
                          </svg>
                        </motion.div>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2 mb-1">
                            <h3 className="font-semibold text-white">
                              {board.title}
                            </h3>
                            {board.isPublic && (
                              <span className="px-2 py-0.5 bg-emerald-500/20 text-emerald-400 text-xs rounded-full">
                                Public
                              </span>
                            )}
                          </div>
                          <p className="text-sm text-gray-400">
                            {new Date(
                              board.updatedAt
                            ).toLocaleDateString()}{" "}
                            • {board.viewCount} views
                          </p>
                        </div>
                      </motion.div>
                    ))}
                  </AnimatePresence>
                </motion.div>
              )}
            </div>
          </motion.div>
        </div>
      </main>

      {/* Create Folder Modal */}
      <AnimatePresence>
        {showCreateFolderModal && (
          <motion.div
            className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setShowCreateFolderModal(false)}
          >
            <motion.div
              className="bg-[#1a1a1f] border border-white/10 rounded-xl p-6 max-w-md w-full shadow-2xl"
              initial={{ scale: 0.9, y: 20 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.9, y: 20 }}
              transition={{ type: "spring", stiffness: 300, damping: 25 }}
              onClick={(e) => e.stopPropagation()}
            >
              <h3 className="text-xl font-semibold text-white mb-4">
                Create New Folder
              </h3>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    Folder Name
                  </label>
                  <input
                    type="text"
                    value={newFolderName}
                    onChange={(e) => setNewFolderName(e.target.value)}
                    placeholder="Enter folder name..."
                    className="w-full px-4 py-2.5 rounded-lg bg-[#0c0c0f] border border-white/10 text-gray-200 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                    autoFocus
                    onKeyPress={(e) =>
                      e.key === "Enter" && handleCreateFolder()
                    }
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    Color
                  </label>
                  <div className="flex gap-2 flex-wrap">
                    {colorOptions.map((color) => (
                      <motion.button
                        key={color}
                        onClick={() => setNewFolderColor(color)}
                        className={`w-10 h-10 rounded-lg bg-${color}-500 transition ${
                          newFolderColor === color
                            ? `ring-2 ring-${color}-400 ring-offset-2 ring-offset-[#1a1a1f]`
                            : ""
                        }`}
                        whileHover={{ scale: 1.2 }}
                        whileTap={{ scale: 0.9 }}
                        title={color}
                      />
                    ))}
                  </div>
                </div>
                <div className="flex gap-3 pt-4">
                  <motion.button
                    onClick={() => {
                      setShowCreateFolderModal(false);
                      setNewFolderName("");
                      setNewFolderColor("indigo");
                    }}
                    className="flex-1 px-4 py-2.5 rounded-lg bg-white/5 hover:bg-white/10 text-gray-300 font-medium transition"
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                  >
                    Cancel
                  </motion.button>
                  <motion.button
                    onClick={handleCreateFolder}
                    disabled={!newFolderName.trim()}
                    className="flex-1 px-4 py-2.5 rounded-lg bg-gradient-to-r from-indigo-600 to-violet-500 hover:from-indigo-500 hover:to-violet-400 text-white font-semibold transition disabled:opacity-50 disabled:cursor-not-allowed"
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                  >
                    Create
                  </motion.button>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
