import { getSessionUser } from '@/action/User'
import { ApplicationsChart } from '@/features/dashboard/components/ApplicationsChart'
import DashboardStatsWidget from '@/features/dashboard/components/DashboardStatsWidget'
import NewApplications from '@/features/dashboard/components/NewApplications'
import { RenewalsChart } from '@/features/dashboard/components/RenewalsChart'
import { redirect } from 'next/navigation'
import React from 'react'

export default async function page() {
  const { user } = await getSessionUser()
  if (!user || user.role !== "ADMIN") {
    redirect('/client-dashboard')
  }
  return (
    <main className='px-4 grid gap-8'>
      <DashboardStatsWidget />
      <div className='grid lg:grid-cols-2 gap-6'>
        <ApplicationsChart />
        <RenewalsChart />
      </div>
      <NewApplications />
    </main>
  )
}
