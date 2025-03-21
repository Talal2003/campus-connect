'use client';

import Link from 'next/link';

export default function ReportPage() {
  return (
    <div style={{ textAlign: 'center', padding: '2rem' }}>
      <h1 style={{ color: 'var(--primary-blue)' }}>Report an Item</h1>
      <p>Please select one of the options below:</p>
      <div style={{ display: 'flex', justifyContent: 'center', gap: '2rem', marginTop: '2rem' }}>
        <Link href="/report/found" style={{ backgroundColor: 'var(--primary-yellow)', color: 'var(--primary-blue)', padding: '1rem 2rem', borderRadius: '5px', textDecoration: 'none' }}>
          I have found an Item
        </Link>
        <Link href="/report/lost" style={{ backgroundColor: 'var(--primary-yellow)', color: 'var(--primary-blue)', padding: '1rem 2rem', borderRadius: '5px', textDecoration: 'none' }}>
          I have lost an Item
        </Link>
      </div>
    </div>
  );
} 