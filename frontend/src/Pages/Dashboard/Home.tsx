import { DeckModal } from "@/components/ui/DeckModal";
import { MotionButton } from "@/components/ui/MotionButton";
import { useAuth } from "@/context/AuthContext";
import Deck from "@/types/Deck";
import {
  AppShell,
  Burger,
  Button,
  Flex,
  Group,
  Image,
  ScrollArea,
  Skeleton,
  Title,
  useMantineColorScheme,
} from "@mantine/core";
import { useDisclosure } from "@mantine/hooks";
import { useEffect, useState } from "react";

export function Home() {
  const [mobileOpened, { toggle: toggleMobile }] = useDisclosure();
  const [desktopOpened, { toggle: toggleDesktop }] = useDisclosure(true);
  // Decks
  const [deckOpened, setDeckOpened] = useState<boolean>(false);
  const [deckMode, setDeckMode] = useState<string>("");
  const [deck, setDeck] = useState<Deck | null>(null);

  const { signOut } = useAuth();
  const { toggleColorScheme } = useMantineColorScheme({
    keepTransitions: true,
  });

  useEffect(() => {
    document.title = "Dashboard" + " • Flipstax";
  }, []);

  const toggleDeckModal = () => setDeckOpened(!deckOpened);

  return (
    <AppShell
      header={{ height: 60 }}
      navbar={{
        width: 300,
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
          {Array(60)
            .fill(0)
            .map((_, index) => (
              <Skeleton key={index} h={28} mt="sm" animate={false} />
            ))}
        </AppShell.Section>
      </AppShell.Navbar>
      <AppShell.Main>Main</AppShell.Main>

      {/* Modals */}
      <DeckModal
        deck={deck}
        mode={deckMode}
        toggleDeckModal={toggleDeckModal}
        deckOpened={deckOpened}
      />
    </AppShell>
  );
}
