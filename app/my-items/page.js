// app/my-items/page.js
'use client';

import { useEffect, useState } from 'react';
import { useAuth } from '../../lib/auth/authContext';
import { getItems } from '../../lib/db';
import Link from 'next/link';

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

  if (!user) {
    return <div style={{ padding: '2rem' }}>Please log in to view your items.</div>;
  }

  if (loading) {
    return <div style={{ padding: '2rem' }}>Loading your items...</div>;
  }

  return (
    <div className="container" style={{ padding: '2rem' }}>
      <h1 style={{ marginBottom: '1.5rem', color: 'var(--primary-blue)' }}>My Reported Items</h1>

      <section style={{ marginBottom: '3rem' }}>
        <h2 style={{ marginBottom: '1rem', color: 'var(--primary-blue)' }}>Lost Items</h2>
        {lostItems.length === 0 ? (
          <p>You haven’t reported any lost items.</p>
        ) : (
          <div className="grid">
            {lostItems.map(item => (
              <div key={item.id} className="card">
                <h3>{item.title}</h3>
                <p>{item.location}</p>
                <Link href={`/lost/${item.id}`}>View Details →</Link>
              </div>
            ))}
          </div>
        )}
      </section>

      <section>
        <h2 style={{ marginBottom: '1rem', color: 'var(--primary-blue)' }}>Found Items</h2>
        {foundItems.length === 0 ? (
          <p>You haven’t reported any found items.</p>
        ) : (
          <div className="grid">
            {foundItems.map(item => (
              <div key={item.id} className="card">
                <h3>{item.title}</h3>
                <p>{item.location}</p>
                <Link href={`/found/${item.id}`}>View Details →</Link>
              </div>
            ))}
          </div>
        )}
      </section>
    </div>
  );
}
