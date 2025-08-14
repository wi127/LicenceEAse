import { Prisma } from "@prisma/client";

export const SessionUserSelect = {
    id:true,
    email:true, 
    role:true, 
    status:true,
    profile: {select: {id:true, fullname:true}},
} satisfies Prisma.UserSelect;

export type TSessionUserSelect = Prisma.UserGetPayload<{select: typeof SessionUserSelect}> ;