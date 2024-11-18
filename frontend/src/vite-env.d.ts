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

interface Category {
  href: string; // 链接地址
  name: string; // 分类名称
  imageUrl: string; // 图片地址
}

interface Product {
  name: string; // 产品名称
  description: string; // 产品描述
  price: number; // 产品价格
  category: string; // 产品类别
  image: string; // 产品图片 URL
}

interface Product {
  name: string;
  description: string;
  price: string;
  category: string;
  image: string | null;
}
interface ProductStore {
  products: Product[]; // 存储产品的数组
  loading: boolean; // 加载状态
  setProducts: (products: Product[]) => void; // 设置产品列表的方法
  createProduct: (product: Product) => Promise<void>; // 创建产品的方法
}
