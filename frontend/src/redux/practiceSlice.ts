import Flashcard from "@/types/Flashcard";
import { createSlice } from "@reduxjs/toolkit";

interface PracticeProps {
  mode: string;
  flashcards: Flashcard[]
}

const initialState: PracticeProps = {
  mode: 'all',
  flashcards: []
}

const practiceSlice = createSlice({
  name: "practice",
  initialState,
  reducers: {}
})