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
            '#',
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

        initialData.forEach((row, index) => {
            const company = row.applicationType?.company;
            const operator = company?.operator;
            const appType = row.applicationType?.name;

            const rowData = [
                `"${index + 1}"`,
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

    const exportToPDF = async () => {
        if (!initialData || initialData.length === 0) return;

        const { default: jsPDF } = await import('jspdf');
        const { default: autoTable } = await import('jspdf-autotable');

        const doc = new jsPDF();
        const pageWidth = doc.internal.pageSize.width;
        let startY = 10;

        // Load RURA Logo
        const loadImg = (src: string) => new Promise<HTMLImageElement>((resolve, reject) => {
            const img = new window.Image();
            img.onload = () => resolve(img);
            img.onerror = reject;
            img.src = src;
        });

        try {
            const logo = await loadImg('/rura-logoBG.png');
            const imgWidth = logo.naturalWidth || logo.width;
            const imgHeight = logo.naturalHeight || logo.height;
            const ratio = imgWidth / imgHeight;
            
            // Set max height for the logo
            const targetHeight = 18;
            const targetWidth = targetHeight * ratio;
            
            // Adding Logo centered horizontally
            doc.addImage(logo, 'PNG', (pageWidth - targetWidth) / 2, startY, targetWidth, targetHeight); 
            
            startY += targetHeight + 6; // Space below logo
        } catch (e) {
            console.error("Failed to load logo", e);
            startY += 8;
        }

        // Letterhead Details - Centered
        doc.setFontSize(14);
        doc.setFont('helvetica', 'bold');
        doc.setTextColor(33, 37, 41);
        doc.text('RWANDA UTILITIES REGULATORY AUTHORITY (RURA)', pageWidth / 2, startY, { align: 'center' });

        startY += 6;
        doc.setFontSize(10);
        doc.setFont('helvetica', 'normal');
        doc.setTextColor(80, 80, 80);
        doc.text('Toll Free: 3988 | 2222 (Transport)', pageWidth / 2, startY, { align: 'center' });
        
        startY += 5;
        doc.text('Phone: (+250) 252 584 562 | Fax: (+250) 252 584 563', pageWidth / 2, startY, { align: 'center' });
        
        startY += 5;
        doc.text('P.o.Box: 7289 Kigali-Rwanda | Email: info@rura.rw', pageWidth / 2, startY, { align: 'center' });

        startY += 8;

        // Line separator
        doc.setDrawColor(41, 128, 185); // Blue line to match header
        doc.setLineWidth(1);
        doc.line(14, startY, 196, startY);

        startY += 10;

        // Title
        doc.setFontSize(14);
        doc.setFont('helvetica', 'bold');
        doc.setTextColor(40, 40, 40);
        doc.text('APPLICATION REPORTS', pageWidth / 2, startY, { align: 'center' });

        startY += 8;

        // Filters info
        doc.setFontSize(9);
        doc.setFont('helvetica', 'normal');
        doc.setTextColor(100, 100, 100);
        const filtersText = `Filters - Status: ${status || 'All'} | Type: ${type || 'All'} | Dates: ${startDate || 'N/A'} to ${endDate || 'N/A'}`;
        doc.text(filtersText, 14, startY);
        
        startY += 5;
        doc.text(`Generated on: ${new Date().toLocaleString()}`, 14, startY);

        // Table Data
        const tableData = initialData.map((row, index) => {
            const company = row.applicationType?.company;
            const operator = company?.operator;
            const appType = row.applicationType?.name;

            return [
                (index + 1).toString(),
                `Name: ${company?.name || 'N/A'}\nTIN: ${company?.TIN || 'N/A'}\nRep: ${operator?.username || 'N/A'}`,
                `Tel: ${company?.phone || 'N/A'}\nEmail: ${company?.emailCompany || 'N/A'}`,
                `Type: ${appType || 'N/A'}\nStatus: ${row.status || 'N/A'}\nDate: ${new Date(row.createdAt).toLocaleDateString()}`,
                row.reason ? `Reason: ${row.reason}` : 'No reason provided'
            ]
        });

        autoTable(doc, {
            startY: startY + 4,
            head: [['No.', 'Business Information', 'Contact', 'Business Status', 'Additional Details']],
            body: tableData,
            theme: 'grid',
            styles: {
                font: 'helvetica',
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
                0: { cellWidth: 18, halign: 'center' },
                1: { cellWidth: 45 },
                2: { cellWidth: 40 },
                3: { cellWidth: 40 },
                4: { cellWidth: 'auto' },
            },
            alternateRowStyles: {
                fillColor: [245, 247, 250]
            },
        });

        doc.save(`admin_reports_${new Date().toISOString().split('T')[0]}.pdf`);
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
                            <TableHead className="w-[50px]">#</TableHead>
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
                                <TableCell colSpan={9} className="text-center py-6 text-muted-foreground">
                                    No applications found matching the selected filters.
                                </TableCell>
                            </TableRow>
                        ) : (
                            initialData.map((row, index) => (
                                <TableRow key={row.id}>
                                    <TableCell>{index + 1}</TableCell>
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
