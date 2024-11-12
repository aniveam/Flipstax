import { DeckModal } from "@/components/ui/DeckModal";
import { FlashcardModal } from "@/components/ui/FlashcardModal";
import { MotionButton } from "@/components/ui/MotionButton";
import { useAuth } from "@/context/AuthContext";
import { Decks } from "@/Pages/Dashboard/Decks";
import { Flashcards } from "@/Pages/Dashboard/Flashcards";
import { fetchDecks } from "@/redux/deckSlice";
import { useAppDispatch } from "@/redux/hooks";
import Deck from "@/types/Deck";
import Flashcard from "@/types/Flashcard";
import {
  ActionIcon,
  AppShell,
  Burger,
  Button,
  Flex,
  Group,
  Image,
  ScrollArea,
  Title,
  useMantineColorScheme,
} from "@mantine/core";
import { useDisclosure } from "@mantine/hooks";
import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";

export function Home() {
  const [mobileOpened, { toggle: toggleMobile }] = useDisclosure();
  const [desktopOpened, { toggle: toggleDesktop }] = useDisclosure(true);
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const { deckId } = useParams();

  // Decks
  const [deckOpened, setDeckOpened] = useState<boolean>(false);
  const toggleDeckModal = () => setDeckOpened(!deckOpened);
  const [deckMode, setDeckMode] = useState<"create" | "edit" | "delete" | "">(
    ""
  );
  const [deck, setDeck] = useState<Deck | null>(null);

  //Flashcards
  const flashcards = useAppDispatch();
  const [flashcardOpened, setFlashcardOpened] = useState<boolean>(false);
  const toggleFlashcardModal = () => setFlashcardOpened(!flashcardOpened);
  const [flashcardMode, setFlashcardMode] = useState<
    "create" | "edit" | "delete" | ""
  >("");
  const [flashcard, setFlashcard] = useState<Flashcard | null>(null);

  const { signOut } = useAuth();
  const { toggleColorScheme } = useMantineColorScheme({
    keepTransitions: true,
  });

  useEffect(() => {
    const fetchUserDecks = () => {
      dispatch(fetchDecks());
    };
    document.title = "Dashboard" + " • Flipstax";
    fetchUserDecks();
  }, [flashcards.length]);

  return (
    <AppShell
      header={{ height: 60 }}
      navbar={{
        width: 400,
        breakpoint: "sm",
        collapsed: { mobile: !mobileOpened, desktop: !desktopOpened },
      }}
      padding="md"
    >
      <AppShell.Header>
        <Flex h="100%" px="md" justify="space-between" align="center">
          <Group>
            <Burger
              opened={mobileOpened}
              onClick={toggleMobile}
              hiddenFrom="sm"
              size="sm"
            />
            <Burger
              opened={desktopOpened}
              onClick={toggleDesktop}
              visibleFrom="sm"
              size="sm"
            />
            <Flex justify="flex-start" align="center" direction="row">
              <Image
                src="/img/logo.png"
                alt="Flipstax Logo"
                width={30}
                height={30}
                fit="contain"
              />
              <Title pl={10} size="h3">
                Flipstax
              </Title>
            </Flex>
          </Group>
          <Flex justify="flex-end" align="center" gap="xs">
            <MotionButton
              onClick={signOut}
              whileHover={{ scale: 1.05 }}
              transition={{ duration: 0.2 }}
            >
              Log Out
            </MotionButton>
            <MotionButton
              whileHover={{ scale: 1.05 }}
              transition={{ duration: 0.2 }}
              onClick={toggleColorScheme}
            >
              <i className="fa-solid fa-circle-half-stroke"></i>
            </MotionButton>
          </Flex>
        </Flex>
      </AppShell.Header>
      <AppShell.Navbar p="md">
        {deckId ? (
          <>
            <AppShell.Section>
              <Flex justify="space-between" align="center">
                <Flex
                  onClick={() => navigate("/dashboard")}
                  direction="row"
                  align="center"
                  gap="xs"
                  style={{ cursor: "pointer" }}
                  maw="60%"
                >
                  <ActionIcon variant="subtle">
                    <i className="fa-solid fa-arrow-left"></i>
                  </ActionIcon>
                  <Title size="md">{deck?.name}</Title>
                </Flex>
                <Button
                  onClick={() => {
                    setFlashcardOpened(true);
                    setFlashcardMode("create");
                  }}
                  size="xs"
                  radius="xl"
                  color="cyan"
                >
                  Create flashcard
                </Button>
              </Flex>
            </AppShell.Section>
            <AppShell.Section grow my="md" component={ScrollArea}>
              <Flashcards
                deckId={deckId}
                deck={deck}
                setFlashcard={setFlashcard}
                setFlashcardMode={setFlashcardMode}
                toggleFlashcardModal={toggleFlashcardModal}
              />
            </AppShell.Section>
          </>
        ) : (
          <>
            <AppShell.Section>
              <Flex justify="space-between" align="center">
                <Title size="md">Your decks</Title>
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
            </AppShell.Section>
            <AppShell.Section grow my="md" component={ScrollArea}>
              <Decks
                setDeck={setDeck}
                setDeckMode={setDeckMode}
                toggleDeckModal={toggleDeckModal}
              />
            </AppShell.Section>
          </>
        )}
      </AppShell.Navbar>
      <AppShell.Main>Main</AppShell.Main>

      {/* Modals */}
      <DeckModal
        deck={deck}
        mode={deckMode}
        toggleDeckModal={toggleDeckModal}
        deckOpened={deckOpened}
      />
      <FlashcardModal
        deckId={deckId}
        flashcard={flashcard}
        mode={flashcardMode}
        toggleFlashcardModal={toggleFlashcardModal}
        flashcardOpened={flashcardOpened}
      />
    </AppShell>
  );
}
