import { api } from "@/api";
import Deck from "@/types/Deck";
import { createAsyncThunk, createSlice, PayloadAction } from "@reduxjs/toolkit";

interface DeckState {
  decks: Deck[];
  loading: boolean;
  error: string | null;
}

const initialState: DeckState = {
  decks: [],
  loading: false,
  error: null,
};

export const createDeck = createAsyncThunk<Deck, { name: string }>(
  "decks/create",
  async ({ name }) => {
    const response = await api.post("/decks", { name });
    return response.data;
  }
);

const deckSlice = createSlice({
  name: "decks",
  initialState,
  reducers: {
    updateFlashcardCount: (
      state,
      action: PayloadAction<{ deckId: string; incrementBy: number }>
    ) => {
      const { deckId, incrementBy } = action.payload;
      const deck = state.decks.find((d) => d.id === deckId);
      if (deck) {
        deck.flashcardCount += incrementBy;
      }
    },
  },
  extraReducers: (builder) => {
    builder
      // Handle createDeck actions
      .addCase(createDeck.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(createDeck.fulfilled, (state, action: PayloadAction<Deck>) => {
        state.loading = false;
        state.decks = [action.payload, ...state.decks];
      })
      .addCase(createDeck.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || "Failed to delete deck";
      });
  },
});

export default deckSlice.reducer;
