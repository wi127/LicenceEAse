import React from 'react'
import DashboardLicense from '@/features/dashboard/components/DashboardLicense'
import { fetchCompanyByUserId } from "@/action/Company";
import { fetchClientApplications as getClientApps } from "@/action/Application";
import { getSessionUser as getUser } from "@/action/User";
import { redirect } from "next/navigation";

export default async function ApplyLicense() {
  const { user } = await getUser()
  if (!user) redirect('/auth/sign-in')

  const companyRes = await fetchCompanyByUserId(user.id, { id: true })
  const companyId = companyRes && companyRes.length > 0 ? companyRes[0].id : '';

  let applications: any[] = [];
  if (companyId) {
    const apps = await getClientApps(companyId);
    applications = apps.map(app => {
      let status = 'pending';
      const docs = app.LicenseApplication;
      if (docs.length > 0) {
        const allApproved = docs.every(d => d.status === 'APPROVED');
        const anyRejected = docs.some(d => d.status === 'REJECTED');

        if (anyRejected) status = 'rejected';
        else if (allApproved) status = 'approved';
      }
      return {
        id: app.id,
        license_type: app.name,
        status: status,
      };
    });
  }

  return (
    <DashboardLicense initialApplications={applications}/>
  )
}
