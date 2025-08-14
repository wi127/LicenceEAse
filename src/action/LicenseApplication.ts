"use server";

import prisma from "@/lib/prisma";

import { Prisma } from "@prisma/client";
import { RevalidatePages } from "./RevalidatePage";
import { cache } from "react";

export async function createLicenseApplication(data: Prisma.LicenseApplicationCreateInput) {
  try {
    const res = await prisma.licenseApplication.create({data});
    if (res) RevalidatePages.licenseApplication();
    return { success: true, data: res };
  } catch (error) {
    console.log("error creating LicenseApplication: ", error);
    return { success: false, error: "An unexpected error occurred." };
  }
}

export async function updateLicenseApplication (id:string, data:Prisma.LicenseApplicationUpdateInput) {
     try {
          const res = await prisma.licenseApplication.update({where: {id}, data});
          if(res) RevalidatePages.licenseApplication();
          return res; 
     } catch (error) {
          console.log(`Error updating LicenseApplication with id: ${id}`, error);
          return null;
     }
}

export async function deleteLicenseApplication (id:string) {
     try {
          const res = await prisma.licenseApplication.delete({where: {id}});
          if(res) RevalidatePages.licenseApplication();
          return res;
     } catch (error) {
          console.log("Error deleting LicenseApplication with id: ", id, error);
          return null;
     }
}

export const fetchLicenseApplications = cache(async <T extends Prisma.LicenseApplicationSelect>(selectType: T, search?: Prisma.LicenseApplicationWhereInput, take:number = 20, skip:number = 0, orderBy: Prisma.LicenseApplicationOrderByWithRelationInput = { createdAt: 'desc' }):Promise<{data: Prisma.LicenseApplicationGetPayload<{select: T}>[], pagination: {total:number}}> => {
     try {
          const res = await prisma.licenseApplication.findMany({where: search, take, skip, select: selectType, orderBy});
          const total = await prisma.licenseApplication.count({where:search});
          return {data:res, pagination:{total}};
     } catch (error) {
          console.log("Error fetching LicenseApplications: ", error);
          return {data:[], pagination:{total:0}}
     }
});

export const fetchLicenseApplicationById = cache(async <T extends Prisma.LicenseApplicationSelect>(id:string, selectType: T): Promise<Prisma.LicenseApplicationGetPayload<{select:T}> | null> => {
     try {
          const res= await prisma.licenseApplication.findUnique({where:{id},select: selectType});
          return res;
     } catch (error) {
          console.log(`Error fetching LicenseApplication data for id: ${id}`, error);
          return null;
     }
});
