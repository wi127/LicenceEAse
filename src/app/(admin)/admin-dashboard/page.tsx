import { getSessionUser } from '@/action/User'
import { ApplicationsChart } from '@/features/dashboard/components/ApplicationsChart'
import DashboardStatsWidget from '@/features/dashboard/components/DashboardStatsWidget'
import NewApplications from '@/features/dashboard/components/NewApplications'
import { RenewalsChart } from '@/features/dashboard/components/RenewalsChart'
import { redirect } from 'next/navigation'
import React from 'react'

interface AdminDashboardProps {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>
}

export default async function page(props: AdminDashboardProps) {
  const searchParams = await props.searchParams;
  const { user } = await getSessionUser()
  if (!user || user.role !== "ADMIN") {
    redirect('/client-dashboard')
  }

  const status = typeof searchParams.status === 'string' ? searchParams.status : undefined
  const page = typeof searchParams.page === 'string' ? parseInt(searchParams.page) : 1

  return (
    <main className='px-4 grid gap-8'>
      <DashboardStatsWidget activeStatus={status} />
      {status && <NewApplications filterStatus={status} page={page} />}
      <div className='grid lg:grid-cols-2 gap-6'>
        <ApplicationsChart />
        {/* <RenewalsChart /> */}
      </div>
    </main>
  )
}
