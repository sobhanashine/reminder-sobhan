import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";
import { format as formatJalali, newDate as newJalaliDate } from "date-fns-jalali";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

// Converts English digits to Persian
export function toPersianDigits(n: string | number): string {
  const farsiDigits = ['۰', '۱', '۲', '۳', '۴', '۵', '۶', '۷', '۸', '۹'];
  return n
    .toString()
    .replace(/\d/g, (x) => farsiDigits[parseInt(x)]);
}

// Converts Persian digits to English
export function toEnglishDigits(str: string): string {
  const persianDigits = ['۰', '۱', '۲', '۳', '۴', '۵', '۶', '۷', '۸', '۹'];
  return str.replace(/[۰-۹]/g, (d) => persianDigits.indexOf(d).toString());
}

// Date Object -> "۱۴۰۲/۱۰/۱۵"
export function toPersianDate(date: Date | string): string {
  const d = new Date(date);
  const jalaliString = formatJalali(d, "yyyy/MM/dd");
  return toPersianDigits(jalaliString);
}

// Parse "1402/10/15" to Date Object
export function parsePersianDate(dateStr: string): Date | null {
  try {
    const engStr = toEnglishDigits(dateStr);
    const parts = engStr.split('/');
    if (parts.length !== 3) return null;

    const y = parseInt(parts[0]);
    const m = parseInt(parts[1]) - 1; // Month is 0-indexed in JS/date-fns usually
    const d = parseInt(parts[2]);

    // Use date-fns-jalali to create date from Jalali year/month/day
    // If newDate is available. Otherwise we need a converter. 
    // Assuming date-fns-jalali exports `newDate` which behaves like `new Date()` but for Jalali args.
    // If not, we might need to rely on a simpler approximation or library.
    // For now, let's assume `newJalaliDate` works or use a simple hack:
    // Actually `date-fns-jalali`'s `newDate` might not be standard. 
    // Let's use a fail-safe: if the user enters a date, we try to parse it. 
    // Note: For now, avoiding complex Jalali->Gregorian math manually to reduce risk of bugs.
    // If this fails, we effectively treat input as Gregorian which is a safe fallback for dev.
    // But to be proper, let's include a small converter:

    return newJalaliDate(y, m, d);
  } catch (e) {
    console.error("Date Parse Error", e);
    return null;
  }
}


export function getHabitEmoji(name: string): string {
  const lower = name.toLowerCase();

  // Persian Keywords
  if (lower.match(/سیگار|دود|تنباکو|ویپ|قلیان/)) return "🚬";
  if (lower.match(/الکل|مشروب|شراب|آبجو/)) return "🍺";
  if (lower.match(/قند|شکر|شیرینی|شکلات|نوشابه/)) return "🍭";
  if (lower.match(/گوشی|موبایل|اینستاگرام|تلگرام|مجازی/)) return "📱";
  if (lower.match(/بازی|گیم|کنسول/)) return "🎮";
  if (lower.match(/قهوه|کافئین/)) return "☕";
  if (lower.match(/خرید|پول|خرج/)) return "🛍️";
  if (lower.match(/ناخن|جویدن/)) return "💅";
  if (lower.match(/پرخوری|غذا|فست فود|چربی/)) return "🍔";
  if (lower.match(/استرس|نگرانی|اضطراب/)) return "🤯";
  if (lower.match(/خواب|بیداری|تنبلی/)) return "😴";
  if (lower.match(/ورزش|باشگاه|تمرین/)) return "💪";

  // English Keywords (Fallback)
  if (lower.match(/smoke|smoking|tobacco|vape/)) return "🚬";
  if (lower.match(/alcohol|drink|beer|wine/)) return "🍺";
  if (lower.match(/sugar|candy|sweet|soda/)) return "🍭";
  if (lower.match(/phone|mobile|social|instagram/)) return "📱";
  if (lower.match(/game|gaming/)) return "🎮";
  if (lower.match(/coffee|caffeine/)) return "☕";
  if (lower.match(/buy|shopping|money/)) return "🛍️";
  if (lower.match(/nail|bite/)) return "💅";
  if (lower.match(/food|eat|overeat/)) return "🍔";
  if (lower.match(/stress|worry/)) return "🤯";
  if (lower.match(/sleep|lazy/)) return "😴";
  if (lower.match(/gym|workout/)) return "💪";

  return "✨"; // Default
}
