// See a full list of supported triggers at https://firebase.google.com/docs/functions
// https://firebase.google.com/docs/functions/typescript

import { Redis } from "@upstash/redis";
import cors from "cors";
import express, { Request, Response } from "express";
import rateLimit from "express-rate-limit";
import * as logger from "firebase-functions/logger";
import * as functions from "firebase-functions/v2/https";
import { z } from "zod";
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
/*
const exampleMagicItems = `Name: Whispering Locket
Rarity: Common
Attunement: No
Cost: 50 gp
Description: While wearing this locket, you gain a +1 bonus to Wisdom saving throws. Once per long rest, you may automatically succeed on a single saving throw against being frightened or charmed.

Name: Emberstep Sandals
Rarity: Uncommon
Attunement: Yes
Cost: 500 gp
Description: As a bonus action, you can activate the sandals to cast Misty Step, leaving a brief trail of embers that lightly obscure your previous space (lightly obscured until the end of your next turn). Recharge on a short or long rest. While wearing the sandals, you are immune to damage from non-magical fire.

Name: Gravetide Scythe
Rarity: Rare
Attunement: Yes
Cost: 5,000 gp
Description: This eerie black-bladed scythe deals an additional 1d6 necrotic damage on a hit. When you reduce a creature to 0 hit points, you regain hit points equal to half the necrotic damage dealt, up to a maximum equal to your proficiency bonus each turn.

Name: Crown of the Pale Moon
Rarity: Very Rare
Attunement: Yes
Cost: 25,000 gp
Description: While wearing the crown, you have darkvision out to 120 feet, resistance to radiant and necrotic damage, and advantage on Wisdom (Perception) checks made at night. Once per long rest, you can cast Moonbeam at 5th level or Greater Invisibility (self only).

Name: Blade of the Worldwyrm
Rarity: Legendary
Attunement: Yes
Cost: 100,000 gp
Description: You deal an additional 2d8 acid or fire damage (choose with each attack). Once per short rest, you can exhale a 30-foot cone of acid or fire (your choice), dealing 8d6 damage (Dex save DC 18 for half). Once per long rest, you can cast Earthquake.`;
*/
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
const generateMagicItemSchema = z.object({
    count: z.number().min(1).max(4).default(1),
    name: z.string().optional(),
    rarity: z.string().optional(),
    attunement: z.boolean().optional(),
    cost: z.number().optional(),
    userPrompt: z.string().optional(),
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
        const { count, name, rarity, attunement, cost, userPrompt } =
            parsed.data;

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
Name: ${name ?? "[Item Name]"}
Rarity: ${rarity ?? "[common, uncommon, rare, very rare, or legendary]"}
Attunement: ${attunement === undefined ? "[Yes/No]" : attunement ? "Yes" : "No"}
Cost: ${cost ?? "[Gold piece value appropriate for its rarity]"}

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

export const api = functions.onRequest(
    { maxInstances: 10, concurrency: 1, timeoutSeconds: 120 },
    app
);
