-- Add sample course reviews for testing
INSERT INTO course_reviews (user_id, course_id, rating, comment) VALUES 
  ('00000000-0000-0000-0000-000000000001', '507700a7-0464-43e0-8445-f608b11b5bd2', 5, 'Excellent course! Really helped me understand React fundamentals.'),
  ('00000000-0000-0000-0000-000000000002', '507700a7-0464-43e0-8445-f608b11b5bd2', 4, 'Good content but could use more practical examples.'),
  ('00000000-0000-0000-0000-000000000003', 'b4dd3a95-4f6b-4c8a-9f8e-7c3d9b2a1e5f', 5, 'Amazing instructor and clear explanations!'),
  ('00000000-0000-0000-0000-000000000004', 'b4dd3a95-4f6b-4c8a-9f8e-7c3d9b2a1e5f', 3, 'Decent course but feels a bit outdated.');

-- Update courses table with more realistic rating and review counts based on sample data
UPDATE courses SET 
  rating = CASE 
    WHEN id = '507700a7-0464-43e0-8445-f608b11b5bd2' THEN 4.5
    WHEN id = 'b4dd3a95-4f6b-4c8a-9f8e-7c3d9b2a1e5f' THEN 4.0
    ELSE rating
  END,
  reviews_count = CASE
    WHEN id = '507700a7-0464-43e0-8445-f608b11b5bd2' THEN 2
    WHEN id = 'b4dd3a95-4f6b-4c8a-9f8e-7c3d9b2a1e5f' THEN 2
    ELSE 0
  END;

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