import axios from 'axios';
import { ElMessage } from 'element-plus';
import { useUserStore } from "@/stores/userStore";

// API 响应类型
interface ApiResponse<T = any> {
  data: T;
  message?: string;
  status: number;
}

// 创建 axios 实例
const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'http://localhost:3000/api',
  timeout: 10000,
  withCredentials: true
});

// 请求拦截器
api.interceptors.request.use(
  config => {
    const userStore = useUserStore();
    if (userStore.token) {
      config.headers.Authorization = `Bearer ${userStore.token}`;
    }
    return config;
  },
  error => {
    return Promise.reject(error);
  }
);

// 响应拦截器
api.interceptors.response.use(
  response => {
    return response.data;
  },
  error => {
    if (error.response?.status === 401) {
      const userStore = useUserStore();
      userStore.logout();
      router.push("/ai-love/login");
    }
    ElMessage.error(error.response?.data?.message || '请求失败');
    return Promise.reject(error);
  }
);

// 用户相关接口
export const userApi = {
  login: (data: { account: string; password: string }) => 
    api.post<ApiResponse>('/auth/login', data),
  register: (data: { email: string; password: string; name: string }) => 
    api.post<ApiResponse>('/auth/register', data),
  getUserInfo: () => 
    api.get<ApiResponse>('/user/info'),
  updateUserInfo: (data: any) => 
    api.put<ApiResponse>('/user/info', data)
};

// 测试相关接口
export const testApi = {
  submitTest: (data: any) => 
    api.post<ApiResponse>('/tests', data),
  getTestHistory: (params?: any) => 
    api.get<ApiResponse>('/tests', { params }),
  getTestDetail: (id: string) => 
    api.get<ApiResponse>(`/tests/${id}`),
  deleteTest: (id: string) => 
    api.delete<ApiResponse>(`/tests/${id}`)
};

// 记录相关接口
export const recordApi = {
  getRecords: (params?: any) => 
    api.get<ApiResponse>('/records', { params }),
  getRecordDetail: (id: string) => 
    api.get<ApiResponse>(`/records/${id}`),
  exportRecord: (id: string) => 
    api.get<ApiResponse>(`/records/${id}/export`),
  deleteRecord: (id: string) => 
    api.delete<ApiResponse>(`/records/${id}`)
};

// 社区相关接口
export const communityApi = {
  getPosts: (params?: any) => 
    api.get<ApiResponse>('/posts', { params }),
  getPostDetail: (id: string) => 
    api.get<ApiResponse>(`/posts/${id}`),
  createPost: (data: any) => 
    api.post<ApiResponse>('/posts', data),
  likePost: (id: string) => 
    api.post<ApiResponse>(`/posts/${id}/like`),
  collectPost: (id: string) => 
    api.post<ApiResponse>(`/posts/${id}/collect`),
  addComment: (id: string, data: any) => 
    api.post<ApiResponse>(`/posts/${id}/comments`, data)
};

// 专家系统相关接口
export const expertApi = {
  getExperts: (params?: any) => 
    api.get<ApiResponse>('/experts', { params }),
  getExpertDetail: (id: string) => 
    api.get<ApiResponse>(`/experts/${id}`),
  createConsultation: (data: any) => 
    api.post<ApiResponse>('/consultations', data),
  getConsultations: (params?: any) => 
    api.get<ApiResponse>('/consultations', { params })
};

export default api; 