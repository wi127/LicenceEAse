import React from 'react'
import { fetchApplicationById } from '@/action/Application'
import ApplicationForm from '@/features/applications/components/ApplicationForm'
import { notFound } from 'next/navigation'

interface PageProps {
    params: Promise<{
        id: string
    }>
}

export default async function EditApplicationPage({ params }: PageProps) {
    const { id } = await params

    const application = await fetchApplicationById(id, {
        id: true,
        name: true,
        description: true,
        LicenseApplication: {
            select: {
                id: true,
                status: true,
            },
        },
        processingTime: true,
        validityMonths: true,
        applicationFee: true,
    })

    if (!application) {
        notFound()
    }


    return (
        <div className="container py-10">
            <ApplicationForm initialData={application} isEdit={true} />
        </div>
    )
}
