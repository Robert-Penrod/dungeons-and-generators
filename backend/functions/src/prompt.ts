export const PROMPTS = {
    "magic-item": (userPrompt?: string) => `
Generate a D&D 5e magic item.
${userPrompt ? `User prompt: ${userPrompt}` : ""}
Format:
Name: [Item Name]
Rarity: [common, uncommon, rare, very rare, or legendary]
Attunement: [Yes/No]
Cost: [Gold piece value appropriate for its rarity]

[Item effects and properties in 1-3 sentences.]
`,

    character: (userPrompt?: string) => `
Generate a colorful NPC for D&D 5e. Make the types of character, race, occupation varried.
${userPrompt ? `User prompt: ${userPrompt}` : ""}
Format:
Name: ...
Race: ... 
Occupation: [Succinct label, Wizard, Ferryman, Witch, Engineer, Druid, Bishop, Ranger, Merchant, Cheff, Rogue, Captain Of The Gaurd, Fixer, Warlock, ect.]

[1 sentence description.]

Motivation: ...

Flaw: ...

Bond: ...

"[quote from the character]"
`,

    location: (userPrompt?: string) => `
Generate a memorable fantasy location. Make the types of location varried.
${userPrompt ? `User prompt: ${userPrompt}` : ""}
Format:
Name: ...
Biome: [Forest, Desert, City, Village, Dungeon, Cave, Swamp, Fyord, Mines, Magic Academy, Room, Tavern, ect.]

[1-3 sentence description.]

Hooks: [3 brief hooks]
`,

    encounter: (userPrompt?: string) => `
Generate a D&D 5e encounter:
${userPrompt ? `User prompt: ${userPrompt}` : ""}
Format:
Name: ...
Situation: ...

NPCs: ...

Consequences: [rewards, loot, or consequences]
`,

    quest: (userPrompt?: string) => `
Generate a D&D 5e quest.
${userPrompt ? `User prompt: ${userPrompt}` : ""}
Format:
Name: ...
Level: #

[Summary]

Hook: ...

Outline: ...

Encounters: ...

NPCs: ...

Locations: ...

Twists: ...

Rewards: ...

FollowUps: ...
`,
} as const;

export type GeneratorKind = keyof typeof PROMPTS; // "magic-item" | "character" | …
