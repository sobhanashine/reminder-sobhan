import { NextResponse } from 'next/server';
import { GoogleGenerativeAI } from '@google/generative-ai';

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

        // Construct a personalized prompt
        let habitsDescription = "";
        if (habitsList.length > 0) {
           habitsDescription = habitsList.map((h: { name: string; days: number }) => `- Habit: ${h.name}, Streak: ${h.days} days`).join("\n");
        } else {
            habitsDescription = "The user has no active habits yet.";
        }

        const prompt = `Act as a wise, friendly, and powerful life coach. 
        
        Analyze this updated list of active habits and their streaks:
        ${habitsDescription}
        
        Task: 
        1. Generate a "motivationalSentence" in Persian (Farsi).
        2. Generate a "medicalFact" in Persian (Farsi).

        CRITICAL GUIDELINES:
        - **Contextual Relevance**: If the user lists specific habits (e.g., "Smoking", "Sugar", "Social Media"), your response MUST be directly related to them.
          - Example: If "Smoking", mention lung recovery or breathing.
          - Example: If "Sugar", mention energy levels or insulin.
          - Example: If "Social Media", mention mental clarity or dopamine detox.
        - **Streak Awareness**: 
          - < 3 days: Focus on the difficulty of starting.
          - > 30 days: Celebrate the identity shift.
        - **Tone**: Empathetic but firm.
        
        Requirements:
        - Output MUST be strictly valid JSON with keys: "motivationalSentence", "medicalFact".
        `;

        const result = await model.generateContent(prompt);
        const response = result.response;
        const text = response.text();

        // Attempt to parse JSON response
        const parsed = JSON.parse(text);
        return NextResponse.json(parsed);

    } catch (error) {
        console.error("Gemini API Error / Fallback Triggered:", error);

        // Personalized Fallback based on list presence
        const fallbackMotivational = habitsList.length > 0
            ? "ادامه بده! هر روزی که مقاومت می‌کنی، مسیر عصبی جدیدی در مغزت ساخته می‌شود."
            : "به مسیر اراده خوش آمدید! اولین قدم برای تغییر، تعریف یک عادت جدید است.";

        return NextResponse.json({
            motivationalSentence: fallbackMotivational,
            medicalFact: 'تحقیقات نشان می‌دهد ۲۱ روز زمان لازم است تا یک رفتار جدید به عادت تبدیل شود.'
        });
    }
}
