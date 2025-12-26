"use server";

import prisma from "@/lib/prisma";
import { Prisma } from "@prisma/client";
import { revalidateUser, revalidateProfile, revalidateCompany } from "./RevalidatePage";
import { encryptPassword } from "../util/bcryptFuncs";
import { getServerSession } from "next-auth";
import { authOptions } from "@/common/authOptions";

export type AccountUpdateData = {
    fullname?: string;
    email?: string;
    phone?: string;
    companyName?: string;
    password?: string;
    image?: string;
};

export async function updateAccount(
    userId: string,
    data: AccountUpdateData
): Promise<{ success: boolean; error?: string }> {
    try {
        const session = await getServerSession(authOptions);
        if (!session || !session.user) {
            return { success: false, error: "Unauthorized" };
        }

        // 1. Prepare User Update
        const userUpdate: Prisma.UserUpdateInput = {};
        if (data.email) userUpdate.email = data.email;
        if (data.image !== undefined) userUpdate.image = data.image;
        if (data.password) {
            userUpdate.password = await encryptPassword(data.password);
        }

        // 2. Prepare Profile Update
        const profileUpdate: Prisma.ProfileUpdateInput = {};
        if (data.fullname) profileUpdate.fullname = data.fullname;
        if (data.phone) profileUpdate.phone = data.phone;

        // 3. Database Transaction
        await prisma.$transaction(async (tx) => {
            // Update User
            if (Object.keys(userUpdate).length > 0) {
                await tx.user.update({
                    where: { id: userId },
                    data: userUpdate,
                });
            }

            // Update Profile (Upsert)
            const existingProfile = await tx.profile.findUnique({
                where: { userId: userId },
            });

            if (existingProfile) {
                if (Object.keys(profileUpdate).length > 0) {
                    await tx.profile.update({
                        where: { id: existingProfile.id },
                        data: profileUpdate,
                    });
                }
            } else {
                await tx.profile.create({
                    data: {
                        userId: userId,
                        fullname: data.fullname || "",
                        phone: data.phone || "",
                        address: "",
                        nationalId: "",
                    }
                });
            }

            // Update Company
            if (data.companyName) {
                const company = await tx.company.findFirst({
                    where: { operatorId: userId },
                });

                if (company) {
                    await tx.company.update({
                        where: { id: company.id },
                        data: { name: data.companyName },
                    });
                } else {
                    await tx.company.create({
                        data: {
                            name: data.companyName,
                            operatorId: userId,
                            country: "",
                            address: "",
                            emailCompany: "",
                            phone: "",
                            TIN: `TIN-${Date.now()}`,
                        }
                    })
                }
            }
        });

        // 4. Revalidate
        await Promise.all([
            revalidateUser(),
            revalidateProfile(),
            revalidateCompany(),
        ]);

        return { success: true };
    } catch (error) {
        console.error("Error updating account:", error);
        return { success: false, error: "Failed to update account details." };
    }
}
