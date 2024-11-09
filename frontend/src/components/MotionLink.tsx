import { Button } from "@mantine/core";
import { motion } from "framer-motion";
import React from "react";

type Props = { children?: React.ReactNode; href?: string };
const button = React.forwardRef<HTMLAnchorElement, Props>((props, ref) => {
  return (
    <Button component="a" radius="xl" variant="filled" ref={ref} {...props}>
      {props.children}
    </Button>
  );
});
export const MotionLink = motion(button);
