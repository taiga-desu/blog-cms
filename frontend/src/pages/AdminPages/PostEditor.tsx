import { useState, useEffect } from 'react';
import MDEditor from '@uiw/react-md-editor'; //エディター機能
import ReactMarkdown from 'react-markdown'; //MarkdownをHTMLに変換
import remarkGfm from 'remark-gfm';// 取り消し線など対応(Markdown)
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';// シンタックスハイライト(コードの表示)
import { tomorrow } from 'react-syntax-highlighter/dist/esm/styles/prism';// シンタックスハイライト(コードの表示)
import type { Article } from '../../types/Article';
import { articleApi } from '../../api/articleApi'

function PostEditor() {
    // フォーム用のstate
    const [title, setTitle] = useState('');
    const [content, setContent] = useState('');
    const [editingId, setEditingId] = useState<number | null>(null);

    // 記事一覧用のstate（後でAPIから取得）
    const [articles, setArticles] = useState<Article[]>([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    // TabCodeBlockコンポーネント
    const TabCodeBlock = ({ content }: { content: string }) => {
        const [activeTab, setActiveTab] = useState(0);
        
        // コンテンツを解析してファイル別に分割
        const parseTabContent = (rawContent: string) => {
            const codeBlocks: Array<{ filename: string; language: string; code: string }> = [];
            const lines = rawContent.split('\n');
            let currentBlock: { filename: string; language: string; code: string } | null = null;
            
            for (const line of lines) {
                const match = line.match(/^```(\w+):(.+)$/);
                if (match) {
                    // 新しいコードブロック開始
                    if (currentBlock) {
                        codeBlocks.push(currentBlock);
                    }
                    currentBlock = {
                        language: match[1],
                        filename: match[2],
                        code: ''
                    };
                } else if (line === '```') {
                    // コードブロック終了
                    if (currentBlock) {
                        codeBlocks.push(currentBlock);
                        currentBlock = null;
                    }
                } else if (currentBlock) {
                    // コード内容
                    currentBlock.code += line + '\n';
                }
            }
            
            return codeBlocks;
        };
        
        const tabs = parseTabContent(content);
        
        if (tabs.length === 0) return null;
        
        return (
            <div style={{ marginBottom: '1rem' }}>
                {/* タブヘッダー */}
                <div style={{ 
                    display: 'flex', 
                    backgroundColor: '#f7fafc', 
                    borderRadius: '6px 6px 0 0', 
                    overflow: 'hidden',
                    position: 'relative'
                }}>
                    <div style={{
                        display: 'flex',
                        overflowX: 'auto',
                        scrollbarWidth: 'thin',
                        scrollbarColor: '#cbd5e0 #f7fafc',
                        width: '100%'
                    }}>
                        {tabs.map((tab, index) => (
                            <button
                                key={index}
                                onClick={() => setActiveTab(index)}
                                style={{
                                    padding: '0.5rem 1rem',
                                    backgroundColor: activeTab === index ? '#2d3748' : 'transparent',
                                    color: activeTab === index ? '#e2e8f0' : '#4a5568',
                                    border: 'none',
                                    cursor: 'pointer',
                                    fontSize: '0.875rem',
                                    fontFamily: 'monospace',
                                    borderBottom: activeTab === index ? 'none' : '1px solid #e2e8f0',
                                    whiteSpace: 'nowrap',
                                    minWidth: 'fit-content',
                                    flexShrink: 0
                                }}
                            >
                                📁 {tab.filename}
                            </button>
                        ))}
                    </div>
                </div>
                
                {/* タブコンテンツ */}
                <SyntaxHighlighter
                    style={tomorrow as any}
                    language={tabs[activeTab].language}
                    PreTag="div"
                    customStyle={{
                        marginTop: 0,
                        borderTopLeftRadius: 0,
                        borderTopRightRadius: 0
                    }}
                >
                    {tabs[activeTab].code.replace(/\n$/, '')}
                </SyntaxHighlighter>
            </div>
        );
    };

    // フォーム送信処理
    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();

        // バリデーション追加
        if (!title.trim() || !content.trim()) {
            setError('タイトルと内容を入力してください');
            return;
        }

        if (editingId) {
            // 編集モード: 既存記事を更新
            updateArticle();
        } else {
            // 新規作成モード: 新しい記事を追加
            createArticle();
        }
    };

    // 新規記事作成
    const createArticle = async () => {
        try {
            setLoading(true);
            setError(null);

            await articleApi.createArticle({ title, content });

            //成功後の処理
            setTitle('');
            setContent('');
            fetchArticles(); // 記事一覧を再取得
        } catch (err) {
            setError('記事の作成に失敗しました');
            console.error('Error creating article:', err);
        } finally {
            setLoading(false);
        }
    };

    // 記事更新
    const updateArticle = async () => {
        if (!editingId) return;

        try {
            setLoading(true);
            setError(null);
            
            await articleApi.updateArticle(editingId, { title, content });
            
            // 成功後の処理
            setTitle('');
            setContent('');
            setEditingId(null);
            fetchArticles(); // 記事一覧を再取得
        } catch (err) {
            setError('記事の更新に失敗しました');
            console.error('Error updating article:', err);
        } finally {
            setLoading(false);
        }
    };

    //編集機能
    const handleEdit = (article: Article) => {
        setTitle(article.title);
        setContent(article.content);
        setEditingId(article.id);
        setError(null);
    };

    //削除機能
    const handleDelete = async (id: number) => {
        if (!window.confirm('この記事を削除しますか？')) return;

        try {
            setLoading(true);
            setError(null);
            
            await articleApi.deleteArticle(id);
            fetchArticles(); // 記事一覧を再取得
        } catch (err) {
            setError('記事の削除に失敗しました');
            console.error('Error deleting article:', err);
        } finally {
            setLoading(false);
        }
    };

    // 編集キャンセル機能
    const handleCancel = () => {
        setTitle('');
        setContent('');
        setEditingId(null);
        setError(null);
    };

    // 初回ロード時に記事一覧を取得
    useEffect(() => {
        fetchArticles();
    }, []);

    // 記事一覧取得
    const fetchArticles = async () => {
        try {
            setLoading(true);
            setError(null);
            const response = await articleApi.getAllArticles();
            setArticles(response.data);
        } catch (err) {
            setError('記事の取得に失敗しました');
            console.error('Error fetching articles:', err);
        } finally {
            setLoading(false);
        }
    };




    return (
        <div>
            {/* エラー表示 */}
            {error && (
                <div style={{ color: 'red', marginBottom: '1rem', padding: '0.5rem', border: '1px solid red', borderRadius: '4px' }}>
                    {error}
                </div>
            )}

            {/* 記事作成・編集フォーム */}
            <section>
                <h2>{editingId ? '記事編集' : '新規記事作成'}</h2>
                <form onSubmit={handleSubmit}>
                    <input
                        type="text"
                        placeholder="タイトル"
                        value={title}
                        onChange={(e) => setTitle(e.target.value)}
                        disabled={loading}
                    />
                    <MDEditor
                        value={content}
                        onChange={(val) => setContent(val || '')}
                        preview="edit"
                        hideToolbar={loading}
                        visibleDragbar={false}
                        data-color-mode="light"
                    />
                    <button type="submit" disabled={loading}>
                        {loading ? '処理中...' : editingId ? '更新' : '投稿'}
                    </button>
                    {editingId && (
                        <button type="button" onClick={handleCancel} disabled={loading}>
                            キャンセル
                        </button>
                    )}
                </form>
            </section>

            {/* 既存記事一覧 */}
            <section>
                <h2>記事一覧</h2>
                {loading ? (
                    <p>読み込み中...</p>
                ) : articles.length === 0 ? (
                    <p>記事がありません</p>
                ) : (
                    <ul>
                        {articles.map(article => (
                            <li key={article.id}>
                                <h3>{article.title}</h3>
                                <div className="markdown-content" style={{ border: '1px solid #ddd', padding: '1rem', marginBottom: '1rem' }}>
                                    <ReactMarkdown
                                        remarkPlugins={[remarkGfm]}
                                        components={{
                                            code(props) {
                                                const {children, className, node, ...rest} = props;
                                                
                                                // tabsブロックの処理
                                                if (className === 'language-tabs') {
                                                    return <TabCodeBlock content={String(children)} />;
                                                }
                                                
                                                // 通常のコードブロック処理
                                                const match = /language-(\w+)(:(.+))?/.exec(className || '');
                                                const language = match ? match[1] : '';
                                                const filename = match ? match[3] : '';
                                                
                                                return match ? (
                                                    <div style={{ position: 'relative', marginBottom: '1rem' }}>
                                                        {filename && (
                                                            <div style={{
                                                                backgroundColor: '#2d3748',
                                                                color: '#e2e8f0',
                                                                padding: '0.5rem 1rem',
                                                                fontSize: '0.875rem',
                                                                fontFamily: 'monospace',
                                                                borderTopLeftRadius: '6px',
                                                                borderTopRightRadius: '6px',
                                                                margin: 0
                                                            }}>
                                                                📁 {filename}
                                                            </div>
                                                        )}
                                                        <SyntaxHighlighter
                                                            style={tomorrow as any}
                                                            language={language}
                                                            PreTag="div"
                                                            customStyle={{
                                                                marginTop: filename ? 0 : undefined,
                                                                borderTopLeftRadius: filename ? 0 : '6px',
                                                                borderTopRightRadius: filename ? 0 : '6px'
                                                            }}
                                                        >
                                                            {String(children).replace(/\n$/, '')}
                                                        </SyntaxHighlighter>
                                                    </div>
                                                ) : (
                                                    <code className={className} {...rest}>
                                                        {children}
                                                    </code>
                                                );
                                            }
                                        }}
                                    >
                                        {article.content}
                                    </ReactMarkdown>
                                </div>
                                <small>
                                    作成日: {new Date(article.createdAt).toLocaleString()} | 
                                    更新日: {new Date(article.updatedAt).toLocaleString()}
                                </small>

                                {/* 編集・削除ボタン */}
                                <div>
                                    <button onClick={() => handleEdit(article)} disabled={loading}>
                                        編集
                                    </button>
                                    <button onClick={() => handleDelete(article.id)} disabled={loading}>
                                        削除
                                    </button>
                                </div>
                            </li>
                        ))}
                    </ul>
                )}
            </section>
        </div>
    );
}

export default PostEditor;