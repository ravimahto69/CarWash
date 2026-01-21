import { Suspense } from 'react'
import BookingConfirmation from '../component/BookingConfirmation';

export const metadata ={
  title : "WashHub | Booking Confirmation"}

export default function BookingConfirmationPage() {
  return (
    <Suspense fallback={<div className="flex items-center justify-center min-h-screen">Loading...</div>}>
      <BookingConfirmation />
    </Suspense>
  );
}
