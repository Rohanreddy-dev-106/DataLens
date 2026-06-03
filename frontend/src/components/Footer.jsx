import React from "react";

export default function Footer() {
  return (
    <footer className='w-full mx-auto max-w-7xl px-6 py-6'>
      <div className='flex flex-col items-center justify-between gap-4 text-xs sm:text-sm text-slate-500 sm:flex-row'>
        
        {/* Left Side: Brand Attribution */}
        <p className='text-center sm:text-left'>
          © {new Date().getFullYear()} DataLens. Built for production-ready analytics.
        </p>

        {/* Right Side: Shared Links & Social Matrix */}
        <div className='flex flex-col items-center gap-4 sm:flex-row sm:gap-6'>
          
          {/* Operational & Compliance Links */}
          <div className='flex gap-4 border-b sm:border-b-0 sm:border-r border-slate-200 pb-2 sm:pb-0 sm:pr-6'>
            <a 
              href='#' 
              className='hover:text-slate-900 transition-colors duration-200'
            >
              Privacy Policy
            </a>
            <a 
              href='#' 
              className='hover:text-slate-900 transition-colors duration-200'
            >
              Terms
            </a>
          </div>

          {/* Social Profiles & Portfolio Vectors */}
          <div className='flex items-center gap-4'>
            {/* Portfolio Link */}
            <a
              href='https://rohanreddy.vercel.app/'
              target='_blank'
              rel='noreferrer'
              className='hover:text-indigo-600 transition-colors duration-200'
              title='Portfolio'
            >
              <svg className='w-4 h-4 stroke-current fill-none' viewBox='0 0 24 24' strokeWidth='2' strokeLinecap='round' strokeLinejoin='round'>
                <circle cx='12' cy='12' r='10' />
                <line x1='2' y1='12' x2='22' y2='12' />
                <path d='M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z' />
              </svg>
            </a>

            {/* LinkedIn Link */}
            <a
              href='https://www.linkedin.com/in/sairohanreddy106/'
              target='_blank'
              rel='noreferrer'
              className='hover:text-indigo-600 transition-colors duration-200'
              title='LinkedIn'
            >
              <svg className='w-4 h-4 fill-current' viewBox='0 0 24 24'>
                <path d='M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z' />
              </svg>
            </a>

            {/* Twitter / X Link */}
            <a
              href='https://x.com/rohanreddy106'
              target='_blank'
              rel='noreferrer'
              className='hover:text-indigo-600 transition-colors duration-200'
              title='Twitter / X'
            >
              <svg className='w-3.5 h-3.5 fill-current' viewBox='0 0 24 24'>
                <path d='M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z' />
              </svg>
            </a>
          </div>

        </div>
      </div>
    </footer>
  );
}

