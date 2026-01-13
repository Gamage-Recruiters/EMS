
# EMS

## Environment setup (Google Sign-In)

If you see `Error 401: invalid_client` while using “Sign in with Google”, your Google OAuth client ID is not configured.

- Frontend: set `VITE_GOOGLE_CLIENT_ID` in `frontend/.env`
- Backend: set `GOOGLE_CLIENT_ID` in `backend/.env`

These must be the **same Web OAuth Client ID**.

For local dev, add `http://localhost:5173` to the OAuth client’s **Authorized JavaScript origins** in Google Cloud Console.

