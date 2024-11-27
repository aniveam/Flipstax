import TrieDeck from "@/classes/TrieDeck";
import { editDeck, updateSelectedDeck } from "@/redux/deckSlice";
import { updateSelectedFolder } from "@/redux/folderSlice";
import { useAppDispatch, useAppSelector } from "@/redux/hooks";
import Deck from "@/types/Deck";
import Folder from "@/types/Folder";
import {
  ActionIcon,
  AppShell,
  Badge,
  Button,
  Card,
  Flex,
  Group,
  Menu,
  ScrollArea,
  Text,
  TextInput,
  Title,
} from "@mantine/core";
import { motion } from "framer-motion";
import { SetStateAction, useEffect, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";

interface DeckProps {
  setDeckMode: React.Dispatch<
    React.SetStateAction<"create" | "edit" | "delete" | "">
  >;
  setDeckOpened: React.Dispatch<SetStateAction<boolean>>;
  toggleDeckModal: () => void;
  setFolderMode: React.Dispatch<
    React.SetStateAction<"create" | "edit" | "delete" | "list" | "">
  >;
  setFolderOpened: React.Dispatch<SetStateAction<boolean>>;
  toggleFolderModal: () => void;
}

export function Decks({
  setDeckMode,
  setDeckOpened,
  toggleDeckModal,
  setFolderMode,
  setFolderOpened,
  toggleFolderModal,
}: DeckProps) {
  const { decks } = useAppSelector((state) => state.decks);
  const { selectedFolder, folders } = useAppSelector((state) => state.folders);
  const navigate = useNavigate();
  const dispatch = useAppDispatch();

  const [searchParams] = useSearchParams();
  const folderId = searchParams.get("folder");
  const [search, setSearch] = useState<string>("");
  const [filterBy, setFilterBy] = useState<"all" | "pinned">("all");
  const [displayedDecks, setDisplayedDecks] = useState<Deck[]>([]);
  const deckTrie = new TrieDeck();

  const isLightColor = (color: string): boolean => {
    const rgb = color
      .replace(/^#/, "")
      .match(/.{2}/g)
      ?.map((x) => parseInt(x, 16)) ?? [255, 255, 255];
    const [r, g, b] = rgb;
    // Calculate relative luminance
    const luminance = 0.2126 * r + 0.7152 * g + 0.0722 * b;
    return luminance > 128; // A threshold for light vs dark
  };

  const icons = {
    folder: ["fa-regular fa-folder", "#218BE6", "Edit folder(s)"],
    edit: ["fa fa-pencil-square-o", "green", "Edit deck"],
    delete: ["fa fa-trash-o", "red", "Delete deck"],
  };

  const folderIcons = {
    edit: ["fa fa-pencil-square-o", "green", "Edit folder"],
    delete: ["fa fa-trash-o", "red", "Delete folder"],
  };

  useEffect(() => {
    if (folderId) {
      setDisplayedDecks(
        [...decks].filter((d) => d.folderIds?.includes(folderId))
      );
    } else {
      // Dont show decks that belong to folders, we want to show them only if their folder is selected
      setDisplayedDecks([...decks].filter((d) => d.folderIds?.length === 0));
    }

    displayedDecks.forEach((dd) =>
      deckTrie.insertNode(dd.name.toLowerCase(), dd)
    );

    if (search.trim()) {
      const results = deckTrie.startsWith(search.toLowerCase().trim());
      setDisplayedDecks(results);
    } else {
      if (filterBy === "pinned") {
        setDisplayedDecks([...decks].filter((d) => d.pinned));
      }
    }
  }, [search, decks, folderId]);

  const handleFilterBy = (type: "all" | "pinned") => {
    setFilterBy(type);
    if (type === "pinned") {
      const pinnedDecks = [...decks].filter((d) => d.pinned);
      setDisplayedDecks(pinnedDecks);
    } else {
      setDisplayedDecks(decks);
    }
  };

  const handleDeckClick = (deck: Deck, mode: string, e: React.MouseEvent) => {
    e.stopPropagation();
    dispatch(updateSelectedDeck({ deck }));

    switch (mode) {
      case "edit":
        setDeckMode("edit");
        toggleDeckModal();
        break;
      case "delete":
        setDeckMode("delete");
        toggleDeckModal();
        break;
      case "pin":
        dispatch(
          editDeck({
            _id: deck._id,
            name: deck.name,
            pinnedStatus: !deck.pinned,
            folderIds: deck.folderIds,
          })
        );
        break;
      case "folder":
        setFolderMode("list");
        toggleFolderModal();
        break;
      default:
        navigate(`/dashboard/${deck._id}`);
    }
  };

  const handleFolderMenuClick = (
    folder: Folder,
    e: React.MouseEvent,
    type: "edit" | "delete"
  ) => {
    e.stopPropagation();
    setFolderMode(type);
    dispatch(updateSelectedFolder({ folder }));
    toggleFolderModal();
  };

  const handleFolderClick = (folder: Folder) => {
    dispatch(updateSelectedFolder({ folder }));
    navigate(`/dashboard?folder=${folder._id}`);
  };

  return (
    <>
      <AppShell.Section>
        <Flex justify="space-between" align="center">
          {selectedFolder ? (
            <Flex
              onClick={() => {
                dispatch(updateSelectedFolder({ folder: null }));
                navigate("/dashboard");
              }}
              direction="row"
              align="center"
              gap="xs"
              style={{ cursor: "pointer" }}
              maw="60%"
            >
              <ActionIcon variant="subtle">
                <i className="fa-solid fa-arrow-left"></i>
              </ActionIcon>
              <Title size="md">{selectedFolder.name}</Title>
            </Flex>
          ) : (
            <Title size="md">Your decks</Title>
          )}
          {!folderId && (
            <Flex justify="center" gap="xs">
              <Button
                onClick={() => {
                  setFolderOpened(true);
                  setFolderMode("create");
                }}
                size="xs"
                radius="xl"
              >
                Create folder
              </Button>
              <Button
                onClick={() => {
                  setDeckOpened(true);
                  setDeckMode("create");
                }}
                size="xs"
                radius="xl"
                color="cyan"
              >
                Create deck
              </Button>
            </Flex>
          )}
        </Flex>
      </AppShell.Section>
      <AppShell.Section>
        <Flex mt={16} p={5} dir="row" align="center" w="100%" gap="md">
          <TextInput
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search decks..."
            w="90%"
          />
          <Menu shadow="md" width={200}>
            <Menu.Target>
              <ActionIcon color="cyan" size="md" variant="light">
                <i
                  className="fa-solid fa-filter"
                  style={{ fontSize: "14px" }}
                ></i>
              </ActionIcon>
            </Menu.Target>
            <Menu.Dropdown>
              <Menu.Label>Filter by</Menu.Label>
              <Menu.Item
                onClick={() => handleFilterBy("all")}
                leftSection={
                  <i
                    className="fa-solid fa-list"
                    style={{ fontSize: "12px" }}
                  ></i>
                }
              >
                All decks
              </Menu.Item>
              <Menu.Item
                onClick={() => handleFilterBy("pinned")}
                leftSection={
                  <i
                    className="fa-solid fa-thumbtack"
                    style={{ fontSize: "12px", color: "#FAB007" }}
                  ></i>
                }
              >
                Pinned decks
              </Menu.Item>
            </Menu.Dropdown>
          </Menu>
        </Flex>
      </AppShell.Section>
      <AppShell.Section grow my="md" component={ScrollArea}>
        <Flex direction="column" gap="md" m={5}>
          {!folderId &&
            folders.map((folder: Folder) => {
              const isLight = isLightColor(folder.color);
              return (
                <motion.div
                  key={folder._id}
                  whileHover={{
                    scale: 1.03,
                    y: -3,
                    transition: { duration: 0.3 },
                  }}
                  style={{ cursor: "pointer" }}
                >
                  <Card
                    onClick={() => handleFolderClick(folder)}
                    shadow="lg"
                    padding="lg"
                    radius="md"
                    withBorder
                    bg={folder.color}
                    pos="relative"
                    style={{
                      borderTopLeftRadius: "1rem",
                      borderTopRightRadius: "0.25rem",
                      borderBottomLeftRadius: "0.25rem",
                      borderBottomRightRadius: "0.25rem",
                    }}
                  >
                    <Group justify="space-between" wrap="nowrap" align="center">
                      <Text
                        fw={600}
                        size="md"
                        w="60%"
                        style={{
                          color: isLight ? "black" : "#C9C9C9",
                        }}
                      >
                        {folder.name}
                      </Text>
                      <Menu shadow="md" width={200}>
                        <Menu.Target>
                          <Badge
                            onClick={(e) => {
                              e.stopPropagation();
                            }}
                            variant="outline"
                            color={isLight ? "#636363" : "#ececec"}
                            size="sm"
                            radius="lg"
                            style={{ cursor: "pointer" }}
                            onMouseEnter={(e) =>
                              (e.currentTarget.style.backgroundColor = isLight
                                ? "#f0f0f0"
                                : "#4a4a4a")
                            }
                            onMouseLeave={(e) =>
                              (e.currentTarget.style.backgroundColor =
                                "transparent")
                            }
                          >
                            Folder
                          </Badge>
                        </Menu.Target>
                        <Menu.Dropdown>
                          <Menu.Label>Folder Actions</Menu.Label>
                          {Object.entries(folderIcons).map(([key, val]) => (
                            <Menu.Item
                              onClick={(e) =>
                                handleFolderMenuClick(
                                  folder,
                                  e,
                                  key as "edit" | "delete"
                                )
                              }
                              key={key}
                              leftSection={
                                <i
                                  className={val[0]}
                                  style={{ fontSize: "12px", color: val[1] }}
                                ></i>
                              }
                            >
                              {val[2]}
                            </Menu.Item>
                          ))}
                        </Menu.Dropdown>
                      </Menu>
                    </Group>
                  </Card>
                </motion.div>
              );
            })}
          {displayedDecks.map((deck: Deck) => (
            <motion.div
              key={deck._id}
              whileHover={{
                scale: 1.03,
                y: -3,
                transition: { duration: 0.3 },
              }}
              style={{ cursor: "pointer" }}
            >
              <Card
                shadow="lg"
                padding="lg"
                radius="md"
                withBorder
                onClick={(e) => handleDeckClick(deck, "deck", e)}
                bg="var(--mantine-color-blue-light)"
                data-dark-bg="var(--mantine-color-dark-8)"
              >
                <Group
                  justify="space-between"
                  wrap="nowrap"
                  mb="xs"
                  align="flex-start"
                >
                  <Text fw={600} size="md" w="60%">
                    {deck.name}
                  </Text>
                  <Group gap={5} ml="auto" w="auto">
                    <motion.div
                      whileHover={{ scale: 1.1 }}
                      transition={{ duration: 0.2 }}
                    >
                      <ActionIcon
                        onClick={(e) => handleDeckClick(deck, "pin", e)}
                        color={deck.pinned ? "yellow" : "gray"}
                        size="sm"
                        variant="light"
                      >
                        <i
                          className="fa-solid fa-thumbtack"
                          style={{ fontSize: "12px" }}
                        ></i>
                      </ActionIcon>
                    </motion.div>
                    <Menu shadow="md" width={200}>
                      <Menu.Target>
                        <motion.div
                          onClick={(e: React.MouseEvent) => {
                            e.stopPropagation();
                          }}
                          whileHover={{ scale: 1.1 }}
                          transition={{ duration: 0.2 }}
                        >
                          <ActionIcon color="cyan" size="sm" variant="light">
                            <i
                              className="fa-solid fa-bars"
                              style={{
                                fontSize: "12px",
                              }}
                            ></i>
                          </ActionIcon>
                        </motion.div>
                      </Menu.Target>
                      <Menu.Dropdown>
                        <Menu.Label>Deck actions</Menu.Label>
                        {Object.entries(icons).map(([key, val]) => (
                          <Menu.Item
                            key={key}
                            onClick={(e) => handleDeckClick(deck, key, e)}
                            leftSection={
                              <i
                                className={val[0]}
                                style={{ fontSize: "12px", color: val[1] }}
                              ></i>
                            }
                          >
                            {val[2]}
                          </Menu.Item>
                        ))}
                      </Menu.Dropdown>
                    </Menu>
                  </Group>
                </Group>
                <Text size="sm" c="dimmed">
                  {deck.flashcardCount} flashcards
                </Text>
              </Card>
            </motion.div>
          ))}
        </Flex>
      </AppShell.Section>
    </>
  );
}
