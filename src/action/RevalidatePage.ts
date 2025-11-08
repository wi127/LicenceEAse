"use server";

import { revalidatePath } from "next/cache";

export async function revalidateUser() {
  revalidatePath("/");
}

export async function revalidateProfile() {
  revalidatePath("/");
}

export async function revalidateCompany() {
  revalidatePath("/");
}

export async function revalidateApplication() {
  revalidatePath("/submit-application");
}

export async function revalidateApplicationDocument() {
  revalidatePath("/");
}

export async function revalidateRequiredDocument() {
  revalidatePath("/");
}

export async function revalidatePayment() {
  revalidatePath("/client-dashboard/payment");
}

export async function revalidateNotification() {
  revalidatePath("/");
}
