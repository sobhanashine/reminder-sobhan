"use client";

import { Habit, deleteHabit, saveHabit } from "@/lib/storage";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Trash2, Flame, Calendar, RotateCcw, Share2, Copy } from "lucide-react";
import { motion, useTransform, useMotionValue, animate } from "framer-motion";
import { useState, useEffect } from "react";
import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
    AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { toast } from "sonner";
import { toPersianDate, toPersianDigits, getHabitEmoji } from "@/lib/utils"; // Added getHabitEmoji

interface HabitCardProps {
    habit: Habit;
    onUpdate: () => void;
    isAdmin?: boolean;
}

function AnimatedCounter({ value }: { value: number }) {
    const count = useMotionValue(0);
    const rounded = useTransform(count, (latest) => toPersianDigits(Math.round(latest)));

    useEffect(() => {
        const controls = animate(count, value, { duration: 1.5, ease: "easeOut" });
        return controls.stop;
    }, [value, count]);

    return <motion.span>{rounded}</motion.span>;
}

export default function HabitCard({ habit, onUpdate, isAdmin }: HabitCardProps) {
    // Use useState with a function that calculates initial state once
    const [days, setDays] = useState(() => {
        // This function runs only once during the initial render on the client
        return Math.floor((Date.now() - new Date(habit.startDate).getTime()) / (1000 * 60 * 60 * 24));
    });

    useEffect(() => {
        // Update days when habit.startDate changes, using a callback to avoid direct setState
        const updateDays = () => {
            const calculatedDays = Math.floor((Date.now() - new Date(habit.startDate).getTime()) / (1000 * 60 * 60 * 24));
            setDays(calculatedDays);
        };
        
        updateDays();
        
        // Set up a timer to update days periodically
        const timer = setInterval(updateDays, 60000); // Update every minute

        return () => clearInterval(timer);
    }, [habit.startDate]);

    const handleDelete = async (e?: React.MouseEvent) => {
        e?.stopPropagation();
        try {
            await deleteHabit(habit.id);
            onUpdate();
            toast.error("عادت حذف شد.");
        } catch (error) {
            console.error(error);
            toast.error("خطا در حذف عادت");
        }
    };

    const handleReset = async (e?: React.MouseEvent) => {
        e?.stopPropagation();
        try {
            const updatedHabit = { ...habit, startDate: new Date().toISOString() };
            await saveHabit(updatedHabit); // Now correctly updates instead of duplicating
            onUpdate(); // This will trigger a re-render with the new start date
            toast.info("روزشمار صفر شد. دوباره شروع کن!");
        } catch (error) {
            console.error(error);
            toast.error("خطا در بروزرسانی عادت");
        }
    };

    const handleShare = () => {
        const text = `من ${toPersianDigits(days)} روز است که ${habit.name} را ترک کرده‌ام! تو هم شروع کن.`;
        navigator.clipboard.writeText(text);
        toast.success("متن کپی شد!", {
            icon: <Copy className="h-4 w-4" />,
        });
    };

    const progress = Math.min((days / 21) * 100, 100);
    const color = days >= 21 ? "text-emerald-500" : "text-amber-500";
    const strokeColor = days >= 21 ? "#10b981" : "#f59e0b";
    const showFire = days > 3;
    const emoji = getHabitEmoji(habit.name); // Get Dynamic Emoji

    return (
        <motion.div
            layout
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.9 }}
            whileHover={{ y: -5 }}
            transition={{ duration: 0.2 }}
        >
            <Card className="relative overflow-hidden border-white/5 bg-white/5 backdrop-blur-xl transition-all duration-500 hover:bg-white/10 hover:shadow-[0_0_30px_-5px_rgba(16,185,129,0.1)] group">
                {/* Subtle glow effect */}
                <div className="absolute inset-0 bg-gradient-to-br from-white/5 to-transparent opacity-0 transition-opacity duration-500 group-hover:opacity-100" />

                <CardContent className="p-6 relative z-10 flex flex-col items-center justify-center gap-4">
                    {/* Share Button (Top Right) */}
                    <Button
                        variant="ghost"
                        size="icon"
                        onClick={handleShare}
                        className="absolute top-2 right-2 text-muted-foreground hover:text-white hover:bg-white/10 rounded-full h-8 w-8 transition-colors"
                        title="اشتراک گذاری"
                    >
                        <Share2 className="h-4 w-4" />
                    </Button>

                    {/* Progress Ring */}
                    <div className="relative h-32 w-32 flex items-center justify-center">
                        <svg className="h-full w-full -rotate-90" viewBox="0 0 100 100">
                            <circle cx="50" cy="50" r="45" fill="none" stroke="currentColor" strokeWidth="8" className="text-white/5" />
                            <motion.circle
                                cx="50" cy="50" r="45"
                                fill="none"
                                stroke={strokeColor}
                                strokeWidth="8"
                                strokeDasharray="283"
                                strokeDashoffset={283 - (283 * progress) / 100}
                                strokeLinecap="round"
                                initial={{ strokeDashoffset: 283 }}
                                animate={{ strokeDashoffset: 283 - (283 * progress) / 100 }}
                                transition={{ duration: 1.5, ease: "easeOut" }}
                            />
                        </svg>
                        <div className="absolute inset-0 flex flex-col items-center justify-center">
                            {showFire ? (
                                <motion.div
                                    initial={{ scale: 0 }}
                                    animate={{ scale: 1 }}
                                    transition={{ type: "spring", stiffness: 200, damping: 10 }}
                                >
                                    <Flame className={`h-8 w-8 ${color} drop-shadow-[0_0_8px_rgba(245,158,11,0.5)]`} />
                                </motion.div>
                            ) : (
                                <div className="text-2xl animate-bounce">{emoji}</div>
                            )}

                            <div className={`text-3xl font-bold ${color} flex items-center gap-1`}>
                                <AnimatedCounter value={days} />
                            </div>
                            <span className="text-[10px] text-muted-foreground uppercase tracking-widest font-bold">روز</span>
                        </div>
                    </div>

                    <div className="text-center z-10">
                        <h3 className="font-bold text-xl text-foreground mb-1">{habit.name}</h3>
                        <div className="flex items-center justify-center gap-1.5 text-xs text-muted-foreground/80 bg-black/20 px-3 py-1 rounded-full">
                            <Calendar className="h-3 w-3" />
                            <span dir="ltr">{toPersianDate(habit.startDate)}</span>
                        </div>
                    </div>
                </CardContent>
                <CardFooter className="p-4 pt-0 justify-center h-10 gap-2 relative z-10">
                    <AlertDialog>
                        <AlertDialogTrigger asChild>
                            <Button
                                variant="ghost"
                                size="sm"
                                className="w-full text-amber-500 hover:text-amber-400 hover:bg-amber-500/10 opacity-0 group-hover:opacity-100 transition-all duration-300"
                            >
                                <RotateCcw className="h-4 w-4 mr-2" />
                                بازنشانی
                            </Button>
                        </AlertDialogTrigger>
                        <AlertDialogContent className="bg-black/90 border-white/10 backdrop-blur-xl text-white">
                            <AlertDialogHeader>
                                <AlertDialogTitle className="text-right">آیا مطمئنی؟</AlertDialogTitle>
                                <AlertDialogDescription className="text-gray-400 text-right">
                                    این کار باعث می‌شود روز‌شمار شما صفر شود. آیا لغزشی اتفاق افتاد؟
                                </AlertDialogDescription>
                            </AlertDialogHeader>
                            <AlertDialogFooter className="flex-row-reverse sm:justify-start gap-2">
                                <AlertDialogAction onClick={(e) => handleReset(e)} className="bg-amber-600 hover:bg-amber-700">بله، صفر کن</AlertDialogAction>
                                <AlertDialogCancel onClick={(e) => e.stopPropagation()} className="bg-white/10 text-white hover:bg-white/20 border-0 mt-0">نه، اشتباه شد</AlertDialogCancel>
                            </AlertDialogFooter>
                        </AlertDialogContent>
                    </AlertDialog>

                    {isAdmin && (
                        <AlertDialog>
                            <AlertDialogTrigger asChild>
                                <Button
                                    variant="ghost"
                                    size="sm"
                                    onClick={(e) => e.stopPropagation()}
                                    className="w-full text-red-400 hover:text-red-300 hover:bg-red-500/10 opacity-0 group-hover:opacity-100 transition-all duration-300"
                                >
                                    <Trash2 className="h-4 w-4 mr-2" />
                                    حذف
                                </Button>
                            </AlertDialogTrigger>
                            <AlertDialogContent className="bg-black/90 border-white/10 backdrop-blur-xl text-white">
                                <AlertDialogHeader>
                                    <AlertDialogTitle className="text-right">حذف عادت؟</AlertDialogTitle>
                                    <AlertDialogDescription className="text-gray-400 text-right">
                                        آیا مطمئن هستید که می‌خواهید این عادت را برای همیشه حذف کنید؟ این کار قابل بازگشت نیست.
                                    </AlertDialogDescription>
                                </AlertDialogHeader>
                                <AlertDialogFooter className="flex-row-reverse sm:justify-start gap-2">
                                    <AlertDialogAction onClick={(e) => handleDelete(e)} className="bg-red-600 hover:bg-red-700">بله، حذف کن</AlertDialogAction>
                                    <AlertDialogCancel onClick={(e) => e.stopPropagation()} className="bg-white/10 text-white hover:bg-white/20 border-0 mt-0">خیر</AlertDialogCancel>
                                </AlertDialogFooter>
                            </AlertDialogContent>
                        </AlertDialog>
                    )}
                </CardFooter>
            </Card>
        </motion.div>
    );
}
