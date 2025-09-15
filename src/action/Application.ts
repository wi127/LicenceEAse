"use server";

import prisma from "@/lib/prisma";

import { Prisma } from "@prisma/client";
import { RevalidatePages } from "./RevalidatePage";
import { cache } from "react";
import { fetchCompanyByUserId } from "./Company";

export async function createApplication(data: Prisma.ApplicationCreateInput) {
  try {
    const res = await prisma.application.create({data});
    if (res) RevalidatePages.application();
    return { success: true, data: res };
  } catch (error) {
    console.log("error creating Application: ", error);
    return { success: false, error: "An unexpected error occurred." };
  }
}

export async function updateApplication (id:string, data:Prisma.ApplicationUpdateInput) {
     try {
          const res = await prisma.application.update({where: {id}, data});
          if(res) RevalidatePages.application();
          return res; 
     } catch (error) {
          console.log(`Error updating Application with id: ${id}`, error);
          return null;
     }
}

export async function deleteApplication (id:string) {
     try {
          const res = await prisma.application.delete({where: {id}});
          if(res) RevalidatePages.application();
          return res;
     } catch (error) {
          console.log("Error deleting Application with id: ", id, error);
          return null;
     }
}

export const fetchApplications = cache(async <T extends Prisma.ApplicationSelect>(selectType: T, search?: Prisma.ApplicationWhereInput, take:number = 20, skip:number = 0, orderBy: Prisma.ApplicationOrderByWithRelationInput = { createdAt: 'desc' }):Promise<{data: Prisma.ApplicationGetPayload<{select: T}>[], pagination: {total:number}}> => {
     try {
          const res = await prisma.application.findMany({where: search, take, skip, select: selectType, orderBy});
          const total = await prisma.application.count({where:search});
          return {data:res, pagination:{total}};
     } catch (error) {
          console.log("Error fetching Applications: ", error);
          return {data:[], pagination:{total:0}}
     }
});

export const fetchApplicationById = cache(async <T extends Prisma.ApplicationSelect>(id:string, selectType: T): Promise<Prisma.ApplicationGetPayload<{select:T}> | null> => {
     try {
          const res= await prisma.application.findUnique({where:{id},select: selectType});
          return res;
     } catch (error) {
          console.log(`Error fetching Application data for id: ${id}`, error);
          return null;
     }
});

export const getApplicationByCompanyId = cache(async <T extends Prisma.ApplicationSelect>(id:string, selectType: T): Promise<Prisma.ApplicationGetPayload<{ select: T }>[]> => {
     try {
          const res = await prisma.application.findMany({where: {companyId: id}, select: selectType});
          if(res) RevalidatePages.application();
          return res; 
     } catch (error) {
          console.log(`Error fetching Application with id: ${id}`, error);
          return [];
     }
});