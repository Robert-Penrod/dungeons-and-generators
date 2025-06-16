import { z } from "zod";

export interface ApiResponse<T> {
    success: boolean;
    data?: T;
    error?: string;
}

const generateMagicItemSchema = z.object({
    count: z.number().min(1).max(4).default(1),
    name: z.string().optional(),
    rarity: z.string().optional(),
    attunement: z.boolean().optional(),
    cost: z.number().optional(),
});
type GenerateMagicItemRequest = z.infer<typeof generateMagicItemSchema>;
type GenerateMagicItemResponse = ApiResponse<{ items: string[] }>;
