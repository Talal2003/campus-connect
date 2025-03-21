'use client';

import Link from 'next/link';
import Image from 'next/image';
import { useState, useEffect } from 'react';

export default function Home() {
  const [recentItems, setRecentItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchRecentItems = async () => {
      try {
        setLoading(true);
        const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/items?type=found&limit=4`);
        
        if (!response.ok) {
          throw new Error('Failed to fetch recent items');
        }
        
        const data = await response.json();
        // Sort by date (newest first) and take the first 4
        const sortedItems = data
          .sort((a, b) => new Date(b.date) - new Date(a.date))
          .slice(0, 4);
          
        setRecentItems(sortedItems);
      } catch (error) {
        console.error('Error fetching recent items:', error);
        setError('Failed to load recent items');
      } finally {
        setLoading(false);
      }
    };
    
    fetchRecentItems();
  }, []);

  // Format date to MM/DD/YYYY
  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return `${date.getMonth() + 1}/${date.getDate()}/${date.getFullYear()}`;
  };

  return (
    <div>
      <section style={{ 
        backgroundColor: 'var(--primary-blue)', 
        color: 'white',
        padding: '3rem 0',
        margin: '0 -1rem 2rem -1rem',
        textAlign: 'center'
      }}>
        <div className="container">
          <h1 style={{ fontSize: '2.5rem', marginBottom: '1rem' }}>
            University of Toledo Lost & Found
          </h1>
          <p style={{ fontSize: '1.25rem', maxWidth: '800px', margin: '0 auto 2rem auto' }}>
            A centralized system to help UT students find lost items and report found ones
          </p>
          <div style={{ display: 'flex', gap: '1rem', justifyContent: 'center' }}>
            <Link href="/lost" className="btn-secondary">
              Find Lost Items
            </Link>
            <Link href="/report" className="btn-secondary">
              Report
            </Link>
          </div>
        </div>
      </section>

      <section style={{ marginBottom: '3rem' }}>
        <h2 style={{ textAlign: 'center', marginBottom: '2rem', color: 'var(--primary-blue)' }}>
          How It Works
        </h2>
        
        <div style={{ 
          display: 'grid', 
          gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', 
          gap: '2rem' 
        }}>
          <div className="card" style={{ padding: '1.5rem', textAlign: 'center' }}>
            <div style={{ 
              backgroundColor: 'var(--primary-yellow)', 
              width: '60px', 
              height: '60px', 
              borderRadius: '50%', 
              display: 'flex', 
              alignItems: 'center', 
              justifyContent: 'center',
              margin: '0 auto 1rem auto',
              fontSize: '1.5rem',
              fontWeight: 'bold',
              color: 'var(--primary-blue)'
            }}>1</div>
            <h3 style={{ marginBottom: '1rem', color: 'var(--primary-blue)' }}>Report</h3>
            <p>Report a lost item or submit details about an item you found on campus.</p>
          </div>
          
          <div className="card" style={{ padding: '1.5rem', textAlign: 'center' }}>
            <div style={{ 
              backgroundColor: 'var(--primary-yellow)', 
              width: '60px', 
              height: '60px', 
              borderRadius: '50%', 
              display: 'flex', 
              alignItems: 'center', 
              justifyContent: 'center',
              margin: '0 auto 1rem auto',
              fontSize: '1.5rem',
              fontWeight: 'bold',
              color: 'var(--primary-blue)'
            }}>2</div>
            <h3 style={{ marginBottom: '1rem', color: 'var(--primary-blue)' }}>Track</h3>
            <p>Track the status of your item and receive updates when it's found or claimed.</p>
          </div>
          
          <div className="card" style={{ padding: '1.5rem', textAlign: 'center' }}>
            <div style={{ 
              backgroundColor: 'var(--primary-yellow)', 
              width: '60px', 
              height: '60px', 
              borderRadius: '50%', 
              display: 'flex', 
              alignItems: 'center', 
              justifyContent: 'center',
              margin: '0 auto 1rem auto',
              fontSize: '1.5rem',
              fontWeight: 'bold',
              color: 'var(--primary-blue)'
            }}>3</div>
            <h3 style={{ marginBottom: '1rem', color: 'var(--primary-blue)' }}>Retrieve</h3>
            <p>Pick up your item from UTPD after verifying your ownership.</p>
          </div>
        </div>
      </section>

      <section style={{ marginBottom: '3rem' }}>
        <h2 style={{ textAlign: 'center', marginBottom: '2rem', color: 'var(--primary-blue)' }}>
          UTPD Information
        </h2>
        
        <div className="card" style={{ padding: '1.5rem' }}>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            <p><strong>Office:</strong> 419.530.2222</p>
            <p><strong>Email:</strong> utpolice@utoledo.edu</p>
            <p><strong>Website:</strong> <a href="https://police.utoledo.edu">police.utoledo.edu</a></p>
            <p>- Found University keys may be returned to Key Control located in Plant Operations</p>
            <p>- Found UT Rocket Cards may be returned to the campus card office in the Student Union </p>
            <Link href="/lost-and-found-locations.pdf" className="btn-primary" style={{ marginTop: '1rem', textAlign: 'center' }}>
              View a list of lost and found locations
            </Link>
          </div>
        </div>
      </section>

      <section>
        <h2 style={{ textAlign: 'center', marginBottom: '2rem', color: 'var(--primary-blue)' }}>
          Recently Found Items
        </h2>
        
        {loading ? (
          <div style={{ textAlign: 'center', padding: '2rem' }}>
            <p>Loading recent items...</p>
          </div>
        ) : error ? (
          <div style={{ textAlign: 'center', padding: '2rem', color: 'var(--error-red)' }}>
            <p>{error}</p>
          </div>
        ) : recentItems.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '2rem' }}>
            <p>No found items available.</p>
          </div>
        ) : (
          <div style={{ 
            display: 'grid', 
            gridTemplateColumns: 'repeat(auto-fill, minmax(250px, 1fr))', 
            gap: '1.5rem' 
          }}>
            {recentItems.map((item) => (
              <div key={item.id} className="card">
                <div style={{ height: '150px', backgroundColor: 'var(--light-gray)', position: 'relative' }}>
                  {item.imageUrl ? (
                    <Image 
                      src={item.imageUrl} 
                      alt={item.title} 
                      fill 
                      style={{ objectFit: 'cover' }} 
                    />
                  ) : null}
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
                    FOUND
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
                  <Link href={`/found/${item.id}`} style={{ 
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
        )}
        
        <div style={{ textAlign: 'center', marginTop: '2rem' }}>
          <Link href="/found" className="btn-primary">
            View All Found Items
          </Link>
        </div>
      </section>
    </div>
  );
} 