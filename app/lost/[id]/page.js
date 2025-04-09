// app/found/[id]/page.js or app/lost/[id]/page.js
import { getItem } from '../../../lib/db';

export default async function ItemDetail({ params }) {
  const item = await getItem(params.id);
  if (!item) return <div className="container">Item not found.</div>;

  function capitalizeFirst(str) {
    return str?.charAt(0).toUpperCase() + str?.slice(1);
  }  

  return (
    <div className="container" style={{ maxWidth: '900px', margin: '2rem auto' }}>
      <div className="card" style={{ padding: '2rem' }}>
        <h1 style={{ color: 'var(--primary-blue)', marginBottom: '1.5rem' }}>{item.title}</h1>

        {/* Single Image */}
        {item.image_url && (
          <div style={{ marginBottom: '1.5rem' }}>
            <img
              src={item.image_url}
              alt={item.title}
              style={{
                width: '100%',
                maxWidth: '500px',
                height: 'auto',
                objectFit: 'cover',
                borderRadius: '8px',
                boxShadow: '0 2px 5px rgba(0,0,0,0.1)'
              }}
            />
          </div>
        )}

        {/* Details */}
        <div style={{ lineHeight: '1.8' }}>
          <p><strong>Category:</strong> {capitalizeFirst(item.category)}</p>
          <p><strong>Type:</strong> {capitalizeFirst(item.type)}</p> {/* Add if type should be shown */}
          <p><strong>Description:</strong> {item.description}</p>
          <p><strong>Location:</strong> {item.location}</p>
          <p><strong>Date:</strong> {new Date(item.date).toLocaleDateString()}</p>
        </div>

        <hr style={{ margin: '2rem 0' }} />

        <div>
          <h3 style={{ color: 'var(--primary-blue)' }}>Contact</h3>
          <p><strong>Name:</strong> {item.contact_name}</p>
          <p><strong>Email:</strong> <a href={`mailto:${item.contact_email}`}>{item.contact_email}</a></p>
        </div>
      </div>
    </div>
  );
}
