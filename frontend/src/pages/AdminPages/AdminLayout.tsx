import { useState } from 'react';
import PostEditor from './PostEditor';
import styles from './AdminLayout.module.css';

function AdminLayout() {
    const [activeSection, setActiveSection] = useState('dashboard');

     return (
        <div className={styles.adminLayout}>
            <header className={styles.header}>
                <h1>管理画面</h1>
            </header>
        
            <nav className={styles.sidebar}>
                <button 
                    onClick={() => setActiveSection('dashboard')}
                    className={activeSection === 'dashboard' ? styles.active : ''}
                >
                    📊 ダッシュボード
                </button>
                <button 
                    onClick={() => setActiveSection('post')}
                    className={activeSection === 'post' ? styles.active : ''}
                >
                    ✍️ 投稿
                </button>
            </nav>

            <main className={styles.main}>
                {activeSection === 'dashboard' && <div>ダッシュボード内容</div>}
                {activeSection === 'post' && <PostEditor />}
            </main>
        
        </div>
    );
}

export default AdminLayout;