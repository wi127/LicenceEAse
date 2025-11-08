"use server";

import prisma from "@/lib/prisma";

import { Prisma } from "@prisma/client";
import { revalidateRequiredDocument } from "./RevalidatePage";
import { cache } from "react";

export async function createRequiredDocument(data: Prisma.RequiredDocumentCreateInput) {
  try {
     const buffer = Buffer.from(data.file);
    const res = await prisma.requiredDocument.create({data: {...data, file: buffer}});
    if (res) await revalidateRequiredDocument();
    return { success: true, data: res };
  } catch (error) {
    console.log("error creating RequiredDocument: ", error);
    return { success: false, error: "An unexpected error occurred while creating required document." };
  }
}

export async function updateRequiredDocument (id:string, data:Prisma.RequiredDocumentUpdateInput) {
     try {
          const res = await prisma.requiredDocument.update({where: {id}, data});
          if(res) await revalidateRequiredDocument();
          return res; 
     } catch (error) {
          console.log(`Error updating RequiredDocument with id: ${id}`, error);
          return null;
     }
}

export async function deleteRequiredDocument (id:string) {
     try {
          const res = await prisma.requiredDocument.delete({where: {id}});
          if(res) await revalidateRequiredDocument();
          return res;
     } catch (error) {
          console.log("Error deleting RequiredDocument with id: ", id, error);
          return null;
     }
}

export const fetchRequiredDocuments = cache(async <T extends Prisma.RequiredDocumentSelect>(selectType: T, search?: Prisma.RequiredDocumentWhereInput, take:number = 20, skip:number = 0, orderBy: Prisma.RequiredDocumentOrderByWithRelationInput = { createdAt: 'desc' }):Promise<{data: Prisma.RequiredDocumentGetPayload<{select: T}>[], pagination: {total:number}}> => {
     try {
          const res = await prisma.requiredDocument.findMany({where: search, take, skip, select: selectType, orderBy});
          const total = await prisma.requiredDocument.count({where:search});
          return {data:res, pagination:{total}};
     } catch (error) {
          console.log("Error fetching RequiredDocuments: ", error);
          return {data:[], pagination:{total:0}}
     }
});

export const fetchRequiredDocumentById = cache(async <T extends Prisma.RequiredDocumentSelect>(id:string, selectType: T): Promise<Prisma.RequiredDocumentGetPayload<{select:T}> | null> => {
     try {
          const res= await prisma.requiredDocument.findUnique({where:{id},select: selectType});
          return res;
     } catch (error) {
          console.log(`Error fetching RequiredDocument data for id: ${id}`, error);
          return null;
     }
});
