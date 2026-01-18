'use client';

import { Button, Form, Input, Typography, message } from 'antd';
import { UserOutlined, MailOutlined, LockOutlined } from '@ant-design/icons';
import { useRouter } from 'next/navigation';

const { Title, Text } = Typography;
export default function RegisterForm({children}) {

 
  const [form] = Form.useForm()
  const router = useRouter()

  const onFinish = async (values) => {
    try {
      // Send registration data to the API
      const res = await fetch('/api/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(values),
      })

      const data = await res.json()

      if (!res.ok || !data?.success) {
        // Show error popup
        const errorMsg = data?.error || 'Registration failed'
        message.error(errorMsg)
        return // Don't proceed if registration failed
      }

      // Show success popup
      message.success('Registration successful!')

      // Reset form and redirect to login
      form.resetFields()
      setTimeout(() => {
        router.push('/login')
      }, 1500) // Wait for popup to show
    } catch (err) {
      message.error('Something went wrong. Please try again.')
    }
  };


  return (
    <div className="w-full max-w-md rounded-2xl bg-white/90 backdrop-blur-md p-8 shadow-2xl">
      <Title level={2} className="!mb-1 text-center">
        Create Account 
      </Title>
      <Text className="block text-center text-gray-500 mb-6">
        Sign up to get started
      </Text>

      <Form
        form={form}             
        layout="vertical"
        onFinish={onFinish}      
      >
        <Form.Item
          label="Full Name"
          name="name"
          rules={[{ required: true, message: 'Name is required' }]}
        >
          <Input size="large" prefix={<UserOutlined />} />
        </Form.Item>

        <Form.Item
          label="Email"
          name="email"
          rules={[
            { required: true, message: 'Email is required' },
            { type: 'email', message: 'Enter a valid email' },
          ]}
        >
          <Input size="large" prefix={<MailOutlined />} />
        </Form.Item>

        <Form.Item
          label="Password"
          name="password"
          rules={[
            { required: true, message: 'Password is required' },
            { min: 6, message: 'Minimum 6 characters' },
          ]}
          hasFeedback
        >
          <Input.Password size="large" prefix={<LockOutlined />} />
        </Form.Item>

        <Form.Item
          label="Confirm Password"
          name="confirmPassword"
          dependencies={['password']}
          hasFeedback
          rules={[
            { required: true, message: 'Confirm your password' },
            ({ getFieldValue }) => ({
              validator(_, value) {
                if (!value || getFieldValue('password') === value) {
                  return Promise.resolve();
                }
                return Promise.reject(new Error('Passwords do not match'));
              },
            }),
          ]}
        >
          <Input.Password size="large" prefix={<LockOutlined />} />
        </Form.Item>

        <Button
          type="primary"
          htmlType="submit"
          size="large"
          block
          className="mt-2"
        >
          Register
        </Button>
      </Form>

      <p className="mt-6 text-center text-sm text-gray-600">
        Already have an account?
        <a href="/login" className="ml-1 font-medium text-blue-600 hover:underline">
          Login
        </a>
      </p>
    </div>
  );
}
