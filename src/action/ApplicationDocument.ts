"use server";

import prisma from "@/lib/prisma";

import { Prisma } from "@prisma/client";
import { RevalidatePages } from "./RevalidatePage";
import { cache } from "react";

export async function createApplicationDocument(data: Prisma.ApplicationDocumentCreateInput) {
  try {
    const res = await prisma.applicationDocument.create({data});
    if (res) RevalidatePages.applicationDocument();
    return { success: true, data: res };
  } catch (error) {
    console.log("error creating ApplicationDocument: ", error);
    return { success: false, error: "An unexpected error occurred while creating application document." };
  }
}

export async function updateApplicationDocument (id:string, data:Prisma.ApplicationDocumentUpdateInput) {
     try {
          const res = await prisma.applicationDocument.update({where: {id}, data});
          if(res) RevalidatePages.applicationDocument();
          return res; 
     } catch (error) {
          console.log(`Error updating ApplicationDocument with id: ${id}`, error);
          return null;
     }
}

export async function deleteApplicationDocument (id:string) {
     try {
          const res = await prisma.applicationDocument.delete({where: {id}});
          if(res) RevalidatePages.applicationDocument();
          return res;
     } catch (error) {
          console.log("Error deleting ApplicationDocument with id: ", id, error);
          return null;
     }
}

export const fetchApplicationDocuments = cache(async <T extends Prisma.ApplicationDocumentSelect>(selectType: T, search?: Prisma.ApplicationDocumentWhereInput, take:number = 20, skip:number = 0, orderBy: Prisma.ApplicationDocumentOrderByWithRelationInput = { createdAt: 'desc' }):Promise<{data: Prisma.ApplicationDocumentGetPayload<{select: T}>[], pagination: {total:number}}> => {
     try {
          const res = await prisma.applicationDocument.findMany({where: search, take, skip, select: selectType, orderBy});
          const total = await prisma.applicationDocument.count({where:search});
          return {data:res, pagination:{total}};
     } catch (error) {
          console.log("Error fetching ApplicationDocuments: ", error);
          return {data:[], pagination:{total:0}}
     }
});

export const fetchApplicationDocumentById = cache(async <T extends Prisma.ApplicationDocumentSelect>(id:string, selectType: T): Promise<Prisma.ApplicationDocumentGetPayload<{select:T}> | null> => {
     try {
          const res= await prisma.applicationDocument.findUnique({where:{id},select: selectType});
          return res;
     } catch (error) {
          console.log(`Error fetching ApplicationDocument data for id: ${id}`, error);
          return null;
     }
});
