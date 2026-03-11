export enum AppStep {
  AUTH = 'AUTH',
  HOME = 'HOME',
  PRODUCT_DETAIL = 'PRODUCT_DETAIL',
  UPLOAD_PRODUCT = 'UPLOAD_PRODUCT',
  USER_PROFILE = 'USER_PROFILE',
  CIRCLE_MANAGE = 'CIRCLE_MANAGE',
  CHAT = 'CHAT',
  ORDER_MANAGE = 'ORDER_MANAGE',
  VERIFICATION_CENTER = 'VERIFICATION_CENTER',
  MY_COLLECTIONS = 'MY_COLLECTIONS',
  SETTINGS = 'SETTINGS'
}

export enum UserRole {
  NORMAL = 'NORMAL',
  CIRCLE_ADMIN = 'CIRCLE_ADMIN',
  PLATFORM_ADMIN = 'PLATFORM_ADMIN'
}

export enum ProductCategory {
  FURNITURE_APPLIANCES = '家具家电',
  MATERNITY_BABY = '母婴用品',
  DIGITAL = '数码产品',
  BOOKS = '图书音像',
  CLOTHING = '衣物鞋包',
  SPORTS_OUTDOORS = '运动户外',
  HOBBIES = '兴趣爱好',
  OTHER = '其他'
}

export enum OrderStatus {
  PENDING = '待沟通',
  AGREED = '已约定',
  COMPLETED = '交易完成',
  CANCELLED = '已取消'
}

export interface User {
  id: string;
  phone: string;
  nickname: string;
  avatar: string;
  role: UserRole;
  isRealNameVerified: boolean;
  isCommunityVerified: boolean;
  currentCircleId: string | null;
  circles: string[];
  location: {
    latitude: number;
    longitude: number;
    address: string;
  };
  reputation: number;
  createdAt: string;
}

export interface Product {
  id: string;
  title: string;
  description: string;
  images: string[];
  price: number;
  originalPrice?: number;
  category: ProductCategory;
  condition: string;
  sellerId: string;
  circleId: string;
  location: {
    latitude: number;
    longitude: number;
    address: string;
  };
  isNegotiable: boolean;
  isSelfPickupOnly: boolean;
  deliveryRange?: string;
  viewCount: number;
  interestedCount: number;
  createdAt: string;
  updatedAt: string;
}

export interface Circle {
  id: string;
  name: string;
  description: string;
  avatar: string;
  adminId: string;
  memberCount: number;
  productsCount: number;
  location: {
    latitude: number;
    longitude: number;
    address: string;
  };
  joinCode: string;
  joinCondition: string;
  radius: number;
  createdAt: string;
}

export interface Order {
  id: string;
  productId: string;
  buyerId: string;
  sellerId: string;
  price: number;
  status: OrderStatus;
  createdAt: string;
  updatedAt: string;
}

export interface Message {
  id: string;
  senderId: string;
  receiverId: string;
  content: string;
  type: 'text' | 'image' | 'voice' | 'location';
  createdAt: string;
  isRead: boolean;
}

export interface Review {
  id: string;
  orderId: string;
  reviewerId: string;
  revieweeId: string;
  rating: number;
  comment: string;
  createdAt: string;
}

export interface AppState {
  step: AppStep;
  currentUser: User | null;
  users: User[];
  products: Product[];
  circles: Circle[];
  orders: Order[];
  messages: Message[];
  reviews: Review[];
  selectedProductId: string | null;
  selectedCircleId: string | null;
  selectedUserId: string | null;
}
