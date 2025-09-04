// src/pages/LearningScreenDebug.tsx
import { Link, useParams } from 'react-router-dom';

export default function LearningScreenDebug() {
  const { courseId } = useParams<{ courseId: string }>();
  // No hooks. Just render static content.
  return (
    <div className="min-h-screen flex flex-col items-center justify-center gap-6 p-8">
      <h1 className="text-2xl font-bold">Debug Learning Screen</h1>
      <p>courseId: <strong>{courseId}</strong></p>
      <p className="text-sm text-muted-foreground">This component uses NO hooks — it helps isolate the bug.</p>
      <div className="flex gap-2">
        <Link to={`/course/${courseId}`}>
          <button className="px-4 py-2 rounded bg-muted/10">Back to Course</button>
        </Link>
        <Link to="/">
          <button className="px-4 py-2 rounded bg-muted/10">Home</button>
        </Link>
      </div>
    </div>
  );
}
