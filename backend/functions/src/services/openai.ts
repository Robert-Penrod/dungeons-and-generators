import dotenv from "dotenv";
import OpenAI from "openai";

dotenv.config();
const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

export async function chatCompletion(
    prompt: string,
    temp: number = 1,
    n: number = 1
): Promise<string> {
    const completion = await openai.chat.completions.create({
        messages: [{ role: "system", content: prompt }],
        model: "gpt-5-mini-2025-08-07",
    });

    return completion.choices[0].message.content || "";
}
