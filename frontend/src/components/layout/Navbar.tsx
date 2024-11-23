import { MotionButton } from "@/components/ui/MotionButton";
import { MotionLink } from "@/components/ui/MotionLink";
import {
  Box,
  Flex,
  Grid,
  Image,
  Menu,
  Text,
  Title,
  useMantineColorScheme,
  useMantineTheme,
} from "@mantine/core";
import { useMediaQuery } from "@mantine/hooks";

export function Navbar() {
  const { colorScheme, toggleColorScheme } = useMantineColorScheme({
    keepTransitions: true,
  });
  const theme = useMantineTheme();
  const isSmallScreen = useMediaQuery("(max-width: 768px)");

  const handleScroll = (id: string) => {
    const section = document.getElementById(id);
    if (section) {
      const elementPosition = section.getBoundingClientRect().top;
      const offsetPosition = elementPosition + window.scrollY - 80;

      window.scrollTo({
        top: offsetPosition,
        behavior: "smooth",
      });
    }
  };

  return (
    <Box
      component="nav"
      pos="sticky"
      top={0}
      p="md"
      h="80px"
      bg={colorScheme === "dark" ? theme.colors.dark[7] : theme.colors.gray[0]}
      style={{
        zIndex: 50,
        display: "flex",
        alignItems: "center",
      }}
    >
      <Grid align="center" w="100%">
        <Grid.Col span={4} display={{ base: "none", md: "block" }}>
          <Flex justify="flex-start" align="center" direction="row">
            <Image
              src="/img/logo.png"
              alt="Flipstax Logo"
              width={50}
              height={50}
              fit="contain"
            />
            <Title pl={10} size="h2">
              Flipstax
            </Title>
          </Flex>
        </Grid.Col>

        <Grid.Col span={{ base: 10, md: 4 }}>
          <Flex
            justify={isSmallScreen ? "flex-start" : "center"}
            align="center"
            gap={isSmallScreen ? "md" : "xl"}
          >
            <Text
              fw={500}
              onClick={() => handleScroll("home")}
              style={{ cursor: "pointer" }}
            >
              Home
            </Text>
            <Text
              fw={500}
              onClick={() => handleScroll("how-it-works")}
              style={{ cursor: "pointer" }}
            >
              How it Works
            </Text>
            <Text
              fw={500}
              onClick={() => handleScroll("features")}
              style={{ cursor: "pointer" }}
            >
              Features
            </Text>
          </Flex>
        </Grid.Col>

        <Grid.Col span={{ base: 2, md: 4 }}>
          <Flex justify="flex-end" align="center" gap="xs">
            {isSmallScreen ? (
              <Menu shadow="md" width={200}>
                <Menu.Target>
                  <MotionButton
                    whileHover={{ scale: 1.05 }}
                    transition={{ duration: 0.2 }}
                    style={{
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      padding: "10px",
                      border: "none",
                      cursor: "pointer",
                      background: "none",
                    }}
                  >
                    <i
                      className="fa-solid fa-bars"
                      style={{ color: "var(--mantine-color-dark-2)" }}
                    ></i>
                  </MotionButton>
                </Menu.Target>
                <Menu.Dropdown>
                  <Menu.Item
                    component="a"
                    href="/login"
                    leftSection={
                      <i className="fa-solid fa-right-to-bracket"></i>
                    }
                  >
                    Log In
                  </Menu.Item>
                  <Menu.Item
                    onClick={toggleColorScheme}
                    leftSection={
                      <i className="fa-solid fa-circle-half-stroke"></i>
                    }
                  >
                    Toggle Theme
                  </Menu.Item>
                </Menu.Dropdown>
              </Menu>
            ) : (
              <>
                <MotionLink
                  href="/login"
                  whileHover={{ scale: 1.05 }}
                  transition={{ duration: 0.2 }}
                >
                  Log In
                </MotionLink>
                <MotionButton
                  whileHover={{ scale: 1.05 }}
                  transition={{ duration: 0.2 }}
                  onClick={toggleColorScheme}
                >
                  <i className="fa-solid fa-circle-half-stroke"></i>
                </MotionButton>
              </>
            )}
          </Flex>
        </Grid.Col>
      </Grid>

      <Box
        pos="absolute"
        bottom={0}
        left={0}
        h="0.25rem"
        w="100%"
        style={{
          background:
            "linear-gradient(to right, blue 0%, green 33%, red 66%, yellow 100%)",
        }}
      />
    </Box>
  );
}
