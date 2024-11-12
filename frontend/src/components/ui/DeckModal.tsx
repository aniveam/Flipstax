import { createDeck, deleteDeck } from "@/redux/deckSlice";
import { useAppDispatch } from "@/redux/hooks";
import Deck from "@/types/Deck";
import { Button, Flex, Modal, Text, TextInput } from "@mantine/core";
import { useEffect, useState } from "react";

interface DeckModalProps {
  deck: Deck | null;
  mode: string;
  toggleDeckModal: () => void;
  deckOpened: boolean;
}

export function DeckModal({
  deck,
  mode,
  toggleDeckModal,
  deckOpened,
}: DeckModalProps) {
  const dispatch = useAppDispatch();
  const [newDeckName, setNewDeckName] = useState<string>("");

  useEffect(() => {
    if (deck) {
      setNewDeckName(deck.name);
    }
  }, [deck]);

  const getTitle = () => {
    switch (mode) {
      case "create":
        return "Create deck";
      case "edit":
        return "Edit deck";
      case "delete":
        return "Delete deck";
      default:
        return "Deck modal";
    }
  };

  const handleSubmit = () => {
    if (mode === "create") {
      dispatch(createDeck({ name: newDeckName }));
    }
    if (deck) {
      if (mode === "delete") {
        dispatch(deleteDeck({ _id: deck._id }));
      } else if (mode === "edit") {
      }
    }
    setNewDeckName("");
    toggleDeckModal();
  };

  const getConfirmButtonText = () => {
    switch (mode) {
      case "create":
        return "Create";
      case "edit":
        return "Save";
      case "delete":
        return "Delete";
      default:
        return "Deck modal";
    }
  };

  const getModalBody = () => {
    if (mode === "delete") {
      return (
        <Text size="sm" c="dimmed">
          Are you sure you want to delete this deck?
        </Text>
      );
    } else {
      return (
        <TextInput
          onChange={(e) => setNewDeckName(e.target.value)}
          label="Name your new deck"
          placeholder="Your deck name"
          required
        />
      );
    }
  };

  return (
    <>
      <Modal opened={deckOpened} onClose={toggleDeckModal} title={getTitle()}>
        <Flex direction="column" gap="md">
          {getModalBody()}
          <Flex justify="flex-end" gap="xs">
            <Button
              onClick={toggleDeckModal}
              variant="filled"
              radius="xl"
              size="xs"
              color="gray"
            >
              Cancel
            </Button>
            <Button
              onClick={handleSubmit}
              variant="filled"
              radius="xl"
              size="xs"
              color="cyan"
            >
              {getConfirmButtonText()}
            </Button>
          </Flex>
        </Flex>
      </Modal>
    </>
  );
}
