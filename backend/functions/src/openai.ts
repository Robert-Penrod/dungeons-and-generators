import dotenv from "dotenv";
import OpenAI from "openai";

dotenv.config();
const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

export async function chatCompletion(
    prompt: string,
    n: number = 1
): Promise<string> {
    const completion = await openai.chat.completions.create({
        messages: [{ role: "system", content: prompt }],
        model: "gpt-4.1-mini",
    });

    return completion.choices[0].message.content || "";
}
