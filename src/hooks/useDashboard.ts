import { useEffect, useMemo, useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import type { Database } from '@/integrations/supabase/types';

type DbCourse = Database['public']['Tables']['courses']['Row'];
type DbLesson = Database['public']['Tables']['lessons']['Row'];
type DbEnrollment = Database['public']['Tables']['enrollments']['Row'];
type DbLessonProgress = Database['public']['Tables']['lesson_progress']['Row'];

export const useWeeklyLearningHours = (userId?: string) => {
  const [data, setData] = useState<{ day: string; hours: number }[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchHours = async () => {
      setLoading(true);
      setError(null);
      try {
        const since = new Date();
        since.setDate(since.getDate() - 6); // last 7 days including today
        const { data, error } = await supabase
          .from('lesson_progress')
          .select('created_at, watch_time_seconds, user_id')
          .gte('created_at', since.toISOString())
          .eq('user_id', userId ?? (await supabase.auth.getUser()).data.user?.id ?? '');
        if (error) throw error;

        const buckets: Record<string, number> = {};
        const days = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
        // initialize last 7 days
        for (let i = 0; i < 7; i++) {
          const d = new Date(since);
          d.setDate(since.getDate() + i);
          buckets[days[d.getDay()]] = 0;
        }

        (data as DbLessonProgress[]).forEach((row) => {
          const d = new Date(row.created_at);
          const label = days[d.getDay()];
          const seconds = row.watch_time_seconds ?? 0;
          buckets[label] = (buckets[label] || 0) + seconds / 3600; // to hours
        });

        const result = Object.entries(buckets).map(([day, hours]) => ({ day, hours: Number(hours.toFixed(2)) }));
        // order as Sun..Sat but we want Mon..Sun; rotate
        const order = ['Mon','Tue','Wed','Thu','Fri','Sat','Sun'];
        result.sort((a,b) => order.indexOf(a.day) - order.indexOf(b.day));
        setData(result);
      } catch (err) {
        setError(err instanceof Error ? err.message : String(err));
      } finally {
        setLoading(false);
      }
    };
    fetchHours();
  }, [userId]);

  const totalHours = useMemo(() => data.reduce((s, d) => s + d.hours, 0), [data]);
  return { weeklyHours: data, totalHours, loading, error };
};

export const useSkillDistribution = (userId?: string) => {
  const [data, setData] = useState<{ name: string; value: number; color: string }[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchDist = async () => {
      setLoading(true);
      setError(null);
      try {
        const { data, error } = await supabase
          .from('enrollments')
          .select('course:courses(category)')
          .eq('user_id', userId ?? (await supabase.auth.getUser()).data.user?.id ?? '');
        if (error) throw error;
        const colorMap: Record<string, string> = {
          'Web Development': '#8B5CF6',
          'Data Science': '#06B6D4',
          'Design': '#10B981',
          'Marketing': '#F59E0B',
          'Technology': '#0EA5E9',
        };
        const counts: Record<string, number> = {};
        (data as { course: Pick<DbCourse,'category'> }[]).forEach((r) => {
          const cat = r.course?.category ?? 'Other';
          counts[cat] = (counts[cat] || 0) + 1;
        });
        const result = Object.entries(counts).map(([name, value]) => ({ name, value, color: colorMap[name] || '#94A3B8' }));
        setData(result);
      } catch (err) {
        setError(err instanceof Error ? err.message : String(err));
      } finally {
        setLoading(false);
      }
    };
    fetchDist();
  }, [userId]);

  return { skillDistribution: data, loading, error };
};

export const useCourseProgressSummary = (userId?: string) => {
  const [data, setData] = useState<{ name: string; completedPercent: number; completedCount: number; total: number }[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchProgress = async () => {
      setLoading(true);
      setError(null);
      try {
        const uid = userId ?? (await supabase.auth.getUser()).data.user?.id ?? '';
        // enrollments with course info
        const { data: enrolls, error: e1 } = await supabase
          .from('enrollments')
          .select('id, course:courses(id,title), progress_percentage')
          .eq('user_id', uid);
        if (e1) throw e1;

        const courseIds = (enrolls ?? []).map((e: any) => e.course?.id).filter(Boolean);
        const enrollmentIds = (enrolls ?? []).map((e: any) => e.id).filter(Boolean);
        let lessonsByCourse: Record<string, number> = {};
        if (courseIds.length > 0) {
          const { data: lessons, error: e2 } = await supabase
            .from('lessons')
            .select('id, course_id')
            .in('course_id', courseIds);
          if (e2) throw e2;
          lessonsByCourse = (lessons as DbLesson[]).reduce<Record<string, number>>((acc, l) => {
            acc[l.course_id] = (acc[l.course_id] || 0) + 1;
            return acc;
          }, {});
        }

        // count completed lessons per enrollment
        let completedByEnrollment: Record<string, number> = {};
        if (enrollmentIds.length > 0) {
          const { data: lp, error: e3 } = await supabase
            .from('lesson_progress')
            .select('enrollment_id, is_completed')
            .in('enrollment_id', enrollmentIds)
            .eq('is_completed', true);
          if (e3) throw e3;
          completedByEnrollment = (lp as { enrollment_id: string; is_completed: boolean }[]).reduce<Record<string, number>>((acc, r) => {
            acc[r.enrollment_id] = (acc[r.enrollment_id] || 0) + 1;
            return acc;
          }, {});
        }

        const result = (enrolls as any[]).map((e) => {
          const name = e.course?.title ?? 'Course';
          const total = lessonsByCourse[e.course?.id] ?? 0;
          const completedCount = completedByEnrollment[e.id] ?? Math.round(((e.progress_percentage ?? 0) / 100) * (total || 0));
          const completedPercent = total > 0 ? Math.round((completedCount / total) * 100) : Math.round(e.progress_percentage ?? 0);
          return { name, completedPercent, completedCount, total };
        });
        setData(result);
      } catch (err) {
        setError(err instanceof Error ? err.message : String(err));
      } finally {
        setLoading(false);
      }
    };
    fetchProgress();
  }, [userId]);

  return { courseProgress: data, loading, error };
};


