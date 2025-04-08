'use client';

import Link from 'next/link';
import { useState } from 'react';
import { usePathname, useRouter } from 'next/navigation';
import { useAuth } from '../lib/auth/authContext';
import Image from 'next/image'

export default function Navbar() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const pathname = usePathname();
  const router = useRouter();
  const { user, logout } = useAuth();

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  const isActive = (path) => {
    return pathname === path ? 
      { 
        fontWeight: 'bold', 
        borderTop: 'none',
        borderRight: 'none',
        borderLeft: 'none',
        borderBottom: '3px solid var(--primary-yellow)' 
      } : {};
  };

  const handleLogout = () => {
    logout();
    router.push('/');
  };

  return (
    <nav style={{ backgroundColor: 'var(--primary-blue)', color: 'white' }}>
      <div className="container" style={{ 
        display: 'flex', 
        justifyContent: 'space-between', 
        alignItems: 'center',
        padding: '1rem 0'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <img 
            src="toledo.png"
            alt="UT logo"
            style={{ height: '60px', width: 'auto', transform: 'translateY(6px)' }}
          />
          <Link href="/" style={{ color: 'white', fontSize: '1.5rem', fontWeight: 'bold', textDecoration: 'none' }}>
            <span style={{ color: 'var(--primary-yellow)' }}>UT</span> Campus Connect
          </Link>
        </div>


        
        <div className="mobile-menu-button" onClick={toggleMenu} style={{ display: 'none', cursor: 'pointer' }}>
          <span>☰</span>
        </div>
        
        <div className={`nav-links ${isMenuOpen ? 'open' : ''}`} style={{ display: 'flex', gap: '1.5rem', alignItems: 'center' }}>
          <Link href="/" style={{ color: 'white', textDecoration: 'none', padding: '0.5rem 0', ...isActive('/') }}>
            Home
          </Link>
          <Link href="/found" style={{ color: 'white', textDecoration: 'none', padding: '0.5rem 0', ...isActive('/found') }}>
            Found Items
          </Link>
          <Link href="/lost" style={{ color: 'white', textDecoration: 'none', padding: '0.5rem 0', ...isActive('/lost') }}>
            Lost Items
          </Link>
          <Link href="/report" style={{ 
            backgroundColor: 'var(--primary-yellow)', 
            color: 'var(--primary-blue)', 
            textDecoration: 'none', 
            padding: '0.5rem 1rem', 
            borderRadius: '5px'
          }}>
            Report
          </Link>
          
          {user ? (
            <>
              <Link href="/my-items" style={{ 
                color: 'white', 
                textDecoration: 'none', 
                padding: '0.5rem 0',
                ...isActive('/my-items') 
              }}>
                My Items
              </Link>
              
              <div style={{ color: 'white', marginLeft: '1rem', display: 'flex', alignItems: 'center' }}>
                <span style={{ marginRight: '1rem' }}>Hello, {user.user_metadata?.username || 'User'}</span>
                <button 
                  onClick={handleLogout}
                  style={{ 
                    backgroundColor: 'transparent', 
                    borderTop: '1px solid white',
                    borderRight: '1px solid white',
                    borderBottom: '1px solid white',
                    borderLeft: '1px solid white', 
                    color: 'white', 
                    padding: '0.3rem 0.8rem', 
                    borderRadius: '4px',
                    cursor: 'pointer'
                  }}
                >
                  Logout
                </button>
              </div>
            </>
          ) : (
            <Link href="/auth/login" style={{ 
              color: 'white', 
              textDecoration: 'none', 
              padding: '0.3rem 0.8rem',
              borderTop: '1px solid white',
              borderRight: '1px solid white',
              borderBottom: '1px solid white',
              borderLeft: '1px solid white',
              borderRadius: '4px',
              marginLeft: '1rem'
            }}>
              Login
            </Link>
          )}
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