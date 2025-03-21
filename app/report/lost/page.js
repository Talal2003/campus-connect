'use client';

import ItemForm from '../../../components/ItemForm';
import RequireAuth from '../../../lib/auth/requireAuth';

export default function ReportLostPage() {
  return (
    <RequireAuth>
      <div>
        <h1 style={{ color: 'var(--primary-blue)', marginBottom: '2rem' }}>Report a Lost Item</h1>
        <ItemForm type="lost" />
      </div>
    </RequireAuth>
  );
} 