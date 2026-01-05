"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Lock, User, UserPlus, ArrowRight } from "lucide-react";
import { toast } from "sonner";
import { supabase } from "@/lib/supabase";
import Link from "next/link";

export default function RegisterPage() {
    const router = useRouter();
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [isLoading, setIsLoading] = useState(false);

    const handleRegister = async (e: React.FormEvent) => {
        e.preventDefault();
        
        if (password !== confirmPassword) {
            toast.error("خطا", { description: "رمز عبور و تکرار آن یکسان نیستند." });
            return;
        }

        setIsLoading(true);

        const { error } = await supabase.auth.signUp({
            email,
            password,
        });

        if (error) {
            toast.error("خطا در ثبت‌نام", {
                description: error.message,
            });
            setIsLoading(false);
        } else {
            toast.success("ثبت‌نام موفقیت‌آمیز بود!", {
                description: "اکنون می‌توانید وارد شوید.",
            });
            setTimeout(() => {
                router.push("/login");
            }, 1000);
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center p-4 relative overflow-hidden bg-black font-sans dir-rtl">
            {/* Background Effects */}
            <div className="absolute inset-0 -z-10">
                <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-blue-600/20 rounded-full blur-[128px] animate-pulse" />
                <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-emerald-600/10 rounded-full blur-[128px] animate-pulse" style={{ animationDelay: "2s" }} />
            </div>

            <Card className="w-full max-w-md bg-white/5 backdrop-blur-xl border-white/10 text-foreground shadow-2xl">
                <CardHeader className="text-center space-y-2">
                    <div className="mx-auto bg-blue-500/10 p-3 rounded-full w-fit mb-2">
                        <UserPlus className="w-8 h-8 text-blue-500" />
                    </div>
                    <CardTitle className="text-2xl font-bold text-white">ایجاد حساب جدید</CardTitle>
                    <CardDescription className="text-muted-foreground">
                        برای شروع مدیریت عادت‌های خود ثبت‌نام کنید
                    </CardDescription>
                </CardHeader>
                <form onSubmit={handleRegister}>
                    <CardContent className="space-y-4">
                        <div className="space-y-2 text-right">
                            <Label htmlFor="email">ایمیل</Label>
                            <div className="relative">
                                <User className="absolute right-3 top-3 h-4 w-4 text-muted-foreground" />
                                <Input
                                    id="email"
                                    type="email"
                                    placeholder="email@example.com"
                                    className="pr-9 bg-black/20 border-white/10 focus-visible:ring-blue-500 text-right"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    disabled={isLoading}
                                    required
                                />
                            </div>
                        </div>
                        <div className="space-y-2 text-right">
                            <Label htmlFor="password">رمز عبور</Label>
                            <div className="relative">
                                <Lock className="absolute right-3 top-3 h-4 w-4 text-muted-foreground" />
                                <Input
                                    id="password"
                                    type="password"
                                    placeholder="رمز عبور (حداقل ۶ کاراکتر)"
                                    className="pr-9 bg-black/20 border-white/10 focus-visible:ring-blue-500 text-right"
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    disabled={isLoading}
                                    required
                                    minLength={6}
                                />
                            </div>
                        </div>
                        <div className="space-y-2 text-right">
                            <Label htmlFor="confirmPassword">تکرار رمز عبور</Label>
                            <div className="relative">
                                <Lock className="absolute right-3 top-3 h-4 w-4 text-muted-foreground" />
                                <Input
                                    id="confirmPassword"
                                    type="password"
                                    placeholder="تکرار رمز عبور"
                                    className="pr-9 bg-black/20 border-white/10 focus-visible:ring-blue-500 text-right"
                                    value={confirmPassword}
                                    onChange={(e) => setConfirmPassword(e.target.value)}
                                    disabled={isLoading}
                                    required
                                />
                            </div>
                        </div>
                    </CardContent>
                    <CardFooter className="flex flex-col gap-4">
                        <Button
                            type="submit"
                            className="w-full bg-blue-600 hover:bg-blue-500 text-white transition-all shadow-[0_0_20px_rgba(37,99,235,0.3)]"
                            disabled={isLoading}
                        >
                            {isLoading ? "در حال ثبت‌نام..." : (
                                <>
                                    ثبت‌نام <UserPlus className="mr-2 h-4 w-4 ml-2" />
                                </>
                            )}
                        </Button>
                        <Link href="/login" className="text-sm text-muted-foreground hover:text-white transition-colors flex items-center gap-2">
                            قبلاً حساب داشته‌اید؟ وارد شوید <ArrowRight className="h-4 w-4" />
                        </Link>
                    </CardFooter>
                </form>
            </Card>
        </div>
    );
}
