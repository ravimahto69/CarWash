'use client';

import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import UserProfile from '@/app/component/UserProfile';
import { Spin } from 'antd';

const ProfilePage = () => {
  const router = useRouter();
  const [userEmail, setUserEmail] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    try {
      const authUser = localStorage.getItem('auth_user');
      if (!authUser) {
        router.push('/login');
        return;
      }
      
      const user = JSON.parse(authUser);
      const email = user?.email;
      
      if (!email) {
        router.push('/login');
        return;
      }
      
      setUserEmail(email);
      setLoading(false);
    } catch (err) {
      console.error('Error reading auth:', err);
      router.push('/login');
    }
  }, [router]);

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <Spin size="large" />
      </div>
    );
  }

  if (!userEmail) {
    return null;
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 py-8">
      <div className="max-w-6xl mx-auto">
        <h1 className="text-4xl font-bold mb-8 text-gray-800 dark:text-white text-center">
          👤 My Profile
        </h1>
        <UserProfile userEmail={userEmail} />
      </div>
    </div>
  );
};

export default ProfilePage;
