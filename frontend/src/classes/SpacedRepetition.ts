import Flashcard from "@/types/Flashcard";

class SpacedRepetition {
  practiceList: Flashcard[];

  constructor(practiceList: Flashcard[]) {
    this.practiceList = practiceList;
  }

  getDueFlashcards(): Flashcard[] {
    //Retrieve only cards whose lastReviewed + interval <= today
    const today = new Date();
    const cardsToReviewToday = this.practiceList.filter((card) => {
      const nextReviewDate = new Date(card.lastReviewed);
      nextReviewDate.setDate(nextReviewDate.getDate() + card.interval);
      return nextReviewDate <= today;
    });
    return cardsToReviewToday;
  }

  updateCard(flashcard: Flashcard, quality: number): Flashcard {
    const { repetitions, interval, easeFactor } = flashcard;
    let newInterval: number;
    let newEaseFactor: number = easeFactor; // Initialize to current value
    let newRepetitions: number;

    if (quality >= 3) {
      // Calculate the new interval
      if (repetitions == 0) {
        newInterval = 1;
      } else if (repetitions == 1) {
        newInterval = 6;
      } else {
        newInterval = Math.ceil(interval * easeFactor);
      }
      // Calculate the new ease factor
      newEaseFactor = Math.max(
        easeFactor + (0.1 - (5 - quality) * (0.08 + (5 - quality) * 0.02)),
        1.3 // Ensures minimum ease factor
      );
      newRepetitions = repetitions + 1;
    } else {
      newInterval = 1;
      newRepetitions = 0;
    }

    const updatedCard = {
      ...flashcard,
      interval: newInterval,
      easeFactor: newEaseFactor,
      repetitions: newRepetitions,
      lastReviewed: new Date(),
    } as Flashcard;

    return updatedCard;
  }
}

export default SpacedRepetition;

//SM2 Algo https://github.com/thyagoluciano/sm2

/* QUALITY */
// 5 - perfect response
// 4 - correct response after a hesitation
// 3 - correct response recalled with serious difficulty
// 2 - incorrect response; where the correct one seemed easy to recall
// 1 - incorrect response; the correct one remembered
// 0 - complete blackout.

/* STEPS */
// If quality is greater than or equal to 3, indicating a correct response:
// If repetitions is 0 (first review), set interval to 1 day.
// If repetitions is 1 (second review), set interval to 6 days.
// If repetitions is greater than 1 (subsequent reviews), set interval to previous interval * previous ease factor. (See note about recursion below.)
// Round interval up to the next whole number.
// Increment repetitions by 1.
// Set ease factor to previous ease factor + (0.1 - (5 - quality) * (0.08 + (5 - quality ) * 0.02)). (See formula description below.)

// If quality is less than 3, indicating an incorrect response:
// Set repetitions to 0.
// Set interval to 1.
// Set ease factor to previous ease factor (no change).
// If ease factor is less than 1.3:

// Set ease factor to 1.3.
// Return interval, repetitions and ease factor.
