import DoublyLinkedList from "@/classes/DoublyLinkedList";
import SpacedRepetition from "@/classes/SpacedRepetition";
import { MotionButton } from "@/components/ui/MotionButton";
import { editFlashcard } from "@/redux/flashcardSlice";
import { useAppDispatch, useAppSelector } from "@/redux/hooks";
import { RootState } from "@/redux/store";
import Flashcard from "@/types/Flashcard";
import { Node } from "@/types/Node";
import { ActionIcon, Box, Card, Flex, Group, Text, Title } from "@mantine/core";
import { createSelector } from "@reduxjs/toolkit";
import { motion } from "framer-motion";
import parse from "html-react-parser";
import { SetStateAction, useEffect, useState } from "react";

const selectMode = (state: RootState) => state.practice.mode;
const selectFlashcards = (state: RootState) => state.flashcards.flashcards;
const updatedFlashcard = (state: RootState) =>
  state.flashcards.updatedFlashcard;
const deckName = (state: RootState) => state.flashcards.deckName;

// Create memoized selector
const selectPracticeState = createSelector(
  [selectMode, selectFlashcards, updatedFlashcard, deckName],
  (mode, flashcards, updatedFlashcard, deckName) => ({
    mode,
    flashcards,
    updatedFlashcard,
    deckName,
  })
);

interface PracticeProps {
  setFlashcard: React.Dispatch<SetStateAction<Flashcard | null>>;
  setFlashcardMode: React.Dispatch<
    SetStateAction<"create" | "edit" | "delete" | "">
  >;
  toggleFlashcardModal: () => void;
}

export function Practice({
  setFlashcard,
  setFlashcardMode,
  toggleFlashcardModal,
}: PracticeProps) {
  const { mode, flashcards, updatedFlashcard, deckName } =
    useAppSelector(selectPracticeState);
  const [practiceList, setPracticeList] = useState<DoublyLinkedList>(
    new DoublyLinkedList()
  );
  const [curIdx, setCurIdx] = useState<number>(1);
  const [currentNode, setCurrentNode] = useState<Node | null>(null);
  const [flipped, setFlipped] = useState<boolean>(false);
  const [direction, setDirection] = useState<"left" | "right" | null>(null);
  const [spacedRep, setSpacedRep] = useState<SpacedRepetition>(
    new SpacedRepetition(flashcards)
  );
  const smiles = [
    "fa-regular fa-face-frown",
    "fa-regular fa-face-frown-open",
    "fa-regular fa-face-meh",
    "fa-regular fa-face-smile",
    "fa-regular fa-face-grin-beam",
  ];
  const dispatch = useAppDispatch();

  useEffect(() => {
    initializeList();
  }, [mode, flashcards.length]);

  useEffect(() => {
    if (!updatedFlashcard) {
      return;
    }
    const newList = practiceList.clone();
    const isCurrent = currentNode?.flashcard?._id === updatedFlashcard._id;

    const updatedNode = practiceList.editNode(
      updatedFlashcard._id,
      updatedFlashcard
    );

    // If we are updating the flashcard we are currently practicing, we need to re-render the currentNode to reflect the recent changes
    if (isCurrent) {
      setCurrentNode({ ...currentNode, flashcard: updatedNode });
    }

    const handleFavoritesMode = () => {
      if (!updatedFlashcard.favorited) {
        // Remove from favorites
        newList.deleteNode(updatedFlashcard._id);
        if (isCurrent) {
          setCurrentNode(newList.getFront());
          if (curIdx === newList.size) {
            setCurIdx((prev) => prev - 1);
          }
        }
      } else {
        // Add or update the flashcard
        const existingNode = newList.nodeMap.get(updatedFlashcard._id);
        if (existingNode) {
          existingNode.flashcard = updatedFlashcard;
        } else {
          newList.insert(updatedFlashcard);
        }
        if (!currentNode) {
          setCurrentNode(newList.getFront());
        }
      }
    };

    const handleSpacedRepetitionMode = () => {
      newList.deleteNode(updatedFlashcard._id);
      setCurrentNode(newList.getFront());
      setFlipped(false);
    };

    if (mode === "favorites") {
      handleFavoritesMode();
    } else if (mode === "spaced") {
      handleSpacedRepetitionMode();
    }

    setPracticeList(newList);
    setCurIdx(newList.getCurIdx(currentNode));
  }, [updatedFlashcard]);

  const getSpacedRepetitionCards = (orgCards: Flashcard[]) => {
    setSpacedRep(new SpacedRepetition(orgCards));
    const finalCards = spacedRep.getDueFlashcards();
    return finalCards;
  };

  const initializeList = () => {
    const list = new DoublyLinkedList();
    const filteredFlashcards =
      mode === "favorites"
        ? [...flashcards].filter((flashcard) => flashcard.favorited)
        : mode === "spaced"
        ? getSpacedRepetitionCards([...flashcards])
        : flashcards;
    filteredFlashcards.forEach((flashcard: Flashcard) =>
      list.insert(flashcard)
    );
    setPracticeList(list);
    setCurrentNode(list.getFront());
    setCurIdx(1);
  };

  const getTitle = (): string => {
    switch (mode) {
      case "all":
        return "All Flashcards: " + deckName;
      case "favorites":
        return "Favorite Flashcards: " + deckName;
      case "spaced":
        return "Spaced Repetition: " + deckName;
      default:
        return deckName || "";
    }
  };

  const handleClick = (type: "prev" | "next"): void => {
    setDirection(type === "next" ? "left" : "right");
    if (type === "next") {
      practiceList.moveFrontToBack();
      setCurrentNode(practiceList.getFront());
      setCurIdx((prev) => (prev >= practiceList.size ? 1 : prev + 1));
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
      setFlashcard(curNode.flashcard);
      switch (type) {
        case "favorite":
          dispatch(
            editFlashcard({
              ...curNode.flashcard,
              _id: curNode.flashcard._id,
              favorited: !curNode.flashcard.favorited,
              frontText: curNode.flashcard.frontText,
              backText: curNode.flashcard.backText,
            } as Flashcard)
          );
          const updatedFlashcard = practiceList.editNode(
            curNode.flashcard._id,
            { favorited: !curNode.flashcard.favorited }
          );
          curNode.flashcard = updatedFlashcard;
          break;
        case "edit":
          setFlashcardMode("edit");
          toggleFlashcardModal();
          break;
        case "delete":
          setFlashcardMode("delete");
          toggleFlashcardModal();
          break;
      }
    }
  };

  const handleSmileyClick = (
    e: React.MouseEvent,
    flashcard: Flashcard,
    quality: number
  ) => {
    e.stopPropagation();
    const updatedCard = spacedRep.updateCard(flashcard, quality);
    dispatch(editFlashcard({ ...updatedCard })); //Triggers useEffect when we update the card
  };

  return (
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
      {practiceList.size > 0 ? (
        <>
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
                  top="4%"
                  right="4%"
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
                      color={
                        currentNode.flashcard?.favorited ? "yellow" : "gray"
                      }
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
                    <ActionIcon
                      onClick={(e) =>
                        handleFlashcardClick("edit", currentNode, e)
                      }
                      color="green"
                      size="md"
                      variant="light"
                    >
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
                    <ActionIcon
                      onClick={(e) =>
                        handleFlashcardClick("delete", currentNode, e)
                      }
                      color="red"
                      size="md"
                      variant="light"
                    >
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
                  paddingBottom: "70px", // Space for smileys at the bottom
                  overflowY: "auto",
                  height: "calc(100% - 70px)", // Make sure there's room for smileys at the bottom
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
              {flipped && (
                <Flex
                  direction="column"
                  gap="sm"
                  pos="absolute"
                  bottom="10px"
                  left="50%"
                  style={{
                    transform: `translateX(-50%) ${
                      flipped ? "rotateY(180deg)" : "rotateY(0deg)"
                    }`,
                    zIndex: 10,
                  }}
                >
                  <Text ta="center" display="block" size="0.75rem">
                    How well did you know this?
                  </Text>
                  <Group>
                    {smiles.map((sm, index) => (
                      <motion.div
                        onClick={(e) =>
                          handleSmileyClick(
                            e,
                            currentNode?.flashcard!,
                            index + 1
                          )
                        }
                        key={index}
                        whileHover={{ scale: 1.2 }}
                        transition={{ duration: 0.2 }}
                      >
                        <i className={sm} style={{ fontSize: "25px" }}></i>
                      </motion.div>
                    ))}
                  </Group>
                </Flex>
              )}
            </Card>
          </motion.div>
          <Title size="h3" lts={1} fw={500}>
            {curIdx} of {practiceList.size}
          </Title>
        </>
      ) : (
        <Title size="h3" lts={1} fw={500}>
          0 flashcards
        </Title>
      )}
    </Flex>
  );
}
