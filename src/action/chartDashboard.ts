"use server";

import prisma from "@/lib/prisma";
import { ApplicationStatus } from "@prisma/client";

export async function getApplicationsChartData(
    year: number,
    status: 'approved' | 'rejected' | 'pending'
) {
    try {
        const startDate = new Date(year, 0, 1);
        const endDate = new Date(year + 1, 0, 1);

        const applications = await prisma.application.findMany({
            where: {
                createdAt: {
                    gte: startDate,
                    lt: endDate,
                },
            },
            include: {
                LicenseApplication: {
                    select: {
                        status: true,
                    },
                },
            },
        });

        const monthlyCounts = new Array(12).fill(0);

        applications.forEach((app) => {
            let appStatus: 'approved' | 'rejected' | 'pending' = 'pending';

            const docs = app.LicenseApplication;

            if (docs.length === 0) {
                appStatus = 'pending';
            } else {
                const hasRejected = docs.some(d => d.status === ApplicationStatus.REJECTED);
                const allApproved = docs.every(d => d.status === ApplicationStatus.APPROVED);

                if (hasRejected) {
                    appStatus = 'rejected';
                } else if (allApproved) {
                    appStatus = 'approved';
                } else {
                    appStatus = 'pending';
                }
            }

            if (appStatus === status) {
                const month = app.createdAt.getMonth();
                monthlyCounts[month]++;
            }
        });

        const monthNames = [
            "January", "February", "March", "April", "May", "June",
            "July", "August", "September", "October", "November", "December"
        ];

        return {
            success: true,
            data: monthNames.map((month, index) => ({
                month,
                desktop: monthlyCounts[index],
            }))
        };
    } catch (error) {
        console.error("Error fetching chart data:", error);
        return { success: false, error: "Failed to fetch chart data" };
    }
}

export async function getDashboardStats() {
    try {
        const applications = await prisma.application.findMany({
            include: {
                LicenseApplication: {
                    select: {
                        status: true,
                    },
                },
            },
        });

        const stats = {
            approved: 0,
            rejected: 0,
            pending: 0,
        };

        for (const app of applications) {
            let appStatus: 'approved' | 'rejected' | 'pending' = 'pending';
            const docs = app.LicenseApplication;

            if (docs.length === 0) {
                appStatus = 'pending';
            } else {
                const hasRejected = docs.some(d => d.status === ApplicationStatus.REJECTED);
                const allApproved = docs.every(d => d.status === ApplicationStatus.APPROVED);

                if (hasRejected) {
                    appStatus = 'rejected';
                } else if (allApproved) {
                    appStatus = 'approved';
                } else {
                    appStatus = 'pending';
                }
            }
            stats[appStatus]++;
        }

        return stats;
    } catch (error) {
        console.error("Error fetching dashboard stats:", error);
        return { approved: 0, rejected: 0, pending: 0 };
    }
}
