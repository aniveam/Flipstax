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

export const fetchDecks = createAsyncThunk<Deck[]>(
  "decks/fetchDecks",
  async () => {
    const response = await api.get("/decks");
    return response.data.decks;
  }
);

export const createDeck = createAsyncThunk<Deck, { name: string }>(
  "decks/create",
  async ({ name }) => {
    const response = await api.post("/decks", { name });
    return response.data;
  }
);

export const editDeck = createAsyncThunk<
  { deck: Deck; flashcardCount: number },
  { _id: string; name: string; pinnedStatus: boolean }
>("decks/editDeck", async ({ _id, name, pinnedStatus }) => {
  const response = await api.put("/decks", {
    deckId: _id,
    name,
    pinned: pinnedStatus,
  });
  return response.data;
});

export const deleteDeck = createAsyncThunk<Deck, { _id: string }>(
  "decks/delete",
  async ({ _id }) => {
    const response = await api.delete("/decks", { data: { deckId: _id } });
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
      const deck = state.decks.find((d) => d._id === deckId);
      if (deck) {
        deck.flashcardCount += incrementBy;
      }
    },
  },
  extraReducers: (builder) => {
    builder
      // Handle fetchDecks actions
      .addCase(fetchDecks.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchDecks.fulfilled, (state, action: PayloadAction<Deck[]>) => {
        state.loading = false;
        state.decks = action.payload.sort((a, b) => {
          // Sort by pinned status first
          if (b.pinned !== a.pinned) {
            return b.pinned ? 1 : -1;
          }
          // If both are pinned, sort by updatedAt (descending)
          if (a.pinned && b.pinned) {
            return (
              new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime()
            );
          }
          // If neither are pinned, sort by createdAt (descending)
          return (
            new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
          );
        });
      })
      .addCase(fetchDecks.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || "Failed to fetch decks";
      })
      // Handle createDeck actions
      .addCase(createDeck.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(createDeck.fulfilled, (state, action: PayloadAction<Deck>) => {
        state.loading = false;
        action.payload.flashcardCount = 0;
        state.decks = [action.payload, ...state.decks];
      })
      .addCase(createDeck.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || "Failed to create deck";
      })
      // Handle editDeck actions
      .addCase(editDeck.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(
        editDeck.fulfilled,
        (
          state,
          action: PayloadAction<{ deck: Deck; flashcardCount: number }>
        ) => {
          state.loading = false;
          const index = state.decks.findIndex(
            (deck) => deck._id === action.payload.deck._id
          );
          if (index !== -1) {
            state.decks[index] = {
              ...action.payload.deck,
              flashcardCount: action.payload.flashcardCount,
            };
          }
          state.decks.sort((a, b) => {
            if (b.pinned !== a.pinned) {
              return b.pinned ? 1 : -1;
            }

            if (a.pinned && b.pinned) {
              return (
                new Date(b.updatedAt).getTime() -
                new Date(a.updatedAt).getTime()
              );
            }

            return (
              new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
            );
          });
        }
      )
      .addCase(editDeck.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || "Failed to edit deck";
      })
      // Handle deleteDeck actions
      .addCase(deleteDeck.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(deleteDeck.fulfilled, (state, action: PayloadAction<Deck>) => {
        state.loading = false;
        state.decks = state.decks.filter(
          (deck) => deck._id != action.payload._id
        );
      })
      .addCase(deleteDeck.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || "Failed to delete deck";
      });
  },
});

export const { updateFlashcardCount } = deckSlice.actions;
export default deckSlice.reducer;
