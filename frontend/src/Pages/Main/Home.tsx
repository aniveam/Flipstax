import { Navbar } from "@/components/layout/Navbar";
import { Box, Container, Flex, Text, Title } from "@mantine/core";

export function Home() {
  return (
    <Box>
      <Navbar />
      <Container h="100vh">
        <Flex
          direction="column"
          justify="center"
          align="center"
          gap="md"
          mt={50}
        >
          <Title size="4rem" ta="center">Master Concepts, One Flashcard at a Time</Title>
          <Text size="xl" fw={500} ta="center">Experience effortless learning with a streamlined design-no clutter, just the essentials to help you master concepts quickly</Text>
        </Flex>
      </Container>
    </Box>
  );
}
