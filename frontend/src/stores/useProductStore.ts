import { create } from "zustand";
import toast from "react-hot-toast";
import axios from "../lib/axios";
const useProductStore = create<ProductStore>()((set) => ({
  products: [],
  loading: false,
  setProducts: async (products: Product[]) => set({ products }),
  createProduct: async (productData: Product) => {
    set({ loading: true });
    try {
      const res = await axios.post("/products", productData);
      console.log(res.data);
      set((prevState) => ({
        products: [...prevState.products, res.data],
        loading: false,
      }));
      toast.success("Product created successfully");
    } catch {
      toast.error("Failed to create product");
      set({ loading: false });
    }
  },
  fetchAllProducts: async () => {
    set({ loading: true });
    try {
      const res = await axios.get("/products");

      set(() => ({
        products: res.data,
        loading: false,
      }));
    } catch {
      toast.error("Failed to fetch products");
      set({ loading: false });
    }
  },
  deleteProduct: async (id: string) => {
    set({ loading: true });
    try {
      await axios.delete(`/products/${id}`);
      set((prevProducts) => ({
        products: prevProducts.products.filter((product) => product._id !== id),
        loading: false,
      }));
      toast.success("Product deleted successfully");
    } catch {
      toast.error("Failed to delete product");
      set({ loading: false });
    }
  },
  toggleFeaturedProduct: async (productId: string) => {
    set({ loading: true });
    try {
      const response = await axios.patch(`/products/${productId}`);
      // this will update the isFeatured prop of the product
      set((prevProducts) => ({
        products: prevProducts.products.map((product) =>
          product._id === productId
            ? { ...product, isFeatured: response.data.isFeatured }
            : product
        ),
        loading: false,
      }));
    } catch {
      set({ loading: false });
      toast.error("Failed to update product");
    }
  },

  fetchProductsByCategory: async (category: string) => {
    set({ loading: true });
    try {
      const res = await axios.get(`/products/category/${category}`);
      set(() => ({
        products: res.data,
        loading: false,
      }));
    } catch {
      toast.error("Failed to fetch products");
      set({ loading: false });
    }
  },
  fetchFeaturedProducts: async () => {
    set({ loading: true });
    try {
      const response = await axios.get("/products/featured");
      set({ products: response.data, loading: false });
    } catch {
      toast.error("Failed to fetch products");
      set({ loading: false });
    }
  },
}));
export default useProductStore;
