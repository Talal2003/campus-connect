'use client';

import { useState, useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { useAuth } from '../lib/auth/authContext';
import { createItem } from '../lib/db';
import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
);

export default function ItemForm({ type }) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { user } = useAuth();
  const [formData, setFormData] = useState({
    title: '',
    category: '',
    description: '',
    location: '',
    date: '',
    images: [],
    building: '',
    room_number: '',
    reference_id: ''
  });
  
  // Effect to load query parameters when component mounts
  useEffect(() => {
    if (searchParams) {
      // Log all available search params for debugging
      console.log('All search params:', Object.fromEntries([...searchParams.entries()]));
      
      const title = searchParams.get('title') || '';
      const category = searchParams.get('category') || '';
      const description = searchParams.get('description') || '';
      const location = searchParams.get('location') || '';
      const date = searchParams.get('date') || '';
      const room_number = searchParams.get('room_number') || '';
      const image_url = searchParams.get('image_url') || '';
      const reference_id = searchParams.get('reference_id') || '';
      
      // Format date properly if it exists
      let formattedDate = '';
      if (date) {
        try {
          formattedDate = new Date(date).toISOString().split('T')[0];
        } catch (err) {
          console.error('Error formatting date:', err);
          formattedDate = '';
        }
      }
      
      // Pre-fill form data from query parameters
      setFormData(prev => ({
        ...prev,
        title,
        category,
        description,
        location,
        // Also set building to location for dropdown
        building: location,
        date: formattedDate,
        room_number,
        reference_id,
        image_url
      }));
      
      console.log('Pre-filled form with query parameters:', {
        title, category, description, location, date: formattedDate, room_number, reference_id, image_url
      });
    }
  }, [searchParams]);
  
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  
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
    'Presidents Hall': 'Front Desk',
    'Rocket Hall': 'RSC 1200',
    'Rocket Hall Computer Lab': 'Computer Lab',
    'Savage Arena/Glass Bowl': 'Executive Assistant',
    'Snyder': 'Room 3000',
    'Stranahan North/Savage Business': 'Room 3130',
    'Stranahan South': 'Room 5017',
    'Student REC': 'Front Desk',
    'Student Union/Rocket Copy': 'Room 2525',
    'Tucker/Eberly Center': 'Room 168',
    'University Hall': 'Room 4260',
    'Wolfe': 'Room 1227',
    'Health Science Campus': 'Mulford Library 007',
    'Other': 'Nearest UTPD location',
  };
  
  const dropOffInstructions = formData.building ? 
    `Please drop off the found item at ${formData.building}: ${locationRoomMap[formData.building]}` : 
    'Please select a "Location" first.';
  
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };
  
  const handleImageChange = (e) => {
    // In a real implementation, this would handle file uploads
    // For now, we'll just store the file names
    const files = Array.from(e.target.files);
    setFormData({ ...formData, images: files });
  };
  
  const uploadImagesToSupabase = async (files, itemId) => {
    const urls = [];
  
    console.log("Uploading", files.length, "image(s) for item:", itemId);
  
    for (const file of files) {
      const fileExt = file.name.split('.').pop();
      const fileName = `${itemId}-${Date.now()}.${fileExt}`;
      const filePath = `${itemId}/${fileName}`;
  
      console.log("Uploading file:", file.name, "to path:", filePath);
  
      const { error } = await supabase.storage
        .from('item-images')
        .upload(filePath, file);
  
      if (error) {
        console.error("❌ Error uploading image:", error.message);
        continue;
      }
  
      const { data: publicUrlData } = supabase.storage
        .from('item-images')
        .getPublicUrl(filePath);
  
      console.log("✅ Image uploaded. Public URL:", publicUrlData?.publicUrl);
  
      urls.push(publicUrlData.publicUrl);
    }
  
    console.log("✅ All image URLs:", urls);
    return urls;
  };    

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError('');
    
    try {
      if (!user) {
        throw new Error('You must be logged in to report an item');
      }
      
      // Create item data with correct column names
      const itemData = {
        type,
        title: formData.title,
        category: formData.category,
        description: formData.description,
        location: formData.location || formData.building,
        building: formData.building,
<<<<<<< HEAD
        room_number: formData.room_number,
=======
        dropoff_location: locationRoomMap[formData.building] || null,
>>>>>>> 90886b1f2f35efc41211f3c47a9a32e4352adff6
        date: formData.date,
        contact_name: user.user_metadata?.username || 'User',
        contact_email: user.email,
        contact_phone: '', // No longer collecting phone number
        image_url: formData.image_url || null, // Use pre-filled image if available
        user_id: user.id, // This is now a UUID from Supabase
        status: 'pending'
      };

      const itemId = crypto.randomUUID(); // or use any ID scheme you like
      
      // Only upload new images if they were selected
      if (formData.images && formData.images.length > 0) {
        const imageUrls = await uploadImagesToSupabase(formData.images, itemId);
        itemData.image_url = imageUrls[0] || formData.image_url || null; // Use uploaded image first, then pre-filled, then null
      }
      
      itemData.id = itemId; // optional: only if you're assigning IDs manually

      console.log("Submitting item data:", itemData);

<<<<<<< HEAD
      try {
        // Submit to Supabase
        const data = await createItem(itemData);
        console.log("Create item response:", data);
        
        setSuccess(`Your ${type} item has been reported successfully.`);
        
        // Reset form after successful submission
        setFormData({
          title: '',
          category: '',
          description: '',
          location: '',
          date: '',
          images: [],
          building: '',
          room_number: '',
          reference_id: ''
        });
        
        // Redirect to track page after a delay
        setTimeout(() => {
          router.push(`/${type}`);
        }, 3000);
      } catch (createError) {
        console.error("Error creating item:", createError);
        throw new Error(`Failed to create item: ${createError.message || 'Unknown error'}`);
      }
=======
      // Submit to Supabase
      const data = await createItem(itemData);
      
      setSuccess(`Your ${type} item has been reported successfully. You can track its status on this page`);
      
      // Reset form after successful submission
      setFormData({
        title: '',
        category: '',
        description: '',
        location: '',
        date: '',
        images: [],
        building: ''
      });
      
      // Redirect to track page after a delay
      setTimeout(() => {
        router.push(`/${type}`);
      }, 3000);
>>>>>>> 90886b1f2f35efc41211f3c47a9a32e4352adff6
      
    } catch (err) {
      setError(err.message || 'An error occurred while submitting the form. Please try again.');
      console.error(err);
    } finally {
      setIsSubmitting(false);
    }
  };
  
  return (
    <div className="card" style={{ padding: '2rem' }}>
      <h2 style={{ marginBottom: '1.5rem', color: 'var(--primary-blue)' }}>
        Report {type === 'lost' ? 'a Lost' : 'a Found'} Item
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
              rows="4"
              placeholder="Provide detailed description of the item (color, brand, distinguishing features, etc.)"
              value={formData.description}
              onChange={handleChange}
              required
            ></textarea>
          </div>
          
          <div className="form-group">
            <label htmlFor="building">Location*</label>
            <select
              id="building"
              name="building"
              className="form-control"
              value={formData.building}
              onChange={handleChange}
              required
            >
              <option value="">Select a location</option>
              <option value="Bowman-Oddy- Biology">Bowman-Oddy- Biology</option>
              <option value="Bowman-Oddy- Chemistry">Bowman-Oddy- Chemistry</option>
              <option value="Bowman-Oddy- Storeroom">Bowman-Oddy- Storeroom</option>
              <option value="Carlson Library">Carlson Library</option>
              <option value="CPA">CPA</option>
              <option value="Field House">Field House</option>
              <option value="Gillham">Gillham</option>
              <option value="Health and Human Services">Health and Human Services</option>
              <option value="Honors Academic Village">Honors Academic Village</option>
              <option value="Law Center">Law Center</option>
              <option value="McMaster">McMaster</option>
              <option value="Nitschke">Nitschke</option>
              <option value="Ottawa East">Ottawa East</option>
              <option value="Ottawa West">Ottawa West</option>
              <option value="Parks Tower">Parks Tower</option>
              <option value="Presidents Hall">Presidents Hall</option>
              <option value="Rocket Hall">Rocket Hall</option>
              <option value="Rocket Hall Computer lab">Rocket Hall Computer Lab</option>
              <option value="Savage Arena/Glass Bowl">Savage Arena/Glass Bowl</option>
              <option value="Snyder">Snyder</option>
              <option value="Stranahan North/Savage Business">Stranahan North/Savage Business</option>
              <option value="Stranahan South">Stranahan South</option>
              <option value="Student REC">Student REC</option>
              <option value="Student Union/Rocket Copy">Student Union/Rocket Copy</option>
              <option value="Tucker/Eberly Center">Tucker/Eberly Center</option>
              <option value="University Hall">University Hall</option>
              <option value="Wolfe">Wolfe</option>
              <option value="Health Science Campus">Health Science Campus Mulford Library</option>
              <option value="Other">Other</option>
            </select>
          </div>
          
          <div className="form-group">
            <label htmlFor="date">Date*</label>
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
        
        {type === 'found' && (
          <div style={{ marginBottom: '1.5rem', padding: '1rem', backgroundColor: 'var(--light-gray)', borderRadius: '0.25rem' }}>
            <h4 style={{ marginBottom: '0.5rem', color: 'var(--primary-blue)' }}>Drop-off Instructions</h4>
            <p>{dropOffInstructions}</p>
          </div>
        )}
        
        <div style={{ marginBottom: '1.5rem' }}>
          <h3 style={{ marginBottom: '1rem', fontSize: '1.1rem' }}>Upload Image</h3>
          
          {/* Display pre-filled image if available */}
          {formData.image_url && (
            <div style={{ marginBottom: '1rem' }}>
              <p>Current image from the reference item:</p>
              <img 
                src={formData.image_url} 
                alt="Reference item" 
                style={{ 
                  maxWidth: '100%', 
                  maxHeight: '200px', 
                  borderRadius: '4px',
                  marginBottom: '1rem' 
                }} 
              />
              <p style={{ fontSize: '0.9rem', color: '#666' }}>
                You can keep this image or upload a new one below.
              </p>
            </div>
          )}
          
          <div className="form-group">
            <label htmlFor="images">Upload Photos (Optional)</label>
            <input
              type="file"
              id="images"
              name="images"
              className="form-control"
              onChange={handleImageChange}
              accept="image/*"
              multiple
            />
            <small>Upload clear photos of the item to help with identification.</small>
          </div>
        </div>
        
        <button 
          type="submit" 
          className="btn-primary" 
          style={{ width: '100%', marginTop: '1.5rem' }}
          disabled={isSubmitting}
        >
          {isSubmitting ? 'Submitting...' : `Submit ${type === 'lost' ? 'Lost' : 'Found'} Item Report`}
        </button>
      </form>
    </div>
  );
} 