'use client'

import React, { useState, useEffect, useCallback } from 'react'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import {
  ChevronLeft,
  ChevronRight,
  MoreHorizontal,
  ArrowUpDown,
  Search,
  Loader2,
  Trash,
  Edit,
  User,
  Building
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { fetchApplications, deleteApplication } from '@/action/Application'
import { toast } from 'sonner'
import Link from 'next/link'
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from '@/components/ui/alert-dialog'
import { Badge } from '@/components/ui/badge'

import ReasonCell from '@/features/dashboard/components/ReasonCell'

interface Application {
  id: string
  name: string
  processingTime: number
  validityMonths: number
  applicationFee: number
  company: { name: string, operator: { username: string, email: string } } | null
  description: string
  createdAt: Date
  LicenseApplication: { status: string, reason: string | null }[]
}

export default function ApplicationsDataTable() {
  const [rows, setRows] = useState<Application[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const [page, setPage] = useState(0)
  const [pageSize, setPageSize] = useState(10)
  const [total, setTotal] = useState(0)
  const [search, setSearch] = useState('')
  const [debouncedSearch, setDebouncedSearch] = useState('')
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('desc')
  const [sortBy, setSortBy] = useState<string>('createdAt')

  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearch(search)
      setPage(0) 
    }, 500)
    return () => clearTimeout(timer)
  }, [search])

  const fetchData = useCallback(async () => {
    try {
      setLoading(true)
      setError(null)

      const skip = page * pageSize
      const orderBy = { [sortBy]: sortOrder }
      const where: any = debouncedSearch ? {
        OR: [
          { name: { contains: debouncedSearch, mode: 'insensitive' } },
          { company: { name: { contains: debouncedSearch, mode: 'insensitive' } } }
        ]
      } : undefined

      const res = await fetchApplications(
        {
          id: true,
          name: true,
          processingTime: true,
          applicationFee: true,
          validityMonths: true,
          company: { select: { name: true, operator: { select: { username: true, email: true } } } },
          description: true,
          createdAt: true,
          LicenseApplication: { select: { status: true, reason: true }, take: 1 }
        },
        where,
        pageSize,
        skip,
        orderBy
      )

      setRows(res.data as unknown as Application[])
      setTotal(res.pagination.total)
    } catch (err) {
      console.error('Failed to fetch applications:', err)
      setError(err instanceof Error ? err.message : 'Failed to load applications')
      setRows([])
      toast.error('Failed to load applications')
    } finally {
      setLoading(false)
    }
  }, [page, pageSize, debouncedSearch, sortOrder, sortBy])

  useEffect(() => {
    fetchData()
  }, [fetchData])

  const handleDelete = async (id: string) => {
    try {
      const res = await deleteApplication(id)
      if (res) {
        toast.success('Application deleted successfully')
        fetchData() // Refresh list
      } else {
        toast.error('Failed to delete application')
      }
    } catch (error) {
      console.error(error)
      toast.error('An error occurred while deleting')
    }
  }

  const toggleSort = (field: string) => {
    if (sortBy === field) {
      setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc')
    } else {
      setSortBy(field)
      setSortOrder('asc')
    }
  }

  const totalPages = Math.ceil(total / pageSize)

  return (
    <div className="space-y-4">
      {/* Filters & Actions */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="relative">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search application or company..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="pl-8 w-[300px]"
            />
          </div>
        </div>
      </div>

      <div className="rounded-md border bg-card">
        <Table className='min-w-[1000px]'>
          <TableHeader>
            <TableRow>
              <TableHead>Applicant</TableHead>
              <TableHead>
                <Button variant="ghost" onClick={() => toggleSort('name')} className="-ml-4">
                  License Type <ArrowUpDown className="ml-2 h-4 w-4" />
                </Button>
              </TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Reason</TableHead>
              <TableHead>Company</TableHead>
              <TableHead>Processing Time</TableHead>
              <TableHead>Fee</TableHead>
              <TableHead>Validity</TableHead>
              <TableHead>
                <Button variant="ghost" onClick={() => toggleSort('createdAt')} className="-ml-4">
                  Created At <ArrowUpDown className="ml-2 h-4 w-4" />
                </Button>
              </TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {loading ? (
              <TableRow>
                <TableCell colSpan={10} className="h-24 text-center">
                  <div className="flex items-center justify-center gap-2">
                    <Loader2 className="h-6 w-6 animate-spin text-primary" />
                    <span>Loading...</span>
                  </div>
                </TableCell>
              </TableRow>
            ) : error ? (
              <TableRow>
                <TableCell colSpan={10} className="h-24 text-center text-red-500">
                  {error}
                </TableCell>
              </TableRow>
            ) : rows.length === 0 ? (
              <TableRow>
                <TableCell colSpan={10} className="h-24 text-center text-muted-foreground">
                  No applications found.
                </TableCell>
              </TableRow>
            ) : (
              rows.map((application) => {
                const licenseApp = application.LicenseApplication[0]
                const status = licenseApp?.status || 'PENDING'
                const reason = licenseApp?.reason || null

                return (
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
                      <div className='text-sm text-gray-600 dark:text-gray-400 line-clamp-1 max-w-[200px]'>
                        {application.description}
                      </div>
                    </TableCell>
                    <TableCell>
                      <Badge
                        variant={status === 'REJECTED' ? 'destructive' : 'secondary'}
                        className={status === 'APPROVED' ? 'bg-green-500 hover:bg-green-600' : ''}
                      >
                        {status}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <ReasonCell reason={reason} />
                    </TableCell>
                    <TableCell>
                      <div className='flex items-center gap-2'>
                        <Building className='size-4 text-gray-500' />
                        <span>{application.company?.name || 'N/A'}</span>
                      </div>
                    </TableCell>
                    <TableCell>
                      <span>{application.processingTime || 0} days</span>
                    </TableCell>
                    <TableCell>
                      <span>{application.applicationFee || 0}</span>
                    </TableCell>
                    <TableCell>
                      <span>{application.validityMonths || 0} months</span>
                    </TableCell>
                    <TableCell>
                      <div className='flex flex-col'>
                        <span className="text-sm">{new Date(application.createdAt).toLocaleDateString()}</span>
                        <span className="text-xs text-muted-foreground">{new Date(application.createdAt).toLocaleTimeString()}</span>
                      </div>
                    </TableCell>
                    <TableCell className="text-right">
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" className="h-8 w-8 p-0">
                            <span className="sr-only">Open menu</span>
                            <MoreHorizontal className="h-4 w-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuLabel>Actions</DropdownMenuLabel>
                          <DropdownMenuItem asChild>
                            <Link href={`/admin-dashboard/applications/${application.id}`} className="flex items-center cursor-pointer">
                              <Edit className="mr-2 h-4 w-4" /> Edit
                            </Link>
                          </DropdownMenuItem>
                          <DropdownMenuSeparator />
                          <AlertDialog>
                            <AlertDialogTrigger asChild>
                              <div className="relative flex cursor-default select-none items-center rounded-sm px-2 py-1.5 text-sm outline-none transition-colors hover:bg-accent hover:text-accent-foreground data-[disabled]:pointer-events-none data-[disabled]:opacity-50 text-red-600 focus:text-red-600">
                                <Trash className="mr-2 h-4 w-4" /> Delete
                              </div>
                            </AlertDialogTrigger>
                            <AlertDialogContent>
                              <AlertDialogHeader>
                                <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
                                <AlertDialogDescription>
                                  This action cannot be undone. This will permanently delete the application
                                  <strong> {application.name}</strong>.
                                </AlertDialogDescription>
                              </AlertDialogHeader>
                              <AlertDialogFooter>
                                <AlertDialogCancel>Cancel</AlertDialogCancel>
                                <AlertDialogAction onClick={() => handleDelete(application.id)} className="bg-destructive hover:bg-destructive/90">
                                  Delete
                                </AlertDialogAction>
                              </AlertDialogFooter>
                            </AlertDialogContent>
                          </AlertDialog>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </TableCell>
                  </TableRow>
                )
              })
            )}
          </TableBody>
        </Table>
      </div>

      {/* Pagination Controls */}
      <div className="flex items-center justify-between px-2">
        <div className="text-sm text-muted-foreground">
          Showing {rows.length} of {total} results
        </div>
        <div className="flex items-center space-x-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => setPage((p) => Math.max(0, p - 1))}
            disabled={page === 0 || loading}
          >
            <ChevronLeft className="h-4 w-4" />
            Previous
          </Button>
          <div className="text-sm font-medium">
            Page {page + 1} of {Math.max(1, totalPages)}
          </div>
          <Button
            variant="outline"
            size="sm"
            onClick={() => setPage((p) => Math.min(totalPages - 1, p + 1))}
            disabled={page >= totalPages - 1 || loading}
          >
            Next
            <ChevronRight className="h-4 w-4" />
          </Button>
        </div>
      </div>
    </div>
  )
}
