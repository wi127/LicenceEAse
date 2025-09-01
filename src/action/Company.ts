"use server";

import prisma from "@/lib/prisma";

import { Prisma } from "@prisma/client";
import { RevalidatePages } from "./RevalidatePage";
import { cache } from "react";

export async function createCompany(data: Prisma.CompanyCreateInput) {
  try {
    const res = await prisma.company.create({data});
    if (res) RevalidatePages.company();
    return { success: true, data: res };
  } catch (error) {
    console.log("error creating Company: ", error);
    return { success: false, error: "An unexpected error occurred." };
  }
}

export async function updateCompany (id:string, data:Prisma.CompanyUpdateInput) {
     try {
          const res = await prisma.company.update({where: {id}, data});
          if(res) RevalidatePages.company();
          return res; 
     } catch (error) {
          console.log(`Error updating Company with id: ${id}`, error);
          return null;
     }
}

export async function deleteCompany (id:string) {
     try {
          const res = await prisma.company.delete({where: {id}});
          if(res) RevalidatePages.company();
          return res;
     } catch (error) {
          console.log("Error deleting Company with id: ", id, error);
          return null;
     }
}

export const fetchCompanys = cache(async <T extends Prisma.CompanySelect>(selectType: T, search?: Prisma.CompanyWhereInput, take:number = 20, skip:number = 0, orderBy: Prisma.CompanyOrderByWithRelationInput = { createdAt: 'desc' }):Promise<{data: Prisma.CompanyGetPayload<{select: T}>[], pagination: {total:number}}> => {
     try {
          const res = await prisma.company.findMany({where: search, take, skip, select: selectType, orderBy});
          const total = await prisma.company.count({where:search});
          return {data:res, pagination:{total}};
     } catch (error) {
          console.log("Error fetching Companys: ", error);
          return {data:[], pagination:{total:0}}
     }
});

export const fetchCompanyById = cache(async <T extends Prisma.CompanySelect>(id:string, selectType: T): Promise<Prisma.CompanyGetPayload<{select:T}> | null> => {
     try {
          const res= await prisma.company.findUnique({where:{id},select: selectType});
          return res;
     } catch (error) {
          console.log(`Error fetching Company data for id: ${id}`, error);
          return null;
     }
});


export const fetchCompanyByOperator = cache(async <T extends Prisma.CompanySelect>(operatorId:string, selectType: T): Promise<Prisma.CompanyGetPayload<{select:T}> | null> => {
     try {
          const res= await prisma.company.findFirst({where:{operatorId},select: selectType});
          return res;
     } catch (error) {
          console.log(`Error fetching Company data for operatorId: ${operatorId}`, error);
          return null;
     }
});

export const fetchCompanyByUserId = cache(async <T extends Prisma.CompanySelect>(id: string, selectType: T): Promise<Prisma.CompanyGetPayload<{ select: T }>[]> => {
  try {
    const res = await prisma.company.findMany({ where: { operatorId: id }, select: selectType })
    return res
  } catch (error) {
    console.log(`Error fetching Company data for id: ${id}`, error)
    return []
  }
})