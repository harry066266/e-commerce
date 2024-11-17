import { create } from "zustand";
import axios from "../lib/axios";
import { toast } from "react-hot-toast";
import { AxiosError } from "axios";

const useUserStore = create<UserStore>()((set) => ({
  user: null,
  loading: false,
  checkingAuth: false,
  checkAuth: async () => {
    set({ checkingAuth: true });
    try {
      const res = await axios.get("/auth/profile");
      set({ user: res.data, checkingAuth: false });
    } catch {
      set({ checkingAuth: false, user: null });
    }
  },
  signup: async ({
    name,
    email,
    password,
    confirmPassword,
  }: UsersignupType) => {
    set({ loading: true });
    if (password !== confirmPassword) {
      set({ loading: false });
      return toast.error("Password does not match");
    }
    try {
      const res = await axios.post("/auth/signup", {
        name,
        email,
        password,
      });
      set({ user: res.data, loading: false });
    } catch (error) {
      // 使用 AxiosError 类型来推断 error 的类型
      if (error instanceof AxiosError) {
        set({ loading: false });
        // 假设 error.response.data.message 是字符串
        return toast.error(
          error.response?.data?.message || "An error occurred"
        );
      } else {
        // 处理非 Axios 错误
        set({ loading: false });
        return toast.error("An unexpected error occurred");
      }
    }
  },
  login: async ({ email, password }: UserloginType) => {
    set({ loading: true });
    try {
      const res = await axios.post("/auth/login", {
        email,
        password,
      });
      set({ user: res.data, loading: false });
    } catch (error) {
      // 使用 AxiosError 类型来推断 error 的类型
      if (error instanceof AxiosError) {
        set({ loading: false });
        // 假设 error.response.data.message 是字符串
        return toast.error(
          error.response?.data?.message || "An error occurred"
        );
      } else {
        // 处理非 Axios 错误
        set({ loading: false });
        return toast.error("An unexpected error occurred");
      }
    }
  },
  logout: async () => {
    try {
      await axios.get("/auth/logout");
      set({ user: null });
    } catch {
      toast.error("An unexpected error occurred");
    }
  },
}));

export default useUserStore;
