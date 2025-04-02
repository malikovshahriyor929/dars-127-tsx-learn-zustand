import { create } from "zustand";
import { persist } from "zustand/middleware";

export type newValueType = {
  id?: string;
  title: string;
  checked: boolean;
};

interface todoStoreType {
  data: newValueType[];
  getData: (newValue: newValueType) => void;
  deleteData: (id: string) => void;
  EditData: (newValue: newValueType) => void;
  IsChecked: (newValue: newValueType) => void;
}

export const todoStore = create(
  persist<todoStoreType>(
    (set, get) => ({
      data: [],
      getData: (newValue) => {
        set({ data: [...get().data, newValue] });
      },
      deleteData: (id) => {
        const newValue = get().data.filter((value) => value.id !== id);
        set({ data: newValue });
      },
      EditData: (newValue) => {
        const newEdit = get().data.map((value) =>
          value.id == newValue.id ? { ...value, title: newValue.title } : value
        );
        set({ data: newEdit });
      },
      IsChecked: (newValue) => {
        const checked = get().data.map((value) =>
          value.id == newValue.id
            ? { ...value, checked: newValue.checked }
            : value
        );
        set({ data: checked });
      },
    }),
    {
      name: "todo-storage", 
    }
  )
);
