import { buttonVariants } from '@/components/ui/button'
import AccountEditForm from '@/features/accounts/components/AccountEditForm'
import ProfileEditForm from '@/features/accounts/components/ProfileEditForm'
import { getSessionUser } from '@/action/User'
import { fetchProfileByUserId } from '@/action/Profile'
import { fetchCompanyByUserId } from '@/action/Company'
import { ProfileSelect } from '@/lib/types/profile'
import { CompanySelect } from '@/lib/types/company'
import Link from 'next/link'
import React from 'react'
import { redirect } from 'next/navigation'

const validTabs = ['account', 'profile'] as const
type ValidTab = typeof validTabs[number]

interface Props {
  searchParams: {
    tab: string
  }
}

export default async function page({ searchParams }: Props) {

  const current = validTabs.includes(searchParams.tab as any) ? searchParams.tab as ValidTab : "account" as ValidTab

  const { user } = await getSessionUser()

  if (!user) {
    redirect('/auth/sign-in')
  }

  const profile = await fetchProfileByUserId(user.id, ProfileSelect)
  const companies = await fetchCompanyByUserId(user.id, CompanySelect)
  const company = companies.length > 0 ? companies[0] : null

  return (
    <div className='container grid grid-cols-[200px,1fr] items-start py-12'>
      <div className='grid gap-2 text-sm lg:pr-4'>
        <Link href={'/profile?tab=account'} className={`p-2 rounded-md font-medium tracking-wide ${current == 'account' ? 'bg-primary text-primary-foreground' : ''}`}>Account</Link>
        <Link href={'/profile?tab=profile'} className={`p-2 rounded-md font-medium tracking-wide ${current == 'profile' ? 'bg-primary text-primary-foreground' : ''}`}>Profile</Link>
      </div>
      <main className='lg:pl-8 lg:border-l-2'>
        <div>
          {current === 'account' && <AccountEditForm user={user} profile={profile} company={company} />}
          {current === 'profile' && <ProfileEditForm />}
        </div>
      </main>
    </div>
  )
}
