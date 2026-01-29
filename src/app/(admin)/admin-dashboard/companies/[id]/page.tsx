import React from 'react'
import { fetchCompanyById } from '@/action/Company'
import CompanyForm from '@/features/companies/components/CompanyForm'
import { notFound } from 'next/navigation'

interface PageProps {
    params: Promise<{
        id: string
    }>
}

export default async function EditCompanyPage({ params }: PageProps) {
    const { id } = await params

    const company = await fetchCompanyById(id, {
        id: true,
        name: true,
        address: true,
        legalType: true,
        phone: true,
        country: true,
        TIN: true,
        emailCompany: true,
    })

    if (!company) {
        notFound()
    }

    return (
        <div className="container py-10">
            <CompanyForm initialData={company} isEdit={true} />
        </div>
    )
}
