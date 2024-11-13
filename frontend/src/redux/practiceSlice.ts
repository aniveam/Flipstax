import Flashcard from "@/types/Flashcard";
import { createSlice, PayloadAction } from "@reduxjs/toolkit";

interface PracticeProps {
  mode: string | null;
  flashcards: Flashcard[];
}

const initialState: PracticeProps = {
  mode: null,
  flashcards: [],
};

const practiceSlice = createSlice({
  name: "practice",
  initialState,
  reducers: {
    updatePracticeMode: (
      state,
      action: PayloadAction<{ mode: string | null }>
    ) => {
      const { mode } = action.payload;
      state.mode = mode;
    },
    setPracticeFlashcards: (state, action: PayloadAction<Flashcard[]>) => {
      const mode = state.mode;
      switch (mode) {
        case "all":
          state.flashcards = action.payload;
          break;
        case "favorites":
          state.flashcards = action.payload.filter(
            (flashcard) => flashcard.favorited
          );
      }
    },
  },
});

export const { updatePracticeMode, setPracticeFlashcards } =
  practiceSlice.actions;
export default practiceSlice.reducer;
