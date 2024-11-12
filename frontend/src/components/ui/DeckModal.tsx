import { createDeck, deleteDeck, editDeck } from "@/redux/deckSlice";
import { useAppDispatch, useAppSelector } from "@/redux/hooks";
import {
  Button,
  Flex,
  Modal,
  Notification,
  Text,
  TextInput,
} from "@mantine/core";
import { useEffect, useState } from "react";

interface DeckModalProps {
  mode: string;
  toggleDeckModal: () => void;
  deckOpened: boolean;
}

export function DeckModal({
  mode,
  toggleDeckModal,
  deckOpened,
}: DeckModalProps) {
  const dispatch = useAppDispatch();
  const [deckName, setDeckName] = useState<string>("");
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const { selectedDeck } = useAppSelector((state) => state.decks);

  useEffect(() => {
    if (mode === "create") {
      setDeckName("");
    } else if (mode === "edit" && selectedDeck) {
      setDeckName(selectedDeck.name);
    }
  }, [selectedDeck, mode]);

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
      if (!deckName.trim()) {
        setErrorMsg("You must have a deck name");
        return;
      }
      dispatch(createDeck({ name: deckName }));
    }
    if (selectedDeck) {
      if (mode === "delete") {
        dispatch(deleteDeck({ _id: selectedDeck._id }));
      } else if (mode === "edit") {
        dispatch(
          editDeck({
            _id: selectedDeck._id,
            name: deckName,
            pinnedStatus: selectedDeck.pinned,
          })
        );
      }
    }
    setDeckName("");
    toggleDeckModal();
    setErrorMsg(null);
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
    <Modal opened={deckOpened} onClose={toggleDeckModal} title={getTitle()}>
      {errorMsg && (
        <Notification
          my={5}
          withBorder
          color="red"
          title="Oops!"
          onClose={() => setErrorMsg(null)}
        >
          {errorMsg}
        </Notification>
      )}
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
  );
}
