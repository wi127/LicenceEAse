import AccountEditForm from '@/features/accounts/components/AccountEditForm'
import { authOptions } from '@/common/authOptions'
import prisma from '@/lib/prisma'
import { CompanySelect } from '@/lib/types/company'
import { ProfileSelect } from '@/lib/types/profile'
import { getServerSession } from 'next-auth'
import { redirect } from 'next/navigation'
import React from 'react'

export default async function page() {
  const session = await getServerSession(authOptions)

  if (!session || !session.user) {
    redirect('/auth/sign-in')
  }

  const [user, profile, company] = await Promise.all([
    prisma.user.findUnique({
      where: { id: session.user.id },
      select: {
        id: true,
        email: true,
        image: true,
        role: true
      }
    }),
    prisma.profile.findUnique({
      where: { userId: session.user.id },
      select: ProfileSelect
    }),
    prisma.company.findFirst({
      where: { operatorId: session.user.id },
      select: CompanySelect
    })
  ])

  if (!user) {
    return <div>User not found</div>
  }

  return (
    <main className='max-w-screen-lg'>
      <AccountEditForm
        user={{
          id: user.id,
          email: user.email,
          image: user.image,
          role: user.role
        }}
        profile={profile}
        company={company}
      />
    </main>
  )
}
