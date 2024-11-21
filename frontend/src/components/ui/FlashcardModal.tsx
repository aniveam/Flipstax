import { updateFlashcardCount } from "@/redux/deckSlice";
import {
  createFlashcard,
  deleteFlashcard,
  editFlashcard,
} from "@/redux/flashcardSlice";
import { useAppDispatch } from "@/redux/hooks";
import Flashcard from "@/types/Flashcard";
import {
  Button,
  Flex,
  Modal,
  Notification,
  Text,
  Textarea,
} from "@mantine/core";
import { useEffect, useState } from "react";

interface FlashcardModalProps {
  deckId: string | undefined;
  flashcard: Flashcard | null;
  mode: string;
  toggleFlashcardModal: () => void;
  flashcardOpened: boolean;
}

export function FlashcardModal({
  deckId,
  flashcard,
  mode,
  toggleFlashcardModal,
  flashcardOpened,
}: FlashcardModalProps) {
  const [frontText, setFrontText] = useState<string>("");
  const [backText, setBackText] = useState<string>("");
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const dispatch = useAppDispatch();

  useEffect(() => {
    if (mode === "create") {
      setFrontText("");
      setBackText("");
    } else if (mode === "edit" && flashcard) {
      setFrontText(flashcard.frontText);
      setBackText(flashcard.backText);
    }
  }, [flashcard, mode]);

  const showErrorMsg = (message: string) => {
    setErrorMsg(message);
  };

  const handleSubmit = (isCreatingAnother = false) => {
    if (mode === "create" || mode === "edit") {
      if (!frontText.trim() || !backText.trim()) {
        showErrorMsg("You must have content for both front and back text");
        return;
      }
    }
    if (deckId) {
      if (mode === "create") {
        dispatch(createFlashcard({ deckId, frontText, backText }));
        dispatch(updateFlashcardCount({ deckId, incrementBy: 1 }));
        if (isCreatingAnother) {
          setFrontText("");
          setBackText("");
          return;
        }
      }
      if (flashcard) {
        if (mode === "edit") {
          dispatch(
            editFlashcard({
              _id: flashcard._id,
              favorited: flashcard.favorited,
              frontText,
              backText,
            } as Flashcard)
          );
        } else if (mode === "delete") {
          dispatch(deleteFlashcard({ _id: flashcard._id }));
          dispatch(updateFlashcardCount({ deckId, incrementBy: -1 }));
        }
      }
    }
    setFrontText("");
    setBackText("");
    setErrorMsg(null);
    toggleFlashcardModal();
  };

  const getTitle = () => {
    switch (mode) {
      case "create":
        return "Create flashcard";
      case "edit":
        return "Edit flashcard";
      case "delete":
        return "Delete flashcard";
      default:
        return "Flashcard modal";
    }
  };

  const getModalBody = () => {
    if (mode === "delete") {
      return (
        <Text size="sm" c="dimmed">
          Are you sure you want to delete this flashcard?
        </Text>
      );
    } else {
      return (
        <>
          <Textarea
            label="Front"
            placeholder="Add a term to remember or a question to answer"
            value={frontText}
            onChange={(e) => setFrontText(e.target.value)}
            autosize
            minRows={5}
          />
          <Textarea
            label="Back"
            placeholder="Keep the definition or answer simple and focused"
            value={backText}
            onChange={(e) => setBackText(e.target.value)}
            autosize
            minRows={5}
          />
        </>
      );
    }
  };

  return (
    <>
      <Modal
        opened={flashcardOpened}
        onClose={() => {
          toggleFlashcardModal();
          setErrorMsg(null);
        }}
        title={getTitle()}
      >
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
        <Flex direction="column" gap="md" pb={20}>
          {getModalBody()}
        </Flex>
        <Flex justify="flex-end" gap="xs">
          {mode === "delete" ? (
            <>
              <Button
                variant="filled"
                radius="xl"
                size="xs"
                color="gray"
                onClick={toggleFlashcardModal}
              >
                Cancel
              </Button>
              <Button
                variant="filled"
                radius="xl"
                size="xs"
                color="red"
                onClick={() => handleSubmit()}
              >
                Delete
              </Button>
            </>
          ) : (
            <>
              <Button onClick={() => handleSubmit()} size="xs" radius="xl">
                Save and close
              </Button>
              {mode == "create" && (
                <Button
                  onClick={() => handleSubmit(true)}
                  size="xs"
                  radius="xl"
                  color="cyan"
                >
                  Add another
                </Button>
              )}
            </>
          )}
        </Flex>
      </Modal>
    </>
  );
}
