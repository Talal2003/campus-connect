'use client';

import { useState, useEffect } from 'react';
import { getItem, updateItem, deleteItem } from '../../../lib/db';
import Image from 'next/image';
import Link from 'next/link';
import { useAuth } from '../../../lib/auth/authContext';
import { useRouter } from 'next/navigation';
import { use } from 'react';

export default function ItemDetail({ params }) {
  // Properly unwrap params with React.use()
  const resolvedParams = use(params);
  const [item, setItem] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [showConfirmDelete, setShowConfirmDelete] = useState(false);
  const [updateLoading, setUpdateLoading] = useState(false);
  const { user } = useAuth();
  const router = useRouter();

  useEffect(() => {
    const fetchItem = async () => {
      try {
        const data = await getItem(resolvedParams.id);
        setItem(data);
      } catch (err) {
        setError('Item not found');
      } finally {
        setLoading(false);
      }
    };
    
    fetchItem();
  }, [resolvedParams.id]);
  
  if (loading) return <div className="container">Loading...</div>;
  if (error || !item) return <div className="container">{error || 'Item not found.'}</div>;

  // Check if current user is the owner of the item
  const isOwner = user && item.user_id === user.id;

  // Location mapping for room numbers - same as in ItemForm.js
  const locationRoomMap = {
    'Bowman-Oddy- Biology': '1235',
    'Bowman-Oddy- Chemistry': '2022',
    'Bowman-Oddy- Storeroom': '1073',
    'Carlson Library': 'Circulation Desk',
    'CPA': '1030',
    'Field House': '1500',
    'Gillham': '3100',
    'Health and Human Services': '3302',
    'Honors Academic Village': 'Front Desk',
    'Law Center': '2000K',
    'McMaster': '2017',
    'Nitschke': '1040',
    'Ottawa East': 'Front Desk',
    'Ottawa West': 'Front Desk',
    'Parks Tower': 'Front Desk',
    'President\'s Hall': 'Front Desk',
    'Rocket Hall': 'RSC 1200',
    'Rocket Hall cmpt lab': 'Computer Lab',
    'Savage Arena/Glass Bowl': 'Executive Assistant',
    'Snyder': '3000',
    'Stranahan North/Savage Business': '3130',
    'Stranahan South': '5017',
    'Student REC- Front': 'Front Center',
    'Student Union / Rocket Copy': '2525',
    'Tucker/Eberly Center': '168',
    'University Hall': '4260',
    'Wolfe': '1227',
    'Health Science Campus': 'Mulford Library 007'
  };

  // Get room info for the building if it exists
  const roomInfo = item.building && locationRoomMap[item.building] 
    ? locationRoomMap[item.building]
    : null;

  const handleStatusUpdate = async (newStatus) => {
    setUpdateLoading(true);
    try {
      if (!item || !item.id) {
        throw new Error('Invalid item data');
      }
      
      if (!newStatus || !['pending', 'found', 'claimed', 'delivered'].includes(newStatus)) {
        throw new Error('Invalid status value');
      }
      
      console.log('Updating item status:', { itemId: item.id, newStatus });
      const updatedItem = await updateItem(item.id, { status: newStatus });
      
      if (!updatedItem) {
        throw new Error('Failed to update item - no data returned');
      }
      
      setItem(updatedItem);
    } catch (err) {
      console.error('Error updating status:', err.message || 'Unknown error', err);
      alert(`Failed to update item status: ${err.message || 'Unknown error'}`);
    } finally {
      setUpdateLoading(false);
    }
  };

  const handleDelete = async () => {
    try {
      await deleteItem(item.id);
      router.push('/found');
    } catch (err) {
      console.error('Error deleting item:', err);
      alert('Failed to delete item');
    }
  };

  function capitalizeFirst(str) {
    return str?.charAt(0).toUpperCase() + str?.slice(1);
  }  

  return (
    <div className="container" style={{ maxWidth: '900px', margin: '2rem auto' }}>
      <div className="card" style={{ 
        padding: '2rem', 
        borderRadius: '12px',
        boxShadow: '0 4px 12px rgba(0,0,0,0.08)',
        backgroundColor: '#fff' 
      }}>
        {/* Back button */}
        <Link href="/found" style={{ 
          display: 'inline-flex', 
          alignItems: 'center', 
          color: 'var(--primary-blue)',
          marginBottom: '1rem',
          fontWeight: 500,
          textDecoration: 'none'
        }}>
          ← Back to Found Items
        </Link>
        
        {/* Owner actions buttons */}
        {isOwner && (
          <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.5rem', marginBottom: '1rem' }}>
            <Link 
              href={`/edit/found/${item.id}`}
              style={{
                padding: '0.5rem 1rem',
                backgroundColor: 'var(--primary-blue)',
                color: 'white',
                borderRadius: '4px',
                textDecoration: 'none',
                fontSize: '0.9rem'
              }}
            >
              Edit Item
            </Link>
            <button
              onClick={() => setShowConfirmDelete(true)}
              style={{
                padding: '0.5rem 1rem',
                backgroundColor: 'var(--danger)',
                color: 'white',
                border: 'none',
                borderRadius: '4px',
                cursor: 'pointer',
                fontSize: '0.9rem'
              }}
            >
              Delete
            </button>
          </div>
        )}
        
        <h1 style={{ 
          color: 'var(--primary-blue)', 
          marginBottom: '1.5rem',
          fontSize: '1.8rem',
          display: 'flex',
          alignItems: 'center',
          gap: '1rem'
        }}>
          {item.title}
          <span style={{ 
            backgroundColor: item.type === 'lost' ? 'var(--danger)' : 'var(--primary-yellow)',
            color: item.type === 'lost' ? 'white' : 'var(--primary-blue)',
            padding: '0.25rem 0.5rem',
            borderRadius: '0.25rem',
            fontWeight: 'bold',
            fontSize: '0.75rem',
            textTransform: 'uppercase',
            display: 'inline-block',
            marginTop: '0.35rem'
          }}>
            {item.type}
          </span>
        </h1>

        {/* Main content area with side-by-side layout */}
        <div style={{ 
          display: 'grid', 
          gridTemplateColumns: 'minmax(0, 1fr) minmax(0, 1.5fr)', 
          gap: '2rem',
          marginBottom: '2rem'
        }}>
          {/* Left column - Image */}
          <div>
            {item.image_url ? (
              <div style={{ 
                borderRadius: '10px',
                overflow: 'hidden',
                height: '100%',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center'
              }}>
                <img
                  src={item.image_url}
                  alt={item.title}
                  style={{
                    width: '100%',
                    height: 'auto',
                    objectFit: 'cover',
                    borderRadius: '10px',
                    boxShadow: '0 4px 10px rgba(0,0,0,0.1)',
                  }}
                />
              </div>
            ) : (
              <div style={{
                backgroundColor: '#f0f0f0',
                borderRadius: '10px',
                height: '100%',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                padding: '2rem',
                color: '#666'
              }}>
                No image available
              </div>
            )}
          </div>

          {/* Right column - Details */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
            {/* Item Details */}
            <div style={{ 
              backgroundColor: '#f8f9fa',
              padding: '1.5rem',
              borderRadius: '8px'
            }}>
              <h3 style={{ color: 'var(--primary-blue)', marginBottom: '1rem' }}>Item Details</h3>
              <div style={{ lineHeight: '1.8' }}>
                <p><strong>Category:</strong> {item.category}</p>
                <p><strong>Date Found:</strong> {new Date(item.date).toLocaleDateString()}</p>
                <p><strong>Location:</strong> {item.location || item.building}</p>
                {roomInfo && <p><strong>Room:</strong> {roomInfo}</p>}
                <p>
                  <strong>Status:</strong>{' '}
                  {isOwner ? (
                    <select 
                      value={item.status}
                      onChange={(e) => handleStatusUpdate(e.target.value)}
                      disabled={updateLoading}
                      style={{
                        marginLeft: '0.5rem',
                        padding: '0.25rem',
                        borderRadius: '4px',
                        border: '1px solid #ccc',
                        cursor: updateLoading ? 'wait' : 'pointer'
                      }}
                    >
                      <option value="pending">Recently Found</option>
                      <option value="found">Available for Pickup</option>
                      <option value="claimed">Claimed by Owner</option>
                    </select>
                  ) : (
                    <span style={{
                      backgroundColor: item.status === 'claimed' ? '#d4edda' : 
                                       item.status === 'found' ? '#cce5ff' : '#fff3cd',
                      color: item.status === 'claimed' ? '#155724' : 
                             item.status === 'found' ? '#004085' : '#856404',
                      padding: '0.25rem 0.5rem',
                      borderRadius: '4px',
                      fontSize: '0.9rem',
                      fontWeight: '500'
                    }}>
                      {item.status === 'claimed' ? 'Claimed by Owner' : 
                       item.status === 'found' ? 'Available for Pickup' :
                       item.status === 'pending' ? 'Recently Found' : 
                       item.status}
                    </span>
                  )}
                  {updateLoading && <span style={{ marginLeft: '0.5rem', fontSize: '0.9rem', color: '#666' }}>Updating...</span>}
                </p>
              </div>
            </div>

            {/* Description */}
            <div style={{ 
              backgroundColor: '#f8f9fa',
              padding: '1.5rem',
              borderRadius: '8px'
            }}>
              <h3 style={{ color: 'var(--primary-blue)', marginBottom: '1rem' }}>Description</h3>
              <p style={{ lineHeight: '1.6' }}>{item.description}</p>
            </div>
          </div>
        </div>

        {/* Contact card - Full width below */}
        <div style={{
          backgroundColor: '#f0f7ff',
          padding: '1.5rem',
          borderRadius: '8px',
          borderLeft: '4px solid var(--primary-blue)'
        }}>
          <h3 style={{ color: 'var(--primary-blue)', marginBottom: '1rem' }}>Contact Information</h3>
          <p><strong>Name:</strong> {item.contact_name}</p>
          <p><strong>Email:</strong> <a 
            href={`mailto:${item.contact_email}`}
            style={{ color: 'var(--primary-blue)', textDecoration: 'none' }}
          >{item.contact_email}</a></p>
        </div>
      </div>

      {/* Delete confirmation modal */}
      {showConfirmDelete && (
        <div style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          backgroundColor: 'rgba(0,0,0,0.5)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          zIndex: 100
        }}>
          <div style={{
            backgroundColor: 'white',
            padding: '2rem',
            borderRadius: '8px',
            maxWidth: '400px',
            textAlign: 'center'
          }}>
            <h3 style={{ marginBottom: '1rem' }}>Confirm Delete</h3>
            <p style={{ marginBottom: '1.5rem' }}>Are you sure you want to delete this item? This action cannot be undone.</p>
            <div style={{ display: 'flex', justifyContent: 'center', gap: '1rem' }}>
              <button
                onClick={() => setShowConfirmDelete(false)}
                style={{
                  padding: '0.5rem 1rem',
                  backgroundColor: '#f0f0f0',
                  border: 'none',
                  borderRadius: '4px',
                  cursor: 'pointer'
                }}
              >
                Cancel
              </button>
              <button
                onClick={handleDelete}
                style={{
                  padding: '0.5rem 1rem',
                  backgroundColor: 'var(--danger)',
                  color: 'white',
                  border: 'none',
                  borderRadius: '4px',
                  cursor: 'pointer'
                }}
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
