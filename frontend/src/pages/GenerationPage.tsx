import {
    Alert,
    Button,
    Center,
    Divider,
    Loader,
    SimpleGrid,
    Stack,
    Textarea,
    Title,
} from "@mantine/core";
import { useEffect, useState } from "react";
import { RiAiGenerate, RiErrorWarningLine } from "react-icons/ri";
import ContentCard from "../components/ContentCard";
import GenerativeIconLoader from "../components/GenerativeIconLoader";
import { WordLoader } from "../components/WordLoader";
import { useGenerateContent } from "../features/generation/hooks/useGenerateContent";

interface GenerationPageProps {
    generatorType: string;
}

const GenerationPage = (props: GenerationPageProps) => {
    const [prompt, setPrompt] = useState<string>("");
    const { data, isLoading, error, title, generate } = useGenerateContent(
        props.generatorType
    );
    //const [temp, setTemp] = useState<number>(1);

    useEffect(() => {
        setPrompt("");
    }, [props.generatorType]);

    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    // const tempSlider = (
    //     <Flex align='center' gap='sm' w='25%' style={{ minWidth: "250px" }}>
    //         <FaThermometerHalf color='orange' size={37} />

    //         {/* Make slider take the remaining space */}
    //         <Box style={{ flex: 1 }}>
    //             <Slider
    //                 color='#FFA500'
    //                 min={0}
    //                 max={2}
    //                 step={0.01}
    //                 value={temp}
    //                 onChange={setTemp}
    //                 label={(v) => v.toFixed(2)}
    //             />
    //         </Box>

    //         {/* Fixed-size slot for reset control */}
    //         <ActionIcon
    //             size='lg'
    //             variant='light'
    //             onClick={() => setTemp(1)}
    //             // keep the element mounted; just hide visually when not needed
    //             style={{
    //                 visibility: temp !== 1 ? "visible" : "hidden",
    //                 pointerEvents: temp !== 1 ? "auto" : "none",
    //             }}
    //             aria-label='Reset temperature'
    //         >
    //             <FaRotateLeft />
    //         </ActionIcon>
    //     </Flex>
    // );

    return (
        <>
            <Stack align='center' mb='xl'>
                <Title mx='auto'>{title} Generator</Title>
                <Textarea
                    onChange={(e) => {
                        setPrompt(e.target.value);
                    }}
                    value={prompt}
                    autosize
                    w='90%'
                    placeholder='(prompt)'
                />
                <Button
                    onClick={() => generate(6, prompt)}
                    leftSection={<RiAiGenerate />}
                    disabled={isLoading}
                >
                    Generate
                </Button>
                <Divider w='100%' />
                {error && (
                    <Alert
                        color='red'
                        icon={<RiErrorWarningLine size='1rem' />}
                        title='Uh-oh!'
                    >
                        {error.message}
                    </Alert>
                )}
            </Stack>

            {isLoading ? (
                <Stack>
                    {/* <Center>
                        <Loader size='xl' type='dots' />
                    </Center> */}
                    <GenerativeIconLoader />
                    <WordLoader
                        messages={[
                            "Rolling",
                            "Thinking",
                            "Generating",
                            "Writing Lore",
                            "Pondering Orb",
                            "Brewing Potion of Ideas",
                            "Simulating Possibilities",
                            "Fetching Lost Knowledge",
                            "Consulting the Lorekeeper",
                            "Dusting off the Archives",
                            "Channeling Arcane Energy",
                            "Scouting Alternate Timelines",
                            "Interpreting Prophecies",
                            "Conjuring Brainstorm",
                            "Forging Lorebound Artifacts",
                            "Consulting the Oracle",
                            "Scouring the Archives",
                            "Rerolling Fate Tables",
                            "Invoking the Muses",
                            "Compiling Lore Fragments",
                            "Stirring the Lore Cauldron",
                            "Polishing plot armor",
                            "Invoking true names",
                            "Bargaining with goblins",
                            "Finding an inn for the night",
                            "Finding an inn for the night",
                            "Slaying a gelatinous cube",
                            "Checking the quest board",
                            "Studying a suspicious map",
                            "Haggling with the blacksmith",
                            "Following footprints",
                            "Prodding a suspicious chest",
                            "Testing for mimics",
                            "Tracking a wounded wyvern",
                            "Scouting the next valley",
                            "Mending a torn cloak",
                            "Consulting the tavern bard",
                            "Asking locals for rumors",
                            "Checking for traps",
                            "Bribing the gate guard",
                            "Crossing a rickety bridge",
                            "Foraging for healing herbs",
                            "Refilling the waterskins",
                            "Roasting something edible",
                            "Listening at the door",
                            "Kicking open the door",
                            "Checking for wandering monsters",
                            "Looting responsibly",
                            "Rolling for random encounter",
                            "Negotiating with bandits",
                            "Surviving an ambush",
                            "Dodging falling rocks",
                            "Sneaking past the ogre",
                            "Translating a crude map",
                            "Hiring a dubious guide",
                            "Examining ominous statues",
                            "Tossing a copper for luck",
                            "Feeding the campfire",
                            "Consulting the star chart",
                            "Scraping ooze off boots",
                            "Skirting a sleeping dragon",
                            "Stealing keys from a troll",
                            "Bargaining with goblins",
                            "Smelling something burning",
                            "Preparing a heroic speech",
                            "Practicing a battle cry",
                            "Counting experience points",
                            "Naming the new sword",
                            "Repairing torn spellbook",
                            "Stashing loot in saddlebags",
                            "Checking the quest log",
                            "Petting the tavern cat",
                            "Paying off old debts",
                            "Sending a raven home",
                            "Spotting smoke on the horizon",
                            "Circling a ruined tower",
                            "Eyeing fresh claw marks",
                            "Scanning the tree line",
                            "Turning a cursed key",
                            "Winding a pocket watch",
                            "Tapping for hollow stone",
                            "Bracing a collapsing beam",
                            "Squeezing through a breach",
                            "Leaping a chasm in faith",
                            "Testing a rope bridge",
                            "Spotting a glimmer in mud",
                        ]}
                        interval={5000}
                    />
                    <Center>
                        <Loader size='xl' type='dots' />
                    </Center>
                </Stack>
            ) : (
                <SimpleGrid
                    cols={{ base: 1, xs: 1, sm: 1, md: 2, lg: 3, xl: 3 }}
                >
                    {data?.map((item, index) => {
                        return (
                            <ContentCard
                                key={index}
                                title={item.name}
                                content={item.description}
                                iconString={item.iconString}
                            />
                        );
                    })}
                </SimpleGrid>
            )}
        </>
    );
};

export default GenerationPage;
