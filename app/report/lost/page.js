import ItemForm from '../../../components/ItemForm';

export default function ReportLostPage() {
  return (
    <div>
      <h1 style={{ color: 'var(--primary-blue)', marginBottom: '2rem' }}>Report a Lost Item</h1>
      <ItemForm type="lost" />
    </div>
  );
} 