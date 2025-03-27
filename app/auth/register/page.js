'use client';

import { Suspense } from 'react';
import RegisterForm from '../../../components/RegisterForm';

export default function RegisterPage() {
  return (
    <Suspense fallback={<div className="container" style={{ maxWidth: '500px', margin: '0 auto', padding: '2rem', textAlign: 'center' }}>Loading...</div>}>
      <RegisterForm />
    </Suspense>
  );
} 