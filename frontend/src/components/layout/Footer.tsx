import { Flex, Text } from "@mantine/core";

export function Footer() {
  return (
    <Flex
      align="center"
      justify="center"
      dir="row"
      mih={75}
      gap="xs"
      style={{ borderTop: "1px solid rgba(224, 224, 224, 0.5)" }}
    >
      <Text c="dimmed">Copyright</Text>
      <i
        style={{ margin: "0 1px", color: "gray" }}
        className="fa-regular fa-copyright"
      ></i>
      <Text c="dimmed">2024 Flipstax</Text>
    </Flex>
  );
}
