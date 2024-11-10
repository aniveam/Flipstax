import { MotionButton } from "@/components/MotionButton";
import { useAuth } from "@/context/AuthContext";
import {
  AppShell,
  Burger,
  Flex,
  Group,
  Image,
  ScrollArea,
  Skeleton,
  Title,
  useMantineColorScheme,
} from "@mantine/core";
import { useDisclosure } from "@mantine/hooks";
import { useEffect } from "react";

export function Home() {
  const [mobileOpened, { toggle: toggleMobile }] = useDisclosure();
  const [desktopOpened, { toggle: toggleDesktop }] = useDisclosure(true);

  const { signOut } = useAuth();
  const { toggleColorScheme } = useMantineColorScheme({
    keepTransitions: true,
  });

  useEffect(() => {
    document.title = "Dashboard" + " • Flipstax";
  }, []);

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
        <AppShell.Section>Navbar header</AppShell.Section>
        <AppShell.Section grow my="md" component={ScrollArea}>
          60 links in a scrollable section
          {Array(60)
            .fill(0)
            .map((_, index) => (
              <Skeleton key={index} h={28} mt="sm" animate={false} />
            ))}
        </AppShell.Section>
        <AppShell.Section>
          Navbar footer – always at the bottom
        </AppShell.Section>
      </AppShell.Navbar>
      <AppShell.Main>Main</AppShell.Main>
    </AppShell>
  );
}
