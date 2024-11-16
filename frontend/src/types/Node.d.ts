import Flashcard from "@/types/Flashcard";

export interface Node {
  flashcard: Flashcard | null;
  next: Node | null;
  prev: Node | null;
}