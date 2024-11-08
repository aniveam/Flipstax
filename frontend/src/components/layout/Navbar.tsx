import {
  Box,
  Button,
  Flex,
  Grid,
  Image,
  Text,
  useMantineColorScheme,
  useMantineTheme,
} from "@mantine/core";

export function Navbar() {
  const { colorScheme, toggleColorScheme } = useMantineColorScheme({
    keepTransitions: true,
  });
  const theme = useMantineTheme();

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
          <Flex justify="flex-start" align="flex-start">
            <Image
              src="/img/logo.png"
              alt="Flipstax Logo"
              width={50}
              height={50}
              fit="contain"
            />
          </Flex>
        </Grid.Col>
        <Grid.Col span={{ base: 6, md: 4 }}>
          <Flex justify="center" align="center" gap="md">
            <Text fw={600}>Home</Text>
            <Text fw={600}>How It Works</Text>
          </Flex>
        </Grid.Col>
        <Grid.Col span={{ base: 6, md: 4 }}>
          <Flex justify="flex-end" align="center" gap="xs">
            <Button variant="filled" radius="xl">
              Log In
            </Button>
            <Button onClick={toggleColorScheme} variant="filled" radius="xl">
              <i className="fa-solid fa-circle-half-stroke"></i>
            </Button>
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
