'use client'

import React, { useState } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select'
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from '@/components/ui/table'
import { Badge } from '@/components/ui/badge'
import ReasonCell from '@/features/dashboard/components/ReasonCell'
import { Download } from 'lucide-react'

interface AdminReportsClientProps {
    initialData: any[] // We'll type this loosely as prisma objects are returned
    applicationTypes: string[]
}

export default function AdminReportsClient({
    initialData,
    applicationTypes,
}: AdminReportsClientProps) {
    const router = useRouter()
    const searchParams = useSearchParams()

    const [startDate, setStartDate] = useState(searchParams.get('startDate') || '')
    const [endDate, setEndDate] = useState(searchParams.get('endDate') || '')
    const [status, setStatus] = useState(searchParams.get('status') || '')
    const [type, setType] = useState(searchParams.get('type') || '')

    const handleFilter = () => {
        const params = new URLSearchParams()
        if (startDate) params.set('startDate', startDate)
        if (endDate) params.set('endDate', endDate)
        if (status && status !== 'ALL') params.set('status', status)
        if (type && type !== 'ALL') params.set('type', type)

        router.push(`/admin-dashboard/reports?${params.toString()}`)
    }

    const handleClearFilters = () => {
        setStartDate('')
        setEndDate('')
        setStatus('')
        setType('')
        router.push(`/admin-dashboard/reports`)
    }

    const exportToCSV = () => {
        if (!initialData || initialData.length === 0) return;

        const headers = [
            'Company Name',
            'TIN',
            'Representative',
            'Telephone',
            'Email',
            'Application Type',
            'Status',
            'Reason',
            'Date Submitted'
        ];

        const csvRows = [
            headers.join(','), // header row
        ];

        initialData.forEach((row) => {
            const company = row.applicationType?.company;
            const operator = company?.operator;
            const appType = row.applicationType?.name;

            const rowData = [
                `"${company?.name || ''}"`,
                `"${company?.TIN || ''}"`,
                `"${operator?.username || ''}"`,
                `"${company?.phone || ''}"`,
                `"${company?.emailCompany || ''}"`,
                `"${appType || ''}"`,
                `"${row.status || ''}"`,
                `"${row.reason ? row.reason.replace(/"/g, '""') : ''}"`, // escape quotes
                `"${new Date(row.createdAt).toLocaleDateString()}"`,
            ];
            csvRows.push(rowData.join(','));
        });

        const csvContent = csvRows.join('\n');
        const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
        const url = URL.createObjectURL(blob);

        // Create link, click it, and cleanup
        const link = document.createElement('a');
        link.href = url;
        link.setAttribute('download', `admin_reports_${new Date().toISOString().split('T')[0]}.csv`);
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        URL.revokeObjectURL(url);
    }

    const exportToPDF = () => {
        if (!initialData || initialData.length === 0) return;

        import('jspdf').then(({ default: jsPDF }) => {
            import('jspdf-autotable').then(({ default: autoTable }) => {
                const doc = new jsPDF();

                // Add header
                doc.setFontSize(20);
                doc.setTextColor(40, 40, 40);
                doc.text('Application Reports', 14, 22);

                // Add filters info
                doc.setFontSize(10);
                doc.setTextColor(100, 100, 100);
                const filtersText = `Filters - Status: ${status || 'All'}, Type: ${type || 'All'}, Dates: ${startDate || 'N/A'} to ${endDate || 'N/A'}`;
                doc.text(filtersText, 14, 30);

                // Add generation date
                doc.setFontSize(8);
                doc.text(`Generated on: ${new Date().toLocaleString()}`, 14, 35);

                const tableData = initialData.map((row) => {
                    const company = row.applicationType?.company;
                    const operator = company?.operator;
                    const appType = row.applicationType?.name;

                    return [
                        // Business Info
                        `Name: ${company?.name || 'N/A'}\nTIN: ${company?.TIN || 'N/A'}\nRep: ${operator?.username || 'N/A'}`,
                        // Contact Info
                        `Tel: ${company?.phone || 'N/A'}\nEmail: ${company?.emailCompany || 'N/A'}`,
                        // Status Info
                        `Type: ${appType || 'N/A'}\nStatus: ${row.status || 'N/A'}\nDate: ${new Date(row.createdAt).toLocaleDateString()}`,
                        // Reason
                        row.reason ? `Reason: ${row.reason}` : 'No reason provided'
                    ]
                });

                autoTable(doc, {
                    startY: 40,
                    head: [['Business Information', 'Contact', 'Business Status', 'Additional Details']],
                    body: tableData,
                    theme: 'grid',
                    styles: {
                        fontSize: 9,
                        cellPadding: 4,
                        lineColor: [200, 200, 200],
                        lineWidth: 0.1,
                    },
                    headStyles: {
                        fillColor: [41, 128, 185],
                        textColor: 255,
                        fontSize: 10,
                        fontStyle: 'bold',
                        halign: 'left'
                    },
                    columnStyles: {
                        0: { cellWidth: 50 },
                        1: { cellWidth: 45 },
                        2: { cellWidth: 45 },
                        3: { cellWidth: 'auto' },
                    },
                    alternateRowStyles: {
                        fillColor: [245, 247, 250]
                    },
                });

                doc.save(`admin_reports_${new Date().toISOString().split('T')[0]}.pdf`);
            });
        });
    }

    return (
        <div className="space-y-6">
            {/* Filters Section */}
            <div className="grid grid-cols-1 md:grid-cols-5 gap-4 items-end bg-gray-50 p-4 rounded-lg border dark:bg-gray-800/50">
                <div className="space-y-2">
                    <Label htmlFor="startDate">Start Date</Label>
                    <Input
                        type="date"
                        id="startDate"
                        value={startDate}
                        onChange={(e) => setStartDate(e.target.value)}
                    />
                </div>

                <div className="space-y-2">
                    <Label htmlFor="endDate">End Date</Label>
                    <Input
                        type="date"
                        id="endDate"
                        value={endDate}
                        onChange={(e) => setEndDate(e.target.value)}
                    />
                </div>

                <div className="space-y-2">
                    <Label htmlFor="status">Status</Label>
                    <Select value={status} onValueChange={setStatus}>
                        <SelectTrigger id="status">
                            <SelectValue placeholder="All Statuses" />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="ALL">All Statuses</SelectItem>
                            <SelectItem value="PENDING">Pending</SelectItem>
                            <SelectItem value="APPROVED">Approved</SelectItem>
                            <SelectItem value="REJECTED">Rejected</SelectItem>
                        </SelectContent>
                    </Select>
                </div>

                <div className="space-y-2">
                    <Label htmlFor="type">Application Type</Label>
                    <Select value={type} onValueChange={setType}>
                        <SelectTrigger id="type">
                            <SelectValue placeholder="All Types" />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="ALL">All Types</SelectItem>
                            {applicationTypes.map((t) => (
                                <SelectItem key={t} value={t}>{t}</SelectItem>
                            ))}
                        </SelectContent>
                    </Select>
                </div>

                <div className="flex space-x-2">
                    <Button onClick={handleFilter} className="w-full">Filter</Button>
                    <Button variant="outline" onClick={handleClearFilters} className="w-full">Clear</Button>
                </div>
            </div>

            <div className="flex justify-end gap-2">
                <Button onClick={exportToCSV} variant="secondary" className="gap-2" disabled={initialData.length === 0}>
                    <Download className="size-4" />
                    Export to CSV
                </Button>
                <Button onClick={exportToPDF} className="gap-2" disabled={initialData.length === 0}>
                    <Download className="size-4" />
                    Export to PDF
                </Button>
            </div>

            {/* Table Section */}
            <div className="rounded-md border">
                <Table>
                    <TableHeader>
                        <TableRow>
                            <TableHead>Company</TableHead>
                            <TableHead>TIN</TableHead>
                            <TableHead>Representative</TableHead>
                            <TableHead>Contact (Tel/Email)</TableHead>
                            <TableHead>App Type</TableHead>
                            <TableHead>Status</TableHead>
                            <TableHead>Date</TableHead>
                            <TableHead>Reason</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {initialData.length === 0 ? (
                            <TableRow>
                                <TableCell colSpan={8} className="text-center py-6 text-muted-foreground">
                                    No applications found matching the selected filters.
                                </TableCell>
                            </TableRow>
                        ) : (
                            initialData.map((row) => (
                                <TableRow key={row.id}>
                                    <TableCell className="font-medium">
                                        {row.applicationType?.company?.name || 'N/A'}
                                    </TableCell>
                                    <TableCell>
                                        {row.applicationType?.company?.TIN || 'N/A'}
                                    </TableCell>
                                    <TableCell>
                                        {row.applicationType?.company?.operator?.username || 'N/A'}
                                    </TableCell>
                                    <TableCell>
                                        <div className="text-sm">
                                            <div>{row.applicationType?.company?.phone || 'N/A'}</div>
                                            <div className="text-muted-foreground">{row.applicationType?.company?.emailCompany || 'N/A'}</div>
                                        </div>
                                    </TableCell>
                                    <TableCell>
                                        {row.applicationType?.name || 'N/A'}
                                    </TableCell>
                                    <TableCell>
                                        <Badge
                                            variant={row.status === 'REJECTED' ? 'destructive' : 'secondary'}
                                            className={row.status === 'APPROVED' ? 'bg-green-500 hover:bg-green-600' : ''}
                                        >
                                            {row.status}
                                        </Badge>
                                    </TableCell>
                                    <TableCell>
                                        {new Date(row.createdAt).toLocaleDateString()}
                                    </TableCell>
                                    <TableCell>
                                        <ReasonCell reason={row.reason} />
                                    </TableCell>
                                </TableRow>
                            ))
                        )}
                    </TableBody>
                </Table>
            </div>
        </div>
    )
}
