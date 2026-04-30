# CommunityHub - Project Progress Report

## Project Overview

**CommunityHub** is a modern social community platform similar to Reddit where users can:
- Create and join communities
- Share posts with text and media
- Vote on posts and comments
- Interact with other users

---

## Technical Stack

### Frontend
- **Framework**: React 18 with TypeScript
- **Build Tool**: Vite
- **Styling**: Tailwind CSS with custom CSS variables
- **State Management**: React Query (TanStack Query) + Zustand
- **Form Handling**: React Hook Form with Zod validation
- **Routing**: React Router DOM
- **HTTP Client**: Axios
- **UI Components**: Custom components with Lucide icons
- **Notifications**: Sonner toast notifications

### Backend
- **Framework**: Spring Boot 3.x with Java 17
- **Security**: Spring Security with JWT authentication
- **Database**: MySQL
- **ORM**: JPA/Hibernate
- **File Storage**: Local storage with media support
- **Build Tool**: Maven

### Deployment
- **Frontend**: Vercel (Auto-deployment from GitHub)
- **Backend**: Railway (Auto-deployment from GitHub)
- **Version Control**: GitHub

---

## Features Implemented

### 1. User Authentication System

**Features:**
- User registration with email verification
- Secure login with JWT tokens
- Password encryption using BCrypt
- Protected routes for authenticated users
- Automatic token refresh
- Logout functionality

**Pages:**
- Login Page - Modern UI with gradient design
- Register Page - Form validation with error messages

### 2. Community Management

**Features:**
- View all communities in a grid layout
- Create custom communities (NEW)
- Search communities by name/description
- Community details with member count
- Visual community cards with icons and colors

**Database Structure:**
- Community entity with slug, name, description
- Rules, member count, accent color
- Creator tracking (who created the community)

**API Endpoints:**
- `GET /api/communities` - Get all communities
- `POST /api/communities` - Create new community
- `GET /api/communities/{slug}` - Get specific community
- `PUT /api/communities/{id}` - Update community
- `DELETE /api/communities/{id}` - Delete community

### 3. Post Management

**Features:**
- Create text posts
- Create posts with images/videos (up to 50MB)
- View all posts on homepage
- Sort posts by Hot, New, Top
- Search posts
- Delete own posts
- Vote on posts (upvote/downvote)
- Community association with posts (NEW)

**Media Support:**
- Images: JPG, PNG, WEBP, GIF
- Videos: MP4, WEBM
- Max file size: 50MB

**Post Entity Fields:**
- id, title, content, username
- mediaUrl, mediaType
- upvotes, downvotes
- createdAt
- communitySlug (NEW)

### 4. Comment System

**Features:**
- Add comments on posts
- View all comments for a post
- Nested comment structure
- Username tracking

### 5. Voting System

**Features:**
- Upvote posts
- Downvote posts
- Real-time vote count display
- User vote tracking
- Vote count calculation (upvotes - downvotes)

### 6. User Profile

**Features:**
- View user profile
- Upload profile picture
- View user's posts
- Account deletion
- Mobile responsive design

**Profile Features:**
- Display username and email
- Profile image upload
- Join date display
- User's post history

### 7. UI/UX Improvements

**Modern Design Elements:**
- Gradient backgrounds and buttons
- Shadow effects on cards
- Hover animations
- Smooth transitions
- Icon integration throughout UI
- Mobile responsive layouts
- Toast notifications for feedback

**Pages Enhanced:**
- **HomePage**: Search bar, sort tabs, create post button
- **TopNav**: Icons for navigation, mobile menu
- **PostCard**: Better layout with shadows and hover effects
- **LoginPage**: Modern design with icons
- **CommunitiesPage**: Grid layout with visual cards
- **SubmitPostPage**: Community dropdown, drag-drop media upload
- **CreateCommunityPage**: Form with color selection

### 8. Responsive Design

**Mobile Support:**
- All pages work on mobile devices
- Hamburger menu on mobile
- Responsive grids and layouts
- Touch-friendly buttons
- Mobile-optimized forms

### 9. Database Schema

**Entities:**
1. **User** - User accounts and authentication
2. **Post** - User posts with media support
3. **Community** - Community groups (NEW)
4. **Comment** - Post comments
5. **Vote** - User votes on posts
6. **Notification** - User notifications
7. **EmailVerification** - Email verification tokens

### 10. Security Features

**Implemented:**
- JWT token-based authentication
- BCrypt password hashing
- CORS configuration for cross-origin requests
- Protected API endpoints
- Input validation using Zod
- SQL injection prevention (JPA)

---

## Project Structure

```
FinalYearProject/
├── frontend/                          # React Frontend
│   ├── src/
│   │   ├── api/                      # API calls
│   │   ├── app/                      # App shell and routes
│   │   ├── auth/                     # Authentication logic
│   │   ├── components/              # Reusable components
│   │   ├── features/                 # Feature modules
│   │   │   ├── communities/          # Community data & store
│   │   │   └── posts/                # Post components
│   │   ├── pages/                    # Page components
│   │   ├── types/                    # TypeScript types
│   │   └── main.tsx                  # Entry point
│   ├── public/                       # Static assets
│   └── index.html
│
├── backend/                          # Spring Boot Backend
│   └── src/main/java/com/communityhub/backend/
│       ├── config/                   # Configuration files
│       ├── controller/               # REST controllers
│       ├── model/                    # Entity classes
│       ├── repository/               # Database repositories
│       ├── security/                 # Security config
│       └── service/                  # Business logic
│
└── PROJECT_PROGRESS_DOCUMENT.md      # This file
```

---

## Recent Major Updates

### Update 1: Custom Communities Feature
- **Backend**: Added Community entity with full CRUD
- **Frontend**: CreateCommunityPage with form validation
- **API**: communitiesApi for community management
- **UI**: Modern community cards with icons and colors

### Update 2: Post Creation Enhancement
- **Backend**: Added communitySlug to Post entity
- **Frontend**: SubmitPostPage with community dropdown
- **Feature**: Posts now linked to communities in database
- **UI**: Improved media upload with drag-drop style

### Update 3: UI Modernization
- **TopNav**: Icons, gradients, mobile menu
- **PostCard**: Shadows, hover effects, better layout
- **HomePage**: Search, sort tabs, styled buttons
- **LoginPage**: Modern design with error feedback
- **All Pages**: Mobile responsive design

---

## GitHub Repository

**Repository URL**: https://github.com/Shri12kant/final-year-project

**Commits**: 20+ commits with descriptive messages
- All changes tracked properly
- Regular pushes to main branch
- Both frontend and backend in same repo

---

## Deployment Status

**Frontend**: Deployed on Vercel
- Auto-deploys on every push to main
- Live URL available after each deployment

**Backend**: Deployed on Railway
- Auto-deploys on every push to main
- MySQL database connected
- Environment variables configured

---

## Key Achievements

1. **Full-Stack Application**: Complete frontend + backend
2. **Modern UI/UX**: Attractive design with animations
3. **Mobile Responsive**: Works on all devices
4. **Database Integration**: All data persisted in MySQL
5. **Authentication**: Secure login/register system
6. **File Upload**: Image and video upload support
7. **Community System**: Users can create communities
8. **Voting System**: Upvote/downvote functionality
9. **Search Feature**: Search posts and communities
10. **Git Integration**: Proper version control

---

## Future Enhancements (Optional)

1. Real-time notifications using WebSockets
2. Direct messaging between users
3. Post editing feature
4. Advanced search with filters
5. User following system
6. Trending posts algorithm
7. Email notifications
8. Admin dashboard
9. Content moderation tools
10. Mobile app (React Native)

---

## Conclusion

This project demonstrates a complete full-stack social platform with modern technologies. It includes all essential features like authentication, content creation, community management, and interactive features. The UI is modern, responsive, and user-friendly. All code is properly version controlled on GitHub with regular commits.

**Project Status**: ✅ Functional and Deployed
**Tech Stack**: Modern and Industry Standard
**Code Quality**: Clean and Maintainable
**Documentation**: Comprehensive

---

## Contact Information

For any questions or issues:
- Check the GitHub repository
- Review the code comments
- Check deployment logs on Vercel/Railway

---

**Document Version**: 1.0
**Last Updated**: April 30, 2026
**Prepared For**: College Presentation
