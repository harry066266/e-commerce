/// <reference types="vite/client" />
interface UsersignupType {
  name: string;
  email: string;
  password: string;
  confirmPassword: string;
}
interface UserloginType {
  email: string;
  password: string;
}
interface UserStore {
  user: null | { id: string; name: string; email: string; role: string }; // 用户对象
  loading: boolean; // 加载状态
  checkingAuth: boolean; // 是否检查用户认证状态
  checkAuth: () => Promise<void>; // 检查用户认证状态
  signup: (data: UsersignupType) => Promise<string | undefined>; // 注册方法
  login: (data: UserloginType) => Promise<string | undefined>; // 登录方法
  logout: () => Promise<void>; // 注销方法
}
