import { Button } from "@mantine/core";
import { motion } from "framer-motion";
import React from "react";

interface Props {
  children?: React.ReactNode;
  color?: string;
  onClick?: () => void;
}

const button = React.forwardRef<HTMLButtonElement, Props>((props, ref) => {
  return (
    <Button variant="filled" radius="xl" ref={ref} {...props}>
      {props.children}
    </Button>
  );
});

export const MotionButton = motion.create(button);
