/** @format */

import { Separator } from "@/components/ui/separator";

export default function Footer() {
  return (
    <footer className='w-full mt-10'>
      <Separator />

      <div className='mx-auto flex max-w-7xl flex-col items-center justify-between px-6 py-6 text-sm text-muted-foreground sm:flex-row'>
        <p>© {new Date().getFullYear()} Auth App. All rights reserved.</p>

        <div className='mt-2 flex gap-4 sm:mt-0'>
          <a href='#' className='hover:text-primary'>
            Privacy
          </a>
          <a href='#' className='hover:text-primary'>
            Terms
          </a>
          <a href='#' className='hover:text-primary'>
            Contact
          </a>
        </div>
      </div>
    </footer>
  );
}
