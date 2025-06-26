import {
    AppShell,
    Avatar,
    Burger,
    Flex,
    Group,
    Stack,
    Text,
} from "@mantine/core";
import { useDisclosure } from "@mantine/hooks";
import { FaExclamationCircle } from "react-icons/fa";
import { FaMapLocationDot } from "react-icons/fa6";
import { GiSeaCreature } from "react-icons/gi";
import { IoPersonCircle } from "react-icons/io5";
import { TbCrystalBall } from "react-icons/tb";
import { Link, Route, Routes } from "react-router";
import "./App.css";
import GenerationPage from "./pages/GenerationPage";
import HomePage from "./pages/HomePage";

function App() {
    const [opened, { toggle, close }] = useDisclosure();

    const navbarLinks = [
        { to: "/magic-item", label: "Magic Items", icon: <TbCrystalBall /> },
        { to: "/character", label: "Characters", icon: <IoPersonCircle /> },
        { to: "/location", label: "Locations", icon: <FaMapLocationDot /> },
        { to: "/encounter", label: "Encounters", icon: <GiSeaCreature /> },
        { to: "/quest", label: "Quests", icon: <FaExclamationCircle /> },
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
            <AppShell.Header>
                <Flex h='100%' p='md' justify='space-between' align='center'>
                    <Flex>
                        <Burger
                            opened={opened}
                            onClick={toggle}
                            hiddenFrom='sm'
                            size='sm'
                            mr='md'
                        />
                        <Link
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
                        </Link>
                    </Flex>
                    <Avatar src={null} alt='nothing yet' />
                </Flex>
            </AppShell.Header>

            <AppShell.Navbar p='md'>
                <Stack gap={0}>
                    {navbarLinks.map((link) => (
                        <Link
                            key={link.to}
                            to={link.to}
                            onMouseDown={() => {
                                close();
                            }}
                        >
                            <Group>
                                {link.icon} <Text>{link.label}</Text>
                            </Group>
                        </Link>
                    ))}
                </Stack>
            </AppShell.Navbar>

            <AppShell.Main>
                <Routes>
                    <Route path='/' element={<HomePage />} />
                    {navbarLinks.map((navLinkData) => {
                        return (
                            <Route
                                path={navLinkData.to}
                                element={
                                    <GenerationPage
                                        generatorType={navLinkData.to.slice(1)}
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
