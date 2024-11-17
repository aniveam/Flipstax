import Flashcard from "@/types/Flashcard";

class Node {
  flashcard: Flashcard | null;
  next: Node | null = null;
  prev: Node | null = null;

  constructor(flashcard: Flashcard | null = null) {
    this.flashcard = flashcard;
  }
}

class DoublyLinkedList {
  head: Node;
  tail: Node;
  size: number = 0;
  nodeMap: Map<string, Node> = new Map();

  constructor() {
    this.head = new Node();
    this.tail = new Node();
    this.head.next = this.tail;
    this.tail.prev = this.head;
  }
  // Insert to the end of the list
  insert(flashcard: Flashcard): void {
    const newNode = new Node(flashcard);
    newNode.next = this.tail;
    newNode.prev = this.tail.prev;
    this.tail.prev!.next = newNode;
    this.tail.prev = newNode;

    this.nodeMap.set(flashcard._id, newNode);
    this.size += 1;
  }
  editNode(flashcardId: string, updates: Partial<Flashcard>): Flashcard | null {
    if (this.nodeMap.has(flashcardId)) {
      const updateNode = this.nodeMap.get(flashcardId)!;

      updateNode.flashcard = {
        ...updateNode.flashcard, // Spread existing properties
        ...updates, // Spread new updates over existing properties
      } as Flashcard; // Tell TypeScript to trust us that all required fields are present

      return updateNode.flashcard;
    }
    return null;
  }
  deleteNode(flashcardId: string) {
    const nodeToDelete = this.nodeMap.get(flashcardId);
    if (nodeToDelete) {
      if (nodeToDelete.next && nodeToDelete.prev) {
        nodeToDelete.next.prev = nodeToDelete.prev;
        nodeToDelete.prev.next = nodeToDelete.next;
      }
      this.nodeMap.delete(flashcardId);
      this.size -= 1;
      return nodeToDelete.flashcard;
    }
    return null;
  }
  // Remove from front of list
  removeFront(): Flashcard | null {
    if (this.size === 0) {
      return null;
    }
    const frontNode = this.head.next;
    if (frontNode) {
      this.head.next = frontNode.next;
      frontNode.next!.prev = this.head;
      this.size -= 1;
      return frontNode.flashcard;
    }
    return null;
  }
  // Remove from back of list
  removeBack(): Flashcard | null {
    if (this.size === 0) {
      return null;
    }
    const backNode = this.tail.prev;
    if (backNode) {
      this.tail.prev = backNode.prev;
      backNode.prev!.next = this.tail;
      this.size -= 1;
      return backNode.flashcard;
    }
    return null;
  }
  // Move the last card to the front
  moveBackToFront(): void {
    if (this.size > 0) {
      const removedNode = this.removeBack();
      if (removedNode) {
        const newNode = new Node(removedNode);
        newNode.next = this.head.next;
        newNode.prev = this.head;
        this.head.next!.prev = newNode;
        this.head.next = newNode;

        this.size += 1;
      }
    }
  }
  // Move the first card to the back
  moveFrontToBack(): void {
    if (this.size > 0) {
      const removedNode = this.removeFront();
      if (removedNode) {
        this.insert(removedNode);
      }
    }
  }
  // Get the first flashcard in the list
  getFront(): Node | null {
    return this.size > 0 ? this.head.next : null;
  }
  // Get the next flashcard in the list
  getNext(): Node | null {
    const nextNode = this.head.next?.next;
    if (this.size > 1 && nextNode && nextNode !== this.tail) {
      return nextNode;
    }
    return null;
  }
  shuffleFC(): void {
    if (this.size > 1) {
      const nodes: Node[] = [];
      let curr = this.head.next;
      while (curr !== this.tail) {
        nodes.push(curr!);
        curr = curr!.next;
      }
      // Fisher-Yates shuffle algorithm
      for (let i = nodes.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [nodes[i], nodes[j]] = [nodes[j], nodes[i]];
      }
      // Rebuild LL
      this.head.next = nodes[0];
      nodes[0].prev = this.head;
      this.tail.prev = nodes[nodes.length - 1];
      nodes[nodes.length - 1].next = this.tail;

      for (let i = 0; i < nodes.length - 1; i++) {
        nodes[i].next = nodes[i + 1];
        nodes[i + 1].prev = nodes[i];
      }
    }
    return;
  }
  clone(): DoublyLinkedList {
    const clonedList = new DoublyLinkedList();
    let current = this.head.next;

    while (current && current !== this.tail) {
      const flashcardCopy = { ...current.flashcard } as Flashcard;
      clonedList.insert(flashcardCopy);

      // Update the nodeMap in the cloned list
      clonedList.nodeMap.set(flashcardCopy._id, clonedList.tail.prev!);
      current = current.next;
    }

    return clonedList;
  }
  getCurIdx(node: Node | null): number {
    if (!node) {
      return 1; //Reset the index to 1
    }

    let current = this.head.next;
    let index = 1;

    while (current && current !== this.tail) {
      if (current === node) {
        return index;
      }
      current = current.next;
      index++;
    }

    return 1;
  }
}

export default DoublyLinkedList;
