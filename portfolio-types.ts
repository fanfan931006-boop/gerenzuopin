export enum AppStep {
  HOME = 'HOME',
  WORK_DETAIL = 'WORK_DETAIL',
  ABOUT = 'ABOUT',
  ADMIN_LOGIN = 'ADMIN_LOGIN',
  ADMIN_DASHBOARD = 'ADMIN_DASHBOARD',
  ADMIN_WORK_MANAGE = 'ADMIN_WORK_MANAGE',
  ADMIN_CATEGORY_MANAGE = 'ADMIN_CATEGORY_MANAGE'
}

export interface Work {
  id: string;
  title: string;
  description: string;
  images: string[];
  category: string;
  year: number;
  dominantColor: string;
  hsbColor: {
    h: number;
    s: number;
    b: number;
  };
  viewCount: number;
  createdAt: string;
  updatedAt: string;
}

export interface Category {
  id: string;
  name: string;
  order: number;
  createdAt: string;
  updatedAt: string;
}

export interface VisitStats {
  totalVisits: number;
  workVisits: Record<string, number>;
  lastUpdated: string;
}

export interface Admin {
  id: string;
  username: string;
  password: string;
  createdAt: string;
}

export interface AppState {
  step: AppStep;
  works: Work[];
  categories: Category[];
  selectedWorkId: string | null;
  selectedCategoryId: string | null;
  visitStats: VisitStats;
  isAdminLoggedIn: boolean;
  currentAdmin: Admin | null;
}
