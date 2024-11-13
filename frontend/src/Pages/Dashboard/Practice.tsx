import { useAppSelector } from "@/redux/hooks";
import { RootState } from "@/redux/store";
import Flashcard from "@/types/Flashcard";
import {
  ActionIcon,
  Button,
  Card,
  Flex,
  Group,
  Text,
  Title,
} from "@mantine/core";
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
        ? flashcards.filter((flashcard) => flashcard.favorited)
        : flashcards;
    setPracticeFlashcards(filtered);
    setCurIdx(0);
  }, [mode, flashcards]);

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
            <ActionIcon>
              <i className="fa-solid fa-shuffle"></i>
            </ActionIcon>
          </Flex>
          <Group>
            <Button onClick={() => handleClick("prev")}>Prev</Button>
            <Button onClick={() => handleClick("next")}>Next</Button>
          </Group>
          <Text>
            {curIdx + 1} of {practiceFlashcards.length} flashcards
          </Text>
          <Card
            shadow="sm"
            padding="lg"
            radius="md"
            w={{ base: "100%", sm: "90%", md: "70%" }}
            h={450}
            display="flex"
            className={`flashcard ${flipped ? "flipped" : ""}`}
            onClick={handleFlip}
            withBorder
            style={{ cursor: "pointer" }}
          >
            <Text>
              {flipped
                ? practiceFlashcards[curIdx]?.backText
                : practiceFlashcards[curIdx]?.frontText}
            </Text>
          </Card>
        </Flex>
      )}
    </>
  );
}
