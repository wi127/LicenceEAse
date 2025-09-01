import { Prisma } from "@prisma/client";

export const UserSelect = {
  id: true,
  username: true,
  email: true,
  password: true,
  isOAuth: true,
  status: true,
  role: true,
  createdAt: true,
} satisfies Prisma.UserSelect;

export type TUserSelect = Prisma.UserGetPayload<{ select: typeof UserSelect }>;
