import { MotionButton } from "@/components/MotionButton";
import { MotionLink } from "@/components/MotionLink";
import {
  Box,
  Flex,
  Grid,
  Image,
  Text,
  Title,
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
          <Flex justify="flex-start" align="center" direction="row">
            <Image
              src="/img/logo.png"
              alt="Flipstax Logo"
              width={50}
              height={50}
              fit="contain"
            />
            <Title pl={10} size="h3">Flipstax</Title>
          </Flex>
        </Grid.Col>
        <Grid.Col span={{ base: 6, md: 4 }}>
          <Flex justify="center" align="center" gap="xl">
            <Text fw={500}>Home</Text>
            <Text fw={500}>How It Works</Text>
          </Flex>
        </Grid.Col>
        <Grid.Col span={{ base: 6, md: 4 }}>
          <Flex justify="flex-end" align="center" gap="xs">
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
