export interface Habit {
    id: string;
    name: string;
    startDate: string;
}

const STORAGE_KEY = 'habits';

export const defaultHabits: Habit[] = [
    {
        id: '1',
        name: 'سیگار',
        startDate: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString(),
    },
];

export const getHabits = (): Habit[] => {
    if (typeof window === 'undefined') return [];
    const stored = localStorage.getItem(STORAGE_KEY);
    if (!stored) {
        // Initialize with defaults if empty
        localStorage.setItem(STORAGE_KEY, JSON.stringify(defaultHabits));
        return defaultHabits;
    }
    return JSON.parse(stored);
};

export const saveHabit = (habit: Habit) => {
    const habits = getHabits();
    const index = habits.findIndex((h) => h.id === habit.id);

    if (index >= 0) {
        // Update existing
        habits[index] = habit;
    } else {
        // Insert new
        habits.push(habit);
    }

    localStorage.setItem(STORAGE_KEY, JSON.stringify(habits));
};

export const deleteHabit = (id: string) => {
    const habits = getHabits();
    const filtered = habits.filter((h) => h.id !== id);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(filtered));
};
