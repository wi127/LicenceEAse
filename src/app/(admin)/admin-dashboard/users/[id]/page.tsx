import React from 'react'
import { fetchUserById } from '@/action/User'
import UserForm from '@/features/users/components/UserForm'
import { notFound } from 'next/navigation'

interface PageProps {
    params: Promise<{
        id: string
    }>
}

export default async function EditUserPage({ params }: PageProps) {
    const { id } = await params

    const user = await fetchUserById(id, {
        id: true,
        email: true,
        username: true,
        role: true,
        status: true,
    })

    if (!user) {
        notFound()
    }

    return (
        <div className="container py-10">
            <UserForm initialData={user} isEdit={true} />
        </div>
    )
}
