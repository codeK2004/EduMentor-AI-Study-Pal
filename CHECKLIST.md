# Pre-Launch Checklist

## ✅ What Was Fixed

- [x] Added missing PostgreSQL dependencies to requirements.txt
- [x] Removed duplicate `deps.py` file
- [x] Fixed route prefix duplications
- [x] Created Login and Signup pages
- [x] Added JWT token management
- [x] Created centralized API utility with auth interceptor
- [x] Updated all pages to use authenticated API calls
- [x] Added logout functionality
- [x] Removed unnecessary package.json files
- [x] Preserved all PostgreSQL backend logic
- [x] No changes to database models or business logic

## 🚀 Before You Start

### 1. PostgreSQL Setup
- [ ] PostgreSQL is installed
- [ ] PostgreSQL service is running
- [ ] Database `edumentor_db` is created
- [ ] User `edumentor_user` exists with correct password

### 2. Environment Variables
- [ ] `backend/.env` file exists
- [ ] `GEMINI_API_KEY` is set
- [ ] `DATABASE_URL` is correct
- [ ] `SECRET_KEY` is set (change in production!)

### 3. Backend Dependencies
- [ ] Run `pip install -r backend/requirements.txt`
- [ ] Run `python backend/create_tables.py`
- [ ] No errors during table creation

### 4. Frontend Dependencies
- [ ] Run `npm install` in frontend folder
- [ ] No dependency conflicts

## 🧪 Testing Steps

### 1. Backend Test
```bash
cd backend
uvicorn main:app --reload
```
- [ ] Server starts without errors
- [ ] Visit http://127.0.0.1:8000/docs
- [ ] Swagger UI loads correctly
- [ ] Can see all endpoints

### 2. Frontend Test
```bash
cd frontend
npm run dev
```
- [ ] Dev server starts without errors
- [ ] Visit http://localhost:5173
- [ ] Login page appears

### 3. Authentication Test
- [ ] Can create new account (signup)
- [ ] Can login with created account
- [ ] Token is stored in localStorage
- [ ] Redirected to home page after login
- [ ] Logout button appears in header
- [ ] Logout works and redirects to login

### 4. Feature Tests (After Login)
- [ ] **Planner**: Can create study plan
- [ ] **Dashboard**: Shows progress (0/0 initially)
- [ ] **Quiz**: Can generate quiz questions
- [ ] **Quiz**: Completing quiz updates progress
- [ ] **AI Explain**: Can get explanations
- [ ] **Resources**: Can fetch learning resources
- [ ] **Notes**: Can create and view notes

### 5. API Authentication Test
- [ ] Open browser DevTools → Network tab
- [ ] Create a study plan
- [ ] Check request headers
- [ ] Should see `Authorization: Bearer <token>`

## 🔒 Security Notes

### For Development
- Current setup is fine for local development
- SECRET_KEY in .env is for development only

### Before Production
- [ ] Change SECRET_KEY to a strong random value
- [ ] Use environment variables (not .env file)
- [ ] Enable HTTPS
- [ ] Update CORS origins to production domain
- [ ] Add rate limiting
- [ ] Add input validation
- [ ] Set up proper logging
- [ ] Use production database credentials
- [ ] Enable database backups

## 📝 Common Issues

### "Connection refused" error
→ Backend not running. Start with `uvicorn main:app --reload`

### "401 Unauthorized" error
→ Token expired or invalid. Logout and login again

### "CORS error" in browser
→ Check backend CORS settings in main.py

### Database connection error
→ Check PostgreSQL is running and DATABASE_URL is correct

### "Module not found" error
→ Run `pip install -r requirements.txt` again

## 📚 Documentation Files

- `QUICKSTART.md` - Quick setup instructions
- `SETUP.md` - Detailed setup guide
- `SYNC_FIXES.md` - What was changed and why
- `PROJECT_STRUCTURE.md` - Complete project structure
- `CHECKLIST.md` - This file

## 🎉 You're Ready!

Once all checkboxes are complete, your app is fully synced and ready to use!
