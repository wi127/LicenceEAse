import { fetchApplications } from '@/action/Application'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import React from 'react'

export default async function NewApplications() {
  const { data: applications } = await fetchApplications(
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
    undefined,
    5,
    0,
    { createdAt: 'desc' }
  )

  return (
    <Card>
      <CardHeader>
        <CardTitle>New Applications</CardTitle>
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
                  const reason = licenseApp?.reason || '-'

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
                      <TableCell className="max-w-[200px] truncate" title={status === 'REJECTED' ? reason : ''}>
                        {status === 'REJECTED' ? reason : '-'}
                      </TableCell>
                    </TableRow>
                  )
                })
              ) : (
                <TableRow>
                  <TableCell colSpan={5} className="text-center text-muted-foreground h-24">
                    No new applications found.
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </div>
      </CardContent>
    </Card>
  )
}
