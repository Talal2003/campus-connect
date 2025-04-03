import { useState, useEffect } from 'react';

export default function SearchBox({ onSearch, onFilterChange }) {
  const [searchTerm, setSearchTerm] = useState('');
  const [category, setCategory] = useState('');

  // Search on every keystroke
  useEffect(() => {
    onSearch(searchTerm);
  }, [searchTerm]);

  // Filter on category change
  useEffect(() => {
    onFilterChange({ category });
  }, [category]);

  return (
    <div style={{ marginBottom: '1rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
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
    </div>
  );
}
