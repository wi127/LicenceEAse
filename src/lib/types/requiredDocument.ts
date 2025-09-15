import { Prisma } from "@prisma/client";

export const RequiredDocumentSelect = {
    id: true,
    name: true,
    description: true,
    file: true,
    createdAt: true,
    updatedAt: true,
} satisfies Prisma.RequiredDocumentSelect;