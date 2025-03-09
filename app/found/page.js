'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import ItemCard from '../../components/ItemCard';
import SearchBox from '../../components/SearchBox';

// Mock data for found items
const mockFoundItems = [
  {
    id: 1,
    type: 'found',
    title: 'Black Umbrella',
    category: 'accessories',
    description: 'Black folding umbrella with wooden handle',
    location: 'Snyder Memorial Building',
    date: '2023-2-28',
    status: 'found',
    imageUrl: null
  },
  {
    id: 2,
    type: 'found',
    title: 'Car Keys',
    category: 'keys',
    description: 'Honda car keys with a rocket keychain',
    location: 'Parking Lot 10',
    date: '2023-5-8',
    status: 'claimed',
    imageUrl: null
  },
  {
    id: 3,
    type: 'found',
    title: 'Blue Scarf',
    category: 'clothing',
    description: 'Blue knitted scarf with UT logo',
    location: 'Student Union',
    date: '2023-5-21',
    status: 'found',
    imageUrl: null
  },
  {
    id: 4,
    type: 'found',
    title: 'Glasses',
    category: 'accessories',
    description: 'Black-rimmed prescription glasses in a brown case',
    location: 'Savage Arena',
    date: '2023-8-24',
    status: 'delivered',
    imageUrl: null
  },
  {
    id: 5,
    type: 'found',
    title: 'Scientific Calculator',
    category: 'electronics',
    description: 'TI-84 Plus calculator',
    location: 'North Engineering Building',
    date: '2023-10-26',
    status: 'found',
    imageUrl: null
  },
  {
    id: 6,
    type: 'found',
    title: 'Rocket Card',
    category: 'accessories',
    description: 'Rocket Card found in North Engineering',
    location: 'North Engineering',
    date: '2024-04-04',
    status: 'found',
    imageUrl: null
  },
  {
    id: 7,
    type: 'found',
    title: 'Wallet',
    category: 'accessories',
    description: 'Wallet found in Nitschke Hall',
    location: 'Nitschke Hall',
    date: '2024-06-26',
    status: 'found',
    imageUrl: null
  },
  {
    id: 8,
    type: 'found',
    title: 'Driver License',
    category: 'documents',
    description: 'Driver License found in Rocket Hall',
    location: 'Rocket Hall',
    date: '2024-12-09',
    status: 'found',
    imageUrl: null
  },
  {
    id: 9,
    type: 'found',
    title: 'iPhone 13',
    category: 'electronics',
    description: 'Black iPhone 13 with clear case',
    location: 'Memorial Field House',
    date: '2025-02-15',
    status: 'found',
    imageUrl: null
  }
];

export default function FoundItemsPage() {
  const [items, setItems] = useState([]);
  const [filteredItems, setFilteredItems] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  
  useEffect(() => {
    // In a real app, this would be an API call
    // For now, we'll use the mock data
    const fetchItems = async () => {
      try {
        await new Promise(resolve => setTimeout(resolve, 500)); // Simulate network delay
        const sortedItems = mockFoundItems.sort((a, b) => new Date(b.date) - new Date(a.date));
        setItems(sortedItems);
        setFilteredItems(sortedItems);
      } catch (error) {
        console.error('Error fetching found items:', error);
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
        <h1 style={{ color: 'var(--primary-blue)' }}>Found Items</h1>
        <Link href="/report/found" className="btn-primary">
          Report a Found Item
        </Link>
      </div>
      
      <SearchBox onSearch={handleSearch} />
      
      {isLoading ? (
        <div style={{ textAlign: 'center', padding: '3rem 0' }}>
          <p>Loading items...</p>
        </div>
      ) : filteredItems.length === 0 ? (
        <div style={{ textAlign: 'center', padding: '3rem 0' }}>
          <p>No found items match your search criteria.</p>
          <Link href="/report/found" style={{ display: 'inline-block', marginTop: '1rem' }}>
            Report a Found Item
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