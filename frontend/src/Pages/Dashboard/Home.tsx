import { DeckModal } from "@/components/ui/DeckModal";
import { FlashcardModal } from "@/components/ui/FlashcardModal";
import { MotionButton } from "@/components/ui/MotionButton";
import { PracticeModal } from "@/components/ui/PracticeModal";
import { useAuth } from "@/context/AuthContext";
import { Decks } from "@/Pages/Dashboard/Decks";
import { Flashcards } from "@/Pages/Dashboard/Flashcards";
import { Practice } from "@/Pages/Dashboard/Practice";
import { fetchDecks } from "@/redux/deckSlice";
import { useAppDispatch, useAppSelector } from "@/redux/hooks";
import Flashcard from "@/types/Flashcard";
import {
  AppShell,
  Burger,
  Flex,
  Group,
  Image,
  Title,
  useMantineColorScheme,
} from "@mantine/core";
import { useDisclosure } from "@mantine/hooks";
import { useEffect, useMemo, useState } from "react";
import { useParams } from "react-router-dom";

export function Home() {
  const [mobileOpened, { toggle: toggleMobile }] = useDisclosure();
  const [desktopOpened, { toggle: toggleDesktop }] = useDisclosure(true);
  const { toggleColorScheme } = useMantineColorScheme({
    keepTransitions: true,
  });
  const { signOut } = useAuth();
  const dispatch = useAppDispatch();
  const { deckId } = useParams();

  // Decks
  const [deckOpened, setDeckOpened] = useState<boolean>(false);
  const toggleDeckModal = () => setDeckOpened(!deckOpened);
  const [deckMode, setDeckMode] = useState<"create" | "edit" | "delete" | "">(
    ""
  );

  // Flashcards
  const [flashcardOpened, setFlashcardOpened] = useState<boolean>(false);
  const toggleFlashcardModal = () => setFlashcardOpened(!flashcardOpened);
  const [flashcardMode, setFlashcardMode] = useState<
    "create" | "edit" | "delete" | ""
  >("");
  const [flashcard, setFlashcard] = useState<Flashcard | null>(null);

  // Practice
  const [practiceOpened, setPracticeOpened] = useState<boolean>(false);
  const togglePracticeModal = () => setPracticeOpened(!practiceOpened);
  const { mode } = useAppSelector((state) => state.practice);
  const practiceContent = useMemo(() => {
    return mode ? (
      <Practice
        setFlashcard={setFlashcard}
        setFlashcardMode={setFlashcardMode}
        toggleFlashcardModal={toggleFlashcardModal}
      />
    ) : (
      <p>No Flashcards selected to Practice</p>
    );
  }, [mode]);

  useEffect(() => {
    const fetchUserDecks = () => {
      dispatch(fetchDecks());
    };
    document.title = "Dashboard" + " • Flipstax";
    fetchUserDecks();
  }, []);

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
          <Flashcards
            deckId={deckId}
            setFlashcard={setFlashcard}
            setFlashcardMode={setFlashcardMode}
            setFlashcardOpened={setFlashcardOpened}
            toggleFlashcardModal={toggleFlashcardModal}
            togglePracticeModal={togglePracticeModal}
          />
        ) : (
          <Decks
            setDeckMode={setDeckMode}
            setDeckOpened={setDeckOpened}
            toggleDeckModal={toggleDeckModal}
          />
        )}
      </AppShell.Navbar>
      <AppShell.Main>{practiceContent}</AppShell.Main>

      {/* Modals */}
      <DeckModal
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
      <PracticeModal
        togglePracticeModal={togglePracticeModal}
        practiceOpened={practiceOpened}
        toggleMobile={toggleMobile}
        toggleDesktop={toggleDesktop}
      />
    </AppShell>
  );
}
