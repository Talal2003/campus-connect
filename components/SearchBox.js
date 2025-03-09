import { useState } from 'react';

export default function SearchBox({ onSearch }) {
  const [searchTerm, setSearchTerm] = useState('');

  const handleSearch = (e) => {
    e.preventDefault();
    onSearch(searchTerm);
  };

  return (
    <form onSubmit={handleSearch} style={{ marginBottom: '1rem', display: 'flex', alignItems: 'center' }}>
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
          boxShadow: '0 2px 5px rgba(0, 0, 0, 0.1)',
          marginRight: '0.5rem'
        }}
      />
      <select onChange={(e) => onFilterChange(e.target.value)} style={{ marginLeft: '0.5rem', padding: '0.5rem', borderRadius: '5px', border: '1px solid var(--primary-blue)' }}>
        <option value="">All Categories</option>
        <option value="electronics">Electronics</option>
        <option value="accessories">Accessories</option>
        <option value="id-cards">ID Cards</option>
        <option value="books">Books</option>
        <option value="other">Other</option>
      </select>
      <button type="submit" style={{ padding: '0.5rem 1rem', marginLeft: '0.5rem', backgroundColor: 'var(--primary-blue)', color: 'white', border: 'none', borderRadius: '5px', cursor: 'pointer' }}>Search</button>
    </form>
  );
} 