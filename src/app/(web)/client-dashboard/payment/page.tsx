import { Suspense } from "react";
import Payment from "@/features/dashboard/components/DashboardPayment";

export default async function PaymentPage() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
          <Payment />
    </Suspense>
  )
}