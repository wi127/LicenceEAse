"use server";

import prisma from "@/lib/prisma";

import { Prisma } from "@prisma/client";
import { revalidateApplication } from "./RevalidatePage";
import { cache } from "react";

export async function createApplication(data: Prisma.ApplicationCreateInput) {
     try {
          // Check if the company has an active (non-rejected) application for this license name
          const companyId = data.company.connect?.id;
          if (companyId) {
               const existingApps = await prisma.application.findMany({
                    where: {
                         companyId,
                         name: data.name
                    },
                    include: {
                         LicenseApplication: {
                              select: { status: true }
                         }
                    }
               });

               const activeApp = existingApps.find(app => {
                    // Logic to determine if application is active:
                    // It's active if it exists AND (is pending OR approved)
                    // If no documents yet, it's pending (semi-active)
                    const statuses = app.LicenseApplication.map(d => d.status);
                    if (statuses.length === 0) return true; // Just created, still active/pending
                    const isRejected = statuses.some(s => s === 'REJECTED');
                    return !isRejected; // Not rejected means it's pending or approved
               });

               if (activeApp) {
                    return { success: false, error: `Your company already has an active application or approved license for "${data.name}".` };
               }
          }

          const res = await prisma.application.create({ data });
          if (res) await revalidateApplication();
          return { success: true, data: res };
     } catch (error) {
          console.log("error creating Application: ", error);
          return { success: false, error: "An unexpected error occurred." };
     }
}

export async function updateApplication(id: string, data: Prisma.ApplicationUpdateInput) {
     try {
          const res = await prisma.application.update({ where: { id }, data });
          if (res) await revalidateApplication();
          return res;
     } catch (error) {
          console.log(`Error updating Application with id: ${id}`, error);
          return null;
     }
}

export async function deleteApplication(id: string) {
     try {
          const res = await prisma.application.delete({ where: { id } });
          if (res) await revalidateApplication();
          return res;
     } catch (error) {
          console.log("Error deleting Application with id: ", id, error);
          return null;
     }
}

export const fetchApplications = cache(async <T extends Prisma.ApplicationSelect>(selectType: T, search?: Prisma.ApplicationWhereInput, take: number = 20, skip: number = 0, orderBy: Prisma.ApplicationOrderByWithRelationInput = { createdAt: 'desc' }): Promise<{ data: Prisma.ApplicationGetPayload<{ select: T }>[], pagination: { total: number } }> => {
     try {
          const res = await prisma.application.findMany({ where: search, take, skip, select: selectType, orderBy });
          const total = await prisma.application.count({ where: search });
          return { data: res, pagination: { total } };
     } catch (error) {
          console.log("Error fetching Applications: ", error);
          return { data: [], pagination: { total: 0 } }
     }
});

export const fetchApplicationById = cache(async <T extends Prisma.ApplicationSelect>(id: string, selectType: T): Promise<Prisma.ApplicationGetPayload<{ select: T }> | null> => {
     try {
          const res = await prisma.application.findUnique({ where: { id }, select: selectType });
          return res;
     } catch (error) {
          console.log(`Error fetching Application data for id: ${id}`, error);
          return null;
     }
});

export const getApplicationByCompanyId = cache(async <T extends Prisma.ApplicationSelect>(id: string, selectType: T): Promise<Prisma.ApplicationGetPayload<{ select: T }>[]> => {
     try {
          const res = await prisma.application.findMany({ where: { companyId: id }, select: selectType });
          return res;
     } catch (error) {
          console.log(`Error fetching Application with id: ${id}`, error);
          return [];
     }
});

export const fetchClientApplications = cache(async (companyId: string) => {
     try {
          const res = await prisma.application.findMany({
               where: { companyId },
               orderBy: { createdAt: 'desc' },
               include: {
                    company: { select: { name: true } },
                    LicenseApplication: {
                         include: {
                              documentType: { select: { name: true, documentType: true } }
                         }
                    },
                    Payment: { select: { status: true } }
               }
          });
          return res;
     } catch (error) {
          console.log(`Error fetching Client Applications for companyId: ${companyId}`, error);
          return [];
     }
});