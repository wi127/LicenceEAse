"use client";

import { fetchCompanyByUserId } from "@/action/Company";
import { fetchProfileByUserId, updateProfile } from "@/action/Profile";
import ClientDashboardLayout from "@/features/client/components/ClientDashboardLayout";
import ProfileTab, { DEFAULT_COMPANY_INFO, DEFAULT_USER_PROFILE } from "@/features/client/components/ProfileTab";
import SettingsTab from "@/features/client/components/SettingsTab";
import { CompanySelect, TCompanySelect } from "@/lib/types/company";
import { ProfileSelect, TProfileSelect } from "@/lib/types/profile";
import { Prisma } from "@prisma/client";
import { signOut } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { ClipboardList, Clock, CheckCircle2, XCircle, Plus, ScrollText, Bell, BellRing, Monitor, Building2, Globe, DollarSign, X, ChevronRight, Clock3, ShieldCheck, ArrowRight, FileText, Download } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Badge } from "@/components/ui/badge";


export function ClientDashboardContent({ userId, companyId, profileId, initialApplications = [], initialAlerts = [] }: { userId: string, companyId: string, profileId: string, initialApplications?: any[], initialAlerts?: any[] }) {
  const router = useRouter()

  const [tab, setTab] = useState('dashboard')
  const [applications, setApplications] = useState<any[]>(initialApplications)
  const [alerts, setAlerts] = useState<any[]>(initialAlerts)
  const [message, setMessage] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [darkMode, setDarkMode] = useState(false)
  const [language, setLanguage] = useState('en')
  const [userProfile, setUserProfile] = useState<TProfileSelect | null>(null)
  const [companyInfo, setCompanyInfo] = useState<TCompanySelect | null>(null)
  const [loading, setLoading] = useState(false)
  const [selectedFilterCategory, setSelectedFilterCategory] = useState('all')
  const [notifications, setNotifications] = useState({
    email: true,
    sms: false,
    push: true
  })
  const [selectedApplication, setSelectedApplication] = useState<any | null>(null)
  const [isDetailsModalOpen, setIsDetailsModalOpen] = useState(false)

  const toggleTheme = () => setDarkMode(!darkMode)

  const handleUpdateProfile = async (updatedProfile: any) => {
    try {
      if (!userProfile) return;

      const data: Prisma.ProfileUpdateInput = {
        fullname: updatedProfile.fullname,
        phone: updatedProfile.phone,
        address: updatedProfile.address,

        user: {
          update: {
            email: updatedProfile.user.email,
            username: updatedProfile.user.username,
            image: updatedProfile.user.image,
          },
        },
      };

      const res = await updateProfile(profileId, data);

      if (res) {
        setUserProfile({
          ...res,
          user: userProfile?.user || { id: res.userId, username: userProfile.user.username }
        })
      }

      if (!res) {
        throw new Error('Failed to update profile information')
      }
    } catch (error) {
      console.error("Error updating profile:", error)
    }
  }

  const handleNotificationChange = (type: string, enabled: boolean) => {
    setNotifications(prev => ({ ...prev, [type]: enabled }))
  }

  const handleLogout = async () => {
    await signOut({ callbackUrl: "/auth/sign-in" })
  }

  useEffect(() => {
    setLoading(true)
    if (userId) {
      const profile = async () => {
        const res = await fetchProfileByUserId(userId, ProfileSelect);
        if (res) {
          setUserProfile(res);
        }
      };

      const company = async () => {
        const res = await fetchCompanyByUserId(userId, CompanySelect);
        if (res && res.length > 0) {
          setCompanyInfo(res[0]);
        }
      };

      profile();
      company();
    }
    setLoading(false);
  }, [userId]);


  return (
    <ClientDashboardLayout
      activeTab={tab}
      loading={loading}
      onTabChange={setTab}
      onLogout={handleLogout}
      darkMode={darkMode}
      user={userProfile?.user || null}
      notificationCount={alerts.length}
    >

      {tab === 'dashboard' && (
        <div className='px-4 sm:px-6 py-8 max-w-7xl mx-auto'>
          {/* Header Section */}
          <div className='mb-10'>
            <div className='inline-flex items-center px-3 py-1 rounded-full bg-blue-50 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 text-[10px] font-bold uppercase tracking-wider mb-2'>
              Account Overview
            </div>
            <h2 className='text-4xl font-black text-gray-900 dark:text-white tracking-tight'>
              Welcome Back, <span className='text-blue-600 dark:text-blue-400'>{userProfile?.user.username || 'User'}</span>
            </h2>
            <p className='text-gray-500 dark:text-gray-400 text-sm mt-2'>Manage your applications, track status updates, and access licensing services.</p>
          </div>

          {/* Stats Grid */}
          <div className='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-12'>
            <div className='bg-white dark:bg-gray-800 rounded-[2.5rem] border border-gray-100 dark:border-gray-700 p-8 shadow-sm hover:shadow-xl transition-all duration-300 group'>
              <div className='flex items-center justify-between mb-4'>
                <div className='w-14 h-14 rounded-2xl bg-blue-50 dark:bg-blue-900/30 text-blue-600 flex items-center justify-center group-hover:scale-110 transition-transform'>
                  <ClipboardList className='w-7 h-7' />
                </div>
                <div className='text-right'>
                  <p className='text-[10px] text-gray-400 font-bold uppercase tracking-widest'>Total</p>
                  <p className='text-2xl font-black text-gray-900 dark:text-white'>{applications.length}</p>
                </div>
              </div>
              <p className='text-xs font-bold text-gray-500 uppercase tracking-tighter'>Applications</p>
            </div>

            <div className='bg-white dark:bg-gray-800 rounded-[2.5rem] border border-amber-50 dark:border-amber-900/20 p-8 shadow-sm hover:shadow-xl transition-all duration-300 group'>
              <div className='flex items-center justify-between mb-4'>
                <div className='w-14 h-14 rounded-2xl bg-amber-50 dark:bg-amber-900/30 text-amber-600 flex items-center justify-center group-hover:scale-110 transition-transform'>
                  <Clock className='w-7 h-7' />
                </div>
                <div className='text-right'>
                  <p className='text-[10px] text-gray-400 font-bold uppercase tracking-widest'>Pending</p>
                  <p className='text-2xl font-black text-amber-600'>{applications.filter((app: any) => app.status === 'pending').length}</p>
                </div>
              </div>
              <p className='text-xs font-bold text-gray-500 uppercase tracking-tighter'>Reviewing</p>
            </div>

            <div className='bg-white dark:bg-gray-800 rounded-[2.5rem] border border-green-50 dark:border-green-900/20 p-8 shadow-sm hover:shadow-xl transition-all duration-300 group'>
              <div className='flex items-center justify-between mb-4'>
                <div className='w-14 h-14 rounded-2xl bg-green-50 dark:bg-green-900/30 text-green-600 flex items-center justify-center group-hover:scale-110 transition-transform'>
                  <CheckCircle2 className='w-7 h-7' />
                </div>
                <div className='text-right'>
                  <p className='text-[10px] text-gray-400 font-bold uppercase tracking-widest'>Approved</p>
                  <p className='text-2xl font-black text-green-600'>{applications.filter((app: any) => app.status === 'approved').length}</p>
                </div>
              </div>
              <p className='text-xs font-bold text-gray-500 uppercase tracking-tighter'>Active Licenses</p>
            </div>

            <div className='bg-white dark:bg-gray-800 rounded-[2.5rem] border border-red-50 dark:border-red-900/20 p-8 shadow-sm hover:shadow-xl transition-all duration-300 group'>
              <div className='flex items-center justify-between mb-4'>
                <div className='w-14 h-14 rounded-2xl bg-red-50 dark:bg-red-900/30 text-red-600 flex items-center justify-center group-hover:scale-110 transition-transform'>
                  <XCircle className='w-7 h-7' />
                </div>
                <div className='text-right'>
                  <p className='text-[10px] text-gray-400 font-bold uppercase tracking-widest'>Rejected</p>
                  <p className='text-2xl font-black text-red-600'>{applications.filter((app: any) => app.status === 'rejected').length}</p>
                </div>
              </div>
              <p className='text-xs font-bold text-gray-500 uppercase tracking-tighter'>Requires Action</p>
            </div>
          </div>

          <div className='mb-6'>
            <h3 className='text-xl font-bold text-gray-900 dark:text-white mb-6'>Quick Actions</h3>
            <div className='grid grid-cols-1 md:grid-cols-3 gap-6'>
              <button
                onClick={() => router.push('/apply-license')}
                className='bg-blue-600 text-white p-8 rounded-[2.2rem] hover:bg-blue-700 transition-all duration-300 flex flex-col items-start gap-4 shadow-lg shadow-blue-500/20 group'
              >
                <div className='w-12 h-12 bg-white/20 rounded-xl flex items-center justify-center group-hover:rotate-12 transition-transform'>
                  <Plus className='w-6 h-6' />
                </div>
                <div className='text-left'>
                  <h4 className='font-bold text-lg'>New Application</h4>
                  <p className='text-blue-100 text-xs mt-1'>Start a fresh license request </p>
                </div>
              </button>

              <button
                onClick={() => setTab('licenses')}
                className='bg-white dark:bg-gray-800 border border-gray-100 dark:border-gray-700 p-8 rounded-[2.2rem] hover:border-blue-200 dark:hover:border-blue-800 transition-all duration-300 flex flex-col items-start gap-4 shadow-sm hover:shadow-md group'
              >
                <div className='w-12 h-12 bg-blue-50 dark:bg-blue-900/30 text-blue-600 rounded-xl flex items-center justify-center group-hover:rotate-12 transition-transform'>
                  <ScrollText className='w-6 h-6' />
                </div>
                <div className='text-left'>
                  <h4 className='font-bold text-lg text-gray-900 dark:text-white'>View Licenses</h4>
                  <p className='text-gray-500 dark:text-gray-400 text-xs mt-1'>Browse through active services</p>
                </div>
              </button>

              <button
                onClick={() => setTab('notifications')}
                className='bg-white dark:bg-gray-800 border border-gray-100 dark:border-gray-700 p-8 rounded-[2.2rem] hover:border-blue-200 dark:hover:border-blue-800 transition-all duration-300 flex flex-col items-start gap-4 shadow-sm hover:shadow-md relative group'
              >
                <div className='w-12 h-12 bg-blue-50 dark:bg-blue-900/30 text-blue-600 rounded-xl flex items-center justify-center group-hover:rotate-12 transition-transform'>
                  <Bell className='w-6 h-6' />
                </div>
                <div className='text-left'>
                  <h4 className='font-bold text-lg text-gray-900 dark:text-white'>Recent Alerts</h4>
                  <p className='text-gray-500 dark:text-gray-400 text-xs mt-1'>Check your latest notifications</p>
                </div>
                {alerts.length > 0 && (
                  <span className="absolute top-8 right-8 bg-red-600 text-white text-[10px] font-black rounded-full w-6 h-6 flex items-center justify-center shadow-lg shadow-red-500/30">
                    {alerts.length}
                  </span>
                )}
              </button>
            </div>
          </div>
        </div>
      )}

      {tab === 'notifications' && (
        <div className='px-4 sm:px-6 py-8 max-w-7xl mx-auto'>
          <div className='mb-10'>
            <h2 className='text-3xl font-black text-gray-900 dark:text-white tracking-tight'>
              Notifications & <span className='text-blue-600 dark:text-blue-400'>Alerts</span>
            </h2>
            <p className='text-gray-500 dark:text-gray-400 text-sm mt-2'>Stay updated with your latest application activities and system updates.</p>
          </div>

          {alerts.length === 0 ? (
            <div className='bg-white dark:bg-gray-800 rounded-[2.5rem] border border-gray-100 dark:border-gray-700 p-20 text-center shadow-sm'>
              <div className='inline-flex items-center justify-center w-20 h-20 rounded-3xl bg-blue-50 dark:bg-blue-900/30 text-blue-600 mb-6'>
                <BellRing className='w-10 h-10' />
              </div>
              <h3 className='text-xl font-bold text-gray-900 dark:text-white mb-2'>All Caught Up!</h3>
              <p className='text-gray-500 dark:text-gray-400 max-w-sm mx-auto'>You have no new notifications at the moment.</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 gap-6">
              {alerts.map((alert: any) => (
                <div key={alert.id} className={`bg-white dark:bg-gray-800 rounded-[2.2rem] border transition-all duration-300 p-8 shadow-sm hover:shadow-md flex flex-col sm:flex-row sm:items-center justify-between gap-6 ${
                  alert.type === 'payment' ? 'border-amber-100 bg-amber-50/20' : 
                  alert.type === 'rejection' ? 'border-red-100 bg-red-50/20' : 
                  'border-gray-100 dark:border-gray-700'
                }`}>
                  <div className="flex items-start gap-6">
                    <div className={`w-14 h-14 rounded-2xl flex-shrink-0 flex items-center justify-center shadow-sm ${
                      alert.type === 'payment' ? 'bg-amber-100 text-amber-600' : 
                      alert.type === 'rejection' ? 'bg-red-100 text-red-600' : 
                      'bg-blue-50 dark:bg-blue-900/30 text-blue-600'
                    }`}>
                      {alert.type === 'payment' ? (
                        <DollarSign className='w-7 h-7' />
                      ) : alert.type === 'rejection' ? (
                        <X className='w-7 h-7' />
                      ) : (
                        <Bell className='w-7 h-7' />
                      )}
                    </div>
                    <div>
                      <h3 className="text-lg font-bold text-gray-900 dark:text-white leading-tight mb-1">{alert.title}</h3>
                      <p className="text-gray-600 dark:text-gray-300 text-sm leading-relaxed mb-2">{alert.message}</p>
                      <div className="flex items-center gap-2">
                        <span className="w-1.5 h-1.5 rounded-full bg-blue-400"></span>
                        <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">
                          {new Date(alert.date).toLocaleDateString()} • {new Date(alert.date).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                        </p>
                      </div>
                    </div>
                  </div>

                  {alert.type === 'payment' && (
                    <button
                      onClick={() => router.push(alert.actionUrl)}
                      className="bg-blue-600 text-white px-8 py-3 rounded-2xl hover:bg-blue-700 transition-all font-bold shadow-lg shadow-blue-500/20 whitespace-nowrap"
                    >
                      Complete Payment
                    </button>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {tab === 'profile' && (
        <ProfileTab
          userProfile={userProfile || DEFAULT_USER_PROFILE}
          company={{
            ...(companyInfo || DEFAULT_COMPANY_INFO),
            createdAt: companyInfo?.createdAt.toISOString() || new Date().toISOString()
          }}
          companyId={companyId}
          profileId={profileId}
          onUpdateProfile={handleUpdateProfile}
        />
      )}

      {tab === 'applications' && (
        <div className='px-4 sm:px-6 py-8 max-w-7xl mx-auto'>
          {/* Header Section */}
          <div className='flex flex-col lg:flex-row lg:items-end justify-between mb-10 gap-6'>
            <div className='space-y-2'>
              <div className='inline-flex items-center px-3 py-1 rounded-full bg-blue-50 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 text-[10px] font-bold uppercase tracking-wider mb-2'>
                Application Management
              </div>
              <h2 className='text-4xl font-black text-gray-900 dark:text-white tracking-tight'>
                Track <span className='text-blue-600 dark:text-blue-400'>Requests</span>
              </h2>
              <p className='text-gray-500 dark:text-gray-400 max-w-lg text-sm leading-relaxed'>
                Monitor the real-time status of your license applications and respond to technical evaluations.
              </p>
            </div>
            
            <div className='flex items-center gap-3'>
              <button
                onClick={() => router.push('/apply-license')}
                className='bg-blue-600 text-white px-6 py-3 rounded-2xl hover:bg-blue-700 transition-all duration-300 font-bold flex items-center gap-2 shadow-lg shadow-blue-500/20'
              >
                <Plus className='w-5 h-5' />
                <span>New Submission</span>
              </button>
            </div>
          </div>

          {/* Premium Filter Section */}
          <div className='mb-12'>
            <div className='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5'>
              {[
                { id: 'all', label: 'All Services', icon: <ClipboardList className='w-5 h-5' /> },
                { id: 'Application Service Provider', label: 'App Services', icon: <Monitor className='w-5 h-5' /> },
                { id: 'Network Infrastructure', label: 'Infrastructure', icon: <Building2 className='w-5 h-5' /> },
                { id: 'Network Service Provider', label: 'Net Services', icon: <Globe className='w-5 h-5' /> },
              ].map((cat) => {
                const count = cat.id === 'all' 
                  ? applications.length 
                  : applications.filter((app: any) => app.license_type?.includes(cat.id)).length;
                const isActive = selectedFilterCategory === cat.id;
                
                return (
                  <button 
                    key={cat.id}
                    onClick={() => setSelectedFilterCategory(cat.id)}
                    className={`relative p-5 rounded-3xl border transition-all duration-300 ${
                      isActive 
                        ? 'border-blue-600 bg-blue-600 text-white shadow-xl shadow-blue-600/20' 
                        : 'border-gray-100 dark:border-gray-800 bg-white dark:bg-gray-800 hover:border-blue-200 dark:hover:border-blue-800 text-gray-900 dark:text-white'
                    }`}
                  >
                    <div className='flex items-center gap-4'>
                      <div className={`text-xl w-10 h-10 flex items-center justify-center rounded-xl ${
                        isActive ? 'bg-white/20' : 'bg-blue-50 dark:bg-blue-900/30 text-blue-600'
                      }`}>
                        {cat.icon}
                      </div>
                      <div className='text-left'>
                        <h3 className='text-sm font-bold truncate'>{cat.label}</h3>
                        <p className={`text-[10px] font-bold uppercase tracking-wider ${isActive ? 'text-white/70' : 'text-gray-400'}`}>
                          {count} Applications
                        </p>
                      </div>
                    </div>
                  </button>
                );
              })}
            </div>
          </div>

          {applications.length === 0 ? (
            <div className='bg-white dark:bg-gray-800 rounded-[2.5rem] border border-gray-100 dark:border-gray-700 p-20 text-center shadow-sm'>
              <div className='inline-flex items-center justify-center w-20 h-20 rounded-3xl bg-blue-50 dark:bg-blue-900/30 text-blue-600 mb-6'>
                <ClipboardList className='w-10 h-10' />
              </div>
              <h3 className='text-xl font-bold text-gray-900 dark:text-white mb-2'>No Applications Found</h3>
              <p className='text-gray-500 dark:text-gray-400 max-w-sm mx-auto mb-8'>You haven't submitted any applications in this category yet.</p>
              <button
                onClick={() => router.push('/apply-license')}
                className='bg-blue-600 text-white px-8 py-3 rounded-2xl hover:bg-blue-700 transition-all font-bold'
              >
                Apply for License
              </button>
            </div>
          ) : (
            <div className='grid grid-cols-1 lg:grid-cols-2 gap-8'>
              {applications
                .filter((app: any) => selectedFilterCategory === 'all' || app.license_type?.includes(selectedFilterCategory))
                .map((app: any) => (
                <div key={app.id} className='bg-white dark:bg-gray-800 rounded-[2.5rem] border border-gray-100 dark:border-gray-700 shadow-sm hover:shadow-xl transition-all duration-300 flex flex-col group'>
                  <div className='p-8 flex-grow'>
                    <div className='flex items-start justify-between mb-8'>
                      <div className='flex items-center gap-5'>
                        <div className={`w-14 h-14 rounded-2xl flex items-center justify-center shadow-sm ${
                          app.status === 'approved' ? 'bg-green-50 dark:bg-green-900/20 text-green-600' :
                          app.status === 'rejected' ? 'bg-red-50 dark:bg-red-900/20 text-red-600' :
                          'bg-blue-50 dark:bg-blue-900/20 text-blue-600'
                        }`}>
                          {app.status === 'approved' ? (
                            <CheckCircle2 className='w-7 h-7' />
                          ) : app.status === 'rejected' ? (
                            <XCircle className='w-7 h-7' />
                          ) : (
                            <Clock className='w-7 h-7' />
                          )}
                        </div>
                        <div>
                          <p className='text-[10px] text-gray-400 font-bold tracking-widest uppercase mb-1'>#{app.id.substring(0, 8)}</p>
                          <h3 className='text-lg font-bold text-gray-900 dark:text-white leading-tight'>{app.license_type}</h3>
                        </div>
                      </div>
                      <div className={`px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider ${
                        app.status === 'approved' ? 'bg-green-100 text-green-800' :
                        app.status === 'pending' ? 'bg-blue-100 text-blue-800' :
                        'bg-red-100 text-red-800'
                      }`}>
                        {app.status}
                      </div>
                    </div>

                    <p className='text-sm text-gray-600 dark:text-gray-400 leading-relaxed mb-8'>
                      {app.description?.substring(0, 150)}
                      {app.description?.length > 150 && '...'}
                    </p>

                    <div className='grid grid-cols-2 gap-4 mb-8'>
                      <div className='bg-blue-50/50 dark:bg-blue-900/10 p-4 rounded-2xl border border-blue-50 dark:border-blue-900/20'>
                        <p className='text-[10px] text-blue-400 font-bold uppercase mb-1'>Submitted</p>
                        <p className='text-xs font-bold text-gray-900 dark:text-white'>{new Date(app.submitted_at).toLocaleDateString()}</p>
                      </div>
                      <div className='bg-blue-50/50 dark:bg-blue-900/10 p-4 rounded-2xl border border-blue-50 dark:border-blue-900/20'>
                        <p className='text-[10px] text-blue-400 font-bold uppercase mb-1'>Progress</p>
                        <div className='flex items-center gap-2'>
                          <div className='flex-grow h-1.5 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden'>
                            <div className={`h-full bg-blue-600 ${app.status === 'approved' ? 'w-full' : 'w-1/2'}`}></div>
                          </div>
                          <span className='text-[10px] font-bold text-gray-500'>{app.status === 'approved' ? '100%' : '50%'}</span>
                        </div>
                      </div>
                    </div>

                    {app.files && app.files.length > 0 && (
                      <div className='flex flex-wrap gap-2'>
                        {app.files.map((file: any, index: number) => (
                          <span key={index} className='bg-white dark:bg-gray-800 border border-gray-100 dark:border-gray-700 text-gray-600 dark:text-gray-400 px-3 py-1 rounded-xl text-[10px] font-bold shadow-sm'>
                            {file.type}
                          </span>
                        ))}
                      </div>
                    )}
                  </div>
                  
                  <div className='p-6 bg-gray-50/50 dark:bg-gray-900/20 border-t border-gray-100 dark:border-gray-800 flex items-center justify-between rounded-b-[2.5rem]'>
                    <span className='text-[10px] text-gray-400 font-bold uppercase tracking-widest'>RURA EVALUATION</span>
                    <button 
                      onClick={() => {
                        setSelectedApplication(app)
                        setIsDetailsModalOpen(true)
                      }}
                      className='text-xs font-bold text-blue-600 hover:text-blue-700 flex items-center gap-1 group/btn'
                    >
                      View Details 
                      <ChevronRight className='w-4 h-4 transition-transform group-hover/btn:translate-x-1' />
                    </button>
                  </div>
                </div>
                ))}
            </div>
          )}
        </div>
      )}

      {tab === 'licenses' && (
        <div className='px-4 sm:px-6 py-8 max-w-7xl mx-auto'>
          <div className='mb-10'>
            <div className='inline-flex items-center px-3 py-1 rounded-full bg-blue-50 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 text-[10px] font-bold uppercase tracking-wider mb-2'>
              License Inventory
            </div>
            <h2 className='text-3xl font-black text-gray-900 dark:text-white tracking-tight'>
              Your Active <span className='text-blue-600 dark:text-blue-400'>Certificates</span>
            </h2>
            <p className='text-gray-500 dark:text-gray-400 text-sm mt-2'>Manage your issued licenses, renewals, and compliance documentation.</p>
          </div>

          <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8'>
            {[
              { 
                title: 'Application Service Provider', 
                icon: <Monitor className='w-8 h-8' />, 
                fee: '500k', 
                validity: '2 years',
                desc: 'Authorization for hosting and managing operational software applications.'
              },
              { 
                title: 'Network Infrastructure', 
                icon: <Building2 className='w-8 h-8' />, 
                fee: '600k', 
                validity: '3 years',
                desc: 'Permit for establishing and maintaining physical network elements.'
              },
              { 
                title: 'Network Service Provider', 
                icon: <Globe className='w-8 h-8' />, 
                fee: '400k', 
                validity: '5 years',
                desc: 'Authorization to provide public electronic communications services.'
              }
            ].map((license, idx) => (
              <div key={idx} className='bg-white dark:bg-gray-800 rounded-[2.5rem] border border-gray-100 dark:border-gray-700 p-8 shadow-sm hover:shadow-xl transition-all duration-300 flex flex-col group'>
                <div className='flex items-center justify-between mb-8'>
                  <div className='w-16 h-16 rounded-2xl bg-blue-50 dark:bg-blue-900/30 text-blue-600 flex items-center justify-center group-hover:scale-110 transition-transform'>
                    {license.icon}
                  </div>
                  <div className='text-right'>
                    <p className='text-[10px] text-gray-400 font-bold uppercase tracking-widest'>License Fee</p>
                    <p className='text-lg font-black text-blue-600 dark:text-blue-400'>RWF {license.fee}</p>
                  </div>
                </div>
                
                <h3 className='text-xl font-bold text-gray-900 dark:text-white mb-2 leading-tight'>{license.title}</h3>
                <p className='text-sm text-gray-500 dark:text-gray-400 leading-relaxed mb-8 flex-grow'>
                  {license.desc}
                </p>
                
                <div className='space-y-4 mb-8'>
                  <div className='flex items-center gap-3 text-xs font-bold text-gray-500 dark:text-gray-400'>
                    <div className='w-8 h-8 rounded-xl bg-gray-50 dark:bg-gray-900/40 flex items-center justify-center text-blue-600'>
                      <Clock3 className='w-4 h-4' />
                    </div>
                    Processing: 3-5 days
                  </div>
                  <div className='flex items-center gap-3 text-xs font-bold text-gray-500 dark:text-gray-400'>
                    <div className='w-8 h-8 rounded-xl bg-gray-50 dark:bg-gray-900/40 flex items-center justify-center text-blue-600'>
                      <ShieldCheck className='w-4 h-4' />
                    </div>
                    Validity: {license.validity}
                  </div>
                </div>

                <button
                  onClick={() => router.push('/apply-license')}
                  className='w-full bg-blue-600 text-white py-4 rounded-2xl font-bold hover:bg-blue-700 transition-all shadow-lg shadow-blue-500/10 flex items-center justify-center gap-2'
                >
                  <span>Request License</span>
                  <ArrowRight className='w-5 h-5 transition-transform group-hover:translate-x-1' />
                </button>
              </div>
            ))}
          </div>

          {/* <div className='mt-20'>
            <div className='flex items-center gap-4 mb-10'>
              <h3 className='text-xl font-bold text-gray-900 dark:text-white'>Recent Issuances</h3>
              <div className='flex-grow h-px bg-gray-100 dark:bg-gray-800'></div>
            </div>
            
            <div className='bg-white dark:bg-gray-800 rounded-[2.5rem] border border-gray-100 dark:border-gray-700 overflow-hidden shadow-sm'>
              <DashboardLicense />
            </div> */}
          {/* </div> */}
        </div>
      )}

      {tab === 'settings' && (
        <SettingsTab
          darkMode={darkMode}
          onToggleDarkMode={toggleTheme}
          language={language}
          onLanguageChange={setLanguage}
          notifications={notifications}
          onNotificationChange={handleNotificationChange}
        />
      )}
      <Dialog open={isDetailsModalOpen} onOpenChange={setIsDetailsModalOpen}>
        <DialogContent className="max-w-2xl bg-white dark:bg-gray-900 rounded-[2.5rem] border-none shadow-2xl p-0 overflow-hidden">
          {selectedApplication && (
            <div className="flex flex-col">
              {/* Modal Header with Status Banner */}
              <div className={`p-8 pb-12 ${
                selectedApplication.status === 'approved' ? 'bg-green-500' :
                selectedApplication.status === 'rejected' ? 'bg-red-500' :
                'bg-blue-600'
              } text-white relative`}>
                <div className="flex items-center justify-between mb-6">
                   <div className="flex items-center gap-3">
                     <div className="w-12 h-12 rounded-2xl bg-white/20 backdrop-blur-md flex items-center justify-center">
                        <ClipboardList className="w-6 h-6 text-white" />
                     </div>
                     <div>
                       <p className="text-[10px] font-bold uppercase tracking-widest opacity-80">Application ID</p>
                       <p className="text-sm font-black tracking-tight">#{selectedApplication.id.substring(0, 12)}</p>
                     </div>
                   </div>
                   <Badge variant="outline" className="bg-white/10 text-white border-white/20 font-bold uppercase tracking-wider px-4 py-1.5 rounded-full">
                     {selectedApplication.status}
                   </Badge>
                </div>
                <h2 className="text-3xl font-black tracking-tight mb-2">{selectedApplication.license_type}</h2>
                <div className="flex items-center gap-4 text-sm font-bold opacity-90">
                  <div className="flex items-center gap-2">
                    <Clock3 className="w-4 h-4" />
                    <span>Submitted: {new Date(selectedApplication.submitted_at).toLocaleDateString()}</span>
                  </div>
                </div>
              </div>

              {/* Modal Body */}
              <div className="p-8 -mt-6 bg-white dark:bg-gray-900 rounded-t-[2.5rem] relative">
                <div className="space-y-8">
                  {/* Description Section */}
                  <div>
                    <h3 className="text-xs font-black text-gray-400 uppercase tracking-widest mb-4">Service Description</h3>
                    <p className="text-gray-600 dark:text-gray-400 leading-relaxed text-sm">
                      {selectedApplication.description || 'No description provided for this application.'}
                    </p>
                  </div>

                  {/* Progress Section */}
                  <div className="bg-gray-50/50 dark:bg-gray-800/50 rounded-3xl p-6 border border-gray-100 dark:border-gray-700">
                    <div className="flex items-center justify-between mb-4">
                      <h3 className="text-xs font-black text-gray-500 uppercase tracking-widest">Application Progress</h3>
                      <span className="text-sm font-black text-blue-600 dark:text-blue-400">
                        {selectedApplication.status === 'approved' ? '100%' : '50%'}
                      </span>
                    </div>
                    <div className="h-3 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
                      <div className={`h-full transition-all duration-1000 ${
                        selectedApplication.status === 'approved' ? 'bg-green-500 w-full' :
                        selectedApplication.status === 'rejected' ? 'bg-red-500 w-full' :
                        'bg-blue-600 w-1/2'
                      }`}></div>
                    </div>
                    <p className="text-[10px] font-bold text-gray-400 mt-4 leading-relaxed">
                      {selectedApplication.status === 'pending' ? 
                        "Your application is currently being reviewed by the RURA technical evaluation committee." :
                        selectedApplication.status === 'approved' ? 
                        "This application has been fully approved. You can view your certificate in the Licenses tab." :
                        "This application has been rejected. Please review the reasons provided by the committee."
                      }
                    </p>
                  </div>

                  {/* Documents Section */}
                  {selectedApplication.files && selectedApplication.files.length > 0 && (
                    <div>
                      <h3 className="text-xs font-black text-gray-400 uppercase tracking-widest mb-4">Submitted Documents</h3>
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                        {selectedApplication.files.map((file: any, index: number) => (
                          <div key={index} className="flex items-center justify-between p-4 rounded-2xl bg-white dark:bg-gray-800 border border-gray-100 dark:border-gray-700 shadow-sm hover:border-blue-200 dark:hover:border-blue-800 transition-all group">
                            <div className="flex items-center gap-3">
                              <div className="w-10 h-10 rounded-xl bg-blue-50 dark:bg-blue-900/30 text-blue-600 flex items-center justify-center">
                                <FileText className="w-5 h-5" />
                              </div>
                              <div className="max-w-[120px]">
                                <p className="text-xs font-bold text-gray-900 dark:text-white truncate">{file.name || file.type}</p>
                                <p className="text-[10px] text-gray-400 font-bold uppercase tracking-tight">{file.type}</p>
                              </div>
                            </div>
                            <button className="w-8 h-8 rounded-full bg-gray-50 dark:bg-gray-700 flex items-center justify-center text-gray-400 hover:text-blue-600 transition-colors">
                              <Download className="w-4 h-4" />
                            </button>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>

                <div className="mt-10 pt-8 border-t border-gray-100 dark:border-gray-800 flex justify-end">
                   <button 
                     onClick={() => setIsDetailsModalOpen(false)}
                     className="px-8 py-3 bg-gray-900 dark:bg-white text-white dark:text-gray-900 rounded-2xl font-bold text-sm hover:scale-105 transition-all shadow-lg shadow-gray-900/10"
                   >
                     Close Details
                   </button>
                </div>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </ClientDashboardLayout>
  )
}