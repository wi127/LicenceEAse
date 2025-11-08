"use server";

import prisma from "@/lib/prisma";

import { Prisma } from "@prisma/client";
import { revalidateProfile } from "./RevalidatePage";
import { cache } from "react";

export async function createProfile(data: Prisma.ProfileCreateInput) {
  try {
    const res = await prisma.profile.create({data});
    if (res) await revalidateProfile();
    return { success: true, data: res };
  } catch (error) {
    console.log("error creating Profile: ", error);
    return { success: false, error: "An unexpected error occurred while creating profile." };
  }
}

export async function updateProfile (id:string, data:Prisma.ProfileUpdateInput) {
     try {
          const res = await prisma.profile.update({where: {id}, data});
          if(res) await revalidateProfile();
          return res; 
     } catch (error) {
          console.log(`Error updating Profile with id: ${id}`, error);
          return null;
     }
}

export async function deleteProfile (id:string) {
     try {
          const res = await prisma.profile.delete({where: {id}});
          if(res) await revalidateProfile();
          return res;
     } catch (error) {
          console.log("Error deleting Profile with id: ", id, error);
          return null;
     }
}

export const fetchProfiles = cache(async <T extends Prisma.ProfileSelect>(selectType: T, search?: Prisma.ProfileWhereInput, take:number = 20, skip:number = 0, orderBy: Prisma.ProfileOrderByWithRelationInput = { createdAt: 'desc' }):Promise<{data: Prisma.ProfileGetPayload<{select: T}>[], pagination: {total:number}}> => {
     try {
          const res = await prisma.profile.findMany({where: search, take, skip, select: selectType, orderBy});
          const total = await prisma.profile.count({where:search});
          return {data:res, pagination:{total}};
     } catch (error) {
          console.log("Error fetching Profiles: ", error);
          return {data:[], pagination:{total:0}}
     }
});

export const fetchProfileById = cache(async <T extends Prisma.ProfileSelect>(id:string,  selectType: T, userId?: string): Promise<Prisma.ProfileGetPayload<{select:T}> | null> => {
     try {
          const res= await prisma.profile.findUnique({where:{id, userId},select: selectType});
          return res;
     } catch (error) {
          console.log(`Error fetching Profile data for id: ${id}`, error);
          return null;
     }
});

export const fetchProfileByUserId = cache(async <T extends Prisma.ProfileSelect>(id:string, selectType: T): Promise<Prisma.ProfileGetPayload<{select:T}> | null> => {
     try {
          const res= await prisma.profile.findUnique({where:{userId: id},select: selectType});
          return res;
     } catch (error) {
          console.log(`Error fetching Profile data for userId: ${id}`, error);
          return null;
     }
});
