# Render Environment Variables - Quick Reference

## For Backend Web Service (e.g., sims-xv2f.onrender.com)

Go to Render Dashboard → Backend Service → Settings → Environment

### Copy-Paste Configuration

```
DEBUG=False
SESSION_COOKIE_SECURE=True
CORS_ALLOWED_ORIGINS=https://your-frontend-url.onrender.com,https://sims-xv2f.onrender.com
CSRF_TRUSTED_ORIGINS=https://your-frontend-url.onrender.com
```

⚠️ **IMPORTANT**: Replace `your-frontend-url` with your actual Render frontend static site URL
- Example: `https://sims-frontend-abc123.onrender.com`
- If you don't know your frontend URL, go to Frontend Static Site in Render dashboard and copy the URL

### Individual Variables

| Key | Value | Purpose |
|-----|-------|---------|
| `DEBUG` | `False` | Disable debug mode in production |
| `SESSION_COOKIE_SECURE` | `True` | Require HTTPS for session cookies |
| `CORS_ALLOWED_ORIGINS` | See above | Allow requests from frontend domain |
| `CSRF_TRUSTED_ORIGINS` | See above | Trust frontend for CSRF protection |

---

## For Frontend Static Site

No environment variables needed on the frontend!

The frontend automatically uses `https://sims-xv2f.onrender.com` as the API URL in production.

---

## How to Set Environment Variables on Render

1. Go to [render.com/dashboard](https://render.com/dashboard)
2. Click on your **Backend Web Service** (the one running Django)
3. Go to **Settings** tab (left sidebar)
4. Scroll down to **Environment** section
5. Click **Add Environment Variable** for each variable
6. Enter key and value
7. Click **Save Changes**
8. Render will automatically redeploy your service

---

## After Setting Variables

1. Wait for backend to redeploy (watch the logs)
2. Push the updated code to GitHub (settings.py changes)
3. Test: Go to frontend URL → Login → Should go to dashboard ✅

---

## Troubleshooting

### Still stuck on login page after setting variables?

1. **Check environment variables are actually set**:
   - Render Dashboard → Backend Service → Settings → Environment
   - Confirm all 4 variables are there

2. **Check logs**:
   - Render Dashboard → Backend Service → Logs
   - Should see "✅ login_user" messages after login attempt
   - No 500 errors

3. **Check frontend URL in CORS_ALLOWED_ORIGINS**:
   - Make sure it matches exactly (case-sensitive)
   - Should start with `https://` (not `http://`)

4. **Redeploy if still having issues**:
   - Backend Service → Settings → Redeploy from git (top right)

---

## Example (Real Values)

If your frontend URL is `https://sims-app-production.onrender.com`:

```
DEBUG=False
SESSION_COOKIE_SECURE=True
CORS_ALLOWED_ORIGINS=https://sims-app-production.onrender.com,https://sims-xv2f.onrender.com
CSRF_TRUSTED_ORIGINS=https://sims-app-production.onrender.com
```

---

## Questions?

See `RENDER_DEPLOYMENT_GUIDE.md` for detailed explanation and troubleshooting.
