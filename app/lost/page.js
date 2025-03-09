'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import ItemCard from '../../components/ItemCard';
import SearchBox from '../../components/SearchBox';

// Mock data for lost items
const mockLostItems = [
  {
    id: 1,
    type: 'lost',
    title: 'Blue Backpack',
    category: 'accessories',
    description: 'Blue Jansport backpack with a rocket keychain',
    location: 'Student Union',
    date: '2023-10-15',
    status: 'lost',
    imageUrl: null
  },
  {
    id: 2,
    type: 'lost',
    title: 'MacBook Pro',
    category: 'electronics',
    description: 'Silver MacBook Pro 13" with stickers on the cover',
    location: 'Carlson Library, 2nd floor',
    date: '2023-10-18',
    status: 'found',
    imageUrl: null
  },
  {
    id: 3,
    type: 'lost',
    title: 'Student ID Card',
    category: 'id-cards',
    description: 'UT Rocket ID card',
    location: 'Engineering Building',
    date: '2023-10-20',
    status: 'delivered',
    imageUrl: null
  },
  {
    id: 4,
    type: 'lost',
    title: 'Water Bottle',
    category: 'other',
    description: 'Blue Hydro Flask with UT stickers',
    location: 'Recreation Center',
    date: '2023-10-22',
    status: 'lost',
    imageUrl: null
  },
  {
    id: 5,
    type: 'lost',
    title: 'Textbook - Calculus II',
    category: 'books',
    description: 'Calculus II textbook with yellow highlights',
    location: 'Mathematics Building',
    date: '2023-10-25',
    status: 'pending',
    imageUrl: null
  },
  {
    id: 6,
    type: 'lost',
    title: 'AirPods Pro',
    category: 'electronics',
    description: 'White AirPods Pro in a black case',
    location: 'Student Union Food Court',
    date: '2023-10-27',
    status: 'lost',
    imageUrl: null
  }
];

export default function LostItemsPage() {
  const [items, setItems] = useState([]);
  const [filteredItems, setFilteredItems] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  
  useEffect(() => {
    // In a real app, this would be an API call
    // For now, we'll use the mock data
    const fetchItems = async () => {
      try {
        await new Promise(resolve => setTimeout(resolve, 500)); // Simulate network delay
        setItems(mockLostItems);
        setFilteredItems(mockLostItems);
      } catch (error) {
        console.error('Error fetching lost items:', error);
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchItems();
  }, []);
  
  const handleFilterChange = (filters) => {
    let filtered = [...items];
    
    // Filter by keyword
    if (filters.keyword) {
      const keyword = filters.keyword.toLowerCase();
      filtered = filtered.filter(item => 
        item.title.toLowerCase().includes(keyword) || 
        item.description.toLowerCase().includes(keyword) ||
        item.location.toLowerCase().includes(keyword)
      );
    }
    
    // Filter by category
    if (filters.category) {
      filtered = filtered.filter(item => item.category === filters.category);
    }
    
    // Filter by date range
    if (filters.startDate) {
      filtered = filtered.filter(item => new Date(item.date) >= new Date(filters.startDate));
    }
    
    if (filters.endDate) {
      filtered = filtered.filter(item => new Date(item.date) <= new Date(filters.endDate));
    }
    
    // Filter by status
    if (filters.status) {
      filtered = filtered.filter(item => item.status === filters.status);
    }
    
    setFilteredItems(filtered);
  };
  
  const handleSearch = (searchTerm) => {
    const filtered = items.filter(item =>
      item.title.toLowerCase().includes(searchTerm.toLowerCase())
    );
    setFilteredItems(filtered);
  };
  
  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
        <h1 style={{ color: 'var(--primary-blue)' }}>Lost Items</h1>
        <Link href="/report/lost" className="btn-primary">
          Report a Lost Item
        </Link>
      </div>
      
      <SearchBox onSearch={handleSearch} />
      
      {isLoading ? (
        <div style={{ textAlign: 'center', padding: '3rem 0' }}>
          <p>Loading items...</p>
        </div>
      ) : filteredItems.length === 0 ? (
        <div style={{ textAlign: 'center', padding: '3rem 0' }}>
          <p>No lost items match your search criteria.</p>
          <Link href="/report/lost" style={{ display: 'inline-block', marginTop: '1rem' }}>
            Report a Lost Item
          </Link>
        </div>
      ) : (
        <div style={{ 
          display: 'grid', 
          gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', 
          gap: '1.5rem' 
        }}>
          {filteredItems.map(item => (
            <ItemCard key={item.id} item={item} />
          ))}
        </div>
      )}
    </div>
  );
} 