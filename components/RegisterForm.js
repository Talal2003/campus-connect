'use client';

import { useState, useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { useAuth } from '../lib/auth/authContext';

export default function RegisterForm() {
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    password: '',
    confirmPassword: ''
  });
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const router = useRouter();
  const searchParams = useSearchParams();
  const { register, user } = useAuth();

  // Redirect URL if provided
  const redirect = searchParams.get('redirect') || '/';

  // Redirect if already logged in
  useEffect(() => {
    if (user) {
      router.push(redirect);
    }
  }, [user, router, redirect]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!formData.username || !formData.email || !formData.password || !formData.confirmPassword) {
      setError('All fields are required');
      return;
    }

    if (!formData.email.endsWith('@rockets.utoledo.edu')) {
      setError('Only UT email addresses are allowed (example@rockets.utoledo.edu)');
      return;
    }
    
    if (formData.password !== formData.confirmPassword) {
      setError('Passwords do not match');
      return;
    }
    
    setIsSubmitting(true);
    setError('');
    
    try {
      const result = await register(formData.username, formData.email, formData.password);
      
      if (result.success) {
        setSuccess(true);
      } else {
        // Intercept known Supabase error messages
        const msg = result.error || '';
        if (msg.includes('duplicate key value') && msg.includes('users_username_key')) {
          setError('This username is already taken.');
        } else if (msg.includes('duplicate key value') && msg.includes('users_email_key')) {
          setError('This email already has an account associated with it.');
        } else {
          setError(msg || 'Registration failed');
        }
      }
    } catch (err) {
      setError(err.message || 'An unexpected error occurred');
      console.error(err);
    } finally {
      setIsSubmitting(false);
    }
  };

  // Registration successful view
  if (success) {
    return (
      <div className="container" style={{ maxWidth: '500px', margin: '0 auto' }}>
        <div className="card" style={{ padding: '2rem' }}>
          <h1 style={{ color: 'var(--primary-blue)', marginBottom: '1.5rem', textAlign: 'center' }}>Registration Successful!</h1>
          
          <div style={{ 
            backgroundColor: '#e8f5e9', 
            color: '#2e7d32', 
            padding: '1.5rem', 
            borderRadius: '0.25rem',
            marginBottom: '2rem',
            textAlign: 'center'
          }}>
            <p style={{ fontSize: '1.1rem', marginBottom: '0.5rem' }}>Your account has been created successfully!</p>
            <p>A confirmation email has been sent to your email address.</p>
            <p>Please check your inbox and follow the instructions to verify your account.</p>
          </div>
          
          <Link href="/auth/login">
            <button 
              className="btn-primary" 
              style={{ width: '100%', padding: '0.8rem' }}
            >
              Back to Login
            </button>
          </Link>
        </div>
      </div>
    );
  }

  // Registration form view
  return (
    <div className="container" style={{ maxWidth: '500px', margin: '0 auto' }}>
      <div className="card" style={{ padding: '2rem' }}>
        <h1 style={{ color: 'var(--primary-blue)', marginBottom: '1.5rem', textAlign: 'center' }}>Create Account</h1>
        
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
        
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label htmlFor="username">Username</label>
            <input
              type="text"
              id="username"
              name="username"
              className="form-control"
              value={formData.username}
              onChange={handleChange}
              disabled={isSubmitting}
              required
            />
          </div>
          
          <div className="form-group">
            <label htmlFor="email">Email</label>
            <input
              type="email"
              id="email"
              name="email"
              className="form-control"
              value={formData.email}
              onChange={handleChange}
              disabled={isSubmitting}
              required
            />
          </div>
          
          <div className="form-group">
            <label htmlFor="password">Password</label>
            <input
              type="password"
              id="password"
              name="password"
              className="form-control"
              value={formData.password}
              onChange={handleChange}
              disabled={isSubmitting}
              required
            />
          </div>
          
          <div className="form-group">
            <label htmlFor="confirmPassword">Confirm Password</label>
            <input
              type="password"
              id="confirmPassword"
              name="confirmPassword"
              className="form-control"
              value={formData.confirmPassword}
              onChange={handleChange}
              disabled={isSubmitting}
              required
            />
          </div>
          
          <button 
            type="submit" 
            className="btn-primary" 
            style={{ width: '100%', marginTop: '1rem' }}
            disabled={isSubmitting}
          >
            {isSubmitting ? 'Creating Account...' : 'Register'}
          </button>
        </form>
        
        <div style={{ marginTop: '1.5rem', textAlign: 'center' }}>
          Already have an account?{' '}
          <Link href="/auth/login">
            Login here
          </Link>
        </div>
      </div>
    </div>
  );
} 