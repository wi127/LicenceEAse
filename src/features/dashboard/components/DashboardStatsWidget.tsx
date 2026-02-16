import { getDashboardStats } from '@/action/chartDashboard'
import { Card, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { CheckCheck, Loader2, X } from 'lucide-react'
import React, { ReactNode } from 'react'

const ICONS: Record<string, ReactNode> = {
  approved: <CheckCheck className='size-5' strokeWidth={4} />,
  rejected: <X className='size-5' strokeWidth={4} />,
  pending: <Loader2 className='size-5' strokeWidth={4} />
}

import Link from 'next/link'

interface DashboardStatsWidgetProps {
  activeStatus?: string
}

export default async function DashboardStatsWidget({ activeStatus }: DashboardStatsWidgetProps) {
  const stats = await getDashboardStats()

  return (
    <div className='grid grid-cols-[repeat(auto-fit,minmax(250px,1fr))] gap-8'>
      {Object.keys(stats).map(status => {
        const isActive = activeStatus?.toLowerCase() === status.toLowerCase()
        // If clicking the active one, clear the filter (href to base path)
        // Otherwise, filter by this status
        // Assuming the base path is /admin-dashboard.
        // We can use ?status= for filter and ? for clear.
        // Actually, let's just toggle. If active, go to ?, else ?status=
        const href = isActive ? '/admin-dashboard' : `/admin-dashboard?status=${status.toUpperCase()}`

        return (
          <Link href={href} key={status} className='block group transition-all'>
            <Card className={`transition-all duration-200 hover:shadow-md ${isActive ? 'ring-2 ring-primary border-primary' : 'hover:border-primary/50'}`}>
              <CardHeader>
                <div className='flex justify-between'>
                  <div className='grid gap-1'>
                    <CardDescription className='font-medium capitalize group-hover:text-primary transition-colors'>{status}</CardDescription>
                    <CardTitle className='text-2xl'>{(stats as any)[status]}</CardTitle>
                  </div>
                  <div className={`text-white dark:text-gray-900 grid place-content-center size-12 self-center rounded-xl transition-transform group-hover:scale-110 ${status === 'approved' ? 'bg-green-500 dark:bg-green-400' : status === 'rejected' ? 'bg-red-500 dark:bg-red-400' : 'bg-gray-500 dark:bg-gray-400'}`}>
                    {ICONS[status]}
                  </div>
                </div>
              </CardHeader>
            </Card>
          </Link>
        )
      })}
    </div>
  )
}
