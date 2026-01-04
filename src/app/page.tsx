"use client";

import { useEffect, useState } from "react";
import Hero from "@/components/dashboard/Hero";
import HabitCard from "@/components/dashboard/HabitCard";
import { Habit, getHabits, saveHabit } from "@/lib/storage";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Plus, Medal, Trophy } from "lucide-react";
import { AnimatePresence } from "framer-motion";
import { toast } from "sonner";
import { toPersianDate } from "@/lib/utils";
import DatePicker, { DateObject } from "react-multi-date-picker";
import persian from "react-date-object/calendars/persian";
import persian_fa from "react-date-object/locales/persian_fa";

export default function Home() {
  const [habits, setHabits] = useState<Habit[]>([]);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [newHabitName, setNewHabitName] = useState("");

  // DatePicker state managed with DateObject
  const [startDate, setStartDate] = useState<DateObject | null>(new DateObject({ calendar: persian, locale: persian_fa }));

  // AI State (Lifted from Hero)
  const [aiData, setAiData] = useState<{ motivationalSentence: string; medicalFact: string } | null>(null);
  const [aiLoading, setAiLoading] = useState(true);

  const refreshHabits = () => {
    setHabits(getHabits());
  };

  // Fetch AI Data
  const fetchAI = async (currentHabits: Habit[]) => {
    setAiLoading(true);
    try {
      const habitsPayload = currentHabits.map(h => {
        const days = Math.floor((Date.now() - new Date(h.startDate).getTime()) / (1000 * 60 * 60 * 24));
        return { name: h.name, days: Math.max(0, days) };
      });

      const res = await fetch('/api/gemini', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ habits: habitsPayload })
      });
      const result = await res.json();
      setAiData(result);
    } catch (e) {
      console.error("AI Fetch Error:", e);
    } finally {
      setAiLoading(false);
    }
  };

  useEffect(() => {
    refreshHabits();
    // Reset date to today on mount
    setStartDate(new DateObject({ calendar: persian, locale: persian_fa }));
  }, []);

  // Reactive Effect: Fetch AI whenever habits change (Add, Delete, Reset triggers refreshHabits -> setHabits -> this effect)
  useEffect(() => {
    // We fetch even if empty to get the welcome message
    fetchAI(habits);
  }, [habits]);


  const handleAddHabit = () => {
    if (!newHabitName.trim()) {
      toast.error("لطفا نام عادت را وارد کنید");
      return;
    }

    let finalStartDate = new Date().toISOString();

    if (startDate) {
      finalStartDate = startDate.toDate().toISOString();
    } else {
      finalStartDate = new Date().toISOString();
    }

    const newHabit: Habit = {
      id: crypto.randomUUID(),
      name: newHabitName,
      startDate: finalStartDate,
    };

    saveHabit(newHabit);
    setNewHabitName("");
    setStartDate(new DateObject({ calendar: persian, locale: persian_fa }));
    setIsDialogOpen(false);
    refreshHabits(); // This triggers state update -> triggers useEffect -> triggers fetchAI

    toast.success("عادت جدید ثبت شد!", {
      description: `مسیر ترک "${newHabitName}" با موفقیت شروع شد.`,
      duration: 4000,
      className: "bg-emerald-950 border-emerald-800 text-white",
    });
  };

  // Gamification Logic
  const maxDays = habits.reduce((max, h) => {
    const days = Math.floor((Date.now() - new Date(h.startDate).getTime()) / (1000 * 60 * 60 * 24));
    return Math.max(max, days);
  }, 0);

  const badges = [
    { threshold: 7, label: "هفته اول (برنز)", color: "text-amber-700", bg: "bg-amber-700/20", icon: Medal, earned: maxDays >= 7 },
    { threshold: 14, label: "دو هفته (نقره)", color: "text-slate-400", bg: "bg-slate-400/20", icon: Medal, earned: maxDays >= 14 },
    { threshold: 30, label: "یک ماه (طلا)", color: "text-yellow-400", bg: "bg-yellow-400/20", icon: Trophy, earned: maxDays >= 30 },
  ];

  return (
    <div className="space-y-8 pb-12">
      <Hero data={aiData} loading={aiLoading} />

      {/* Badges Section */}
      <div className="flex gap-4 items-center overflow-x-auto pb-4 scrollbar-hide">
        {badges.map((badge, i) => (
          <div
            key={i}
            className={`flex items-center gap-2 px-4 py-2 rounded-full border border-white/5 whitespace-nowrap transition-all ${badge.earned ? `${badge.bg} ${badge.color} border-${badge.color.split('-')[1]}-500/30 shadow-[0_0_10px_rgba(255,255,255,0.1)]` : 'bg-white/5 text-muted-foreground opacity-50 grayscale'}`}
          >
            <badge.icon className="h-4 w-4" />
            <span className="text-xs font-bold">{badge.label}</span>
            {!badge.earned && <span className="text-[10px] ml-1">({badge.threshold} روز)</span>}
          </div>
        ))}
      </div>

      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold tracking-tight text-white flex items-center gap-2">
          <span>عادت‌های من</span>
          <span className="text-sm font-normal text-muted-foreground mr-2 bg-white/5 px-2 py-0.5 rounded-md">
            {habits.length}
          </span>
        </h2>

        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button className="bg-emerald-600 hover:bg-emerald-500 text-white shadow-[0_0_20px_rgba(16,185,129,0.3)] transition-all hover:scale-105">
              <Plus className="mr-2 h-4 w-4 ml-2" /> شروع مسیر جدید
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[425px] bg-black/80 backdrop-blur-xl border-white/10 text-white">
            <DialogHeader>
              <DialogTitle className="text-emerald-400 text-right">شروع یک مسیر جدید</DialogTitle>
              <DialogDescription className="text-gray-400 text-right">
                جزئیات عادت جدیدت رو وارد کن.
              </DialogDescription>
            </DialogHeader>
            <div className="grid gap-4 py-4 text-right">
              <div className="grid gap-2">
                <Label htmlFor="name">چه عادتی رو میخوای ترک کنی؟</Label>
                <Input
                  id="name"
                  placeholder="مثلاً: سیگار، پرخوری، تاخیر..."
                  value={newHabitName}
                  onChange={(e) => setNewHabitName(e.target.value)}
                  className="bg-white/5 border-white/10 focus-visible:ring-emerald-500 text-right"
                  autoFocus
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="date">تاریخ شروع</Label>
                <div style={{ direction: "rtl" }}>
                  <DatePicker
                    calendar={persian}
                    locale={persian_fa}
                    calendarPosition="bottom-right"
                    value={startDate}
                    onChange={setStartDate}
                    format="YYYY/MM/DD"
                    containerClassName="w-full"
                    inputClass="flex h-9 w-full rounded-md border border-white/10 bg-white/5 px-3 py-1 text-sm shadow-sm transition-colors file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-emerald-500 disabled:cursor-not-allowed disabled:opacity-50 text-right text-white"
                    placeholder="انتخاب تاریخ"
                  />
                </div>
                <p className="text-xs text-muted-foreground">اگر قبلاً شروع کردی، تاریخ گذشته رو وارد کن.</p>
              </div>
            </div>
            <DialogFooter>
              <Button type="submit" onClick={handleAddHabit} className="bg-emerald-600 hover:bg-emerald-500 w-full sm:w-auto">
                شروع کن 💪
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>

      {/* Habits Grid */}
      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
        <AnimatePresence mode="popLayout">
          {habits.map((habit) => (
            <HabitCard
              key={habit.id}
              habit={habit}
              onUpdate={refreshHabits}
              isAdmin={true}
            />
          ))}
        </AnimatePresence>
      </div>

      {habits.length === 0 && (
        <div className="flex flex-col items-center justify-center py-20 border border-dashed border-white/10 rounded-3xl bg-white/5 text-center px-4">
          <div className="h-16 w-16 rounded-full bg-white/5 flex items-center justify-center mb-4">
            <Plus className="h-8 w-8 text-muted-foreground" />
          </div>
          <p className="text-lg font-medium text-white mb-1">هنوز هیچ عادتی ثبت نکردی</p>
          <p className="text-muted-foreground max-w-sm">
            منتظر چی هستی؟ همین الان اولین قدم رو برای تغییر زندگیت بردار.
          </p>
        </div>
      )}
    </div>
  );
}
