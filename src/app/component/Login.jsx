'use client';

import { Button, Form, Input, Typography } from 'antd';
import { UserOutlined, LockOutlined } from '@ant-design/icons';

const { Title, Text } = Typography;

export default function LoginForm() {
  const onFinish = (values) => {
    console.log('Login Data:', values);
    form.resetFields();
  };

  return (
    <div className="w-full max-w-md rounded-2xl bg-white/90 backdrop-blur-md p-8 shadow-2xl items-center ">
      <Title level={2} className="!mb-1 text-center">
        Login
      </Title>
      <Text className="block text-center text-gray-500 mb-6">
        Login to your account
      </Text>

      <Form layout="vertical" onFinish={onFinish}>
        <Form.Item
          label="Email"
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
          label="Password"
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

      <p className="mt-6 text-center text-sm text-gray-600">
        Don’t have an account?
        <a href="/register" className="ml-1 font-medium text-blue-600 hover:underline">
          Register
        </a>
      </p>
    </div>
  );
}
