import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardFooter } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { 
  Star, 
  Clock, 
  Users, 
  ShoppingCart, 
  Play,
  Check
} from 'lucide-react';
import { Course } from '@/data/mockCourses';
import { useCart } from '@/hooks/useCart';
import { useToast } from '@/hooks/use-toast';

interface CourseCardProps {
  course: Course;
  variant?: 'default' | 'enrolled';
}


interface CourseCardPropsFixed {
  course: any;
  enrolled: boolean;
  variant?: 'default' | 'enrolled';
}

const CourseCard = ({ course, enrolled, variant = 'default' }: CourseCardPropsFixed) => {
  if (!course) return null;

  const { addToCart, isInCart } = useCart();
  const { toast } = useToast();

  const handleAddToCart = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (enrolled) {
      toast({
        title: "Already Enrolled",
        description: "You are already enrolled in this course.",
        variant: "default"
      });
      return;
    }
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
    <Link to={`/course/${course.id}`}>
      <Card className="course-card group cursor-pointer h-full flex flex-col">
        <div className="relative overflow-hidden rounded-t-xl">
          <img
            src={course.thumbnail}
            alt={course.title}
            className="w-full h-48 object-cover group-hover:scale-105 transition-smooth"
          />
          {course.originalPrice && (
            <Badge className="absolute top-3 left-3 bg-destructive text-white">
              {Math.round(((course.originalPrice - course.price) / course.originalPrice) * 100)}% OFF
            </Badge>
          )}
          <Badge className={`absolute top-3 right-3 ${getLevelColor(course.level)}`}>
            {course.level}
          </Badge>
          {variant === 'enrolled' && (
            <div className="absolute inset-0 bg-black/20 flex items-center justify-center">
              <div className="bg-white/90 rounded-full p-3">
                <Play className="h-8 w-8 text-primary" />
              </div>
            </div>
          )}
        </div>

        <CardContent className="flex-1 p-6">
          <div className="mb-2">
            <Badge variant="secondary" className="text-xs">
              {course.category}
            </Badge>
          </div>
          
          <h3 className="font-semibold text-lg mb-2 line-clamp-2 group-hover:text-primary transition-colors">
            {course.title}
          </h3>
          
          <p className="text-muted-foreground text-sm mb-3 line-clamp-2">
            {course.description}
          </p>
          
          <div className="text-sm text-muted-foreground mb-3">
            by {course.instructor}
          </div>

          {variant === 'enrolled' && course.progress !== undefined && (
            <div className="mb-4">
              <div className="flex justify-between items-center mb-2">
                <span className="text-sm font-medium">Progress</span>
                <span className="text-sm text-muted-foreground">{course.progress}%</span>
              </div>
              <Progress value={course.progress} className="h-2" />
            </div>
          )}

          <div className="flex items-center gap-4 text-sm text-muted-foreground mb-4">
            <div className="flex items-center gap-1">
              <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
              <span>{course.rating}</span>
              <span>({course.reviews})</span>
            </div>
            <div className="flex items-center gap-1">
              <Clock className="h-4 w-4" />
              <span>{course.duration}</span>
            </div>
          </div>
        </CardContent>

        <CardFooter className="p-6 pt-0">
          <div className="flex items-center justify-between w-full">
            <div className="flex items-center gap-2">
              <span className="text-2xl font-bold text-primary">
                {formatPrice(course.price)}
              </span>
              {course.originalPrice && (
                <span className="text-lg text-muted-foreground line-through">
                  {formatPrice(course.originalPrice)}
                </span>
              )}
            </div>

            {variant === 'default' && !enrolled ? (
              <Button
                onClick={handleAddToCart}
                className={`${isInCart(course.id) ? 'bg-accent' : 'bg-gradient-primary'} text-white`}
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
            ) : (
              <Button className="bg-gradient-primary text-white">
                <Play className="h-4 w-4 mr-2" />
                Continue
              </Button>
            )}
          </div>
        </CardFooter>
      </Card>
    </Link>
  );
};

export default CourseCard;