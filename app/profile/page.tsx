"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";

export default function ProfilePage(): any {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [user, setUser] = useState<{ id: string; name: string; email: string ,createdAt: string} | null>(null);
  
  const [name, setName] = useState("");
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [showCurrentPassword, setShowCurrentPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  // useEffect(() => {
  //   fetchProfile();
  // }, []);

  // const fetchProfile = async () => {
  //   try {
  //     const token = localStorage.getItem("token");
  //     if (!token) {
  //       router.push("/login");
  //       return;
  //     }

  //     const res = await fetch("/api/auth/profile", {
  //       headers: {
  //         Authorization: `Bearer ${token}`,
  //       },
  //     });

  //     const data = await res.json();
      
  //     if (data.success) {
  //       setUser(data.data.user);
  //       setName(data.data.user.name);
  //     } else {
  //       throw new Error(data.message || "Failed to load profile");
  //     }
  //   } catch (err: any) {
  //     setError(err?.message || "Failed to load profile");
  //     if (err?.message?.includes("token")) {
  //       setTimeout(() => router.push("/login"), 2000);
  //     }
  //   }
  // };

  const validateName = (value: string): string | null => {
    if (!value.trim()) return "Name is required";
    if (value.length < 2) return "Name must be at least 2 characters";
    if (value.length > 50) return "Name cannot exceed 50 characters";
    return null;
  };

  const validatePasswordChange = (): string | null => {
    if (!currentPassword) return "Current password is required";
    if (!newPassword) return "New password is required";
    if (newPassword.length < 8) return "New password must be at least 8 characters";
    if (newPassword !== confirmPassword) return "Passwords do not match";
    if (currentPassword === newPassword) return "New password must be different";
    return null;
  };

  const updateProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setSuccess(null);

    const validationError = validateName(name);
    if (validationError) {
      setError(validationError);
      return;
    }

    setLoading(true);
    try {
      const token = localStorage.getItem("token");
      const res = await fetch("/api/auth/profile", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ name }),
      });

      const data = await res.json();
      
      if (data.success) {
        setSuccess("Profile updated successfully");
        setUser(data.data.user);
        setTimeout(() => setSuccess(null), 3000);
      } else {
        throw new Error(data.message || "Update failed");
      }
    } catch (err: any) {
      setError(err?.message || "Update failed");
    } finally {
      setLoading(false);
    }
  };

  const changePassword = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setSuccess(null);

    const validationError = validatePasswordChange();
    if (validationError) {
      setError(validationError);
      return;
    }

    setLoading(true);
    try {
      const token = localStorage.getItem("token");
      const res = await fetch("/api/auth/password", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          currentPassword,
          newPassword,
        }),
      });

      const data = await res.json();
      
      if (data.success) {
        setSuccess("Password changed successfully");
        setCurrentPassword("");
        setNewPassword("");
        setConfirmPassword("");
        setTimeout(() => setSuccess(null), 3000);
      } else {
        throw new Error(data.message || "Password change failed");
      }
    } catch (err: any) {
      setError(err?.message || "Password change failed");
    } finally {
      setLoading(false);
    }
  };

  const deleteAccount = async () => {
    if (!confirm("Are you sure? This will permanently delete your account and all data.")) {
      return;
    }

    if (!confirm("This cannot be undone. Delete anyway?")) {
      return;
    }

    setLoading(true);
    try {
      const token = localStorage.getItem("token");
      const res = await fetch("/api/auth/account", {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      const data = await res.json();
      
      if (data.success) {
        localStorage.removeItem("token");
        router.push("/login");
      } else {
        throw new Error(data.message || "Delete failed");
      }
    } catch (err: any) {
      setError(err?.message || "Delete failed");
    } finally {
      setLoading(false);
    }
  };

  const signOut = () => {
    if (confirm("Sign out of your account?")) {
      localStorage.removeItem("token");
      router.push("/login");
    }
  };

  return (
    <div className="min-h-screen bg-[#0c0c0f] text-gray-200 flex flex-col">
      {/* Header/Navbar */}
      <header className="flex items-center justify-between px-6 py-4 border-b border-white/10 bg-[#0f0f12]/95 backdrop-blur-xl z-50">
        <div className="flex items-center gap-4">
          <Link href="/dashboard" className="p-2 rounded-lg hover:bg-white/5 transition group">
            <svg className="w-5 h-5 text-gray-400 group-hover:text-white transition" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
          </Link>
          
          <div className="flex items-center gap-3">
            <div className="rounded-lg bg-gradient-to-r from-indigo-600 to-violet-500 p-1">
              <div className="bg-[#0c0c0f] rounded-md px-3 py-1 font-bold text-sm text-indigo-300">
                CollabBoard
              </div>
            </div>
            <h1 className="text-xl font-bold text-white">Profile Settings</h1>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <Link href="/dashboard" className="px-3 py-2 text-sm text-gray-400 hover:text-white hover:bg-white/5 rounded-lg transition">
            Dashboard
          </Link>
          <button
            onClick={signOut}
            className="px-3 py-2 text-sm text-gray-400 hover:text-white hover:bg-white/5 rounded-lg transition"
          >
            Sign Out
          </button>
        </div>
      </header>

      {/* Main Content */}
      <div className="flex-1 overflow-auto">
        <div className="max-w-4xl mx-auto w-full p-6">
          {/* Loading Overlay */}
          {loading && (
            <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50">
              <div className="bg-[#0f1013] border border-white/10 rounded-2xl p-8 flex flex-col items-center gap-4 shadow-2xl">
                <div className="w-12 h-12 border-4 border-indigo-500/30 border-t-indigo-500 rounded-full animate-spin"></div>
                <p className="text-white font-semibold">Processing...</p>
              </div>
            </div>
          )}

          <div className="bg-[#0f1013] border border-white/10 rounded-2xl shadow-xl overflow-hidden">
            {/* Header */}
            <div className="relative bg-gradient-to-r from-indigo-600/20 to-violet-500/20 p-8 border-b border-white/10">
              <div className="absolute inset-0 bg-gradient-to-br from-indigo-600/5 to-transparent"></div>
              <div className="relative flex items-center gap-6">
                <div className="w-24 h-24 rounded-full bg-gradient-to-br from-indigo-600 to-violet-500 flex items-center justify-center text-3xl font-bold text-white border-2 border-white/10 shadow-lg">
                  {user?.name?.charAt(0).toUpperCase() || "U"}
                </div>
                <div>
                  <h1 className="text-3xl font-extrabold text-white">{user?.name || "Loading..."}</h1>
                  <p className="text-gray-400">{user?.email || ""}</p>
                  <p className="text-xs text-gray-500 mt-1">Member since {user ? new Date(user.createdAt).toLocaleDateString() : ""}</p>
                </div>
              </div>
            </div>

            {/* Content */}
            <div className="p-8 space-y-8">
              {/* Profile Info Section */}
              <section>
                <h2 className="text-xl font-semibold text-white mb-4 flex items-center gap-2">
                  <svg className="w-5 h-5 text-indigo-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                  </svg>
                  Profile Information
                </h2>

                {error && (
                  <div className="mb-4 rounded-lg bg-red-900/20 border border-red-800/20 p-3 text-red-300 text-sm animate-shake">
                    {error}
                  </div>
                )}
                {success && (
                  <div className="mb-4 rounded-lg bg-green-900/20 border border-green-800/20 p-3 text-green-200 text-sm animate-slide-down">
                    {success}
                  </div>
                )}

                <form onSubmit={updateProfile} className="space-y-4">
                  <label className="block">
                    <span className="text-sm font-medium text-gray-300">Full Name</span>
                    <input
                      type="text"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      disabled={loading}
                      className="mt-1 w-full px-4 py-3 rounded-lg bg-[#0b0b0c] border border-white/6 text-gray-100 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-indigo-500 transition text-sm sm:text-base disabled:opacity-50"
                      placeholder="Enter your name"
                    />
                  </label>

                  <label className="block">
                    <span className="text-sm font-medium text-gray-300">Email</span>
                    <input
                      type="email"
                      value={user?.email || ""}
                      disabled
                      className="mt-1 w-full px-4 py-3 rounded-lg bg-[#0b0b0c] border border-white/10 text-gray-500 cursor-not-allowed"
                    />
                    <p className="text-xs text-gray-500 mt-1">Email cannot be changed</p>
                  </label>

                  <button
                    type="submit"
                    disabled={loading}
                    className="w-full inline-flex items-center justify-center gap-2 px-5 py-3 rounded-lg bg-gradient-to-r from-indigo-600 to-violet-500 hover:from-indigo-500 hover:to-violet-400 disabled:opacity-60 text-white font-semibold text-sm sm:text-base shadow-lg shadow-indigo-500/20 transition-all"
                  >
                    {loading ? (
                      <>
                        <svg className="animate-spin h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z"></path>
                        </svg>
                        Updating...
                      </>
                    ) : (
                      "Update Profile"
                    )}
                  </button>
                </form>
              </section>

              {/* Change Password Section */}
              <section className="border-t border-white/10 pt-8">
                <h2 className="text-xl font-semibold text-white mb-4 flex items-center gap-2">
                  <svg className="w-5 h-5 text-indigo-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                  </svg>
                  Change Password
                </h2>

                <form onSubmit={changePassword} className="space-y-4">
                  <label className="block relative">
                    <span className="text-sm font-medium text-gray-300">Current Password</span>
                    <input
                      type={showCurrentPassword ? "text" : "password"}
                      value={currentPassword}
                      onChange={(e) => setCurrentPassword(e.target.value)}
                      disabled={loading}
                      className="mt-1 w-full px-4 py-3 rounded-lg bg-[#0b0b0c] border border-white/6 text-gray-100 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-indigo-500 transition text-sm sm:text-base disabled:opacity-50"
                      placeholder="Enter current password"
                    />
                    <button
                      type="button"
                      onClick={() => setShowCurrentPassword(!showCurrentPassword)}
                      className="absolute right-3 top-[42px] text-xs text-gray-400 hover:text-gray-200"
                    >
                      {showCurrentPassword ? "Hide" : "Show"}
                    </button>
                  </label>

                  <label className="block relative">
                    <span className="text-sm font-medium text-gray-300">New Password</span>
                    <input
                      type={showNewPassword ? "text" : "password"}
                      value={newPassword}
                      onChange={(e) => setNewPassword(e.target.value)}
                      disabled={loading}
                      className="mt-1 w-full px-4 py-3 rounded-lg bg-[#0b0b0c] border border-white/6 text-gray-100 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-indigo-500 transition text-sm sm:text-base disabled:opacity-50"
                      placeholder="Min. 8 characters"
                    />
                    <button
                      type="button"
                      onClick={() => setShowNewPassword(!showNewPassword)}
                      className="absolute right-3 top-[42px] text-xs text-gray-400 hover:text-gray-200"
                    >
                      {showNewPassword ? "Hide" : "Show"}
                    </button>
                  </label>

                  <label className="block relative">
                    <span className="text-sm font-medium text-gray-300">Confirm New Password</span>
                    <input
                      type={showConfirmPassword ? "text" : "password"}
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                      disabled={loading}
                      className="mt-1 w-full px-4 py-3 rounded-lg bg-[#0b0b0c] border border-white/6 text-gray-100 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-indigo-500 transition text-sm sm:text-base disabled:opacity-50"
                      placeholder="Confirm new password"
                    />
                    <button
                      type="button"
                      onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                      className="absolute right-3 top-[42px] text-xs text-gray-400 hover:text-gray-200"
                    >
                      {showConfirmPassword ? "Hide" : "Show"}
                    </button>
                  </label>

                  <button
                    type="submit"
                    disabled={loading}
                    className="w-full inline-flex items-center justify-center gap-2 px-5 py-3 rounded-lg bg-gradient-to-r from-indigo-600 to-violet-500 hover:from-indigo-500 hover:to-violet-400 disabled:opacity-60 text-white font-semibold text-sm sm:text-base shadow-lg shadow-indigo-500/20 transition-all"
                  >
                    {loading ? (
                      <>
                        <svg className="animate-spin h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z"></path>
                        </svg>
                        Changing...
                      </>
                    ) : (
                      "Change Password"
                    )}
                  </button>
                </form>
              </section>

              {/* Danger Zone */}
              <section className="border-t border-red-800/20 pt-8">
                <h2 className="text-xl font-semibold text-red-400 mb-4 flex items-center gap-2">
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                  </svg>
                  Danger Zone
                </h2>
                
                <div className="bg-red-900/10 border border-red-800/20 rounded-lg p-6">
                  <p className="text-sm text-gray-300 mb-4">
                    Once you delete your account, there is no going back. Please be certain.
                  </p>
                  
                  <div className="flex gap-3">
                    <button
                      onClick={signOut}
                      className="px-4 py-2 rounded-lg bg-white/10 text-white hover:bg-white/20 transition text-sm font-medium"
                    >
                      Sign Out
                    </button>
                    
                    <button
                      onClick={deleteAccount}
                      disabled={loading}
                      className="px-4 py-2 rounded-lg bg-red-600 text-white hover:bg-red-700 disabled:opacity-50 transition text-sm font-medium"
                    >
                      Delete Account
                    </button>
                  </div>
                </div>
              </section>
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
        .animate-shake {
          animation: shake 0.3s ease-in-out;
        }
        .animate-slide-down {
          animation: slide-down 0.3s ease-out;
        }
      `}</style>
    </div>
  );
}
