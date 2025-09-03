import { useState } from "react";
import { useParams, Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import VideoPlayer from "@/components/media/VideoPlayer";
import { Play, Check, ChevronLeft } from "lucide-react";
import { useCourse } from "@/hooks/useCourses";

const CourseDetail = () => {
  const { id } = useParams<{ id: string }>();
  const { course, lessons, loading } = useCourse(id || "");
  const [currentLesson, setCurrentLesson] = useState(0);

  if (loading) {
    return (
      <div className="h-screen flex items-center justify-center">
        <div className="animate-spin h-12 w-12 border-b-2 border-primary rounded-full"></div>
      </div>
    );
  }

  if (!course) {
    return (
      <div className="h-screen flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-xl font-bold">Course not found</h2>
          <Button asChild>
            <Link to="/courses">Back to Courses</Link>
          </Button>
        </div>
      </div>
    );
  }

  const current = lessons?.[currentLesson];

  return (
    <div className="h-screen flex">
      {/* === LEFT: Video + Controls === */}
      <div className="flex-1 flex flex-col bg-black">
        <div className="flex items-center justify-between text-white p-4 bg-gray-900">
          <Link to="/courses" className="flex items-center gap-2 text-sm">
            <ChevronLeft className="h-4 w-4" /> Back
          </Link>
          <h2 className="font-semibold">{course.title}</h2>
          <div />
        </div>

        {/* Video Player */}
        <div className="flex-1">
          <VideoPlayer
            src={current?.video_url || course.video_url}
            title={current?.title || "Course Preview"}
            poster={course.thumbnail_url}
          />
        </div>

        {/* Controls */}
        <div className="p-4 bg-gray-900 text-white flex items-center justify-between">
          <Button
            onClick={() => setCurrentLesson((c) => Math.max(0, c - 1))}
            disabled={currentLesson === 0}
          >
            Previous
          </Button>
          <Button
            onClick={() =>
              setCurrentLesson((c) =>
                Math.min((lessons?.length || 1) - 1, c + 1)
              )
            }
          >
            Next
          </Button>
        </div>
      </div>

      {/* === RIGHT: Lesson List === */}
      <div className="w-80 bg-white border-l overflow-y-auto">
        <div className="p-4 border-b">
          <h3 className="font-bold text-lg">Course Content</h3>
          <Progress
            value={(currentLesson / (lessons?.length || 1)) * 100}
            className="mt-2"
          />
        </div>
        <ul>
          {lessons?.map((lesson, idx) => (
            <li
              key={lesson.id}
              className={`p-3 cursor-pointer flex items-center justify-between ${
                idx === currentLesson ? "bg-gray-100 font-semibold" : ""
              }`}
              onClick={() => setCurrentLesson(idx)}
            >
              <span>{lesson.title}</span>
              {idx < currentLesson ? (
                <Check className="h-4 w-4 text-green-600" />
              ) : (
                <Play className="h-4 w-4 text-gray-500" />
              )}
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default CourseDetail;
