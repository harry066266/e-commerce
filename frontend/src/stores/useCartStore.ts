import { create } from "zustand";
import axios from "../lib/axios";
import { toast } from "react-hot-toast";

export const useCartStore = create<CartStore>()((set, get) => ({
  cart: [],
  coupon: null,

  total: 0,
  subtotal: 0,
  addToCart: async (product: Product) => {
    try {
      await axios.post("/cart", { productId: product._id });
      set((prevState) => {
        const existingItem = prevState.cart.find(
          (item: Product) => item._id === product._id
        );
        const newCart = existingItem
          ? prevState.cart.map((item: Product) =>
              item._id === product._id
                ? { ...item, quantity: (item.quantity || 0) + 1 }
                : item
            )
          : [...prevState.cart, { ...product, quantity: 1 }];

        // Return updated state
        return { cart: newCart };
      });
      get().calculateTotal();
      toast.success("Added to cart successfully");
    } catch {
      toast.error("Failed to add to cart");
    }
  },
  calculateTotal: () => {
    const { cart, coupon } = get();
    const subtotal = cart.reduce(
      (total, item) => total + Number(item.price) * (item.quantity || 0),
      0
    );
    let total = subtotal;
    if (coupon) {
      total = subtotal - (subtotal * coupon.discountPercentage) / 100;
    }
    set({ total, subtotal });
  },
  removeFromCart: async (productId: string) => {
    try {
      const res = await axios.delete(`/cart/${productId}`);
      set({ cart: res.data.cart });
      toast.success("Removed from cart successfully");
    } catch {
      toast.error("Failed to remove from cart");
    }
  },
  fetchCart: async () => {
    try {
      const res = await axios.get("/cart");
      set({ cart: res.data });
    } catch {
      toast.error("Failed to fetch cart");
    }
  },
}));
