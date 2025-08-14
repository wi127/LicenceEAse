"use server";

import prisma from "@/lib/prisma";

import { Prisma } from "@prisma/client";
import { RevalidatePages } from "./RevalidatePage";
import { cache } from "react";

export async function createLicense(data: Prisma.LicenseCreateInput) {
  try {
    const res = await prisma.license.create({data});
    if (res) RevalidatePages.license();
    return { success: true, data: res };
  } catch (error) {
    console.log("error creating License: ", error);
    return { success: false, error: "An unexpected error occurred." };
  }
}

export async function updateLicense (id:string, data:Prisma.LicenseUpdateInput) {
     try {
          const res = await prisma.license.update({where: {id}, data});
          if(res) RevalidatePages.license();
          return res; 
     } catch (error) {
          console.log(`Error updating License with id: ${id}`, error);
          return null;
     }
}

export async function deleteLicense (id:string) {
     try {
          const res = await prisma.license.delete({where: {id}});
          if(res) RevalidatePages.license();
          return res;
     } catch (error) {
          console.log("Error deleting License with id: ", id, error);
          return null;
     }
}

export const fetchLicenses = cache(async <T extends Prisma.LicenseSelect>(selectType: T, search?: Prisma.LicenseWhereInput, take:number = 20, skip:number = 0, orderBy: Prisma.LicenseOrderByWithRelationInput = { createdAt: 'desc' }):Promise<{data: Prisma.LicenseGetPayload<{select: T}>[], pagination: {total:number}}> => {
     try {
          const res = await prisma.license.findMany({where: search, take, skip, select: selectType, orderBy});
          const total = await prisma.license.count({where:search});
          return {data:res, pagination:{total}};
     } catch (error) {
          console.log("Error fetching Licenses: ", error);
          return {data:[], pagination:{total:0}}
     }
});

export const fetchLicenseById = cache(async <T extends Prisma.LicenseSelect>(id:string, selectType: T): Promise<Prisma.LicenseGetPayload<{select:T}> | null> => {
     try {
          const res= await prisma.license.findUnique({where:{id},select: selectType});
          return res;
     } catch (error) {
          console.log(`Error fetching License data for id: ${id}`, error);
          return null;
     }
});
