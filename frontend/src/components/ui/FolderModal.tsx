import { editDeck, removeFolderFromDecks } from "@/redux/deckSlice";
import { createFolder, deleteFolder, editFolder } from "@/redux/folderSlice";
import { useAppDispatch, useAppSelector } from "@/redux/hooks";
import {
  Button,
  Flex,
  Modal,
  MultiSelect,
  Notification,
  Stack,
  Text,
  TextInput,
} from "@mantine/core";
import { useEffect, useMemo, useState } from "react";
import { HexColorInput, HexColorPicker } from "react-colorful";

interface FolderModalProps {
  mode: string;
  toggleFolderModal: () => void;
  folderOpened: boolean;
}

export function FolderModal({
  mode,
  toggleFolderModal,
  folderOpened,
}: FolderModalProps) {
  const { selectedDeck } = useAppSelector((state) => state.decks);
  const { folders, selectedFolder } = useAppSelector((state) => state.folders);
  const dispatch = useAppDispatch();

  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [folderName, setFolderName] = useState<string>("");
  const [selectedFolders, setSelectedFolders] = useState<string[]>([]);

  const defaultColor = "#1971C2";
  const [color, setColor] = useState(defaultColor);

  const sortedFolders = useMemo(() => {
    return [...folders].sort((a, b) => a.name.localeCompare(b.name));
  }, [folders]);

  useEffect(() => {
    if (mode === "create") {
      setFolderName("");
    } else if (mode === "edit" && selectedFolder) {
      setFolderName(selectedFolder.name);
      setColor(selectedFolder.color);
    }
  }, [selectedFolder]);

  useEffect(() => {
    if (selectedDeck?.folderIds) {
      const validFolderIds = selectedDeck.folderIds.filter((id) =>
        folders.some((folder) => folder._id === id)
      );
      setSelectedFolders(validFolderIds);
    }
  }, [selectedDeck, folderOpened]);

  const getTitle = () => {
    switch (mode) {
      case "create":
        return "Create folder";
      case "edit":
        return "Edit folder";
      case "delete":
        return "Delete folder";
      case "list":
        return `Deck "${selectedDeck?.name}"`;
      default:
        return "Folder modal";
    }
  };

  const getModalBody = () => {
    if (mode === "delete") {
      return (
        <Text size="sm" c="dimmed">
          Are you sure you want to delete this folder?
        </Text>
      );
    } else if (mode === "list") {
      return (
        <MultiSelect
          value={selectedFolders}
          onChange={setSelectedFolders}
          label="Select folder(s)"
          data={sortedFolders.map((f) => ({ value: f._id, label: f.name }))}
          searchable
        />
      );
    } else {
      return (
        <>
          <TextInput
            value={folderName}
            onChange={(e) => setFolderName(e.target.value)}
            label="Enter folder name"
            placeholder="Your folder name"
            required
          ></TextInput>
          <Stack gap="xs">
            <Text size="sm" fw={500}>
              Choose folder color <span style={{ color: "#E03231" }}>*</span>
            </Text>
            <HexColorPicker color={color} onChange={setColor}></HexColorPicker>
            <HexColorInput prefixed={true} color={color} onChange={setColor} />
          </Stack>
        </>
      );
    }
  };

  const getConfirmButtonText = () => {
    switch (mode) {
      case "create":
        return "Create";
      case "edit":
        return "Save";
      case "delete":
        return "Delete";
      case "list":
        return "Add";
      default:
        return "Flashcard modal";
    }
  };

  const handleSubmit = () => {
    if (mode === "create") {
      if (!folderName.trim()) {
        setErrorMsg("You must have a folder name");
        return;
      }
      if (!color.trim()) {
        setColor(defaultColor);
      }
      dispatch(createFolder({ name: folderName, color }));
    } else if (selectedDeck) {
      if (mode === "list") {
        dispatch(
          editDeck({
            _id: selectedDeck._id,
            name: selectedDeck.name,
            pinnedStatus: selectedDeck.pinned,
            folderIds: selectedFolders,
          })
        );
      } else if (selectedFolder) {
        if (mode === "edit") {
          dispatch(
            editFolder({
              _id: selectedFolder._id,
              name: folderName,
              color,
            })
          );
        } else if (mode === "delete") {
          dispatch(deleteFolder({ _id: selectedFolder._id })).then(() => {
            dispatch(removeFolderFromDecks(selectedFolder._id));
          });
        }
      }
    }

    setFolderName("");
    toggleFolderModal();
    setErrorMsg(null);
  };

  return (
    <Modal
      opened={folderOpened}
      onClose={() => {
        toggleFolderModal();
        setSelectedFolders([]);
        setColor(defaultColor);
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
      <Flex direction="column" gap="md">
        {getModalBody()}
        <Flex justify="flex-end" gap="xs">
          <Button
            onClick={toggleFolderModal}
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
