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
  Building,
  User,
  Phone,
  Mail,
  MapPin
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { fetchCompanies, deleteCompany } from '@/action/Company'
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

interface Representative {
  username: string
  id: string
  email: string
  role: string
}

interface Company {
  id: string
  name: string
  address: string
  legalType: string
  phone: string
  country: string
  TIN: string
  operator: Representative[]
  emailCompany: string
  createdAt: Date
}

export default function CompaniesDataTable() {
  const [rows, setRows] = useState<Company[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  // Pagination & Search
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
          { emailCompany: { contains: debouncedSearch, mode: 'insensitive' } },
          { TIN: { contains: debouncedSearch, mode: 'insensitive' } },
          { country: { contains: debouncedSearch, mode: 'insensitive' } }
        ]
      } : undefined

      const resCompany = await fetchCompanies(
        {
          id: true,
          name: true,
          address: true,
          legalType: true,
          phone: true,
          country: true,
          TIN: true,
          emailCompany: true,
          operator: { select: { username: true, id: true, email: true, role: true } },
          createdAt: true,
        },
        where,
        pageSize,
        skip,
        orderBy
      )

      setRows(
        resCompany.data.map((company: any) => ({
          ...company,
          operator: Array.isArray(company.operator) ? company.operator : [company.operator]
        })) as Company[]
      )
      setTotal(resCompany.pagination.total)

    } catch (err) {
      console.error('Error fetching companies:', err)
      setError(err instanceof Error ? err.message : 'Failed to load companies')
      setRows([])
      toast.error('Failed to load companies')
    } finally {
      setLoading(false)
    }
  }, [page, pageSize, debouncedSearch, sortOrder, sortBy])

  useEffect(() => {
    fetchData()
  }, [fetchData])

  const handleDelete = async (id: string) => {
    try {
      const res = await deleteCompany(id)
      if (res) {
        toast.success('Company deleted successfully')
        fetchData()
      } else {
        toast.error('Failed to delete company')
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
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="relative">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search company, email, TIN..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="pl-8 w-[300px]"
            />
          </div>
        </div>
      </div>

      <div className="rounded-md border bg-card">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>
                <Button variant="ghost" onClick={() => toggleSort('name')} className="-ml-4">
                  Company Information <ArrowUpDown className="ml-2 h-4 w-4" />
                </Button>
              </TableHead>
              <TableHead>Contact Details</TableHead>
              <TableHead>Representatives</TableHead>
              <TableHead>
                <Button variant="ghost" onClick={() => toggleSort('createdAt')} className="-ml-4">
                  Registration Info <ArrowUpDown className="ml-2 h-4 w-4" />
                </Button>
              </TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {loading ? (
              <TableRow>
                <TableCell colSpan={5} className="h-24 text-center">
                  <div className="flex items-center justify-center gap-2">
                    <Loader2 className="h-6 w-6 animate-spin text-primary" />
                    <span>Loading...</span>
                  </div>
                </TableCell>
              </TableRow>
            ) : error ? (
              <TableRow>
                <TableCell colSpan={5} className="h-24 text-center text-red-500">
                  {error}
                </TableCell>
              </TableRow>
            ) : rows.length === 0 ? (
              <TableRow>
                <TableCell colSpan={5} className="h-24 text-center text-muted-foreground">
                  No companies found.
                </TableCell>
              </TableRow>
            ) : (
              rows.map((company) => (
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
                          TIN: {company.TIN} • Country: {company.country || 'N/A'}
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
                        Submitted: {new Date(company.createdAt).toLocaleTimeString()}
                      </div>
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
                          <Link href={`/admin-dashboard/companies/${company.id}`} className="flex items-center cursor-pointer">
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
                                This action cannot be undone. This will permanently delete the company
                                <strong> {company.name}</strong>.
                              </AlertDialogDescription>
                            </AlertDialogHeader>
                            <AlertDialogFooter>
                              <AlertDialogCancel>Cancel</AlertDialogCancel>
                              <AlertDialogAction onClick={() => handleDelete(company.id)} className="bg-destructive hover:bg-destructive/90">
                                Delete
                              </AlertDialogAction>
                            </AlertDialogFooter>
                          </AlertDialogContent>
                        </AlertDialog>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </TableCell>
                </TableRow>
              ))
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
