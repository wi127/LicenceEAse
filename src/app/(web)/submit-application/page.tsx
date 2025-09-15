import React, { Suspense } from 'react'
import DashboardSubmitApplication from '@/features/dashboard/components/DashboardSubmitAppl'
import { getSessionUser } from '@/action/User'
import { redirect } from 'next/navigation'
import { fetchCompanyByUserId } from '@/action/Company'
import { getApplicationByCompanyId } from '@/action/Application'

export default async function SubmitApplicationContent() {

  const { user } = await getSessionUser()
    if (!user) {
      console.error("User not found in session")
      redirect('/auth/sign-in')
    }

    const companyRes = await fetchCompanyByUserId(user.id, {id: true})
      if(!companyRes) {
        console.error("no company ID found")
      }
      
    const companyId = companyRes.length > 0 ? companyRes[0].id : ''

    const application = await getApplicationByCompanyId(companyId, { id: true })
      if(!application) {
        console.error("no application ID found")
      }
  return(
    <Suspense fallback={<div>Loading...</div>}>
      <DashboardSubmitApplication userId={user.id} companyId={companyId} applicationId={application[0]?.id} />
    </Suspense>
  )
}
