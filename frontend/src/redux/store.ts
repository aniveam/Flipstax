import deckSlice from "@/redux/deckSlice";
import flashcardSlice from "@/redux/flashcardSlice";
import { configureStore } from "@reduxjs/toolkit";

export const store = configureStore({
  reducer: {
    decks: deckSlice,
    flashcards: flashcardSlice,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
