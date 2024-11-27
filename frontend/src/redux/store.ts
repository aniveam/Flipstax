import deckSlice from "@/redux/deckSlice";
import flashcardSlice from "@/redux/flashcardSlice";
import { combineReducers, configureStore } from "@reduxjs/toolkit";
import { persistReducer, persistStore } from "redux-persist";
import storage from "redux-persist/lib/storage";
import folderSlice from "./folderSlice";
import practiceSlice from "./practiceSlice";

const deckPersistConfig = {
  key: "decks",
  storage,
  whitelist: ["selectedDeck"],
};

const folderPersistConfig = {
  key: "folders",
  storage,
  whitelist: ["selectedFolder"],
};

const rootReducer = combineReducers({
  folders: persistReducer(folderPersistConfig, folderSlice),
  decks: persistReducer(deckPersistConfig, deckSlice),
  flashcards: flashcardSlice,
  practice: practiceSlice,
});

export const store = configureStore({
  reducer: rootReducer,
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        ignoredPaths: ["decks.selectedDeck", "folders.selectedFolder"],
        ignoredActions: ["persist/PERSIST", "persist/REHYDRATE"],
      },
    }),
});

export const persistor = persistStore(store);
export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
