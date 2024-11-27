import { api } from "@/api";
import Folder from "@/types/Folder";
import { createAsyncThunk, createSlice, PayloadAction } from "@reduxjs/toolkit";

interface FolderState {
  folders: Folder[];
  selectedFolder: Folder | null;
  loading: boolean;
  error: string | null;
}

const initialState: FolderState = {
  folders: [],
  selectedFolder: null,
  loading: false,
  error: null,
};

export const fetchFolders = createAsyncThunk<Folder[]>(
  "folders/fetchFolders",
  async () => {
    const response = await api.get("/folders");
    return response.data.folders;
  }
);

export const createFolder = createAsyncThunk<
  Folder,
  { name: string; color: string }
>("folders/create", async ({ name, color }) => {
  const response = await api.post("/folders", { name, color });
  return response.data;
});

export const editFolder = createAsyncThunk<
  Folder,
  { _id: string; name: string; color: string }
>("folders/editFolder", async ({ _id, name, color }) => {
  const response = await api.put("/folders", { _id, name, color });
  return response.data;
});

export const deleteFolder = createAsyncThunk<Folder, { _id: string }>(
  "folders/deleteFolder",
  async ({ _id }) => {
    const response = await api.delete("/folders", { data: { folderId: _id } });
    return response.data;
  }
);

const folderSlice = createSlice({
  name: "folders",
  initialState,
  reducers: {
    updateSelectedFolder: (
      state,
      action: PayloadAction<{ folder: Folder | null }>
    ) => {
      const { folder } = action.payload;
      state.selectedFolder = folder;
    },
  },
  extraReducers(builder) {
    builder
      .addCase(fetchFolders.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(
        fetchFolders.fulfilled,
        (state, action: PayloadAction<Folder[]>) => {
          state.loading = false;
          state.folders = action.payload.sort((a, b) => {
            return (
              new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
            );
          });
        }
      )
      .addCase(fetchFolders.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || "Failed to fetch folders";
      })
      // Handle createFolder actions
      .addCase(createFolder.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(
        createFolder.fulfilled,
        (state, action: PayloadAction<Folder>) => {
          state.loading = false;
          state.folders = [action.payload, ...state.folders];
        }
      )
      .addCase(createFolder.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || "Failed to create folder";
      })
      // Handle editFolder actions
      .addCase(editFolder.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(editFolder.fulfilled, (state, action: PayloadAction<Folder>) => {
        state.loading = false;
        const index = state.folders.findIndex(
          (folder) => folder._id == action.payload._id
        );
        if (index !== -1) {
          state.folders[index] = action.payload;
        }
        state.folders.sort((a, b) => {
          return (
            new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
          );
        });
      })
      .addCase(editFolder.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || "Failed to edit folder";
      })
      // Handle deleteFolder actions
      .addCase(deleteFolder.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(
        deleteFolder.fulfilled,
        (state, action: PayloadAction<Folder>) => {
          state.loading = false;
          state.folders = state.folders.filter(
            (fol) => fol._id != action.payload._id
          );
        }
      )
      .addCase(deleteFolder.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || "Failed to delete folder";
      });
  },
});

export const { updateSelectedFolder } = folderSlice.actions;
export default folderSlice.reducer;
