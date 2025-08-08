import { create } from "zustand";

interface UploadedFilesState {
  files: File[];
  setFiles: (files: File[]) => void;
}

export const storeUploadedFilesStore = create<UploadedFilesState>()((set) => ({
  files: [],
  setFiles: (files) => set({ files }),
}));
