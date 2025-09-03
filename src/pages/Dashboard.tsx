import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Button } from '@/components/ui/button';
import CourseCard from '@/components/course/CourseCard';
import { useEnrollments } from '@/hooks/useCourses';
import { useAuth } from '@/hooks/useAuth';
import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  LineChart,
  Line
} from 'recharts';
import { 
  BookOpen, 
  Clock, 
  Award, 
  TrendingUp, 
  Play,
  Calendar,
  Target
} from 'lucide-react';
// import { getUserEnrolledCourses } from '@/data/mockCourses';

const Dashboard = () => {
  const { user } = useAuth();
  const { enrollments } = useEnrollments(user?.id);

  // Mock analytics data
  const weeklyProgress = [
    { day: 'Mon', hours: 2.5 },
    { day: 'Tue', hours: 3.2 },
    { day: 'Wed', hours: 1.8 },
    { day: 'Thu', hours: 4.1 },
    { day: 'Fri', hours: 2.9 },
    { day: 'Sat', hours: 5.2 },
    { day: 'Sun', hours: 3.7 }
  ];

  const courseProgress = [
    { name: 'React Development', completed: 65, total: 100 },
    { name: 'Data Science', completed: 40, total: 100 },
    { name: 'UX Design', completed: 85, total: 100 }
  ];

  const skillDistribution = [
    { name: 'Web Development', value: 40, color: '#8B5CF6' },
    { name: 'Data Science', value: 30, color: '#06B6D4' },
    { name: 'Design', value: 20, color: '#10B981' },
    { name: 'Marketing', value: 10, color: '#F59E0B' }
  ];

  const totalHoursLearned = weeklyProgress.reduce((sum, day) => sum + day.hours, 0);
  const averageProgress = enrollments.length > 0 ? enrollments.reduce((sum, e) => sum + (e.progress_percentage || 0), 0) / enrollments.length : 0;
  const completedCourses = enrollments.filter(e => (e.progress_percentage || 0) >= 100).length;

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-2">Learning Dashboard</h1>
          <p className="text-muted-foreground">
            Track your progress and continue your learning journey
          </p>
        </div>

        {/* Stats Overview */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <Card className="bg-gradient-primary text-white">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-white/80 text-sm font-medium">Enrolled Courses</p>
                  <p className="text-2xl font-bold">{enrollments.length}</p>
                </div>
                <BookOpen className="h-8 w-8 text-white/80" />
              </div>
            </CardContent>
          </Card>

          <Card className="bg-gradient-secondary text-white">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-white/80 text-sm font-medium">Hours This Week</p>
                  <p className="text-2xl font-bold">{totalHoursLearned.toFixed(1)}</p>
                </div>
                <Clock className="h-8 w-8 text-white/80" />
              </div>
            </CardContent>
          </Card>

          <Card className="border-accent border-2">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-muted-foreground text-sm font-medium">Average Progress</p>
                  <p className="text-2xl font-bold text-accent">{averageProgress.toFixed(1)}%</p>
                </div>
                <TrendingUp className="h-8 w-8 text-accent" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-muted-foreground text-sm font-medium">Completed</p>
                  <p className="text-2xl font-bold text-primary">{completedCourses}</p>
                </div>
                <Award className="h-8 w-8 text-primary" />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Charts Section */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
          {/* Weekly Learning Hours */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Calendar className="h-5 w-5" />
                Weekly Learning Hours
              </CardTitle>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={weeklyProgress}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="day" />
                  <YAxis />
                  <Tooltip />
                  <Bar dataKey="hours" fill="hsl(var(--primary))" />
                </BarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>

          {/* Skill Distribution */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Target className="h-5 w-5" />
                Skill Distribution
              </CardTitle>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <PieChart>
                  <Pie
                    data={skillDistribution}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    outerRadius={80}
                    fill="#8884d8"
                    dataKey="value"
                    label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                  >
                    {skillDistribution.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </div>

        {/* Course Progress */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle>Course Progress</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {courseProgress.map((course, index) => (
                <div key={index} className="flex items-center justify-between p-4 bg-muted/30 rounded-lg">
                  <div className="flex-1">
                    <h4 className="font-medium mb-2">{course.name}</h4>
                    <Progress value={course.completed} className="w-full" />
                  </div>
                  <div className="ml-4 text-right">
                    <span className="text-sm font-medium">{course.completed}%</span>
                    <p className="text-xs text-muted-foreground">
                      {course.completed}/{course.total} lessons
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Enrolled Courses */}
        <Card>
          <CardHeader>
            <CardTitle>My Courses</CardTitle>
          </CardHeader>
          <CardContent>
            {enrollments.length > 0 ? (
              enrollments.map((enrollment) => (
                <CourseCard
                  key={enrollment.course.id}
                  course={{
                    ...enrollment.course,
                    progress: enrollment.progress_percentage,
                    reviews: enrollment.course.reviews_count,
                    thumbnail: enrollment.course.thumbnail_url || '',
                    videoUrl: enrollment.course.video_url || '',
                    level: (enrollment.course.level as 'Beginner' | 'Intermediate' | 'Advanced'),
                    lessons: [],
                  }}
                  enrolled={true}
                  variant="enrolled"
                />
              ))
            ) : (
              <div className="text-center py-12">
                <BookOpen className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                <h3 className="text-lg font-semibold mb-2">No courses enrolled yet</h3>
                <p className="text-muted-foreground mb-4">
                  Start your learning journey by enrolling in your first course
                </p>
                <Button asChild>
                  <a href="/courses">Browse Courses</a>
                </Button>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Dashboard;