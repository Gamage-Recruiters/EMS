# EMS Frontend

## Setup

1. Create `frontend/.env` (or copy from `frontend/.env.example`).
2. Set:

```dotenv
VITE_API_URL=http://localhost:5000/api
VITE_GOOGLE_CLIENT_ID=YOUR_GOOGLE_OAUTH_CLIENT_ID
```

## Google Sign-In

The app uses `@react-oauth/google`. You must configure a **Google OAuth Client ID** (type: **Web application**) in Google Cloud Console.

For local dev, add `http://localhost:5173` to **Authorized JavaScript origins**.
