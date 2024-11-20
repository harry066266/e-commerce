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
  _id?: string;
  name: string;
  description: string;
  price: string;
  category: string;
  image: string;
  isFeatured?: boolean;
  quantity?: number;
}

interface ProductStore {
  products: Product[]; // 存储产品的数组
  loading: boolean; // 加载状态
  setProducts: (products: Product[]) => void; // 设置产品列表的方法
  createProduct: (product: Product) => Promise<void>; // 创建产品的方法
  fetchAllProducts: () => Promise<void>;
  deleteProduct: (id: string) => Promise<void>;
  toggleFeaturedProduct: (id: string) => Promise<void>;
  fetchProductsByCategory: (category: string) => Promise<void>;
}

interface CartStore {
  cart: Product[]; // Cart contains products with a quantity
  coupon: Coupon | null; // Coupon code, if any
  total: number; // Total price of cart
  subtotal: number; // Subtotal before discounts
  addToCart: (product: Product) => Promise<void>; // Add product to cart
  removeFromCart: (productId: string) => Promise<void>; // Remove product from cart
  fetchCart: () => Promise<void>; // Fetch the current cart from the server
  calculateTotal: () => void;
}

interface Coupon {
  code: string; // 优惠码
  discountPercentage: number; // 折扣百分比
  expirationDate: Date; // 过期日期
  isActive?: boolean; // 是否激活，默认值为 true
  userId: Types.ObjectId; // 关联的用户 ID
  createdAt?: Date; // 时间戳（由 Mongoose 自动生成）
  updatedAt?: Date; // 时间戳（由 Mongoose 自动生成）
}
