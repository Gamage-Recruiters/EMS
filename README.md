# Employee Management System (EMS)

A complete frontend and backend integration for an Employee Management System built with React.js and Node.js.

## Features

- **Authentication**: Email/password and Google OAuth login
- **Role-Based Access Control (RBAC)**: CEO, SYSTEM_OWNER, TL, ATL, PM, Developer, Unassigned roles
- **JWT Token Management**: Access and refresh tokens with automatic token refresh
- **User Profile Management**: Personal, contact, education, and job details
- **Dashboard System**: Role-specific dashboards for different user types

## Tech Stack

### Frontend
- React 19
- React Router DOM
- TailwindCSS
- Google OAuth (@react-oauth/google)
- Axios for API calls
- Vite

### Backend
- Node.js
- Express.js
- MongoDB with Mongoose
- JWT Authentication
- bcryptjs for password hashing
- Google Auth Library
- CORS enabled

## Setup Instructions

### Prerequisites
- Node.js (v18 or higher)
- MongoDB (local or Atlas)
- Google OAuth credentials

### 1. Clone the repository
```bash
git clone <repository-url>
cd EMS
```

### 2. Backend Setup
```bash
cd backend
npm install
```

Create a `.env` file in the backend directory:
```env
PORT=5000
NODE_ENV=development
MONGODB_URI=mongodb://localhost:27017/ems
JWT_SECRET=your_jwt_secret_key_here
JWT_REFRESH_SECRET=your_jwt_refresh_secret_key_here
JWT_EXPIRES_IN=15m
JWT_REFRESH_EXPIRES_IN=7d
GOOGLE_CLIENT_ID=your_google_client_id_here
RATE_LIMIT_WINDOW_MS=900000
RATE_LIMIT_MAX_REQUESTS=100
```

Start the backend server:
```bash
npm run dev
```

### 3. Frontend Setup
```bash
cd frontend
npm install
```

Create a `.env` file in the frontend directory:
```env
VITE_API_BASE=http://localhost:5000
VITE_GOOGLE_CLIENT_ID=your_google_client_id_here
VITE_DEV_MODE=true
```

Start the frontend development server:
```bash
npm run dev
```

## API Endpoints

### Authentication
- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - User login
- `POST /api/auth/google` - Google OAuth login
- `POST /api/auth/refresh` - Refresh access token

### User Management
- `GET /api/users/profile` - Get user profile
- `PUT /api/users/profile` - Update user profile
- `POST /api/users/upload-image` - Upload profile image
- `DELETE /api/users/profile` - Delete user account

## Role-Based Access

The system supports the following roles:
- **CEO**: Full system access
- **SYSTEM_OWNER**: Full system access
- **TL**: Team Lead permissions
- **ATL**: Assistant Team Lead
- **PM**: Project Manager
- **Developer**: Standard employee access
- **Unassigned**: New users without assigned roles

## Security Features

- JWT-based authentication with access and refresh tokens
- Automatic token refresh
- Password hashing with bcryptjs
- CORS protection
- Rate limiting
- Role-based route protection

## Development

The frontend runs on `http://localhost:5173` by default and proxies API requests to the backend at `http://localhost:5000`.

## Google OAuth Setup

1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Create a new project or select existing one
3. Enable Google+ API
4. Create OAuth 2.0 credentials
5. Add `http://localhost:5173` to authorized JavaScript origins
6. Add `http://localhost:5173` to authorized redirect URIs
7. Copy the Client ID to your environment variables

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## License

ISC License - Gamage Recruiters (Pvt) Ltd