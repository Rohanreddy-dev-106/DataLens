import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import Navbar from "../components/NavBar";
import Footer from "../components/Footer";

function LandingPage({ user, onLogout }) {
  const [githubUser, setGithubUser] = useState(null);
  const [loadingGithub, setLoadingGithub] = useState(true);

  // Fetch Live GitHub Profile Data
  useEffect(() => {
    fetch("https://api.github.com/users/Rohanreddy-dev-106")
      .then((res) => {
        if (!res.ok) throw new Error("Failed to fetch profile");
        return res.json();
      })
      .then((data) => {
        setGithubUser(data);
        setLoadingGithub(false);
      })
      .catch((err) => {
        console.error("Error fetching GitHub profile:", err);
        setLoadingGithub(false);
      });
  }, []);

  return (
    <div className='relative min-h-screen flex flex-col bg-slate-50 text-slate-900 overflow-hidden font-sans'>
      
      {/* ─── 1. THE GLOBAL GRID BACKGROUND (LINES) ─── */}
      <div className='absolute inset-0 z-0 pointer-events-none' aria-hidden='true'>
        {/* SVG Grid Lines with a smooth radial fade mask */}
        <svg className='absolute inset-0 h-full w-full stroke-slate-200 [mask-image:radial-gradient(100%_100%_at_top,white,transparent)]'>
          <defs>
            <pattern
              id='landing-grid'
              width='40'
              height='40'
              patternUnits='userSpaceOnUse'
              x='50%'>
              <path d='M.5 40V.5H40' fill='none' />
            </pattern>
          </defs>
          <rect width='100%' height='100%' strokeWidth='0' fill='url(#landing-grid)' />
        </svg>

        {/* Dynamic decorative accent glows */}
        <div className='absolute top-0 right-1/4 -z-10 h-[600px] w-[600px] rounded-full bg-gradient-to-tr from-indigo-100/40 via-sky-100/30 to-emerald-50/40 opacity-70 blur-3xl' />
        <div className='absolute top-[50%] left-1/4 -z-10 h-[500px] w-[500px] rounded-full bg-gradient-to-br from-blue-100/30 to-violet-100/20 opacity-50 blur-3xl' />
      </div>

      {/* ─── 2. NAVIGATION BAR ─── */}
      <div className='relative z-10 border-b border-slate-200/60 bg-white/60 backdrop-blur-md'>
        <Navbar user={user} onLogout={onLogout} />
      </div>

      {/* ─── 3. MAIN CONTAINER ─── */}
      <main className='relative z-10 flex-1 max-w-7xl w-full mx-auto px-6 lg:px-8 py-12 lg:py-20 space-y-32'>
        
        {/* HERO SECTION */}
        <section className='grid grid-cols-1 lg:grid-cols-2 gap-12 items-center pt-6'>
          <div className='space-y-6 text-center lg:text-left'>
            <h1 className='text-4xl sm:text-5xl lg:text-6xl font-black tracking-tight leading-none text-slate-900'>
              Intelligent Analytics with <span className='bg-gradient-to-r from-indigo-600 to-blue-600 bg-clip-text text-transparent'>DataLens</span>
            </h1>
            <p className='text-lg text-slate-600 max-w-xl mx-auto lg:mx-0 leading-relaxed'>
              An intelligent data analysis platform to upload your datasets, process operations via high-speed calculations, and view visual analytics instantly.
            </p>
            <div className='flex flex-wrap items-center justify-center lg:justify-start gap-4'>
              <Link to={user ? "/analytics" : "/login"} className='h-11 px-6 inline-flex items-center font-medium tracking-wide text-white bg-slate-900 hover:bg-slate-800 rounded-xl shadow-md transition-all duration-200'>
                Launch Workspace
              </Link>
              <a href="#how-to-use" className='h-11 px-6 inline-flex items-center font-medium tracking-wide text-slate-600 bg-white hover:bg-slate-50 border border-slate-200 rounded-xl transition-all duration-200'>
                Explore Workflow
              </a>
            </div>
          </div>

          {/* RIGHT HERO SIDE: Interactive Chart / Data Dashboard Box Mockup */}
          <div className='flex justify-center lg:justify-end'>
            <div className='w-full max-w-lg aspect-[4/3] rounded-2xl border border-slate-200/80 bg-white/80 backdrop-blur-md shadow-xl shadow-slate-200/50 flex flex-col overflow-hidden'>
              <div className='h-10 border-b border-slate-200/80 bg-slate-50/50 flex items-center px-4 justify-between'>
                <div className='flex gap-1.5'>
                  <span className='w-3 h-3 rounded-full bg-red-400/60' />
                  <span className='w-3 h-3 rounded-full bg-yellow-400/60' />
                  <span className='w-3 h-3 rounded-full bg-green-400/60' />
                </div>
                <span className='text-[11px] font-mono text-slate-400'>datalens_dashboard.py</span>
              </div>
              <div className='flex-1 p-6 flex flex-col justify-between font-mono text-xs'>
                <div className='space-y-2 text-slate-500'>
                  <p className='text-indigo-600 font-semibold'>&gt;&gt;&gt; import pandas as pd</p>
                  <p className='text-indigo-600 font-semibold'>&gt;&gt;&gt; df = pd.read_csv("metrics.csv")</p>
                  <p>&gt;&gt;&gt; df.clean_matrix_buffers()</p>
                  <p className='text-emerald-600 font-medium'>✓ Loaded 14,820 matrix items dynamically</p>
                </div>
                {/* Simulated Chart Box */}
                <div className='h-32 w-full bg-slate-50/80 border border-dashed border-slate-200 rounded-xl flex flex-col items-center justify-end p-3 relative group overflow-hidden'>
                  <div className='absolute inset-0 flex items-center justify-center text-[11px] text-slate-400 font-sans pointer-events-none'>
                    Dynamic Visualization Matrix
                  </div>
                  <div className='w-full flex items-end justify-between gap-2 h-16 pt-2 px-4 z-10'>
                    <div className='w-full bg-indigo-200 h-[40%] rounded-t-sm group-hover:h-[60%] transition-all duration-500' />
                    <div className='w-full bg-indigo-300 h-[75%] rounded-t-sm group-hover:h-[45%] transition-all duration-500' />
                    <div className='w-full bg-indigo-400 h-[50%] rounded-t-sm group-hover:h-[90%] transition-all duration-500' />
                    <div className='w-full bg-blue-500 h-[95%] rounded-t-sm group-hover:h-[70%] transition-all duration-500' />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* ─── HOW TO USE & VIDEO DEMO SECTION ─── */}
        <section id="how-to-use" className='space-y-12 scroll-mt-24'>
          <div className='text-center lg:text-left space-y-2'>
            <h2 className='text-3xl font-extrabold tracking-tight text-slate-900'>
              Operational Pipeline
            </h2>
            <p className='text-slate-500 max-w-md'>
              Transform raw structured data parameters into production-ready analytical records.
            </p>
          </div>

          <div className='grid grid-cols-1 lg:grid-cols-12 gap-8 items-stretch'>
            {/* Left Side: Step-by-Step Guide */}
            <div className='lg:col-span-5 flex flex-col justify-between gap-4'>
              {[
                { step: "1", title: "Convert Excel to CSV", desc: "Ensure your document sheets are parsed in unified comma-separated formatting." },
                { step: "2", title: "Upload CSV to DataLens", desc: "Dispatch files directly onto our secure file mapping node streams instantly." },
                { step: "3", title: "View Processed Data", desc: "Inspect cleaner structures organized directly via data frame configurations." },
                { step: "4", title: "Explore Interactive Charts", desc: "Manipulate metrics visually through customized React rendering pipelines." },
              ].map((item, idx) => (
                <div key={idx} className='p-4 rounded-xl border border-slate-200/80 bg-white/70 backdrop-blur-md shadow-sm flex items-start gap-4'>
                  <div className='w-7 h-7 rounded-lg bg-indigo-50 border border-indigo-100 text-indigo-600 font-bold text-xs flex items-center justify-center shrink-0 shadow-sm'>
                    {item.step}
                  </div>
                  <div>
                    <h3 className='font-bold text-slate-900 text-sm'>{item.title}</h3>
                    <p className='text-xs text-slate-500 mt-0.5'>{item.desc}</p>
                  </div>
                </div>
              ))}

              {/* AI Forecasting Highlight Box */}
              <div className='p-4 rounded-xl border border-emerald-200/80 bg-emerald-50/40 backdrop-blur-md shadow-sm flex items-start gap-4 relative overflow-hidden'>
                <div className='w-7 h-7 rounded-lg bg-emerald-100 border border-emerald-200 text-emerald-700 font-bold text-xs flex items-center justify-center shrink-0 shadow-sm'>
                  🤖
                </div>
                <div>
                  <h3 className='font-bold text-emerald-950 text-sm flex items-center gap-2'>
                    Get AI-Based Predictions
                  </h3>
                  <p className='text-xs text-emerald-800/80 mt-0.5'>
                    Deploy predictive machine learning trendlines over parsed historical points to calculate upcoming dataset behaviors.
                  </p>
                </div>
              </div>
            </div>

            {/* Right Side: Demo Video Component Frame */}
            <div className='lg:col-span-7'>
              <div className='w-full h-full min-h-[380px] rounded-2xl border border-slate-200 bg-white/80 backdrop-blur-md shadow-xl p-3 flex flex-col justify-between overflow-hidden group'>
                <div className='h-8 w-full border border-slate-200/60 bg-slate-50/80 rounded-lg flex items-center px-3 justify-between'>
                  <div className='flex gap-1.5 items-center'>
                    <span className='w-2 h-2 rounded-full bg-slate-300' />
                    <span className='w-2 h-2 rounded-full bg-slate-300' />
                    <span className='w-2 h-2 rounded-full bg-slate-300' />
                  </div>
                  <span className='text-[10px] font-mono text-slate-400 tracking-wider'>datalens_walkthrough.mp4</span>
                  <span className='w-2 h-2 rounded-full bg-indigo-500 animate-pulse' />
                </div>

                {/* Video Placeholder Container Area */}
                <div className='flex-1 mt-3 rounded-xl bg-slate-950 border border-slate-900 flex flex-col items-center justify-center p-6 text-center relative group'>
                  <div className='absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.01)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.01)_1px,transparent_1px)] bg-[size:30px_30px]' />
                  
                  {/* Visual UI Box Elements Inside Demo Graphic */}
                  <div className='relative z-10 space-y-4 max-w-sm'>
                    <div className='w-14 h-14 rounded-full bg-white/10 backdrop-blur-md border border-white/20 flex items-center justify-center text-white shadow-xl mx-auto group-hover:scale-105 transition-transform duration-300 cursor-pointer'>
                      <svg className='w-5 h-5 fill-current translate-x-0.5' viewBox='0 0 24 24'>
                        <path d='M8 5v14l11-7z' />
                      </svg>
                    </div>
                    <div className='space-y-1.5'>
                      <p className='text-sm font-semibold text-slate-200'>[ Video Demo Placeholder ]</p>
                      <p className='text-xs text-slate-400'>🎬 Add your project walkthrough video file here</p>
                      <p className='text-[11px] italic text-slate-500 pt-1'>
                        "Watch how DataLens transforms raw CSV data into meaningful insights in seconds."
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* ─── FEATURES GRID SECTION (BOXES) ─── */}
        <section className='space-y-12'>
          <div className='text-center space-y-3'>
            <h2 className='text-3xl font-extrabold tracking-tight text-slate-900'>
              Core Engineering Features
            </h2>
            <p className='text-slate-500 max-w-xl mx-auto'>
              Engineered cleanly from backend logic primitives to modular interface items.
            </p>
          </div>

          <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6'>
            {[
              { code: "📁", title: "CSV / Excel File Upload", text: "Secure file reception mapping into localized document buffers seamlessly." },
              { code: "🧹", title: "Data Cleaning via Pandas & NumPy", text: "High-performance processing handling matrix structural adjustments and missing records." },
              { code: "📊", title: "Dynamic React Charts", text: "Interactive data renders presenting responsive graphical analytical tracking points." },
              { code: "🤖", title: "AI-Powered Predictions", text: "Predict future data trends using historical datasets and machine learning layers." },
              { code: "⚡", title: "Fast Express REST APIs", text: "Robust server middleware logic managing dataset distribution limits." },
              { code: "🗄️", title: "MongoDB Persistence", text: "Flexible non-relational database management storing history records and parameters." },
            ].map((feat, index) => (
              <div key={index} className='group relative p-6 rounded-2xl border border-slate-200 bg-white/70 backdrop-blur-md shadow-sm transition-all duration-300 hover:shadow-md hover:-translate-y-0.5 hover:border-slate-300'>
                <div className='w-10 h-10 rounded-xl bg-slate-900 text-white flex items-center justify-center mb-4 font-bold text-sm shadow-sm'>
                  {feat.code}
                </div>
                <h3 className='text-base font-bold text-slate-900 group-hover:text-indigo-600 transition-colors'>
                  {feat.title}
                </h3>
                <p className='mt-1.5 text-xs text-slate-500 leading-relaxed'>
                  {feat.text}
                </p>
              </div>
            ))}
          </div>
        </section>

        {/* ─── ABOUT DEVELOPER SECTION (LIVE GITHUB API) ─── */}
        <section id="about-me" className='space-y-8 max-w-5xl mx-auto scroll-mt-24'>
          <div className='text-center space-y-2'>
            <h2 className='text-3xl font-extrabold tracking-tight text-slate-900'>About Me</h2>
            <p className='text-slate-500 max-w-xs mx-auto'>The architect behind DataLens design buffers.</p>
          </div>

          <div className='rounded-2xl border border-slate-200 bg-white/70 backdrop-blur-md p-6 lg:p-8 shadow-md grid grid-cols-1 md:grid-cols-12 gap-8 items-center relative'>
            
            {/* Left Column Profile Block */}
            <div className='md:col-span-4 flex flex-col items-center text-center space-y-3 border-b md:border-b-0 md:border-r border-slate-200/80 pb-6 md:pb-0 md:pr-6'>
              {loadingGithub ? (
                <div className='w-24 h-24 rounded-full bg-slate-200 animate-pulse border border-slate-300' />
              ) : (
                <img 
                  src={githubUser?.avatar_url || "https://github.com/identicons/johndoe.png"} 
                  alt='Developer Profile' 
                  className='w-24 h-24 rounded-full border border-slate-200 shadow-inner object-cover'
                />
              )}
              
              <div>
                <h3 className='font-bold text-slate-900 text-base'>
                  {loadingGithub ? "Syncing..." : (githubUser?.name || "Rohan Reddy")}
                </h3>
                <p className='text-xs font-mono text-indigo-600'>@{loadingGithub ? "user" : githubUser?.login}</p>
              </div>

              {/* Dynamic Live Aggregations from API */}
              {!loadingGithub && githubUser && (
                <div className='grid grid-cols-3 gap-2 w-full pt-2 border-t border-slate-100 font-mono text-[10px] text-slate-500 text-center'>
                  <div>
                    <p className='font-bold text-slate-800 text-xs'>{githubUser.public_repos}</p>
                    <p>Repos</p>
                  </div>
                  <div>
                    <p className='font-bold text-slate-800 text-xs'>{githubUser.followers}</p>
                    <p>Followers</p>
                  </div>
                  <div>
                    <p className='font-bold text-slate-800 text-xs'>{githubUser.following}</p>
                    <p>Following</p>
                  </div>
                </div>
              )}
            </div>

            {/* Right Column Narrative Bio Block */}
            <div className='md:col-span-8 space-y-4'>
              <p className='text-slate-600 leading-relaxed text-sm sm:text-base'>
                I’m a Computer Science graduate at St. Martin's Engineering College, passionate about backend architecture and API design. My work focuses on building systems that are fast, secure, and production-ready, along with building AI-powered prototypes under time pressure. I’m now deepening my expertise in Machine Learning, Deep Learning, and NLP to grow into AI Engineering.
              </p>
              
              {/* Profile Link Trigger */}
              <div className='pt-1 flex items-center justify-between flex-wrap gap-2'>
                {githubUser?.bio && (
                  <p className='text-[11px] italic font-mono text-slate-400 max-w-md truncate'>
                    Bio: "{githubUser.bio}"
                  </p>
                )}
                <a 
                  href='https://github.com/Rohanreddy-dev-106' 
                  target='_blank' 
                  rel='noreferrer' 
                  className='inline-flex items-center gap-2 text-xs font-medium bg-slate-900 text-white hover:bg-slate-800 px-4 h-9 rounded-lg transition-colors shadow-sm ml-auto'>
                  <svg className='w-3.5 h-3.5 fill-current' viewBox='0 0 24 24'>
                    <path d='M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z'/>
                  </svg>
                  Connect Profile
                </a>
              </div>
            </div>

          </div>
        </section>

      </main>

      {/* ─── 4. FOOTER ─── */}
      <div className='relative z-10 border-t border-slate-200/80 bg-white/60 backdrop-blur-md'>
        <Footer />
      </div>
    </div>
  );
}

export default LandingPage;