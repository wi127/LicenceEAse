"use server";

import prisma from "@/lib/prisma";

import { Prisma } from "@prisma/client";
import { RevalidatePages } from "./RevalidatePage";
import { cache } from "react";
import { encryptPassword } from "../util/bcryptFuncs";
import { ESessionFetchMode } from "@/common/enums";
import { getServerSession, Session } from "next-auth";
import { authOptions } from "@/common/authOptions";
import { SessionUserSelect, TSessionUserSelect } from "@/lib/types/session";

export async function createUser(data: Prisma.UserCreateInput) {
  try {
    const hashedPassword = await encryptPassword(data.password);
    const res = await prisma.user.create({
      data: {
        ...data,
        password: hashedPassword,
      },
    });
    if (res) RevalidatePages.user();
    return { success: true, data: res };
  } catch (error) {
    console.log("error creating user: ", error);
    return { success: false, error: "An unexpected error occurred." };
  }
}

export async function updateUser (id:string, data:Prisma.UserUpdateInput) {
     try {
          const res = await prisma.user.update({where: {id}, data});
          if(res) RevalidatePages.user();
          return res; 
     } catch (error) {
          console.log(`Error updating user with id: ${id}`, error);
          return null;
     }
}

export async function deleteUser (id:string) {
     try {
          const res = await prisma.user.delete({where: {id}});
          if(res) RevalidatePages.user();
          return res;
     } catch (error) {
          console.log("Error deleting user with id: ", id, error);
          return null;
     }
}

export const fetchUsers = cache(async <T extends Prisma.UserSelect>(selectType: T, search?: Prisma.UserWhereInput, take:number = 20, skip:number = 0, orderBy: Prisma.UserOrderByWithRelationInput = { createdAt: 'desc' }):Promise<{data: Prisma.UserGetPayload<{select: T}>[], pagination: {total:number}}> => {
     try {
          const res = await prisma.user.findMany({where: search, take, skip, select: selectType, orderBy});
          const total = await prisma.user.count({where:search});
          return {data:res, pagination:{total}};
     } catch (error) {
          console.log("Error fetching Users: ", error);
          return {data:[], pagination:{total:0}}
     }
});

export const fetchUserById = cache(async <T extends Prisma.UserSelect>(id:string, selectType: T): Promise<Prisma.UserGetPayload<{select:T}> | null> => {
     try {
          const res= await prisma.user.findUnique({where:{id},select: selectType});
          return res;
     } catch (error) {
          console.log(`Error fetching user data for id: ${id}`, error);
          return null;
     }
});

export const fetchUserByEmail = cache(async <T extends Prisma.UserSelect>(email:string, selectType: T): Promise<Prisma.UserGetPayload<{select:T}> | null> => {
     try {
          const res= await prisma.user.findUnique({where:{email},select: selectType});
          return res;
     } catch (error) {
          console.log(`Error fetching User data for id: ${email}`, error);
          return null;
     }
})


export async function getSessionUser (mode: ESessionFetchMode=ESessionFetchMode.SESSION_AND_USER):Promise<{user:TSessionUserSelect | null | undefined, session: Session | null}>{
    const session = await getServerSession(authOptions);
    if(!session) return {user:null, session: null};
    const sessionUser = session.user;
    if(mode === ESessionFetchMode.SESSION_ONLY) return {session, user:null};
    if(!sessionUser) return {user:null, session};
    if (!sessionUser.email) return {user:null, session: session};
    const user = await fetchUserByEmail(sessionUser.email, SessionUserSelect);

    return {user, session};
}