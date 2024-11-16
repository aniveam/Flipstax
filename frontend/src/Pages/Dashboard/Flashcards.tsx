import { editFlashcard, fetchFlashcards } from "@/redux/flashcardSlice";
import { useAppDispatch, useAppSelector } from "@/redux/hooks";
import Flashcard from "@/types/Flashcard";
import {
  ActionIcon,
  AppShell,
  Box,
  Button,
  Card,
  Flex,
  Group,
  ScrollArea,
  Text,
  Title,
} from "@mantine/core";
import { motion } from "framer-motion";
import parse from "html-react-parser";
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";

interface FlashcardProps {
  deckId: string;
  setFlashcard: React.Dispatch<React.SetStateAction<Flashcard | null>>;
  setFlashcardOpened: React.Dispatch<React.SetStateAction<boolean>>;
  setFlashcardMode: React.Dispatch<
    React.SetStateAction<"create" | "edit" | "delete" | "">
  >;
  toggleFlashcardModal: () => void;
  togglePracticeModal: () => void;
}

export function Flashcards({
  deckId,
  setFlashcard,
  setFlashcardMode,
  toggleFlashcardModal,
  togglePracticeModal,
  setFlashcardOpened,
}: FlashcardProps) {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const { flashcards } = useAppSelector((state) => state.flashcards);
  const { selectedDeck } = useAppSelector((state) => state.decks);

  useEffect(() => {
    dispatch(fetchFlashcards({ deckId }));
  }, [deckId]);

  const handleFlashcardClick = (
    type: string,
    flashcard: Flashcard,
    e: React.MouseEvent
  ) => {
    e.stopPropagation();
    setFlashcard(flashcard);

    switch (type) {
      case "edit":
        setFlashcardMode("edit");
        toggleFlashcardModal();
        break;
      case "delete":
        setFlashcardMode("delete");
        toggleFlashcardModal();
        break;
      case "favorite":
        dispatch(
          editFlashcard({
            _id: flashcard._id,
            favoriteStatus: !flashcard.favorited,
            frontText: flashcard.frontText,
            backText: flashcard.backText,
          })
        );
        break;
    }
  };

  return (
    <>
      <AppShell.Section>
        <Flex justify="space-between" align="center">
          <Flex
            onClick={() => navigate("/dashboard")}
            direction="row"
            align="center"
            gap="xs"
            style={{ cursor: "pointer" }}
            maw="60%"
          >
            <ActionIcon variant="subtle">
              <i className="fa-solid fa-arrow-left"></i>
            </ActionIcon>
            <Title size="md">{selectedDeck?.name}</Title>
          </Flex>
          <Button
            onClick={() => {
              setFlashcardOpened(true);
              setFlashcardMode("create");
            }}
            size="xs"
            radius="xl"
            color="cyan"
          >
            Create flashcard
          </Button>
        </Flex>
      </AppShell.Section>
      <AppShell.Section
        mt={16}
        style={{ display: "flex", justifyContent: "center" }}
      >
        <Button
          onClick={togglePracticeModal}
          variant="filled"
          color="gray"
          radius="xl"
        >
          Practice
        </Button>
      </AppShell.Section>
      <AppShell.Section grow my="md" component={ScrollArea}>
        <Flex direction="column" gap="md" m={5}>
          {flashcards.map((flashcard: Flashcard) => (
            <motion.div
              onClick={(e) => handleFlashcardClick("edit", flashcard, e)}
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
                <Group justify="space-between" mb="xs" align="flex-start">
                  <Text
                    fw={600}
                    size="md"
                    w="70%"
                    style={{
                      wordBreak: "break-word",
                      whiteSpace: "pre-wrap",
                    }}
                  >
                    {parse(flashcard.frontText.replace(/\n/g, "<br />"))}
                  </Text>
                  <Group gap={5} ml="auto" w="auto">
                    <motion.div
                      whileHover={{ scale: 1.1 }}
                      transition={{ duration: 0.2 }}
                    >
                      <ActionIcon
                        onClick={(e) =>
                          handleFlashcardClick("favorite", flashcard, e)
                        }
                        color="yellow"
                        size="sm"
                        variant="light"
                      >
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
                      <ActionIcon
                        onClick={(e) =>
                          handleFlashcardClick("delete", flashcard, e)
                        }
                        color="red"
                        size="sm"
                        variant="light"
                      >
                        <i
                          className="fa fa-trash-o"
                          style={{ fontSize: "12px" }}
                        ></i>
                      </ActionIcon>
                    </motion.div>
                  </Group>
                </Group>
                <Box maw="100%">
                  <Text
                    size="sm"
                    c="dimmed"
                    style={{ wordBreak: "break-word", whiteSpace: "pre-wrap" }}
                  >
                    {parse(flashcard.backText.replace(/\n/g, "<br />"))}
                  </Text>
                </Box>
              </Card>
            </motion.div>
          ))}
        </Flex>
      </AppShell.Section>
    </>
  );
}
