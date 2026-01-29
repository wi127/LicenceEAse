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
        processingTime: true,
        validityMonths: true,
        applicationFee: true,
    })

    if (!application) {
        notFound()
    }

    // @ts-ignore - casting prisma result to form expectation
    return (
        <div className="container py-10">
            <ApplicationForm initialData={application} isEdit={true} />
        </div>
    )
}
