import React from 'react'
import { fetchRequiredDocumentById } from '@/action/RequiredDocument'
import RequiredDocumentForm from '@/features/applications/components/RequiredDocumentForm'
import { notFound } from 'next/navigation'

interface PageProps {
    params: Promise<{
        id: string
    }>
}

export default async function EditDocumentPage({ params }: PageProps) {
    const { id } = await params

    const document = await fetchRequiredDocumentById(id, {
        id: true,
        name: true,
        description: true,
        documentType: true,
    })

    if (!document) {
        notFound()
    }

    return (
        <div className="container py-10">
            <RequiredDocumentForm initialData={document} isEdit={true} />
        </div>
    )
}
