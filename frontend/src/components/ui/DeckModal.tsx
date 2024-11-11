import { createDeck } from "@/redux/deckSlice";
import { useAppDispatch } from "@/redux/hooks";
import Deck from "@/types/Deck";
import { Button, Flex, Modal, TextInput } from "@mantine/core";
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
    setNewDeckName("");
    toggleDeckModal();
  };

  return (
    <>
      <Modal opened={deckOpened} onClose={toggleDeckModal} title={getTitle()}>
        <Flex direction="column" gap="md">
          <TextInput
            onChange={(e) => setNewDeckName(e.target.value)}
            label="Name your new deck"
            placeholder="Your deck name"
            required
          />
          <Flex justify="flex-end">
            <Button
              onClick={handleSubmit}
              variant="filled"
              radius="xl"
              color="cyan"
            >
              Create
            </Button>
          </Flex>
        </Flex>
      </Modal>
    </>
  );
}
