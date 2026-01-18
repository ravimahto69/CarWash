'use client';

import React, { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Book from '../component/Book';

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
      <Book />
    </div>
  );
};

export default Page;