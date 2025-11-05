"use server";

import prisma from "@/lib/prisma";

import { Prisma } from "@prisma/client";
import { revalidatePayment } from "./RevalidatePage";
import { cache } from "react";
import Stripe from "stripe";

export async function createPayment(data: Prisma.PaymentCreateInput) {
  try {
    const res = await prisma.payment.create({data});
    if (res) await revalidatePayment();
    return { success: true, data: res };
  } catch (error) {
    console.log("error creating Payment: ", error);
    return { success: false, error: "An unexpected error occurred while creating payment." };
  }
}

export async function updatePayment (id:string, data:Prisma.PaymentUpdateInput) {
     try {
          const res = await prisma.payment.update({where: {id}, data});
          if(res) await revalidatePayment();
          return res; 
     } catch (error) {
          console.log(`Error updating Payment with id: ${id}`, error);
          return null;
     }
}

export async function deletePayment (id:string) {
     try {
          const res = await prisma.payment.delete({where: {id}});
          if(res) await revalidatePayment();
          return res;
     } catch (error) {
          console.log("Error deleting Payment with id: ", id, error);
          return null;
     }
}

export const fetchPayments = cache(async <T extends Prisma.PaymentSelect>(selectType: T, search?: Prisma.PaymentWhereInput, take:number = 20, skip:number = 0, orderBy: Prisma.PaymentOrderByWithRelationInput = { createdAt: 'desc' }):Promise<{data: Prisma.PaymentGetPayload<{select: T}>[], pagination: {total:number}}> => {
     try {
          const res = await prisma.payment.findMany({where: search, take, skip, select: selectType, orderBy});
          const total = await prisma.payment.count({where:search});
          return {data:res, pagination:{total}};
     } catch (error) {
          console.log("Error fetching Payments: ", error);
          return {data:[], pagination:{total:0}}
     }
});

export const fetchPaymentById = cache(async <T extends Prisma.PaymentSelect>(id:string, selectType: T): Promise<Prisma.PaymentGetPayload<{select:T}> | null> => {
     try {
          const res= await prisma.payment.findUnique({where:{id},select: selectType});
          return res;
     } catch (error) {
          console.log(`Error fetching Payment data for id: ${id}`, error);
          return null;
     }
});


const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: "2025-07-30.basil",
});

export async function createPaymentIntentAction(amount: number, currency: string) {
  try {
    const paymentIntent = await stripe.paymentIntents.create({
      amount, 
      currency,
      payment_method_types: ['card', 'mobilepay'],
      automatic_payment_methods: { enabled: true },
    });

    return { clientSecret: paymentIntent.client_secret };
  } catch (error: any) {
    console.error("Stripe error:", error.message);
    return { error: "Failed to create payment intent" };
  }
}