'use client';

import ItemForm from '../../../components/ItemForm';
import RequireAuth from '../../../lib/auth/requireAuth';

export default function ReportFoundPage() {
  return (
    <RequireAuth>
      <div>
        <h1 style={{ color: 'var(--primary-blue)', marginBottom: '2rem' }}>Report a Found Item</h1>
        <ItemForm type="found" />
      </div>
    </RequireAuth>
  );
} 