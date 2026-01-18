'use client';

import Services from '../component/Services';
import React, { useEffect } from 'react';
import { useRouter } from 'next/navigation';

const Page = () => {
  const router = useRouter();

  useEffect(() => {
    // Check if user is logged in
    try {
      const authUser = localStorage.getItem('auth_user');
      if (!authUser) {
        router.push('/login');
      }
    } catch (_) {
      router.push('/login');
    }
  }, [router]);

  return (
    <div>
      <Services />
    </div>
  );
};

export default Page;