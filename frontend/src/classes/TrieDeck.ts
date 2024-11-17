import Deck from "@/types/Deck";

class TrieNode {
  children: Map<string, TrieNode>;
  isEndOfWord: Boolean;
  decks: Deck[];

  constructor() {
    this.children = new Map();
    this.isEndOfWord = false;
    this.decks = [];
  }
}

class TrieDeck {
  root: TrieNode;

  constructor() {
    this.root = new TrieNode();
  }

  insertNode(text: string, deck: Deck): void {
    let curr = this.root;
    for (const char of text) {
      if (!curr.children.has(char)) {
        curr.children.set(char, new TrieNode());
      }
      curr = curr.children.get(char)!;
    }
    curr.decks.push(deck);
    curr.isEndOfWord = true;
  }
  startsWith(prefix: string) {
    let curr = this.root;
    for (const char of prefix) {
      if (!curr.children.get(char)) {
        return [];
      }
      curr = curr.children.get(char)!;
    }
    return this.getMatchingDecks(curr);
  }
  getMatchingDecks(node: TrieNode): Deck[] {
    let results: Deck[] = [];
    if (node.isEndOfWord) {
      results = results.concat(node.decks);
    }
    for (const child of node.children.values()) {
      results = results.concat(this.getMatchingDecks(child));
    }
    return results;
  }
}

export default TrieDeck;
