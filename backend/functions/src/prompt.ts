const lightModelName = "gpt-4.1-nano-2025-04-14";

let characterExamples = `
Name: Marcus Shadowmourne
Race: Half-Orc
Occupation: Captain 

Their complexion has a slightly pinkish tinge to it.

Ideal: Violence is the only language universally understood.
Flaw: They wear their heart on their sleeve.
Bond: They will do whatever it takes to prove they are the wisest.

“May your god have mercy on you, for I will not.”

Name: Omar Lachlan
Race: Human
Occupation: Adventurer

They mumble when they speak.

Ideal: The world is a dark place - and people make it that way.
Flaw: They often forget the names of people they just met.
Bond: They abandoned their ruler to become rich.

“He is a five-headed liar.”

Name: Hugo Bryce
Race: Gnome
Occupation: Fighter

They wear a pair of cracked spectacles.

Ideal: The fight against good is never ending, and they are ever-vigilant.
Flaw: They are apathetic.
Bond: Their success is because of the kindness of a stranger.

“This ale tastes like cat piss.”

Name: Peter Zantus
Race: Half-Orc 
Occupation: Acolyte

They have mysterious purple eyes.

Ideal: The true path to power is overwhelming strength.
Flaw: Why fight when you can poison.
Bond: Their research into forgotten magics will bring back a loved one from death.

“Huzzah!”

Name: Gia Deakin
Race: Elf
Occupation: Detective

They smell like fresh-dug earth.

Ideal: All that matters is their children in their arms.
Flaw: They have a strong paranoia about clowns.
Bond: They swore to overthrow a corrupt official.

“Fare thee well.”
`;

let locationExamples = `
Name: Lost Forge of Steropes

In the heart of the jungle lies a forge. The forge is contained inside a spire standing 200 feet tall. For centuries, the forge has been cold.

Name: The Magnolia Menhir

When a powerful druid met her end, a giant tree sprang up where she fell. Around the tree of life, the menhirs were placed, an everlasting circle of guardians to honor the druid. Today, the tree has been cut down. Great power still lingers here.

Name: Kiran's Chains

In the heart of the jungle lies a forge. The forge is contained inside a spire standing 200 feet tall. For centuries, the forge has been cold.

Name: Hamad's Bridge

The chasm is so deep here that everyone agrees it has no bottom. Why there is only one, small bridge to cross is not known. Those who built the bridge are long forgotten.

Name: Sawyer's Waterfall

Friends and lovers come to this pool to watch the water tumble out from the mountain. Something about it calms the mind, and promotes spiritual reflection.

Name: Grayrock

The kingdom used to be a thriving center of trade. The times changed, bringing hardship beyond belief, and yet the people clung to some sort of life here. Few ships, and fewer good tidings, come to its port nowadays.
`;

export interface PromptConfig {
    prompt: string;
    model?: string;
    temp?: number;
}

export const PROMPTS = {
    "wild-magic": (userPrompt?: string, count: number = 1): PromptConfig => {
        return {
            prompt: `Generate ${count} unique wild magic effect${
                count > 1 ? "s" : ""
            } based on the criteria below. ${
                userPrompt ? `Additional user prompt: ${userPrompt}` : ""
            }

Format:
Each effect must follow this structure:

Name: <Effect Name>

<Concise mechanical description of the effect>

Name: Blink

The caster randomly teleports to a location within 30 feet at the start of each turn for 1 minute.

Name: Gravity Flip

For 6 seconds, gravity inverts within a 20-foot radius. Creatures and unsecured objects rise 20 feet before falling when gravity returns.

Name: Polymorph

The caster is transformed into a chicken for 1 minute.

Name: Fireball

The caster immediately casts Fireball centered on themselves.`,
            model: lightModelName,
        };
    },

    puzzle: (userPrompt?: string, count: number = 1): PromptConfig => {
        return {
            prompt: `
Generate ${count} D&D 5e puzzle${count > 1 ? "s" : ""}.
${userPrompt ? `User prompt: ${userPrompt}` : ""}
Format:
Name: <Puzzle Name>

<short mechanical puzzle description in a few words>

Solution: <a few words>

Consequences: <a few words>
`,
        };
    },

    riddle: (userPrompt?: string, count: number = 1): PromptConfig => {
        return {
            prompt: `
            Generate ${count} classic fantasy tabletop riddle${
                count > 1 ? "s" : ""
            }.
${userPrompt ? `User prompt: ${userPrompt}` : ""}
Format:

Name: <Riddle Name>

<Riddle>

Answer: <Riddle Answer>

Name: <Riddle Name>

<Riddle>

Answer: <Riddle Answer>

            `,
        };
    },

    name: (userPrompt?: string, count: number = 1): PromptConfig => {
        const lootFormat = Array.from({ length: count }, (_, i) => {
            const items = Array.from(
                { length: 5 },
                (_, j) => `- name ${j + 1}`
            ).join("\n");
            return `Name: <Name List Name>\n${items}`;
        }).join("\n\n");

        return {
            prompt: `
Generate ${count} misc. fantasy name list${count > 1 ? "s" : ""}.
${userPrompt ? `User prompt: ${userPrompt}` : ""}

Format:

${lootFormat}
        `.trim(),
            model: lightModelName,
        };
    },

    loot: (userPrompt?: string, count: number = 1): PromptConfig => {
        const lootFormat = Array.from({ length: count }, (_, i) => {
            const items = Array.from(
                { length: 5 },
                (_, j) => `- item ${j + 1} (gp value)`
            ).join("\n");
            return `Name: <Loot Name>\n${items}`;
        }).join("\n\n");

        return {
            prompt: `
Generate ${count} misc. loot list${count > 1 ? "s" : ""}.
${userPrompt ? `User prompt: ${userPrompt}` : ""}

Format:

${lootFormat}
        `.trim(),
            model: lightModelName,
        };
    },

    "magic-item": (userPrompt?: string, count: number = 1): PromptConfig => {
        return {
            prompt: `
Generate ${count} D&D 5e magic item${count > 1 ? "s" : ""}.
${userPrompt ? `User prompt: ${userPrompt}` : ""}
Format:
Name: [Item Name]
Rarity: [common, uncommon, rare, very rare, or legendary]
Attunement: [Yes/No]
Cost: [Gold piece value appropriate for its rarity]
(if weapons add "Damage:")
\n\n
[Item effects and properties in 1-3 sentences.]
`,
        };
    },

    character: (userPrompt?: string, count: number = 1): PromptConfig => {
        return {
            prompt: `
Here are some character examples
${characterExamples}

Generate ${count} colorful NPC${count > 1 ? "s" : ""} for D&D 5e.
${userPrompt ? `User prompt: ${userPrompt}` : ""}
Format:
Name: ...
Race: ... 
Occupation: ...

[1 succinct detail in a few words.]
\n
Ideal: ...
Flaw: ...
Bond: ...
\n
"[quote from the character]"
`,
        };
    },

    location: (userPrompt?: string, count: number = 1): PromptConfig => {
        return {
            prompt: `
Here are some location examples
${locationExamples}

Generate ${count} memorable fantasy location${count > 1 ? "s" : ""}.
${userPrompt ? `User prompt: ${userPrompt}` : ""}
Format:
Name: ...
Biome: [City, Coast, Town, Desert, Forest, Mountains, Plains, Dungeon]

[short, succinct description in a few words.]

- [Interesting detail in a few short words.]

- [Interesting detail in a few short words.]

- [Interesting detail in a few short words.]
`,
        };
    },

    encounter: (userPrompt?: string, count: number = 1): PromptConfig => {
        return {
            prompt: `
Generate ${count} D&D 5e encounter${count > 1 ? "s" : ""}.
${userPrompt ? `User prompt: ${userPrompt}` : ""}
Format:
Name: <Encounter Name>
\n
<Encounter description in a few words>
\n
Consequences: <rewards, loot, or consequences>

Name: <Encounter Name>
\n
<Encounter description in a few words>
\n
Consequences: <rewards, loot, or consequences>
`,
        };
    },

    quest: (userPrompt?: string, count: number = 1): PromptConfig => {
        return {
            prompt: `
Generate ${count} D&D 5e quest${count > 1 ? "s" : ""}.
${userPrompt ? `User prompt: ${userPrompt}` : ""}
Format:
Name: <Quest Name>
\n
<Quest description in a few words>
\n
Rewards: <Quest Rewards>
`,
        };
    },

    "secrets-clues": (userPrompt?: string, count: number = 1): PromptConfig => {
        const s = `${count > 1 ? "s" : ""}`;

        return {
            prompt: `
            Generate ${count} D&D 5e Secret${s}/Clue${s}/Rumor${s}.
${userPrompt ? `User prompt: ${userPrompt}` : ""}
Format:
Name: <name>
\n
<Secret/Clue/Rumor in a few words>

Name: <name>
\n
<Secret/Clue/Rumor in a few words>
            `,
            model: lightModelName,
        };
    },
} as const;

export type GeneratorKind = keyof typeof PROMPTS; // "magic-item" | "character" | …
