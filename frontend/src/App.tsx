import { AppShell, Burger, Flex, Group, Stack, Text } from "@mantine/core";
import { useDisclosure } from "@mantine/hooks";
import { FaMapLocationDot } from "react-icons/fa6";
import { IoPersonCircle } from "react-icons/io5";
import { TbCrystalBall } from "react-icons/tb";
import { Link, Route, Routes } from "react-router";
import "./App.css";
import GenerationPage from "./pages/GenerationPage";
import HomePage from "./pages/HomePage";

function App() {
    const [opened, { toggle, close }] = useDisclosure();

    const navbarLinks = [
        { to: "/magic items", label: "Magic Items", icon: <TbCrystalBall /> },
        { to: "/characters", label: "Characters", icon: <IoPersonCircle /> },
        { to: "/locations", label: "Locations", icon: <FaMapLocationDot /> },
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
                <Flex p='md'>
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
                            <Text fw='bold' visibleFrom='sm'>
                                Dungeons & Generators
                            </Text>
                            <Text fw='bold' hiddenFrom='sm'>
                                D&G
                            </Text>
                        </Group>
                    </Link>
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
                    <Route
                        path='/Magic Items'
                        element={<GenerationPage generatorType='magic-item' />}
                    />
                    <Route
                        path='/Characters'
                        element={<GenerationPage generatorType='character' />}
                    />
                    <Route
                        path='/Locations'
                        element={<GenerationPage generatorType='location' />}
                    />
                </Routes>
            </AppShell.Main>
        </AppShell>
    );
}

export default App;
