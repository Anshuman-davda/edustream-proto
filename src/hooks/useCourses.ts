import { useEffect, useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import type { Database } from '@/integrations/supabase/types';
export { categories } from '@/data/mockCourses';

type DbCourse = Database['public']['Tables']['courses']['Row'];
type DbLesson = Database['public']['Tables']['lessons']['Row'];
type DbEnrollment = Database['public']['Tables']['enrollments']['Row'];

export const useCourses = () => {
  const [courses, setCourses] = useState<DbCourse[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchCourses = async () => {
      setLoading(true);
      setError(null);
      try {
        const { data, error } = await supabase
          .from('courses')
          .select('*')
          .order('created_at', { ascending: false });
        if (error) throw error;
        setCourses((data as unknown as DbCourse[]) ?? []);
      } catch (err) {
        setError(err instanceof Error ? err.message : String(err));
      } finally {
        setLoading(false);
      }
    };
    fetchCourses();
  }, []);

  return { courses, loading, error };
};

export const useCourse = (courseId: string) => {
  const [course, setCourse] = useState<DbCourse | null>(null);
  const [lessons, setLessons] = useState<DbLesson[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!courseId) return;
    const fetchCourseAndLessons = async () => {
      setLoading(true);
      setError(null);
      try {
        const [{ data: courseData, error: courseError }, { data: lessonsData, error: lessonsError }] = await Promise.all([
          supabase.from('courses').select('*').eq('id', courseId).single(),
          supabase.from('lessons').select('*').eq('course_id', courseId).order('order_index', { ascending: true })
        ]);
        if (courseError) throw courseError;
        if (lessonsError) throw lessonsError;
        setCourse((courseData as unknown as DbCourse) ?? null);
        setLessons((lessonsData as unknown as DbLesson[]) ?? []);
      } catch (err) {
        setError(err instanceof Error ? err.message : String(err));
      } finally {
        setLoading(false);
      }
    };
    fetchCourseAndLessons();
  }, [courseId]);

  return { course, lessons, loading, error };
};

export const useEnrollments = (explicitUserId?: string) => {
  const [enrollments, setEnrollments] = useState<(DbEnrollment & { course: DbCourse })[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchEnrollments = async () => {
    setLoading(true);
    setError(null);

    try {
      const uid = explicitUserId || (await supabase.auth.getUser()).data.user?.id;

      if (!uid) {
        setEnrollments([]);
        setLoading(false);
        return;
      }

      const { data, error } = await supabase
        .from('enrollments')
        .select('*, course:courses(*)')
        .eq('user_id', uid)
        .order('enrolled_at', { ascending: false });

      if (error) throw error;

      setEnrollments((data as unknown as (DbEnrollment & { course: DbCourse })[]) ?? []);
    } catch (err) {
      setError(err instanceof Error ? err.message : String(err));
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchEnrollments();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [explicitUserId]);

  const enrollInCourse = async (courseId: string) => {
    const uid = explicitUserId || (await supabase.auth.getUser()).data.user?.id;

    if (!uid) return { error: 'User not authenticated' };

    try {
      const { data, error } = await supabase
        .from('enrollments')
        .insert([{ user_id: uid, course_id: courseId, progress_percentage: 0 }]);

      if (error) throw error;
      await fetchEnrollments();
      return { data };
    } catch (err) {
      return { error: err instanceof Error ? err.message : String(err) };
    }
  };

  const isEnrolled = (courseId: string) => enrollments.some((e) => e.course_id === courseId);

  return { enrollments, loading, error, enrollInCourse, isEnrolled, refetch: fetchEnrollments };
};
