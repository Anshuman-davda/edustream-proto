-- Create profiles table for user data
CREATE TABLE public.profiles (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL UNIQUE REFERENCES auth.users(id) ON DELETE CASCADE,
  first_name TEXT,
  last_name TEXT,
  avatar_url TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create courses table
CREATE TABLE public.courses (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  title TEXT NOT NULL,
  description TEXT NOT NULL,
  instructor TEXT NOT NULL,
  price DECIMAL(10,2) NOT NULL DEFAULT 0,
  original_price DECIMAL(10,2),
  duration TEXT NOT NULL,
  level TEXT NOT NULL CHECK (level IN ('Beginner', 'Intermediate', 'Advanced')),
  category TEXT NOT NULL,
  rating DECIMAL(3,2) DEFAULT 0,
  reviews_count INTEGER DEFAULT 0,
  thumbnail_url TEXT,
  video_url TEXT,
  audio_url TEXT,
  tags TEXT[] DEFAULT '{}',
  is_published BOOLEAN DEFAULT false,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create lessons table
CREATE TABLE public.lessons (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  course_id UUID NOT NULL REFERENCES public.courses(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  description TEXT,
  duration TEXT NOT NULL,
  video_url TEXT,
  order_index INTEGER NOT NULL,
  is_preview BOOLEAN DEFAULT false,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create enrollments table
CREATE TABLE public.enrollments (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  course_id UUID NOT NULL REFERENCES public.courses(id) ON DELETE CASCADE,
  enrolled_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  completed_at TIMESTAMP WITH TIME ZONE,
  progress_percentage INTEGER DEFAULT 0 CHECK (progress_percentage >= 0 AND progress_percentage <= 100),
  UNIQUE(user_id, course_id)
);

-- Create lesson progress table
CREATE TABLE public.lesson_progress (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  lesson_id UUID NOT NULL REFERENCES public.lessons(id) ON DELETE CASCADE,
  enrollment_id UUID NOT NULL REFERENCES public.enrollments(id) ON DELETE CASCADE,
  completed_at TIMESTAMP WITH TIME ZONE,
  watch_time_seconds INTEGER DEFAULT 0,
  is_completed BOOLEAN DEFAULT false,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  UNIQUE(user_id, lesson_id)
);

-- Create course reviews table
CREATE TABLE public.course_reviews (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  course_id UUID NOT NULL REFERENCES public.courses(id) ON DELETE CASCADE,
  rating INTEGER NOT NULL CHECK (rating >= 1 AND rating <= 5),
  comment TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  UNIQUE(user_id, course_id)
);

-- Enable Row Level Security
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.courses ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.lessons ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.enrollments ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.lesson_progress ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.course_reviews ENABLE ROW LEVEL SECURITY;

-- Create RLS policies for profiles
CREATE POLICY "Users can view their own profile" ON public.profiles
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can update their own profile" ON public.profiles
  FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own profile" ON public.profiles
  FOR INSERT WITH CHECK (auth.uid() = user_id);

-- Create RLS policies for courses (public read access)
CREATE POLICY "Anyone can view published courses" ON public.courses
  FOR SELECT USING (is_published = true);

-- Create RLS policies for lessons (public read access for published courses)
CREATE POLICY "Anyone can view lessons from published courses" ON public.lessons
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM public.courses 
      WHERE courses.id = lessons.course_id 
      AND courses.is_published = true
    )
  );

-- Create RLS policies for enrollments
CREATE POLICY "Users can view their own enrollments" ON public.enrollments
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can create their own enrollments" ON public.enrollments
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own enrollments" ON public.enrollments
  FOR UPDATE USING (auth.uid() = user_id);

-- Create RLS policies for lesson progress
CREATE POLICY "Users can view their own lesson progress" ON public.lesson_progress
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can create their own lesson progress" ON public.lesson_progress
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own lesson progress" ON public.lesson_progress
  FOR UPDATE USING (auth.uid() = user_id);

-- Create RLS policies for course reviews
CREATE POLICY "Anyone can view course reviews" ON public.course_reviews
  FOR SELECT USING (true);

CREATE POLICY "Users can create their own reviews" ON public.course_reviews
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own reviews" ON public.course_reviews
  FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own reviews" ON public.course_reviews
  FOR DELETE USING (auth.uid() = user_id);

-- Create function to handle new user profiles
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.profiles (user_id, first_name, last_name)
  VALUES (
    NEW.id, 
    NEW.raw_user_meta_data ->> 'first_name',
    NEW.raw_user_meta_data ->> 'last_name'
  );
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Create trigger to automatically create profile on user signup
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- Create function to update updated_at timestamp
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create triggers for updated_at
CREATE TRIGGER update_profiles_updated_at
  BEFORE UPDATE ON public.profiles
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_courses_updated_at
  BEFORE UPDATE ON public.courses
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_lessons_updated_at
  BEFORE UPDATE ON public.lessons
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_lesson_progress_updated_at
  BEFORE UPDATE ON public.lesson_progress
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_course_reviews_updated_at
  BEFORE UPDATE ON public.course_reviews
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

-- Insert sample courses data
INSERT INTO public.courses (title, description, instructor, price, original_price, duration, level, category, rating, reviews_count, thumbnail_url, video_url, tags, is_published) VALUES
('Complete React Development Bootcamp', 'Master React from basics to advanced concepts including hooks, context, Redux, and modern development practices.', 'Sarah Johnson', 89.99, 199.99, '42 hours', 'Intermediate', 'Web Development', 4.8, 2340, 'https://images.unsplash.com/photo-1633356122544-f134324a6cee?w=800&h=450&fit=crop', 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4', ARRAY['React', 'JavaScript', 'Frontend', 'Web Development'], true),
('Data Science with Python', 'Learn data science fundamentals, pandas, numpy, matplotlib, and machine learning with real-world projects.', 'Dr. Michael Chen', 119.99, 249.99, '68 hours', 'Beginner', 'Data Science', 4.9, 1876, 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=800&h=450&fit=crop', 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ElephantsDream.mp4', ARRAY['Python', 'Data Science', 'Machine Learning', 'Analytics'], true),
('UX/UI Design Masterclass', 'Complete guide to user experience and user interface design with Figma, from wireframes to prototypes.', 'Emma Rodriguez', 79.99, NULL, '35 hours', 'Beginner', 'Design', 4.7, 892, 'https://images.unsplash.com/photo-1561070791-2526d30994b5?w=800&h=450&fit=crop', 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4', ARRAY['UX', 'UI', 'Design', 'Figma'], true),
('Digital Marketing Strategy', 'Master digital marketing including SEO, social media, email marketing, and conversion optimization.', 'James Wilson', 99.99, 179.99, '28 hours', 'Intermediate', 'Marketing', 4.6, 1523, 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=800&h=450&fit=crop', 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerEscapes.mp4', ARRAY['Marketing', 'SEO', 'Social Media', 'Analytics'], true),
('Mobile App Development with Flutter', 'Build cross-platform mobile apps with Flutter and Dart, from basic widgets to complex applications.', 'Alex Kumar', 109.99, NULL, '55 hours', 'Advanced', 'Mobile Development', 4.8, 967, 'https://images.unsplash.com/photo-1512941937669-90a1b58e7e9c?w=800&h=450&fit=crop', 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerFun.mp4', ARRAY['Flutter', 'Dart', 'Mobile', 'Cross-platform'], true),
('Blockchain and Cryptocurrency', 'Understand blockchain technology, cryptocurrency, smart contracts, and decentralized applications.', 'Lisa Park', 149.99, 299.99, '45 hours', 'Advanced', 'Technology', 4.7, 743, 'https://images.unsplash.com/photo-1639762681485-074b7f938ba0?w=800&h=450&fit=crop', 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerJoyrides.mp4', ARRAY['Blockchain', 'Cryptocurrency', 'Smart Contracts', 'Web3'], true);

-- Insert sample lessons for each course
INSERT INTO public.lessons (course_id, title, duration, video_url, order_index, is_preview) VALUES
-- React course lessons
((SELECT id FROM public.courses WHERE title = 'Complete React Development Bootcamp'), 'Introduction to React', '15:30', '#', 1, true),
((SELECT id FROM public.courses WHERE title = 'Complete React Development Bootcamp'), 'Setting up Development Environment', '12:45', '#', 2, false),
((SELECT id FROM public.courses WHERE title = 'Complete React Development Bootcamp'), 'Your First React Component', '18:20', '#', 3, false),

-- Data Science course lessons
((SELECT id FROM public.courses WHERE title = 'Data Science with Python'), 'Python Basics for Data Science', '22:15', '#', 1, true),
((SELECT id FROM public.courses WHERE title = 'Data Science with Python'), 'Introduction to Pandas', '28:30', '#', 2, false),
((SELECT id FROM public.courses WHERE title = 'Data Science with Python'), 'Data Visualization with Matplotlib', '35:45', '#', 3, false),

-- UX/UI course lessons
((SELECT id FROM public.courses WHERE title = 'UX/UI Design Masterclass'), 'Design Thinking Process', '20:10', '#', 1, true),
((SELECT id FROM public.courses WHERE title = 'UX/UI Design Masterclass'), 'User Research Methods', '25:35', '#', 2, false),
((SELECT id FROM public.courses WHERE title = 'UX/UI Design Masterclass'), 'Wireframing in Figma', '30:20', '#', 3, false),

-- Digital Marketing course lessons
((SELECT id FROM public.courses WHERE title = 'Digital Marketing Strategy'), 'Digital Marketing Fundamentals', '18:45', '#', 1, true),
((SELECT id FROM public.courses WHERE title = 'Digital Marketing Strategy'), 'SEO Best Practices', '32:15', '#', 2, false),
((SELECT id FROM public.courses WHERE title = 'Digital Marketing Strategy'), 'Social Media Strategy', '24:50', '#', 3, false),

-- Flutter course lessons
((SELECT id FROM public.courses WHERE title = 'Mobile App Development with Flutter'), 'Flutter Introduction', '16:30', '#', 1, true),
((SELECT id FROM public.courses WHERE title = 'Mobile App Development with Flutter'), 'Dart Programming Basics', '28:15', '#', 2, false),
((SELECT id FROM public.courses WHERE title = 'Mobile App Development with Flutter'), 'Building Your First App', '35:45', '#', 3, false),

-- Blockchain course lessons
((SELECT id FROM public.courses WHERE title = 'Blockchain and Cryptocurrency'), 'Blockchain Fundamentals', '25:20', '#', 1, true),
((SELECT id FROM public.courses WHERE title = 'Blockchain and Cryptocurrency'), 'Cryptocurrency Basics', '22:10', '#', 2, false),
((SELECT id FROM public.courses WHERE title = 'Blockchain and Cryptocurrency'), 'Smart Contract Development', '40:15', '#', 3, false);

-- Create indexes for better performance
CREATE INDEX idx_courses_category ON public.courses(category);
CREATE INDEX idx_courses_level ON public.courses(level);
CREATE INDEX idx_courses_published ON public.courses(is_published);
CREATE INDEX idx_lessons_course_id ON public.lessons(course_id);
CREATE INDEX idx_lessons_order ON public.lessons(course_id, order_index);
CREATE INDEX idx_enrollments_user_id ON public.enrollments(user_id);
CREATE INDEX idx_enrollments_course_id ON public.enrollments(course_id);
CREATE INDEX idx_lesson_progress_user_id ON public.lesson_progress(user_id);
CREATE INDEX idx_lesson_progress_lesson_id ON public.lesson_progress(lesson_id);
CREATE INDEX idx_course_reviews_course_id ON public.course_reviews(course_id);