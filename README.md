# Life in Cubes - Project Documentation

## Overview
Life in Cubes is a unique life visualization and event tracking application that represents your life as a grid of cubes, where each cube represents a week of your life. The application helps users track, visualize, and reflect on their life events, milestones, and memories in a meaningful way.

## Technical Stack

### Backend
- **Framework**: Django + Django REST Framework
- **Database**: SQLite (development) / PostgreSQL (production)
- **Authentication**: JWT (JSON Web Tokens)
- **API Documentation**: drf-yasg (Swagger/OpenAPI)

### Frontend
- **Framework**: Next.js 14 with App Router
- **UI Framework**: Tailwind CSS + shadcn/ui
- **State Management**: React Context + Custom Hooks
- **Authentication**: JWT with HTTP-only cookies

## Core Features

1. **Life Grid Visualization**
   - Visual representation of life in weeks (up to 80 years = 4160 weeks)
   - Color-coded events and categories
   - Interactive week/day selection

2. **Event Management**
   - Create, read, update, and delete life events
   - Assign icons and colors to events
   - Tag-based event categorization
   - Advanced event search and filtering

3. **User System**
   - User registration and authentication
   - Profile management with birth date
   - Personalized event tracking
   - Secure token-based authentication with HTTP-only cookies
   - Consistent cookie management across frontend and backend

4. **Data Organization**
   - Tag-based event categorization
   - Color coding for different event types
   - Icon support for visual representation
   - Week and day-based event organization

## Authentication & Cookie Management

### Cookie Names and Usage
- **Access Token**: `jwt_access_token` (HTTP-only)
  - Stores the JWT access token
  - Used for API authorization
  - Expires in 60 minutes

- **Refresh Token**: `jwt_refresh_token` (HTTP-only)
  - Stores the JWT refresh token
  - Used to obtain new access tokens
  - Expires in 7 days

- **CSRF Token**: `csrftoken`
  - Protects against CSRF attacks
  - Required for POST, PUT, PATCH, DELETE requests
  - Accessible by JavaScript for header inclusion

### Cookie Security Options
```typescript
const COOKIE_OPTIONS = {
  path: '/',
  sameSite: 'lax',
  secure: process.env.NODE_ENV === 'production',
  expires: 7 // days
}
```

### API Authentication Flow
1. User logs in via `/api/v1/auth/login/`
2. Backend sets HTTP-only cookies for access and refresh tokens
3. Frontend includes tokens automatically in subsequent requests
4. Access token expires -> Frontend uses refresh token to get new access token
5. Refresh token expires -> User must log in again

### API Endpoints

#### Authentication
- POST `/api/v1/auth/login/` - User login
- POST `/api/v1/auth/register/` - User registration
- POST `/api/v1/auth/logout/` - User logout
- POST `/api/v1/auth/refresh/` - Refresh JWT token
- POST `/api/v1/auth/password/change/` - Change password
- GET `/api/v1/auth/user/` - Get current user details
- GET `/api/v1/auth/csrf/` - Get CSRF token

## Database Models

### UserProfile
```python
- user (OneToOne -> User, on_delete=CASCADE, related_name='profile')
- birth_date (DateField, null=True, blank=True)
- created_at (DateTimeField, auto_now_add=True)
- updated_at (DateTimeField, auto_now=True)
```

### Tag
```python
- name (CharField, max_length=50, unique=True)
- created_at (DateTimeField, auto_now_add=True)

Meta:
- ordering = ['name']
```

### Event
```python
- user (ForeignKey -> User, on_delete=CASCADE, related_name='events')
- week_index (IntegerField, validators=[MinValueValidator(0), MaxValueValidator(4160)])
- day_of_week (IntegerField, validators=[MinValueValidator(0), MaxValueValidator(6)])
- title (CharField, max_length=200)
- description (TextField, blank=True)
- icon (CharField, max_length=50)
- color (CharField, max_length=50, blank=True, null=True)
- tags (ManyToManyField -> Tag, blank=True, related_name='events')
- created_at (DateTimeField, auto_now_add=True)
- updated_at (DateTimeField, auto_now=True)

Meta:
- ordering = ['week_index', 'day_of_week']
- indexes = [
    Index(fields=['user', 'week_index']),
    Index(fields=['user', 'created_at'])
]
```

## Project Structure

```
project/
├── backend/
│   ├── core/                   # Django project settings
│   │   ├── __init__.py
│   │   ├── asgi.py
│   │   ├── settings.py
│   │   ├── urls.py
│   │   └── wsgi.py
│   ├── life_cubes/            # Main Django app
│   │   ├── migrations/        # Database migrations
│   │   ├── __init__.py
│   │   ├── admin.py          # Admin interface
│   │   ├── apps.py           # App configuration
│   │   ├── authentication.py  # Custom auth handlers
│   │   ├── models.py         # Database models
│   │   ├── serializers.py    # API serializers
│   │   ├── tests.py          # Test cases
│   │   ├── urls.py           # API routing
│   │   ├── utils.py          # Utility functions
│   │   └── views.py          # API views
│   ├── README.md
│   ├── manage.py             # Django CLI
│   └── requirements.txt      # Python dependencies
│
├── frontend/
│   ├── app/                  # Next.js app directory
│   │   ├── (auth)/          # Auth routes
│   │   │   ├── login/
│   │   │   ├── register/
│   │   │   └── layout.tsx
│   │   ├── (protected)/     # Protected routes
│   │   │   ├── dashboard/
│   │   │   ├── profile/
│   │   │   ├── settings/
│   │   │   └── layout.tsx
│   │   ├── fonts/           # Font assets
│   │   ├── error.tsx        # Error handling
│   │   ├── layout.tsx       # Root layout
│   │   ├── page.tsx         # Home page
│   │   └── providers.tsx    # App providers
│   ├── components/          # React components
│   │   ├── auth/           # Auth components
│   │   │   ├── login-form.tsx
│   │   │   ├── protected-route.tsx
│   │   │   └── register-form.tsx
│   │   ├── dialogs/        # Dialog components
│   │   │   ├── add-event-dialog.tsx
│   │   │   └── advanced-search.tsx
│   │   ├── grid/           # Grid components
│   │   │   ├── decade-grid.tsx
│   │   │   ├── decade-mood.tsx
│   │   │   ├── memento-mori.tsx
│   │   │   ├── week-detail.tsx
│   │   │   └── week-preview.tsx
│   │   ├── landing/        # Landing page components
│   │   ├── layout/         # Layout components
│   │   ├── profile/        # Profile components
│   │   ├── theme/          # Theme components
│   │   └── ui/             # UI components
│   ├── hooks/              # Custom React hooks
│   │   ├── use-api.ts
│   │   ├── use-auth.ts
│   │   ├── use-events.ts
│   │   └── use-toast.ts
│   ├── lib/                # Utilities and services
│   │   ├── contexts/       # React contexts
│   │   │   ├── auth-context.tsx
│   │   │   └── events-context.tsx
│   │   ├── services/       # API services
│   │   │   ├── auth-service.ts
│   │   │   ├── event-service.ts
│   │   │   └── user-service.ts
│   │   └── api-client.ts   # API client
│   ├── types/              # TypeScript types
│   │   ├── api.ts
│   │   ├── auth.ts
│   │   ├── events.ts
│   │   └── user.ts
│   ├── public/             # Static assets
│   ├── middleware.ts       # Next.js middleware
│   ├── tailwind.config.ts  # Tailwind config
│   └── package.json        # Node dependencies
```

## Backend Components

### Authentication Module
The `authentication.py` module provides custom authentication handlers for:
- JWT token validation and verification
- Custom user authentication
- Session management
- Security middleware

### Utils Module
The `utils.py` module contains utility functions for:
- Data processing and transformation
- Helper functions for views
- Common backend operations
- Custom validators

### Views Module
The `views.py` module has been expanded to include:
- Comprehensive API endpoints
- Advanced filtering and search
- Pagination handling
- Complex data aggregation
- Event management logic

## Frontend Components

### Grid Components
Located in `components/grid/`:
- `memento-mori.tsx`: Main life grid visualization
- `decade-grid.tsx`: Decade-based grid view
- `week-detail.tsx`: Detailed week view
- `week-preview.tsx`: Week preview component
- `decade-mood.tsx`: Mood tracking visualization

### Dialog Components
Located in `components/dialogs/`:
- `add-event-dialog.tsx`: Event creation interface
- `advanced-search.tsx`: Advanced search functionality

### Profile Components
Located in `components/profile/`:
- `life-statistics.tsx`: User life statistics

### Authentication Components
Located in `components/auth/`:
- `login-form.tsx`: User login interface
- `protected-route.tsx`: Route protection wrapper

## API Endpoints

### Authentication
- POST `/api/v1/auth/login/` - User login
- POST `/api/v1/auth/register/` - User registration
- POST `/api/v1/auth/logout/` - User logout
- POST `/api/v1/auth/refresh/` - Refresh JWT token
- POST `/api/v1/auth/password/change/` - Change password
- GET `/api/v1/auth/user/` - Get current user details

### User & Profile
- GET `/api/v1/profiles/` - List profiles
- GET `/api/v1/profiles/{id}/` - Get profile details
- PUT `/api/v1/profiles/{id}/` - Update profile

### Events
- GET `/api/v1/events/` - List events
- POST `/api/v1/events/` - Create event
- GET `/api/v1/events/{id}/` - Get event details
- PUT `/api/v1/events/{id}/` - Update event
- DELETE `/api/v1/events/{id}/` - Delete event

### Tags
- GET `/api/v1/tags/` - List tags
- POST `/api/v1/tags/` - Create tag
- GET `/api/v1/tags/{id}/` - Get tag details
- PUT `/api/v1/tags/{id}/` - Update tag
- DELETE `/api/v1/tags/{id}/` - Delete tag

### Dashboard
- GET `/api/v1/dashboard/` - Get dashboard data

## Security Features

1. **Authentication**
   - JWT-based authentication with HTTP-only cookies
   - Automatic token refresh mechanism
   - Token blacklisting for logout
   - CSRF protection with dedicated token
   - Consistent cookie naming across frontend and backend
   - Secure cookie options (HTTPOnly, SameSite, Secure in production)

2. **Authorization**
   - Permission-based access control
   - User-specific data isolation
   - Protected routes and API endpoints

3. **Data Validation**
   - Input validation on both frontend and backend
   - Strong password requirements
   - Data sanitization


## Best Practices

1. **Code Organization**
   - Follow component-based architecture
   - Implement proper separation of concerns
   - Use TypeScript for type safety
   - Follow Django REST framework conventions

2. **Security**
   - Store sensitive data in environment variables
   - Implement proper authentication and authorization
   - Validate and sanitize all user inputs
   - Use HTTPS in production

3. **Performance**
   - Implement proper database indexing
   - Use pagination for large datasets
   - Optimize frontend bundle size
   - Cache frequently accessed data

4. **Maintainability**
   - Write clean, documented code
   - Follow consistent coding style
   - Use meaningful variable and function names
   - Keep components and functions small and focused


## Software Design Principles

### 1. Object-Oriented Programming (OOP) Principles
- **Encapsulation**: Bundling data with methods that operate on that data, restricting direct access to object's components to prevent unintended interference and misuse.
- **Abstraction**: Using simple classes to represent complexity by hiding complex implementation details and exposing only essential features.
- **Inheritance**: Enabling classes (child/subclass) to inherit properties and behaviors from other classes (parent/superclass).
- **Polymorphism**: Allowing entities to take multiple forms, where a class can be treated as its parent class or implemented interfaces.

### 2. SOLID Design Principles
- **Single Responsibility (SRP)**: Each class should have only one reason to change, focusing on a single responsibility.
- **Open/Closed (OCP)**: Software entities should be open for extension but closed for modification.
- **Liskov Substitution (LSP)**: Objects of a superclass should be replaceable with objects of its subclasses without affecting program correctness.
- **Interface Segregation (ISP)**: Clients should not be forced to depend on interfaces they don't use.
- **Dependency Inversion (DIP)**: High-level modules should depend on abstractions, not concrete implementations.

### 3. Additional Design Principles
- **DRY (Don't Repeat Yourself)**: Avoid code duplication to prevent inconsistencies and maintenance issues.
- **KISS (Keep It Simple, Stupid)**: Maintain simplicity in code design for better understanding and maintenance.
- **YAGNI (You Aren't Gonna Need It)**: Only implement functionality when it's actually needed.
- **Law of Demeter (LoD)**: Objects should only communicate with immediate friends, limiting knowledge of other objects' internals.
- **Composition Over Inheritance**: Prefer object composition to inheritance for more flexible and maintainable code.
- **Principle of Least Astonishment**: Design solutions that behave in a way that users would expect, avoiding surprising behaviors.

### Application in This Project
These principles are applied throughout the codebase:
- Models follow SRP with clear, focused responsibilities
- API endpoints use inheritance and polymorphism through DRF viewsets
- Components are designed for composition and reusability
- Authentication follows the principle of least privilege
- Code organization reflects separation of concerns
- Interfaces are kept minimal and focused (ISP)
- Dependencies are managed through proper abstraction (DIP)

