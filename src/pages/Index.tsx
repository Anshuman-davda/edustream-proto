import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import CourseCard from '@/components/course/CourseCard';
import { 
  GraduationCap, 
  TrendingUp, 
  Award, 
  Users,
  BookOpen,
  Star,
  ArrowRight,
  PlayCircle,
  Target,
  Clock,
  Globe
} from 'lucide-react';
import { mockCourses } from '@/data/mockCourses';

const Index = () => {
  const featuredCourses = mockCourses.slice(0, 3);
  
  const stats = [
    { label: 'Students', value: '50K+', icon: Users },
    { label: 'Courses', value: '500+', icon: BookOpen },
    { label: 'Instructors', value: '100+', icon: Award },
    { label: 'Countries', value: '120+', icon: Globe },
  ];

  const features = [
    {
      icon: PlayCircle,
      title: 'Interactive Learning',
      description: 'Engage with high-quality video content and hands-on projects'
    },
    {
      icon: Target,
      title: 'Skill-Based Curriculum',
      description: 'Learn job-ready skills from industry professionals'
    },
    {
      icon: Clock,
      title: 'Learn at Your Pace',
      description: 'Flexible scheduling that fits your lifestyle'
    },
    {
      icon: Award,
      title: 'Certificates',
      description: 'Earn recognized certificates upon course completion'
    }
  ];

  return (
    <div className="min-h-screen bg-background">
      {/* Hero Section */}
      <section className="bg-gradient-hero text-white py-20">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div>
              <Badge className="bg-white/20 text-white mb-6">
                🎉 Join 50,000+ learners worldwide
              </Badge>
              <h1 className="text-5xl md:text-6xl font-bold mb-6 leading-tight">
                Master New Skills with 
                <span className="block text-primary-glow">EduStream</span>
              </h1>
              <p className="text-xl text-white/90 mb-8 leading-relaxed">
                Transform your career with our comprehensive online courses. 
                Learn from industry experts and build real-world projects.
              </p>
              <div className="flex flex-col sm:flex-row gap-4">
                <Button 
                  size="lg" 
                  className="bg-white text-primary hover:bg-white/90 shadow-glow"
                  asChild
                >
                  <Link to="/courses">
                    Explore Courses
                    <ArrowRight className="h-5 w-5 ml-2" />
                  </Link>
                </Button>
                <Button 
                  size="lg" 
                  variant="outline" 
                  className="border-white/30 text-white hover:bg-white/10"
                  asChild
                >
                  <Link to="/auth">
                    Start Free Trial
                  </Link>
                </Button>
              </div>
            </div>
            
            {/* Hero Image/Video */}
            <div className="relative">
              <div className="bg-white/10 rounded-2xl p-8 backdrop-blur-sm shadow-glow">
                <div className="aspect-video bg-black/20 rounded-xl flex items-center justify-center mb-4">
                  <PlayCircle className="h-16 w-16 text-white/80" />
                </div>
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <h3 className="font-semibold">React Development</h3>
                    <Badge className="bg-accent text-white">Popular</Badge>
                  </div>
                  <div className="flex items-center gap-2 text-white/80">
                    <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                    <span>4.8 (2.3k reviews)</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-16 bg-muted/30">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {stats.map((stat, index) => (
              <div key={index} className="text-center">
                <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-primary rounded-full mb-4 shadow-soft">
                  <stat.icon className="h-8 w-8 text-white" />
                </div>
                <div className="text-3xl font-bold text-primary mb-2">{stat.value}</div>
                <div className="text-muted-foreground">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              Why Choose EduStream?
            </h2>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              We provide the best learning experience with modern tools and expert instruction
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {features.map((feature, index) => (
              <Card key={index} className="text-center course-card">
                <CardContent className="p-6">
                  <div className="inline-flex items-center justify-center w-12 h-12 bg-primary/10 rounded-full mb-4">
                    <feature.icon className="h-6 w-6 text-primary" />
                  </div>
                  <h3 className="font-semibold text-lg mb-2">{feature.title}</h3>
                  <p className="text-muted-foreground">{feature.description}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Featured Courses */}
      <section className="py-16 bg-muted/30">
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-between mb-12">
            <div>
              <h2 className="text-3xl md:text-4xl font-bold mb-4">
                Featured Courses
              </h2>
              <p className="text-xl text-muted-foreground">
                Start your learning journey with our most popular courses
              </p>
            </div>
            <Button variant="outline" asChild>
              <Link to="/courses">
                View All Courses
                <ArrowRight className="h-4 w-4 ml-2" />
              </Link>
            </Button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {featuredCourses.map((course) => (
              <CourseCard key={course.id} course={course} />
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-gradient-primary text-white">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-4xl md:text-5xl font-bold mb-6">
            Ready to Transform Your Career?
          </h2>
          <p className="text-xl text-white/90 mb-8 max-w-2xl mx-auto">
            Join thousands of students who have advanced their careers with our expert-led courses
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button 
              size="lg" 
              className="bg-white text-primary hover:bg-white/90 shadow-glow"
              asChild
            >
              <Link to="/courses">
                Get Started Today
                <ArrowRight className="h-5 w-5 ml-2" />
              </Link>
            </Button>
            <Button 
              size="lg" 
              variant="outline" 
              className="border-white/30 text-white hover:bg-white/10"
              asChild
            >
              <Link to="/dashboard">
                View Dashboard
              </Link>
            </Button>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Index;
