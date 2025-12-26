"use client"

import { LogOut, Settings, User } from 'lucide-react'
import Link from 'next/link'
import React from 'react'
import DarkModeToggle from '@/components/ui/DarkModeToggle'
import { signOut } from 'next-auth/react'
import { TProfileSelect } from '@/lib/types/profile'

interface DashboardNavbarProps {
  profile: TProfileSelect | null
}

export default function DashboardNavbar({ profile }: DashboardNavbarProps) {

  const handleLogout = async () => {
    await signOut({ callbackUrl: "/auth/sign-in" })
  }
  return (
    <nav className='bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700'>
      <div className='px-4 flex justify-between py-6'>
        <div></div>
        <div className='flex items-center gap-3'>
          <DarkModeToggle />
          <div className='relative group'>
            <button className='size-10 border-2 rounded-full grid place-content-center border-primary text-primary cursor-pointer peer'>
              <User className='size-6' />
            </button>
            <div className='absolute bg-white dark:bg-gray-800 py-2 rounded-md shadow-lg right-0 top-12 whitespace-pre text-sm w-44 opacity-0 transition-all group-focus-within:opacity-100 pointer-events-none group-focus-within:pointer-events-auto border dark:border-gray-700'>
              <Link href={'/admin-dashboard/profile'} className='flex items-center gap-2 justify-between font-medium hover:bg-muted dark:hover:bg-gray-700 transition-all px-4 py-2 text-gray-900 dark:text-gray-100'>{profile?.fullname} <Settings className='size-4' /></Link>
              <button className='flex items-center gap-2 justify-between font-medium hover:bg-muted dark:hover:bg-gray-700 transition-all px-4 py-2 text-gray-900 dark:text-gray-100' onClick={handleLogout}>Logout <LogOut className='size-4' /></button>
            </div>
          </div>
        </div>
      </div>
    </nav>
  )
}
