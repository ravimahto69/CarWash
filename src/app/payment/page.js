import { Suspense } from 'react'
import Payment from '../component/Payment';

export const metadata ={
  title : "WashHub | Payment"}

export default function PaymentPage() {
  return (
    <Suspense fallback={<div className="flex items-center justify-center min-h-screen">Loading...</div>}>
      <Payment />
    </Suspense>
  );
}
