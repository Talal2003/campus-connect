import Link from 'next/link';
import StatusBadge from './StatusBadge';

export default function ItemCard({ item }) {
  const { id, type, title, category, location, date, status, image_url } = item;
  
  function capitalizeFirst(str) {
    return str?.charAt(0).toUpperCase() + str?.slice(1);
  }  

  return (
    <div className="card">
      <div style={{ 
        height: '180px', 
        backgroundColor: 'var(--light-gray)', 
        position: 'relative',
        backgroundImage: image_url ? `url(${image_url})` : 'none',
        backgroundSize: 'cover',
        backgroundPosition: 'center'
      }}>
        <div style={{ 
          position: 'absolute', 
          top: '0.5rem', 
          right: '0.5rem',
          backgroundColor: type === 'lost' ? 'var(--danger)' : 'var(--primary-yellow)',
          color: type === 'lost' ? 'white' : 'var(--primary-blue)',
          padding: '0.25rem 0.5rem',
          borderRadius: '0.25rem',
          fontWeight: 'bold',
          fontSize: '0.75rem',
          textTransform: 'uppercase'
        }}>
          {type}
        </div>
      </div>
      
      <div style={{ padding: '1rem' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '0.5rem' }}>
          <h3 style={{ fontSize: '1.1rem', marginRight: '0.5rem' }}>{title}</h3>
          <StatusBadge status={status} />
        </div>
        
        <p style={{ color: 'var(--dark-gray)', fontSize: '0.9rem', marginBottom: '0.5rem' }}>
          Category: {capitalizeFirst(category)}
        </p>

        
        <p style={{ color: 'var(--dark-gray)', fontSize: '0.9rem', marginBottom: '0.5rem' }}>
          Location: {location}
        </p>
        
        <p style={{ color: 'var(--dark-gray)', fontSize: '0.9rem' }}>
          Date: {new Date(date).toLocaleDateString()}
        </p>
        
        <Link href={`/${type}/${id}`} style={{ 
          display: 'inline-block', 
          marginTop: '1rem',
          color: 'var(--primary-blue)',
          fontWeight: '500'
        }}>
          View Details →
        </Link>
      </div>
    </div>
  );
} 