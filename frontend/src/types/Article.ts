export interface Article {
  id: number;
  title: string;
  content: string;
  createdAt: string;
  updatedAt: string;
}

export interface CreateArticleRequest {
  title: string;
  content: string;
}

export interface UpdateArticleRequest {
  title: string;
  content: string;
}