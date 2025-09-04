import React, { Suspense } from 'react'
import DashboardSubmitApplication from '@/features/dashboard/components/DashboardSubmitAppl'

export default function SubmitApplicationContent() {
  return(
    <Suspense fallback={<div>Loading...</div>}>
      <DashboardSubmitApplication />
    </Suspense>
  )
}
