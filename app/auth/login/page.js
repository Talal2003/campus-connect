'use client';

import { Suspense } from 'react';
import LoginForm from '../../../components/LoginForm';

export default function LoginPage() {
  return (
    <Suspense fallback={<div className="container" style={{ maxWidth: '500px', margin: '0 auto', padding: '2rem', textAlign: 'center' }}>Loading...</div>}>
      <LoginForm />
    </Suspense>
  );
} 