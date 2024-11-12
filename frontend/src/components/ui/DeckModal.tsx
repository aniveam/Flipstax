import { createDeck, deleteDeck, editDeck } from "@/redux/deckSlice";
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
  const [deckName, setDeckName] = useState<string>("");

  useEffect(() => {
    if (mode === "create") {
      setDeckName("");
    } else if (mode === "edit" && deck) {
      setDeckName(deck.name);
    }
  }, [deck, mode]);

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
      dispatch(createDeck({ name: deckName }));
    }
    if (deck) {
      if (mode === "delete") {
        dispatch(deleteDeck({ _id: deck._id }));
      } else if (mode === "edit") {
        dispatch(
          editDeck({ _id: deck._id, name: deckName, pinnedStatus: deck.pinned })
        );
      }
    }
    setDeckName("");
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
          value={deckName}
          onChange={(e) => setDeckName(e.target.value)}
          label="Enter deck name"
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
              color={mode === "delete" ? "red" : "cyan"}
            >
              {getConfirmButtonText()}
            </Button>
          </Flex>
        </Flex>
      </Modal>
    </>
  );
}
