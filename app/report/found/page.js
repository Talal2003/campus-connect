import ItemForm from '../../../components/ItemForm';

export default function ReportFoundPage() {
  return (
    <div>
      <h1 style={{ color: 'var(--primary-blue)', marginBottom: '2rem' }}>Report a Found Item</h1>
      <ItemForm type="found" />
    </div>
  );
} 