import { create } from "zustand";
import axios from "../lib/axios";
import { toast } from "react-hot-toast";
import { persist } from "zustand/middleware";
import { AxiosError, AxiosRequestConfig, AxiosResponse } from "axios";
const useUserStore = create<UserStore>()(
  persist(
    (set, get) => ({
      user: null,
      loading: false,
      checkingAuth: false,
      checkAuth: async () => {
        set({ checkingAuth: true });
        try {
          const response = await axios.get("/auth/profile");
          set({ user: response.data, checkingAuth: false });
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
          set({ user: res.data.user, loading: false });
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
          set({ user: res.data.user, loading: false });
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
      refreshToken: async () => {
        // Prevent multiple simultaneous refresh attempts
        if (get().checkingAuth) return;

        set({ checkingAuth: true });
        try {
          const response = await axios.post("/auth/refresh");
          set({ checkingAuth: false });
          return response.data;
        } catch (error) {
          set({ user: null, checkingAuth: false });
          throw error;
        }
      },
    }),
    { name: "user-store" }
  )
);

export default useUserStore;
let refreshPromise: Promise<void> | null = null;

axios.interceptors.response.use(
  (response: AxiosResponse) => response,
  async (error: AxiosError) => {
    const originalRequest = error.config as AxiosRequestConfig & {
      _retry?: boolean;
    };

    // 检查是否为 401 错误，并确保请求未被重新尝试
    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;

      try {
        // 如果刷新正在进行，等待其完成
        if (refreshPromise) {
          await refreshPromise;
          return axios(originalRequest);
        }

        // 开始新的刷新流程
        const { refreshToken } = useUserStore.getState();
        refreshPromise = refreshToken(); // 假设 refreshToken 返回的是一个 Promise<void>
        await refreshPromise;
        refreshPromise = null;

        // 刷新成功后，重新发送原始请求
        return axios(originalRequest);
      } catch (refreshError) {
        // 刷新失败时，执行登出操作
        const { logout } = useUserStore.getState();
        logout(); // 退出登录或跳转到登录页
        return Promise.reject(refreshError);
      }
    }

    // 如果不是 401 错误或其他情况，直接返回错误
    return Promise.reject(error);
  }
);
