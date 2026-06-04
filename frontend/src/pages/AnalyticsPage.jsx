/** @format */

import React from "react";
import { Link, useLocation } from "react-router-dom";
import {
  BarChart3,
  LayoutDashboard,
  Database,
  Settings,
  LogOut,
  Home,
  Sparkles,
  RefreshCw,
} from "lucide-react";

export default function AnalyticsPage({ user, onLogout }) {
  const location = useLocation();

  // Helper function to dynamically highlight active router nodes
  const isActive = (path) => location.pathname === path;

  return (
    <div className='relative min-h-screen bg-slate-50 text-slate-900 flex overflow-hidden font-sans'>
      {/* ─── GLOBAL DECORATIVE GLOW BACKGROUND ─── */}
      <div
        className='absolute inset-0 z-0 pointer-events-none'
        aria-hidden='true'>
        {/* SVG Grid Lines */}
        <svg className='absolute inset-0 h-full w-full stroke-slate-200/80 [mask-image:radial-gradient(100%_100%_at_top,white,transparent)]'>
          <defs>
            <pattern
              id='analytics-grid'
              width='40'
              height='40'
              patternUnits='userSpaceOnUse'
              x='50%'>
              <path d='M.5 40V.5H40' fill='none' />
            </pattern>
          </defs>
          <rect
            width='100%'
            height='100%'
            strokeWidth='0'
            fill='url(#analytics-grid)'
          />
        </svg>

        {/* Ambient Glows */}
        <div className='absolute top-0 right-1/4 h-[500px] w-[500px] rounded-full bg-indigo-100/40 blur-3xl' />
        <div className='absolute bottom-10 left-1/4 h-[500px] w-[500px] rounded-full bg-blue-100/30 blur-3xl' />
      </div>

      {/* ─── SIDEBAR NAVIGATION ─── */}
      <aside className='relative z-10 w-64 border-r border-slate-200/80 bg-white/80 backdrop-blur-md flex flex-col justify-between p-6'>
        <div className='space-y-8'>
          {/* Logo */}
          <div className='text-2xl font-black tracking-tight text-slate-900 select-none'>
            DataLens<span className='text-indigo-600'>.</span>
          </div>

          {/* Navigation Links */}
          <nav className='space-y-1'>
            <Link
              to='/'
              className='flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium text-slate-600 hover:text-slate-900 hover:bg-slate-100 transition-all'>
              <Home className='w-4 h-4' />
              Landing Page
            </Link>

            <Link
              to='/analytics'
              className={`flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-all ${
                isActive("/analytics")
                  ? "font-semibold bg-indigo-50 border border-indigo-100 text-indigo-600"
                  : "text-slate-600 hover:text-slate-900 hover:bg-slate-100"
              }`}>
              <LayoutDashboard className='w-4 h-4' />
              Workspace
            </Link>

            {/* UNLOCKED: Deep Analytics Link Layer */}
            <Link
              to='/analytics/deep'
              className={`flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-all border ${
                isActive("/analytics/deep")
                  ? "font-semibold bg-indigo-50 border-indigo-100 text-indigo-600"
                  : "text-slate-600 hover:text-slate-900 hover:bg-slate-100 border-transparent"
              }`}>
              <BarChart3 className='w-4 h-4' />
              <span>Deep Analytics</span>
            </Link>

            {/* Kept placeholders intact but clean for future features */}
            <div className='opacity-50 cursor-not-allowed flex items-center justify-between px-4 py-3 rounded-xl text-sm font-medium text-slate-400'>
              <span className='flex items-center gap-3'>
                <Database className='w-4 h-4' />
                Data Manager
              </span>
              <span className='text-[9px] font-mono bg-slate-100 text-slate-500 px-1.5 py-0.5 rounded'>
                Soon
              </span>
            </div>

            <div className='opacity-50 cursor-not-allowed flex items-center justify-between px-4 py-3 rounded-xl text-sm font-medium text-slate-400'>
              <span className='flex items-center gap-3'>
                <Settings className='w-4 h-4' />
                Settings
              </span>
            </div>
          </nav>
        </div>

        {/* User Info & Logout */}
        <div className='space-y-4 pt-6 border-t border-slate-100'>
          {user && (
            <div className='px-2'>
              <p className='text-[10px] text-slate-400 font-mono tracking-wider'>
                AUTHENTICATED NODE
              </p>
              <p className='text-sm font-bold text-slate-800 truncate'>
                {user.name}
              </p>
              <p className='text-xs text-slate-500 truncate'>{user.email}</p>
            </div>
          )}
          <button
            onClick={onLogout}
            className='w-full flex items-center justify-center gap-2 h-10 px-4 rounded-xl text-xs font-semibold bg-red-50 text-red-600 border border-red-100 hover:bg-red-100/60 hover:text-red-700 transition-all cursor-pointer'>
            <LogOut className='w-3.5 h-3.5' />
            Disconnect Node
          </button>
        </div>
      </aside>

      {/* ─── MAIN WORKSPACE CONTENT ─── */}
      <main className='relative z-10 flex-1 flex flex-col'>
        {/* Top Header */}
        <header className='h-16 border-b border-slate-200/60 bg-white/40 backdrop-blur-md flex items-center justify-between px-8'>
          <div className='flex items-center gap-2'>
            <span className='w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse' />
            <span className='text-[11px] text-slate-500 font-mono tracking-wider'>
              LIVE NODE SYSTEM STREAM
            </span>
          </div>
          <Link
            to='/'
            className='flex items-center gap-2 text-xs font-medium text-slate-600 hover:text-slate-900 transition-colors'>
            <Home className='w-3.5 h-3.5' />
            Back to Home
          </Link>
        </header>

        {/* Dashboard Content Container */}
        <div className='flex-1 p-8 flex flex-col justify-center items-center max-w-4xl mx-auto w-full'>
          {/* Main Coming Soon Presentation Card */}
          <div className='w-full max-w-2xl text-center space-y-8 p-8 md:p-12 rounded-3xl border border-slate-200/80 bg-white/80 backdrop-blur-lg shadow-xl shadow-slate-200/50 relative overflow-hidden animate-fade-in'>
            <div className='absolute -top-24 left-1/2 -translate-x-1/2 w-48 h-48 rounded-full bg-indigo-100/30 blur-2xl pointer-events-none' />

            <div className='inline-flex items-center gap-2 px-3.5 py-1.5 text-xs font-semibold tracking-wide text-indigo-700 bg-indigo-50 border border-indigo-100 rounded-full shadow-sm'>
              <Sparkles className='w-3.5 h-3.5 text-indigo-600' />
              DataLens Workspace Node
            </div>

            <div className='space-y-4'>
              <h2 className='text-3xl md:text-4xl lg:text-5xl font-black tracking-tight leading-none bg-gradient-to-r from-slate-950 via-slate-800 to-indigo-900 bg-clip-text text-transparent'>
                Analytics Workspace
              </h2>
              <p className='text-slate-600 max-w-md mx-auto text-sm md:text-base leading-relaxed font-medium'>
                We are building the next generation DataLens workspace. Upload,
                clean, structure, and visualize your pipelines directly from
                this console.
              </p>
            </div>

            {/* Progress status loader mimicking workspace generation */}
            <div className='space-y-2 max-w-sm mx-auto'>
              <div className='flex justify-between text-[11px] font-mono text-slate-500'>
                <span className='flex items-center gap-1.5'>
                  <RefreshCw className='w-3 h-3 animate-spin text-indigo-500' />
                  compiling analytics dashboard
                </span>
                <span className='font-semibold'>80%</span>
              </div>
              <div className='w-full h-2 bg-slate-100 rounded-full overflow-hidden border border-slate-200/60 shadow-inner'>
                <div className='w-[80%] h-full bg-gradient-to-r from-indigo-500 to-blue-500 rounded-full animate-pulse' />
              </div>
            </div>

            {/* Interactive Redirect Button to go straight into the Deep ML Dashboard */}
            <div className='pt-4'>
              <Link
                to='/analytics/deep'
                className='inline-block px-6 py-3 rounded-2xl bg-indigo-600 hover:bg-indigo-500 text-white font-bold tracking-wider text-xs uppercase shadow-md shadow-indigo-600/10 transition-all cursor-pointer'>
                Launch Deep Analysis Engine
              </Link>
            </div>
          </div>

          {/* Background Mockup Grid Preview */}
          <div className='w-full mt-12 grid grid-cols-3 gap-6 opacity-30 pointer-events-none'>
            <div className='h-28 rounded-2xl border border-slate-200/80 bg-white/60 p-4 space-y-2.5'>
              <div className='w-8 h-8 rounded-lg bg-indigo-50 flex items-center justify-center text-xs font-semibold text-indigo-600 border border-indigo-100' />
              <div className='w-12 h-2.5 bg-slate-200 rounded' />
              <div className='w-20 h-2 bg-slate-150 rounded' />
            </div>
            <div className='h-28 rounded-2xl border border-slate-200/80 bg-white/60 p-4 space-y-2.5'>
              <div className='w-8 h-8 rounded-lg bg-blue-50 flex items-center justify-center text-xs font-semibold text-blue-600 border border-blue-100' />
              <div className='w-12 h-2.5 bg-slate-200 rounded' />
              <div className='w-20 h-2 bg-slate-150 rounded' />
            </div>
            <div className='h-28 rounded-2xl border border-slate-200/80 bg-white/60 p-4 space-y-2.5'>
              <div className='w-8 h-8 rounded-lg bg-emerald-50 flex items-center justify-center text-xs font-semibold text-emerald-600 border border-emerald-100' />
              <div className='w-12 h-2.5 bg-slate-200 rounded' />
              <div className='w-20 h-2 bg-slate-150 rounded' />
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
