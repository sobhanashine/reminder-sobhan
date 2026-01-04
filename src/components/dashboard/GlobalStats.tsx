"use client";

import { Habit } from "@/lib/storage";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Users, Activity, TrendingUp, Award } from "lucide-react";

interface GlobalStatsProps {
    habits: Habit[];
}

export default function GlobalStats({ habits }: GlobalStatsProps) {
    // Mock user count simulation (since we only have local storage for one "user" mostly)
    // We will treat all habits as "Global" for this demo.
    const uniqueHabits = new Set(habits.map(h => h.name)).size;
    const totalHabits = habits.length;

    // Find most common habit
    const counts: Record<string, number> = {};
    let mostCommon = "N/A";
    let maxCount = 0;

    habits.forEach(h => {
        counts[h.name] = (counts[h.name] || 0) + 1;
        if (counts[h.name] > maxCount) {
            maxCount = counts[h.name];
            mostCommon = h.name;
        }
    });

    const stats = [
        {
            title: "Total Tracked Habits",
            value: totalHabits,
            icon: Activity,
            color: "text-blue-400",
            bg: "bg-blue-500/10"
        },
        {
            title: "Unique Habits Types",
            value: uniqueHabits,
            icon: Users,
            color: "text-purple-400",
            bg: "bg-purple-500/10"
        },
        {
            title: "Success Rate (Est)",
            value: "85%",
            icon: TrendingUp,
            color: "text-emerald-400",
            bg: "bg-emerald-500/10"
        },
        {
            title: "Most Popular Quit",
            value: mostCommon,
            icon: Award,
            color: "text-amber-400",
            bg: "bg-amber-500/10"
        }
    ];

    return (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4 mb-8">
            {stats.map((stat, i) => (
                <Card key={i} className="border-white/10 bg-white/5 backdrop-blur-md">
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium text-muted-foreground">{stat.title}</CardTitle>
                        <div className={`p-2 rounded-full ${stat.bg}`}>
                            <stat.icon className={`h-4 w-4 ${stat.color}`} />
                        </div>
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold text-white">{stat.value}</div>
                    </CardContent>
                </Card>
            ))}
        </div>
    );
}
