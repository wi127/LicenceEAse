'use client'

import React, { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select'
import { Label } from '@/components/ui/label'
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card'
import { toast } from 'sonner'
import { updateUser, createUser } from '@/action/User' // Assuming createUser exists or we strictly stick to edit for now. I saw createUser in User.ts
import { Loader2 } from 'lucide-react'

type User = {
    id?: string
    email: string
    username: string
    role: string
    status: string
    // Add password for creation if needed, but for edit we might skip it or handle it separately
}

interface UserFormProps {
    initialData?: User | null
    isEdit?: boolean
}

export default function UserForm({ initialData, isEdit = false }: UserFormProps) {
    const router = useRouter()
    const [loading, setLoading] = useState(false)
    const [formData, setFormData] = useState<User>({
        email: initialData?.email || '',
        username: initialData?.username || '',
        role: initialData?.role || 'user',
        status: initialData?.status || 'active',
        id: initialData?.id
    })

    // Basic password state for creation
    const [password, setPassword] = useState('')

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target
        setFormData((prev) => ({ ...prev, [name]: value }))
    }

    const handleSelectChange = (name: string, value: string) => {
        setFormData((prev) => ({ ...prev, [name]: value }))
    }

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        setLoading(true)

        try {
            let success = false

            if (isEdit && formData.id) {
                // Remove id from data passed to update (it's the first arg)
                const { id, ...data } = formData
                // Cast to any to avoid strict localized enum issues if they persist, 
                // assuming the select values match the backend expectations (active/inactive etc)
                const res = await updateUser(id, data as any)
                if (res) success = true
            } else {
                // Create
                if (!password) {
                    toast.error('Password is required for new users')
                    setLoading(false)
                    return
                }
                const res = await createUser({ ...formData, password } as any)
                if (res && res.success) success = true
            }

            if (success) {
                toast.success(`User ${isEdit ? 'updated' : 'created'} successfully`)
                router.push('/admin-dashboard/users')
                router.refresh()
            } else {
                toast.error(`Failed to ${isEdit ? 'update' : 'create'} user`)
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
                <CardTitle>{isEdit ? 'Edit User' : 'Create User'}</CardTitle>
            </CardHeader>
            <form onSubmit={handleSubmit}>
                <CardContent className="space-y-4">
                    <div className="space-y-2">
                        <Label htmlFor="email">Email</Label>
                        <Input
                            id="email"
                            name="email"
                            type="email"
                            required
                            value={formData.email}
                            onChange={handleChange}
                            placeholder="user@example.com"
                        />
                    </div>

                    <div className="space-y-2">
                        <Label htmlFor="username">Username</Label>
                        <Input
                            id="username"
                            name="username"
                            type="text"
                            required
                            value={formData.username}
                            onChange={handleChange}
                            placeholder="Username"
                        />
                    </div>

                    {!isEdit && (
                        <div className="space-y-2">
                            <Label htmlFor="password">Password</Label>
                            <Input
                                id="password"
                                name="password"
                                type="password"
                                required
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                placeholder="********"
                            />
                        </div>
                    )}

                    <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                            <Label htmlFor="role">Role</Label>
                            <Select
                                value={formData.role}
                                onValueChange={(val) => handleSelectChange('role', val)}
                            >
                                <SelectTrigger>
                                    <SelectValue placeholder="Select role" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="USER">User</SelectItem>
                                    <SelectItem value="ADMIN">Admin</SelectItem>
                                    {/* Add other roles as needed */}
                                </SelectContent>
                            </Select>
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="status">Status</Label>
                            <Select
                                value={formData.status}
                                onValueChange={(val) => handleSelectChange('status', val)}
                            >
                                <SelectTrigger>
                                    <SelectValue placeholder="Select status" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="ACTIVE">Active</SelectItem>
                                    <SelectItem value="INACTIVE">Inactive</SelectItem>
                                    <SelectItem value="SUSPENDED">Suspended</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>
                    </div>

                </CardContent>
                <CardFooter className="flex justify-between">
                    <Button variant="outline" type="button" onClick={() => router.back()}>
                        Cancel
                    </Button>
                    <Button type="submit" disabled={loading}>
                        {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                        {isEdit ? 'Save Changes' : 'Create User'}
                    </Button>
                </CardFooter>
            </form>
        </Card>
    )
}
