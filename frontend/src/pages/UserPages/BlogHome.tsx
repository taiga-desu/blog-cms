import { useState } from 'react';
import type { Article } from '../../types/Article';
import ArticleList from '../../components/ArticleList';
import ArticleForm from '../../components/ArticleForm';
import styles from '../../styles/App.module.css';

function App() {
  const [showForm, setShowForm] = useState(false);
  const [editingArticle, setEditingArticle] = useState<Article | null>(null);
  const [refreshTrigger, setRefreshTrigger] = useState(0);

  // 新規作成モード
  const handleCreateNew = () => {
    setEditingArticle(null);
    setShowForm(true);
  };

  // 編集モード
  const handleEditArticle = (article: Article) => {
    setEditingArticle(article);
    setShowForm(true);
  };

  // 保存完了
  const handleSave = () => {
    setShowForm(false);
    setEditingArticle(null);
    // リストを再読み込み
    setRefreshTrigger(prev => prev + 1);
  };

  // キャンセル
  const handleCancel = () => {
    setShowForm(false);
    setEditingArticle(null);
  };

  return (
    <div className={styles.appContainer}>
      <div className={styles.contentWrapper}>
        {/* ヘッダー */}
        <header className={styles.header}>
          <h1 className={styles.title}>
            📝 My Blog
          </h1>
          <p className={styles.subtitle}>
            Spring Boot + React で作るブログアプリ
          </p>
        </header>

        {/* メインコンテンツ */}
        <main>
          {showForm ? (
            // フォーム表示中
            <ArticleForm
              editingArticle={editingArticle}
              onSave={handleSave}
              onCancel={handleCancel}
            />
          ) : (
            // 記事一覧表示中
            <div>
              {/* 新規作成ボタン */}
              <div className={styles.newArticleButtonContainer}>
                <button
                  onClick={handleCreateNew}
                  className={styles.newArticleButton}
                >
                  ✍️ 新しい記事を書く
                </button>
              </div>

              {/* 記事一覧 */}
              <ArticleList
                onEditArticle={handleEditArticle}
                refreshTrigger={refreshTrigger}
              />
            </div>
          )}
        </main>

        {/* フッター */}
        <footer className={styles.footer}>
          <p className={styles.footerText}>
            © 2025 My Blog App - Spring Boot & React
          </p>
        </footer>
      </div>
    </div>
  );
}

export default App;