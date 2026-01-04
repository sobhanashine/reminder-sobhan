"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Lock, User, LogIn } from "lucide-react";
import { toast } from "sonner";

export default function LoginPage() {
    const router = useRouter();
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const [isLoading, setIsLoading] = useState(false);

    const handleLogin = (e: React.FormEvent) => {
        e.preventDefault();
        setIsLoading(true);

        // Hardcoded credentials as requested
        if (username === "sobhanashine" && password === "Sobhan1234") {
            localStorage.setItem("authToken", "true"); // Simple session flag
            toast.success("خوش آمدید!", {
                description: "با موفقیت وارد شدید.",
            });
            setTimeout(() => {
                router.push("/");
            }, 500);
        } else {
            toast.error("خطا در ورود", {
                description: "نام کاربری یا رمز عبور اشتباه است.",
            });
            setIsLoading(false);
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center p-4 relative overflow-hidden bg-black font-sans dir-rtl">
            {/* Background Effects */}
            <div className="absolute inset-0 -z-10">
                <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-emerald-600/20 rounded-full blur-[128px] animate-pulse" />
                <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-blue-600/10 rounded-full blur-[128px] animate-pulse" style={{ animationDelay: "2s" }} />
            </div>

            <Card className="w-full max-w-md bg-white/5 backdrop-blur-xl border-white/10 text-foreground shadow-2xl">
                <CardHeader className="text-center space-y-2">
                    <div className="mx-auto bg-emerald-500/10 p-3 rounded-full w-fit mb-2">
                        <Lock className="w-8 h-8 text-emerald-500" />
                    </div>
                    <CardTitle className="text-2xl font-bold text-white">ورود به حساب کاربری</CardTitle>
                    <CardDescription className="text-muted-foreground">
                        برای دسترسی به پنل مدیریت عادت‌ها وارد شوید
                    </CardDescription>
                </CardHeader>
                <form onSubmit={handleLogin}>
                    <CardContent className="space-y-4">
                        <div className="space-y-2 text-right">
                            <Label htmlFor="username">نام کاربری</Label>
                            <div className="relative">
                                <User className="absolute right-3 top-3 h-4 w-4 text-muted-foreground" />
                                <Input
                                    id="username"
                                    type="text"
                                    placeholder="نام کاربری خود را وارد کنید"
                                    className="pr-9 bg-black/20 border-white/10 focus-visible:ring-emerald-500 text-right"
                                    value={username}
                                    onChange={(e) => setUsername(e.target.value)}
                                    disabled={isLoading}
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
                                    placeholder="رمز عبور خود را وارد کنید"
                                    className="pr-9 bg-black/20 border-white/10 focus-visible:ring-emerald-500 text-right"
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    disabled={isLoading}
                                />
                            </div>
                        </div>
                    </CardContent>
                    <CardFooter>
                        <Button
                            type="submit"
                            className="w-full bg-emerald-600 hover:bg-emerald-500 text-white transition-all shadow-[0_0_20px_rgba(16,185,129,0.3)]"
                            disabled={isLoading}
                        >
                            {isLoading ? "در حال ورود..." : (
                                <>
                                    ورود <LogIn className="mr-2 h-4 w-4 ml-2" />
                                </>
                            )}
                        </Button>
                    </CardFooter>
                </form>
            </Card>
        </div>
    );
}
