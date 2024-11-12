import { editDeck } from "@/redux/deckSlice";
import { useAppDispatch, useAppSelector } from "@/redux/hooks";
import Deck from "@/types/Deck";
import { ActionIcon, Card, Flex, Group, Text } from "@mantine/core";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";

interface DeckProps {
  setDeck: React.Dispatch<React.SetStateAction<Deck | null>>;
  setDeckMode: React.Dispatch<
    React.SetStateAction<"create" | "edit" | "delete" | "">
  >;
  toggleDeckModal: () => void;
}

export function Decks({ setDeck, setDeckMode, toggleDeckModal }: DeckProps) {
  const { decks } = useAppSelector((state) => state.decks);
  const navigate = useNavigate();
  const dispatch = useAppDispatch();

  const icons = {
    pin: ["fa-solid fa-thumbtack", "blue", "yellow"],
    edit: ["fa fa-pencil-square-o", "green"],
    delete: ["fa fa-trash-o", "red"],
  };

  const handleDeckClick = (deck: Deck, mode: string, e: React.MouseEvent) => {
    e.stopPropagation();
    setDeck(deck);

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
          })
        );
        break;
      default:
        navigate(`/dashboard/${deck._id}`);
    }
  };

  return (
    <>
      <Flex direction="column" gap="md" m={5}>
        {decks.map((deck) => (
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
                <Text fw={600} size="md" w="70%">
                  {deck.name}
                </Text>
                <Group gap="xs" ml="auto" w="auto">
                  {Object.entries(icons).map(([key, val]) => (
                    <motion.div
                      key={key}
                      whileHover={{ scale: 1.1 }}
                      transition={{ duration: 0.2 }}
                    >
                      <ActionIcon
                        onClick={(e) => handleDeckClick(deck, key, e)}
                        color={key === "pin" && deck.pinned ? val[2] : val[1]}
                        size="xs"
                        variant="light"
                      >
                        <i className={val[0]} style={{ fontSize: "12px" }}></i>
                      </ActionIcon>
                    </motion.div>
                  ))}
                </Group>
              </Group>
              <Text size="sm" c="dimmed">
                {deck.flashcardCount} flashcards
              </Text>
            </Card>
          </motion.div>
        ))}
      </Flex>
    </>
  );
}
