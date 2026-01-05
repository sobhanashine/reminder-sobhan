import { supabase } from './supabase';

export interface Habit {
    id: string;
    name: string;
    startDate: string;
    user_id?: string;
}

export const defaultHabits: Habit[] = [
    {
        id: '1',
        name: 'سیگار',
        startDate: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString(),
    },
];

export const getHabits = async (): Promise<Habit[]> => {
    try {
        const { data: { user } } = await supabase.auth.getUser();
        if (!user) {
            console.warn('No authenticated user found');
            return [];
        }

        const { data, error } = await supabase
            .from('habits')
            .select('*')
            .order('created_at', { ascending: false });
        
        if (error) {
            console.error('Error fetching habits:', error.message, '| Code:', error.code, '| Details:', error.details);
            
            // Provide specific error messages for common issues
            if (error.code === 'PGRST205') {
                console.error('Database table not found. Please run the SQL schema from supabase_schema.sql');
            } else if (error.code === 'PGRST116') {
                console.error('Database connection issue. Please check your Supabase configuration.');
            }
            
            return [];
        }
        
        // Map database snake_case to frontend camelCase
        return (data || []).map(row => ({
            id: row.id,
            name: row.name,
            startDate: row.start_date,
            user_id: row.user_id
        }));
    } catch (error) {
        console.error('Unexpected error in getHabits:', error);
        return [];
    }
};

export const saveHabit = async (habit: Habit) => {
    try {
        const { data: { user } } = await supabase.auth.getUser();
        if (!user) {
            throw new Error('User not authenticated');
        }

        const { error } = await supabase
            .from('habits')
            .upsert({
                id: habit.id,
                name: habit.name,
                start_date: habit.startDate,
                user_id: user.id
            });

        if (error) {
            console.error('SQL Error details:', error.message, '| Code:', error.code, '| Details:', error.details);
            
            // Provide specific error messages for common issues
            if (error.code === 'PGRST205') {
                throw new Error('Database table not found. Please run the SQL schema from supabase_schema.sql');
            } else if (error.code === 'PGRST116') {
                throw new Error('Database connection issue. Please check your Supabase configuration.');
            }
            
            throw error;
        }
    } catch (error) {
        if (error instanceof Error) {
            throw error;
        }
        throw new Error('Unexpected error while saving habit');
    }
};

export const deleteHabit = async (id: string) => {
    const { error } = await supabase
        .from('habits')
        .delete()
        .eq('id', id);

    if (error) {
        console.error('Error deleting habit:', error);
        throw error;
    }
};

