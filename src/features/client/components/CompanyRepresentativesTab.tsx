"use client"

import React, { useState } from 'react'
import { Building, User, Plus, Edit2, Trash2, Save, X } from 'lucide-react'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { Badge } from '@/components/ui/badge'
import { updateCompany } from '@/action/Company'
import { createProfile, deleteProfile } from '@/action/Profile'
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

interface User {
  email: string
  status: string
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

interface CompanyRepresentativesTabProps {
  companyInfo: CompanyInfo
  user: User
  representatives: Representative[]
  onUpdateCompany: (info: CompanyInfo) => void
  onUpdateRepresentatives: (reps: Representative[]) => void
  companyId: string
  profileId: string
}

export default function CompanyRepresentativesTab({
  companyInfo,
  representatives,
  user,
  onUpdateCompany,
  onUpdateRepresentatives,
  companyId,
  profileId
}: CompanyRepresentativesTabProps) {
  const [isEditingCompany, setIsEditingCompany] = useState(false)
  const [isAddingRep, setIsAddingRep] = useState(false)
  const [editingRepId, setEditingRepId] = useState<string | null>(null)
  const [message, setMessage] = useState('')

  const [companyFormData, setCompanyFormData] = useState<CompanyInfo>(companyInfo)
  const [userFormData, setUserFormData] = useState<User>(user)
  const [newRepFormData, setNewRepFormData] = useState({
    id: '',
    fullname: '',
    nationalId: '',
    telephone: '',
    address: '',
    communicationLanguage: 'English',
    status: ''
  })

  const handleCompanyInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target
    setCompanyFormData(prev => ({
      ...prev,
      [name]: value
    }))
  }

  const handleRepInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target
    setNewRepFormData(prev => ({
      ...prev,
      [name]: value
    }))
  }

  const handleSaveCompany = async () => {
    try {
      // Prepare clean payload for Prisma
      const payload = {
        name: companyFormData.name,
        country: companyFormData.country,
        TIN: companyFormData.TIN,
        legalType: companyFormData.legalType,
        address: companyFormData.address || '',
        phone: companyFormData.phone || '',
        emailCompany: companyFormData.emailCompany || '',
      }

      // Save to backend
      const res = await updateCompany(companyId, payload)

      if (!res) {
        throw new Error('Failed to save company information')
      }

      onUpdateCompany(companyFormData)
      setIsEditingCompany(false)
      setMessage('Company information saved successfully!')
      setTimeout(() => setMessage(''), 3000)
    } catch (error) {
      console.error('Error saving company:', error)
      setMessage('Failed to save company information. Please try again.')
      setTimeout(() => setMessage(''), 3000)
    }
  }

  const handleCancelCompanyEdit = () => {
    setCompanyFormData(companyInfo)
    setIsEditingCompany(false)
  }

  const handleAddRepresentative = async () => {
    if (!newRepFormData.fullname || !userFormData.email || !newRepFormData.telephone) {
      setMessage('Please fill in all required fields for the representative.')
      setTimeout(() => setMessage(''), 3000)
      return
    }

    const newRep: Representative = {
      ...newRepFormData
    }

    const updatedReps = [...representatives, newRep]

    try {
      // Save to backend
      const res = await createProfile({
        fullname: newRepFormData.fullname,
        phone: newRepFormData.telephone,
        address: newRepFormData.address,
        nationalId: newRepFormData.nationalId,
        user: {
          connect: {
            email: userFormData.email,
          }
        }
      })

      if (!res) {
        throw new Error('Failed to save representative')
      }

      onUpdateRepresentatives(updatedReps)
      setNewRepFormData({
        id: '',
        fullname: '',
        nationalId: '',
        telephone: '',
        address: '',
        communicationLanguage: 'English',
        status: ''
      })
      setIsAddingRep(false)
      setMessage('Representative added successfully!')
      setTimeout(() => setMessage(''), 3000)
    } catch (error) {
      console.error('Error saving representative:', error)
      setMessage('Failed to save representative. Please try again.')
      setTimeout(() => setMessage(''), 3000)
    }
  }

  const handleDeleteRepresentative = async () => {
    const res = await deleteProfile(profileId)
    if (!res) {
      throw new Error('Failed to delete representative')
    }
    setMessage('Representative removed successfully!')
    setTimeout(() => setMessage(''), 3000)
  }

  return (
    <div className='space-y-8'>
      {message && (
        <div className={`p-4 rounded-lg ${message.includes('✅') ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
          {message}
        </div>
      )}

      {/* Company Information Section */}
      <div className='bg-white dark:bg-gray-800 rounded-lg shadow-sm p-6'>
        <div className='flex justify-between items-center mb-6'>
          <h3 className='text-xl font-semibold flex items-center gap-2'>
            <Building className='size-5' />
            Company Information
          </h3>
          {!isEditingCompany && (
            <button
              onClick={() => setIsEditingCompany(true)}
              className='bg-primary text-primary-foreground px-4 py-2 rounded-md hover:bg-primary/90 transition-colors flex items-center gap-2'
            >
              <Edit2 className='size-4' />
              Edit Company
            </button>
          )}
        </div>

        <div className='grid md:grid-cols-2 gap-6'>
          <div>
            <label className='block text-sm font-medium mb-2'>Company Name</label>
            {isEditingCompany ? (
              <input
                type="text"
                name="name"
                value={companyFormData.name}
                onChange={handleCompanyInputChange}
                className='w-full p-3 border rounded-md dark:bg-gray-700 dark:border-gray-600'
                required
              />
            ) : (
              <p className='p-3 bg-gray-50 dark:bg-gray-700 rounded-md'>{companyInfo.name || 'Not provided'}</p>
            )}
          </div>

          <div>
            <label className='block text-sm font-medium mb-2'>Nationality</label>
            {isEditingCompany ? (
              <select
                name="country"
                value={companyFormData.country}
                onChange={handleCompanyInputChange}
                className='w-full p-3 border rounded-md dark:bg-gray-700 dark:border-gray-600'
              >
                <option value="">Select nationality</option>
                <option value="rwandan">Rwandan</option>
                <option value="kenyan">Kenyan</option>
                <option value="ugandan">Ugandan</option>
                <option value="tanzanian">Tanzanian</option>
                <option value="other">Other</option>
              </select>
            ) : (
              <p className='p-3 bg-gray-50 dark:bg-gray-700 rounded-md'>{companyInfo.country || 'Not provided'}</p>
            )}
          </div>

          <div>
            <label className='block text-sm font-medium mb-2'>Legal Type</label>
            {isEditingCompany ? (
              <select
                name="legalType"
                value={companyFormData.legalType}
                onChange={handleCompanyInputChange}
                className='w-full p-3 border rounded-md dark:bg-gray-700 dark:border-gray-600'
              >
                <option value="">Select legal type</option>
                {Object.entries(ELegalType).map(([key, value]) => (
                  <option key={value} value={value}>
                    {key.split('_').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ')}
                  </option>
                ))}
              </select>
            ) : (
              <p className='p-3 bg-gray-50 dark:bg-gray-700 rounded-md'>
                {companyFormData.legalType ?
                  companyFormData.legalType.split('_').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ')
                  : 'Not provided'
                }
              </p>
            )}
          </div>

          <div>
            <label className='block text-sm font-medium mb-2'>Registration Number</label>
            {isEditingCompany ? (
              <input
                type="text"
                name="TIN"
                value={companyFormData.TIN}
                onChange={handleCompanyInputChange}
                className='w-full p-3 border rounded-md dark:bg-gray-700 dark:border-gray-600'
              />
            ) : (
              <p className='p-3 bg-gray-50 dark:bg-gray-700 rounded-md'>{companyInfo.TIN || 'Not provided'}</p>
            )}
          </div>

          <div>
            <label className='block text-sm font-medium mb-2'>Address</label>
            {isEditingCompany ? (
              <input
                type="text"
                name="address"
                value={companyFormData.address || ''}
                onChange={handleCompanyInputChange}
                className='w-full p-3 border rounded-md dark:bg-gray-700 dark:border-gray-600'
              />
            ) : (
              <p className='p-3 bg-gray-50 dark:bg-gray-700 rounded-md'>{companyInfo.address || 'Not provided'}</p>
            )}
          </div>

          <div>
            <label className='block text-sm font-medium mb-2'>Phone</label>
            {isEditingCompany ? (
              <input
                type="tel"
                name="phone"
                value={companyFormData.phone || ''}
                onChange={handleCompanyInputChange}
                className='w-full p-3 border rounded-md dark:bg-gray-700 dark:border-gray-600'
              />
            ) : (
              <p className='p-3 bg-gray-50 dark:bg-gray-700 rounded-md'>{companyInfo.phone || 'Not provided'}</p>
            )}
          </div>

          <div>
            <label className='block text-sm font-medium mb-2'>Email</label>
            {isEditingCompany ? (
              <input
                type="email"
                name="emailCompany"
                value={companyFormData.emailCompany || ''}
                onChange={handleCompanyInputChange}
                className='w-full p-3 border rounded-md dark:bg-gray-700 dark:border-gray-600'
              />
            ) : (
              <p className='p-3 bg-gray-50 dark:bg-gray-700 rounded-md'>{companyInfo.emailCompany || 'Not provided'}</p>
            )}
          </div>

          <div>
            <label className='block text-sm font-medium mb-2'>Creation Date</label>
            <p className='p-3 bg-gray-50 dark:bg-gray-700 rounded-md'>
              {companyFormData.createdAt ? new Date(companyFormData.createdAt).toLocaleDateString() : 'Not provided'}
            </p>
          </div>
        </div>

        {isEditingCompany && (
          <div className='flex gap-4 mt-6'>
            <button
              onClick={handleSaveCompany}
              className='bg-primary text-primary-foreground px-6 py-2 rounded-md hover:bg-primary/90 transition-colors flex items-center gap-2'
            >
              <Save className='size-4' />
              Save Changes
            </button>
            <button
              onClick={handleCancelCompanyEdit}
              className='bg-gray-200 text-gray-700 px-6 py-2 rounded-md hover:bg-gray-300 transition-colors flex items-center gap-2'
            >
              <X className='size-4' />
              Cancel
            </button>
          </div>
        )}
      </div>

      {/* Representatives Section */}
      <div className='bg-white dark:bg-gray-800 rounded-lg shadow-sm p-6'>
        <div className='flex justify-between items-center mb-6'>
          <h3 className='text-xl font-semibold flex items-center gap-2'>
            <User className='size-5' />
            Company Representatives
          </h3>
          <button
            onClick={() => setIsAddingRep(true)}
            className='bg-primary text-primary-foreground px-4 py-2 rounded-md hover:bg-primary/90 transition-colors flex items-center gap-2'
          >
            <Plus className='size-4' />
            Add Representative
          </button>
        </div>

        {/* Add New Representative Form */}
        {isAddingRep && (
          <div className='mb-6 p-4 border rounded-lg bg-gray-50 dark:bg-gray-700'>
            <h4 className='text-lg font-medium mb-4'>Add New Representative</h4>
            <div className='grid md:grid-cols-2 gap-4'>
              <div>
                <label className='block text-sm font-medium mb-2'>Full Name *</label>
                <input
                  type="text"
                  name="fullName"
                  value={newRepFormData.fullname}
                  onChange={handleRepInputChange}
                  className='w-full p-2 border rounded-md dark:bg-gray-600 dark:border-gray-500'
                  required
                />
              </div>
              <div>
                <label className='block text-sm font-medium mb-2'>ID/Passport *</label>
                <input
                  type="text"
                  name="nationalId"
                  value={newRepFormData.nationalId}
                  onChange={handleRepInputChange}
                  className='w-full p-2 border rounded-md dark:bg-gray-600 dark:border-gray-500'
                />
              </div>
              <div>
                <label className='block text-sm font-medium mb-2'>Phone *</label>
                <input
                  type="tel"
                  name="telephone"
                  value={newRepFormData.telephone}
                  onChange={handleRepInputChange}
                  className='w-full p-2 border rounded-md dark:bg-gray-600 dark:border-gray-500'
                  required
                />
              </div>
              <div>
                <label className='block text-sm font-medium mb-2'>Email *</label>
                <input
                  type="email"
                  name="email"
                  value={userFormData.email}
                  onChange={handleRepInputChange}
                  className='w-full p-2 border rounded-md dark:bg-gray-600 dark:border-gray-500'
                  required
                />
              </div>
              <div>
                <label className='block text-sm font-medium mb-2'>Language</label>
                <select
                  name="communicationLanguage"
                  value={newRepFormData.communicationLanguage}
                  onChange={handleRepInputChange}
                  className='w-full p-2 border rounded-md dark:bg-gray-600 dark:border-gray-500'
                >
                  <option value="English">English</option>
                  <option value="Kinyarwanda">Kinyarwanda</option>
                  <option value="French">French</option>
                  <option value="Swahili">Swahili</option>
                </select>
              </div>
              <div>
                <label className='block text-sm font-medium mb-2'>Role</label>
                <input
                  type="text"
                  name="role"
                  value={newRepFormData.status}
                  onChange={handleRepInputChange}
                  className='w-full p-2 border rounded-md dark:bg-gray-600 dark:border-gray-500'
                />
              </div>
            </div>
            <div className='flex gap-4 mt-4'>
              <button
                onClick={handleAddRepresentative}
                className='bg-green-600 text-white px-4 py-2 rounded-md hover:bg-green-700 transition-colors'
              >
                Add Representative
              </button>
              <button
                onClick={() => setIsAddingRep(false)}
                className='bg-gray-500 text-white px-4 py-2 rounded-md hover:bg-gray-600 transition-colors'
              >
                Cancel
              </button>
            </div>
          </div>
        )}

        {/* Representatives Table */}
        {representatives.length > 0 ? (
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Name</TableHead>
                <TableHead>Contact</TableHead>
                <TableHead>Language</TableHead>
                <TableHead>Role</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {representatives.map((rep) => (
                <TableRow key={rep.id}>
                  <TableCell>
                    <div>
                      <div className='font-medium'>{rep.fullname}</div>
                      <div className='text-sm text-muted-foreground'>{rep.nationalId}</div>
                    </div>
                  </TableCell>
                  <TableCell>
                    <div>
                      <div className='font-medium'>{rep.telephone}</div>
                    </div>
                  </TableCell>
                  <TableCell>
                    <Badge variant="outline">{rep.communicationLanguage}</Badge>
                  </TableCell>
                  <TableCell>
                    <Badge variant="secondary">{rep.status}</Badge>
                  </TableCell>
                  <TableCell>
                    <div className='flex gap-2'>
                      <button
                        onClick={() => handleDeleteRepresentative()}
                        className='text-red-600 hover:text-red-800 p-1'
                        title="Remove representative"
                      >
                        <Trash2 className='size-4' />
                      </button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        ) : (
          <div className='text-center py-8'>
            <User className='size-12 text-gray-400 mx-auto mb-4' />
            <h4 className='text-lg font-medium text-gray-900 dark:text-white mb-2'>No Representatives Added</h4>
            <p className='text-gray-600 dark:text-gray-400 mb-4'>Add company representatives to manage communications and operations.</p>
          </div>
        )}
      </div>
    </div>
  )
}
