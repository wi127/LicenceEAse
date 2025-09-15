import ApplicationLogo from '@/components/ApplicationLogo'
import React from 'react'
import SidebarLink from './SidebarLink'
import { Building, Component, Dock, File, FileText, GroupIcon, Home, LayoutDashboard, ListCheck, UsersRound } from 'lucide-react'

export default function DashboardSidebar() {
  return (
    <aside className='flex flex-col px-4 h-dvh bg-white dark:bg-gray-800 border-r border-gray-200 dark:border-gray-700'>
      <div className='py-6'>
        <ApplicationLogo />
      </div>
      <div className='text-sm grid gap-2 overflow-y-auto flex-grow content-start pb-6'>
        <SidebarLink
          href='/admin-dashboard'
          label='dashboard'
          icon={<Home className='size-5' />}
        />
        <p className='font-medium mt-4 border-muted-foreground text-muted-foreground border-b'>MANAGEMENT</p>
        <SidebarLink
          href='/admin-dashboard/users'
          label='users'
          icon={<Dock className='size-5' />}
        />
        <SidebarLink
          href='/admin-dashboard/applications'
          label='applications'
          icon={<ListCheck className='size-5' />}
        />
        <SidebarLink
          href='/admin-dashboard/companies'
          label='companies'
          icon={<Building className='size-5' />}
        />
        <SidebarLink
          href='/admin-dashboard/documents'
          label='documents'
          icon={<File className='size-5' />}
        />
      </div>
    </aside>
  )
}
