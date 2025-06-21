// See a full list of supported triggers at https://firebase.google.com/docs/functions
// https://firebase.google.com/docs/functions/typescript

import { Redis } from "@upstash/redis";
import cors from "cors";
import express, { Request, Response } from "express";
import rateLimit from "express-rate-limit";
import * as logger from "firebase-functions/logger";
import * as functions from "firebase-functions/v2/https";
import { z } from "zod";
import { GeneratorKind, PROMPTS } from "./prompt";
import { createGlobalRateLimiter } from "./services/globalRateLimit";
import { chatCompletion } from "./services/openai";
import { UpstashRateLimitStore } from "./services/UpstashRateLimitStore";

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

// Global rate limiter
app.use(createGlobalRateLimiter(redis));

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
const exampleMagicItemNames = `Potion of Healing

Amulet of Proof Against Detection and Location

Moon-Touched Sword

Cloak of Many Fashions

Perfume of Bewitching

Ruby of the War Mage

Bag of Holding

Boots of Elvenkind

Winged Boots

Cloak of Protection

Sending Stones

Goggles of Night

Wand of Magic Missiles

Gauntlets of Ogre Power

Hat of Disguise

Immovable Rod

Belt of Dwarvenkind

Sun Blade

Staff of Fire

Amulet of Health

Cape of the Mountebank

Ring of Evasion

+2 Weapon (any type)

Rod of the Pact Keeper +2

Periapt of Proof Against Poison

Helm of Teleportation

Sword of Sharpness

Staff of Power

Ring of Regeneration

Cloak of Invisibility

Tome of Clear Thought

Luck Blade

Rod of Absorption

Manual of Quickness of Action

Crystal Ball

Vorpal Sword

Holy Avenger

Staff of the Magi

Ring of Three Wishes

Sphere of Annihilation

Deck of Many Things

Robe of the Archmagi

Book of Exalted Deeds

Instrument of the Bards (Ollamh Harp, etc.)

Efreeti Bottle`;
app.post(
    "/generate-magic-item",
    async (
        req: Request<{}, {}, GenerateItemRequest>,
        res: Response<GenerateItemResponse>
    ) => {
        // Parse request body
        const parsed = generateItemSchema.safeParse(req.body);

        // Check for bad parse
        if (!parsed.success) {
            res.status(400).json({
                success: false,
                error: parsed.error.message,
            });
            return;
        }

        // Destructure validated data
        const { count, userPrompt } = parsed.data;

        try {
            // Magic Item Generation
            // Generate N completions concurrently
            const completions = await Promise.all(
                Array.from({ length: count }).map(() =>
                    chatCompletion(
                        `The goal is to generate highly creative, unusual, and fresh D&D 5e magic items that surprise and delight players. Avoid overused fantasy clichés like cloaks, amulets, rings, lanterns, or "whispering" or "shadow" names. Use a wide variety of materials, functions, and item types such as weapons, armor, tools, wondrous items, consumables, figurines, vehicles, pets, tattoos, or musical instruments.

Very the items you output, here are examples of various magic item titles:
${exampleMagicItemNames}

${
    userPrompt === undefined
        ? ""
        : `Here is the user prompt to influence your generation: ${userPrompt}`
}

Generate a D&D 5e magic item. Output only in this format:
Name: [Item Name]
Rarity: [common, uncommon, rare, very rare, or legendary]
Attunement: [Yes/No]
Cost: [Gold piece value appropriate for its rarity]

[Item effects and properties in 1-3 sentences.]
`
                    )
                )
            );

            // Return completions
            res.json({
                success: true,
                data: {
                    items: completions,
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

// Generation Schemas/Types
const generateItemSchema = z.object({
    count: z.number().min(1).max(4).default(1),
    userPrompt: z.string().optional(),
});
type GenerateItemRequest = z.infer<typeof generateItemSchema>;
type GenerateItemResponse = ApiResponse<{ items: string[] }>;

// POST: generic generate
app.post(
    "/generate/:kind",
    async (
        req: Request<{ kind: GeneratorKind }, {}, GenerateItemRequest>,
        res: Response<GenerateItemResponse>
    ) => {
        const kind = req.params.kind as GeneratorKind;

        // Grab prompt & Validate
        const makePrompt = PROMPTS[kind];
        if (!makePrompt) {
            return res
                .status(404)
                .json({ success: false, error: `Unknown generator ${kind}` });
        }

        // Validate body
        const parsed = generateItemSchema.safeParse(req.body);
        if (!parsed.success) {
            return res
                .status(400)
                .json({ success: false, error: parsed.error.message });
        }
        const { count, userPrompt } = parsed.data;

        try {
            // Build prompt text
            const basePrompt = makePrompt(userPrompt);

            // Run N completions in parallel
            const items = await Promise.all(
                Array.from({ length: count }, () => chatCompletion(basePrompt))
            );

            // Send Response
            return res.json({ success: true, data: { items } });
        } catch (err) {
            console.error(err);
            return res
                .status(500)
                .json({ success: false, error: "Internal server error" });
        }
    }
);

export const api = functions.onRequest(
    { maxInstances: 10, concurrency: 1, timeoutSeconds: 120 },
    app
);
