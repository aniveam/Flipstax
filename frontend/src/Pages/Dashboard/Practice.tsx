import DoublyLinkedList from "@/classes/DoublyLinkedList";
import { MotionButton } from "@/components/ui/MotionButton";
import { useAppSelector } from "@/redux/hooks";
import { RootState } from "@/redux/store";
import { Node } from "@/types/Node";
import { ActionIcon, Card, Flex, Group, Text, Title } from "@mantine/core";
import { createSelector } from "@reduxjs/toolkit";
import { useEffect, useState } from "react";
import { motion } from "framer-motion";

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
  const [practiceList, setPracticeList] = useState<DoublyLinkedList>(
    new DoublyLinkedList()
  );
  const [curIdx, setCurIdx] = useState<number>(1);
  const [currentNode, setCurrentNode] = useState<Node | null>(null);
  const [flipped, setFlipped] = useState<boolean>(false);
  const [direction, setDirection] = useState<"left" | "right" | null>(null);

  useEffect(() => {
    initializeList();
  }, [mode, flashcards]);

  const initializeList = () => {
    const list = new DoublyLinkedList();
    const filteredFlashcards =
      mode === "favorites"
        ? [...flashcards].filter((flashcard) => flashcard.favorited)
        : flashcards;
    filteredFlashcards.forEach((flashcard) => list.insert(flashcard));
    setPracticeList(list);
    setCurrentNode(list.getFront());
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
    setDirection(type === "next" ? "left" : "right");
    if (type === "next") {
      practiceList.moveFrontToBack();
      setCurrentNode(practiceList.getFront());
      setCurIdx((prev) => (prev === practiceList.size ? 1 : prev + 1));
    } else {
      practiceList.moveBackToFront();
      setCurrentNode(practiceList.getFront());
      setCurIdx((prev) => (prev === 1 ? practiceList.size : prev - 1));
    }
    setFlipped(false);
  };

  const handleFlip = () => {
    setFlipped((prev) => !prev);
  };

  const handleShuffle = () => {
    practiceList.shuffleFC();
    setCurrentNode(practiceList.getFront());
    setCurIdx(1);
    setFlipped(false);
  };

  const handleRefresh = () => {
    initializeList();
    setCurIdx(1);
    setFlipped(false);
  };

  return (
    <>
      {practiceList.size > 0 ? (
        <Flex
          style={{ overflow: "hidden" }}
          direction="column"
          justify="center"
          align="center"
          gap="lg"
        >
          <Flex direction="row" gap="sm" align="center" justify="center">
            <Title size="h2">{getTitle()}</Title>
            <ActionIcon onClick={handleShuffle}>
              <i className="fa-solid fa-shuffle"></i>
            </ActionIcon>
            <ActionIcon onClick={handleRefresh}>
              <i className="fa fa-refresh" aria-hidden="true"></i>
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
            {curIdx} of {practiceList.size} flashcards
          </Text>
          <motion.div
            key={currentNode?.flashcard?._id}
            initial={{ x: direction === "left" ? 150 : -150, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            exit={{ x: direction === "left" ? -150 : 150, opacity: 0 }}
            transition={{ duration: 0.5 }}
            onAnimationComplete={() => setDirection(null)}
          >
            <Card
              shadow="sm"
              padding="lg"
              radius="md"
              w={{ base: 350, md: 600, lg: 700 }}
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
                    ? currentNode?.flashcard?.backText
                    : currentNode?.flashcard?.frontText}
                </Text>
              </Flex>
            </Card>
          </motion.div>
        </Flex>
      ) : (
        <Title size="h3" style={{ textAlign: "center" }}>
          No flashcards to display
        </Title>
      )}
    </>
  );
}
