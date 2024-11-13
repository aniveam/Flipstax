import { useAppSelector } from "@/redux/hooks";
import {
  ActionIcon,
  Button,
  Card,
  Flex,
  Group,
  Text,
  Title,
} from "@mantine/core";
import { useState } from "react";

export function Practice() {
  const { mode, flashcards, selectedDeck } = useAppSelector((state) => ({
    mode: state.practice.mode,
    flashcards: state.flashcards.flashcards,
    selectedDeck: state.decks.selectedDeck,
  }));

  const [curIdx, setCurIdx] = useState<number>(0);

  const getTitle = () => {
    switch (mode) {
      case "all":
        return "All Flashcards: " + selectedDeck?.name;
      case "favorites":
        return "Favorite Flashcards: " + selectedDeck?.name;
    }
  };

  const handleClick = (type: string) => {
    let temp = curIdx;
    if (type === "prev") {
      temp -= 1;
      if (temp < 0) {
        setCurIdx(flashcards.length - 1);
      } else {
        setCurIdx(temp);
      }
    } else {
      temp += 1;
      if (temp > flashcards.length - 1) {
        setCurIdx(0);
      } else {
        setCurIdx(temp);
      }
    }
  };

  return (
    <>
      {flashcards.length > 0 && (
        <Flex direction="column" justify="center" align="center" gap="lg">
          {" "}
          <Flex direction="row" gap="md" align="center" justify="center">
            <Title size="h2">{getTitle()}</Title>
            <ActionIcon>
              <i className="fa-solid fa-shuffle"></i>
            </ActionIcon>
          </Flex>
          <Group>
            <Button onClick={() => handleClick("prev")}>Prev</Button>
            <Button onClick={() => handleClick("next")}>Next</Button>
          </Group>
          <Text>
            {curIdx + 1} of {flashcards.length} flashcards
          </Text>
          <Card
            shadow="sm"
            padding="lg"
            radius="md"
            w={{ base: "100%", sm: "90%", md: "70%" }}
            h={450}
            display="flex"
            // className={`flashcard ${flipped ? 'flipped' : ''}`}
            // onClick={handleFlip}
            withBorder
          >
            {flashcards[curIdx].frontText}
          </Card>
        </Flex>
      )}
    </>
  );
}
