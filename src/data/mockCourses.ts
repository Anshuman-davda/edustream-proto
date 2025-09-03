export interface Course {
  id: string;
  title: string;
  description: string;
  instructor: string;
  price: number;
  originalPrice?: number;
  duration: string;
  level: 'Beginner' | 'Intermediate' | 'Advanced';
  category: string;
  rating: number;
  reviews: number;
  thumbnail: string;
  videoUrl: string;
  audioUrl?: string;
  lessons: Lesson[];
  tags: string[];
  enrolled?: boolean;
  progress?: number;
}

export interface Lesson {
  id: string;
  title: string;
  duration: string;
  videoUrl: string;
  completed?: boolean;
}

export const mockCourses: Course[] = [
  {
    id: '353da616-df8d-4f02-9553-bce4429ef71d',
    title: 'Complete React Development Bootcamp',
    description: 'Master React from basics to advanced concepts including hooks, context, Redux, and modern development practices.',
    instructor: 'Sarah Johnson',
    price: 89.99,
    originalPrice: 199.99,
    duration: '42 hours',
    level: 'Intermediate',
    category: 'Web Development',
    rating: 4.8,
    reviews: 2340,
    thumbnail: 'https://images.unsplash.com/photo-1633356122544-f134324a6cee?w=800&h=450&fit=crop',
    videoUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4',
    lessons: [
      { id: '1-1', title: 'Introduction to React', duration: '15:30', videoUrl: '#' },
      { id: '1-2', title: 'Setting up Development Environment', duration: '12:45', videoUrl: '#' },
      { id: '1-3', title: 'Your First React Component', duration: '18:20', videoUrl: '#' },
    ],
    tags: ['React', 'JavaScript', 'Frontend', 'Web Development']
  },
  {
    id: '507700a7-0464-43e0-8445-f608b11b5bd2',
    title: 'Data Science with Python',
    description: 'Learn data science fundamentals, pandas, numpy, matplotlib, and machine learning with real-world projects.',
    instructor: 'Dr. Michael Chen',
    price: 119.99,
    originalPrice: 249.99,
    duration: '68 hours',
    level: 'Beginner',
    category: 'Data Science',
    rating: 4.9,
    reviews: 1876,
    thumbnail: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=800&h=450&fit=crop',
    videoUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ElephantsDream.mp4',
    audioUrl: 'https://www.soundjay.com/misc/sounds/bell-ringing-05.wav',
    lessons: [
      { id: '2-1', title: 'Python Basics for Data Science', duration: '22:15', videoUrl: '#' },
      { id: '2-2', title: 'Introduction to Pandas', duration: '28:30', videoUrl: '#' },
      { id: '2-3', title: 'Data Visualization with Matplotlib', duration: '35:45', videoUrl: '#' },
    ],
    tags: ['Python', 'Data Science', 'Machine Learning', 'Analytics'],
    enrolled: true,
    progress: 65
  },
  {
    id: 'a2bfbb6c-4f00-454a-acca-35047b067bf7',
    title: 'UX/UI Design Masterclass',
    description: 'Complete guide to user experience and user interface design with Figma, from wireframes to prototypes.',
    instructor: 'Emma Rodriguez',
    price: 79.99,
    duration: '35 hours',
    level: 'Beginner',
    category: 'Design',
    rating: 4.7,
    reviews: 892,
    thumbnail: 'https://images.unsplash.com/photo-1561070791-2526d30994b5?w=800&h=450&fit=crop',
    videoUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4',
    lessons: [
      { id: '3-1', title: 'Design Thinking Process', duration: '20:10', videoUrl: '#' },
      { id: '3-2', title: 'User Research Methods', duration: '25:35', videoUrl: '#' },
      { id: '3-3', title: 'Wireframing in Figma', duration: '30:20', videoUrl: '#' },
    ],
    tags: ['UX', 'UI', 'Design', 'Figma'],
    enrolled: true,
    progress: 25
  },
  {
    id: '1c76035b-2591-4163-8bfc-b9a3fab070f7',
    title: 'Digital Marketing Strategy',
    description: 'Master digital marketing including SEO, social media, email marketing, and conversion optimization.',
    instructor: 'James Wilson',
    price: 99.99,
    originalPrice: 179.99,
    duration: '28 hours',
    level: 'Intermediate',
    category: 'Marketing',
    rating: 4.6,
    reviews: 1523,
    thumbnail: 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=800&h=450&fit=crop',
    videoUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerEscapes.mp4',
    lessons: [
      { id: '4-1', title: 'Digital Marketing Fundamentals', duration: '18:45', videoUrl: '#' },
      { id: '4-2', title: 'SEO Best Practices', duration: '32:15', videoUrl: '#' },
      { id: '4-3', title: 'Social Media Strategy', duration: '24:50', videoUrl: '#' },
    ],
    tags: ['Marketing', 'SEO', 'Social Media', 'Analytics']
  },
  {
    id: '9c0598a4-b504-4d92-bc57-19cbee5d21cf',
    title: 'Mobile App Development with Flutter',
    description: 'Build cross-platform mobile apps with Flutter and Dart, from basic widgets to complex applications.',
    instructor: 'Alex Kumar',
    price: 109.99,
    duration: '55 hours',
    level: 'Advanced',
    category: 'Mobile Development',
    rating: 4.8,
    reviews: 967,
    thumbnail: 'https://images.unsplash.com/photo-1512941937669-90a1b58e7e9c?w=800&h=450&fit=crop',
    videoUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerFun.mp4',
    lessons: [
      { id: '5-1', title: 'Flutter Introduction', duration: '16:30', videoUrl: '#' },
      { id: '5-2', title: 'Dart Programming Basics', duration: '28:15', videoUrl: '#' },
      { id: '5-3', title: 'Building Your First App', duration: '35:45', videoUrl: '#' },
    ],
    tags: ['Flutter', 'Dart', 'Mobile', 'Cross-platform']
  },
  {
    id: 'e06cf01f-1f32-405f-88eb-c471f7fe4881',
    title: 'Blockchain and Cryptocurrency',
    description: 'Understand blockchain technology, cryptocurrency, smart contracts, and decentralized applications.',
    instructor: 'Lisa Park',
    price: 149.99,
    originalPrice: 299.99,
    duration: '45 hours',
    level: 'Advanced',
    category: 'Technology',
    rating: 4.7,
    reviews: 743,
    thumbnail: 'https://images.unsplash.com/photo-1639762681485-074b7f938ba0?w=800&h=450&fit=crop',
    videoUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerJoyrides.mp4',
    lessons: [
      { id: '6-1', title: 'Blockchain Fundamentals', duration: '25:20', videoUrl: '#' },
      { id: '6-2', title: 'Cryptocurrency Basics', duration: '22:10', videoUrl: '#' },
      { id: '6-3', title: 'Smart Contract Development', duration: '40:15', videoUrl: '#' },
    ],
    tags: ['Blockchain', 'Cryptocurrency', 'Smart Contracts', 'Web3']
  }
];

export const categories = [
  'All',
  'Web Development',
  'Data Science',
  'Design',
  'Marketing',
  'Mobile Development',
  'Technology'
];

export const getUserEnrolledCourses = () => {
  return mockCourses.filter(course => course.enrolled);
};

export const getCourseById = (id: string): Course | undefined => {
  return mockCourses.find(course => course.id === id);
};