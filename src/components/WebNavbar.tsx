import { Lock, KeyRound } from 'lucide-react'
import Image from 'next/image'
import Link from 'next/link'
import React from 'react'
import ApplicationLogo from './ApplicationLogo'
import { Button, buttonVariants } from './ui/button'

export default function WebNavbar() {
  return (
    <nav>
      <div className='container py-4 flex justify-between items-center'>
        <ApplicationLogo />
        <div className='flex items-center gap-4'>
          <Link href={'/check-license-validity'} className={'font-medium text-sm hover:underline p-2'}>Check validity</Link>
          <Link href={'/register'} className='px-3 py-2 rounded-md text-sm inline-flex gap-2 items-center bg-primary/10 text-primary font-medium tracking-wide' ><KeyRound className="size-4" /> Register </Link>
          <Link href={'/login'} className='px-3 py-2 rounded-md text-sm inline-flex gap-2 items-center bg-primary text-primary-foreground font-medium tracking-wide'><Lock className="size-4" /> Login</Link>
        </div>
      </div>
    </nav>
  )
}
