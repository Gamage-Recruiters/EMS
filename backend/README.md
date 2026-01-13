# EMS Backend Setup Guide

## Installation Steps

### 1. Install Dependencies
```bash
npm install
```

Dependencies installed:
- **express**: Web framework
- **mongoose**: MongoDB ODM
- **dotenv**: Environment variables
- **bcryptjs**: Password hashing
- **jsonwebtoken**: JWT authentication
- **nodemailer**: Email service
- **multer**: File upload handling
- **cors**: Cross-origin requests

### 2. Create Required Directories
```bash
# Create uploads directory
mkdir -p uploads/profile-pictures
```

### 3. Configure Environment Variables

Update `.env` file with your credentials:

```env
# MongoDB
MONGO_URI=your_mongodb_connection_string

# JWT Settings
JWT_SECRET=your_secret_key
JWT_EXPIRES_IN=15m
JWT_REFRESH_SECRET=your_refresh_secret
JWT_REFRESH_EXPIRES_IN=7d

# Email Configuration (Gmail Example)
EMAIL_USER=your_email@gmail.com
EMAIL_PASS=your_app_password

# Frontend URL
FRONTEND_URL=http://localhost:5173
```

#### Gmail App Password Setup:
1. Enable 2-factor authentication on Google Account
2. Go to: https://myaccount.google.com/apppasswords
3. Select "Mail" and "Windows Computer"
4. Copy the 16-character password
5. Paste in EMAIL_PASS field (remove spaces)

### 4. Start Development Server
```bash
npm run dev
```

Server will run on: `http://localhost:5000`

### 5. Test API Health
```bash
curl http://localhost:5000/api/health
```

Expected response:
```json
{
  "success": true,
  "message": "Server is running"
}
```

## API Endpoints

### Authentication Routes
- POST `/api/auth/register` - Register new user
- POST `/api/auth/login` - User login
- POST `/api/auth/forgot-password` - Request password reset
- POST `/api/auth/verify-code` - Verify reset token
- POST `/api/auth/reset-password` - Reset password

### Profile Routes
- GET `/api/profile` - Get user profile
- PUT `/api/profile/personal` - Update personal details
- PUT `/api/profile/contact` - Update contact details
- PUT `/api/profile/education` - Update education
- PUT `/api/profile/job-details` - Update job details
- POST `/api/profile/upload-picture` - Upload profile picture

### Notification Routes
- GET `/api/notifications` - Get all notifications
- PUT `/api/notifications/:id/read` - Mark as read
- PUT `/api/notifications/read-all` - Mark all as read
- DELETE `/api/notifications/:id` - Delete notification

## Postman Collection

See `postman-collection.json` for complete API testing setup.

## Database Models

### User Schema
```javascript
{
  firstName: String,
  lastName: String,
  email: String (unique),
  password: String (hashed),
  role: String (CEO|TL|DEVELOPER|SYSTEM_OWNER|HR),
  profilePicture: String (URL),
  phone: String,
  department: String,
  // ... more fields
}
```

### Notification Schema
```javascript
{
  userId: ObjectId,
  title: String,
  message: String,
  type: String (INFO|SUCCESS|WARNING|ERROR),
  isRead: Boolean,
  readAt: Date
}
```

## Troubleshooting

### MongoDB Connection Error
- Verify MONGO_URI is correct
- Check IP whitelist in MongoDB Atlas
- Ensure internet connection is stable

### Email Not Sending
- Verify EMAIL_USER and EMAIL_PASS are correct
- Check Gmail app password (not regular password)
- Enable "Less secure app access" if using regular password
- Check spam/junk folder

### Port Already in Use
```bash
# Find process using port 5000
lsof -i :5000

# Kill process
kill -9 <PID>
```

### File Upload Issues
- Verify `/uploads/profile-pictures` directory exists
- Check file permissions on uploads directory
- Ensure disk space is available
