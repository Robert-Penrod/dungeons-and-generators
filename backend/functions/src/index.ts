// See a full list of supported triggers at https://firebase.google.com/docs/functions
// https://firebase.google.com/docs/functions/typescript

import { Redis } from "@upstash/redis";
import cors from "cors";
import express, { Request, Response } from "express";
import rateLimit from "express-rate-limit";
import * as logger from "firebase-functions/logger";
import * as functions from "firebase-functions/v2/https";
import { z } from "zod";
import { chatCompletion } from "./openai";
import { UpstashRateLimitStore } from "./UpstashRateLimitStore";

const app = express();

app.use(express.json());

// allow all origins for dev, restrict later
app.use(cors({ origin: true }));

// Rate limiting
const redis = new Redis({
    url: process.env.UPSTASH_REDIS_REST_URL,
    token: process.env.UPSTRASH_REDIS_REST_TOKEN,
});
const rateLimitWindowMs = 30 * 1000;
const limiter = rateLimit({
    windowMs: rateLimitWindowMs, // 1 minute window
    max: 6,
    standardHeaders: true,
    legacyHeaders: false,
    store: new UpstashRateLimitStore({
        redis,
        windowMs: rateLimitWindowMs,
    }),
});
app.use(limiter);

// Log requests
app.use((req, res, next) => {
    logger.info(`Incoming request: ${req.method} ${req.url}`);
    next();
});

interface ApiResponse<T> {
    success: boolean;
    data?: T;
    error?: string;
}

// Routes

// GET: hello-world
app.get("/hello-world", (req, res) => {
    res.send("Hello from Firebase + Express!");
});

// POST: generate-magic-item
const generateMagicItemSchema = z.object({
    count: z.number().min(1).max(4).default(1).optional(),
    name: z.string().optional(),
    rarity: z.string().optional(),
});
type GenerateMagicItemRequest = z.infer<typeof generateMagicItemSchema>;
type GenerateMagicItemResponse = ApiResponse<{ items: string[] }>;
app.post(
    "/generate-magic-item",
    async (
        req: Request<{}, {}, GenerateMagicItemRequest>,
        res: Response<GenerateMagicItemResponse>
    ) => {
        // Parse request body
        const parsed = generateMagicItemSchema.safeParse(req.body);

        // Check for bad parse
        if (!parsed.success) {
            res.status(400).json({
                success: false,
                error: parsed.error.message,
            });
            return;
        }

        // Destructure validated data
        const { count, rarity, name } = parsed.data;
        console.log(count?.toString() || "" + rarity?.toString() || "" + name);

        try {
            // Magic Item Generation
            const magicItemResponse = await chatCompletion(
                `Generate a D&D 5e magic item. Output only in this format:
Name: [Item Name]
Description: [Item effects and properties in 1-3 sentences.]`
            );
            res.json({
                success: true,
                data: {
                    items: [magicItemResponse],
                },
            });
            return;
        } catch (err) {
            // Generation Error
            console.error("Error generating magic item:", err);
            res.status(500).json({
                success: false,
                error: "Internal server error",
            });
            return;
        }
    }
);

export const api = functions.onRequest(
    { maxInstances: 10, concurrency: 1, timeoutSeconds: 120 },
    app
);
