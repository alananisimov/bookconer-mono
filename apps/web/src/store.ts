import { type Book } from "@acme/db";
import { create } from "zustand";
import { persist } from "zustand/middleware";

interface SelectedBookState {
  bookName: string | undefined;
  setBookName: (value: string) => void;
}

export interface CartItem extends Book {
  quantity: number;
}

interface CartState {
  items: CartItem[];
  add: (value: Book, quantity?: number) => void;
  delete: (id: string) => void;
  clear: () => void;
}

export const useSelectedBookStore = create<SelectedBookState>((set) => ({
  bookName: undefined,
  setBookName: (value) => set({ bookName: value }),
}));

export const useCartStore = create<CartState>()(
  persist(
    (set) => ({
      items: [],
      add: (value: Book, quantity = 1) =>
        set((latest) => {
          const existingItem = latest.items.find(
            (item) => item.id === value.id,
          );

          if (existingItem) {
            const updatedItems = latest.items.map((item) =>
              item.id === value.id
                ? { ...item, quantity: item.quantity + quantity }
                : item,
            );

            return { items: updatedItems };
          } else {
            return { items: [...latest.items, { ...value, quantity }] };
          }
        }),
      delete: (id: string) =>
        set((latest) => {
          const updatedItems = latest.items.map((item) =>
            item.id === id && item.quantity > 0
              ? { ...item, quantity: item.quantity - 1 }
              : item,
          );

          return { items: updatedItems.filter((item) => item.quantity > 0) };
        }),
      clear: () => set({ items: [] }),
    }),
    { name: "cartStore" },
  ),
);

interface SignInModalState {
  showSignInModal: boolean;
  setShowSignInModal: (show: boolean) => void;
}

interface CartOpenState {
  showCart: boolean;
  setShowCart: (show: boolean) => void;
}

interface CheckoutOpenState {
  showCheckout: boolean;
  setShowCheckout: (show: boolean) => void;
}

export const useCartStateStore = create<CartOpenState>((set) => ({
  showCart: false,
  setShowCart: (show) => set({ showCart: show }),
}));
export const useCheckoutStateStore = create<CheckoutOpenState>((set) => ({
  showCheckout: false,
  setShowCheckout: (show) => set({ showCheckout: show }),
}));
export const useSignInModalStore = create<SignInModalState>((set) => ({
  showSignInModal: false,
  setShowSignInModal: (show) => set({ showSignInModal: show }),
}));
interface EditBookState {
  showEditModal: boolean;
  setShowEditModal: (show: boolean) => void;
  selectedBook: Book | null;
  setSelectedBook: (book: Book | null) => void;
}

export const useEditBookStore = create<EditBookState>((set) => ({
  showEditModal: false,
  setShowEditModal: (show) => set({ showEditModal: show }),
  selectedBook: null,
  setSelectedBook: (book) => set({ selectedBook: book }),
}));
interface CreateBookModalState {
  showCreateModal: boolean;
  setShowCreateModal: (show: boolean) => void;
}

export const useCreateBookModalStore = create<CreateBookModalState>((set) => ({
  showCreateModal: false,
  setShowCreateModal: (show: boolean) => set({ showCreateModal: show }),
}));
