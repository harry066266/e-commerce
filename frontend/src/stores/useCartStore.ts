import { create } from "zustand";
import axios from "../lib/axios";
import { toast } from "react-hot-toast";
import { AxiosError } from "axios";
export const useCartStore = create<CartStore>()((set, get) => ({
  cart: [],
  coupon: null,
  total: 0,
  subtotal: 0,
  isCouponApplied: false,
  getMyCoupon: async () => {
    try {
      const response = await axios.get("/coupons");
      set({ coupon: response.data });
    } catch (err: unknown) {
      const error = err as AxiosError; // 明确将 error 断言为 AxiosError
      const errorMessage =
        error.response?.data?.message || "Failed to apply coupon";
      toast.error(errorMessage);
    }
  },
  applyCoupon: async (code: string) => {
    try {
      const response = await axios.post("/coupons/validate", { code });
      set({ coupon: response.data, isCouponApplied: true });
      get().calculateTotal();
      toast.success("Coupon applied successfully");
    } catch (err: unknown) {
      const error = err as AxiosError; // 明确将 error 断言为 AxiosError
      const errorMessage =
        error.response?.data?.message || "Failed to apply coupon";
      toast.error(errorMessage);
    }
  },
  removeCoupon: () => {
    set({ coupon: null, isCouponApplied: false });
    get().calculateTotal();
    toast.success("Coupon removed");
  },
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
    await axios.delete(`/cart`, { data: { productId } });
    set((prevState) => ({
      cart: prevState.cart.filter((item) => item._id !== productId),
    }));
    get().calculateTotal();
  },
  fetchCart: async () => {
    try {
      const res = await axios.get("/cart");
      set({ cart: res.data });
      get().calculateTotal();
    } catch {
      toast.error("Failed to fetch cart");
    }
  },
  updateQuantity: async (productId: string, quantity: number) => {
    if (quantity === 0) {
      get().removeFromCart(productId);
      return;
    }
    await axios.put(`/cart/${productId}`, { quantity });
    set((prevState) => ({
      cart: prevState.cart.map((item) =>
        item._id === productId ? { ...item, quantity } : item
      ),
    }));
    get().calculateTotal();
  },
  clearCart: async () => {
    await axios.delete("/cart");
    set({ cart: [], coupon: null, total: 0, subtotal: 0 });
  },
}));
