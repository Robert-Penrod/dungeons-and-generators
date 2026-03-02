import {
    AppShell,
    Avatar,
    Burger,
    Button,
    Center,
    Container,
    Flex,
    Group,
    Loader,
    Menu,
    Stack,
    Text,
    useMantineTheme,
} from "@mantine/core";
import { useDisclosure } from "@mantine/hooks";
import { useContext, useEffect } from "react";
import {
    FaBookmark,
    FaIdCard,
    FaLink,
    FaMagnifyingGlass,
    FaMapLocationDot,
    FaPuzzlePiece,
} from "react-icons/fa6";
import {
    GiExplosionRays,
    GiMonsterGrasp,
    GiScrollUnfurled,
    GiSpellBook,
    GiSwapBag,
    GiTiedScroll,
} from "react-icons/gi";
import { IoPersonCircle } from "react-icons/io5";
import { PiFilmSlateFill } from "react-icons/pi";
import { RiQuestionnaireFill } from "react-icons/ri";
import { TbCrystalBall } from "react-icons/tb";
import { NavLink, Route, Routes } from "react-router";
import "./App.css";
import { useAuth } from "./auth/AuthProvider";
import { GeneratorDataContext } from "./context/GeneratorDataContext";
import CollectionPage from "./pages/CollectionPage";
import GenerationPage from "./pages/GenerationPage";
import HomePage from "./pages/HomePage";
import LinkPage from "./pages/LinkPage";

function App() {
    const { user, loading, signInWithGoogle, signOut } = useAuth();

    useEffect(() => {}, []);

    const [opened, { toggle, close }] = useDisclosure();
    const theme = useMantineTheme();

    const { generators } = useContext(GeneratorDataContext);

    useEffect(() => {
        console.log(user);
    }, [user]);

    //const [coinCount, setCoinCount] = useState<number>(200);

    const navbarLinks = [
        // { to: "/lore", label: "Lore", icon: <FaBook /> },

        { to: "/collection", label: "Collection", icon: <FaBookmark /> },
        { to: "/name", label: "⚡Names", icon: <FaIdCard /> },
        {
            to: "/wild-magic",
            label: "⚡Wild Magic",
            icon: <GiExplosionRays />,
        },
        {
            to: "/loot",
            label: "⚡ Loot",
            icon: <GiSwapBag />,
        },
        {
            to: "/secrets-clues",
            label: "⚡ Secrets/Clues",
            icon: <FaMagnifyingGlass />,
        },
        { to: "/magic-item", label: "Magic Items", icon: <TbCrystalBall /> },
        { to: "/character", label: "Characters", icon: <IoPersonCircle /> },
        { to: "/creature", label: "Creatures", icon: <GiMonsterGrasp /> },
        { to: "/location", label: "Locations", icon: <FaMapLocationDot /> },
        { to: "/quest", label: "Quests", icon: <RiQuestionnaireFill /> },
        { to: "/encounter", label: "Encounters", icon: <PiFilmSlateFill /> },

        { to: "/puzzle", label: "Puzzles", icon: <FaPuzzlePiece /> },
        // { to: "/riddle", label: "Riddles", icon: <GiScrollUnfurled /> },
        { to: "/other-tools", label: "Other Tools", icon: <FaLink /> },
    ];

    return (
        <AppShell
            header={{ height: 60 }}
            navbar={
                user
                    ? {
                          width: 212,
                          breakpoint: "sm",
                          collapsed: { mobile: !opened },
                      }
                    : undefined
            }
            padding='md'
        >
            <AppShell.Header style={{ backgroundColor: theme.colors.blue[6] }}>
                <Flex h='100%' p='md' justify='space-between' align='center'>
                    <Flex>
                        {user && (
                            <Burger
                                opened={opened}
                                onClick={toggle}
                                hiddenFrom='sm'
                                size='sm'
                                mr='md'
                                color='white'
                            />
                        )}
                        <NavLink
                            to='/'
                            style={{ textDecoration: "none" }}
                            onMouseDown={() => {
                                close();
                            }}
                        >
                            <Group gap='xs'>
                                <img
                                    src='/favicon.ico'
                                    alt='App Logo'
                                    style={{
                                        width: "40px",
                                        height: "40px",
                                        marginTop: "-10px",
                                    }}
                                />
                                <Text fw='bold'>DnG</Text>
                            </Group>
                        </NavLink>
                    </Flex>
                    <Group>
                        {/* {user && (
                            <Group gap={7}>
                                <Text size='lg' c='gold' fw='bold'>
                                    {coinCount}
                                </Text>
                                <FaCoins color='gold' size={24} />
                            </Group>
                        )} */}

                        {!user && (
                            <Button onClick={() => signInWithGoogle()}>
                                Sign In
                            </Button>
                        )}
                        {user && (
                            <>
                                <Menu
                                    position='bottom-end'
                                    withArrow={true}
                                    withinPortal={false}
                                >
                                    <Menu.Target>
                                        <Avatar
                                            src={
                                                user?.identities?.[0]
                                                    .identity_data
                                                    ?.avatar_url ?? "null"
                                            }
                                            alt='nothing yet'
                                        />
                                    </Menu.Target>
                                    <Menu.Dropdown>
                                        <Menu.Label>
                                            {user?.identities?.[0].identity_data
                                                ?.name ?? null}
                                        </Menu.Label>
                                        <Menu.Item onClick={() => signOut()}>
                                            Signout
                                        </Menu.Item>
                                    </Menu.Dropdown>
                                </Menu>
                            </>
                        )}
                    </Group>
                </Flex>
            </AppShell.Header>

            {loading && (
                <AppShell.Main
                    style={{
                        display: "flex",
                        justifyContent: "center",
                        alignItems: "center",
                    }}
                    className='paper-bg'
                >
                    <Loader size={150} />
                </AppShell.Main>
            )}

            {user && (
                <AppShell.Navbar
                    style={{
                        backgroundColor: theme.colors.blue[6],
                        border: "none",
                        borderTop: `${theme.colors.blue[1]} 1px solid`,
                        marginTop: "-1px",
                    }}
                >
                    <Stack gap={0}>
                        {navbarLinks.map((link) => (
                            <NavLink
                                key={link.to}
                                to={link.to}
                                onMouseDown={() => {
                                    close();
                                }}
                                style={({ isActive }) => ({
                                    // active background + subtle hover
                                    padding: "8px 12px",
                                    backgroundColor: isActive
                                        ? theme.colors.blue[7]
                                        : "transparent",
                                    color: isActive
                                        ? theme.white
                                        : theme.colors.blue[3],
                                    transition: "all 0.2s ease",
                                    borderTop: `0px solid ${theme.colors.blue[0]}`,
                                    borderBottom: `0.5px solid ${theme.colors.blue[3]}22`,
                                })}
                            >
                                <Flex align='center' justify='space-between'>
                                    <Group>
                                        {link.icon}{" "}
                                        <Text>{link.label}</Text>{" "}
                                    </Group>
                                    {(generators[link.to.slice(1)]
                                        ?.isLoading && (
                                        <Loader
                                            size='xs'
                                            color='white'
                                            type='dots'
                                        />
                                    )) ?? <></>}
                                    {(generators[link.to.slice(1)]?.cardData
                                        .length > 0 &&
                                        !generators[link.to.slice(1)]
                                            ?.isLoading &&
                                        (generators[link.to.slice(1)].isSeen ? (
                                            <GiScrollUnfurled />
                                        ) : (
                                            <GiTiedScroll
                                                color={theme.colors.green[4]}
                                            />
                                        ))) ?? <></>}
                                </Flex>
                            </NavLink>
                        ))}
                    </Stack>
                </AppShell.Navbar>
            )}

            {!loading && (
                <AppShell.Main className='paper-bg'>
                    {!user ? (
                        <Container>
                            <HomePage />
                            <Center mt={50}>
                                <Button
                                    size='lg'
                                    radius='md'
                                    px='md'
                                    color='lime.5'
                                    fw={700}
                                    variant='gradient'
                                    gradient={{
                                        from: "green.7",
                                        to: "teal.8",
                                        deg: 45,
                                    }}
                                    leftSection={
                                        <GiSpellBook
                                            style={{
                                                transform: "translateY(-5px)",
                                            }}
                                            size={32}
                                        />
                                    }
                                    style={{
                                        boxShadow:
                                            "0 0 12px rgba(100, 255, 150, 0.5)",
                                        textTransform: "uppercase",
                                        letterSpacing: "0.5px",
                                    }}
                                    onClick={() => signInWithGoogle()}
                                >
                                    START GENERATING
                                </Button>
                            </Center>
                        </Container>
                    ) : (
                        <Routes>
                            <Route path='/' element={<HomePage />} />
                            <Route path='other-tools' element={<LinkPage />} />
                            <Route
                                path='collection'
                                element={<CollectionPage />}
                            />
                            {/* <Route path='/lore' element={<LorePage />} /> */}
                            {navbarLinks.map((navLinkData) => {
                                return (
                                    <Route
                                        path={navLinkData.to}
                                        element={
                                            <GenerationPage
                                                label={navLinkData.label}
                                                icon={navLinkData.icon}
                                                generatorType={navLinkData.to.slice(
                                                    1,
                                                )}
                                                onGenerate={() => {
                                                    //setCoinCount(coinCount - 1);
                                                }}
                                            />
                                        }
                                    />
                                );
                            })}
                            ;
                        </Routes>
                    )}
                </AppShell.Main>
            )}
        </AppShell>
    );
}

export default App;
