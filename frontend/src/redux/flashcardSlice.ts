import { api } from "@/api";
import Flashcard from "@/types/Flashcard";
import { createAsyncThunk, createSlice, PayloadAction } from "@reduxjs/toolkit";

interface FlashcardState {
  flashcards: Flashcard[];
  updatedFlashcard: Flashcard | null;
  deckName: string | null;
  loading: boolean;
  error: string | null;
}

const initialState: FlashcardState = {
  flashcards: [],
  updatedFlashcard: null,
  deckName: null,
  loading: false,
  error: null,
};

export const fetchFlashcards = createAsyncThunk<
  { flashcards: Flashcard[]; deckName: string },
  { deckId: string }
>("flashcards/fetchFlashcards", async ({ deckId }) => {
  const response = await api.get("/flashcards", {
    params: {
      deckId,
    },
  });
  return response.data;
});

export const createFlashcard = createAsyncThunk<
  Flashcard,
  { deckId: string; frontText: string; backText: string }
>("flashcards/createFlashcard", async ({ deckId, frontText, backText }) => {
  const response = await api.post("/flashcards", {
    deckId,
    frontText,
    backText,
  });
  return response.data;
});

export const editFlashcard = createAsyncThunk<Flashcard, Flashcard>(
  "flashcards/editFlashcard",
  async ({
    _id,
    favorited,
    frontText,
    backText,
    lastReviewed,
    repetitions,
    easeFactor,
    interval,
  }) => {
    const response = await api.put("/flashcards", {
      flashcardId: _id,
      favorited,
      frontText,
      backText,
      lastReviewed,
      repetitions,
      easeFactor,
      interval,
    });
    return response.data;
  }
);

export const deleteFlashcard = createAsyncThunk<Flashcard, { _id: string }>(
  "flashcards/deleteFlashcard",
  async ({ _id }) => {
    const response = await api.delete("/flashcards", {
      data: { flashcardId: _id },
    });
    return response.data;
  }
);

const flashcardSlice = createSlice({
  name: "flashcards",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      // Handle fetchFlashcards actions
      .addCase(fetchFlashcards.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(
        fetchFlashcards.fulfilled,
        (
          state,
          action: PayloadAction<{ flashcards: Flashcard[]; deckName: string }>
        ) => {
          state.loading = false;
          state.flashcards = action.payload.flashcards.sort((a, b) => {
            return (
              new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
            );
          });
          state.deckName = action.payload.deckName;
        }
      )
      .addCase(fetchFlashcards.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || "Failed to fetch flashcards";
      })
      // Handle createFlashcard action
      .addCase(createFlashcard.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(
        createFlashcard.fulfilled,
        (state, action: PayloadAction<Flashcard>) => {
          state.loading = false;
          // Pushing newly created flashcard at the top
          state.flashcards = [action.payload, ...state.flashcards];
        }
      )
      .addCase(createFlashcard.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || "Failed to create flashcard";
      })
      // Handle editFlashcard action
      .addCase(editFlashcard.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(
        editFlashcard.fulfilled,
        (state, action: PayloadAction<Flashcard>) => {
          state.loading = false;
          const index = state.flashcards.findIndex(
            (flashcard) => flashcard._id == action.payload._id
          );
          if (index !== -1) {
            state.flashcards[index] = action.payload;
            state.updatedFlashcard = state.flashcards[index];
          }
          state.flashcards.sort((a, b) => {
            return (
              new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
            );
          });
        }
      )
      .addCase(editFlashcard.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || "Failed to edit flashcard";
      })
      // Handle deleteFlashcard action
      .addCase(deleteFlashcard.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(
        deleteFlashcard.fulfilled,
        (state, action: PayloadAction<Flashcard>) => {
          state.loading = false;
          state.flashcards = state.flashcards.filter(
            (flashcard) => flashcard._id !== action.payload._id
          );
        }
      )
      .addCase(deleteFlashcard.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || "Failed to delete flashcard";
      });
  },
});

export default flashcardSlice.reducer;
