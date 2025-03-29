import { useState, useEffect } from 'react';
import { supabase, getCurrentUser } from '@services/supabase';
import { User } from '@supabase/supabase-js';
import { Database } from '@types/supabase';

interface UseSupabaseHook {
  user: User | null;
  loading: boolean;
  error: Error | null;
  signIn: (email: string, password: string) => Promise<{ success: boolean; error: Error | null }>;
  signUp: (email: string, password: string) => Promise<{ success: boolean; error: Error | null }>;
  signOut: () => Promise<void>;
  supabase: typeof supabase;
}

/**
 * Custom hook for Supabase authentication and access
 * @returns Object with user state, loading state, error state, authentication methods, and supabase client
 */
export const useSupabase = (): UseSupabaseHook => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    // Initialize: Check if user is already logged in
    const initializeUser = async () => {
      try {
        setLoading(true);
        const currentUser = await getCurrentUser();
        setUser(currentUser);
      } catch (err) {
        setError(err instanceof Error ? err : new Error('Failed to get user'));
        console.error('Error initializing user:', err);
      } finally {
        setLoading(false);
      }
    };

    initializeUser();

    // Set up auth state change listener
    const { data: authListener } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        if (session?.user) {
          setUser(session.user);
        } else {
          setUser(null);
        }
        setLoading(false);
      }
    );

    // Clean up subscription on unmount
    return () => {
      authListener.subscription.unsubscribe();
    };
  }, []);

  /**
   * Sign in with email and password
   * @param email User email
   * @param password User password
   * @returns Object indicating success or error
   */
  const signIn = async (email: string, password: string) => {
    try {
      setLoading(true);
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) throw error;
      return { success: true, error: null };
    } catch (err) {
      setError(err instanceof Error ? err : new Error('Failed to sign in'));
      console.error('Error signing in:', err);
      return { success: false, error: err instanceof Error ? err : new Error('Failed to sign in') };
    } finally {
      setLoading(false);
    }
  };

  /**
   * Sign up with email and password
   * @param email User email
   * @param password User password
   * @returns Object indicating success or error
   */
  const signUp = async (email: string, password: string) => {
    try {
      setLoading(true);
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
      });

      if (error) throw error;
      return { success: true, error: null };
    } catch (err) {
      setError(err instanceof Error ? err : new Error('Failed to sign up'));
      console.error('Error signing up:', err);
      return { success: false, error: err instanceof Error ? err : new Error('Failed to sign up') };
    } finally {
      setLoading(false);
    }
  };

  /**
   * Sign out the current user
   */
  const signOutUser = async () => {
    try {
      setLoading(true);
      const { error } = await supabase.auth.signOut();
      if (error) throw error;
      setUser(null);
    } catch (err) {
      setError(err instanceof Error ? err : new Error('Failed to sign out'));
      console.error('Error signing out:', err);
    } finally {
      setLoading(false);
    }
  };

  return {
    user,
    loading,
    error,
    signIn,
    signUp,
    signOut: signOutUser,
    supabase,
  };
}; 