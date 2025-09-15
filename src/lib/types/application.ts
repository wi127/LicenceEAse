import { Prisma } from "@prisma/client";

export const ApplicationSelect = {
  id: true,
  name: true,
  processingTime: true,
  applicationFee: true,
  validityMonths:true,
  company: { select: { id: true, name: true }},
  createdAt: true,
} satisfies Prisma.ApplicationSelect;

export type TApplicationSelect = Prisma.ApplicationGetPayload<{ select: typeof ApplicationSelect }>;
