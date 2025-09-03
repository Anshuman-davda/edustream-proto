import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Sun, Moon } from "lucide-react";
import ReactPlayer from "react-player";

export default function CoursePage() {
  const [darkMode, setDarkMode] = useState(false);
  const [selectedLesson, setSelectedLesson] = useState({
    title: "Digital Marketing Fundamentals",
    url: "https://your-supabase-video-link.mp4",
  });

  const lessons = [
    { title: "Digital Marketing Fundamentals", url: "video1.mp4" },
    { title: "SEO Best Practices", url: "video2.mp4" },
    { title: "Social Media Strategy", url: "video3.mp4" },
  ];

  return (
    <div className={darkMode ? "dark bg-gray-900 text-white" : "bg-white text-black"}>
      {/* Header */}
      <header className="flex justify-between items-center p-4 border-b">
        <h1 className="text-xl font-bold">Digital Marketing Strategy</h1>
        <Button variant="ghost" onClick={() => setDarkMode(!darkMode)}>
          {darkMode ? <Sun /> : <Moon />}
        </Button>
      </header>

      {/* Layout */}
      <div className="grid grid-cols-4 min-h-screen">
        {/* Video Area */}
        <div className="col-span-3 p-6">
          <Card className="overflow-hidden rounded-2xl shadow-lg">
            <CardContent>
              <ReactPlayer
                src={selectedLesson.url}
                controls
                width="100%"
                height="480px"
              />
              <h2 className="mt-4 text-2xl font-semibold">{selectedLesson.title}</h2>
            </CardContent>
          </Card>
        </div>

        {/* Sidebar */}
        <aside className="col-span-1 p-6 border-l">
          <h3 className="font-bold text-lg mb-4">Course Content</h3>
          <ul className="space-y-2">
            {lessons.map((lesson, idx) => (
              <li key={idx}>
                <Button
                  variant="ghost"
                  className="w-full justify-start text-left"
                  onClick={() => setSelectedLesson(lesson)}
                >
                  {lesson.title}
                </Button>
              </li>
            ))}
          </ul>
        </aside>
      </div>
    </div>
  );
}
