"use client"

import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { User, Building } from 'lucide-react'
import { useState, useEffect } from 'react'
import { fetchApplications } from '@/action/Application'

interface Application {
  id: string 
  name: string
  processingTime: number
  validityMonths: number
  applicationFee: number
  company: { name: string, operator: { username: string, email: string } } | null
  description: string
  createdAt: Date
}

export default function ApplicationsDataTable() {
  const [applications, setApplications] = useState<Application[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
      const fetchData = async () => {
        try {
          setLoading(true)
          setError(null)
          
          const res =  await fetchApplications({
            id: true,
            name: true,
            processingTime: true,
            applicationFee: true,
            validityMonths: true,
            company: { select: { name: true, operator: {select :{username: true, email: true}} } },
            description: true,  
            createdAt: true,   
          })
  
          setApplications(res.data)
        } catch (err) {
          console.error('Failed to fetch application:', err)
          setError(err instanceof Error ? err.message : 'Failed to load applications')
          setApplications([])
        } finally {
          setLoading(false)
        }
      }
  
      fetchData()
    }, [])


  if (loading) {
    return (
      <div className="text-center py-8">
        <div className="flex items-center justify-center">
          <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-primary"></div>
          <span className="ml-2">Loading applications...</span>
        </div>
      </div>
    )
  }



  return (
    <Table className='w-full min-w-[769px]'>
      <TableHeader>
        <TableRow>
          <TableHead>Applicant</TableHead>
          <TableHead>License Type</TableHead>
          <TableHead>Company</TableHead>
          <TableHead>processingTime</TableHead>
          <TableHead>applicationFee</TableHead>
          <TableHead>validityMonths</TableHead>
          <TableHead>createdAt</TableHead>
          <TableHead>Actions</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {applications.map((application) =>
          <TableRow key={application.id}>
            <TableCell>
              <div className='flex items-center gap-3'>
                <div className='bg-blue-100 dark:bg-blue-900 p-2 rounded-lg'>
                  <User className='size-4 text-blue-600 dark:text-blue-400' />
                </div>
                <div>
                  <div className='font-medium'>{application.company?.operator.username}</div>
                  <div className='text-sm text-gray-600 dark:text-gray-400'>{application.company?.operator.email}</div>
                </div>
              </div>
            </TableCell>
            <TableCell>
              <div className='font-medium'>{application.name}</div>
              <div className='text-sm text-gray-600 dark:text-gray-400 line-clamp-2'>
                {application.description?.substring(0, 100)}
                {application.description?.length > 100 && '...'}
              </div>
            </TableCell>
            <TableCell>
              <div className='flex items-center justify-center gap-2'>
                <div className='bg-blue-100 dark:bg-blue-900 p-2 rounded-lg'>
                  <Building className='size-5 text-blue-600 dark:text-blue-400' />  
                </div>    
                <span>{application.company?.name || 'Not company name'}</span>
              </div>
            </TableCell>
            <TableCell>
              <div className='flex items-center justify-center gap-2'>
                <span>{application.processingTime || 'Not processing time'}</span>
              </div>
            </TableCell>
            <TableCell>
              <div className='flex items-center justify-center gap-2'>
                <span>{application.applicationFee || 'Not application fee'}</span>
              </div>
            </TableCell>
            <TableCell>
              <div className='flex items-center justify-center gap-2'>
                <span>{application.validityMonths || 'Not validity months'}</span>
              </div>
            </TableCell>
            {/* <TableCell>
              <Badge variant={
                application.status === 'approved' ? 'default' :
                application.status === 'rejected' ? 'destructive' :
                application.status === 'pending' ? 'secondary' :
                'outline'
              }>
                {application.status}
              </Badge>
            </TableCell> */}
            <TableCell>
              <div className='text-sm'>
                {new Date(application.createdAt).toLocaleDateString()}
              </div>
              <div className='text-xs text-gray-500'>
                {new Date(application.createdAt).toLocaleTimeString()}
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
          </TableRow>
        )}
      </TableBody>
    </Table>
  )
}
