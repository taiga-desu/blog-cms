import React, { useState, useEffect } from 'react';
import type { Article } from '../types/Article';
import { getAllArticles, deleteArticle } from '../services/articleService';
import styles from './ArticleList.module.css';

interface Props {
  onEditArticle: (article: Article) => void;
  refreshTrigger: number;
}

const ArticleList: React.FC<Props> = ({ onEditArticle, refreshTrigger }) => {
  const [articles, setArticles] = useState<Article[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // 記事一覧取得
  const fetchArticles = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await getAllArticles();
      setArticles(data);
    } catch (err) {
      setError('記事の取得に失敗しました');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  // 記事削除
  const handleDelete = async (id: number) => {
    if (!window.confirm('この記事を削除しますか？')) {
      return;
    }

    try {
      await deleteArticle(id);
      setArticles(articles.filter(article => article.id !== id));
    } catch (err) {
      setError('記事の削除に失敗しました');
      console.error(err);
    }
  };

  // 初回読み込み＆リフレッシュ
  useEffect(() => {
    fetchArticles();
  }, [refreshTrigger]);

  if (loading) {
    return (
      <div className={styles.loading}>
        <p>読み込み中...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className={styles.error}>
        <p>{error}</p>
        <button className={styles.retryButton} onClick={fetchArticles}>
          再試行
        </button>
      </div>
    );
  }

  return (
    <div className={styles.container}>
      <h2 className={styles.title}>記事一覧</h2>
      {articles.length === 0 ? (
        <p className={styles.emptyMessage}>
          記事がありません。最初の記事を作成してみましょう！
        </p>
      ) : (
        <div>
          {articles.map(article => (
            <div key={article.id} className={styles.articleCard}>
              <h3 className={styles.articleTitle}>
                {article.title}
              </h3>
              <p className={styles.articleContent}>
                {article.content.length > 100 
                  ? `${article.content.substring(0, 100)}...` 
                  : article.content}
              </p>
              <div className={styles.articleMeta}>
                作成日: {new Date(article.createdAt).toLocaleDateString('ja-JP')}
              </div>
              <div className={styles.buttonGroup}>
                <button
                  className={styles.editButton}
                  onClick={() => onEditArticle(article)}
                >
                  編集
                </button>
                <button
                  className={styles.deleteButton}
                  onClick={() => handleDelete(article.id)}
                >
                  削除
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default ArticleList;