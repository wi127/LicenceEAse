import { Prisma } from "@prisma/client";

export const SessionUserSelect = {
    id: true,
    email: true,
    username: true,
    role: true,
    status: true,
    image: true,
    profile: { select: { id: true, fullname: true } },
} satisfies Prisma.UserSelect;

export type TSessionUserSelect = Prisma.UserGetPayload<{ select: typeof SessionUserSelect }>;