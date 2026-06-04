/** @format */

import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import axios from "axios";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

export default function RegisterForm() {
  const navigate = useNavigate();

  // 1. Form state
  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
  });

  // 2. Handle input change
  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm({ ...form, [name]: value });
  };

  // 3. Submit form to DataLens backend auth node
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.post("http://localhost:8080/api/user/register", form, {
        withCredentials: true,
      });
      alert("Registration successful!");
      navigate("/login"); // go to login page
    } catch (err) {
      alert("Registration failed");
    }
  };

  return (
    <div className='relative min-h-screen flex flex-col items-center justify-center bg-slate-50 text-slate-900 overflow-hidden font-sans px-4'>
      {/* ─── 1. INTEGRATED DATALENS SVG GRID BACKGROUND ─── */}
      <div
        className='absolute inset-0 z-0 pointer-events-none'
        aria-hidden='true'>
        <svg className='absolute inset-0 h-full w-full stroke-slate-200 [mask-image:radial-gradient(100%_100%_at_center,white,transparent)]'>
          <defs>
            <pattern
              id='auth-grid'
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
            fill='url(#auth-grid)'
          />
        </svg>

        {/* Ambient background glow matching the dashboard ecosystem */}
        <div className='absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 -z-10 h-[500px] w-[500px] rounded-full bg-gradient-to-tr from-indigo-100/30 via-sky-100/20 to-emerald-50/30 opacity-80 blur-3xl' />
      </div>

      {/* ─── 2. AUTH CONTAINER CARD ─── */}
      <div className='relative z-10 w-full max-w-[420px] space-y-6 animate-fade-in'>
        {/* Subtle Branding Header */}
        <div className='text-center space-y-1'>
          <Link
            to='/'
            className='inline-block text-2xl font-black tracking-tight text-slate-900 select-none hover:opacity-90 transition-opacity'>
            DataLens<span className='text-indigo-600'>.</span>
          </Link>
          <p className='text-xs text-slate-400 font-mono tracking-wider'>
            SECURE INGESTION GATEWAY
          </p>
        </div>

        {/* Crisp Glassmorphism Registration Form Card */}
        <Card className='rounded-2xl border border-slate-200/80 bg-white/80 backdrop-blur-md shadow-xl shadow-slate-200/50 overflow-hidden'>
          <form onSubmit={handleSubmit}>
            <CardHeader className='pb-4 pt-6 px-6 text-center sm:text-left border-b border-slate-100/60 bg-slate-50/40'>
              <CardTitle className='text-xl font-extrabold tracking-tight text-slate-900'>
                Create Account
              </CardTitle>
              <CardDescription className='text-slate-500 text-xs mt-1'>
                Get started with cloud-mapped analytics data frames.
              </CardDescription>
            </CardHeader>

            <CardContent className='space-y-4 px-6 pt-6 pb-6'>
              {/* Name Input Field */}
              <div className='space-y-1.5'>
                <Label className='text-xs font-semibold tracking-wide text-slate-700'>
                  Full Name
                </Label>
                <Input
                  name='name'
                  type='text'
                  required
                  placeholder='John Doe'
                  value={form.name}
                  onChange={handleChange}
                  className='h-10 rounded-xl bg-white/50 border-slate-200 text-slate-900 placeholder:text-slate-400 focus-visible:ring-indigo-500 focus-visible:border-indigo-500 shadow-sm transition-all'
                />
              </div>

              {/* Email Input Field */}
              <div className='space-y-1.5'>
                <Label className='text-xs font-semibold tracking-wide text-slate-700'>
                  Email Address
                </Label>
                <Input
                  name='email'
                  type='email'
                  required
                  placeholder='email@example.com'
                  value={form.email}
                  onChange={handleChange}
                  className='h-10 rounded-xl bg-white/50 border-slate-200 text-slate-900 placeholder:text-slate-400 focus-visible:ring-indigo-500 focus-visible:border-indigo-500 shadow-sm transition-all'
                />
              </div>

              {/* Password Input Field */}
              <div className='space-y-1.5'>
                <Label className='text-xs font-semibold tracking-wide text-slate-700'>
                  Password
                </Label>
                <Input
                  name='password'
                  type='password'
                  required
                  placeholder='••••••••'
                  value={form.password}
                  onChange={handleChange}
                  className='h-10 rounded-xl bg-white/50 border-slate-200 text-slate-900 placeholder:text-slate-400 focus-visible:ring-indigo-500 focus-visible:border-indigo-500 shadow-sm transition-all'
                />
              </div>

              {/* Action Form Submit Trigger */}
              <Button
                type='submit'
                className='w-full h-10 bg-slate-900 text-white hover:bg-slate-800 rounded-xl text-sm font-medium shadow-md shadow-slate-900/10 transition-all duration-200 mt-2'>
                Complete Registration
              </Button>

              {/* Supplementary Redirection Link */}
              <p className='text-center text-xs text-slate-500 pt-2'>
                Already have an analytics node account?{" "}
                <Link
                  to='/login'
                  className='font-semibold text-indigo-600 hover:text-indigo-500 transition-colors'>
                  Log In
                </Link>
              </p>
            </CardContent>
          </form>
        </Card>
      </div>
    </div>
  );
}
