'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { getItem, updateItem } from '../../../../lib/db';
import { useAuth } from '../../../../lib/auth/authContext';
import { createClient } from '@supabase/supabase-js';
import Link from 'next/link';
import React from 'react';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
);

export default function EditFoundItem({ params }) {
  const router = useRouter();
  const { user } = useAuth();
  const unwrappedParams = React.use(params);
  const itemId = unwrappedParams.id;
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [originalItem, setOriginalItem] = useState(null);
  const [formData, setFormData] = useState({
    title: '',
    category: '',
    description: '',
    location: '',
    building: '',
    date: '',
    images: []
  });

  // Location mapping
  const locationRoomMap = {
    'Bowman-Oddy- Biology': 'Room 1235',
    'Bowman-Oddy- Chemistry': 'Room 2022',
    'Bowman-Oddy- Storeroom': 'Room 1073',
    'Carlson Library': 'Circulation Desk',
    'CPA': 'Room 1030',
    'Field House': 'Room 1500',
    'Gillham': 'Room 3100',
    'Health and Human Services': 'Room 3302',
    'Honors Academic Village': 'Front Desk',
    'Law Center': 'Room 2000K',
    'McMaster': 'Room 2017',
    'Nitschke': 'Room 1040',
    'Ottawa East': 'Front Desk',
    'Ottawa West': 'Front Desk',
    'Parks Tower': 'Front Desk',
    'President\'s Hall': 'Front Desk',
    'Rocket Hall': 'RSC 1200',
    'Rocket Hall cmpt lab': 'Computer Lab',
    'Savage Arena/Glass Bowl': 'Executive Assistant',
    'Snyder': 'Room 3000',
    'Stranahan North/Savage Business': 'Room 3130',
    'Stranahan South': 'Room 5017',
    'Student REC- Front': 'Front Center',
    'Student Union / Rocket Copy': 'Room 2525',
    'Tucker/Eberly Center': 'Room 168',
    'University Hall': 'Room 4260',
    'Wolfe': 'Room 1227',
    'Health Science Campus': 'Mulford Library 007'
  };

  useEffect(() => {
    const fetchItem = async () => {
      try {
        if (!itemId) {
          throw new Error('No item ID provided');
        }

        const data = await getItem(itemId);
        if (!data) {
          throw new Error('Item not found');
        }

        // Check if the current user is the owner of the item
        if (user && data.user_id !== user.id) {
          throw new Error('You do not have permission to edit this item');
        }

        setOriginalItem(data);
        setFormData({
          title: data.title || '',
          category: data.category || '',
          description: data.description || '',
          location: data.location || '',
          building: data.building || '',
          date: data.date ? new Date(data.date).toISOString().split('T')[0] : '',
          images: []
        });
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    if (user) {
      fetchItem();
    } else {
      setError('You must be logged in to edit an item');
      setLoading(false);
    }
  }, [itemId, user]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleImageChange = (e) => {
    const files = Array.from(e.target.files);
    setFormData({ ...formData, images: files });
  };

  const uploadImagesToSupabase = async (files, itemId) => {
    if (!files.length) return originalItem.image_url ? [originalItem.image_url] : [];
    
    const urls = [];
    
    for (const file of files) {
      const fileExt = file.name.split('.').pop();
      const fileName = `${itemId}-${Date.now()}.${fileExt}`;
      const filePath = `${itemId}/${fileName}`;
      
      const { error } = await supabase.storage
        .from('item-images')
        .upload(filePath, file);
      
      if (error) {
        console.error("Error uploading image:", error.message);
        continue;
      }
      
      const { data: publicUrlData } = supabase.storage
        .from('item-images')
        .getPublicUrl(filePath);
      
      urls.push(publicUrlData.publicUrl);
    }
    
    return urls.length ? urls : (originalItem.image_url ? [originalItem.image_url] : []);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError('');
    setSuccess('');
    
    try {
      if (!user) {
        throw new Error('You must be logged in to edit an item');
      }
      
      if (!originalItem) {
        throw new Error('Original item data not found');
      }
      
      // Prepare updated item data
      const updatedItemData = {
        title: formData.title,
        category: formData.category,
        description: formData.description,
        location: formData.location || formData.building,
        building: formData.building,
        date: formData.date
      };
      
      // Upload new images if any
      if (formData.images.length > 0) {
        const imageUrls = await uploadImagesToSupabase(formData.images, originalItem.id);
        updatedItemData.image_url = imageUrls[0] || null;
      }
      
      // Update in database
      await updateItem(originalItem.id, updatedItemData);
      
      setSuccess('Item updated successfully');
      
      // Redirect to item detail page after a delay
      setTimeout(() => {
        router.push(`/found/${originalItem.id}`);
      }, 2000);
      
    } catch (err) {
      setError(err.message || 'An error occurred while updating the item');
      console.error(err);
    } finally {
      setIsSubmitting(false);
    }
  };

  if (loading) return <div className="container">Loading...</div>;
  if (error && !originalItem) return (
    <div className="container">
      <div style={{ 
        backgroundColor: '#ffebee', 
        color: '#c62828', 
        padding: '1rem', 
        borderRadius: '0.25rem',
        marginBottom: '1.5rem'
      }}>
        {error}
      </div>
      <Link href="/found" style={{
        display: 'inline-flex',
        alignItems: 'center',
        color: 'var(--primary-blue)',
        fontWeight: 500,
        textDecoration: 'none'
      }}>
        ← Back to Found Items
      </Link>
    </div>
  );

  return (
    <div className="container" style={{ maxWidth: '800px', margin: '2rem auto' }}>
      <Link href={`/found/${itemId}`} style={{
        display: 'inline-flex',
        alignItems: 'center',
        color: 'var(--primary-blue)',
        marginBottom: '1rem',
        fontWeight: 500,
        textDecoration: 'none'
      }}>
        ← Back to Item Details
      </Link>
      
      <div className="card" style={{ padding: '2rem' }}>
        <h2 style={{ marginBottom: '1.5rem', color: 'var(--primary-blue)' }}>
          Edit Found Item
        </h2>
        
        {error && (
          <div style={{ 
            backgroundColor: '#ffebee', 
            color: '#c62828', 
            padding: '1rem', 
            borderRadius: '0.25rem',
            marginBottom: '1.5rem'
          }}>
            {error}
          </div>
        )}
        
        {success && (
          <div style={{ 
            backgroundColor: '#e8f5e9', 
            color: '#2e7d32', 
            padding: '1rem', 
            borderRadius: '0.25rem',
            marginBottom: '1.5rem'
          }}>
            {success}
          </div>
        )}
        
        <form onSubmit={handleSubmit}>
          <div style={{ marginBottom: '1.5rem' }}>
            <h3 style={{ marginBottom: '1rem', fontSize: '1.1rem' }}>Item Information</h3>
            
            <div className="form-group">
              <label htmlFor="title">Item Name*</label>
              <input
                type="text"
                id="title"
                name="title"
                className="form-control"
                placeholder="e.g., Blue Backpack, iPhone 13, Student ID"
                value={formData.title}
                onChange={handleChange}
                required
              />
            </div>
            
            <div className="form-group">
              <label htmlFor="category">Category*</label>
              <select
                id="category"
                name="category"
                className="form-control"
                value={formData.category}
                onChange={handleChange}
                required
              >
                <option value="">Select a category</option>
                <option value="electronics">Electronics</option>
                <option value="clothing">Clothing</option>
                <option value="accessories">Accessories</option>
                <option value="books">Books</option>
                <option value="keys">Keys</option>
                <option value="id-cards">ID Cards</option>
                <option value="other">Other</option>
              </select>
            </div>
            
            <div className="form-group">
              <label htmlFor="description">Description*</label>
              <textarea
                id="description"
                name="description"
                className="form-control"
                placeholder="Provide details about the item"
                value={formData.description}
                onChange={handleChange}
                required
                rows={4}
              />
            </div>
          </div>
          
          <div style={{ marginBottom: '1.5rem' }}>
            <h3 style={{ marginBottom: '1rem', fontSize: '1.1rem' }}>Location & Date Information</h3>
            
            <div className="form-group">
              <label htmlFor="building">Building where item was found*</label>
              <select
                id="building"
                name="building"
                className="form-control"
                value={formData.building}
                onChange={handleChange}
                required
              >
                <option value="">Select a building</option>
                {Object.keys(locationRoomMap).map((building) => (
                  <option key={building} value={building}>{building}</option>
                ))}
              </select>
            </div>
            
            <div className="form-group">
              <label htmlFor="date">Date Found*</label>
              <input
                type="date"
                id="date"
                name="date"
                className="form-control"
                value={formData.date}
                onChange={handleChange}
                required
              />
            </div>
          </div>
          
          <div style={{ marginBottom: '2rem' }}>
            <h3 style={{ marginBottom: '1rem', fontSize: '1.1rem' }}>Images</h3>
            
            {originalItem && originalItem.image_url && (
              <div style={{ marginBottom: '1rem' }}>
                <p>Current Image:</p>
                <img 
                  src={originalItem.image_url} 
                  alt={originalItem.title} 
                  style={{ 
                    maxWidth: '200px', 
                    maxHeight: '200px',
                    borderRadius: '4px',
                    border: '1px solid #ddd'
                  }} 
                />
              </div>
            )}
            
            <div className="form-group">
              <label htmlFor="images">Upload New Image (Optional)</label>
              <input
                type="file"
                id="images"
                name="images"
                className="form-control"
                accept="image/*"
                onChange={handleImageChange}
                multiple
              />
              <small style={{ display: 'block', marginTop: '0.5rem', color: '#666' }}>
                Upload a new image only if you want to replace the current one.
              </small>
            </div>
          </div>
          
          <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '1rem' }}>
            <Link href={`/found/${itemId}`} style={{
              padding: '0.75rem 1.5rem',
              backgroundColor: '#f5f5f5',
              color: '#333',
              borderRadius: '4px',
              textDecoration: 'none',
              fontWeight: 500
            }}>
              Cancel
            </Link>
            <button
              type="submit"
              style={{
                padding: '0.75rem 1.5rem',
                backgroundColor: 'var(--primary-blue)',
                color: 'white',
                border: 'none',
                borderRadius: '4px',
                cursor: 'pointer',
                fontWeight: 500
              }}
              disabled={isSubmitting}
            >
              {isSubmitting ? 'Updating...' : 'Update Item'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
