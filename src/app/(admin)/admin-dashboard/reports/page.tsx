import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import React from 'react'
import AdminReportsClient from '@/features/dashboard/components/AdminReportsClient'
import prisma from '@/lib/prisma'
import { ApplicationStatus } from '@prisma/client'

export default async function ReportsPage({
    searchParams,
}: {
    searchParams: Promise<{ [key: string]: string | string[] | undefined }>
}) {
    const p = await searchParams;
    const startDate = typeof p.startDate === 'string' ? new Date(p.startDate) : undefined;
    const endDate = typeof p.endDate === 'string' ? new Date(p.endDate) : undefined;
    const status = typeof p.status === 'string' ? p.status as ApplicationStatus : undefined;
    const type = typeof p.type === 'string' ? p.type : undefined;

    const whereClause: any = {};

    if (startDate && endDate) {
        if (!isNaN(startDate.getTime()) && !isNaN(endDate.getTime())) {
            const adjustedEndDate = new Date(endDate);
            adjustedEndDate.setHours(23, 59, 59, 999);
            whereClause.createdAt = {
                gte: startDate,
                lte: adjustedEndDate,
            };
        }
    }

    if (status) {
        whereClause.status = status;
    }

    if (type) {
        whereClause.applicationType = {
            name: type
        };
    }

    // Fetch data
    const reports = await prisma.applicationDocument.findMany({
        where: whereClause,
        include: {
            applicationType: {
                include: {
                    company: {
                        include: {
                            operator: true,
                        }
                    }
                }
            },
        },
        orderBy: {
            createdAt: 'desc',
        }
    });

    // Fetch application types for the filter dropdown
    const applicationTypes = await prisma.application.findMany({
        distinct: ['name'],
        select: {
            name: true,
        }
    });


    return (
        <main className='grid gap-6 px-4'>
            <div>
                <h2 className='text-2xl capitalize font-bold'>Reports</h2>
            </div>
            <div>
                <Card>
                    <CardHeader>
                        <CardTitle>Application Reports</CardTitle>
                    </CardHeader>
                    <CardContent className='grid gap-6'>
                        {/* Pass data to client component for rendering and exporting */}
                        <AdminReportsClient
                            initialData={reports}
                            applicationTypes={applicationTypes.map(a => a.name)}
                        />
                    </CardContent>
                </Card>
            </div>
        </main>
    )
}
