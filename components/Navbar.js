'use client';

import Link from 'next/link';
import { useState } from 'react';
import { usePathname } from 'next/navigation';

export default function Navbar() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const pathname = usePathname();

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  const isActive = (path) => {
    return pathname === path ? 
      { fontWeight: 'bold', borderBottom: '3px solid var(--primary-yellow)' } : {};
  };

  return (
    <nav style={{ backgroundColor: 'var(--primary-blue)', color: 'white' }}>
      <div className="container" style={{ 
        display: 'flex', 
        justifyContent: 'space-between', 
        alignItems: 'center',
        padding: '1rem 0'
      }}>
        <Link href="/" style={{ color: 'white', fontSize: '1.5rem', fontWeight: 'bold', textDecoration: 'none' }}>
          <span style={{ color: 'var(--primary-yellow)' }}>UT</span> Campus Connect
        </Link>
        
        <div className="mobile-menu-button" onClick={toggleMenu} style={{ display: 'none', cursor: 'pointer' }}>
          <span>☰</span>
        </div>
        
        <div className={`nav-links ${isMenuOpen ? 'open' : ''}`} style={{ display: 'flex', gap: '1.5rem' }}>
          <Link href="/" style={{ color: 'white', textDecoration: 'none', padding: '0.5rem 0', ...isActive('/') }}>
            Home
          </Link>
          <Link href="/found" style={{ color: 'white', textDecoration: 'none', padding: '0.5rem 0', ...isActive('/found') }}>
            Found Items
          </Link>
          <Link href="/lost" style={{ color: 'white', textDecoration: 'none', padding: '0.5rem 0', ...isActive('/lost') }}>
            Lost Items
          </Link>
          <Link href="/report" style={{ backgroundColor: 'var(--primary-yellow)', color: 'var(--primary-blue)', textDecoration: 'none', padding: '0.5rem 1rem', borderRadius: '5px', ...isActive('/report') }}>
            Report
          </Link>
        </div>
      </div>
      
      <style jsx>{`
        @media (max-width: 768px) {
          .mobile-menu-button {
            display: block !important;
          }
          
          .nav-links {
            display: ${isMenuOpen ? 'flex' : 'none'} !important;
            flex-direction: column;
            position: absolute;
            top: 60px;
            left: 0;
            right: 0;
            background-color: var(--primary-blue);
            padding: 1rem;
            z-index: 100;
          }
        }
      `}</style>
    </nav>
  );
} 