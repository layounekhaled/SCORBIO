import { create } from "zustand";

export interface CartItem {
  productId: string;
  slug: string;
  name: string;
  price: number;
  originalPrice?: number;
  quantity: number;
  imageUrl: string;
}

interface CartStore {
  items: CartItem[];
  affiliateCode: string | null;
  promoCode: string | null;
  discount: number;
  addItem: (item: Omit<CartItem, "quantity">) => void;
  removeItem: (productId: string) => void;
  updateQuantity: (productId: string, quantity: number) => void;
  clearCart: () => void;
  setAffiliateCode: (code: string | null) => void;
  setPromoCode: (code: string | null) => void;
  setDiscount: (discount: number) => void;
  getTotal: () => number;
  getOriginalTotal: () => number;
}

export const useCartStore = create<CartStore>((set, get) => ({
  items: [],
  affiliateCode: null,
  promoCode: null,
  discount: 0,

  addItem: (item) =>
    set((state) => {
      const existing = state.items.find((i) => i.productId === item.productId);
      if (existing) {
        return {
          items: state.items.map((i) =>
            i.productId === item.productId
              ? { ...i, quantity: i.quantity + 1 }
              : i
          ),
        };
      }
      return { items: [...state.items, { ...item, quantity: 1 }] };
    }),

  removeItem: (productId) =>
    set((state) => ({
      items: state.items.filter((i) => i.productId !== productId),
    })),

  updateQuantity: (productId, quantity) =>
    set((state) => ({
      items: quantity <= 0
        ? state.items.filter((i) => i.productId !== productId)
        : state.items.map((i) =>
            i.productId === productId ? { ...i, quantity } : i
          ),
    })),

  clearCart: () => set({ items: [], discount: 0, promoCode: null }),

  setAffiliateCode: (code) => set({ affiliateCode: code }),
  setPromoCode: (code) => set({ promoCode: code }),
  setDiscount: (discount) => set({ discount }),

  getTotal: () => {
    const state = get();
    const subtotal = state.items.reduce(
      (sum, item) => sum + item.price * item.quantity,
      0
    );
    return Math.max(0, subtotal - state.discount);
  },

  getOriginalTotal: () => {
    const state = get();
    return state.items.reduce(
      (sum, item) => sum + (item.originalPrice || item.price) * item.quantity,
      0
    );
  },
}));
