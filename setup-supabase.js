// Simple script to help set up your Supabase database
const { createClient } = require('@supabase/supabase-js');

// Your Supabase credentials from .env
const supabaseUrl = 'https://kbvvakgywgvilvttpckl.supabase.co';
const supabaseKey = 'sb_publishable_iR3XNXkT0ZOiYaBX7gGfGQ_cbvI1mpP';

const supabase = createClient(supabaseUrl, supabaseKey);

async function setupDatabase() {
    console.log('🚀 Setting up your Supabase database...');
    
    try {
        // SQL to create the habits table with RLS policies
        const sql = `
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
`;

        console.log('📋 SQL Schema to execute:');
        console.log(sql);
        console.log('\n' + '='.repeat(60));
        
        console.log('\n📝 Manual Setup Instructions:');
        console.log('1. Go to your Supabase dashboard: https://app.supabase.com');
        console.log('2. Select your project');
        console.log('3. Navigate to SQL Editor from the left sidebar');
        console.log('4. Copy and paste the SQL above into the editor');
        console.log('5. Click "Run" to execute the query');
        console.log('\n✨ After running the SQL, your habits table will be created!');
        
        // Try to test the connection
        console.log('\n🔍 Testing connection...');
        const { data, error } = await supabase.from('habits').select('*').limit(1);
        
        if (error && error.code === 'PGRST205') {
            console.log('❌ Table not found - you need to run the SQL above');
        } else if (error) {
            console.log('❌ Connection error:', error.message);
        } else {
            console.log('✅ Connection successful! Table exists.');
        }
        
    } catch (error) {
        console.error('❌ Error:', error.message);
    }
}

setupDatabase();