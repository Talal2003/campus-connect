// app/found/[id]/page.js
import { getItem } from '../../../lib/db';

export default async function FoundItemDetail({ params }) {
  const item = await getItem(params.id);

  if (!item) {
    return <div style={{ padding: '2rem' }}>Item not found.</div>;
  }

  return (
    <div className="card" style={{ padding: '2rem' }}>
      <h1>{item.title}</h1>
      <p><strong>Category:</strong> {item.category}</p>
      <p><strong>Description:</strong> {item.description}</p>
      <p><strong>Location:</strong> {item.location}</p>
      <p><strong>Date:</strong> {new Date(item.date).toLocaleDateString()}</p>
      <p><strong>Reported by:</strong> {item.contact_name}</p>
      <p><strong>Contact email:</strong> <a href={`mailto:${item.contact_email}`}>{item.contact_email}</a></p>
      {item.image_url && (
        <img
          src={item.image_url}
          alt={item.title}
          style={{ width: '100%', maxWidth: '400px', marginTop: '1rem' }}
        />
      )}
    </div>
  );
}
