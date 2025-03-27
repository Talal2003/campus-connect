'use client';

import { createContext, useState, useEffect, useContext } from 'react';
import { supabase } from '../supabase';

const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Check for existing session
    supabase.auth.getSession().then(({ data: { session } }) => {
      setUser(session?.user ?? null);
      setLoading(false);
    });

    // Listen for auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null);
    });

    return () => subscription.unsubscribe();
  }, []);

  const login = async (loginIdentifier, password) => {
    try {
      let email = loginIdentifier;
      
      // Check if the loginIdentifier is not an email (no @ symbol)
      if (!loginIdentifier.includes('@')) {
        // It's a username, so we need to look up the email
        const { data: userData, error: userError } = await supabase
          .from('users')
          .select('email')
          .eq('username', loginIdentifier)
          .single();
        
        if (userError) throw new Error('Username not found');
        
        // Use the found email for authentication
        email = userData.email;
      }
      
      // Now authenticate with the email
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) throw error;
      return { success: true };
    } catch (error) {
      return { success: false, error: error.message };
    }
  };

  const register = async (username, email, password) => {
    try {
      // First sign up with Supabase Auth
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            username: username
          }
        }
      });

      if (error) throw error;
      
      // After successful auth signup, create a record in the users table
      const userData = {
        id: data.user.id, // Use the same UUID from auth
        username,
        email,
        password: 'AUTH_MANAGED' // We don't store the actual password in our table
      };
      
      // Insert the user data into our users table
      const { error: dbError } = await supabase
        .from('users')
        .upsert([userData], { onConflict: 'id' });
      
      if (dbError && !dbError.message.includes('violates row-level security policy')) {
        // If database insert fails (except for RLS policy violations which we can ignore since the data is inserted),
        // we should clean up the auth user
        await supabase.auth.admin.deleteUser(data.user.id);
        throw dbError;
      }
      
      return { success: true };
    } catch (error) {
      return { success: false, error: error.message };
    }
  };

  const logout = async () => {
    try {
      const { error } = await supabase.auth.signOut();
      if (error) throw error;
    } catch (error) {
      console.error('Error logging out:', error.message);
    }
  };

  return (
    <AuthContext.Provider value={{ user, login, register, logout, loading }}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => useContext(AuthContext); 