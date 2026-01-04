"use client";

import { useEffect, useState } from "react";
import { Habit, getHabits, deleteHabit, getUserRole } from "@/lib/storage";
import { Button } from "@/components/ui/button";
import {
    Table,
    TableBody,
    TableCaption,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table";
import { Trash2, ArrowRight } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";

export default function AdminPage() {
    const [habits, setHabits] = useState<Habit[]>([]);
    const router = useRouter();

    const refreshHabits = () => {
        setHabits(getHabits());
    };

    useEffect(() => {
        // RBAC Check
        const role = getUserRole();
        if (role !== 'admin') {
            router.push('/');
            return;
        }
        refreshHabits();
    }, [router]);

    const handleDelete = (id: string) => {
        deleteHabit(id);
        refreshHabits();
    };

    return (
        <div className="space-y-8">
            <div className="flex items-center justify-between">
                <h1 className="text-3xl font-bold text-white">پنل مدیریت (Admin)</h1>
                <Link href="/">
                    <Button variant="ghost">
                        <ArrowRight className="ml-2 h-4 w-4" /> بازگشت به داشبورد
                    </Button>
                </Link>
            </div>

            <div className="rounded-xl border border-white/10 bg-white/5 p-4 backdrop-blur-md">
                <Table>
                    <TableCaption>لیست تمام عادت‌های کاربران (All Habits)</TableCaption>
                    <TableHeader>
                        <TableRow className="hover:bg-white/5 border-white/10">
                            <TableHead className="text-right text-emerald-400">شناسه</TableHead>
                            <TableHead className="text-right text-emerald-400">نام عادت</TableHead>
                            <TableHead className="text-right text-emerald-400">تاریخ شروع</TableHead>
                            <TableHead className="text-right text-emerald-400">روزهای سپری شده</TableHead>
                            <TableHead className="text-right text-emerald-400">عملیات</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {habits.map((habit) => {
                            const days = Math.floor((Date.now() - new Date(habit.startDate).getTime()) / (1000 * 60 * 60 * 24));
                            return (
                                <TableRow key={habit.id} className="hover:bg-emerald-500/5 border-white/10">
                                    <TableCell className="font-mono text-xs text-muted-foreground">{habit.id.slice(0, 8)}...</TableCell>
                                    <TableCell className="font-medium text-white">{habit.name}</TableCell>
                                    <TableCell className="text-gray-300">{new Date(habit.startDate).toLocaleDateString()}</TableCell>
                                    <TableCell className="text-gray-300">{days} روز</TableCell>
                                    <TableCell>
                                        <Button
                                            variant="destructive"
                                            size="sm"
                                            onClick={() => handleDelete(habit.id)}
                                            className="bg-red-500/20 text-red-400 hover:bg-red-500/40 hover:text-red-200"
                                        >
                                            <Trash2 className="h-4 w-4" />
                                        </Button>
                                    </TableCell>
                                </TableRow>
                            );
                        })}
                    </TableBody>
                </Table>
            </div>
        </div>
    );
}
