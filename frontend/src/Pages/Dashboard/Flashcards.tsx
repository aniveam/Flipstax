import TrieFlashcard from "@/classes/TrieFlashcard";
import { editFlashcard, fetchFlashcards } from "@/redux/flashcardSlice";
import { useAppDispatch, useAppSelector } from "@/redux/hooks";
import { updatePracticeMode } from "@/redux/practiceSlice";
import Flashcard from "@/types/Flashcard";
import {
  ActionIcon,
  AppShell,
  Box,
  Button,
  Card,
  Flex,
  Group,
  Menu,
  ScrollArea,
  Text,
  TextInput,
  Title,
} from "@mantine/core";
import { motion } from "framer-motion";
import parse from "html-react-parser";
import { useEffect, useState } from "react";
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
  const [search, setSearch] = useState<string>("");
  const [displayedFlashcards, setDisplayedFlashcards] = useState<Flashcard[]>(
    []
  );
  const [filterBy, setFilterBy] = useState<"all" | "favorites">("all");
  const frontTextTrie = new TrieFlashcard();
  const backTextTrie = new TrieFlashcard();

  useEffect(() => {
    dispatch(fetchFlashcards({ deckId }));
  }, [deckId]);

  useEffect(() => {
    displayedFlashcards.forEach((f) => {
      frontTextTrie.insert(f.frontText.toLowerCase(), f);
      backTextTrie.insert(f.backText.toLowerCase(), f);
    });
    if (search.trim()) {
      const resultsFront = frontTextTrie.startsWith(search.toLowerCase());
      const resultsBack = backTextTrie.startsWith(search.toLowerCase());
      const uniqueFlashcards = Array.from(
        new Set([...resultsFront, ...resultsBack])
      );
      setDisplayedFlashcards(uniqueFlashcards);
    } else {
      if (filterBy === "favorites") {
        setDisplayedFlashcards([...flashcards].filter((f) => f.favorited));
      } else {
        setDisplayedFlashcards(flashcards);
      }
    }
  }, [search, flashcards]);

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

  const handleFilterBy = (type: "all" | "favorites") => {
    setFilterBy(type);
    setSearch("");
    if (type === "all") {
      setDisplayedFlashcards(flashcards);
    } else {
      const favoriteCards = [...flashcards].filter((f) => f.favorited);
      setDisplayedFlashcards(favoriteCards);
    }
  };

  return (
    <>
      <AppShell.Section>
        <Flex justify="space-between" align="center">
          <Flex
            onClick={() => {
              navigate("/dashboard");
              dispatch(updatePracticeMode({ mode: null }));
            }}
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
        my={16}
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
      <AppShell.Section>
        <Flex p={5} direction="row" w="100%" align="center" gap="sm">
          <TextInput
            value={search}
            w="90%"
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search flashcards..."
          />
          <Menu shadow="md" width={200}>
            <Menu.Target>
              <ActionIcon color="cyan" size="md" variant="light">
                <i
                  className="fa-solid fa-filter"
                  style={{ fontSize: "14px" }}
                ></i>
              </ActionIcon>
            </Menu.Target>
            <Menu.Dropdown>
              <Menu.Label>Filter By</Menu.Label>
              <Menu.Item
                onClick={() => handleFilterBy("all")}
                leftSection={<i className="fa-solid fa-list"></i>}
              >
                All flashcards
              </Menu.Item>
              <Menu.Item
                onClick={() => handleFilterBy("favorites")}
                leftSection={<i className="fa-solid fa-star"></i>}
              >
                Favorite flashcards
              </Menu.Item>
            </Menu.Dropdown>
          </Menu>
        </Flex>
      </AppShell.Section>
      <AppShell.Section grow my="md" component={ScrollArea}>
        <Flex direction="column" gap="md" m={5}>
          {displayedFlashcards.map((flashcard: Flashcard) => (
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
