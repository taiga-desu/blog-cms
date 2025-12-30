import { useState, useEffect } from 'react';
import type { Article } from '../types/Article';
import { createArticle, updateArticle } from '../services/articleService';
import styles from './ArticleForm.module.css';

interface Props {
  editingArticle: Article | null;
  onSave: () => void;
  onCancel: () => void;
}

const ArticleForm: React.FC<Props> = ({ editingArticle, onSave, onCancel }) => {
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // 編集時にフォームに既存データを設定
  useEffect(() => {
    if (editingArticle) {
      setTitle(editingArticle.title);
      setContent(editingArticle.content);
    } else {
      setTitle('');
      setContent('');
    }
    setError(null);
  }, [editingArticle]);

  // フォーム送信
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // バリデーション
    if (!title.trim()) {
      setError('タイトルを入力してください');
      return;
    }
    if (!content.trim()) {
      setError('内容を入力してください');
      return;
    }
    if (title.length > 200) {
      setError('タイトルは200文字以下で入力してください');
      return;
    }

    try {
      setLoading(true);
      setError(null);

      if (editingArticle) {
        // 更新
        await updateArticle(editingArticle.id, {
          title: title.trim(),
          content: content.trim()
        });
      } else {
        // 新規作成
        await createArticle({
          title: title.trim(),
          content: content.trim()
        });
      }

      // フォームリセット
      setTitle('');
      setContent('');
      onSave(); // 親コンポーネントに完了を通知
    } catch (err) {
      if (err instanceof Error) {
        setError(err.message);
      } else {
        setError('記事の保存に失敗しました');
      }
    } finally {
      setLoading(false);
    }
  };

  // キャンセル
  const handleCancel = () => {
    setTitle('');
    setContent('');
    setError(null);
    onCancel();
  };

  return (
    <div className={styles.container}>
      <h2 className={styles.title}>
        {editingArticle ? '記事を編集' : '新しい記事を作成'}
      </h2>
      
      {error && (
        <div className={styles.error}>
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit} className={styles.form}>
        <div className={styles.formGroup}>
          <label htmlFor="title" className={styles.label}>
            タイトル <span className={styles.required}>*</span>
          </label>
          <input
            type="text"
            id="title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className={styles.input}
            placeholder="記事のタイトルを入力してください"
            disabled={loading}
            maxLength={200}
          />
          <div className={styles.charCount}>
            {title.length}/200文字
          </div>
        </div>

        <div className={styles.formGroup}>
          <label htmlFor="content" className={styles.label}>
            内容 <span className={styles.required}>*</span>
          </label>
          <textarea
            id="content"
            value={content}
            onChange={(e) => setContent(e.target.value)}
            className={styles.textarea}
            placeholder="記事の内容を入力してください"
            disabled={loading}
            rows={10}
          />
        </div>

        <div className={styles.buttonGroup}>
          <button
            type="submit"
            disabled={loading}
            className={styles.saveButton}
          >
            {loading ? '保存中...' : (editingArticle ? '更新' : '作成')}
          </button>
          <button
            type="button"
            onClick={handleCancel}
            disabled={loading}
            className={styles.cancelButton}
          >
            キャンセル
          </button>
        </div>
      </form>
    </div>
  );
};

export default ArticleForm;