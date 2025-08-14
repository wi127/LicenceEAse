import { revalidatePath } from "next/cache";

export const RevalidatePages = {
  user: () => {
    revalidatePath('/')
  },
  profile: () => {
    revalidatePath('/')
  },
  company: () => {
    revalidatePath('/')
  },
  license: () => {
    revalidatePath('/')
  },
  licenseApplication: () => {
    revalidatePath('/')
  },
  applicationDocument: () => {
    revalidatePath('/')
  },
  requiredDocument: () => {
    revalidatePath('/')
  },
  payment: () => {
    revalidatePath('/')
  },
  notification: () => {
    revalidatePath('/')
  }

}