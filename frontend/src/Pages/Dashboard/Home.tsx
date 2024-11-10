import { Box, Text } from "@mantine/core";
import { useEffect } from "react";

export function Home() {
  useEffect(() => {
    document.title = "Dashboard" + " • Flipstax";
  }, []);

  return (
    <Box>
      <Text size="h1">Home</Text>
    </Box>
  );
}
