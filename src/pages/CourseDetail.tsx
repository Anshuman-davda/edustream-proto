import { useState, useEffect } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import { ChevronLeft, Play, Clock, Users, Award, BookOpen, Star, Check, ShoppingCart } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import VideoPlayer from "@/components/media/VideoPlayer";
import ReviewSection from "@/components/course/ReviewSection";
import { useCourse } from "@/hooks/useCourses";
import { useEnrollments } from "@/hooks/useCourses";
import { useAuth } from "@/hooks/useAuth";
import { useCart } from "@/hooks/useCart";
import { useToast } from "@/hooks/use-toast";

const CourseDetail = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { user } = useAuth();
  const { course, lessons, loading } = useCourse(id || "");
  const { enrollInCourse, isEnrolled } = useEnrollments(user?.id);
  const { addToCart, isInCart } = useCart();
  const { toast } = useToast();
  const [selectedLesson, setSelectedLesson] = useState<any>(null);
  const [enrolling, setEnrolling] = useState(false);

  const enrolled = isEnrolled(id || "");

  useEffect(() => {
    if (lessons.length > 0) {
      setSelectedLesson(lessons[0]);
    }
  }, [lessons]);

  const handleEnroll = async () => {
    if (!user) {
      navigate('/auth');
      return;
    }

    if (!course) return;

    setEnrolling(true);
    const result = await enrollInCourse(course.id);
    
    if (result.error) {
      toast({
        title: "Enrollment Failed",
        description: typeof result.error === 'string' ? result.error : 'Failed to enroll in course',
        variant: "destructive"
      });
    } else {
      toast({
        title: "Successfully Enrolled!",
        description: `You are now enrolled in ${course.title}`,
      });
    }
    
    setEnrolling(false);
  };

  const handleAddToCart = () => {
    if (!course) return;

    if (isInCart(course.id)) {
      toast({
        title: "Already in cart",
        description: "This course is already in your cart.",
        variant: "default"
      });
      return;
    }

    addToCart({
      ...course,
      originalPrice: course.original_price,
      thumbnail: course.thumbnail_url || '',
      reviews: course.reviews_count,
      videoUrl: course.video_url || '',
      level: course.level as 'Beginner' | 'Intermediate' | 'Advanced',
      lessons: []
    });
    
    toast({
      title: "Added to cart",
      description: `${course.title} has been added to your cart.`,
      variant: "default"
    });
  };

  const formatPrice = (price: number) =>
    new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
    }).format(price);

  const getLevelColor = (level: string) => {
    switch (level) {
      case 'Beginner':
        return 'bg-accent text-white';
      case 'Intermediate':
        return 'bg-primary text-white';
      case 'Advanced':
        return 'bg-destructive text-white';
      default:
        return 'bg-muted text-muted-foreground';
    }
  };

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
    <div className="min-h-screen bg-background">
      {/* Hero Section */}
      <div className="bg-gradient-primary text-white">
        <div className="container mx-auto px-4 py-8">
          <Link 
            to="/courses" 
            className="inline-flex items-center text-white/80 hover:text-white mb-6 transition-colors"
          >
            <ChevronLeft className="h-4 w-4 mr-2" /> 
            Back to Courses
          </Link>
          
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Course Info */}
            <div className="lg:col-span-2">
              <div className="flex items-center gap-2 mb-4">
                <Badge className={getLevelColor(course.level)}>
                  {course.level}
                </Badge>
                <Badge variant="secondary" className="bg-white/20 text-white">
                  {course.category}
                </Badge>
              </div>
              
              <h1 className="text-4xl font-bold mb-4">{course.title}</h1>
              <p className="text-xl text-white/90 mb-6">{course.description}</p>
              
              <div className="flex items-center gap-6 mb-6">
                <div className="flex items-center gap-2">
                  <Avatar className="h-8 w-8">
                    <AvatarFallback className="text-primary">
                      {course.instructor[0]}
                    </AvatarFallback>
                  </Avatar>
                  <span>by {course.instructor}</span>
                </div>
                
                <div className="flex items-center gap-2">
                  <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                  <span>{course.rating.toFixed(1)}</span>
                  <span className="text-white/80">({course.reviews_count} reviews)</span>
                </div>
                
                <div className="flex items-center gap-2">
                  <Users className="h-4 w-4" />
                  <span>1,234 students</span>
                </div>
              </div>
              
              <div className="flex items-center gap-6">
                <div className="flex items-center gap-2">
                  <Clock className="h-4 w-4" />
                  <span>{course.duration}</span>
                </div>
                <div className="flex items-center gap-2">
                  <BookOpen className="h-4 w-4" />
                  <span>{lessons.length} lessons</span>
                </div>
                <div className="flex items-center gap-2">
                  <Award className="h-4 w-4" />
                  <span>Certificate included</span>
                </div>
              </div>
            </div>
            
            {/* Course Card */}
            <div className="lg:col-span-1">
              <Card className="bg-background text-foreground">
                <CardContent className="p-6">
                  {selectedLesson && (
                    <div className="mb-4">
                      <VideoPlayer
                        src={selectedLesson.video_url}
                        poster={course.thumbnail_url}
                        title={selectedLesson.title}
                      />
                    </div>
                  )}
                  
                  <div className="flex items-center gap-2 mb-4">
                    <span className="text-3xl font-bold text-primary">
                      {formatPrice(course.price)}
                    </span>
                    {course.original_price && (
                      <span className="text-lg text-muted-foreground line-through">
                        {formatPrice(course.original_price)}
                      </span>
                    )}
                  </div>
                  
                  {enrolled ? (
                    <div className="space-y-3">
                      <div className="flex items-center gap-2 text-accent">
                        <Check className="h-4 w-4" />
                        <span className="font-medium">Enrolled</span>
                      </div>
                      <Progress value={75} className="h-2" />
                      <p className="text-sm text-muted-foreground">75% complete</p>
                    </div>
                  ) : (
                    <div className="space-y-3">
                      <Button 
                        className="w-full bg-gradient-primary text-white"
                        onClick={handleEnroll}
                        disabled={enrolling}
                      >
                        {enrolling ? 'Enrolling...' : 'Enroll Now'}
                      </Button>
                      
                      <Button 
                        variant="outline" 
                        className="w-full"
                        onClick={handleAddToCart}
                        disabled={isInCart(course.id)}
                      >
                        {isInCart(course.id) ? (
                          <>
                            <Check className="h-4 w-4 mr-2" />
                            In Cart
                          </>
                        ) : (
                          <>
                            <ShoppingCart className="h-4 w-4 mr-2" />
                            Add to Cart
                          </>
                        )}
                      </Button>
                      
                      <div className="text-center text-sm text-muted-foreground">
                        30-day money-back guarantee
                      </div>
                    </div>
                  )}
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Content Tabs */}
          <div className="lg:col-span-3">
            <Tabs defaultValue="overview" className="w-full">
              <TabsList className="grid w-full grid-cols-4">
                <TabsTrigger value="overview">Overview</TabsTrigger>
                <TabsTrigger value="curriculum">Curriculum</TabsTrigger>
                <TabsTrigger value="reviews">Reviews</TabsTrigger>
                <TabsTrigger value="instructor">Instructor</TabsTrigger>
              </TabsList>
              
              <TabsContent value="overview" className="mt-6">
                <Card>
                  <CardHeader>
                    <CardTitle>Course Overview</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div>
                      <h3 className="text-lg font-semibold mb-2">What you'll learn</h3>
                      <ul className="space-y-2">
                        <li className="flex items-start gap-2">
                          <Check className="h-5 w-5 text-accent mt-0.5" />
                          <span>Master the fundamentals and advanced concepts</span>
                        </li>
                        <li className="flex items-start gap-2">
                          <Check className="h-5 w-5 text-accent mt-0.5" />
                          <span>Build real-world projects from scratch</span>
                        </li>
                        <li className="flex items-start gap-2">
                          <Check className="h-5 w-5 text-accent mt-0.5" />
                          <span>Get hands-on experience with industry tools</span>
                        </li>
                        <li className="flex items-start gap-2">
                          <Check className="h-5 w-5 text-accent mt-0.5" />
                          <span>Prepare for professional certification</span>
                        </li>
                      </ul>
                    </div>
                    
                    <div>
                      <h3 className="text-lg font-semibold mb-2">Requirements</h3>
                      <ul className="space-y-1 text-muted-foreground">
                        <li>• Basic computer knowledge</li>
                        <li>• Access to a computer with internet connection</li>
                        <li>• Willingness to learn and practice</li>
                      </ul>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>
              
              <TabsContent value="curriculum" className="mt-6">
                <Card>
                  <CardHeader>
                    <CardTitle>Course Curriculum</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-2">
                      {lessons.map((lesson: any, index: number) => (
                        <div
                          key={lesson.id}
                          className={`flex items-center justify-between p-3 rounded-lg cursor-pointer transition-colors ${
                            selectedLesson?.id === lesson.id
                              ? 'bg-primary text-primary-foreground'
                              : 'hover:bg-muted'
                          }`}
                          onClick={() => setSelectedLesson(lesson)}
                        >
                          <div className="flex items-center gap-3">
                            <div className="flex items-center justify-center w-8 h-8 rounded-full bg-muted text-muted-foreground text-sm">
                              {index + 1}
                            </div>
                            <div>
                              <div className="font-medium">{lesson.title}</div>
                              {lesson.description && (
                                <div className="text-sm opacity-80">{lesson.description}</div>
                              )}
                            </div>
                          </div>
                          <div className="flex items-center gap-2 text-sm opacity-80">
                            <Play className="h-4 w-4" />
                            <span>{lesson.duration}</span>
                          </div>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>
              
              <TabsContent value="reviews" className="mt-6">
                <ReviewSection
                  courseId={course.id}
                  averageRating={course.rating}
                  totalReviews={course.reviews_count}
                />
              </TabsContent>
              
              <TabsContent value="instructor" className="mt-6">
                <Card>
                  <CardHeader>
                    <CardTitle>About the Instructor</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="flex items-start gap-4">
                      <Avatar className="h-20 w-20">
                        <AvatarFallback className="text-2xl">
                          {course.instructor[0]}
                        </AvatarFallback>
                      </Avatar>
                      <div>
                        <h3 className="text-xl font-semibold mb-2">{course.instructor}</h3>
                        <p className="text-muted-foreground mb-4">
                          Expert instructor with 10+ years of experience in the field. 
                          Passionate about teaching and helping students achieve their goals.
                        </p>
                        <div className="flex items-center gap-6 text-sm text-muted-foreground">
                          <div className="flex items-center gap-1">
                            <Star className="h-4 w-4" />
                            <span>4.8 Instructor Rating</span>
                          </div>
                          <div className="flex items-center gap-1">
                            <Users className="h-4 w-4" />
                            <span>10,234 Students</span>
                          </div>
                          <div className="flex items-center gap-1">
                            <BookOpen className="h-4 w-4" />
                            <span>25 Courses</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>
            </Tabs>
          </div>
          
          {/* Lesson Sidebar */}
          <aside className="lg:col-span-1">
            <Card>
              <CardHeader>
                <CardTitle>Course Content</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2 max-h-96 overflow-y-auto">
                  {lessons.map((lesson: any, index: number) => (
                    <button
                      key={lesson.id}
                      className={`w-full flex items-center gap-3 p-2 rounded-md text-left transition ${
                        selectedLesson?.id === lesson.id
                          ? "bg-gradient-primary text-white"
                          : "hover:bg-muted"
                      }`}
                      onClick={() => setSelectedLesson(lesson)}
                    >
                      <div className="flex items-center justify-center w-6 h-6 rounded-full bg-muted/20 text-xs">
                        {index + 1}
                      </div>
                      <div className="flex-1">
                        <div className="font-medium text-sm truncate">{lesson.title}</div>
                        <div className="text-xs opacity-80">{lesson.duration}</div>
                      </div>
                      <Play className="h-3 w-3" />
                    </button>
                  ))}
                </div>
              </CardContent>
            </Card>
          </aside>
        </div>
      </div>
    </div>
  );
};

export default CourseDetail;