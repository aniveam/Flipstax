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
  },
});

export const { updatePracticeMode } = practiceSlice.actions;
export default practiceSlice.reducer;
