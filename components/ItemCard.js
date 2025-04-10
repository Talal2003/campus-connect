import Link from 'next/link';
import StatusBadge from './StatusBadge';
import { useState, useEffect } from 'react';

export default function ItemCard({ item }) {
  const { id, type, title, category, location, date, status, image_url } = item;
  const [imageOrientation, setImageOrientation] = useState('landscape');
  
  useEffect(() => {
    if (image_url) {
      const img = new Image();
      img.onload = () => {
        // Detect if image is portrait, landscape, or square
        if (img.height > img.width) {
          setImageOrientation('portrait');
        } else if (Math.abs(img.height - img.width) < 10) { // Allow small tolerance for square detection
          setImageOrientation('square');
        } else {
          setImageOrientation('landscape');
        }
      };
      img.src = image_url;
    }
  }, [image_url]);
  
  function capitalizeFirst(str) {
    return str?.charAt(0).toUpperCase() + str?.slice(1);
  }  

  return (
    <div className="card">
      <div style={{ 
        height: '230px', 
        backgroundColor: 'var(--light-gray)', 
        position: 'relative',
        backgroundImage: image_url ? `url(${image_url})` : 'none',
        backgroundSize: ['portrait', 'square'].includes(imageOrientation) ? 'cover' : 'contain',
        backgroundPosition: 'center',
        backgroundRepeat: 'no-repeat'
      }}>
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