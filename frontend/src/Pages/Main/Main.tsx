import { Footer } from "@/components/layout/Footer";
import { Navbar } from "@/components/layout/Navbar";
import { MotionLink } from "@/components/ui/MotionLink";
import {
  ActionIcon,
  Badge,
  Box,
  Card,
  Container,
  Flex,
  Grid,
  Image,
  Stack,
  Text,
  Title,
  useMantineColorScheme,
  useMantineTheme,
} from "@mantine/core";
import { useMediaQuery } from "@mantine/hooks";
import { motion } from "framer-motion";
import parse from "html-react-parser";
import { useEffect, useState } from "react";

export function Main() {
  const { colorScheme } = useMantineColorScheme();
  const theme = useMantineTheme();
  const isSmallScreen = useMediaQuery("(max-width: 768px)");
  const imgType = colorScheme === "light" ? 2 : 3;
  const [img, setImg] = useState<[number, number]>([0, imgType]);

  useEffect(() => {
    setImg((prev) => [prev[0], imgType]);
  }, [colorScheme]);

  const slideVariants = {
    start: { y: 40, opacity: 0 },
    end: { y: 0, opacity: 1 },
  };

  const bounceVariants = {
    start: { y: 40 },
    bounce: { y: [0, 5, 0] },
  };

  const steps = [
    [
      "<a href='/register' target='_blank'>Sign Up</a> or <a href='/login' target='_blank'>Log In</a>",
      "Create an account to start",
      "/img/loginPage.png",
      "/img/loginPageDark.png",
    ],
    [
      "Create Decks",
      "Add new decks and organize your flashcards",
      "/img/createDeck.png",
      "/img/createDeckDark.png",
    ],
    [
      "Add Flashcards",
      "Create flashcards for each deck with front and back text",
      "/img/createFlashcard.png",
      "/img/createFlashcardDark.png",
    ],
    [
      "Practice Modes",
      "Choose between studying all flashcards, focusing on favorites, or using the spaced repetition algorithm",
      "/img/practiceModes.png",
      "/img/practiceModesDark.png",
    ],
  ];

  const features = [
    {
      icon: "fa-layer-group",
      title: "Deck Creation & Organization",
      description:
        "Easily create and organize flashcard decks. Pin and favorite decks for quick access, and use filtering and sorting to stay organized.",
    },
    {
      icon: "fa-clock",
      title: "Spaced Repetition",
      description:
        "Boost retention with the SM2 spaced repetition algorithm, ensuring efficient study by prioritizing cards that need more attention.",
    },
    {
      icon: "fa-cogs",
      title: "Flashcard Management",
      description:
        "Add, edit, and delete flashcards with ease. Mark cards as favorites for focused review and manage them within decks.",
    },
    {
      icon: "fa-search",
      title: "Powerful Search",
      description:
        "Find specific decks or flashcards instantly with a fast search engine. Search by name for decks or front/back text for quick results.",
    },
    {
      icon: "fa-tv",
      title: "Interactive UI & Animations",
      description:
        "Enjoy a seamless user experience with smooth flashcard animations and a responsive interface across devices.",
    },
    {
      icon: "fa-sliders-h",
      title: "Customizable Study Sessions",
      description:
        "Tailor your study sessions by focusing on favorited flashcards, decks, or specific concepts, allowing for personalized learning.",
    },
  ];

  return (
    <Box id="home">
      <Navbar />
      <Box mih="100vh">
        <Container h="100%" pt="calc(60px)">
          <Flex h="100%" direction="column" align="center" gap="md">
            <motion.div
              variants={slideVariants}
              initial="start"
              animate="end"
              transition={{ duration: 0.9 }}
            >
              <Title
                size={isSmallScreen ? "2.5rem" : "4rem"}
                ta="center"
                style={{
                  fontWeight: 600,
                  letterSpacing: "-0.02em",
                }}
              >
                Master Concepts, One Flashcard at a Time
              </Title>
            </motion.div>
            <motion.div
              variants={slideVariants}
              initial="start"
              animate="end"
              transition={{ duration: 0.9, delay: 0.1 }}
            >
              <Text
                size={isSmallScreen ? "md" : "xl"}
                fw={500}
                ta="center"
                style={{
                  fontFamily: "Inter, sans-serif",
                }}
              >
                Experience effortless learning with a streamlined design-no
                clutter, just the essentials to help you master concepts quickly
              </Text>
            </motion.div>
            <motion.div
              variants={slideVariants}
              initial="start"
              animate="end"
              transition={{ duration: 0.9, delay: 0.1 }}
            >
              <MotionLink
                href="/login"
                whileHover={{ scale: 1.05 }}
                transition={{ duration: 0.2 }}
              >
                Try it now
              </MotionLink>
            </motion.div>

            <motion.div
              variants={bounceVariants}
              initial="start"
              animate="bounce"
              transition={{
                duration: 2,
                repeat: Infinity,
              }}
              style={{
                position: "relative",
                padding: "5px",
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                height: "auto",
              }}
            >
              <Image
                pos="absolute"
                src="/img/Artwork.png"
                h="100%"
                width="100%"
                style={{
                  opacity: 0.75,
                  filter: "blur(20px)",
                }}
              />
              <Image
                style={{ zIndex: 50 }}
                pos="relative"
                h="auto"
                width="100%"
                fit="contain"
                src={
                  colorScheme === "light"
                    ? "/img/Macbook.png"
                    : "/img/MacbookDark.png"
                }
              />
            </motion.div>
          </Flex>
        </Container>
      </Box>
      <Box id="how-it-works" mih="100vh">
        <Flex
          pt="calc(60px)"
          align="center"
          justify="center"
          direction="column"
          h="100%"
          gap="md"
        >
          {/* Main Title */}
          <Title
            size={isSmallScreen ? "2.5rem" : "4rem"}
            ta="center"
            style={{
              fontFamily: "Inter, sans-serif",
              fontWeight: 600,
              letterSpacing: "-0.02em",
            }}
          >
            How it Works
          </Title>

          {/* Subtitle */}
          <Title
            size={isSmallScreen ? "md" : "xl"}
            fw={500}
            ta="center"
            style={{
              fontFamily: "Inter, sans-serif",
            }}
          >
            Empower your study routine in just a few steps
          </Title>

          {/* Step-by-Step Guide */}
          <Container size="lg" p={isSmallScreen ? "xs" : "md"}>
            <Flex
              align="center"
              justify="space-between"
              direction={isSmallScreen ? "column" : "row"}
              gap="lg"
              h="100%"
            >
              {/* Steps Section */}
              <Box w={isSmallScreen ? "100%" : "50%"} p="md">
                {steps.map(([step, description], index) => (
                  <Card
                    key={index}
                    bg={
                      index === img[0]
                        ? colorScheme === "light"
                          ? theme.colors.blue[0]
                          : theme.colors.dark[6]
                        : colorScheme === "light"
                        ? theme.colors.gray[0]
                        : theme.colors.dark[7]
                    }
                    onClick={() => setImg([index, imgType])}
                    style={{
                      cursor: "pointer",
                      transition: "transform 0.2s ease",
                      transform: index === img[0] ? "scale(1.02)" : "scale(1)",
                    }}
                    shadow={index === img[0] ? "lg" : "sm"}
                    padding="lg"
                    radius="md"
                    withBorder
                    mb="md"
                  >
                    <Flex align="center" gap="sm">
                      <Badge
                        size="lg"
                        radius="sm"
                        variant="light"
                        color={theme.colors.blue[5]}
                      >
                        Step {index + 1}
                      </Badge>
                      <Text fw={600} size="lg">
                        {parse(step)}
                      </Text>
                    </Flex>
                    <Text mt="sm" c={theme.colors.gray[6]}>
                      {description}
                    </Text>
                  </Card>
                ))}
              </Box>

              {/* Image Section */}
              <Box w={isSmallScreen ? "100%" : "50%"}>
                <Image
                  radius="md"
                  src={steps[img[0]][img[1]]}
                  w="100%"
                  style={{
                    border: `1px solid ${
                      colorScheme === "light"
                        ? theme.colors.gray[2]
                        : theme.colors.dark[5]
                    }`,
                  }}
                />
              </Box>
            </Flex>
          </Container>
        </Flex>
      </Box>

      {/* Features Section */}
      <Box id="features" mih="100vh" pt="calc(80px)" pl={10} pr={10} pb={30}>
        <Container size="md">
          <Stack gap={50} align="center">
            <Stack gap="md" align="center">
              <Badge variant="outline" color="gray" size="lg" radius="lg">
                Packed with Features
              </Badge>
              <Title
                order={1}
                size={isSmallScreen ? "2rem" : "4rem"}
                ta="center"
                style={{
                  letterSpacing: "-0.02em",
                  fontWeight: 600,
                }}
              >
                Transform Your Study Habits with Flipstax
              </Title>
            </Stack>
          </Stack>
          <Grid gutter="sm" align="center" pt={20}>
            {features.map((feature, index) => (
              <Grid.Col key={index} span={{ base: 12, sm: 6 }}>
                <Card
                  padding={isSmallScreen ? "sm" : "xl"}
                  radius="md"
                  withBorder
                  style={{
                    height: "100%",
                    maxWidth: isSmallScreen ? "100%" : "auto",
                    transition: "box-shadow 0.2s ease",
                    margin: "8 8 8 8",
                  }}
                >
                  <Flex
                    direction={isSmallScreen ? "column" : "row"}
                    gap="md"
                    align={isSmallScreen ? "center" : "start"}
                  >
                    <ActionIcon
                      variant="light"
                      color="blue"
                      size={isSmallScreen ? "lg" : "xl"}
                      radius="md"
                    >
                      <i className={`fa-solid ${feature.icon}`}></i>
                    </ActionIcon>
                    <Stack gap="xs" align={isSmallScreen ? "center" : "start"}>
                      <Title
                        order={3}
                        style={{
                          fontSize: isSmallScreen
                            ? theme.fontSizes.md
                            : theme.fontSizes.lg,
                        }}
                      >
                        {feature.title}
                      </Title>
                      <Text
                        c="dimmed"
                        style={{
                          fontSize: theme.fontSizes.sm,
                          textAlign: isSmallScreen ? "center" : "left",
                        }}
                      >
                        {feature.description}
                      </Text>
                    </Stack>
                  </Flex>
                </Card>
              </Grid.Col>
            ))}
          </Grid>
        </Container>
      </Box>
      <Footer />
    </Box>
  );
}
