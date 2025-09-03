import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { Badge } from '@/components/ui/badge';
import { 
  ShoppingCart, 
  Trash2, 
  ArrowLeft, 
  CreditCard,
  Clock,
  Star
} from 'lucide-react';
import { useCart } from '@/hooks/useCart';
import { useEnrollments } from '@/hooks/useCourses';
import { useAuth } from '@/hooks/useAuth';
import { useToast } from '@/hooks/use-toast';

const Cart = () => {
  const { items, removeFromCart, getTotalPrice, clearCart } = useCart();
  const { toast } = useToast();
  const { user } = useAuth();
  const { enrollInCourse } = useEnrollments(user?.id);

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
    }).format(price);
  };

  const handleRemoveItem = (courseId: string, title: string) => {
    removeFromCart(courseId);
    toast({
      title: "Removed from cart",
      description: `${title} has been removed from your cart.`,
      variant: "default"
    });
  };

  const handleCheckout = async () => {
    if (items.length === 0) return;
    if (!user) {
      toast({
        title: "Not logged in",
        description: "Please log in to enroll in courses.",
        variant: "destructive"
      });
      return;
    }

    let successCount = 0;
    let failCount = 0;
    let errorMessages: string[] = [];
    for (const item of items) {
      const result = await enrollInCourse(item.course.id);
      if (!result.error) successCount++;
      else {
        failCount++;
        errorMessages.push('Error: ' + JSON.stringify(result));
        // For debugging
        // eslint-disable-next-line no-console
        console.error('Enroll error:', result);
      }
    }

    toast({
      title: "Checkout complete!",
      description: `Enrolled in ${successCount} course${successCount !== 1 ? 's' : ''}. ${failCount > 0 ? failCount + ' failed. ' + errorMessages.join(' | ') : ''}`,
      variant: failCount > 0 ? "destructive" : "default"
    });
    clearCart();
  };

  const totalOriginalPrice = items.reduce((total, item) => 
    total + (item.course.originalPrice || item.course.price), 0
  );
  const totalSavings = totalOriginalPrice - getTotalPrice();

  if (items.length === 0) {
    return (
      <div className="min-h-screen bg-background">
        <div className="container mx-auto px-4 py-8">
          <div className="text-center py-12">
            <div className="w-24 h-24 bg-muted rounded-full flex items-center justify-center mx-auto mb-6">
              <ShoppingCart className="h-12 w-12 text-muted-foreground" />
            </div>
            <h2 className="text-2xl font-bold mb-4">Your cart is empty</h2>
            <p className="text-muted-foreground mb-6">
              Discover amazing courses and start your learning journey today!
            </p>
            <Button asChild className="bg-gradient-primary text-white">
              <Link to="/courses">Browse Courses</Link>
            </Button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="flex items-center gap-4 mb-8">
          <Button variant="ghost" asChild>
            <Link to="/courses">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Continue Shopping
            </Link>
          </Button>
          <div>
            <h1 className="text-3xl font-bold">Shopping Cart</h1>
            <p className="text-muted-foreground">
              {items.length} course{items.length > 1 ? 's' : ''} in your cart
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Cart Items */}
          <div className="lg:col-span-2 space-y-4">
            {items.map((item, index) => (
              <Card key={item.course.id}>
                <CardContent className="p-6">
                  <div className="flex gap-4">
                    {/* Course Image */}
                    <div className="flex-shrink-0">
                      <img
                        src={item.course.thumbnail}
                        alt={item.course.title}
                        className="w-32 h-20 object-cover rounded-lg"
                      />
                    </div>

                    {/* Course Details */}
                    <div className="flex-1 min-w-0">
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <h3 className="font-semibold text-lg mb-1 line-clamp-2">
                            {item.course.title}
                          </h3>
                          <p className="text-sm text-muted-foreground mb-2">
                            by {item.course.instructor}
                          </p>
                          
                          <div className="flex items-center gap-4 text-sm text-muted-foreground mb-3">
                            <div className="flex items-center gap-1">
                              <Star className="h-3 w-3 fill-yellow-400 text-yellow-400" />
                              <span>{item.course.rating}</span>
                            </div>
                            <div className="flex items-center gap-1">
                              <Clock className="h-3 w-3" />
                              <span>{item.course.duration}</span>
                            </div>
                            <Badge variant="secondary" className="text-xs">
                              {item.course.level}
                            </Badge>
                          </div>
                        </div>

                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleRemoveItem(item.course.id, item.course.title)}
                          className="text-destructive hover:text-destructive"
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>

                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <span className="text-xl font-bold text-primary">
                            {formatPrice(item.course.price)}
                          </span>
                          {item.course.originalPrice && (
                            <span className="text-sm text-muted-foreground line-through">
                              {formatPrice(item.course.originalPrice)}
                            </span>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          {/* Order Summary */}
          <div className="lg:col-span-1">
            <Card className="sticky top-8">
              <CardHeader>
                <CardTitle>Order Summary</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span>Subtotal ({items.length} items):</span>
                    <span>{formatPrice(getTotalPrice())}</span>
                  </div>
                  
                  {totalSavings > 0 && (
                    <div className="flex justify-between text-accent">
                      <span>Total Savings:</span>
                      <span>-{formatPrice(totalSavings)}</span>
                    </div>
                  )}
                </div>

                <Separator />

                <div className="flex justify-between text-lg font-bold">
                  <span>Total:</span>
                  <span className="text-primary">{formatPrice(getTotalPrice())}</span>
                </div>

                <div className="space-y-3 pt-4">
                  <Button 
                    onClick={handleCheckout}
                    className="w-full bg-gradient-primary text-white"
                    size="lg"
                  >
                    <CreditCard className="h-4 w-4 mr-2" />
                    Checkout
                  </Button>

                  <div className="text-xs text-center text-muted-foreground">
                    30-Day Money-Back Guarantee
                  </div>
                </div>

                {/* Checkout Benefits */}
                <div className="pt-4 border-t space-y-2">
                  <h4 className="font-medium text-sm">What you'll get:</h4>
                  <ul className="text-sm text-muted-foreground space-y-1">
                    <li>• Lifetime access to courses</li>
                    <li>• Mobile and desktop access</li>
                    <li>• Certificate of completion</li>
                    <li>• 24/7 student support</li>
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

export default Cart;