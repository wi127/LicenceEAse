"use server";

import prisma from "@/lib/prisma";

import { Prisma } from "@prisma/client";
import { revalidatePayment } from "./RevalidatePage";
import { cache } from "react";
import Stripe from "stripe";

export async function upsertPayment(data: { applicationId: string, userId: string, amount: number, currency: string, stripeIntentId: string }) {
     try {
          const res = await prisma.payment.upsert({
               where: { applicationId: data.applicationId },
               create: {
                    user: { connect: { id: data.userId } },
                    application: { connect: { id: data.applicationId } },
                    amount: data.amount,
                    currency: data.currency,
                    stripeIntentId: data.stripeIntentId,
                    status: "PENDING"
               },
               update: {
                    amount: data.amount,
                    currency: data.currency,
                    stripeIntentId: data.stripeIntentId,
                    status: "PENDING",
                    updatedAt: new Date()
               }
          });
          if (res) await revalidatePayment();
          return { success: true, data: res };
     } catch (error: any) {
          console.log("Error upserting Payment: ", error);
          return { success: false, error: error.message || "Failed to process payment record." };
     }
}

export async function createPayment(data: Prisma.PaymentCreateInput) {
     try {
          const res = await prisma.payment.create({ data });
          if (res) await revalidatePayment();
          return { success: true, data: res };
     } catch (error: any) {
          console.log("error creating Payment: ", error);
          return { success: false, error: error.message || "An unexpected error occurred while creating payment." };
     }
}

export async function updatePayment(id: string, data: Prisma.PaymentUpdateInput) {
     try {
          const res = await prisma.payment.update({ where: { id }, data });
          if (res) await revalidatePayment();
          return res;
     } catch (error) {
          console.log(`Error updating Payment with id: ${id}`, error);
          return null;
     }
}

export async function deletePayment(id: string) {
     try {
          const res = await prisma.payment.delete({ where: { id } });
          if (res) await revalidatePayment();
          return res;
     } catch (error) {
          console.log("Error deleting Payment with id: ", id, error);
          return null;
     }
}

export const fetchPayments = cache(async <T extends Prisma.PaymentSelect>(selectType: T, search?: Prisma.PaymentWhereInput, take: number = 20, skip: number = 0, orderBy: Prisma.PaymentOrderByWithRelationInput = { createdAt: 'desc' }): Promise<{ data: Prisma.PaymentGetPayload<{ select: T }>[], pagination: { total: number } }> => {
     try {
          const res = await prisma.payment.findMany({ where: search, take, skip, select: selectType, orderBy });
          const total = await prisma.payment.count({ where: search });
          return { data: res, pagination: { total } };
     } catch (error) {
          console.log("Error fetching Payments: ", error);
          return { data: [], pagination: { total: 0 } }
     }
});

export const fetchPaymentById = cache(async <T extends Prisma.PaymentSelect>(id: string, selectType: T): Promise<Prisma.PaymentGetPayload<{ select: T }> | null> => {
     try {
          const res = await prisma.payment.findUnique({ where: { id }, select: selectType });
          return res;
     } catch (error) {
          console.log(`Error fetching Payment data for id: ${id}`, error);
          return null;
     }
});


const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
     apiVersion: "2025-07-30.basil",
});

const exchangeRates: { [key: string]: number } = {
     USD: 1,
     EUR: 0.92,
     RWF: 1320
};

export async function createPaymentIntentAction(applicationId: string, currency: string) {
     try {
          const application = await prisma.application.findUnique({
               where: { id: applicationId },
               select: { applicationFee: true }
          });

          if (!application || !application.applicationFee) {
               return { error: "Application not found or fee invalid" };
          }

          const fee = Number(application.applicationFee);
          const rate = exchangeRates[currency] || 1;
          const displayAmount = fee * rate;

          // Stripe expects smallest currency unit (e.g., cents)
          let stripeAmount = displayAmount;
          if (['USD', 'EUR', 'GBP'].includes(currency)) {
               stripeAmount = Math.round(displayAmount * 100);
          } else {
               stripeAmount = Math.round(displayAmount);
          }

          const paymentIntent = await stripe.paymentIntents.create({
               amount: stripeAmount,
               currency: currency.toLowerCase(),
               automatic_payment_methods: { enabled: true },
          });

          return {
               clientSecret: paymentIntent.client_secret,
               amount: displayAmount,
               currency
          };
     } catch (error: any) {
          console.error("Stripe error:", error.message);
          return { error: "Failed to create payment intent" };
     }
}