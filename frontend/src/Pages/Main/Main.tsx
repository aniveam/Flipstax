import { Navbar } from "@/components/layout/Navbar";
import { MotionLink } from "@/components/ui/MotionLink";
import { color, motion } from "framer-motion";
import { useState, useEffect } from "react";

import {
  Badge,
  Box,
  Card,
  Container,
  Flex,
  Image,
  Text,
  Title,
  useMantineColorScheme,
  useMantineTheme,
} from "@mantine/core";
import { useMediaQuery } from "@mantine/hooks";

import classes from "@/modules/Flipstax.module.css";

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
      "Sign Up or Login In",
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

  return (
    <Box>
      <Navbar />
      <Box h="100vh">
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
                  fontFamily: "Inter, sans-serif",
                  fontWeight: 400,
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
                size={isSmallScreen ? "sm" : "xl"}
                fw={450}
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
      <Box h="100vh">
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
              fontWeight: 400,
              letterSpacing: "-0.02em",
            }}
          >
            How It Works
          </Title>

          {/* Subtitle */}
          <Title
            size={isSmallScreen ? "sm" : "xl"}
            fw={450}
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
                <Title
                  mb="lg"
                  ta="center"
                  size={isSmallScreen ? "sm" : "xl"}
                  fw={400}
                  style={{ fontFamily: "Inter, sans-serif" }}
                >
                  Step-by-Step Guide
                </Title>
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
                        {step}
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
    </Box>
  );
}
