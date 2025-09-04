import { useRef } from 'react';
import { supabase } from '@/integrations/supabase/client';
import type { Database } from '@/integrations/supabase/types';

type DbEnrollment = Database['public']['Tables']['enrollments']['Row'];
type DbLesson = Database['public']['Tables']['lessons']['Row'];

export const useLearningProgress = (courseId: string | undefined) => {
  const lastSentRef = useRef<number>(0);
  const pendingRef = useRef<Record<string, { seconds: number; duration: number }>>({});

  const upsertLessonProgress = async (
    userId: string,
    enrollmentId: string,
    lessonId: string,
    seconds: number,
    duration: number,
    ended: boolean
  ) => {
    const watchSeconds = Math.floor(Math.max(0, seconds));
    const isCompleted = ended || (duration > 0 && watchSeconds / duration >= 0.9);

    // Fetch existing row to accumulate seconds and avoid regressions
    const { data: existing } = await supabase
      .from('lesson_progress')
      .select('id, watch_time_seconds, is_completed')
      .eq('user_id', userId)
      .eq('lesson_id', lessonId)
      .eq('enrollment_id', enrollmentId)
      .maybeSingle();

    const newSeconds = Math.max(existing?.watch_time_seconds ?? 0, watchSeconds);

    if (existing?.id) {
      await supabase
        .from('lesson_progress')
        .update({
          watch_time_seconds: newSeconds,
          is_completed: isCompleted ? true : existing.is_completed ?? false,
          completed_at: isCompleted ? new Date().toISOString() : existing?.is_completed ? existing.completed_at : null,
        })
        .eq('id', existing.id);
    } else {
      await supabase
        .from('lesson_progress')
        .insert([{
          user_id: userId,
          lesson_id: lessonId,
          enrollment_id: enrollmentId,
          watch_time_seconds: newSeconds,
          is_completed: isCompleted,
          completed_at: isCompleted ? new Date().toISOString() : null,
        }]);
    }
  };

  const recomputeEnrollmentProgress = async (enrollment: DbEnrollment) => {
    // Total lessons in the course
    const { data: lessons } = await supabase
      .from('lessons')
      .select('id')
      .eq('course_id', enrollment.course_id);

    const total = (lessons as DbLesson[] | null)?.length ?? 0;
    if (total === 0) return;

    // Completed lessons for this enrollment
    const { count } = await supabase
      .from('lesson_progress')
      .select('id', { count: 'exact', head: true })
      .eq('enrollment_id', enrollment.id)
      .eq('is_completed', true);

    const pct = Math.round(((count ?? 0) / total) * 100);
    await supabase
      .from('enrollments')
      .update({
        progress_percentage: pct,
        completed_at: pct >= 100 ? new Date().toISOString() : null,
      })
      .eq('id', enrollment.id);
  };

  // Public API
  const recordProgress = async (
    userId: string,
    lessonId: string,
    currentSeconds: number,
    durationSeconds: number,
    ended = false
  ) => {
    if (!courseId) return;

    // Resolve enrollment for user+course
    const { data: enrollment, error } = await supabase
      .from('enrollments')
      .select('*')
      .eq('user_id', userId)
      .eq('course_id', courseId)
      .single();
    if (error || !enrollment) return;

    const now = Date.now();
    const throttleOk = ended || now - lastSentRef.current > 5000; // 5s cadence or on end
    pendingRef.current[lessonId] = { seconds: currentSeconds, duration: durationSeconds };

    if (!throttleOk) return;
    lastSentRef.current = now;

    const snapshot = { ...pendingRef.current };
    pendingRef.current = {};

    for (const [lId, prog] of Object.entries(snapshot)) {
      await upsertLessonProgress(
        enrollment.user_id,
        enrollment.id,
        lId,
        prog.seconds,
        prog.duration,
        ended
      );
    }

    await recomputeEnrollmentProgress(enrollment as DbEnrollment);
  };

  return { recordProgress };
};


