'use client'

import React, { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card'
import { toast } from 'sonner'
import { updateRequiredDocument, createRequiredDocument } from '@/action/RequiredDocument'
import { Loader2 } from 'lucide-react'

type DocumentData = {
    id?: string
    name: string
    description?: string
    documentType: string
    // file: any // File handling needs careful implementation, skipping for edit metadata only or text based for now
}

interface RequiredDocumentFormProps {
    initialData?: any | null // loosen typing
    isEdit?: boolean
}

export default function RequiredDocumentForm({ initialData, isEdit = false }: RequiredDocumentFormProps) {
    const router = useRouter()
    const [loading, setLoading] = useState(false)
    const [formData, setFormData] = useState<DocumentData>({
        name: initialData?.name || '',
        description: initialData?.description || '',
        documentType: initialData?.documentType || '',
        id: initialData?.id
    })

    // Basic metadata editing. File upload is complex without a proper upload component and handling in update action (which expects data: RequiredDocumentUpdateInput)

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
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
                const res = await updateRequiredDocument(id, data as any)
                if (res) success = true
            } else {
                toast.error("Create document not implemented in this form yet.")
                // requires file upload logic
            }

            if (success) {
                toast.success(`Document ${isEdit ? 'updated' : 'created'} successfully`)
                router.push('/admin-dashboard/documents')
                router.refresh()
            } else if (!success && isEdit) {
                toast.error(`Failed to update document`)
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
                <CardTitle>{isEdit ? 'Edit Document Details' : 'Upload Document'}</CardTitle>
            </CardHeader>
            <form onSubmit={handleSubmit}>
                <CardContent className="space-y-4">
                    <div className="space-y-2">
                        <Label htmlFor="name">Document Name</Label>
                        <Input
                            id="name"
                            name="name"
                            required
                            value={formData.name}
                            onChange={handleChange}
                            placeholder="Certificate..."
                        />
                    </div>

                    <div className="space-y-2">
                        <Label htmlFor="documentType">Document Type</Label>
                        <Input
                            id="documentType"
                            name="documentType"
                            required
                            value={formData.documentType}
                            onChange={handleChange}
                            placeholder="pdf, img, etc."
                        />
                    </div>

                    <div className="space-y-2">
                        <Label htmlFor="description">Description</Label>
                        <Textarea
                            id="description"
                            name="description"
                            value={formData.description || ''}
                            onChange={handleChange}
                            placeholder="Optional description..."
                        />
                    </div>

                </CardContent>
                <CardFooter className="flex justify-between">
                    <Button variant="outline" type="button" onClick={() => router.back()}>
                        Cancel
                    </Button>
                    <Button type="submit" disabled={loading}>
                        {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                        {isEdit ? 'Save Changes' : 'Upload'}
                    </Button>
                </CardFooter>
            </form>
        </Card>
    )
}
