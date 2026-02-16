"use client"

import { Button } from "@/components/ui/button"
import { ChevronLeft, ChevronRight } from "lucide-react"
import { useRouter, useSearchParams } from "next/navigation"

interface PaginationControlsProps {
    hasNextPage: boolean
    hasPrevPage: boolean
    total: number
    page: number
    limit: number
}

export default function PaginationControls({
    hasNextPage,
    hasPrevPage,
    total,
    page,
    limit,
}: PaginationControlsProps) {
    const router = useRouter()
    const searchParams = useSearchParams()

    const start = (page - 1) * limit + 1
    const end = Math.min(page * limit, total)

    const handlePageChange = (newPage: number) => {
        const params = new URLSearchParams(searchParams.toString())
        params.set("page", newPage.toString())
        router.push(`?${params.toString()}`)
    }

    return (
        <div className='flex items-center justify-between px-2 py-4'>
            <div className='text-sm text-muted-foreground'>
                Showing {Math.min(start, total)} to {end} of {total} results
            </div>
            <div className='flex items-center space-x-2'>
                <Button
                    variant='outline'
                    size='sm'
                    onClick={() => handlePageChange(page - 1)}
                    disabled={!hasPrevPage}
                >
                    <ChevronLeft className='h-4 w-4' />
                    Previous
                </Button>
                <Button
                    variant='outline'
                    size='sm'
                    onClick={() => handlePageChange(page + 1)}
                    disabled={!hasNextPage}
                >
                    Next
                    <ChevronRight className='h-4 w-4' />
                </Button>
            </div>
        </div>
    )
}
