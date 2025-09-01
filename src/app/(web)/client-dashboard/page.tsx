import { fetchCompanyByUserId } from "@/action/Company";
import {  fetchProfileByUserId } from "@/action/Profile";
import { getSessionUser } from "@/action/User";
import { ClientDashboardContent } from "@/features/dashboard/components/ClientDashboardContent";
import { redirect } from "next/navigation";
import { Suspense } from "react";

export default async function ClientDashboard() {
  const { user } = await getSessionUser()
  if (!user) {
    console.error("User not found in session")
    redirect('/auth/sign-in')
  
  }
  const companyRes = await fetchCompanyByUserId(user.id, {id: true})
  if(!companyRes) {
    console.error("no company ID found")
  }
  
  const profileRes = await fetchProfileByUserId(user.id, {id: true})
  if(!companyRes) {
    console.error("no company ID found")
  }
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <ClientDashboardContent userId={user?.id} 
      companyId={companyRes.length>0? companyRes[0].id: ''} 
      profileId={profileRes?.id ?? ''} 
      />
    </Suspense>
  )
}
