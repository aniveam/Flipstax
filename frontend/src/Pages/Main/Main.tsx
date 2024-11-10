import { Navbar } from "@/components/layout/Navbar";
import { MotionLink } from "@/components/MotionLink";
import { motion } from "framer-motion";

import {
  Box,
  Container,
  Flex,
  Image,
  Text,
  Title,
  useMantineColorScheme,
} from "@mantine/core";

export function Main() {
  const { colorScheme } = useMantineColorScheme();
  const slideVariants = {
    start: { y: 40, opacity: 0 },
    end: { y: 0, opacity: 1 },
  };
  const bounceVariants = {
    start: { y: 40 },
    bounce: { y: [0, 5, 0] },
  };

  return (
    <Box>
      <Navbar />
      <Box>
        <Container mt="40px">
          <Flex direction="column" justify="center" align="center" gap="md">
            <motion.div
              variants={slideVariants}
              initial="start"
              animate="end"
              transition={{ duration: 0.9 }}
            >
              <Title
                size="4rem"
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
                size="xl"
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
                Try it now{" "}
                <i
                  className="fa-regular fa-hand-pointer"
                  style={{ paddingLeft: "5px" }}
                ></i>
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
                h={{ xs: 275, md: 300, lg: 350, xl: 375 }}
                width="100%"
                style={{
                  opacity: 0.75,
                  filter: "blur(20px)",
                }}
              />
              <Image
                style={{ zIndex: 50 }}
                pos="relative"
                h={{ xs: 275, md: 300, lg: 350, xl: 375 }}
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
    </Box>
  );
}
