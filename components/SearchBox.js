import { useState, useEffect, useRef } from 'react';
import { compareImageWithDatabase } from '../lib/services/aiImageSearch';

export default function SearchBox({ onSearch, onFilterChange, onAiSearchResults }) {
  const [searchTerm, setSearchTerm] = useState('');
  const [category, setCategory] = useState('');
  const [isAiSearching, setIsAiSearching] = useState(false);
  const [aiError, setAiError] = useState('');
  const fileInputRef = useRef(null);

  // Search on every keystroke
  useEffect(() => {
    onSearch(searchTerm);
  }, [searchTerm]);

  // Filter on category change
  useEffect(() => {
    onFilterChange({ category });
  }, [category]);

  const handleFileSelect = () => {
    fileInputRef.current.click();
  };

  const handleFileChange = async (e) => {
    // Process the file only if one was selected
    if (e.target.files && e.target.files.length > 0) {
      const imageFile = e.target.files[0];
      
      try {
        setIsAiSearching(true);
        setAiError('');
        
        // Perform AI image comparison
        const results = await compareImageWithDatabase(imageFile);
        
        // Pass results to parent component
        if (onAiSearchResults) {
          onAiSearchResults(results);
        }
        
      } catch (error) {
        console.error('AI Search error:', error);
        setAiError('Error processing image. Please try again.');
      } finally {
        setIsAiSearching(false);
      }
    }
  };

  return (
    <div style={{ marginBottom: '1rem' }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
        <input
          type="text"
          placeholder="Search by title..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          style={{
            padding: '0.5rem',
            width: '100%',
            maxWidth: '400px',
            border: '1px solid var(--primary-blue)',
            borderRadius: '5px',
            boxShadow: '0 2px 5px rgba(0, 0, 0, 0.1)'
          }}
        />

        <select
          value={category}
          onChange={(e) => setCategory(e.target.value)}
          style={{
            padding: '0.5rem',
            borderRadius: '5px',
            border: '1px solid var(--primary-blue)'
          }}
        >
          <option value="">All Categories</option>
          <option value="electronics">Electronics</option>
          <option value="accessories">Accessories</option>
          <option value="id-cards">ID Cards</option>
          <option value="books">Books</option>
          <option value="other">Other</option>
        </select>
        
        <button 
          onClick={handleFileSelect}
          disabled={isAiSearching}
          style={{
            padding: '0.5rem 1rem',
            backgroundColor: isAiSearching ? '#ccc' : 'var(--accent-color, #6c5ce7)',
            color: 'white',
            border: 'none',
            borderRadius: '5px',
            cursor: isAiSearching ? 'not-allowed' : 'pointer',
            whiteSpace: 'nowrap',
            fontWeight: 'bold'
          }}
        >
          {isAiSearching ? 'Searching...' : 'Search with AI'}
        </button>
        
        <input 
          type="file" 
          ref={fileInputRef}
          accept="image/*"
          style={{ display: 'none' }}
          onChange={handleFileChange}
        />
      </div>
      
      {aiError && (
        <div style={{ color: 'red', marginTop: '0.5rem', fontSize: '0.875rem' }}>
          {aiError}
        </div>
      )}
    </div>
  );
}
