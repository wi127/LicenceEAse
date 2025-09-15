"use client"

import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { Badge } from '@/components/ui/badge'
import { Building, User, Phone, Mail, MapPin } from 'lucide-react'
import { useState, useEffect } from 'react'
import { fetchCompanies } from '@/action/Company'
import { fetchRequiredDocuments } from '@/action/RequiredDocument'

interface RequiredDocument {
  id: string
  name: string
  description?: string | null
  file: Uint8Array<ArrayBufferLike>
  documentType: string
}

export default function CompaniesDataTable() {
  const [documents, setDocument] = useState<RequiredDocument[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
  const fetchData = async () => {
    try {
      setLoading(true)
      setError(null)
      const resDoc = await fetchRequiredDocuments({
        id: true,
        name: true,
        description: true,
        file: true,
        documentType: true,
      })
      setDocument(resDoc.data)
    } catch (err) {
      console.error('Error fetching documents:', err)
      if (error){
        setError('Failed to load documents')
      }
    } finally {
      setLoading(false)
    }
  }

    fetchData()
  }, [])

  if (loading) {
    return (
      <div className="text-center py-8">
        <div className="text-gray-500">Loading documents...</div>
      </div>
    )
  }


  if (documents.length === 0) {
    return (
      <div className="text-center py-12">
        <Building className="size-12 text-gray-400 mx-auto mb-4" />
        <h3 className="text-lg font-medium text-gray-900 mb-2">No Documents are saved</h3>
      </div>
    )
  }

  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>Company</TableHead>
          <TableHead>File Name</TableHead>
          <TableHead>Document type</TableHead>
          <TableHead>File</TableHead>
          <TableHead>submitted at</TableHead>
          <TableHead>Actions</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {documents.map((company) =>
          <TableRow key={company.id}>
            <TableCell>
              <div className='flex items-start gap-3'>
                <div className='bg-blue-100 dark:bg-blue-900 p-2 rounded-lg'>
                  <Building className='size-4 text-blue-600 dark:text-blue-400' />
                </div>
                <div>
                  <div className='font-medium text-gray-900 dark:text-white'>
                    {company.name}
                  </div>
                  <div className='text-sm text-gray-600 dark:text-gray-400'>
                    {company.legalType?.replace(/_/g, ' ').toUpperCase()}
                  </div>
                  <div className='text-xs text-gray-500 mt-1'>
                    TIN: {company.TIN} • Country: {company.country  || 'N/A'}
                  </div>
                </div>
              </div>
            </TableCell>
            
            <TableCell>
              <div className='space-y-1'>
                <div className='flex items-center gap-2 text-sm'>
                  <Mail className='size-3 text-gray-400' />
                  {company.emailCompany}
                </div>
                <div className='flex items-center gap-2 text-sm'>
                  <Phone className='size-3 text-gray-400' />
                  {company.phone}
                </div>
                <div className='flex items-center gap-2 text-sm'>
                  <MapPin className='size-3 text-gray-400' />
                  {company.address}
                </div>
              </div>
            </TableCell>
            
            <TableCell>
              <div className='space-y-2'>
                {company.operator && company.operator.length > 0 ? (
                  <>
                    <div className='text-sm font-medium'>
                      {company.operator.length} Representative{company.operator.length > 1 ? 's' : ''}
                    </div>
                    <div className='space-y-1'>
                      {company.operator.slice(0, 2).map((rep) => (
                        <div key={rep.id} className='flex items-center gap-2'>
                          <User className='size-3 text-gray-400' />
                          <div>
                            <div className='text-sm font-medium'>{rep.username}</div>
                            <div className='text-xs text-gray-600'>
                              {rep.role} • {rep.email}
                            </div>
                          </div>
                        </div>
                      ))}
                      {company.operator.length > 2 && (
                        <div className='text-xs text-gray-500'>
                          +{company.operator.length - 2} more
                        </div>
                      )}
                    </div>
                  </>
                ) : (
                  <span className='text-sm text-gray-500'>No representatives</span>
                )}
              </div>
            </TableCell>
            
            <TableCell>
              <div className='space-y-1'>
                <div className='text-sm font-medium'>
                  {new Date(company.createdAt).toLocaleDateString()}
                </div>
                <div className='text-xs text-gray-600'>
                  Submitted by: {company.createdAt.toLocaleDateString()} at {company.createdAt.toLocaleTimeString()}
                </div>
              </div>
            </TableCell>

            <TableCell>
              <div className='flex gap-2'>
                <button className='text-blue-600 hover:text-blue-800 text-sm font-medium'>
                  View
                </button>
                <button className='text-red-600 hover:text-red-800 text-sm font-medium'>
                  Delete
                </button>
              </div>
            </TableCell>
            
            {/* <TableCell>
              <Badge variant={company.status === 'active' ? 'default' : 'secondary'}>
                {company.status}
              </Badge>
            </TableCell> */}
          </TableRow>
        )}
      </TableBody>
    </Table>
  )
}
