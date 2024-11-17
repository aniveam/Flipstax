import DoublyLinkedList from "@/classes/DoublyLinkedList";
import { MotionButton } from "@/components/ui/MotionButton";
import { editFlashcard } from "@/redux/flashcardSlice";
import { useAppDispatch, useAppSelector } from "@/redux/hooks";
import { RootState } from "@/redux/store";
import { Node } from "@/types/Node";
import { ActionIcon, Box, Card, Flex, Group, Text, Title } from "@mantine/core";
import { createSelector } from "@reduxjs/toolkit";
import { motion } from "framer-motion";
import parse from "html-react-parser";
import { useEffect, useState } from "react";

const selectMode = (state: RootState) => state.practice.mode;
const selectFlashcards = (state: RootState) => state.flashcards.flashcards;
const selectSelectedDeck = (state: RootState) => state.decks.selectedDeck;
const updatedFlashcard = (state: RootState) =>
  state.flashcards.updatedFlashcard;

// Create memoized selector
const selectPracticeState = createSelector(
  [selectMode, selectFlashcards, selectSelectedDeck, updatedFlashcard],
  (mode, flashcards, selectedDeck, updatedFlashcard) => ({
    mode,
    flashcards,
    selectedDeck,
    updatedFlashcard,
  })
);

export function Practice() {
  const { mode, flashcards, selectedDeck, updatedFlashcard } =
    useAppSelector(selectPracticeState);
  const [practiceList, setPracticeList] = useState<DoublyLinkedList>(
    new DoublyLinkedList()
  );
  const [curIdx, setCurIdx] = useState<number>(1);
  const [currentNode, setCurrentNode] = useState<Node | null>(null);
  const [flipped, setFlipped] = useState<boolean>(false);
  const [direction, setDirection] = useState<"left" | "right" | null>(null);
  const dispatch = useAppDispatch();

  useEffect(() => {
    initializeList();
  }, [mode, flashcards.length]);

  useEffect(() => {
    if (updatedFlashcard) {
      const newFlashcard = practiceList.editNode(updatedFlashcard._id, {
        ...updatedFlashcard,
      });
      // If we are updating the flashcard we are currently practicing, we need to re-render the currentNode
      // to reflect the recent changes
      if (currentNode && currentNode.flashcard?._id == newFlashcard?._id) {
        currentNode.flashcard = newFlashcard;
        setCurrentNode({ ...currentNode });
      }
    }
  }, [updatedFlashcard]);

  const initializeList = () => {
    const list = new DoublyLinkedList();
    const filteredFlashcards =
      mode === "favorites"
        ? [...flashcards].filter((flashcard) => flashcard.favorited)
        : flashcards;
    filteredFlashcards.forEach((flashcard) => list.insert(flashcard));
    setPracticeList(list);
    setCurrentNode(list.getFront());
    setCurIdx(1);
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

  const handleFlashcardClick = (
    type: string,
    curNode: Node | null,
    e: React.MouseEvent
  ) => {
    e.stopPropagation();

    if (curNode && curNode.flashcard) {
      switch (type) {
        case "favorite":
          dispatch(
            editFlashcard({
              _id: curNode.flashcard._id,
              favoriteStatus: !curNode.flashcard.favorited,
              frontText: curNode.flashcard.frontText,
              backText: curNode.flashcard.backText,
            })
          );
          const updatedFlashcard = practiceList.editNode(
            curNode.flashcard._id,
            {
              favorited: !curNode.flashcard.favorited,
            }
          );
          curNode.flashcard = updatedFlashcard;
          break;
        case "delete":
          break;
        case "edit":
          break;
      }
    }
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
            <Title size="h2" lts={2} fw={500}>
              {getTitle()}
            </Title>
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

          <motion.div
            key={currentNode?.flashcard?._id}
            initial={{ x: direction === "left" ? 150 : -150, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            exit={{ x: direction === "left" ? -150 : 150, opacity: 0 }}
            transition={{ duration: 0.5 }}
            onAnimationComplete={() => setDirection(null)}
          >
            <Card
              onClick={handleFlip}
              shadow="sm"
              padding="lg"
              radius="md"
              w={{ base: 300, md: 600, lg: 700 }}
              h={{ base: 400, md: 500 }}
              bg="var(--mantine-color-blue-light)"
              data-dark-bg="var(--mantine-color-dark-8)"
              withBorder
              style={{
                cursor: "pointer",
                transformStyle: "preserve-3d",
                transform: flipped ? "rotateY(180deg)" : "rotateY(0deg)",
                transition: "transform 0.6s cubic-bezier(0.25, 0.8, 0.25, 1)",
              }}
              pos="relative"
            >
              {!flipped && currentNode && (
                <Group
                  pos="absolute"
                  top="5%"
                  right="5%"
                  style={{ zIndex: 50 }}
                  gap="xs"
                >
                  <motion.div
                    whileHover={{ scale: 1.1 }}
                    transition={{ duration: 0.2 }}
                  >
                    <ActionIcon
                      onClick={(e) =>
                        handleFlashcardClick("favorite", currentNode, e)
                      }
                      color="yellow"
                      size="md"
                      variant="light"
                    >
                      {currentNode.flashcard?.favorited ? (
                        <i
                          style={{ fontSize: "12px" }}
                          className="fa-solid fa-star"
                        ></i>
                      ) : (
                        <i
                          style={{ fontSize: "14px" }}
                          className="fa-regular fa-star"
                        ></i>
                      )}
                    </ActionIcon>
                  </motion.div>
                  <motion.div
                    whileHover={{ scale: 1.1 }}
                    transition={{ duration: 0.2 }}
                  >
                    <ActionIcon color="green" size="md" variant="light">
                      <i
                        className="fa fa-pencil-square-o"
                        style={{ fontSize: "14px" }}
                      ></i>
                    </ActionIcon>
                  </motion.div>
                  <motion.div
                    whileHover={{ scale: 1.1 }}
                    transition={{ duration: 0.2 }}
                  >
                    <ActionIcon color="red" size="md" variant="light">
                      <i
                        className="fa fa-trash-o"
                        style={{ fontSize: "14px" }}
                      ></i>
                    </ActionIcon>
                  </motion.div>
                </Group>
              )}
              <Flex
                align="center"
                justify="center"
                style={{
                  transform: flipped ? "rotateY(180deg)" : "rotateY(0deg)",
                  transition: "transform 0.6s cubic-bezier(0.25, 0.8, 0.25, 1)",
                  overflowY: "auto",
                  height: "100%",
                }}
              >
                <Box mah="100%">
                  <Text
                    ta="center"
                    size="xl"
                    fw={500}
                    style={{ wordBreak: "break-word" }}
                  >
                    {flipped
                      ? parse(
                          currentNode?.flashcard?.backText.replace(
                            /\n/g,
                            "<br />"
                          ) || ""
                        )
                      : parse(
                          currentNode?.flashcard?.frontText.replace(
                            /\n/g,
                            "<br />"
                          ) || ""
                        )}
                  </Text>
                </Box>
              </Flex>
            </Card>
          </motion.div>
          <Text fw={600} size="1.5rem">
            {curIdx} of {practiceList.size} flashcards
          </Text>
        </Flex>
      ) : (
        <Title order={3} ta="center">
          No flashcards to display
        </Title>
      )}
    </>
  );
}
