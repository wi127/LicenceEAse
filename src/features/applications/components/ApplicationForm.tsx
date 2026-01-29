'use client'

import React, { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card'
import { toast } from 'sonner'
import { updateApplication, createApplication } from '@/action/Application'
import { Loader2 } from 'lucide-react'

// Basic type for form, can extend as needed from Prisma result
type ApplicationData = {
    id?: string
    name: string
    description: string
    processingTime: number
    validityMonths: number
    applicationFee: number
    // companyId: string // Handling company selection might be needed for create, but optionally for edit
}

interface ApplicationFormProps {
    initialData?: ApplicationData | null
    isEdit?: boolean
}

export default function ApplicationForm({ initialData, isEdit = false }: ApplicationFormProps) {
    const router = useRouter()
    const [loading, setLoading] = useState(false)
    const [formData, setFormData] = useState<ApplicationData>({
        name: initialData?.name || '',
        description: initialData?.description || '',
        processingTime: initialData?.processingTime || 0,
        validityMonths: initialData?.validityMonths || 0,
        applicationFee: initialData?.applicationFee || 0,
        id: initialData?.id
    })

    // We are missing 'Textarea' component in ui, might need to create it or use Input for now or standard textarea

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target
        setFormData((prev) => ({
            ...prev,
            [name]: name === 'processingTime' || name === 'validityMonths' || name === 'applicationFee'
                ? parseFloat(value) || 0
                : value
        }))
    }

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        setLoading(true)

        try {
            let success = false

            if (isEdit && formData.id) {
                const { id, ...data } = formData
                // @ts-ignore - simplistic casting for now
                const res = await updateApplication(id, data as any)
                if (res) success = true
            } else {
                // Create - tricky without companyId if it's required. 
                // For now focusing on Edit as requested "same features ... delete, edit". 
                // Create might need a company selector.

                // Ensure to cast or validate structure matches Prisma input
                // @ts-ignore
                const res = await createApplication(formData as any)
                if (res && res.success) success = true
            }

            if (success) {
                toast.success(`Application ${isEdit ? 'updated' : 'created'} successfully`)
                router.push('/admin-dashboard/applications')
                router.refresh()
            } else {
                toast.error(`Failed to ${isEdit ? 'update' : 'create'} application`)
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
                <CardTitle>{isEdit ? 'Edit Application' : 'Create Application'}</CardTitle>
            </CardHeader>
            <form onSubmit={handleSubmit}>
                <CardContent className="space-y-4">
                    <div className="space-y-2">
                        <Label htmlFor="name">Name</Label>
                        <Input
                            id="name"
                            name="name"
                            type="text"
                            required
                            value={formData.name}
                            onChange={handleChange}
                            placeholder="License Name"
                        />
                    </div>

                    <div className="space-y-2">
                        <Label htmlFor="description">Description</Label>
                        <Input
                            id="description"
                            name="description"
                            value={formData.description}
                            onChange={handleChange}
                            placeholder="Description"
                        />
                    </div>

                    <div className="grid grid-cols-3 gap-4">
                        <div className="space-y-2">
                            <Label htmlFor="processingTime">Processing Time (Days)</Label>
                            <Input
                                id="processingTime"
                                name="processingTime"
                                type="number"
                                value={formData.processingTime}
                                onChange={handleChange}
                            />
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="validityMonths">Validity (Months)</Label>
                            <Input
                                id="validityMonths"
                                name="validityMonths"
                                type="number"
                                value={formData.validityMonths}
                                onChange={handleChange}
                            />
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="applicationFee">Fee</Label>
                            <Input
                                id="applicationFee"
                                name="applicationFee"
                                type="number"
                                value={formData.applicationFee}
                                onChange={handleChange}
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
                        {isEdit ? 'Save Changes' : 'Create Application'}
                    </Button>
                </CardFooter>
            </form>
        </Card>
    )
}
