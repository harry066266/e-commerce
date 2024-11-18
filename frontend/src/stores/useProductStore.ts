import { create } from "zustand";
import toast from "react-hot-toast";
import axios from "axios";
const useProductStore = create<ProductStore>()((set) => ({
  products: [],
  loading: false,
  setProducts: async (products: Product[]) => set({ products }),
  createProduct: async (product: Product) => {
    set({ loading: true });
    try {
      const res = await axios.post("/products", product);
      set((preState) => ({
        products: [...preState.products, res.data],
        loading: false,
      }));
    } catch {
      toast.error("An unexpected error occurred");
      set({ loading: false });
    }
  },
}));
export default useProductStore;
