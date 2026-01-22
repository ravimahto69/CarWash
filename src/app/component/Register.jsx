'use client';

import { useState } from 'react';
import { Button, Form, Input, Typography, message, Progress, Checkbox, Divider } from 'antd';
import { UserOutlined, MailOutlined, LockOutlined, GoogleOutlined, FacebookOutlined, PhoneOutlined } from '@ant-design/icons';
import { useRouter } from 'next/navigation';
import { signIn } from 'next-auth/react';

const { Title, Text } = Typography;

export default function RegisterForm({children}) {
  const [form] = Form.useForm();
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [passwordStrength, setPasswordStrength] = useState(0);
  const [oauthLoading, setOauthLoading] = useState({ google: false, facebook: false });

  const handleOAuthSignUp = async (provider) => {
    setOauthLoading({ ...oauthLoading, [provider]: true });
    try {
      const result = await signIn(provider, {
        callbackUrl: '/',
        redirect: false,
      });

      if (result?.error) {
        message.error(`${provider} signup failed. Please try again.`);
      } else if (result?.ok) {
        message.success(`${provider} signup successful! Redirecting...`);
        setTimeout(() => router.push('/'), 1000);
      }
    } catch (error) {
      message.error('An error occurred during signup');
    } finally {
      setOauthLoading({ ...oauthLoading, [provider]: false });
    }
  };

  const calculatePasswordStrength = (password) => {
    if (!password) return 0;
    let strength = 0;
    if (password.length >= 6) strength += 20;
    if (password.length >= 8) strength += 20;
    if (/[a-z]/.test(password) && /[A-Z]/.test(password)) strength += 20;
    if (/\d/.test(password)) strength += 20;
    if (/[^a-zA-Z0-9]/.test(password)) strength += 20;
    return strength;
  };

  const getPasswordStrengthColor = (strength) => {
    if (strength <= 40) return '#ff4d4f';
    if (strength <= 60) return '#faad14';
    if (strength <= 80) return '#1890ff';
    return '#52c41a';
  };

  const getPasswordStrengthText = (strength) => {
    if (strength === 0) return '';
    if (strength <= 40) return 'Weak';
    if (strength <= 60) return 'Fair';
    if (strength <= 80) return 'Good';
    return 'Strong';
  };

  const onFinish = async (values) => {
    setLoading(true);
    try {
      // Send registration data to the API
      const res = await fetch('/api/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(values),
      });

      const data = await res.json();

      if (!res.ok || !data?.success) {
        // Show error popup
        const errorMsg = data?.error || 'Registration failed';
        message.error(errorMsg);
        return; // Don't proceed if registration failed
      }

      // Show success popup
      message.success('Registration successful! Redirecting to login...');

      // Reset form and redirect to login
      form.resetFields();
      setTimeout(() => {
        router.push('/login');
      }, 1500); // Wait for popup to show
    } catch (err) {
      message.error('Something went wrong. Please try again.');
    } finally {
      setLoading(false);
    }
  };


  return (
    <div className="w-full max-w-md rounded-2xl bg-white dark:bg-gray-800 p-8 shadow-2xl transition-all duration-300 hover:shadow-3xl animate-fadeIn">
      <div className="text-center mb-6">
        <div className="inline-block p-3 rounded-full bg-gradient-to-r from-blue-500 to-purple-600 mb-4">
          <UserOutlined className="text-3xl text-white" />
        </div>
        <Title level={2} className="!mb-2 dark:!text-white">
          Create Account
        </Title>
        <Text className="block text-gray-500 dark:text-gray-400">
          Sign up to get started with WashHub
        </Text>
      </div>

      <Form
        form={form}             
        layout="vertical"
        onFinish={onFinish}      
      >
        <Form.Item
          label={<span className="dark:text-gray-300 font-medium">Full Name</span>}
          name="name"
          rules={[
            { required: true, message: 'Name is required' },
            { min: 2, message: 'Name must be at least 2 characters' },
          ]}
        >
          <Input 
            size="large" 
            prefix={<UserOutlined className="text-gray-400" />} 
            placeholder="Enter your full name"
            className="hover:border-blue-400 transition-colors"
            disabled={loading}
          />
        </Form.Item>

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
            prefix={<MailOutlined className="text-gray-400" />} 
            placeholder="Enter your email"
            className="hover:border-blue-400 transition-colors"
            disabled={loading}
          />
        </Form.Item>

        <Form.Item
          label={<span className="dark:text-gray-300 font-medium">Phone Number (Optional)</span>}
          name="phone"
          rules={[
            { pattern: /^[0-9]{10}$/, message: 'Enter valid 10-digit phone number' },
          ]}
        >
          <Input 
            size="large" 
            prefix={<PhoneOutlined className="text-gray-400" />} 
            placeholder="Enter your phone number"
            className="hover:border-blue-400 transition-colors"
            disabled={loading}
          />
        </Form.Item>

        <Form.Item
          label={<span className="dark:text-gray-300 font-medium">Password</span>}
          name="password"
          rules={[
            { required: true, message: 'Password is required' },
            { min: 6, message: 'Minimum 6 characters required' },
          ]}
          hasFeedback
        >
          <Input.Password 
            size="large" 
            prefix={<LockOutlined className="text-gray-400" />} 
            placeholder="Create a strong password"
            className="hover:border-blue-400 transition-colors"
            onChange={(e) => setPasswordStrength(calculatePasswordStrength(e.target.value))}
            disabled={loading}
          />
        </Form.Item>

        {passwordStrength > 0 && (
          <div className="mb-4 -mt-2">
            <Progress 
              percent={passwordStrength} 
              strokeColor={getPasswordStrengthColor(passwordStrength)}
              showInfo={false}
              size="small"
            />
            <Text className="text-xs dark:text-gray-400" style={{ color: getPasswordStrengthColor(passwordStrength) }}>
              Password Strength: {getPasswordStrengthText(passwordStrength)}
            </Text>
          </div>
        )}

        <Form.Item
          label={<span className="dark:text-gray-300 font-medium">Confirm Password</span>}
          name="confirmPassword"
          dependencies={['password']}
          hasFeedback
          rules={[
            { required: true, message: 'Please confirm your password' },
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
          <Input.Password 
            size="large" 
            prefix={<LockOutlined className="text-gray-400" />} 
            placeholder="Confirm your password"
            className="hover:border-blue-400 transition-colors"
            disabled={loading}
          />
        </Form.Item>

        <Form.Item
          name="terms"
          valuePropName="checked"
          rules={[
            {
              validator: (_, value) =>
                value ? Promise.resolve() : Promise.reject(new Error('Please accept the terms and conditions')),
            },
          ]}
        >
          <Checkbox className="dark:text-gray-300">
            I agree to the{' '}
            <a href="#" className="text-blue-600 dark:text-blue-400 hover:underline">
              Terms and Conditions
            </a>
          </Checkbox>
        </Form.Item>

        <Button
          type="primary"
          htmlType="submit"
          size="large"
          block
          loading={loading}
          className="mt-2 h-12 font-semibold bg-gradient-to-r from-blue-500 to-purple-600 border-0 hover:from-blue-600 hover:to-purple-700 transition-all duration-300"
        >
          {loading ? 'Creating Account...' : 'Create Account'}
        </Button>
      </Form>

      <Divider className="dark:border-gray-600 my-6">
        <span className="text-gray-500 dark:text-gray-400 text-xs">OR SIGN UP WITH</span>
      </Divider>

      <div className="flex gap-3">
        <Button
          size="large"
          block
          icon={<GoogleOutlined />}
          className="flex items-center justify-center hover:border-red-400 transition-colors"
          onClick={() => handleOAuthSignUp('google')}
          loading={oauthLoading.google}
          disabled={loading || oauthLoading.facebook}
        >
          Google
        </Button>
        <Button
          size="large"
          block
          icon={<FacebookOutlined />}
          className="flex items-center justify-center hover:border-blue-400 transition-colors"
          onClick={() => handleOAuthSignUp('facebook')}
          loading={oauthLoading.facebook}
          disabled={loading || oauthLoading.google}
        >
          Facebook
        </Button>
      </div>

      <p className="mt-6 text-center text-sm text-gray-600 dark:text-gray-400">
        Already have an account?
        <a href="/login" className="ml-1 font-medium text-blue-600 dark:text-blue-400 hover:underline transition-colors">
          Login here
        </a>
      </p>
    </div>
  );
}
