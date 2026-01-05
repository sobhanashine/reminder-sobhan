# 🚀 Supabase Database Setup Guide

## Current Status: ❌ Database table not found

Your application is trying to access a `public.habits` table that doesn't exist in your Supabase project. Follow these steps to set it up:

## 🔗 Quick Access to Your Supabase Project

**Project URL**: https://kbvvakgywgvilvttpckl.supabase.co
**Direct Dashboard Link**: https://app.supabase.com/project/kbvvakgywgvilvttpckl

## 📋 Step-by-Step Setup Instructions

### Step 1: Access Your Supabase Dashboard
1. Go to [https://app.supabase.com](https://app.supabase.com)
2. Log in with your account
3. Select your project (should be the one matching your URL)

### Step 2: Open SQL Editor
1. In your project dashboard, look for **"SQL Editor"** in the left sidebar
2. Click on it to open the SQL query interface

### Step 3: Create the Habits Table
Copy and paste this SQL query into the editor:

```sql
-- Create habits table
CREATE TABLE IF NOT EXISTS public.habits (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    start_date DATE NOT NULL,
    user_id UUID NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
);

-- Enable RLS on habits table
ALTER TABLE public.habits ENABLE ROW LEVEL SECURITY;

-- Create policy to allow users to see only their own habits
CREATE POLICY "Users can view their own habits" ON public.habits
    FOR SELECT USING (auth.uid() = user_id);

-- Create policy to allow users to insert their own habits
CREATE POLICY "Users can insert their own habits" ON public.habits
    FOR INSERT WITH CHECK (auth.uid() = user_id);

-- Create policy to allow users to update their own habits
CREATE POLICY "Users can update their own habits" ON public.habits
    FOR UPDATE USING (auth.uid() = user_id);

-- Create policy to allow users to delete their own habits
CREATE POLICY "Users can delete their own habits" ON public.habits
    FOR DELETE USING (auth.uid() = user_id);

-- Create index for better performance
CREATE INDEX IF NOT EXISTS idx_habits_user_id ON public.habits(user_id);

-- Create a function to automatically update the updated_at column
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = TIMEZONE('utc'::text, NOW());
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create trigger to automatically update updated_at
DROP TRIGGER IF EXISTS update_habits_updated_at ON public.habits;
CREATE TRIGGER update_habits_updated_at
    BEFORE UPDATE ON public.habits
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();
```

### Step 4: Execute the Query
1. Click the **"Run"** button (or press `Ctrl+Enter` / `Cmd+Enter`)
2. Wait for the success message

### Step 5: Verify the Table Creation
After running the SQL, you should see:
- ✅ "Success: Query completed successfully"
- The table should now appear in your **Table Editor** section

## 🔍 Test Your Setup

After creating the table, test your application:

1. **Refresh your Next.js app** (the development server should still be running)
2. **Try to add a new habit** - it should work now!
3. **Check the console** - the PGRST205 errors should be gone

## 🛠️ Alternative Setup Methods

### Method 2: Using Supabase Table Editor
1. Go to **Table Editor** in your Supabase dashboard
2. Click **"Create a new table"**
3. Name it `habits`
4. Add these columns:
   - `id` (UUID, Primary Key, Default: `uuid_generate_v4()`)
   - `name` (Text, Not null)
   - `start_date` (Date, Not null)
   - `user_id` (UUID, Not null)
   - `created_at` (Timestamp with timezone, Default: `now()`)
   - `updated_at` (Timestamp with timezone, Default: `now()`)
5. Enable RLS (Row Level Security)
6. Add the RLS policies manually (see SQL above)

### Method 3: Using the SQL File
You already have `supabase_schema.sql` in your project. You can:
1. Open that file
2. Copy its contents
3. Paste into Supabase SQL Editor

## 🚨 Common Issues & Solutions

### Issue: "Permission denied"
**Solution**: Make sure you're logged into the correct Supabase account and have admin access to the project.

### Issue: "Table already exists"
**Solution**: The SQL uses `CREATE TABLE IF NOT EXISTS`, so it should handle this gracefully.

### Issue: "RLS policies not working"
**Solution**: Make sure you have authentication set up in your Next.js app and users are properly logged in.

## 📞 Need Help?

If you encounter any issues:
1. Check the Supabase documentation: https://supabase.com/docs
2. Look at your browser console for specific error messages
3. Verify your environment variables in `.env` file
4. Make sure your Supabase project is properly configured

---

**Once you've completed these steps, your habit tracker should work perfectly!** 🎉