"use client"

import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { Badge } from '@/components/ui/badge'
import { Building, User, Phone, Mail, MapPin, FileIcon } from 'lucide-react'
import { useState, useEffect } from 'react'
import { fetchCompanies } from '@/action/Company'
import { fetchRequiredDocuments } from '@/action/RequiredDocument'

interface Company {
  id: string
  name: string
  legalType: string
  TIN: string
  country: string
}

interface RequiredDocument {
  id: string
  name: string
  description?: string | null
  file: Uint8Array<ArrayBufferLike>
  documentType: string
  company: Company[]
  createdAt: Date
}

export default function DocumentDataTable() {
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
        company: { select: { id:true, name: true, legalType: true, TIN: true, country:true}},
        createdAt: true
      })
      setDocument(
        resDoc.data.map((document:any)=>({
          ...document,
          company: Array.isArray(document.company) ? document.company : [document.company]
        }))
      )
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
          <TableHead>Document Type</TableHead>
          <TableHead>Files</TableHead>
          <TableHead>submitted at</TableHead>
          <TableHead>Actions</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {documents.map((document) =>
          <TableRow key={document.id}>
            <TableCell>
              <div className='flex items-start gap-3'>
                <div className='bg-blue-100 dark:bg-blue-900 p-2 rounded-lg'>
                  <Building className='size-4 text-blue-600 dark:text-blue-400' />
                </div>
                <div>
                  <div className='font-medium text-gray-900 dark:text-white'>
                    {document.company[0].name}
                  </div>
                  <div className='text-sm text-gray-600 dark:text-gray-400'>
                    {document.company[0].legalType?.replace(/_/g, ' ').toUpperCase()}
                  </div>
                </div>
              </div>

            </TableCell>
            <TableCell>
              <div className='flex items-start gap-3 p-2'>
                <FileIcon className='size-4 text-blue-600 dark:text-blue-400'/>
              </div>
              <span>{document.documentType}</span>

            </TableCell>
            <TableCell>
              <div className="flex flex-col items-center justify-center gap-3 p-2">
                <FileIcon className="size-4 text-blue-600 dark:text-blue-400" />
                <span>{document.name}</span>
                <a
                  href={URL.createObjectURL(new Blob([new Uint8Array(document.file)]))}
                  download={document.name || "document"}
                  className="text-blue-600 hover:underline"
                >
                  Download
                </a>
              </div>
            </TableCell>

            <TableCell>
              <div className='space-y-1'>
                <div className='text-sm font-medium'>
                  {new Date(document.createdAt).toLocaleDateString()}
                </div>
                <div className='text-xs text-gray-600'>
                  Created at: {document.createdAt.toLocaleDateString()} at {document.createdAt.toLocaleTimeString()}
                </div>
              </div>
            </TableCell>
            
            <TableCell>
              <div className='space-y-1'>
                <div className='text-sm font-medium'>
                  {new Date(document.createdAt).toLocaleDateString()}
                </div>
                <div className='text-xs text-gray-600'>
                  Submitted at: {document.createdAt.toLocaleDateString()} at {document.createdAt.toLocaleTimeString()}
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
