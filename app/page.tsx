"use client";

import React from "react";
import Link from "next/link";
import { customRouter } from "@/utils/customrouter";

export default function Home(): any {
  const features = [
    {
      title: "Live Editing",
      description: "Work together in real time — no sync, no conflicts.",
    },
    {
      title: "Secure by Default",
      description: "Encryption, SSO and role-based access out of the box.",
    },
    {
      title: "Actionable Insights",
      description: "Built-in widgets and exportable reports for fast decisions.",
    },
  ];

  return (
    <main className="min-h-screen bg-[#0d0d0f] text-gray-200 flex flex-col">
      {/* Top bar */}
      <header className="w-full border-b border-white/10 bg-[#0f0f12]/70 backdrop-blur">
        <div className="max-w-6xl mx-auto flex items-center justify-between px-6 py-5">
          <div className="flex items-center gap-3">
            <div className="rounded-md bg-gradient-to-r from-indigo-600 to-violet-500 p-1">
              <div className="bg-[#0d0d0f] rounded-sm px-3 py-1 font-semibold text-indigo-400">
                CollabBoard
              </div>
            </div>
            <span className="text-sm text-gray-400 hidden sm:inline">
              Simple, focused teamwork
            </span>
          </div>

          <nav className="hidden sm:flex gap-8 text-gray-400">
            <a href="#features" className="hover:text-indigo-400 transition">
              Features
            </a>
            <a href="#pricing" className="hover:text-indigo-400 transition">
              Pricing
            </a>
            <a href="#contact" className="hover:text-indigo-400 transition">
              Contact
            </a>
          </nav>

          <div className="flex items-center gap-3">
            <Link href="/login" className="text-sm text-gray-400 hover:text-gray-200">
              Log in
            </Link>
            <div className="ml-3"></div>
            <Link
              href="/signup"
              className="inline-block bg-indigo-600 hover:bg-indigo-500 text-white px-4 py-2 rounded-md text-sm font-medium"
            >
              Get Started
            </Link>
          </div>
        </div>
      </header>

      {/* Hero */}
      <section className="flex-grow flex items-center justify-center">
        <div className="max-w-5xl w-full px-6 py-16 grid grid-cols-1 md:grid-cols-2 gap-10 items-center">
          <div>
            <h1 className="text-3xl md:text-4xl font-extrabold leading-tight text-white">
              Collaboration that's fast, secure, and delightfully simple
            </h1>
            <p className="mt-4 text-gray-400 max-w-xl">
              Create shared dashboards, edit together in real time, and get
              clear analytics — without the noise. Built for small teams and
              enterprises alike.
            </p>

            <div className="mt-6 flex flex-wrap gap-3">
              <Link
                href="#"
                className="inline-block bg-indigo-600 hover:bg-indigo-500 text-white px-5 py-3 rounded-md font-medium"
              >
                Start free
              </Link>
              <Link
                href="#"
                className="inline-block px-5 py-3 rounded-md border border-white/10 text-gray-300 hover:bg-white/5"
              >
                Watch demo
              </Link>
            </div>

            <div className="mt-8 grid grid-cols-3 gap-3 max-w-sm">
              {[
                { label: "Visitors", val: "12.4k" },
                { label: "Conversions", val: "1.2k" },
                { label: "Revenue", val: "$32.4k" },
              ].map((item) => (
                <div
                  key={item.label}
                  className="bg-white/5 border border-white/10 rounded-md p-3 text-center"
                >
                  <div className="text-xs text-gray-400">{item.label}</div>
                  <div className="font-semibold mt-1 text-white">
                    {item.val}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Right card */}
          {/* <div className="hidden md:block">
            <div className="rounded-xl border border-white/10 shadow-lg p-6 bg-[#141418]">
              <div className="flex items-center justify-between">
                <div>
                  <div className="text-sm text-gray-400">Team activity</div>
                  <div className="text-lg font-semibold mt-1 text-white">
                    Marketing Dashboard
                  </div>
                </div>
                <div className="text-sm text-gray-500">Updated 2m ago</div>
              </div>

              <div className="mt-6 grid grid-cols-3 gap-4">
                {[
                  { label: "Visitors", val: "12,431" },
                  { label: "Conversions", val: "1,204" },
                  { label: "Revenue", val: "$32.4k" },
                ].map((item) => (
                  <div
                    key={item.label}
                    className="p-3 rounded-md bg-indigo-500/10 text-center"
                  >
                    <div className="text-xs text-gray-400">{item.label}</div>
                    <div className="font-semibold mt-1 text-white">
                      {item.val}
                    </div>
                  </div>
                ))}
              </div>

              <div className="mt-6 text-sm text-gray-500">
                Integrations: Slack · Google Drive · Figma
              </div>
            </div>
          </div> */}
        </div>
      </section>

      {/* Features */}
      <section id="features" className="max-w-6xl mx-auto px-6 py-12">
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
          {features.map((f) => (
            <div
              key={f.title}
              className="border border-white/10 rounded-lg p-6 bg-[#141418] shadow-sm"
            >
              <h3 className="font-semibold text-lg text-white">{f.title}</h3>
              <p className="mt-2 text-gray-400">{f.description}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Pricing */}
      <section id="pricing" className="bg-[#0f0f12] py-12">
        <div className="max-w-4xl mx-auto px-6 text-center">
          <h4 className="text-2xl font-semibold text-white">
            Simple pricing — free forever for small teams
          </h4>
          <p className="mt-2 text-gray-400">
            Pay per seat as you scale. Enterprise plans include priority support
            and compliance features.
          </p>
          <div className="mt-6">
            <Link
              href="#"
              className="inline-block bg-indigo-600 hover:bg-indigo-500 text-white px-5 py-3 rounded-md font-medium"
            >
              View pricing
            </Link>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-white/10">
        <div className="max-w-6xl mx-auto px-6 py-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-sm text-gray-400">
          <div>© {new Date().getFullYear()} CollabBoard</div>
          <div className="flex gap-4">
            <Link href="#" className="hover:text-gray-200">
              Privacy
            </Link>
            <Link href="#" className="hover:text-gray-200">
              Terms
            </Link>
            <Link href="#" className="hover:text-gray-200">
              Contact
            </Link>
          </div>
        </div>
      </footer>
    </main>
  );
}
