import { fetchCompanyByUserId } from "@/action/Company";
import { fetchProfileByUserId } from "@/action/Profile";
import { fetchClientApplications } from "@/action/Application";
import { ClientDashboardContent } from "@/features/dashboard/components/ClientDashboardContent";
import { redirect } from "next/navigation";
import { Suspense } from "react";
import { fetchClientApplications as getClientApps } from "@/action/Application";
import { getSessionUser as getUser } from "@/action/User";

import { fetchNotifications } from '@/action/Notification'

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
  let alerts: any[] = [];

  // Fetch System Notifications
  const { data: systemNotifications } = await fetchNotifications({
    id: true,
    message: true,
    createdAt: true,
    read: true,
    type: true
  }, { userId: user.id }, 10);

  if (systemNotifications) {
    alerts = [...alerts, ...systemNotifications.map(n => ({
      id: n.id,
      type: 'system',
      title: 'System Notification',
      message: n.message,
      date: n.createdAt.toISOString(),
      read: n.read
    }))];
  }

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

      // Check for pending payment
      // Logic: If application fee > 0 and no successful payment exists
      const paymentStatus = app.Payment?.status;
      const needsPayment = app.applicationFee > 0 && paymentStatus !== 'SUCCESS' && status === 'pending';

      if (needsPayment) {
        alerts.push({
          id: `payment-${app.id}`,
          type: 'payment',
          title: 'Pending Payment',
          message: `Action Required: Payment of $${app.applicationFee} for ${app.name} is pending.`,
          date: app.createdAt.toISOString(),
          actionUrl: `/client-dashboard/payment?applicationId=${app.id}&licenseType=${encodeURIComponent(app.name)}&fees=${app.applicationFee}`,
          metadata: {
            applicationId: app.id,
            licenseType: app.name,
            fees: app.applicationFee
          }
        });
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

  // Sort alerts by date desc
  alerts.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());

  return (
    <Suspense fallback={<div>Loading...</div>}>
      <ClientDashboardContent
        userId={user.id}
        companyId={companyId}
        profileId={profileId}
        initialApplications={applications}
        initialAlerts={alerts}
      />
    </Suspense>
  )
}
