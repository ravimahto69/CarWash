  'use client';

import { Button, Form, Input, Typography, message } from 'antd';
import { UserOutlined, LockOutlined } from '@ant-design/icons';
import { useRouter } from 'next/navigation';

const { Title, Text } = Typography;

export default function LoginForm() {
  const [form] = Form.useForm();
  const router = useRouter();

  const onFinish = async (values) => {
    try {
      const res = await fetch('/api/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(values),
      });

      const data = await res.json();

      if (!res.ok || !data?.success) {
        const errorMsg = data?.error || 'Invalid email or password';
        message.error(errorMsg);
        return;
      }

      // Save user data to localStorage
      try {
        localStorage.setItem('auth_user', JSON.stringify(data.data));
        // Dispatch custom event to notify Header component
        window.dispatchEvent(new Event('user-login'));
      } catch (_) {}

      message.success('Login successful!');
      form.resetFields();
      router.push('/');
    } catch (err) {
      console.error('Login submit error:', err);
      message.error('Something went wrong. Please try again.');
    }
  };

  return (
    <div className="w-full max-w-md rounded-2xl bg-white dark:bg-gray-800 p-8 shadow-2xl items-center transition-colors ">
      <Title level={2} className="!mb-1 text-center dark:!text-white">
        Login
      </Title>
      <Text className="block text-center text-gray-500 dark:text-gray-400 mb-6">
        Login to your account
      </Text>

      <Form form={form} layout="vertical" onFinish={onFinish}>
        <Form.Item
          label={<span className="dark:text-gray-300">Email</span>}
          name="email"
          rules={[
            { required: true, message: 'Email is required' },
            { type: 'email', message: 'Enter a valid email' },
          ]}
        >
          <Input
            size="large"
            prefix={<UserOutlined />}
            placeholder="Enter your email"
          />
        </Form.Item>

        <Form.Item
          label={<span className="dark:text-gray-300">Password</span>}
          name="password"
          rules={[{ required: true, message: 'Password is required' }]}
        >
          <Input.Password
            size="large"
            prefix={<LockOutlined />}
            placeholder="Enter your password"
          />
        </Form.Item>

        <Button
          type="primary"
          htmlType="submit"
          size="large"
          block
          className="mt-2"
        >
          Login
        </Button>
      </Form>

      <p className="mt-6 text-center text-sm text-gray-600 dark:text-gray-400">
        Don't have an account?
        <a href="/register" className="ml-1 font-medium text-blue-600 dark:text-blue-400 hover:underline">
          Register
        </a>
      </p>
    </div>
  );
}
