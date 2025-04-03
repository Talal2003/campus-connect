'use client';

import { useEffect, useState } from 'react';
import { useAuth } from '../../lib/auth/authContext';
import { getItems } from '../../lib/db';
import Link from 'next/link';
import Image from 'next/image';

export default function MyItemsPage() {
  const { user } = useAuth();
  const [lostItems, setLostItems] = useState([]);
  const [foundItems, setFoundItems] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user) return;

    const fetchMyItems = async () => {
      setLoading(true);
      const allItems = await getItems(); // get all items
      const myLost = allItems.filter(item => item.user_id === user.id && item.type === 'lost');
      const myFound = allItems.filter(item => item.user_id === user.id && item.type === 'found');
      setLostItems(myLost);
      setFoundItems(myFound);
      setLoading(false);
    };

    fetchMyItems();
  }, [user]);

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return `${date.getMonth() + 1}/${date.getDate()}/${date.getFullYear()}`;
  };

  if (!user) {
    return <div style={{ padding: '2rem' }}>Please log in to view your items.</div>;
  }

  if (loading) {
    return <div style={{ padding: '2rem' }}>Loading your items...</div>;
  }

  const renderItemGrid = (items, type) => (
    <div style={{
      display: 'grid',
      gridTemplateColumns: 'repeat(auto-fill, minmax(250px, 1fr))',
      gap: '1.5rem'
    }}>
      {items.map(item => (
        <div key={item.id} className="card">
          <div style={{ height: '150px', backgroundColor: 'var(--light-gray)', position: 'relative' }}>
            {item.image_url && (
              <Image
                src={item.image_url}
                alt={item.title}
                fill
                style={{ objectFit: 'cover' }}
              />
            )}
            <div style={{
              position: 'absolute',
              top: '0.5rem',
              right: '0.5rem',
              backgroundColor: 'var(--primary-yellow)',
              color: 'var(--primary-blue)',
              padding: '0.25rem 0.5rem',
              borderRadius: '0.25rem',
              fontWeight: 'bold',
              fontSize: '0.75rem'
            }}>
              {type.toUpperCase()}
            </div>
          </div>
          <div style={{ padding: '1rem' }}>
            <h3 style={{ marginBottom: '0.5rem', fontSize: '1.1rem' }}>{item.title}</h3>
            <p style={{ color: 'var(--dark-gray)', fontSize: '0.9rem', marginBottom: '0.5rem' }}>
              Location: {item.location || item.building}
            </p>
            <p style={{ color: 'var(--dark-gray)', fontSize: '0.9rem' }}>
              Date: {formatDate(item.date)}
            </p>
            <Link href={`/${type}/${item.id}`} style={{
              display: 'inline-block',
              marginTop: '1rem',
              color: 'var(--primary-blue)',
              fontWeight: '500'
            }}>
              View Details →
            </Link>
          </div>
        </div>
      ))}
    </div>
  );

  return (
    <div className="container" style={{ padding: '2rem' }}>
      <h1 style={{ marginBottom: '2rem', color: 'var(--primary-blue)' }}>My Reported Items</h1>

      <section style={{ marginBottom: '4rem' }}>
        <h2 style={{ marginBottom: '1.5rem', color: 'var(--primary-blue)' }}>Lost Items</h2>
        {lostItems.length === 0 ? (
          <p>You haven’t reported any lost items.</p>
        ) : (
          renderItemGrid(lostItems, 'lost')
        )}
      </section>

      <section>
        <h2 style={{ marginBottom: '1.5rem', color: 'var(--primary-blue)' }}>Found Items</h2>
        {foundItems.length === 0 ? (
          <p>You haven’t reported any found items.</p>
        ) : (
          renderItemGrid(foundItems, 'found')
        )}
      </section>
    </div>
  );
}
