import axios from 'axios';
import type { Article } from '../types/Article';

const API_BASE_URL = 'http://localhost:8080/api';

const apiClient = axios.create({
    baseURL: API_BASE_URL,
    headers: {
    'Content-Type': 'application/json',
  },
});

export const articleApi = {
  // 全記事取得
  getAllArticles: () => apiClient.get<Article[]>('/articles'),
  
  // 記事作成
  createArticle: (data: { title: string; content: string }) => 
    apiClient.post<Article>('/articles', data),
  
  // 記事更新
  updateArticle: (id: number, data: { title: string; content: string }) => 
    apiClient.put<Article>(`/articles/${id}`, data),
  
  // 記事削除
  deleteArticle: (id: number) => apiClient.delete(`/articles/${id}`),
};