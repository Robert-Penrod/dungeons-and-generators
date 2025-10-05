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

export const PROMPTS = {
    "magic-item": (userPrompt?: string, count: number = 1) => {
        return `
Generate ${count} D&D 5e magic item${count > 1 ? "s" : ""}.
${userPrompt ? `User prompt: ${userPrompt}` : ""}
Format:
Name: [Item Name]
Rarity: [common, uncommon, rare, very rare, or legendary]
Attunement: [Yes/No]
Cost: [Gold piece value appropriate for its rarity]
(if weapons add "Damage:")

[Item effects and properties in 1-3 sentences.]
`;
    },

    character: (userPrompt?: string, count: number = 1) => `
Here are some character examples
${characterExamples}

Generate ${count} colorful NPC${count > 1 ? "s" : ""} for D&D 5e.
${userPrompt ? `User prompt: ${userPrompt}` : ""}
Format:
Name: ...
Race: ... 
Occupation: ...

[1 succinct detail in a few words.]

Ideal: ...
Flaw: ...
Bond: ...

"[quote from the character]"
`,

    location: (userPrompt?: string, count: number = 1) => `
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

    encounter: (userPrompt?: string, count: number = 1) => `
Generate ${count} D&D 5e encounter${count > 1 ? "s" : ""}:
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
