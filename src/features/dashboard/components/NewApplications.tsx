import { fetchApplications } from '@/action/Application'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import React from 'react'

import ReasonCell from './ReasonCell'
import { Prisma } from '@prisma/client'

import PaginationControls from './PaginationControls'

interface NewApplicationsProps {
  filterStatus?: string
  page?: number
  limit?: number
}

export default async function NewApplications({ filterStatus, page = 1, limit = 5 }: NewApplicationsProps) {
  const whereClause: Prisma.ApplicationWhereInput = filterStatus
    ? {
      LicenseApplication: {
        some: {
          status: filterStatus as any // Casting to match enum, validation handled by Prisma or ignored if invalid
        }
      }
    }
    : {}

  const skip = (page - 1) * limit

  const { data: applications, pagination } = await fetchApplications(
    {
      id: true,
      name: true,
      createdAt: true,
      company: {
        select: {
          operator: {
            select: {
              username: true
            }
          }
        }
      },
      LicenseApplication: {
        select: {
          status: true,
          reason: true
        },
        take: 1
      }
    },
    whereClause,
    limit,
    skip,
    { createdAt: 'desc' }
  )

  const totalPages = Math.ceil(pagination.total / limit)
  const hasNextPage = page < totalPages
  const hasPrevPage = page > 1

  return (
    <Card>
      <CardHeader>
        <CardTitle>New Applications {filterStatus ? `(${filterStatus})` : ''}</CardTitle>
      </CardHeader>
      <CardContent>
        <div>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>User</TableHead>
                <TableHead>License</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Date Submitted</TableHead>
                <TableHead>Reason</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {applications.length > 0 ? (
                applications.map((application) => {
                  const licenseApp = application.LicenseApplication[0]
                  const status = licenseApp?.status || 'PENDING'
                  const reason = licenseApp?.reason || null

                  return (
                    <TableRow key={application.id}>
                      <TableCell>{application.company?.operator?.username || 'Unknown User'}</TableCell>
                      <TableCell>{application.name}</TableCell>
                      <TableCell>
                        <Badge
                          variant={status === 'REJECTED' ? 'destructive' : 'secondary'}
                          className={status === 'APPROVED' ? 'bg-green-500 hover:bg-green-600' : ''}
                        >
                          {status}
                        </Badge>
                      </TableCell>
                      <TableCell>{new Date(application.createdAt).toLocaleDateString()}</TableCell>
                      <TableCell>
                        <ReasonCell reason={reason} />
                      </TableCell>
                    </TableRow>
                  )
                })
              ) : (
                <TableRow>
                  <TableCell colSpan={5} className="text-center text-muted-foreground h-24">
                    No {filterStatus ? filterStatus.toLowerCase() : 'new'} applications found.
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>

          {pagination.total > 0 && (
            <PaginationControls
              hasNextPage={hasNextPage}
              hasPrevPage={hasPrevPage}
              total={pagination.total}
              page={page}
              limit={limit}
            />
          )}
        </div>
      </CardContent>
    </Card>
  )
}
