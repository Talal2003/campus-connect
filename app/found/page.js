'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import ItemCard from '../../components/ItemCard';
import SearchBox from '../../components/SearchBox';
import { getItems } from '../../lib/db';

export default function FoundItemsPage() {
  const [items, setItems] = useState([]);
  const [filteredItems, setFilteredItems] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isAiSearchActive, setIsAiSearchActive] = useState(false);
  
  useEffect(() => {
    const fetchItems = async () => {
      try {
        setIsLoading(true);
        const data = await getItems('found');
        const sortedItems = data.sort((a, b) => new Date(b.date) - new Date(a.date));
        setItems(sortedItems);
        setFilteredItems(sortedItems);
      } catch (error) {
        console.error('Error fetching found items:', error);
        setError('Failed to load items. Please try again later.');
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
    if (!searchTerm) {
      setFilteredItems(items);
      return;
    }
    
    const filtered = items.filter(item =>
      item.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (item.description && item.description.toLowerCase().includes(searchTerm.toLowerCase())) ||
      (item.location && item.location.toLowerCase().includes(searchTerm.toLowerCase()))
    );
    setFilteredItems(filtered);
  };
  
  const handleAiSearchResults = (results) => {
    if (!results || results.length === 0) {
      setError("No similar items found or AI search is disabled. Using regular search instead.");
      return;
    }
    
    setIsAiSearchActive(true);
    
    // Get item IDs from AI search results
    const itemIds = results.map(result => result.id);
    
    // Filter items by the IDs returned from AI search
    const aiFilteredItems = items.filter(item => itemIds.includes(item.id));
    
    // Sort according to similarity scores from AI
    const sortedItems = aiFilteredItems.sort((a, b) => {
      const aResult = results.find(r => r.id === a.id);
      const bResult = results.find(r => r.id === b.id);
      return (bResult?.similarity || 0) - (aResult?.similarity || 0);
    });
    
    setFilteredItems(sortedItems);
  };
  
  const clearAiSearch = () => {
    setIsAiSearchActive(false);
    setFilteredItems(items);
  };
  
  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
        <h1 style={{ color: 'var(--primary-blue)' }}>Found Items</h1>
        <Link href="/report/found" className="btn-primary">
          Report a Found Item
        </Link>
      </div>
      
      <SearchBox 
        onSearch={handleSearch} 
        onFilterChange={handleFilterChange}
        onAiSearchResults={handleAiSearchResults}
      />
      
      {isAiSearchActive && (
        <div style={{ 
          backgroundColor: '#e3f2fd', 
          padding: '1rem', 
          marginBottom: '1rem', 
          borderRadius: '5px',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center'
        }}>
          <p style={{ margin: 0 }}>
            <strong>AI Search Active:</strong> Showing items similar to your uploaded image
          </p>
          <button
            onClick={clearAiSearch}
            style={{
              padding: '0.5rem',
              backgroundColor: 'transparent',
              border: 'none',
              color: 'var(--primary-blue)',
              cursor: 'pointer',
              fontWeight: 'bold'
            }}
          >
            Clear Results
          </button>
        </div>
      )}
      
      {isLoading ? (
        <div style={{ textAlign: 'center', padding: '3rem 0' }}>
          <p>Loading items...</p>
        </div>
      ) : error ? (
        <div style={{ 
          textAlign: 'center', 
          padding: '2rem', 
          backgroundColor: '#ffebee', 
          color: '#c62828', 
          borderRadius: '4px',
          marginTop: '1rem'
        }}>
          <p>{error}</p>
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