// See a full list of supported triggers at https://firebase.google.com/docs/functions
// https://firebase.google.com/docs/functions/typescript

import cors from "cors";
import express, { Request, Response } from "express";
import { z } from "zod";
import { chatCompletion } from "./openai";
import { GeneratorKind, PROMPTS } from "./prompt";

const app = express();

app.use(express.json());

// allow all origins for dev, restrict later
app.use(cors({ origin: true }));

interface ApiResponse<T> {
    success: boolean;
    data?: T;
    error?: string;
}

// Routes

// GET: hello-world
app.get("/hello-world", (req, res) => {
    res.send("Hello from Express!");
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
        res: Response<GenerateItemResponse>,
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
`,
                    )
                ),
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
    },
);

// Generation Schemas/Types
const generateItemSchema = z.object({
    count: z.number().min(1).max(12).default(1),
    userPrompt: z.string().optional(),
});
type GenerateItemRequest = z.infer<typeof generateItemSchema>;
type GenerateItemResponse = ApiResponse<{ items: string[] }>;

// POST: generic generate
app.post(
    "/generate/:kind",
    async (
        req: Request<{ kind: GeneratorKind }, {}, GenerateItemRequest>,
        res: Response<GenerateItemResponse>,
    ) => {
        const kind = req.params.kind as GeneratorKind;

        // Grab prompt & Validate
        const makePromptConfig = PROMPTS[kind];
        if (!makePromptConfig) {
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
            //const basePrompt = makePrompt(userPrompt);

            /* Old - each card had individual calls
            // Run N completions in parallel
            const items = await Promise.all(
                Array.from({ length: count }, () =>
                    chatCompletion(makePrompt(userPrompt))
                )
            );
            */

            // Chat completion
            const promptConfig = makePromptConfig(userPrompt, count);
            const response = await chatCompletion(
                promptConfig.prompt,
                promptConfig.model,
                promptConfig.temp,
            );

            const items: string[] = [response];

            // Send Response
            return res.json({ success: true, data: { items } });
        } catch (err) {
            console.error(err);
            return res
                .status(500)
                .json({ success: false, error: "Internal server error" });
        }
    },
);

app.listen(3000, () => {
    console.log("Server is running on port 3000");
});
