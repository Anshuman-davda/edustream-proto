# EduStream - Online Learning Platform

A modern, responsive online learning platform built with React, TypeScript, and TailwindCSS.

## 🚀 Features Implemented

### ✅ Frontend Features (React + TailwindCSS)
- **Media Gallery & Playbook**: Custom HTML5 video/audio player with controls
- **Dark Mode Toggle**: TailwindCSS-based with localStorage persistence
- **Authentication UI**: Login/register forms with validation
- **Shopping Cart**: Add/remove courses with persistent localStorage
- **Dashboard & Analytics**: Progress tracking with Recharts visualizations
- **Course Catalog**: Browse, filter, and search courses
- **Responsive Design**: Mobile-first approach with TailwindCSS

### 🎨 Design System
- Modern educational theme with purple/blue gradients
- Semantic color tokens (no hardcoded colors)
- Smooth animations and transitions
- Professional typography and spacing
- Consistent component variants

### 📱 Pages & Components
- **Homepage**: Hero section, stats, features, CTA
- **Courses**: Browse with filters, search, and sorting
- **Course Detail**: Video player, curriculum, reviews
- **Dashboard**: Analytics charts, progress tracking
- **Shopping Cart**: Add/remove courses, checkout flow
- **Authentication**: Login/register with social auth UI
- **Navigation**: Sticky header with cart counter, dark mode toggle

## 🛠️ Technology Stack

### Frontend
- **React 18** - Modern React with hooks
- **TypeScript** - Type safety and better DX
- **TailwindCSS** - Utility-first CSS framework
- **Shadcn/UI** - High-quality component library
- **Recharts** - Data visualization for analytics
- **React Router** - Client-side routing
- **Lucide React** - Beautiful icons

### State Management
- **React Hooks** - useState, useEffect, custom hooks
- **LocalStorage** - Cart persistence and dark mode
- **Context API** - Theme and cart management

## 🏃‍♂️ Quick Start

### Prerequisites
- Node.js 18+ and npm

### Installation & Setup

1. **Clone the repository**
   ```bash
   git clone <your-repo-url>
   cd edustream-platform
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Start development server**
   ```bash
   npm run dev
   ```

4. **Open in browser**
   ```
   http://localhost:8080
   ```

### Available Scripts

```bash
# Development server
npm run dev

# Build for production
npm run build

# Preview production build
npm run preview

# Lint code
npm run lint

# Type checking
npm run type-check
```

## 📂 Project Structure

```
src/
├── components/
│   ├── ui/                 # Shadcn UI components
│   ├── layout/             # Navigation, footer
│   ├── course/             # Course-related components
│   └── media/              # Video/audio players
├── pages/
│   ├── Index.tsx           # Homepage
│   ├── Courses.tsx         # Course catalog
│   ├── CourseDetail.tsx    # Course details
│   ├── Dashboard.tsx       # User dashboard
│   ├── Cart.tsx           # Shopping cart
│   └── Auth.tsx           # Authentication
├── hooks/
│   ├── useCart.ts         # Cart management
│   └── use-toast.ts       # Toast notifications
├── data/
│   └── mockCourses.ts     # Sample course data
└── lib/
    └── utils.ts           # Utility functions
```

## 🎯 Key Features Explained

### 1. Media Player
- Custom HTML5 video player with advanced controls
- Progress tracking and seek functionality
- Volume control and fullscreen support
- Keyboard shortcuts and accessibility

### 2. Dark Mode
- System preference detection
- LocalStorage persistence
- Smooth transitions between themes
- All components properly themed

### 3. Shopping Cart
- Add/remove courses with visual feedback
- Persistent cart using localStorage
- Price calculations with discounts
- Responsive checkout flow

### 4. Dashboard Analytics
- Weekly learning hours chart (Bar chart)
- Skill distribution (Pie chart)
- Course progress tracking
- Enrollment statistics

### 5. Course Management
- Rich course cards with ratings
- Advanced filtering and search
- Category-based organization
- Progress indicators for enrolled courses

## 🎨 Design Highlights

- **Educational Theme**: Professional purple/blue gradient scheme
- **Semantic Tokens**: All colors defined in design system
- **Responsive**: Mobile-first approach
- **Animations**: Smooth transitions and hover effects
- **Accessibility**: ARIA labels and keyboard navigation
- **Performance**: Optimized images and lazy loading

## 🔧 Backend Requirements (Not Implemented - Frontend Only)

For a complete implementation, you would need:

### Laravel Backend (Suggested Structure)
```php
// Routes (api.php)
Route::middleware('auth:api')->group(function () {
    Route::get('/courses', [CourseController::class, 'index']);
    Route::get('/courses/{id}', [CourseController::class, 'show']);
    Route::post('/courses/{id}/enroll', [EnrollmentController::class, 'store']);
    Route::get('/user/dashboard', [DashboardController::class, 'index']);
});

// Controllers
class CourseController extends Controller {
    public function index(Request $request) {
        return Course::with(['instructor', 'categories'])
            ->when($request->search, fn($q) => $q->search($request->search))
            ->when($request->category, fn($q) => $q->byCategory($request->category))
            ->paginate(12);
    }
}

// Models
class Course extends Model {
    protected $fillable = [
        'title', 'description', 'price', 'duration', 
        'level', 'thumbnail', 'video_url'
    ];
    
    public function instructor() {
        return $this->belongsTo(User::class, 'instructor_id');
    }
}
```

### MongoDB Setup
```bash
# Install MongoDB
composer require jenssegers/mongodb

# Configure in config/database.php
'mongodb' => [
    'driver' => 'mongodb',
    'host' => env('DB_HOST', '127.0.0.1'),
    'port' => env('DB_PORT', 27017),
    'database' => env('DB_DATABASE', 'edustream'),
]
```

### JWT Authentication
```bash
# Install JWT package
composer require tymon/jwt-auth

# Configure JWT middleware
Route::middleware('jwt.auth')->group(function () {
    // Protected routes
});
```

## 🚀 Deployment

### Frontend (Vercel/Netlify)
1. Build the project: `npm run build`
2. Deploy the `dist` folder to your hosting platform
3. Configure routing for SPA

### Backend (Laravel)
1. Configure environment variables
2. Set up MongoDB connection
3. Deploy to cloud provider (AWS, DigitalOcean, etc.)
4. Configure CORS for frontend domain

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🤝 Contributing

1. Fork the repository
2. Create your feature branch
3. Commit your changes
4. Push to the branch
5. Create a Pull Request

## 📞 Support

For support and questions, please create an issue in the repository or contact the development team.

---

**Note**: This is a frontend prototype. The backend functionality (Laravel + MongoDB + JWT) would need to be implemented separately to create a fully functional application.