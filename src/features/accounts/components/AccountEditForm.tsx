'use client'

import SubmitButton from '@/components/SubmitButton'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Button } from '@/components/ui/button'
import { Camera, User } from 'lucide-react'
import React, { useState } from 'react'
import { updateAccount } from '@/action/Account'
import { toast } from 'sonner'
import { TProfileSelect } from '@/lib/types/profile'
import { TCompanySelect } from '@/lib/types/company'

interface AccountEditFormProps {
  user: {
    id: string;
    email: string;
    image: string | null;
    role: string | unknown;
  }
  profile: TProfileSelect | null
  company: TCompanySelect | null
}

export default function AccountEditForm({ user, profile, company }: AccountEditFormProps) {
  const [profilePhoto, setProfilePhoto] = useState<string | null>(user?.image || null)

  // Form State
  const [formData, setFormData] = useState({
    name: profile?.fullname || '',
    email: user?.email || '',
    phone: profile?.phone || '',
    role: (user?.role as string) || '',
    company: company?.name || '',
    password: '',
    confirmPassword: ''
  })

  const handlePhotoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      if (!file.type.startsWith('image/')) {
        toast.error('Please select an image file')
        return
      }
      if (file.size > 2 * 1024 * 1024) {
        toast.error('Image size must be under 2MB')
        return
      }

      const reader = new FileReader()
      reader.onload = (e) => {
        setProfilePhoto(e.target?.result as string)
      }
      reader.readAsDataURL(file)
    }
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value })
  }

  const handleSave = async () => {
    if (formData.password && formData.password !== formData.confirmPassword) {
      toast.error("Passwords do not match")
      return
    }

    try {
      const res = await updateAccount(user.id, {
        fullname: formData.name,
        email: formData.email,
        phone: formData.phone,
        companyName: formData.company,
        image: profilePhoto || undefined,
        password: formData.password || undefined
      })

      if (res.success) {
        toast.success("Profile updated successfully")
        setFormData(prev => ({ ...prev, password: '', confirmPassword: '' }))
      } else {
        toast.error(res.error || "Failed to update profile")
      }
    } catch (error) {
      toast.error("An error occurred")
    }
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Edit Account Details</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid gap-6">
          {/* Profile Photo Section */}
          <div className="flex items-center gap-4">
            <Avatar className="h-20 w-20">
              <AvatarImage src={profilePhoto || undefined} alt="Profile photo" />
              <AvatarFallback className="text-lg">
                <User className="h-8 w-8" />
              </AvatarFallback>
            </Avatar>
            <div className="flex flex-col gap-2">
              <label htmlFor="photo-upload">
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  className="cursor-pointer"
                  asChild
                >
                  <span>
                    <Camera className="h-4 w-4 mr-2" />
                    Change Photo
                  </span>
                </Button>
              </label>
              <input
                id="photo-upload"
                type="file"
                accept="image/*"
                className="hidden"
                onChange={handlePhotoUpload}
              />
              <p className="text-xs text-text-muted-foreground">Max 2MB, JPG/PNG only</p>
            </div>
          </div>

          <form className="grid gap-6 text-sm" onSubmit={(e) => { e.preventDefault(); handleSave(); }}>
            <div className="grid gap-3 md:grid-cols-2">
              <div className="grid gap-1">
                <label htmlFor="name" className="primary">Full Name</label>
                <input
                  type="text"
                  id="name"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  className="primary p-2 border rounded"
                  placeholder="Enter your full name"
                />
              </div>
              <div className="grid gap-1">
                <label htmlFor="email" className="primary">Email address</label>
                <input
                  type="email"
                  id="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  className="primary p-2 border rounded"
                  placeholder="Enter your email"
                />
              </div>
              <div className="grid gap-1">
                <label htmlFor="phone" className="primary">Phone Number</label>
                <input
                  type="tel"
                  id="phone"
                  name="phone"
                  value={formData.phone}
                  onChange={handleChange}
                  className="primary p-2 border rounded"
                  placeholder="Enter your phone number"
                />
              </div>
              <div className="grid gap-1">
                <label htmlFor="role" className="primary">Role/Title</label>
                <input
                  type="text"
                  id="role"
                  name="role"
                  value={formData.role}
                  readOnly
                  disabled
                  className="primary p-2 border rounded bg-gray-100 dark:bg-gray-800 text-gray-500 cursor-not-allowed"
                  placeholder="e.g. CEO, Manager, Director"
                />
              </div>
              <div className="grid gap-1 md:col-span-2">
                <label htmlFor="company" className="primary">Company Name</label>
                <input
                  type="text"
                  id="company"
                  name="company"
                  value={formData.company}
                  onChange={handleChange}
                  className="primary p-2 border rounded"
                  placeholder="Enter your company name"
                />
              </div>
            </div>

            {/* Password Section */}
            <div className="pt-4 border-t">
              <h3 className="font-semibold mb-4">Change Password</h3>
              <div className="grid gap-3 md:grid-cols-2">
                <div className="grid gap-1">
                  <label htmlFor="password" className="primary">New Password</label>
                  <input
                    type="password"
                    id="password"
                    name="password"
                    value={formData.password}
                    onChange={handleChange}
                    className="primary p-2 border rounded"
                    placeholder="Enter new password"
                  />
                </div>
                <div className="grid gap-1">
                  <label htmlFor="password2" className="primary">Confirm Password</label>
                  <input
                    type="password"
                    id="password2"
                    name="password2"
                    value={formData.confirmPassword}
                    onChange={handleChange}
                    className="primary p-2 border rounded"
                    placeholder="Confirm new password"
                  />
                </div>
              </div>
            </div>

            <div className="flex gap-2">
              <SubmitButton onClick={handleSave}>Save Changes</SubmitButton>
              <Button type="button" variant="outline" onClick={() => {
                setFormData({
                  name: profile?.fullname || '',
                  email: user?.email || '',
                  phone: profile?.phone || '',
                  role: (user?.role as string) || '',
                  company: company?.name || '',
                  password: '',
                  confirmPassword: ''
                });
                setProfilePhoto(user?.image || null);
              }}>Cancel</Button>
            </div>
          </form>
        </div>
      </CardContent>
    </Card>
  )
}
