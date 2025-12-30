import type { Article, CreateArticleRequest, UpdateArticleRequest } from '../types/Article';

const API_BASE_URL = 'http://localhost:8080/api/articles';

// 全記事取得
export const getAllArticles = async (): Promise<Article[]> => {
  const response = await fetch(API_BASE_URL);
  if (!response.ok) {
    throw new Error('記事の取得に失敗しました');
  }
  return response.json();
};

// 特定記事取得
export const getArticleById = async (id: number): Promise<Article> => {
  const response = await fetch(`${API_BASE_URL}/${id}`);
  if (!response.ok) {
    throw new Error('記事の取得に失敗しました');
  }
  return response.json();
};

// 記事作成
export const createArticle = async (article: CreateArticleRequest): Promise<Article> => {
  const response = await fetch(API_BASE_URL, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(article),
  });
  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.error || '記事の作成に失敗しました');
  }
  return response.json();
};

// 記事更新
export const updateArticle = async (id: number, article: UpdateArticleRequest): Promise<Article> => {
  const response = await fetch(`${API_BASE_URL}/${id}`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(article),
  });
  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.error || '記事の更新に失敗しました');
  }
  return response.json();
};

// 記事削除
export const deleteArticle = async (id: number): Promise<void> => {
  const response = await fetch(`${API_BASE_URL}/${id}`, {
    method: 'DELETE',
  });
  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.error || '記事の削除に失敗しました');
  }
};