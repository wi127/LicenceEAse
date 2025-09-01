import { Prisma } from "@prisma/client";

export const CompanySelect = {
  id: true,
  name: true,
  country: true,
  TIN: true,
  address: true,
  legalType: true,
  emailCompany: true,
  phone: true,
  createdAt: true,
} satisfies Prisma.CompanySelect;

export type TCompanySelect = Prisma.CompanyGetPayload<{ select: typeof CompanySelect }>;
