'use client'

import React, { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card'
import { toast } from 'sonner'
import { updateCompany, createCompany } from '@/action/Company'
import { Loader2 } from 'lucide-react'

type CompanyData = {
    id?: string
    name: string
    address: string
    legalType: string
    phone: string
    country: string
    TIN: string
    emailCompany: string
}

interface CompanyFormProps {
    initialData?: CompanyData | null
    isEdit?: boolean
}

export default function CompanyForm({ initialData, isEdit = false }: CompanyFormProps) {
    const router = useRouter()
    const [loading, setLoading] = useState(false)
    const [formData, setFormData] = useState<CompanyData>({
        name: initialData?.name || '',
        address: initialData?.address || '',
        legalType: initialData?.legalType || '',
        phone: initialData?.phone || '',
        country: initialData?.country || '',
        TIN: initialData?.TIN || '',
        emailCompany: initialData?.emailCompany || '',
        id: initialData?.id
    })

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target
        setFormData((prev) => ({ ...prev, [name]: value }))
    }

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        setLoading(true)

        try {
            let success = false

            if (isEdit && formData.id) {
                const { id, ...data } = formData
                // @ts-ignore
                const res = await updateCompany(id, data as any)
                if (res) success = true
            } else {
                // @ts-ignore
                const res = await createCompany(formData as any)
                if (res && res.success) success = true
            }

            if (success) {
                toast.success(`Company ${isEdit ? 'updated' : 'created'} successfully`)
                router.push('/admin-dashboard/companies')
                router.refresh()
            } else {
                toast.error(`Failed to ${isEdit ? 'update' : 'create'} company`)
            }
        } catch (error) {
            console.error(error)
            toast.error('An unexpected error occurred')
        } finally {
            setLoading(false)
        }
    }

    return (
        <Card className="w-full max-w-2xl mx-auto">
            <CardHeader>
                <CardTitle>{isEdit ? 'Edit Company' : 'Register Company'}</CardTitle>
            </CardHeader>
            <form onSubmit={handleSubmit}>
                <CardContent className="space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                            <Label htmlFor="name">Company Name</Label>
                            <Input
                                id="name"
                                name="name"
                                required
                                value={formData.name}
                                onChange={handleChange}
                                placeholder="Acme Corp"
                            />
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="legalType">Legal Type</Label>
                            <Input
                                id="legalType"
                                name="legalType"
                                required
                                value={formData.legalType}
                                onChange={handleChange}
                                placeholder="LLC, PLC, etc."
                            />
                        </div>
                    </div>

                    <div className="space-y-2">
                        <Label htmlFor="emailCompany">Company Email</Label>
                        <Input
                            id="emailCompany"
                            name="emailCompany"
                            type="email"
                            required
                            value={formData.emailCompany}
                            onChange={handleChange}
                            placeholder="contact@company.com"
                        />
                    </div>

                    <div className="space-y-2">
                        <Label htmlFor="phone">Phone</Label>
                        <Input
                            id="phone"
                            name="phone"
                            value={formData.phone}
                            onChange={handleChange}
                            placeholder="+1 ..."
                        />
                    </div>

                    <div className="space-y-2">
                        <Label htmlFor="address">Address</Label>
                        <Input
                            id="address"
                            name="address"
                            value={formData.address}
                            onChange={handleChange}
                            placeholder="123 Street..."
                        />
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                            <Label htmlFor="country">Country</Label>
                            <Input
                                id="country"
                                name="country"
                                value={formData.country}
                                onChange={handleChange}
                                placeholder="Country"
                            />
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="TIN">TIN</Label>
                            <Input
                                id="TIN"
                                name="TIN"
                                value={formData.TIN}
                                onChange={handleChange}
                                placeholder="Tax Identification Number"
                            />
                        </div>
                    </div>

                </CardContent>
                <CardFooter className="flex justify-between">
                    <Button variant="outline" type="button" onClick={() => router.back()}>
                        Cancel
                    </Button>
                    <Button type="submit" disabled={loading}>
                        {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                        {isEdit ? 'Save Changes' : 'Register Company'}
                    </Button>
                </CardFooter>
            </form>
        </Card>
    )
}
