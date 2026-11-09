import dotenv from "dotenv";
import OpenAI from "openai";

dotenv.config();
const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

export async function chatCompletion(
    prompt: string,
    model?: string,
    temp?: number,
    n: number = 1,
): Promise<string> {
    console.log(`Chat Completion: ${model}`);

    const params: OpenAI.Chat.Completions.ChatCompletionCreateParams = {
        messages: [{ role: "system", content: prompt }],
        model: model ?? "gpt-6-luna",
        ...(temp !== undefined && { temperature: temp }),
    };

    const completion = await openai.chat.completions.create(params);

    return completion.choices[0].message.content || "";
}
