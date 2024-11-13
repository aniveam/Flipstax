import { useAppDispatch } from "@/redux/hooks";
import { updatePracticeMode } from "@/redux/practiceSlice";
import { Button, Flex, Modal, Select } from "@mantine/core";
import { useState } from "react";

interface PracticeProps {
  togglePracticeModal: () => void;
  toggleMobile: () => void;
  toggleDesktop: () => void;
  practiceOpened: boolean;
}

export function PracticeModal({
  togglePracticeModal,
  toggleMobile,
  toggleDesktop,
  practiceOpened,
}: PracticeProps) {
  const [reviewMode, setReviewMode] = useState<string | null>("all");
  const reviewModeOptions = [
    { value: "all", label: "All" },
    { value: "favorites", label: "Favorites" },
    { value: "spaced", label: "Spaced Repetition" },
  ];
  const dispatch = useAppDispatch();

  const handleSubmit = () => {
    dispatch(updatePracticeMode({ mode: reviewMode }));
    togglePracticeModal();
    toggleMobile();
    toggleDesktop();
  };
  return (
    <Modal
      opened={practiceOpened}
      onClose={togglePracticeModal}
      title="Practice"
    >
      <Flex direction="column" gap="md" align="center" justify="center">
        <Select
          data={reviewModeOptions}
          label="Choose Review Mode"
          value={reviewMode}
          onChange={(value) => setReviewMode(value)}
          allowDeselect={false}
          w="100%"
        />
        <Button
          onClick={handleSubmit}
          variant="filled"
          radius="xl"
          color="cyan"
        >
          Let's go!
        </Button>
      </Flex>
    </Modal>
  );
}
