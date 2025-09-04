import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Textarea } from '@/components/ui/textarea';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { useToast } from '@/hooks/use-toast';
import { useAuth } from '@/hooks/useAuth';
import { useReviews, Review } from '@/hooks/useReviews';
import { Star, MessageSquare, ThumbsUp, Edit2, Trash2 } from 'lucide-react';
import { format } from 'date-fns';

interface ReviewSectionProps {
  courseId: string;
  averageRating: number;
  totalReviews: number;
}

const ReviewSection = ({ courseId, averageRating, totalReviews }: ReviewSectionProps) => {
  const { user } = useAuth();
  const { reviews, loading, addReview, updateReview, deleteReview } = useReviews(courseId);
  const { toast } = useToast();
  const [showAddReview, setShowAddReview] = useState(false);
  const [rating, setRating] = useState(0);
  const [comment, setComment] = useState('');
  const [editingReview, setEditingReview] = useState<Review | null>(null);
  const [submitting, setSubmitting] = useState(false);

  const userReview = reviews.find(review => review.user_id === user?.id);
  const canAddReview = user && !userReview;

  const handleSubmitReview = async () => {
    if (!rating) {
      toast({
        title: "Rating required",
        description: "Please select a rating before submitting.",
        variant: "destructive"
      });
      return;
    }

    setSubmitting(true);
    
    let result;
    if (editingReview) {
      result = await updateReview(editingReview.id, rating, comment);
    } else {
      result = await addReview(rating, comment);
    }

    if (result.error) {
      toast({
        title: "Error",
        description: result.error,
        variant: "destructive"
      });
    } else {
      toast({
        title: "Success",
        description: editingReview ? "Review updated!" : "Review added!",
      });
      setShowAddReview(false);
      setEditingReview(null);
      setRating(0);
      setComment('');
    }
    
    setSubmitting(false);
  };

  const handleEditReview = (review: Review) => {
    setEditingReview(review);
    setRating(review.rating);
    setComment(review.comment || '');
    setShowAddReview(true);
  };

  const handleDeleteReview = async (reviewId: string) => {
    if (!window.confirm('Are you sure you want to delete this review?')) {
      return;
    }

    const result = await deleteReview(reviewId);
    if (result.error) {
      toast({
        title: "Error",
        description: result.error,
        variant: "destructive"
      });
    } else {
      toast({
        title: "Success",
        description: "Review deleted!",
      });
    }
  };

  const renderStars = (value: number, interactive = false, size = 'sm') => {
    const starSize = size === 'lg' ? 'h-6 w-6' : 'h-4 w-4';
    return (
      <div className="flex items-center gap-1">
        {[1, 2, 3, 4, 5].map((star) => (
          <Star
            key={star}
            className={`${starSize} ${
              star <= value
                ? 'fill-yellow-400 text-yellow-400'
                : 'text-muted-foreground'
            } ${interactive ? 'cursor-pointer hover:scale-110 transition-transform' : ''}`}
            onClick={interactive ? () => setRating(star) : undefined}
          />
        ))}
      </div>
    );
  };

  return (
    <div className="space-y-6">
      {/* Rating Overview */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <MessageSquare className="h-5 w-5" />
            Reviews & Ratings
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center gap-6 mb-6">
            <div className="text-center">
              <div className="text-4xl font-bold text-primary mb-2">
                {averageRating.toFixed(1)}
              </div>
              {renderStars(Math.round(averageRating), false, 'lg')}
              <div className="text-sm text-muted-foreground mt-1">
                {totalReviews} review{totalReviews !== 1 ? 's' : ''}
              </div>
            </div>
            
            {/* Rating Distribution */}
            <div className="flex-1 space-y-2">
              {[5, 4, 3, 2, 1].map((stars) => {
                const count = reviews.filter(r => r.rating === stars).length;
                const percentage = totalReviews > 0 ? (count / totalReviews) * 100 : 0;
                return (
                  <div key={stars} className="flex items-center gap-2 text-sm">
                    <span className="w-8">{stars}</span>
                    <Star className="h-3 w-3 fill-yellow-400 text-yellow-400" />
                    <div className="flex-1 bg-muted rounded-full h-2">
                      <div 
                        className="bg-primary h-full rounded-full transition-all"
                        style={{ width: `${percentage}%` }}
                      />
                    </div>
                    <span className="w-8 text-muted-foreground">{count}</span>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Add Review Button */}
          {canAddReview && (
            <Button
              onClick={() => setShowAddReview(true)}
              className="w-full"
              variant="outline"
            >
              <Star className="h-4 w-4 mr-2" />
              Write a Review
            </Button>
          )}

          {/* Add/Edit Review Form */}
          {showAddReview && (
            <div className="mt-6 p-4 border rounded-lg bg-muted/20">
              <div className="mb-4">
                <label className="text-sm font-medium mb-2 block">Rating</label>
                {renderStars(rating, true, 'lg')}
              </div>
              
              <div className="mb-4">
                <label className="text-sm font-medium mb-2 block">Comment (optional)</label>
                <Textarea
                  placeholder="Share your experience with this course..."
                  value={comment}
                  onChange={(e) => setComment(e.target.value)}
                  rows={3}
                />
              </div>

              <div className="flex gap-2">
                <Button
                  onClick={handleSubmitReview}
                  disabled={submitting || !rating}
                >
                  {submitting ? 'Submitting...' : editingReview ? 'Update Review' : 'Submit Review'}
                </Button>
                <Button
                  variant="outline"
                  onClick={() => {
                    setShowAddReview(false);
                    setEditingReview(null);
                    setRating(0);
                    setComment('');
                  }}
                >
                  Cancel
                </Button>
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Reviews List */}
      {reviews.length > 0 && (
        <div className="space-y-4">
          {reviews.map((review) => (
            <Card key={review.id}>
              <CardContent className="p-4">
                <div className="flex items-start gap-3">
                  <Avatar className="h-10 w-10">
                    <AvatarImage src={review.profiles?.avatar_url || review.profile?.avatar_url || undefined} />
                    <AvatarFallback>
                      {review.profiles?.first_name?.[0] || review.profile?.first_name?.[0] || 'U'}
                    </AvatarFallback>
                  </Avatar>
                  
                  <div className="flex-1">
                    <div className="flex items-center justify-between mb-2">
                      <div>
                        <div className="font-medium">
                          {(review.profiles?.first_name && review.profiles?.last_name)
                            ? `${review.profiles.first_name} ${review.profiles.last_name}`
                            : (review.profile?.first_name && review.profile?.last_name)
                            ? `${review.profile.first_name} ${review.profile.last_name}`
                            : 'Anonymous User'
                          }
                        </div>
                        <div className="flex items-center gap-2 text-sm text-muted-foreground">
                          {renderStars(review.rating)}
                          <span>•</span>
                          <span>{format(new Date(review.created_at), 'MMM d, yyyy')}</span>
                        </div>
                      </div>
                      
                      {review.user_id === user?.id && (
                        <div className="flex gap-1">
                          <Button
                            size="sm"
                            variant="ghost"
                            onClick={() => handleEditReview(review)}
                          >
                            <Edit2 className="h-3 w-3" />
                          </Button>
                          <Button
                            size="sm"
                            variant="ghost"
                            onClick={() => handleDeleteReview(review.id)}
                          >
                            <Trash2 className="h-3 w-3" />
                          </Button>
                        </div>
                      )}
                    </div>
                    
                    {review.comment && (
                      <p className="text-muted-foreground">{review.comment}</p>
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      {loading && (
        <div className="text-center py-8">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto"></div>
        </div>
      )}
    </div>
  );
};

export default ReviewSection;