import { fetchCompanyByUserId } from "@/action/Company";
import { fetchProfileByUserId } from "@/action/Profile";
import { fetchClientApplications } from "@/action/Application";
import { ClientDashboardContent } from "@/features/dashboard/components/ClientDashboardContent";
import { redirect } from "next/navigation";
import { Suspense } from "react";
import { fetchClientApplications as getClientApps } from "@/action/Application";
import { getSessionUser as getUser } from "@/action/User";

export default async function ClientDashboard() {
  const { user } = await getUser()
  if (!user) {
    console.error("User not found in session")
    redirect('/auth/sign-in')
  }

  const companyRes = await fetchCompanyByUserId(user.id, { id: true })
  const companyId = companyRes && companyRes.length > 0 ? companyRes[0].id : '';

  const profileRes = await fetchProfileByUserId(user.id, { id: true })
  const profileId = profileRes?.id ?? '';

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
        submitted_at: app.createdAt.toISOString(),
        status: status,
        description: app.description,
        applicant_name: user?.username || 'N/A',
        company: app.company.name,
        files: app.LicenseApplication.map(la => ({
          type: la.documentType.name,
          original_filename: la.documentType.name
        }))
      };
    });
  }

  return (
    <Suspense fallback={<div>Loading...</div>}>
      <ClientDashboardContent
        userId={user.id}
        companyId={companyId}
        profileId={profileId}
        initialApplications={applications}
      />
    </Suspense>
  )
}
