# 🚀 Vercel Deployment Guide for Habit Tracker

## ✅ Prerequisites Checklist

- [x] Project builds successfully locally (`npm run build`)
- [x] All linting errors resolved (`npm run lint`)
- [x] Supabase database table created (if not, see `SUPABASE_SETUP_GUIDE.md`)
- [x] Environment variables configured

## 📋 Step-by-Step Deployment Process

### Method 1: Deploy via Vercel Dashboard (Recommended)

#### Step 1: Push to GitHub
```bash
# Initialize git repository (if not already done)
git init
git add .
git commit -m "Initial commit - Habit Tracker App"

# Create a new GitHub repository and push
# Go to https://github.com/new and create a new repository
# Then push your code:
git remote add origin https://github.com/YOUR_USERNAME/YOUR_REPO_NAME.git
git branch -M main
git push -u origin main
```

#### Step 2: Deploy to Vercel
1. Go to [https://vercel.com](https://vercel.com)
2. Click **"New Project"**
3. Import your GitHub repository
4. Configure environment variables (see below)
5. Click **"Deploy"**

### Method 2: Deploy via Vercel CLI

#### Step 1: Install Vercel CLI
```bash
npm i -g vercel
```

#### Step 2: Deploy
```bash
# From your project root
cd /Users/sobhan/Documents/Next js Apps/reminder
vercel

# Follow the prompts:
# - Set up and deploy: Yes
# - Which scope: Select your Vercel account
# - Link to existing project: No
# - Project name: habit-tracker (or your choice)
# - Directory: ./ (current directory)
# - Override settings: No
```

#### Step 3: Set Environment Variables
```bash
# After deployment, set your environment variables
vercel env add NEXT_PUBLIC_SUPABASE_URL production
vercel env add NEXT_PUBLIC_SUPABASE_ANON_KEY production
vercel env add GEMINI_API_KEY production

# For local development
vercel env add NEXT_PUBLIC_SUPABASE_URL development
vercel env add NEXT_PUBLIC_SUPABASE_ANON_KEY development
vercel env add GEMINI_API_KEY development
```

## 🔐 Environment Variables Configuration

### Required Environment Variables:

| Variable | Description | Where to Find |
|----------|-------------|---------------|
| `NEXT_PUBLIC_SUPABASE_URL` | Your Supabase project URL | Supabase Dashboard → Settings → API |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | Your Supabase anon key | Supabase Dashboard → Settings → API |
| `GEMINI_API_KEY` | Google Gemini API key | https://makersuite.google.com/app/apikey |

### Getting Your Supabase Credentials:
1. Go to [https://app.supabase.com](https://app.supabase.com)
2. Select your project
3. Go to **Settings** → **API**
4. Copy:
   - **Project URL** → `NEXT_PUBLIC_SUPABASE_URL`
   - **anon public** key → `NEXT_PUBLIC_SUPABASE_ANON_KEY`

### Getting Your Gemini API Key:
1. Go to [https://makersuite.google.com/app/apikey](https://makersuite.google.com/app/apikey)
2. Click **"Create API Key"**
3. Copy the key → `GEMINI_API_KEY`

## 🚀 Deployment Commands Summary

```bash
# Test build locally
npm run build

# Test linting
npm run lint

# Start production server locally
npm start

# Deploy to Vercel
vercel --prod
```

## 📊 Post-Deployment Checklist

- [ ] App loads without errors
- [ ] Authentication works
- [ ] Habits can be created/updated/deleted
- [ ] Gemini AI features work (if API key provided)
- [ ] All environment variables are set correctly
- [ ] Database connection works
- [ ] RLS policies are working

## 🛠️ Troubleshooting

### Build Fails
- Check for TypeScript errors: `npm run build`
- Check for linting errors: `npm run lint`
- Ensure all dependencies are installed: `npm install`

### Environment Variables Not Working
- Double-check variable names match exactly
- Ensure no extra spaces in values
- Verify Supabase project is correct

### Database Connection Issues
- Ensure Supabase table is created (see `SUPABASE_SETUP_GUIDE.md`)
- Check RLS policies are configured
- Verify Supabase project URL and anon key

### 404 Errors
- Check if routes are correctly configured
- Ensure `vercel.json` is present
- Verify build output directory is `.next`

## 🔗 Useful Links

- **Your App**: https://your-project-name.vercel.app
- **Vercel Dashboard**: https://vercel.com/dashboard
- **Supabase Dashboard**: https://app.supabase.com
- **Vercel Docs**: https://nextjs.org/docs/deployment

## 📱 Mobile Optimization

Your app is already optimized for mobile with:
- Responsive design with Tailwind CSS
- Touch-friendly UI components
- Optimized images and assets
- Fast loading times

## 🎯 Next Steps After Deployment

1. **Set up custom domain** (optional)
2. **Configure analytics** with Vercel Analytics
3. **Set up monitoring** with Sentry or similar
4. **Optimize performance** with Next.js optimizations
5. **Add more features** based on user feedback

---

**🎉 Congratulations! Your Habit Tracker app is ready for deployment!**