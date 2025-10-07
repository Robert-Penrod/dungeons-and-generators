import {
    AppShell,
    Avatar,
    Burger,
    Flex,
    Group,
    Stack,
    Text,
    useMantineTheme,
} from "@mantine/core";
import { useDisclosure } from "@mantine/hooks";
import { useState } from "react";
import { FaCoins, FaMapLocationDot } from "react-icons/fa6";
import { IoPersonCircle } from "react-icons/io5";
import { TbCrystalBall } from "react-icons/tb";
import { NavLink, Route, Routes } from "react-router";
import "./App.css";
import GenerationPage from "./pages/GenerationPage";
import HomePage from "./pages/HomePage";

function App() {
    const [opened, { toggle, close }] = useDisclosure();
    const theme = useMantineTheme();

    const [coinCount, setCoinCount] = useState<number>(200);

    const navbarLinks = [
        // { to: "/lore", label: "Lore", icon: <FaBook /> },
        { to: "/magic-item", label: "Magic Items", icon: <TbCrystalBall /> },
        { to: "/character", label: "Characters", icon: <IoPersonCircle /> },
        { to: "/location", label: "Locations", icon: <FaMapLocationDot /> },
        // { to: "/encounter", label: "Encounters", icon: <GiSeaCreature /> },
        // { to: "/quest", label: "Quests", icon: <FaExclamationCircle /> },
    ];

    return (
        <AppShell
            header={{ height: 60 }}
            navbar={{
                width: 200,
                breakpoint: "sm",
                collapsed: { mobile: !opened },
            }}
            padding='md'
        >
            <AppShell.Header style={{ backgroundColor: theme.colors.blue[6] }}>
                <Flex h='100%' p='md' justify='space-between' align='center'>
                    <Flex>
                        <Burger
                            opened={opened}
                            onClick={toggle}
                            hiddenFrom='sm'
                            size='sm'
                            mr='md'
                            color='white'
                        />
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
                        <Group gap={7}>
                            <Text size='lg' c='gold' fw='bold'>
                                {coinCount}
                            </Text>
                            <FaCoins color='gold' size={24} />
                        </Group>
                        <Avatar src={null} alt='nothing yet' />
                    </Group>
                </Flex>
            </AppShell.Header>

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
                            })}
                        >
                            <Group>
                                {link.icon} <Text>{link.label}</Text>
                            </Group>
                        </NavLink>
                    ))}
                </Stack>
            </AppShell.Navbar>

            <AppShell.Main style={{ backgroundColor: "#EAE9E7" }}>
                <Routes>
                    <Route path='/' element={<HomePage />} />
                    {/* <Route path='/lore' element={<LorePage />} /> */}
                    {navbarLinks.map((navLinkData) => {
                        return (
                            <Route
                                path={navLinkData.to}
                                element={
                                    <GenerationPage
                                        icon={navLinkData.icon}
                                        generatorType={navLinkData.to.slice(1)}
                                        onGenerate={() => {
                                            setCoinCount(coinCount - 1);
                                        }}
                                    />
                                }
                            />
                        );
                    })}
                    ;
                </Routes>
            </AppShell.Main>
        </AppShell>
    );
}

export default App;
