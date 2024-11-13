import { useAppSelector } from "@/redux/hooks";

export function Practice() {
  const { flashcards } = useAppSelector((state) => state.practice);
  console.log("practicing: ", flashcards);
  return <></>;
}
