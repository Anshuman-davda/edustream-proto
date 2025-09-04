import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';

export interface Review {
  id: string;
  user_id: string;
  course_id: string;
  rating: number;
  comment?: string;
  created_at: string;
  updated_at: string;
  profile?: {
    first_name?: string;
    last_name?: string;
    avatar_url?: string;
  };
  profiles?: {
    first_name?: string;
    last_name?: string;
    avatar_url?: string;
  };
}

export const useReviews = (courseId: string) => {
  const [reviews, setReviews] = useState<Review[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (courseId) {
      fetchReviews();
    }
  }, [courseId]);

  const fetchReviews = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('course_reviews')
        .select(`
          *,
          profiles!course_reviews_user_id_fkey(
            first_name,
            last_name,
            avatar_url
          )
        `)
        .eq('course_id', courseId)
        .order('created_at', { ascending: false });

      if (error) {
        throw error;
      }

      setReviews((data as any) || []);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
    } finally {
      setLoading(false);
    }
  };

  const addReview = async (rating: number, comment?: string) => {
    try {
      const { data, error } = await supabase
        .from('course_reviews')
        .insert([
          {
            course_id: courseId,
            rating,
            comment: comment || null,
            user_id: (await supabase.auth.getUser()).data.user?.id
          }
        ])
        .select(`
          *,
          profiles!course_reviews_user_id_fkey(
            first_name,
            last_name,
            avatar_url
          )
        `)
        .single();

      if (error) {
        throw error;
      }

      if (data) {
        setReviews(prev => [data as any, ...prev]);
      }
      
      return { success: true };
    } catch (err) {
      return { error: err instanceof Error ? err.message : 'Failed to add review' };
    }
  };

  const updateReview = async (reviewId: string, rating: number, comment?: string) => {
    try {
      const { data, error } = await supabase
        .from('course_reviews')
        .update({ rating, comment: comment || null })
        .eq('id', reviewId)
        .select(`
          *,
          profiles!course_reviews_user_id_fkey(
            first_name,
            last_name,
            avatar_url
          )
        `)
        .single();

      if (error) {
        throw error;
      }

      if (data) {
        setReviews(prev => prev.map(review => 
          review.id === reviewId ? data as any : review
        ));
      }
      
      return { success: true };
    } catch (err) {
      return { error: err instanceof Error ? err.message : 'Failed to update review' };
    }
  };

  const deleteReview = async (reviewId: string) => {
    try {
      const { error } = await supabase
        .from('course_reviews')
        .delete()
        .eq('id', reviewId);

      if (error) {
        throw error;
      }

      setReviews(prev => prev.filter(review => review.id !== reviewId));
      return { success: true };
    } catch (err) {
      return { error: err instanceof Error ? err.message : 'Failed to delete review' };
    }
  };

  return {
    reviews,
    loading,
    error,
    addReview,
    updateReview,
    deleteReview,
    refetch: fetchReviews
  };
};