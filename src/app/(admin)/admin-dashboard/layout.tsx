import DashboardNavbar from '@/features/dashboard/components/DashboardNavbar'
import DashboardSidebar from '@/features/dashboard/components/DashboardSidebar'
import React, { PropsWithChildren } from 'react'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/common/authOptions'
import prisma from '@/lib/prisma'
import { ProfileSelect } from '@/lib/types/profile'
import { redirect } from 'next/navigation'

export default async function layout({ children }: PropsWithChildren) {
  const session = await getServerSession(authOptions)

  if (!session || !session.user) {
    redirect('/auth/sign-in')
  }

  const profile = await prisma.profile.findUnique({
    where: { userId: session.user.id },
    select: ProfileSelect
  })

  return (
    <div className='grid grid-cols-[256px,1fr] items-start bg-background text-foreground min-h-screen'>
      <DashboardSidebar />
      <div className='h-dvh flex flex-col bg-gray-50 dark:bg-gray-900'>
        <DashboardNavbar profile={profile} />
        <div className='flex-grow overflow-y-auto pb-12'>
          {children}
        </div>
      </div>
    </div>
  )
}
