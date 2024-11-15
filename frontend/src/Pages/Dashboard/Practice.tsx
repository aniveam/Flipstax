import { MotionButton } from "@/components/ui/MotionButton";
import { useAppSelector } from "@/redux/hooks";
import { RootState } from "@/redux/store";
import Flashcard from "@/types/Flashcard";
import { ActionIcon, Card, Flex, Group, Text, Title } from "@mantine/core";
import { createSelector } from "@reduxjs/toolkit";
import { useEffect, useState } from "react";

const selectMode = (state: RootState) => state.practice.mode;
const selectFlashcards = (state: RootState) => state.flashcards.flashcards;
const selectSelectedDeck = (state: RootState) => state.decks.selectedDeck;

// Create memoized selector
const selectPracticeState = createSelector(
  [selectMode, selectFlashcards, selectSelectedDeck],
  (mode, flashcards, selectedDeck) => ({
    mode,
    flashcards,
    selectedDeck,
  })
);

export function Practice() {
  const { mode, flashcards, selectedDeck } =
    useAppSelector(selectPracticeState);
  const [practiceFlashcards, setPracticeFlashcards] = useState<Flashcard[]>([]);
  const [curIdx, setCurIdx] = useState<number>(0);
  const [flipped, setFlipped] = useState<boolean>(false);

  useEffect(() => {
    const filtered =
      mode === "favorites"
        ? [...flashcards].filter((flashcard) => flashcard.favorited)
        : flashcards;
    setPracticeFlashcards(filtered);
    setCurIdx(0);
  }, [mode, flashcards]);

  //Fisher-Yates shuffle algorithm
  const shuffleFC = (): void => {
    // Create a copy of the flashcards array to avoid modifying the original array directly
    const shuffled = [...flashcards];

    for (let i = shuffled.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
    }
    setPracticeFlashcards(shuffled);
    setCurIdx(0);
  };

  const getTitle = (): string => {
    switch (mode) {
      case "all":
        return "All Flashcards: " + selectedDeck?.name;
      case "favorites":
        return "Favorite Flashcards: " + selectedDeck?.name;
      default:
        return selectedDeck?.name || "";
    }
  };

  const handleClick = (type: "prev" | "next"): void => {
    setCurIdx((prevIdx) => {
      if (type === "prev") {
        return prevIdx <= 0 ? practiceFlashcards.length - 1 : prevIdx - 1;
      } else {
        return prevIdx >= practiceFlashcards.length - 1 ? 0 : prevIdx + 1;
      }
    });
    setFlipped(false);
  };

  const handleFlip = () => {
    setFlipped((prev) => !prev);
  };

  return (
    <>
      {practiceFlashcards.length > 0 && (
        <Flex direction="column" justify="center" align="center" gap="lg">
          <Flex direction="row" gap="md" align="center" justify="center">
            <Title order={2}>{getTitle()}</Title>
            <ActionIcon onClick={shuffleFC}>
              <i className="fa-solid fa-shuffle"></i>
            </ActionIcon>
          </Flex>
          <Group>
            <MotionButton
              whileHover={{ scale: 1.05 }}
              transition={{ duration: 0.2 }}
              color="gray"
              onClick={() => handleClick("prev")}
            >
              Prev
            </MotionButton>
            <MotionButton
              whileHover={{ scale: 1.05 }}
              transition={{ duration: 0.2 }}
              color="cyan"
              onClick={() => handleClick("next")}
            >
              Next
            </MotionButton>
          </Group>
          <Text>
            {curIdx + 1} of {practiceFlashcards.length} flashcards
          </Text>
          <Card
            shadow="sm"
            padding="lg"
            radius="md"
            w={{ base: "100%", md: "80%", lg: "70%", xl: "55%" }}
            h={{ base: 400, md: 500 }}
            display="flex"
            className={`flashcard ${flipped ? "flipped" : ""}`}
            onClick={handleFlip}
            withBorder
            style={{ cursor: "pointer" }}
          >
            <Flex align="center" justify="center" w="100%" h="80%">
              <Text size="xl" fw={500} p="lg">
                {flipped
                  ? practiceFlashcards[curIdx]?.backText
                  : practiceFlashcards[curIdx]?.frontText}
              </Text>
            </Flex>
          </Card>
        </Flex>
      )}
    </>
  );
}
