import { useAppSelector } from "@/redux/hooks";
import Deck from "@/types/Deck";
import { ActionIcon, Card, Flex, Group, Text } from "@mantine/core";
import { motion } from "framer-motion";

interface DeckProps {
  setDeck: React.Dispatch<React.SetStateAction<Deck | null>>;
}

export function Decks({ setDeck }: DeckProps) {
  const { decks } = useAppSelector((state) => state.decks);

  return (
    <>
      <Flex direction="column" gap="md" m={5}>
        {decks.map((deck) => (
          <motion.div
            key={deck._id}
            whileHover={{
              scale: 1.03,
              y: -3,
              transition: { duration: 0.3 },
            }}
            style={{ cursor: "pointer" }}
          >
            <Card
              shadow="lg"
              padding="lg"
              radius="md"
              withBorder
              onClick={() => setDeck(deck)}
              bg="var(--mantine-color-blue-light)"
              data-dark-bg="var(--mantine-color-dark-8)"
            >
              <Group
                justify="space-between"
                wrap="nowrap"
                mb="xs"
                align="flex-start"
              >
                <Text fw={600} size="md" w="60%">
                  {deck.name}
                </Text>
                <Group gap="xs" ml="auto" w="auto">
                  <ActionIcon color="blue" size="xs" variant="light">
                    <i className="fa-solid fa-thumbtack"></i>
                  </ActionIcon>
                  <ActionIcon color="green" size="xs" variant="light">
                    <i className="fa fa-pencil-square-o"></i>
                  </ActionIcon>
                  <ActionIcon color="red" size="xs" variant="light">
                    <i className="fa fa-trash-o"></i>
                  </ActionIcon>
                </Group>
              </Group>
              <Text size="sm" c="dimmed">
                {deck.flashcardCount} flashcards
              </Text>
            </Card>
          </motion.div>
        ))}
      </Flex>
    </>
  );
}
