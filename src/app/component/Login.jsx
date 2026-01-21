  'use client';

import { useState } from 'react';
import { Button, Form, Input, Typography, message, Checkbox, Divider } from 'antd';
import { UserOutlined, LockOutlined, GoogleOutlined, FacebookOutlined } from '@ant-design/icons';
import { useRouter } from 'next/navigation';

const { Title, Text } = Typography;

export default function LoginForm() {
  const [form] = Form.useForm();
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  const onFinish = async (values) => {
    setLoading(true);
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
        if (values.remember) {
          localStorage.setItem('remember_me', 'true');
        }
        // Dispatch custom event to notify Header component
        window.dispatchEvent(new Event('user-login'));
      } catch (_) {}

      message.success('Login successful! Redirecting...');
      form.resetFields();
      setTimeout(() => router.push('/'), 1000);
    } catch (err) {
      console.error('Login submit error:', err);
      message.error('Something went wrong. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="w-full max-w-md rounded-2xl bg-white dark:bg-gray-800 p-8 shadow-2xl items-center transition-all duration-300 hover:shadow-3xl animate-fadeIn">
      <div className="text-center mb-8">
        <div className="inline-block p-3 rounded-full bg-gradient-to-r from-blue-500 to-purple-600 mb-4">
          <UserOutlined className="text-3xl text-white" />
        </div>
        <Title level={2} className="!mb-2 dark:!text-white">
          Welcome Back
        </Title>
        <Text className="block text-gray-500 dark:text-gray-400">
          Login to access your account
        </Text>
      </div>

      <Form form={form} layout="vertical" onFinish={onFinish}>
        <Form.Item
          label={<span className="dark:text-gray-300 font-medium">Email</span>}
          name="email"
          rules={[
            { required: true, message: 'Email is required' },
            { type: 'email', message: 'Enter a valid email' },
          ]}
        >
          <Input
            size="large"
            prefix={<UserOutlined className="text-gray-400" />}
            placeholder="Enter your email"
            className="hover:border-blue-400 transition-colors"
            disabled={loading}
          />
        </Form.Item>

        <Form.Item
          label={<span className="dark:text-gray-300 font-medium">Password</span>}
          name="password"
          rules={[{ required: true, message: 'Password is required' }]}
        >
          <Input.Password
            size="large"
            prefix={<LockOutlined className="text-gray-400" />}
            placeholder="Enter your password"
            className="hover:border-blue-400 transition-colors"
            disabled={loading}
          />
        </Form.Item>

        <div className="flex justify-between items-center mb-4">
          <Form.Item name="remember" valuePropName="checked" noStyle>
            <Checkbox className="dark:text-gray-300">
              Remember me
            </Checkbox>
          </Form.Item>
          <a 
            href="#" 
            className="text-sm text-blue-600 dark:text-blue-400 hover:underline transition-colors"
            onClick={(e) => {
              e.preventDefault();
              message.info('Password reset feature coming soon!');
            }}
          >
            Forgot password?
          </a>
        </div>

        <Button
          type="primary"
          htmlType="submit"
          size="large"
          block
          loading={loading}
          className="mt-2 h-12 font-semibold bg-gradient-to-r from-blue-500 to-purple-600 border-0 hover:from-blue-600 hover:to-purple-700 transition-all duration-300"
        >
          {loading ? 'Logging in...' : 'Login'}
        </Button>
      </Form>

      <Divider className="dark:border-gray-600 my-6">
        <span className="text-gray-500 dark:text-gray-400 text-xs">OR CONTINUE WITH</span>
      </Divider>

      <div className="flex gap-3">
        <Button
          size="large"
          block
          icon={<GoogleOutlined />}
          className="flex items-center justify-center hover:border-red-400 transition-colors"
          onClick={() => message.info('Google login coming soon!')}
        >
          Google
        </Button>
        <Button
          size="large"
          block
          icon={<FacebookOutlined />}
          className="flex items-center justify-center hover:border-blue-400 transition-colors"
          onClick={() => message.info('Facebook login coming soon!')}
        >
          Facebook
        </Button>
      </div>

      <p className="mt-6 text-center text-sm text-gray-600 dark:text-gray-400">
        Don't have an account?
        <a href="/register" className="ml-1 font-medium text-blue-600 dark:text-blue-400 hover:underline transition-colors">
          Register now
        </a>
      </p>
    </div>
  );
}
