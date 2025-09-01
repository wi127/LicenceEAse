"use client"

import React, { useState, useRef } from 'react'
import { Camera, Save, Edit2, Mail, Phone, MapPin, User, Building } from 'lucide-react'
import CompanyRepresentativesTab from './CompanyRepresentativesTab'
import { ELegalType } from '@prisma/client'

interface Representative {
  id: string
  fullname: string
  telephone: string
  address: string
  nationalId: string
  communicationLanguage: string
  status: string
}

interface UserInfo {
  id: string
  fullname: string
  phone: string
  address: string
  nationalId: string
  user:{
    id: string
    email: string
    image?: string
    username?: string
    status?: string
  }
}

interface CompanyInfo {
  name: string
  country: string
  TIN: string
  legalType: ELegalType
  address: string | null
  phone: string | null
  emailCompany: string | null
  createdAt: string
}

export const DEFAULT_USER_PROFILE: UserInfo = {
  id: '',
  fullname: '',
  phone: '',
  address: '',
  nationalId: '',
  user:{
    id: '',
    email: '',
    image: '',
    username: ''
  }
};

export const DEFAULT_COMPANY_INFO: CompanyInfo = {
  name: '',
  country: '',
  TIN: '',
  legalType: 'COMPANY_LTD' as ELegalType,
  address: '',
  phone: '',
  emailCompany: '',
  createdAt: ''
};

interface ProfileTabProps {
    userProfile: UserInfo | null
    company: CompanyInfo  | null
    companyId: string
    profileId: string
    onUpdateProfile: (profile: any) => void
}

export default function ProfileTab({ userProfile, company, companyId, profileId, onUpdateProfile }: ProfileTabProps) {
  const [activeSubTab, setActiveSubTab] = useState('personal')
  const [isEditing, setIsEditing] = useState(false)
  const [formData, setFormData] = useState({
    id: userProfile?.id || profileId || '',
    fullname: userProfile?.fullname || '',
    email: userProfile?.user.email || '',
    phone: userProfile?.phone || '',
    address: userProfile?.address || '',
    image: userProfile?.user.image || '',
    user: {
      id: userProfile?.user.id || '',
      email: userProfile?.user.email || '',
      image: userProfile?.user.image || '',
      username: userProfile?.user.username || ''
    }
  })
  const [message, setMessage] = useState('')
  const fileInputRef = useRef<HTMLInputElement>(null)

  // Company and representatives state
  const [companyInfo, setCompanyInfo] = useState<CompanyInfo>({
    name: company?.name || '',
    country: company?.country || '',
    TIN: company?.TIN || '',
    address: company?.address || '',
    phone: company?.phone || '',
    legalType: company?.legalType || 'COMPANY_LTD' as ELegalType,
    emailCompany: company?.emailCompany || '',
    createdAt: company?.createdAt || ''
  })
  const [representatives, setRepresentatives] = useState<Representative[]>([
    // Sample representative for demo
    {
      id: userProfile?.user.id || '',
      address: userProfile?.address || '',
      nationalId: userProfile?.nationalId || '',
      fullname: userProfile?.fullname || '',
      telephone: userProfile?.phone || '',
      communicationLanguage: 'English',
      status: 'Primary Contact'
    }
  ])

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
  const { name, value } = e.target
  
  if (name.startsWith('user.')) {
    // Handle nested user properties
    const userField = name.split('.')[1]
    setFormData(prev => ({
      ...prev,
      user: {
        ...prev.user,
        [userField]: value
      }
    }))
  } else {
    // Handle top-level properties
    setFormData(prev => ({
      ...prev,
      [name]: value
    }))
  }
}

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      const reader = new FileReader()
      reader.onload = (e) => {
        const result = e.target?.result as string
        setFormData(prev => ({
          ...prev,
          image: result
        }))
      }
      reader.readAsDataURL(file)
    }
  }

  const handleSave = async () => {
    try {
      // Here you would typically call your backend API
      onUpdateProfile(formData)
      setIsEditing(false)
      setMessage('Profile updated successfully!')
      setTimeout(() => setMessage(''), 3000)
    } catch (error) {
      setMessage('Failed to update profile')
    }
  }

  const handleCancel = () => {
    setFormData({
    id: userProfile?.id || profileId || '',
    fullname: userProfile?.fullname || '',
    email: userProfile?.user.email || '',
    phone: userProfile?.phone || '',
    address: userProfile?.address || '',
    image: userProfile?.user.image || '',
    user: {
      id: userProfile?.user.id || '',
      email: userProfile?.user.email || '',
      image: userProfile?.user.image || '',
      username: userProfile?.user.username || ''
    }
    })
    setIsEditing(false)
  }

  const handleUpdateCompany = (info: CompanyInfo) => {
    setCompanyInfo(info)

    onUpdateProfile({
      ...userProfile,
      name: info.name,
      phone: info.phone,
      emailCompany: info.emailCompany,
      country: info.country,
      TIN: info.TIN,
      address: info.address
    })
  }

  const handleUpdateRepresentatives = (reps: Representative[]) => {
    setRepresentatives(reps)
  }

  return (
    <div className='px-6 py-4'>
      <div className='flex justify-between items-center mb-6'>
        <h2 className='text-2xl font-bold'>Profile & Company</h2>
      </div>

      {/* Sub-navigation tabs */}
      <div className='flex space-x-1 mb-6 bg-gray-100 dark:bg-gray-800 p-1 rounded-lg'>
        <button
          onClick={() => setActiveSubTab('personal')}
          className={`flex-1 py-2 px-4 rounded-md text-sm font-medium transition-colors flex items-center justify-center gap-2 ${
            activeSubTab === 'personal'
              ? 'bg-white dark:bg-gray-700 text-primary shadow-sm'
              : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-200'
          }`}
        >
          <User className='size-4' />
          Personal Profile
        </button>
        <button
          onClick={() => setActiveSubTab('company')}
          className={`flex-1 py-2 px-4 rounded-md text-sm font-medium transition-colors flex items-center justify-center gap-2 ${
            activeSubTab === 'company'
              ? 'bg-white dark:bg-gray-700 text-primary shadow-sm'
              : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-200'
          }`}
        >
          <Building className='size-4' />
          Company & Representatives
        </button>
      </div>

      {message && (
        <div className={`mb-4 p-3 rounded-md ${message.includes('successfully') ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
          {message}
        </div>
      )}

      {/* Personal Profile Tab */}
      {activeSubTab === 'personal' && (
        <div>
          <div className='flex justify-between items-center mb-6'>
            <h3 className='text-xl font-semibold'>Personal Information</h3>
            {!isEditing && (
              <button
                onClick={() => setIsEditing(true)}
                className='bg-primary text-primary-foreground px-4 py-2 rounded-md hover:bg-primary/90 transition-colors flex items-center gap-2'
              >
                <Edit2 className='size-4' />
                Edit Profile
              </button>
            )}
          </div>

          <div className='bg-white dark:bg-gray-800 rounded-lg shadow-sm p-6'>
        <div className='flex items-start gap-8'>
          {/* Profile Picture Section */}
          <div className='flex flex-col items-center gap-4'>
            <div className='relative'>
              <div className='w-32 h-32 rounded-full bg-gray-200 dark:bg-gray-600 overflow-hidden border-4 border-white shadow-lg'>
                {formData.image ? (
                  <img 
                    src={formData.image} 
                    alt="Profile" 
                    className='w-full h-full object-cover'
                  />
                ) : (
                  <div className='w-full h-full flex items-center justify-center'>
                    <User className='size-16 text-gray-400' />
                  </div>
                )}
              </div>
              {isEditing && (
                <button
                  onClick={() => fileInputRef.current?.click()}
                  className='absolute bottom-0 right-0 bg-primary text-primary-foreground rounded-full p-2 hover:bg-primary/90 transition-colors'
                >
                  <Camera className='size-4' />
                </button>
              )}
            </div>
            
            {isEditing && (
              <div className='text-center'>
                <input
                  ref={fileInputRef}
                  type='file'
                  accept='image/*'
                  onChange={handleImageUpload}
                  className='hidden'
                />
                <p className='text-sm text-muted-foreground'>
                  Click camera icon to upload new picture
                </p>
              </div>
            )}
          </div>

          {/* Profile Information */}
          <div className='flex-1 space-y-6'>
            <div className='grid md:grid-cols-2 gap-6'>
              <div>
                <label className='block text-sm font-medium mb-2 flex items-center gap-2'>
                  <User className='size-4' />
                  Full Name
                </label>
                {isEditing ? (
                  <input
                    type='text'
                    name='name'
                    value={formData.fullname}
                    onChange={handleInputChange}
                    className='w-full p-3 border rounded-md dark:bg-gray-700 dark:border-gray-600'
                    required
                  />
                ) : (
                  <p className='p-3 bg-gray-50 dark:bg-gray-700 rounded-md'>{userProfile?.fullname}</p>
                )}
              </div>

              <div>
                <label className='block text-sm font-medium mb-2 flex items-center gap-2'>
                  <Mail className='size-4' />
                  Email Address
                </label>
                {isEditing ? (
                  <input
                    type='email'
                    name='user.email'
                    value={formData.user.email}
                    onChange={handleInputChange}
                    className='w-full p-3 border rounded-md dark:bg-gray-700 dark:border-gray-600'
                    required
                  />
                ) : (
                  <p className='p-3 bg-gray-50 dark:bg-gray-700 rounded-md'>{userProfile?.user.email}</p>
                )}
              </div>

              <div>
                <label className='block text-sm font-medium mb-2 flex items-center gap-2'>
                  <Phone className='size-4' />
                  Phone Number
                </label>
                {isEditing ? (
                  <input
                    type='tel'
                    name='phone'
                    value={formData.phone}
                    onChange={handleInputChange}
                    className='w-full p-3 border rounded-md dark:bg-gray-700 dark:border-gray-600'
                    placeholder='Enter phone number'
                  />
                ) : (
                  <p className='p-3 bg-gray-50 dark:bg-gray-700 rounded-md'>
                    {userProfile?.phone || 'Not provided'}
                  </p>
                )}
              </div>

              <div>
                <label className='block text-sm font-medium mb-2 flex items-center gap-2'>
                  <MapPin className='size-4' />
                  Address
                </label>
                {isEditing ? (
                  <input
                    type='text'
                    name='address'
                    value={formData.address}
                    onChange={handleInputChange}
                    className='w-full p-3 border rounded-md dark:bg-gray-700 dark:border-gray-600'
                    placeholder='Enter address'
                  />
                ) : (
                  <p className='p-3 bg-gray-50 dark:bg-gray-700 rounded-md'>
                    {userProfile?.address || 'Not provided'}
                  </p>
                )}
              </div>
            </div>

            {isEditing && (
              <div className='flex gap-4 pt-4'>
                <button
                  onClick={handleSave}
                  className='bg-primary text-primary-foreground px-6 py-2 rounded-md hover:bg-primary/90 transition-colors flex items-center gap-2'
                >
                  <Save className='size-4' />
                  Save Changes
                </button>
                <button
                  onClick={handleCancel}
                  className='bg-gray-200 text-gray-700 px-6 py-2 rounded-md hover:bg-gray-300 transition-colors'
                >
                  Cancel
                </button>
              </div>
            )}
          </div>
        </div>
          </div>
        </div>
      )}

      {/* Company & Representatives Tab */}
      {activeSubTab === 'company' && (
        <CompanyRepresentativesTab
          companyInfo={companyInfo}
          representatives={representatives}
          companyId={companyId}
          profileId={profileId}
          onUpdateCompany={handleUpdateCompany}
          onUpdateRepresentatives={handleUpdateRepresentatives}
          user={{
            email: userProfile?.user.email || '',
            status: userProfile?.user.status || ''
          }}
        />
      )}
    </div>
  )
}
