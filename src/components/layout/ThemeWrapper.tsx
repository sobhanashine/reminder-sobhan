"use client";

import { useEffect, useState } from "react";
import { ThemeProvider } from "@/components/theme-provider";
import { Toaster } from "@/components/ui/sonner";
import { usePathname, useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { LayoutDashboard, Settings, LogOut, Menu } from "lucide-react";
import { cn } from "@/lib/utils";
import Link from "next/link";
import {
    Sheet,
    SheetContent,
    SheetTrigger,
} from "@/components/ui/sheet";

import { supabase } from "@/lib/supabase";

export default function ThemeWrapper({ children }: { children: React.ReactNode }) {
    const pathname = usePathname();
    const router = useRouter();
    const [mounted, setMounted] = useState(false);
    const isAuthPage = pathname === "/login" || pathname === "/register";

    // Use useEffect for client-side authentication logic
    useEffect(() => {
        // Use a microtask to set mounted state, avoiding direct setState in effect
        Promise.resolve().then(() => {
            setMounted(true);
        });
        
        const checkAuth = async () => {
            const { data } = await supabase.auth.getSession();
            if (!data.session && !isAuthPage) {
                router.push("/login");
            }
        };

        checkAuth();

        // Listen for auth changes
        const { data: { subscription } } = supabase.auth.onAuthStateChange((event) => {
            if (event === 'SIGNED_OUT' && !isAuthPage) {
                router.push("/login");
            }
        });

        return () => subscription.unsubscribe();
    }, [pathname, isAuthPage, router]);

    const handleLogout = async () => {
        await supabase.auth.signOut();
        router.push("/login");
    };

    if (!mounted) {
        return <>{children}</>;
    }

    if (isAuthPage) {
        return (
            <ThemeProvider
                attribute="class"
                defaultTheme="dark"
                enableSystem={false}
                disableTransitionOnChange
            >
                {children}
                <Toaster />
            </ThemeProvider>
        );
    }

    return (
        <ThemeProvider
            attribute="class"
            defaultTheme="dark"
            enableSystem={false}
            disableTransitionOnChange
        >
            <div className="min-h-screen bg-black font-sans text-foreground relative isolate flex" dir="rtl">
                {/* Animated Background Gradients */}
                <div className="fixed inset-0 -z-10 overflow-hidden pointer-events-none">
                    <div className="absolute top-[-10%] left-[-10%] w-[500px] h-[500px] bg-emerald-500/10 rounded-full blur-[100px] animate-pulse" />
                    <div className="absolute bottom-[-10%] right-[-10%] w-[500px] h-[500px] bg-emerald-700/10 rounded-full blur-[100px] animate-pulse" style={{ animationDelay: '2s' }} />
                </div>

                {/* Desktop Sidebar */}
                <aside className="hidden md:flex w-64 flex-col border-l border-white/5 bg-white/5 backdrop-blur-xl h-screen sticky top-0">
                    <div className="p-6">
                        <h1 className="text-2xl font-bold bg-gradient-to-r from-emerald-400 to-emerald-600 bg-clip-text text-transparent">
                            مسیر سلامتی
                        </h1>
                    </div>

                    <nav className="flex-1 px-4 space-y-2">
                        <Link href="/">
                            <Button variant={pathname === "/" ? "secondary" : "ghost"} className={cn("w-full justify-start gap-2", pathname === "/" && "bg-white/10 text-emerald-400")}>
                                <LayoutDashboard className="h-4 w-4" />
                                داشبورد
                            </Button>
                        </Link>
                        <Link href="#">
                            <Button variant="ghost" className="w-full justify-start gap-2 text-muted-foreground hover:text-white" disabled>
                                <Settings className="h-4 w-4" />
                                تنظیمات (به زودی)
                            </Button>
                        </Link>
                    </nav>

                    <div className="p-4 border-t border-white/5">
                        <Button
                            variant="destructive"
                            className="w-full justify-start gap-2 bg-red-500/10 text-red-400 hover:bg-red-500/20 hover:text-red-300 border border-red-500/20"
                            onClick={handleLogout}
                        >
                            <LogOut className="h-4 w-4" />
                            خروج از حساب
                        </Button>
                    </div>
                </aside>

                {/* Mobile Header */}
                <div className="md:hidden fixed top-0 w-full z-50 border-b border-white/5 bg-black/50 backdrop-blur-xl flex items-center justify-between p-4">
                    <span className="font-bold text-emerald-500">مسیر سلامتی</span>
                    <Sheet>
                        <SheetTrigger asChild>
                            <Button variant="ghost" size="icon"><Menu /></Button>
                        </SheetTrigger>
                        <SheetContent side="right" className="bg-black/90 border-white/10 text-white w-64 p-0 flex flex-col">
                            <div className="p-6">
                                <h2 className="text-xl font-bold text-emerald-500">منو</h2>
                            </div>
                            <nav className="flex-1 px-4 space-y-2">
                                <Link href="/">
                                    <Button variant="ghost" className="w-full justify-start gap-2 text-right">
                                        <LayoutDashboard className="h-4 w-4" />
                                        داشبورد
                                    </Button>
                                </Link>
                            </nav>
                            <div className="p-4 border-t border-white/5">
                                <Button
                                    variant="destructive"
                                    className="w-full justify-start gap-2"
                                    onClick={handleLogout}
                                >
                                    <LogOut className="h-4 w-4" />
                                    خروج
                                </Button>
                            </div>
                        </SheetContent>
                    </Sheet>
                </div>

                {/* Main Content */}
                <main className="flex-1 p-4 md:p-8 pt-20 md:pt-8 w-full max-w-7xl mx-auto">
                    {children}
                </main>

                <Toaster />
            </div>
        </ThemeProvider>
    );
}
