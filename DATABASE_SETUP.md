# Database Setup Guide

## Problem Analysis
The errors you're experiencing are due to the missing `public.habits` table in your Supabase database. The error code `PGRST205` specifically indicates that the table doesn't exist in the schema cache.

## Solution

### Step 1: Create the Habits Table
You need to run the SQL schema provided in `supabase_schema.sql` in your Supabase dashboard.

1. Go to your Supabase dashboard: https://app.supabase.com
2. Navigate to your project
3. Go to "SQL Editor" from the left sidebar
4. Copy and paste the contents of `supabase_schema.sql` (located in your project root)
5. Click "Run" to execute the SQL commands

### Step 2: Verify Table Creation
After running the SQL, you can verify the table was created by:

1. Going to "Table Editor" in Supabase
2. You should see a `habits` table with the following columns:
   - `id` (UUID, primary key)
   - `name` (Text)
   - `start_date` (Timestamp with timezone)
   - `user_id` (UUID)
   - `created_at` (Timestamp with timezone)
   - `updated_at` (Timestamp with timezone)

### Step 3: Test the Application
After creating the table, restart your development server:

```bash
npm run dev
```

## Enhanced Error Handling
I've also improved the error handling in your application:

1. **Better error messages** in `storage.ts` with specific handling for:
   - Table not found errors (PGRST205)
   - Database connection issues (PGRST116)
   - Authentication errors

2. **Improved user feedback** in `page.tsx` with Persian error messages that are more user-friendly

3. **Comprehensive error logging** to help with debugging

## Common Issues and Solutions

### Issue: "Could not find the table 'public.habits'"
**Solution**: Run the SQL schema from `supabase_schema.sql`

### Issue: "User not authenticated"
**Solution**: Make sure users are logged in before trying to save habits

### Issue: Database connection errors
**Solution**: Verify your environment variables in `.env` file:
- `NEXT_PUBLIC_SUPABASE_URL`
- `NEXT_PUBLIC_SUPABASE_ANON_KEY`

## Security Features
The schema includes:
- Row Level Security (RLS) policies
- Automatic user ID assignment
- Updated timestamp management
- Proper indexing for performance

## Next Steps
1. Run the SQL schema in Supabase
2. Test adding a new habit
3. Verify data is being saved correctly
4. Check that habits are displayed properly

If you encounter any issues after following these steps, please share the new error messages and I'll help you resolve them.