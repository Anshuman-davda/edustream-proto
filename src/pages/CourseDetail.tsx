import { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import { ChevronLeft, Play } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { useCourse } from "@/hooks/useCourses";

const CourseDetail = () => {
  const { id } = useParams<{ id: string }>();
  const { course, lessons, loading } = useCourse(id || "");
  const [selectedLesson, setSelectedLesson] = useState<any>(null);

  useEffect(() => {
    if (lessons.length > 0) {
      setSelectedLesson(lessons[0]); // default to first lesson
    }
  }, [lessons]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
      </div>
    );
  }

  if (!course) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold mb-4">Course not found</h2>
          <Button asChild>
            <Link to="/courses">Back to Courses</Link>
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 lg:grid-cols-4 min-h-screen">
      {/* === MAIN VIDEO AREA === */}
      <div className="lg:col-span-3 p-6">
        <Link to="/courses" className="inline-flex items-center text-sm mb-4 text-muted-foreground hover:text-primary">
          <ChevronLeft className="h-4 w-4 mr-2" /> Back to Courses
        </Link>

        <h1 className="text-3xl font-bold mb-4">{course.title}</h1>
        <p className="text-muted-foreground mb-6">{course.description}</p>

        {selectedLesson ? (
          <Card className="overflow-hidden mb-6">
            <video
              key={selectedLesson.id}
              controls
              poster={course.thumbnail_url}
              className="w-full rounded-lg"
            >
              <source src={selectedLesson.video_url} type="video/mp4" />
              Your browser does not support the video tag.
            </video>
            <div className="p-4">
              <h2 className="text-xl font-semibold">{selectedLesson.title}</h2>
              <p className="text-muted-foreground">{selectedLesson.description}</p>
            </div>
          </Card>
        ) : (
          <p className="text-muted-foreground">No lessons available.</p>
        )}
      </div>

      {/* === LESSON SIDEBAR === */}
      <aside className="lg:col-span-1 border-l border-border p-6 bg-background">
        <h3 className="font-bold text-lg mb-4">Course Content</h3>
        <ul className="space-y-2">
          {lessons.map((lesson: any) => (
            <li key={lesson.id}>
              <button
                className={`w-full flex items-center gap-2 px-3 py-2 rounded-md text-left transition ${
                  selectedLesson?.id === lesson.id
                    ? "bg-gradient-primary text-white"
                    : "hover:bg-muted"
                }`}
                onClick={() => setSelectedLesson(lesson)}
              >
                <Play className="h-4 w-4" />
                <span className="truncate">{lesson.title}</span>
              </button>
            </li>
          ))}
        </ul>
      </aside>
    </div>
  );
};

export default CourseDetail;
