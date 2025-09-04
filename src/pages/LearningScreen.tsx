import { useEffect, useState, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import VideoPlayer from '@/components/media/VideoPlayer';
import { useCourse } from '@/hooks/useCourses';
import { useAuth } from '@/hooks/useAuth';
import { useLearningProgress } from '@/hooks/useLearningProgress';
import { ChevronLeft, Check, Play, ArrowLeft, ArrowRight } from 'lucide-react';

const LearningScreen = () => {
  const { courseId } = useParams<{ courseId: string }>();
  const navigate = useNavigate();
  const { user } = useAuth();
  const { course, lessons, loading } = useCourse(courseId || '');
  const [currentLessonIdx, setCurrentLessonIdx] = useState(0);
  const [autoPlay, setAutoPlay] = useState(false);
  const prevLessonIdx = useRef<number>(0);
  const { recordProgress } = useLearningProgress(courseId);

  useEffect(() => {
    if (lessons.length > 0) setCurrentLessonIdx(0);
  }, [lessons]);

  // Reset autoplay after lesson loads
  useEffect(() => {
    if (autoPlay && prevLessonIdx.current !== currentLessonIdx) {
      setTimeout(() => setAutoPlay(false), 500); // allow autoplay for a short time
      prevLessonIdx.current = currentLessonIdx;
    }
  }, [currentLessonIdx, autoPlay]);

  if (loading) return <div className="min-h-screen flex items-center justify-center">Loading...</div>;
  if (!course || lessons.length === 0) return <div className="min-h-screen flex items-center justify-center">Course or lessons not found.</div>;

  const currentLesson = lessons[currentLessonIdx];

  const goToLesson = (idx: number) => {
    if (idx >= 0 && idx < lessons.length) {
      setCurrentLessonIdx(idx);
      setAutoPlay(true); // trigger autoplay on lesson change
    }
  };

  return (
    <div className="min-h-screen flex bg-background">
      {/* Sidebar */}
      <aside className="w-72 bg-muted/40 border-r h-screen overflow-y-auto p-6 flex flex-col">
        <Button variant="ghost" className="mb-6 w-fit" onClick={() => navigate(`/course/${course.id}`)}>
          <ChevronLeft className="h-4 w-4 mr-2" /> Back to Course
        </Button>
        <h2 className="font-bold text-lg mb-4">{course.title}</h2>
        <div className="space-y-2">
          {lessons.map((lesson: any, idx: number) => (
            <button
              key={lesson.id}
              className={`w-full flex items-center gap-3 p-2 rounded-md text-left transition font-medium ${
                idx === currentLessonIdx ? 'bg-primary text-primary-foreground' : 'hover:bg-muted'
              }`}
              onClick={() => goToLesson(idx)}
            >
              <span className="w-6 h-6 flex items-center justify-center rounded-full bg-muted/30 text-xs">
                {idx + 1}
              </span>
              <span className="truncate flex-1">{lesson.title}</span>
              {idx === currentLessonIdx && <Play className="h-3 w-3" />}
            </button>
          ))}
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 flex flex-col items-center justify-start p-8">
        <div className="w-full max-w-3xl">
          <Card>
            <CardContent className="p-0">
              <VideoPlayer
                src={currentLesson.video_url}
                poster={course.thumbnail_url}
                title={currentLesson.title}
                autoPlay={autoPlay}
                onTimeUpdate={(current, dur) => {
                  if (!user?.id) return;
                  recordProgress(user.id, currentLesson.id, current, dur, false);
                }}
                onEnded={() => {
                  if (!user?.id) return;
                  recordProgress(user.id, currentLesson.id, currentLesson.duration ? Number(currentLesson.duration) : 0, currentLesson.duration ? Number(currentLesson.duration) : 0, true);
                }}
              />
            </CardContent>
          </Card>
          <div className="mt-6 flex flex-col gap-2">
            <h1 className="text-2xl font-bold mb-2">{currentLesson.title}</h1>
            {currentLesson.description && <p className="text-muted-foreground mb-2">{currentLesson.description}</p>}
            <div className="flex gap-2 mt-4">
              <Button
                variant="outline"
                onClick={() => goToLesson(currentLessonIdx - 1)}
                disabled={currentLessonIdx === 0}
              >
                <ArrowLeft className="h-4 w-4 mr-1" /> Previous
              </Button>
              <Button
                variant="outline"
                onClick={() => goToLesson(currentLessonIdx + 1)}
                disabled={currentLessonIdx === lessons.length - 1}
              >
                Next <ArrowRight className="h-4 w-4 ml-1" />
              </Button>
            </div>
            {/* Extra content below video */}
            <div className="mt-8 p-6 bg-muted/30 rounded-lg min-h-[120px]">
              <h2 className="text-lg font-semibold mb-2">Lesson Notes & Resources</h2>
              <p className="text-muted-foreground">Coming soon: Downloadable resources, notes, and discussions for this lesson.</p>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default LearningScreen;
