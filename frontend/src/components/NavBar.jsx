/** @format */

import React from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";

export default function Navbar({ user, onLogout }) {
  return (
    <nav className='mx-auto flex h-14 max-w-7xl items-center justify-between px-6 w-full'>
      {/* Left: Brand Logo */}
      <div className='flex-1 text-xl font-black tracking-tight text-slate-900 select-none'>
        <Link to="/" className="hover:opacity-90 transition-opacity">
          DataLens<span className='text-indigo-600'>.</span>
        </Link>
      </div>

      {/* Center: Navigation links mapping to landing page sections */}
      <div className='hidden flex-1 items-center justify-center gap-8 md:flex'>
        <Link
          to='/'
          className='text-sm font-medium text-slate-600 hover:text-slate-900 transition-colors'>
          Home
        </Link>
        {user && (
          <Link
            to='/analytics'
            className='text-sm font-semibold text-indigo-600 hover:text-indigo-700 transition-colors'>
            Workspace
          </Link>
        )}
        <a
          href='/#how-to-use'
          className='text-sm font-medium text-slate-600 hover:text-slate-900 transition-colors'>
          How to Use
        </a>
        <a
          href='/#about-me'
          className='text-sm font-medium text-slate-600 hover:text-slate-900 transition-colors'>
          About
        </a>
      </div>

      {/* Right: User actions */}
      <div className='flex flex-1 items-center justify-end gap-3'>
        {user ? (
          <>
            <span className='text-sm font-medium text-slate-700 mr-2'>
              Welcome, <span className='font-bold text-slate-900'>{user.name}</span>
            </span>
            <Button
              onClick={onLogout}
              className='bg-red-600 hover:bg-red-700 text-white rounded-xl text-sm font-medium shadow-sm transition-all duration-200 cursor-pointer px-4 py-2'>
              Logout
            </Button>
          </>
        ) : (
          <>
            <Link
              to='/login'
              className='text-slate-600 hover:text-slate-900 hover:bg-slate-100 px-4 h-9 inline-flex items-center justify-center rounded-xl text-sm font-medium transition-all'>
              Login
            </Link>

            <Link
              to='/register'
              className='bg-slate-900 text-white hover:bg-slate-800 px-4 h-9 inline-flex items-center justify-center rounded-xl text-sm font-medium shadow-sm transition-all duration-200'>
              Sign up
            </Link>
          </>
        )}
      </div>
    </nav>
  );
}
