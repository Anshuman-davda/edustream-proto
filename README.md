# EduStream - Online Learning Platform

EduStream is a modern, full-stack online learning platform built with React, TypeScript, and Supabase. It provides a comprehensive solution for course management, user authentication, progress tracking, and interactive learning experiences.

## 🚀 Features

### Core Features
- **User Authentication**: Secure signup/login with Supabase Auth
- **Course Management**: Browse, search, and filter courses by category
- **Video Learning**: Integrated video player with progress tracking
- **User Dashboard**: Track enrolled courses and learning progress
- **Shopping Cart**: Add courses and manage purchases
- **Responsive Design**: Mobile-first approach with Tailwind CSS

### Advanced Features
- **Progress Tracking**: Automatic lesson completion and course progress
- **User Profiles**: Customizable user profiles with enrollment history
- **Course Reviews**: Rate and review completed courses
- **Real-time Updates**: Live progress updates across devices
- **Protected Routes**: Secure authentication-required pages
- **Database Integration**: PostgreSQL database with Row Level Security

## 🛠️ Tech Stack

- **Frontend**: React 18, TypeScript, Vite
- **Styling**: Tailwind CSS, Shadcn/ui Components
- **Backend**: Supabase (PostgreSQL, Authentication, Real-time)
- **Routing**: React Router DOM
- **State Management**: React Hooks, Tanstack Query
- **UI Components**: Radix UI primitives
- **Icons**: Lucide React
- **Development**: ESLint, TypeScript strict mode

## 📦 Installation & Setup

### Prerequisites
- Node.js & npm installed - [install with nvm](https://github.com/nvm-sh/nvm#installing-and-updating)
- Supabase account (free tier available)

### Local Development

1. **Clone the repository**
   ```bash
   git clone <YOUR_GIT_URL>
   cd <YOUR_PROJECT_NAME>
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Environment Setup**
   The project is already connected to Supabase with project ID: `kagfzkphhezxljgqyjys`
   Environment variables are pre-configured in `.env`

4. **Database Setup**
   The database schema is already created with sample data including:
   - User profiles with automatic creation on signup
   - 6 sample courses with lessons
   - Complete enrollment and progress tracking system
   - Course reviews and ratings

5. **Start the development server**
   ```bash
   npm run dev
   ```

6. **Access the application**
   Open your browser and navigate to the local development URL shown in terminal

## 🗄️ Database Schema

The application uses a PostgreSQL database with the following main tables:

### Core Tables
- **profiles** - User profile information with auto-creation trigger
- **courses** - Course details and metadata (6 sample courses included)
- **lessons** - Individual course lessons with order and preview settings
- **enrollments** - User course enrollments with progress tracking
- **lesson_progress** - Individual lesson completion tracking
- **course_reviews** - User course ratings and reviews

### Sample Data Included
- **6 Featured Courses**: React, Data Science, UX/UI Design, Digital Marketing, Flutter, Blockchain
- **18 Lessons**: 3 lessons per course with proper ordering
- **Complete metadata**: Ratings, reviews, pricing, categories, tags
- **Sample thumbnails**: High-quality course images from Unsplash

### Security Features
- **Row Level Security (RLS)** on all tables
- **Automatic timestamps** with triggers
- **Foreign key constraints** for data integrity
- **Optimized indexes** for query performance
- **User isolation** - users can only access their own data

## 🔐 Authentication & Security

### Authentication Flow
1. User signs up with email/password and name
2. Automatic profile creation via database trigger
3. Email confirmation (configurable in Supabase)
4. Secure session management with Supabase Auth
5. Protected routes for dashboard and cart

### Security Features
- **Row Level Security (RLS)** policies on all tables
- **Protected routes** with authentication middleware
- **Secure API endpoints** with user context
- **Email verification** support
- **Session persistence** across browser sessions

## 🎯 Usage Guide

### For Students
1. **Sign Up/Login**: Create account or sign in at `/auth`
2. **Browse Courses**: Explore available courses on homepage and `/courses`
3. **Enroll**: Add courses to cart and complete enrollment
4. **Learn**: Watch video lessons and track progress
5. **Dashboard**: Monitor enrolled courses and progress at `/dashboard`

### Authentication States
- **Unauthenticated**: Can browse courses, must login to enroll
- **Authenticated**: Full access to dashboard, cart, and enrolled courses
- **Auto-redirect**: Logged-in users redirected from auth page

### Course Features
- **Course Details**: Full course information with curriculum
- **Video Player**: Integrated video playback
- **Progress Tracking**: Automatic progress updates
- **Continue Learning**: Resume from last watched lesson

## 🚀 Deployment

The application is ready for deployment on platforms like:

- **Vercel** (Recommended for React apps)
- **Netlify**
- **AWS Amplify**
- **Railway**

### Build Command
```bash
npm run build
```

### Database Connection
The Supabase database is already configured and accessible from any deployment environment using the provided credentials.

### Environment Variables
All necessary environment variables are included in the `.env` file and ready for production use.

## 🔧 Development

### Project Structure
```
src/
├── components/
│   ├── auth/           # Authentication components
│   ├── course/         # Course-related components
│   ├── layout/         # Navigation and layout
│   └── ui/            # Reusable UI components
├── hooks/             # Custom React hooks
│   ├── useAuth.ts     # Authentication management
│   ├── useCourses.ts  # Course data operations
│   └── useCart.ts     # Shopping cart logic
├── pages/             # Route components
├── integrations/      # Supabase configuration
└── lib/              # Utility functions
```

### Key Features Implemented
- **Real Authentication**: Working Supabase Auth integration
- **Live Database**: Real PostgreSQL with sample data
- **Progress Tracking**: Actual enrollment and progress storage
- **Protected Routes**: Authentication-required pages
- **Responsive Design**: Mobile-friendly interface
- **Error Handling**: Proper error states and loading indicators

## 🎨 Design System

The application uses a comprehensive design system with:
- **Semantic tokens** for colors and spacing
- **Gradient themes** with primary and accent colors
- **Component variants** for consistent styling
- **Dark/light mode** support (configurable)
- **Custom CSS variables** for theming

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📋 Future Enhancements

- [ ] Payment integration (Stripe/PayPal)
- [ ] Course certificates generation
- [ ] Live streaming capabilities
- [ ] Mobile app development
- [ ] Advanced analytics dashboard
- [ ] Multi-language support
- [ ] Offline course downloads
- [ ] Discussion forums per course
- [ ] Assignment submission system
- [ ] Instructor dashboard for course creation

## 🐛 Troubleshooting

### Common Issues
- **Email confirmation**: May be required based on Supabase settings
- **Video playback**: Requires HTTPS in production
- **Authentication**: Check Supabase project settings if login fails

### Development Tips
- Use browser dev tools to monitor network requests
- Check Supabase dashboard for real-time database updates
- Enable email confirmation in Supabase Auth settings for production

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- [Supabase](https://supabase.com/) for backend infrastructure
- [Shadcn/ui](https://ui.shadcn.com/) for beautiful UI components
- [Tailwind CSS](https://tailwindcss.com/) for styling system
- [Lucide](https://lucide.dev/) for icon library
- [Unsplash](https://unsplash.com/) for course thumbnail images

## 📞 Support

For support, please:
1. Check the troubleshooting section above
2. Review the Supabase dashboard for database issues
3. Open an issue on GitHub for bugs or feature requests

---

**Ready to start learning?** 🎓 The database is populated with sample courses and ready for immediate use!

Built with ❤️ using modern web technologies.