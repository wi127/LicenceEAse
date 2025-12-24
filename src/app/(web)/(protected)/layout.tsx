import { getSessionUser } from '@/action/User'
import { redirect } from 'next/navigation'
import React, { PropsWithChildren } from 'react'

export default async function ProtectedLayout({ children }: PropsWithChildren) {
    const { user } = await getSessionUser()
    if (!user) {
        redirect('/auth/sign-in')
    }
    return (
        <>
            {children}
        </>
    )
}
