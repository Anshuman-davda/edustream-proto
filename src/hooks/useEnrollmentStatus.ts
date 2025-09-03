import { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabase';

type Status = 'loading' | 'enrolled' | 'not_enrolled' | 'error';

export function useEnrollmentStatus(courseId?: string) {
  const [status, setStatus] = useState<Status>('loading');
  const [progress, setProgress] = useState<number | null>(null);

  useEffect(() => {
    let cancelled = false;

    (async () => {
      if (!courseId) {
        if (!cancelled) setStatus('not_enrolled');
        return;
      }

      const { data: userRes, error: userErr } = await supabase.auth.getUser();
      const user = userRes?.user;
      if (userErr || !user) {
        if (!cancelled) { setStatus('not_enrolled'); setProgress(null); }
        return;
      }

      const { data, error } = await supabase
        .from('enrollments')
        .select('id, progress_percentage')
        .eq('user_id', user.id)
        .eq('course_id', courseId)
        .maybeSingle();

      if (cancelled) return;

      if (error) {
        setStatus('error');
        setProgress(null);
        return;
      }

      if (data) {
        setStatus('enrolled');
        setProgress(typeof data.progress_percentage === 'number' ? data.progress_percentage : 0);
      } else {
        setStatus('not_enrolled');
        setProgress(null);
      }
    })();

    return () => { cancelled = true; };
  }, [courseId]);

  return {
    status,
    isEnrolled: status === 'enrolled',
    progress
  };
}
