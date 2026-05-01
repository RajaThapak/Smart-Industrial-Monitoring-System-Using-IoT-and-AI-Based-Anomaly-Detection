# Render Deployment Guide - Session/Auth Fix

## Problem
After user login on Render-deployed app, the user is redirected back to login page instead of the dashboard. This is due to session cookies not persisting across different domains (frontend and backend services).

## Solution
Configure environment variables on Render to enable cross-domain session cookie support.

---

## Step 1: Get Your Render URLs

Before proceeding, note your deployed URLs:
- **Backend API URL**: `https://sims-xv2f.onrender.com` (your backend web service)
- **Frontend URL**: `https://your-frontend-service.onrender.com` (your frontend static site - replace with actual URL)

---

## Step 2: Update Backend Environment Variables

Go to your **Backend Web Service** on Render dashboard:

1. Click on your backend service (e.g., "sims" or similar)
2. Go to **Settings** → **Environment**
3. Add/Update these environment variables:

```
DEBUG=False
SESSION_COOKIE_SECURE=True
CORS_ALLOWED_ORIGINS=https://your-frontend-service.onrender.com,https://sims-xv2f.onrender.com
CSRF_TRUSTED_ORIGINS=https://your-frontend-service.onrender.com,https://sims-xv2f.onrender.com
```

**Important:** Replace `https://your-frontend-service.onrender.com` with your actual frontend URL.

---

## Step 3: Verify Frontend Configuration

The frontend should already be configured to use the correct backend API URL in production (`https://sims-xv2f.onrender.com`). 

If you need to override it, set this environment variable on the **Frontend Static Site**:
```
VITE_API_BASE_URL=https://sims-xv2f.onrender.com
```

However, this should not be necessary as the frontend defaults to this URL in production.

---

## Step 4: Deploy Changes

1. **Push backend changes** (new Django settings with environment variable support):
   ```bash
   git add Backend/myproject/myproject/settings.py
   git commit -m "Add session cookie configuration for cross-domain support"
   git push
   ```
   Render will auto-redeploy.

2. **Push frontend changes** (improved auth session handling):
   ```bash
   git add Frontend/src/components/auth/AuthScreenEnhanced.tsx Frontend/src/hooks/useAuthSession.ts
   git commit -m "Add session retry logic and timing improvements for auth"
   git push
   ```
   Render will auto-redeploy.

---

## Step 5: Test the Fix

1. Visit your deployed frontend URL
2. Go to login/register page
3. Register a new account or login
4. You should be redirected to the **dashboard**, not back to login
5. Refresh the page - you should still be logged in

---

## How It Works (Technical Details)

### What Changed:

1. **Django Settings** (`settings.py`):
   - Added `SESSION_COOKIE_SECURE=True` (requires HTTPS for cookies - production only)
   - Added `SESSION_COOKIE_SAMESITE='None'` (allows cookies across different domains)
   - Added `SESSION_SAVE_EVERY_REQUEST=True` (ensures session is saved after every request)
   - Environment-aware configuration using `os.getenv()`

2. **Frontend Auth Flow** (`useAuthSession.ts`):
   - Added retry logic (up to 3 attempts) to check auth status
   - Added delay between retries to give backend time to persist session
   - Ensures credentials are always sent (`credentials: "include"`)

3. **Login Flow** (`AuthScreenEnhanced.tsx`):
   - Added 100ms delay after successful login before checking auth status
   - Gives Django time to properly set session cookie before refresh

### Browser Cookies:
- Login endpoint creates session cookie with `SameSite=None; Secure`
- Cookie is sent with all subsequent requests (due to `credentials: "include"`)
- Auth status endpoint receives cookie and recognizes user is authenticated

---

## Troubleshooting

### Still seeing login page after login?

1. **Check browser DevTools**:
   - Open DevTools (F12)
   - Go to **Network** tab
   - Login again
   - Look at the `/api/auth/login/` response headers - should have `Set-Cookie: sessionid=...`
   - Look at the `/api/auth/status/` request headers - should have `Cookie: sessionid=...`

2. **Check Render dashboard**:
   - Go to Backend Service → **Logs**
   - Look for auth_status debug output
   - Should show `Authenticated: True` after login

3. **Clear browser storage**:
   - DevTools → Application → Clear all
   - Try logging in again

4. **Verify environment variables are set**:
   - Render dashboard → Backend Service → Settings → Environment
   - Confirm `SESSION_COOKIE_SECURE=True` and `CORS_ALLOWED_ORIGINS` are set correctly

### Getting CORS errors?

- Check that `CORS_ALLOWED_ORIGINS` includes your frontend domain
- Check that `CSRF_TRUSTED_ORIGINS` includes your frontend domain
- Backend logs should show which origin the request came from

### Cookies not being sent?

- Ensure frontend uses `credentials: "include"` on all fetch calls (already done)
- Ensure backend sets `Access-Control-Allow-Credentials: true` (already in CORS middleware)
- Verify `SESSION_COOKIE_SECURE=True` (required for HTTPS)

---

## Environment Variables Summary

| Variable | Local Dev | Production (Render) | Purpose |
|----------|-----------|---------------------|---------|
| `DEBUG` | `True` | `False` | Disable debug mode in production |
| `SESSION_COOKIE_SECURE` | `False` | `True` | Require HTTPS for cookies |
| `SESSION_COOKIE_SAMESITE` | `Lax` | `None` | Allow cross-domain cookies |
| `CORS_ALLOWED_ORIGINS` | `http://localhost:*` | `https://your-frontend-url,https://backend-url` | Allowed CORS origins |
| `CSRF_TRUSTED_ORIGINS` | `http://localhost:*` | `https://your-frontend-url` | Trusted origins for CSRF |

---

## Local Development

To test locally with HTTPS simulation:

```bash
# Set production-like environment variables
$env:DEBUG = "False"
$env:SESSION_COOKIE_SECURE = "False"  # Still False for local HTTP
$env:CORS_ALLOWED_ORIGINS = "http://localhost:8080,http://localhost:8081"

# Run Django
cd Backend/myproject
python manage.py runserver

# In another terminal, run frontend dev server
cd Frontend
npm run dev
```

---

## Support

If issues persist after following these steps:

1. Check Render logs for 500 errors
2. Verify all environment variables are set correctly
3. Clear browser cache and cookies
4. Try incognito/private browsing window (to rule out local cache issues)
5. Rebuild and redeploy both services
