import { Prisma } from "@prisma/client";

export const ProfileSelect = {
  id: true,
  fullname: true,
  phone: true,
  address: true,
  nationalId: true,
  user: { select: { id: true, username: true, email: true } },
  createdAt: true,
} satisfies Prisma.ProfileSelect;

export type TProfileSelect = Prisma.ProfileGetPayload<{ select: typeof ProfileSelect }>;
