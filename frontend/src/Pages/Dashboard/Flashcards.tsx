import { fetchFlashcards } from "@/redux/flashcardSlice";
import { useAppDispatch, useAppSelector } from "@/redux/hooks";
import Deck from "@/types/Deck";
import Flashcard from "@/types/Flashcard";
import { ActionIcon, Card, Flex, Group, Text } from "@mantine/core";
import { motion } from "framer-motion";
import parse from "html-react-parser";
import { useEffect } from "react";

interface FlashcardProps {
  deckId: string;
  deck: Deck | null;
  setFlashcard: React.Dispatch<React.SetStateAction<Flashcard | null>>;
  setFlashcardMode: React.Dispatch<
    React.SetStateAction<"create" | "edit" | "delete" | "">
  >;
  toggleFlashcardModal: () => void;
}

export function Flashcards({
  deckId,
  deck,
  setFlashcard,
  setFlashcardMode,
  toggleFlashcardModal,
}: FlashcardProps) {
  const dispatch = useAppDispatch();
  const { flashcards } = useAppSelector((state) => state.flashcards);

  useEffect(() => {
    dispatch(fetchFlashcards({ deckId }));
  }, [deckId]);

  return (
    <Flex direction="column" gap="md" m={5}>
      {flashcards.map((flashcard) => (
        <motion.div
          key={flashcard._id}
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
            bg="var(--mantine-color-blue-light)"
            data-dark-bg="var(--mantine-color-dark-8)"
          >
            <Group
              justify="space-between"
              wrap="nowrap"
              mb="xs"
              align="flex-start"
            >
              <Text fw={600} size="md" w="70%">
                {parse(flashcard.frontText.replace(/\n/g, "<br />"))}
              </Text>
              <Group gap={5} ml="auto" w="auto">
                <motion.div
                  whileHover={{ scale: 1.1 }}
                  transition={{ duration: 0.2 }}
                >
                  <ActionIcon color="yellow" size="sm" variant="light">
                    {flashcard.favorited ? (
                      <i
                        className="fa-solid fa-star"
                        style={{ fontSize: "12px" }}
                      ></i>
                    ) : (
                      <i
                        className="fa-regular fa-star"
                        style={{ fontSize: "12px" }}
                      ></i>
                    )}
                  </ActionIcon>
                </motion.div>
                <motion.div
                  whileHover={{ scale: 1.1 }}
                  transition={{ duration: 0.2 }}
                >
                  <ActionIcon color="red" size="sm" variant="light">
                    <i
                      className="fa fa-trash-o"
                      style={{ fontSize: "12px" }}
                    ></i>
                  </ActionIcon>
                </motion.div>
              </Group>
            </Group>
            <Text size="sm" c="dimmed">
              {parse(flashcard.backText.replace(/\n/g, "<br />"))}
            </Text>
          </Card>
        </motion.div>
      ))}
    </Flex>
  );
}
