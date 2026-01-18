'use client';

import { useState, useEffect } from 'react';
import { Card, Button, Spin, Result, Descriptions, Table, Space } from 'antd';
import { PrinterOutlined, DownloadOutlined, HomeOutlined } from '@ant-design/icons';
import Link from 'next/link';
import { useSearchParams, useRouter } from 'next/navigation';

export default function BookingConfirmation() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const [booking, setBooking] = useState(null);
  const [payment, setPayment] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const bookingId = searchParams.get('bookingId');
  const paymentId = searchParams.get('paymentId');

  useEffect(() => {
    if (!bookingId) {
      setError('No booking found');
      setLoading(false);
      return;
    }

    const fetchData = async () => {
      try {
        // Fetch booking details
        const bookingRes = await fetch(`/api/booking?id=${bookingId}`);
        const bookingData = await bookingRes.json();

        if (bookingRes.ok && bookingData.success) {
          setBooking(bookingData.data);
        }

        // Fetch payment details if available
        if (paymentId) {
          const paymentRes = await fetch(`/api/payment/details?id=${paymentId}`);
          const paymentData = await paymentRes.json();

          if (paymentRes.ok && paymentData.success) {
            setPayment(paymentData.data);
          }
        }
      } catch (err) {
        console.error('Error fetching data:', err);
        setError('Failed to load booking details');
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [bookingId, paymentId]);

  const handlePrint = () => {
    window.print();
  };

  const handleDownloadInvoice = async () => {
    try {
      const res = await fetch(`/api/invoice?bookingId=${bookingId}`, {
        method: 'GET',
      });

      if (!res.ok) throw new Error('Failed to download invoice');

      const blob = await res.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `invoice_${bookingId}.pdf`;
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
    } catch (err) {
      console.error('Download error:', err);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-white dark:bg-gray-900 flex items-center justify-center">
        <Spin size="large" tip="Loading booking details..." fullscreen />
      </div>
    );
  }

  if (error || !booking) {
    return (
      <div className="min-h-screen bg-white dark:bg-gray-900 flex items-center justify-center p-6">
        <Result
          status="404"
          title="Booking Not Found"
          subTitle={error || 'Unable to load booking details'}
          extra={
            <Link href="/book">
              <Button type="primary">Back to Booking</Button>
            </Link>
          }
        />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white dark:bg-gray-900 py-8 px-4 transition-colors print:bg-white">
      <div className="max-w-4xl mx-auto">
        {/* Confirmation Header */}
        <Result
          status="success"
          title="Booking Confirmed!"
          subTitle="Your car wash service has been successfully booked and payment received"
          className="dark:bg-gray-800 dark:rounded-lg dark:p-6 dark:!text-white print:mb-8"
        />

        {/* Booking Details Card */}
        <Card 
          className="mt-6 dark:bg-gray-800 dark:border-gray-700 print:shadow-none print:border-0"
          title={<span className="dark:text-white text-lg font-bold">Booking Details</span>}
        >
          <Descriptions
            column={{ xxl: 2, xl: 2, lg: 2, md: 1, sm: 1, xs: 1 }}
            bordered
            size="large"
            className="dark:text-white"
          >
            <Descriptions.Item 
              label={<span className="dark:text-gray-300">Booking ID</span>}
              className="dark:bg-gray-700"
            >
              <span className="font-mono font-bold text-blue-600 dark:text-blue-400">{booking._id}</span>
            </Descriptions.Item>

            <Descriptions.Item 
              label={<span className="dark:text-gray-300">Booking Date</span>}
              className="dark:bg-gray-700 dark:text-white"
            >
              <span className="dark:text-white">{new Date(booking.createdAt).toLocaleDateString('en-IN')}</span>
            </Descriptions.Item>

            <Descriptions.Item 
              label={<span className="dark:text-gray-300">Service Date</span>}
              className="dark:bg-gray-700 dark:text-white"
            >
              <span className="dark:text-white">{new Date(booking.date).toLocaleDateString('en-IN')}</span>
            </Descriptions.Item>

            <Descriptions.Item 
              label={<span className="dark:text-gray-300">Service Time</span>}
              className="dark:bg-gray-700 dark:text-white"
            >
              <span className="dark:text-white">{booking.time}</span>
            </Descriptions.Item>

            <Descriptions.Item 
              label={<span className="dark:text-gray-300">Service Package</span>}
              className="dark:bg-gray-700 dark:text-white"
            >
              <span className="dark:text-white">{booking.service}</span>
            </Descriptions.Item>

            <Descriptions.Item 
              label={<span className="dark:text-gray-300">Location</span>}
              className="dark:bg-gray-700 dark:text-white"
            >
              <span className="dark:text-white">{booking.location}</span>
            </Descriptions.Item>

            <Descriptions.Item 
              label={<span className="dark:text-gray-300">Vehicle</span>}
              className="dark:bg-gray-700 dark:text-white"
            >
              <span className="dark:text-white">{booking.brand} {booking.model} ({booking.vehicleType})</span>
            </Descriptions.Item>

            <Descriptions.Item 
              label={<span className="dark:text-gray-300">Status</span>}
              className="dark:bg-gray-700"
            >
              <span className="inline-block px-3 py-1 bg-green-100 dark:bg-green-900 text-green-800 dark:text-green-200 rounded-full text-sm font-semibold">
                {booking.bookingStatus?.toUpperCase()}
              </span>
            </Descriptions.Item>
          </Descriptions>
        </Card>

        {/* Customer Details */}
        <Card 
          className="mt-6 dark:bg-gray-800 dark:border-gray-700"
          title={<span className="dark:text-white text-lg font-bold">Customer Information</span>}
        >
          <Descriptions
            column={{ xxl: 2, xl: 2, lg: 2, md: 1, sm: 1, xs: 1 }}
            bordered
            size="large"
          >
            <Descriptions.Item 
              label={<span className="dark:text-gray-300">Name</span>}
              className="dark:bg-gray-700 dark:text-white"
            >
              <span className="dark:text-white">{booking.name}</span>
            </Descriptions.Item>

            <Descriptions.Item 
              label={<span className="dark:text-gray-300">Phone</span>}
              className="dark:bg-gray-700 dark:text-white"
            >
              <span className="dark:text-white">{booking.phone}</span>
            </Descriptions.Item>

            <Descriptions.Item 
              label={<span className="dark:text-gray-300">Email</span>}
              className="dark:bg-gray-700 dark:text-white"
            >
              <span className="dark:text-white">{booking.email}</span>
            </Descriptions.Item>
          </Descriptions>
        </Card>

        {/* Payment Details */}
        {payment && (
          <Card 
            className="mt-6 dark:bg-gray-800 dark:border-gray-700"
            title={<span className="dark:text-white text-lg font-bold">Payment Information</span>}
          >
            <Descriptions
              column={{ xxl: 2, xl: 2, lg: 2, md: 1, sm: 1, xs: 1 }}
              bordered
              size="large"
            >
              <Descriptions.Item 
                label={<span className="dark:text-gray-300">Amount</span>}
                className="dark:bg-gray-700"
              >
                <span className="text-lg font-bold text-blue-600 dark:text-blue-400">
                  ₹{payment.amount}
                </span>
              </Descriptions.Item>

              <Descriptions.Item 
                label={<span className="dark:text-gray-300">Transaction ID</span>}
                className="dark:bg-gray-700"
              >
                <span className="font-mono text-sm">{payment.transactionId}</span>
              </Descriptions.Item>

              <Descriptions.Item 
                label={<span className="dark:text-gray-300">Payment Status</span>}
                className="dark:bg-gray-700"
              >
                <span className="inline-block px-3 py-1 bg-green-100 dark:bg-green-900 text-green-800 dark:text-green-200 rounded-full text-sm font-semibold">
                  {payment.status?.toUpperCase()}
                </span>
              </Descriptions.Item>

              <Descriptions.Item 
                label={<span className="dark:text-gray-300">Payment Date</span>}
                className="dark:bg-gray-700"
              >
                {new Date(payment.createdAt).toLocaleString('en-IN')}
              </Descriptions.Item>
            </Descriptions>
          </Card>
        )}

        {/* Action Buttons */}
        <div className="mt-8 flex flex-wrap gap-4 justify-center print:hidden">
          <Button 
            type="primary" 
            size="large" 
            icon={<PrinterOutlined />}
            onClick={handlePrint}
          >
            Print Confirmation
          </Button>

          <Button 
            size="large" 
            icon={<DownloadOutlined />}
            onClick={handleDownloadInvoice}
          >
            Download Invoice
          </Button>

          <Link href="/">
            <Button 
              size="large" 
              icon={<HomeOutlined />}
            >
              Back to Home
            </Button>
          </Link>
        </div>

        {/* Next Steps */}
        <Card 
          className="mt-8 dark:bg-gray-800 dark:border-gray-700"
          title={<span className="dark:text-white text-lg font-bold">What's Next?</span>}
        >
          <ol className="list-decimal list-inside space-y-3 text-gray-700 dark:text-gray-300">
            <li>You will receive a confirmation email shortly</li>
            <li>Our team will contact you on {booking.phone} before the scheduled date</li>
            <li>Make sure the vehicle is accessible at the scheduled time and location</li>
            <li>Payment has been successfully received</li>
            <li>You can track your booking status in your profile</li>
          </ol>
        </Card>
      </div>
    </div>
  );
}
