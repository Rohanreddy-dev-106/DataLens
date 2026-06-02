/** @format */

import { Button } from "@/components/ui/button";

export default function Navbar() {
  return (
    <nav className='fixed top-0 left-0 z-50 w-full border-b bg-background'>
      <div className='mx-auto flex h-14 max-w-7xl items-center justify-between px-4'>
        {/* Left: Logo */}
        <div className='text-lg font-semibold'>MyApp</div>

        {/* Center: Links */}
        <div className='hidden gap-6 md:flex'>
          <a
            href='#home'
            className='text-sm font-medium text-muted-foreground hover:text-foreground'>
            Home
          </a>
          <a
            href='#about'
            className='text-sm font-medium text-muted-foreground hover:text-foreground'>
            About
          </a>
          <a
            href='#how'
            className='text-sm font-medium text-muted-foreground hover:text-foreground'>
            How to Use
          </a>
        </div>

        {/* Right: Actions */}
        <div className='flex items-center gap-3'>
          <Button variant='ghost' asChild>
            <a href='#login'>Login</a>
          </Button>
          <Button asChild>
            <a href='#signup'>Sign up</a>
          </Button>
        </div>
      </div>
    </nav>
  );
}
