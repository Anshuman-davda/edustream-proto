import { useState, useEffect } from 'react';
import { useParams, Link, useSearchParams } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import VideoPlayer from '@/components/media/VideoPlayer';
import { 
  Star, 
  Clock, 
  Users, 
  Award, 
  ChevronLeft,
  Play,
  Check,
  ShoppingCart,
  Download,
  Share,
  BookOpen,
  Target,
  Globe
} from 'lucide-react';
import { getCourseById } from '@/data/mockCourses';
import { useCart } from '@/hooks/useCart';
import { useToast } from '@/hooks/use-toast';

const CourseDetail = () => {
  const { id } = useParams<{ id: string }>();
  const [searchParams] = useSearchParams();
  const { addToCart, isInCart } = useCart();
  const { toast } = useToast();
  const [currentLesson, setCurrentLesson] = useState(0);
  const [activeTab, setActiveTab] = useState('overview');

  const course = id ? getCourseById(id) : undefined;

  useEffect(() => {
    const tabParam = searchParams.get('tab');
    if (tabParam && ['overview', 'curriculum', 'reviews'].includes(tabParam)) {
      setActiveTab(tabParam);
    }
  }, [searchParams]);

  if (!course) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold mb-4">Course not found</h2>
          <Button asChild>
            <Link to="/courses">Back to Courses</Link>
          </Button>
        </div>
      </div>
    );
  }

  const handleAddToCart = () => {
    if (isInCart(course.id)) {
      toast({
        title: "Already in cart",
        description: "This course is already in your cart.",
        variant: "default"
      });
      return;
    }

    addToCart(course);
    toast({
      title: "Added to cart",
      description: `${course.title} has been added to your cart.`,
      variant: "default"
    });
  };

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
    }).format(price);
  };

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

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <div className="bg-gradient-hero text-white">
        <div className="container mx-auto px-4 py-8">
          <Button variant="ghost" asChild className="mb-6 text-white hover:bg-white/20">
            <Link to="/courses">
              <ChevronLeft className="h-4 w-4 mr-2" />
              Back to Courses
            </Link>
          </Button>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Course Info */}
            <div className="lg:col-span-2">
              <div className="mb-4">
                <Badge className={getLevelColor(course.level)}>
                  {course.level}
                </Badge>
              </div>
              
              <h1 className="text-4xl font-bold mb-4">{course.title}</h1>
              <p className="text-xl text-white/90 mb-6">{course.description}</p>

              <div className="flex items-center gap-6 text-white/80 mb-6">
                <div className="flex items-center gap-2">
                  <Star className="h-5 w-5 fill-yellow-400 text-yellow-400" />
                  <span className="font-medium">{course.rating}</span>
                  <span>({course.reviews} reviews)</span>
                </div>
                <div className="flex items-center gap-2">
                  <Clock className="h-5 w-5" />
                  <span>{course.duration}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Users className="h-5 w-5" />
                  <span>{course.reviews} students</span>
                </div>
              </div>

              <div className="flex items-center gap-3 text-white/80">
                <span>Created by</span>
                <span className="font-semibold text-white">{course.instructor}</span>
              </div>
            </div>

            {/* Video Preview */}
            <div className="lg:col-span-1">
              <div className="bg-black rounded-lg overflow-hidden shadow-glow">
                <VideoPlayer
                  src={course.videoUrl}
                  title="Course Preview"
                  poster={course.thumbnail}
                />
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2">
            <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
              <TabsList className="grid w-full grid-cols-3">
                <TabsTrigger value="overview">Overview</TabsTrigger>
                <TabsTrigger value="curriculum">Curriculum</TabsTrigger>
                <TabsTrigger value="reviews">Reviews</TabsTrigger>
              </TabsList>

              <TabsContent value="overview" className="mt-6">
                <div className="space-y-6">
                  {/* What you'll learn */}
                  <Card>
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2">
                        <Target className="h-5 w-5" />
                        What you'll learn
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <ul className="grid grid-cols-1 md:grid-cols-2 gap-3">
                        {[
                          'Master the fundamentals and advanced concepts',
                          'Build real-world projects from scratch',
                          'Learn industry best practices',
                          'Get hands-on experience with tools',
                          'Understand modern development workflows',
                          'Apply knowledge to solve complex problems'
                        ].map((item, index) => (
                          <li key={index} className="flex items-start gap-3">
                            <Check className="h-5 w-5 text-accent mt-0.5 flex-shrink-0" />
                            <span>{item}</span>
                          </li>
                        ))}
                      </ul>
                    </CardContent>
                  </Card>

                  {/* Course requirements */}
                  <Card>
                    <CardHeader>
                      <CardTitle>Requirements</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <ul className="space-y-2">
                        <li>• Basic computer skills</li>
                        <li>• Access to a computer with internet connection</li>
                        <li>• Willingness to learn and practice</li>
                        <li>• No prior experience required</li>
                      </ul>
                    </CardContent>
                  </Card>

                  {/* Course tags */}
                  <div>
                    <h3 className="font-semibold mb-3">Topics covered:</h3>
                    <div className="flex flex-wrap gap-2">
                      {course.tags.map((tag, index) => (
                        <Badge key={index} variant="secondary">
                          {tag}
                        </Badge>
                      ))}
                    </div>
                  </div>
                </div>
              </TabsContent>

              <TabsContent value="curriculum" className="mt-6">
                {course.enrolled ? (
                  <div className="space-y-6">
                    {/* Video Player for Enrolled Students */}
                    <Card>
                      <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                          <Play className="h-5 w-5" />
                          {course.lessons[currentLesson]?.title || 'Select a lesson'}
                        </CardTitle>
                        <p className="text-muted-foreground">
                          Lesson {currentLesson + 1} of {course.lessons.length}
                        </p>
                      </CardHeader>
                      <CardContent>
                        <div className="aspect-video bg-black rounded-lg overflow-hidden shadow-glow">
                          <VideoPlayer
                            src={course.videoUrl} // In a real app, this would be course.lessons[currentLesson].videoUrl
                            title={course.lessons[currentLesson]?.title || 'Course Lesson'}
                            onTimeUpdate={(currentTime, duration) => {
                              // Track progress here
                              console.log(`Progress: ${(currentTime/duration)*100}%`);
                            }}
                            onEnded={() => {
                              // Mark lesson as completed and advance to next
                              console.log('Lesson completed');
                            }}
                          />
                        </div>
                        <div className="mt-4 flex justify-between items-center">
                          <Button 
                            variant="outline" 
                            disabled={currentLesson === 0}
                            onClick={() => setCurrentLesson(Math.max(0, currentLesson - 1))}
                          >
                            Previous Lesson
                          </Button>
                          <Button 
                            disabled={currentLesson === course.lessons.length - 1}
                            onClick={() => setCurrentLesson(Math.min(course.lessons.length - 1, currentLesson + 1))}
                            className="bg-gradient-primary text-white"
                          >
                            Next Lesson
                          </Button>
                        </div>
                      </CardContent>
                    </Card>

                    {/* Lesson List */}
                    <Card>
                      <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                          <BookOpen className="h-5 w-5" />
                          Course Content
                        </CardTitle>
                        <p className="text-muted-foreground">
                          {course.lessons.length} lessons • {course.duration} total length
                        </p>
                      </CardHeader>
                      <CardContent>
                        <div className="space-y-3">
                          {course.lessons.map((lesson, index) => (
                            <div
                              key={lesson.id}
                              className={`flex items-center justify-between p-4 rounded-lg border transition-colors cursor-pointer hover:bg-muted/50 ${
                                currentLesson === index ? 'bg-primary/10 border-primary' : ''
                              }`}
                              onClick={() => setCurrentLesson(index)}
                            >
                              <div className="flex items-center gap-3">
                                <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
                                  lesson.completed ? 'bg-accent text-white' : currentLesson === index ? 'bg-primary text-white' : 'bg-muted'
                                }`}>
                                  {lesson.completed ? (
                                    <Check className="h-4 w-4" />
                                  ) : (
                                    <Play className="h-4 w-4" />
                                  )}
                                </div>
                                <div>
                                  <h4 className="font-medium">{lesson.title}</h4>
                                  <p className="text-sm text-muted-foreground">Lesson {index + 1}</p>
                                </div>
                              </div>
                              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                                <Clock className="h-4 w-4" />
                                <span>{lesson.duration}</span>
                              </div>
                            </div>
                          ))}
                        </div>
                      </CardContent>
                    </Card>
                  </div>
                ) : (
                  // Non-enrolled users see a preview of the curriculum
                  <Card>
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2">
                        <BookOpen className="h-5 w-5" />
                        Course Content
                      </CardTitle>
                      <p className="text-muted-foreground">
                        {course.lessons.length} lessons • {course.duration} total length
                      </p>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-3">
                        {course.lessons.map((lesson, index) => (
                          <div
                            key={lesson.id}
                            className="flex items-center justify-between p-4 rounded-lg border opacity-75"
                          >
                            <div className="flex items-center gap-3">
                              <div className="w-8 h-8 rounded-full flex items-center justify-center bg-muted">
                                <Play className="h-4 w-4" />
                              </div>
                              <div>
                                <h4 className="font-medium">{lesson.title}</h4>
                                <p className="text-sm text-muted-foreground">Lesson {index + 1}</p>
                              </div>
                            </div>
                            <div className="flex items-center gap-2 text-sm text-muted-foreground">
                              <Clock className="h-4 w-4" />
                              <span>{lesson.duration}</span>
                            </div>
                          </div>
                        ))}
                      </div>
                      <div className="mt-4 p-4 bg-muted/50 rounded-lg text-center">
                        <p className="text-muted-foreground mb-2">Enroll in this course to access all lessons</p>
                        <Button className="bg-gradient-primary text-white">
                          <ShoppingCart className="h-4 w-4 mr-2" />
                          Enroll Now
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                )}
              </TabsContent>

              <TabsContent value="reviews" className="mt-6">
                <Card>
                  <CardHeader>
                    <CardTitle>Student Reviews</CardTitle>
                    <div className="flex items-center gap-4">
                      <div className="flex items-center gap-2">
                        <Star className="h-5 w-5 fill-yellow-400 text-yellow-400" />
                        <span className="text-2xl font-bold">{course.rating}</span>
                      </div>
                      <div className="text-muted-foreground">
                        Based on {course.reviews} reviews
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      {/* Rating breakdown */}
                      {[5, 4, 3, 2, 1].map((stars) => (
                        <div key={stars} className="flex items-center gap-4">
                          <div className="flex items-center gap-1 w-20">
                            {Array.from({ length: 5 }).map((_, i) => (
                              <Star
                                key={i}
                                className={`h-4 w-4 ${
                                  i < stars ? 'fill-yellow-400 text-yellow-400' : 'text-muted-foreground'
                                }`}
                              />
                            ))}
                          </div>
                          <Progress value={stars === 5 ? 80 : stars === 4 ? 15 : 5} className="flex-1" />
                          <span className="text-sm text-muted-foreground w-12">
                            {stars === 5 ? '80%' : stars === 4 ? '15%' : '5%'}
                          </span>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>
            </Tabs>
          </div>

          {/* Purchase Card */}
          <div className="lg:col-span-1">
            <Card className="sticky top-8">
              <CardContent className="p-6">
                <div className="mb-6">
                  <div className="flex items-center gap-3 mb-4">
                    <span className="text-3xl font-bold text-primary">
                      {formatPrice(course.price)}
                    </span>
                    {course.originalPrice && (
                      <span className="text-lg text-muted-foreground line-through">
                        {formatPrice(course.originalPrice)}
                      </span>
                    )}
                  </div>

                  {course.originalPrice && (
                    <Badge className="bg-destructive text-white">
                      {Math.round(((course.originalPrice - course.price) / course.originalPrice) * 100)}% OFF
                    </Badge>
                  )}
                </div>

                <div className="space-y-3 mb-6">
                  {course.enrolled ? (
                    <div className="space-y-3">
                      <div className="text-sm font-medium flex items-center justify-between">
                        <span>Your Progress</span>
                        <span>{course.progress}%</span>
                      </div>
                      <Progress value={course.progress} />
                      <Button 
                        className="w-full bg-gradient-primary text-white" 
                        size="lg"
                        onClick={() => setActiveTab('curriculum')}
                      >
                        <Play className="h-4 w-4 mr-2" />
                        Continue Learning
                      </Button>
                    </div>
                  ) : (
                    <Button 
                      onClick={handleAddToCart}
                      className={`w-full ${isInCart(course.id) ? 'bg-accent' : 'bg-gradient-primary'} text-white`}
                      size="lg"
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
                  )}

                  <div className="flex gap-2">
                    <Button variant="outline" className="flex-1">
                      <Share className="h-4 w-4 mr-2" />
                      Share
                    </Button>
                    <Button variant="outline" className="flex-1">
                      <Download className="h-4 w-4 mr-2" />
                      Wishlist
                    </Button>
                  </div>
                </div>

                <div className="text-sm text-center text-muted-foreground">
                  30-Day Money-Back Guarantee
                </div>

                {/* Course includes */}
                <div className="mt-6 pt-6 border-t">
                  <h4 className="font-semibold mb-3">This course includes:</h4>
                  <ul className="space-y-2 text-sm">
                    <li className="flex items-center gap-2">
                      <Clock className="h-4 w-4 text-muted-foreground" />
                      {course.duration} on-demand video
                    </li>
                    <li className="flex items-center gap-2">
                      <Download className="h-4 w-4 text-muted-foreground" />
                      Downloadable resources
                    </li>
                    <li className="flex items-center gap-2">
                      <Globe className="h-4 w-4 text-muted-foreground" />
                      Access on mobile and desktop
                    </li>
                    <li className="flex items-center gap-2">
                      <Award className="h-4 w-4 text-muted-foreground" />
                      Certificate of completion
                    </li>
                  </ul>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CourseDetail;