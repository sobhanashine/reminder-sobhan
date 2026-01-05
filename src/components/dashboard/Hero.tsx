"use client";

import { motion } from "framer-motion";
import { Sparkles, Quote, Brain } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { Button } from "@/components/ui/button";
import { supabase } from "@/lib/supabase";
import { LogOut } from "lucide-react";
import { useRouter } from "next/navigation";

// Accept data and loading as props
export default function Hero({
    data,
    loading
}: {
    data: { motivationalSentence: string; medicalFact: string } | null;
    loading: boolean;
}) {
    const router = useRouter();

    const handleLogout = async () => {
        await supabase.auth.signOut();
        router.push("/login");
    };

    return (
        <section className="mb-12 relative overflow-hidden rounded-3xl border border-white/10 bg-gradient-to-br from-emerald-950/40 via-black/60 to-black/60 p-8 backdrop-blur-2xl shadow-2xl">
            <div className="absolute -right-20 -top-20 h-64 w-64 rounded-full bg-emerald-500/10 blur-[80px] animate-pulse" />
            
            <div className="absolute top-4 left-4 z-20">
                <Button 
                    variant="ghost" 
                    size="sm" 
                    className="text-white/50 hover:text-white hover:bg-white/10 gap-2"
                    onClick={handleLogout}
                >
                    <LogOut className="h-4 w-4" />
                    <span>خروج</span>
                </Button>
            </div>

            <div className="relative z-10 flex flex-col gap-6 md:flex-row md:items-center md:justify-between">
                <div className="max-w-2xl w-full">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.5 }}
                    >
                        <h1 className="mb-4 text-3xl font-bold tracking-tight text-white md:text-5xl lg:text-6xl">
                            مسیر <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 to-cyan-400">اراده</span>
                        </h1>
                        <p className="text-lg text-muted-foreground md:text-xl max-w-lg mb-6">
                            هر روز یک قدم به نسخه بهتر خودت نزدیک‌تر شو.
                        </p>
                    </motion.div>

                    <div className="mt-8 grid gap-4 sm:grid-cols-2">
                        {/* Motivational Card */}
                        <Card className="border-white/10 bg-white/5 backdrop-blur-sm transition-all hover:bg-white/10 h-full">
                            <CardContent className="p-5 flex gap-4 items-start h-full">
                                <div className="p-2.5 rounded-xl bg-emerald-500/20 text-emerald-400 shadow-[0_0_15px_-3px_rgba(16,185,129,0.3)]">
                                    <Quote className="h-5 w-5" />
                                </div>
                                <div className="space-y-2 w-full">
                                    <p className="text-xs font-medium text-emerald-400/80 uppercase tracking-wider">انگیزه روز</p>
                                    {loading ? (
                                        <div className="space-y-2">
                                            <Skeleton className="h-4 w-full bg-white/10" />
                                            <Skeleton className="h-4 w-[80%] bg-white/10" />
                                        </div>
                                    ) : (
                                        <p className="text-sm text-gray-200 leading-relaxed">
                                            {data?.motivationalSentence}
                                        </p>
                                    )}
                                </div>
                            </CardContent>
                        </Card>

                        {/* Medical Fact Card */}
                        <Card className="border-white/10 bg-white/5 backdrop-blur-sm transition-all hover:bg-white/10 h-full">
                            <CardContent className="p-5 flex gap-4 items-start h-full">
                                <div className="p-2.5 rounded-xl bg-blue-500/20 text-blue-400 shadow-[0_0_15px_-3px_rgba(59,130,246,0.3)]">
                                    <Brain className="h-5 w-5" />
                                </div>
                                <div className="space-y-2 w-full">
                                    <p className="text-xs font-medium text-blue-400/80 uppercase tracking-wider">واقعیت علمی</p>
                                    {loading ? (
                                        <div className="space-y-2">
                                            <Skeleton className="h-4 w-full bg-white/10" />
                                            <Skeleton className="h-4 w-[90%] bg-white/10" />
                                        </div>
                                    ) : (
                                        <p className="text-sm text-gray-200 leading-relaxed">
                                            {data?.medicalFact}
                                        </p>
                                    )}
                                </div>
                            </CardContent>
                        </Card>
                    </div>
                </div>

                <div className="hidden lg:flex relative items-center justify-center p-8">
                    <div className="absolute inset-0 bg-emerald-500/20 blur-[100px] rounded-full animate-pulse" />
                    <motion.div
                        animate={{ rotate: 360 }}
                        transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
                        className="absolute inset-0 border border-dashed border-white/10 rounded-full w-[300px] h-[300px] m-auto opacity-30"
                    />
                    <div className="relative h-48 w-48 flex items-center justify-center rounded-full border border-white/10 bg-gradient-to-b from-white/5 to-transparent backdrop-blur-xl shadow-2xl">
                        <Sparkles className="h-20 w-20 text-emerald-400 drop-shadow-[0_0_20px_rgba(52,211,153,0.6)]" />
                    </div>
                </div>
            </div>
        </section>
    );
}
