-- Create function to update course rating when reviews are added/updated/deleted
CREATE OR REPLACE FUNCTION update_course_rating()
RETURNS TRIGGER AS $$
BEGIN
  -- Update the course rating and review count
  UPDATE courses 
  SET 
    rating = (
      SELECT COALESCE(AVG(rating), 0)
      FROM course_reviews 
      WHERE course_id = COALESCE(NEW.course_id, OLD.course_id)
    ),
    reviews_count = (
      SELECT COUNT(*)
      FROM course_reviews 
      WHERE course_id = COALESCE(NEW.course_id, OLD.course_id)
    )
  WHERE id = COALESCE(NEW.course_id, OLD.course_id);
  
  RETURN COALESCE(NEW, OLD);
END;
$$ LANGUAGE plpgsql SECURITY DEFINER SET search_path = public;

-- Create triggers for course rating updates
CREATE TRIGGER update_course_rating_on_insert
  AFTER INSERT ON course_reviews
  FOR EACH ROW
  EXECUTE FUNCTION update_course_rating();

CREATE TRIGGER update_course_rating_on_update
  AFTER UPDATE ON course_reviews
  FOR EACH ROW
  EXECUTE FUNCTION update_course_rating();

CREATE TRIGGER update_course_rating_on_delete
  AFTER DELETE ON course_reviews
  FOR EACH ROW
  EXECUTE FUNCTION update_course_rating();