import { getSessionUser } from '@/action/User'
import WebFooter from '@/components/WebFooter'
import WebNavbar from '@/components/WebNavbar'
import TawkLiveChat from '@/features/accounts/components/TawkLiveChat'
import React, { PropsWithChildren } from 'react'
import Home from './page'
import { AuthProvider } from '@/context/AuthContext'
import { redirect } from 'next/navigation'

export const metadata = {
  title: "LicenseEase",
  description:"",
}

export default async function WebLayout({ children }: PropsWithChildren) {
   const { user } = await getSessionUser()
   if (!user) {
    redirect('/auth/sign-in')
    }
  return (
    <>
    <AuthProvider authUser={user}>    
      <WebNavbar />
      <div className='min-h-screen'>
        {children}
      </div>
      <WebFooter />
      <TawkLiveChat />
    </AuthProvider>
    </>
  )
}
