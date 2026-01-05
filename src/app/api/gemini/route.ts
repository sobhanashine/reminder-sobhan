import { NextResponse } from 'next/server';
import { GoogleGenerativeAI } from '@google/generative-ai';

// Add timestamp and random seed for unique generations
const getUniqueContext = () => {
    const now = new Date();
    const timeOfDay = now.getHours();
    const dayOfWeek = now.toLocaleDateString('fa-IR', { weekday: 'long' });
    const randomSeed = Math.random().toString(36).substring(7);
    
    let timeContext = '';
    if (timeOfDay < 6) timeContext = 'سحرخیز';
    else if (timeOfDay < 12) timeContext = 'صبح';
    else if (timeOfDay < 18) timeContext = 'بعدازظهر';
    else timeContext = 'شب';
    
    return { timeOfDay, dayOfWeek, timeContext, randomSeed, timestamp: now.toISOString() };
};

// Generate unique personality traits for variety
const getPersonalityVariant = () => {
    const personalities = [
        { tone: 'حکیمانه و الهام‌بخش', style: 'استفاده از ضرب‌المثل‌ها و حکمت‌های کهن' },
        { tone: 'علمی و انگیزشی', style: 'استناد به تحقیقات علمی و نوروساینس' },
        { tone: 'دوستانه و صمیمی', style: 'مثال‌های ملموس از زندگی روزمره' },
        { tone: 'قدرتمند و مصمم', style: 'فرمان‌های مستقیم و قاطع' },
        { tone: 'امیدوارکننده و مثبت', style: 'تمرکز بر پیشرفت‌ها و موفقیت‌های کوچک' }
    ];
    return personalities[Math.floor(Math.random() * personalities.length)];
};

// Get specific motivational themes based on habits
const getHabitSpecificThemes = (habits: { name: string; days: number }[]) => {
    const themes = new Set<string>();
    
    habits.forEach(habit => {
        const habitName = habit.name.toLowerCase();
        if (habitName.includes('سیگار') || habitName.includes('smok')) {
            themes.add('سیگار: بهبود ریه‌ها، اکسیژن‌رسانی، بازگشت حس بویایی و چشایی');
        } else if (habitName.includes('قند') || habitName.includes('شکر') || habitName.includes('sugar')) {
            themes.add('قند: تعادل انسولین، انرژی پایدار، سلامت دندان‌ها');
        } else if (habitName.includes('رسانه') || habitName.includes('social') || habitName.includes('تلفن')) {
            themes.add('رسانه‌های اجتماعی: دتوکس دوپامین، وضوح ذهنی، زمان واقعی');
        } else if (habitName.includes('ورزش') || habitName.includes('exercise') || habitName.includes('حرکت')) {
            themes.add('ورزش: آندورفین، قدرت عضلانی، سلامت قلب');
        } else if (habitName.includes('خواب') || habitName.includes('sleep')) {
            themes.add('خواب: سیرکادین ریتم، ترمیم بدن، حافظه');
        } else if (habitName.includes('آب') || habitName.includes('water')) {
            themes.add('آب: هیدراتاسیون، سم‌زدایی، شفافیت پوست');
        }
    });
    
    return Array.from(themes);
};

export async function POST(request: Request) {
    let habitsList = [];

    try {
        const body = await request.json();
        // body should be { habits: [{ name: "Smoking", days: 10 }, ...] }
        habitsList = body.habits || [];

        const apiKey = process.env.GEMINI_API_KEY;

        if (!apiKey) {
            console.warn("GEMINI_API_KEY is missing. Using fallback response.");
            throw new Error("No API Key configured");
        }

        const genAI = new GoogleGenerativeAI(apiKey);

        const model = genAI.getGenerativeModel({
            model: "gemini-pro",
            generationConfig: { responseMimeType: "application/json" }
        });

        // Generate unique context for this request
        const uniqueContext = getUniqueContext();
        const personality = getPersonalityVariant();
        const habitThemes = getHabitSpecificThemes(habitsList);
        
        // Construct a personalized prompt with freshness factors
        let habitsDescription = "";
        let totalStreakDays = 0;
        
        if (habitsList.length > 0) {
           habitsDescription = habitsList.map((h: { name: string; days: number }) => {
               totalStreakDays += h.days;
               return `- عادت: ${h.name}, روزهای پیاپی: ${h.days}`;
           }).join("\n");
        } else {
            habitsDescription = "کاربر هنوز عادت فعالی ندارد.";
        }

        const prompt = `شما یک مربی زندگی حرفه‌ای، متخصص در نوروساینس و روانشناسی عادت‌ها هستید.
        
        زمان درخواست: ${uniqueContext.dayOfWeek}، ${uniqueContext.timeContext}
        سبک پاسخ: ${personality.tone}
        روش بیان: ${personality.style}
        شناسه منحصر به فرد: ${uniqueContext.randomSeed}
        
        تحلیل عادت‌های فعال کاربر:
        ${habitsDescription}
        
        مجموع روزهای موفقیت: ${totalStreakDays}
        
        ${habitThemes.length > 0 ? `موضوعات تخصصی برای تمرکز:\n${habitThemes.join('\n')}` : ''}
        
        وظایف:
        1. یک "جمله انگیزشی" به فارسی تولید کنید که:
           - کاملاً منحصر به فرد و متناسب با زمان، عادت‌ها و وضعیت فعلی باشد
           - از کلیشه‌ها و جملات تکراری پرهیز کند
           - شامل یک بینش علمی یا حکمت جدید باشد
           - به زبان فارسی روان و تأثیرگذار بیان شود
        
        2. یک "حقیقت پزشکی" به فارسی ارائه دهید که:
           - مرتبط با عادت‌های خاص کاربر باشد
           - بر اساس جدیدترین تحقیقات علمی باشد
           - شامل زمانبندی دقیق تغییرات فیزیولوژیکی باشد
           - امیدوارکننده و واقع‌گرایانه باشد
        
        راهنمای تولید بر اساس روزهای پیاپی:
        - < 3 روز: تمرکز بر شروع، مقاومت اولیه، کوچک‌نگری
        - 3-7 روز: تثبیت عادت، مبارزه با وسوسه‌ها
        - 7-21 روز: تقویت مسیرهای عصبی، کاهش تلاش
        - 21-30 روز: نزدیک به خودکار شدن
        - > 30 روز: جشن تغییر هویت، ارتقاء به سطح جدید
        
        الزامات مهم:
        - خروجی باید JSON معتبر با کلیدهای "motivationalSentence" و "medicalFact" باشد
        - از تکرار جملات قبلی پرهیز کنید
        - هر پاسخ باید حاوی بینش جدید باشد
        - زبان فارسی روان و طبیعی استفاده کنید
        `;

        const result = await model.generateContent(prompt);
        const response = result.response;
        const text = response.text();

        // Attempt to parse JSON response
        const parsed = JSON.parse(text);
        return NextResponse.json(parsed);

    } catch (error) {
        console.error("Gemini API Error / Fallback Triggered:", error);

        // Enhanced fallback with variety based on time and habits
        const uniqueContext = getUniqueContext();
        const totalDays = habitsList.reduce((sum: number, h: { days: number }) => sum + h.days, 0);
        
        const motivationalFallbacks = [
            `در ${uniqueContext.timeContext} ${uniqueContext.dayOfWeek}، ذهن شما در حال بازنویسی کدهای عادتی است. این فرصت طلایی را غنیمت بدانید!`,
            `ساعت‌هایی که اکنون سپری می‌کنید، نقشه‌ی عصبی فردای شما را می‌سازند. ${uniqueContext.dayOfWeek} روزی است که آینده‌تان را متحول می‌کند.`,
            `مغز شما در حال یادگیری الگوی جدیدی است که در ${uniqueContext.dayOfWeek}های آینده، ناخودآگاه اجرا خواهد شد. این معجزه‌ی نوروساینس است!`,
            `هر نفس عمیقی که در این لحظه می‌کشید، سیگنال‌های جدیدی به نورون‌های شما ارسال می‌کند. ${uniqueContext.dayOfWeek}، روز تولد دوباره‌ی اراده‌تان است.`
        ];
        
        const medicalFallbacks = [
            `در ساعت ${uniqueContext.timeContext}، سطح کورتیزول بدن شما در حال تنظیم است. این هورمون استرس است که با ایجاد عادت‌های مثبت، تعادل پیدا می‌کند.`,
            `تحقیقات جدید نشان می‌دهد که در ${uniqueContext.dayOfWeek}ها، نورون‌های جدید با سرعت بیشتری رشد می‌کنند، به‌ویژه هنگام یادگیری عادت‌های جدید.`,
            `در این لحظه، میتوکندری‌های سلول‌های شما در حال تولید انرژی بیشتری هستند. این فرآیند با حذف عادت‌های مخرب، تا ۳۰٪ بهبود می‌یابد.`,
            `سیستم لیمبیک مغز شما در حال سازگاری با الگوهای جدید است. این فرآیند در ${uniqueContext.timeContext} با سرعت بهینه انجام می‌شود.`
        ];
        
        const randomIndex = Math.floor(Math.random() * motivationalFallbacks.length);
        
        return NextResponse.json({
            motivationalSentence: habitsList.length > 0 
                ? motivationalFallbacks[randomIndex] 
                : "اولین قدم در مسیر تغییر، آگاهی از لحظه‌ی حاضر است. همین الان که این جمله را می‌خوانید، فرصت طلایی برای شروع جدید را دارید.",
            medicalFact: medicalFallbacks[randomIndex]
        });
    }
}
