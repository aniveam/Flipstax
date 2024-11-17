import Flashcard from "@/types/Flashcard";

class TrieNode {
  children: Map<string, TrieNode>;
  isEndOfWord: boolean;
  flashcards: Flashcard[];

  constructor() {
    this.children = new Map();
    this.isEndOfWord = false;
    this.flashcards = [];
  }
}

class TrieFlashcard {
  root: TrieNode;

  constructor() {
    this.root = new TrieNode();
  }

  insert(text: string, flashcard: Flashcard): void {
    let curr = this.root;
    for (const char of text) {
      if (!curr.children.has(char)) {
        curr.children.set(char, new TrieNode());
      }
      curr = curr.children.get(char)!;
    }
    curr.isEndOfWord = true;
    curr.flashcards.push(flashcard); //adding the flashcard at the letter of the very last word
  }

  startsWith(prefix: string) {
    let curr = this.root;
    for (const char of prefix) {
      if (!curr.children.has(char)) {
        return [];
      }
      curr = curr.children.get(char)!;
    }
    return this.getMatchingFlashcards(curr);
  }

  getMatchingFlashcards(node: TrieNode): Flashcard[] {
    let results: Flashcard[] = [];
    if (node.isEndOfWord) {
      results = results.concat(node.flashcards);
    }
    for (const child of node.children.values()) {
      results = results.concat(this.getMatchingFlashcards(child));
    }
    return results;
  }
}

export default TrieFlashcard;
