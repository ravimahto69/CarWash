'use client';

import { useState, useEffect } from 'react';
import { Button, Form, Input, Card, Spin, message, Alert, Row, Col, Divider } from 'antd';
import { CreditCardOutlined } from '@ant-design/icons';
import { useRouter, useSearchParams } from 'next/navigation';

export default function PaymentPage() {
  const [form] = Form.useForm();
  const router = useRouter();
  const searchParams = useSearchParams();
  
  const [loading, setLoading] = useState(false);
  const [mounted, setMounted] = useState(false);

  const bookingId = searchParams.get('bookingId');
  const amount = searchParams.get('amount');
  const serviceType = searchParams.get('service');

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (!bookingId || !amount) {
      message.error('Invalid payment details');
      router.push('/book');
    }
  }, [bookingId, amount, router]);

  const handlePayment = async (values) => {
    try {
      setLoading(true);

      const userString = localStorage.getItem('auth_user');
      if (!userString) {
        message.error('Please login first');
        setLoading(false);
        return;
      }

      const user = JSON.parse(userString);
      const userId = user?._id || user?.id; // login API returns id (not _id)
      if (!userId) {
        message.error('Invalid user session');
        setLoading(false);
        return;
      }

      // Create payment link on server and redirect user to Razorpay hosted page
      const linkRes = await fetch('/api/payment/link', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          amount: parseInt(amount),
          bookingId,
          userId,
          customerName: values.name,
          customerEmail: values.email,
          customerPhone: values.phone,
          serviceType,
        }),
      });

      const linkData = await linkRes.json();
      if (!linkRes.ok || !linkData.success) {
        throw new Error(linkData.error || 'Failed to create payment link');
      }

      // Redirect to Razorpay hosted payment page
      window.location.href = linkData.data.shortUrl;
    } catch (error) {
      console.error('Payment link error:', error);
      message.error(error.message || 'Payment initiation failed');
    } finally {
      setLoading(false);
    }
  };

  const formatCurrency = (value) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
    }).format(value);
  };

  // Success/fail screens are handled by Razorpay hosted page

  if (!mounted) {
    return <Spin size="large" fullscreen />;
  }

  return (
    <div className="min-h-screen bg-white dark:bg-gray-900 py-8 px-4 transition-colors">
      <div className="max-w-2xl mx-auto">
        <Row gutter={[24, 24]}>
          {/* Order Summary */}
          <Col xs={24} md={12}>
            <Card className="dark:bg-gray-800 dark:border-gray-700 h-full">
              <h2 className="text-2xl font-bold text-gray-800 dark:text-white mb-6">
                Order Summary
              </h2>

              <div className="space-y-4">
                <div className="flex justify-between items-center pb-4 border-b dark:border-gray-700">
                  <span className="text-gray-600 dark:text-gray-400">Service</span>
                  <span className="font-semibold text-gray-800 dark:text-white">{serviceType}</span>
                </div>

                <div className="flex justify-between items-center pb-4 border-b dark:border-gray-700">
                  <span className="text-gray-600 dark:text-gray-400">Booking ID</span>
                  <span className="font-mono text-sm text-gray-800 dark:text-white">{bookingId?.slice(-8)}</span>
                </div>

                <div className="flex justify-between items-center pb-4 border-b dark:border-gray-700">
                  <span className="text-gray-600 dark:text-gray-400">Amount</span>
                  <span className="text-lg font-bold text-blue-600 dark:text-blue-400">
                    {formatCurrency(amount)}
                  </span>
                </div>

                <Alert
                  message="Secure Payment"
                  description="Your payment is processed securely through Razorpay"
                  type="info"
                  showIcon
                  className="mt-6"
                />
              </div>
            </Card>
          </Col>

          {/* Payment Form */}
          <Col xs={24} md={12}>
            <Card className="dark:bg-gray-800 dark:border-gray-700 h-full">
              <h2 className="text-2xl font-bold text-gray-800 dark:text-white mb-6 flex items-center gap-2">
                <CreditCardOutlined /> Payment Details
              </h2>

              <Form
                form={form}
                layout="vertical"
                onFinish={handlePayment}
                disabled={loading}
              >
                <Form.Item
                  label={<span className="dark:text-gray-300">Full Name</span>}
                  name="name"
                  rules={[{ required: true, message: 'Name is required' }]}
                >
                  <Input 
                    placeholder="John Doe"
                    className="dark:bg-gray-700 dark:text-white dark:border-gray-600"
                  />
                </Form.Item>

                <Form.Item
                  label={<span className="dark:text-gray-300">Email</span>}
                  name="email"
                  rules={[
                    { required: true, message: 'Email is required' },
                    { type: 'email', message: 'Invalid email' },
                  ]}
                >
                  <Input 
                    placeholder="john@example.com"
                    className="dark:bg-gray-700 dark:text-white dark:border-gray-600"
                  />
                </Form.Item>

                <Form.Item
                  label={<span className="dark:text-gray-300">Phone Number</span>}
                  name="phone"
                  rules={[
                    { required: true, message: 'Phone is required' },
                    { 
                      pattern: /^[0-9]{10}$/, 
                      message: 'Enter valid 10-digit phone number' 
                    },
                  ]}
                >
                  <Input 
                    placeholder="9876543210"
                    className="dark:bg-gray-700 dark:text-white dark:border-gray-600"
                  />
                </Form.Item>

                <Divider className="dark:border-gray-700" />

                <Button
                  type="primary"
                  size="large"
                  block
                  loading={loading}
                  onClick={() => form.submit()}
                  className="!h-12 !text-base font-semibold"
                >
                  {loading ? 'Processing...' : `Pay ${formatCurrency(amount)}`}
                </Button>

                <p className="text-xs text-gray-500 dark:text-gray-400 text-center mt-4">
                  Click Pay to proceed to Razorpay payment gateway
                </p>
              </Form>
            </Card>
          </Col>
        </Row>
      </div>
    </div>
  );
}
