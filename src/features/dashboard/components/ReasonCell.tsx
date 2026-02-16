"use client"

import { Button } from "@/components/ui/button"
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog"
import { FileText } from "lucide-react"
import { useState } from "react"

interface ReasonCellProps {
    reason: string | null
}

export default function ReasonCell({ reason }: ReasonCellProps) {
    const [isOpen, setIsOpen] = useState(false)

    if (!reason || reason === '-') {
        return <span className="text-muted-foreground">-</span>
    }

    const isLong = reason.length > 50

    return (
        <div className="flex items-center gap-2">
            <span className="truncate max-w-[200px]" title={reason}>
                {reason}
            </span>
            {isLong && (
                <Dialog open={isOpen} onOpenChange={setIsOpen}>
                    <DialogTrigger asChild>
                        <Button variant="ghost" size="icon" className="h-6 w-6 shrink-0">
                            <FileText className="h-3 w-3" />
                            <span className="sr-only">View full reason</span>
                        </Button>
                    </DialogTrigger>
                    <DialogContent>
                        <DialogHeader>
                            <DialogTitle>Rejection Reason</DialogTitle>
                            <DialogDescription>
                                Full explanation for the application rejection.
                            </DialogDescription>
                        </DialogHeader>
                        <div className="mt-4 p-4 bg-muted rounded-md text-sm leading-relaxed">
                            {reason}
                        </div>
                    </DialogContent>
                </Dialog>
            )}
        </div>
    )
}
