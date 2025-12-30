package com.example.blog_backend.service;

import com.example.blog_backend.entity.Article;
import com.example.blog_backend.repository.ArticleRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import java.util.List;
import java.util.Optional;

@Service
public class ArticleService {
    
    @Autowired
    private ArticleRepository articleRepository;
    
    // 全記事取得（最新順）
    public List<Article> getAllArticles() {
        return articleRepository.findAllOrderByCreatedAtDesc();
    }
    
    // ID指定で記事取得
    public Optional<Article> getArticleById(Long id) {
        return articleRepository.findById(id);
    }
    
    // 記事作成
    public Article createArticle(String title, String content) {
        // バリデーション
        if (title == null || title.trim().isEmpty()) {
            throw new IllegalArgumentException("タイトルは必須です");
        }
        if (content == null || content.trim().isEmpty()) {
            throw new IllegalArgumentException("内容は必須です");
        }
        if (title.length() > 200) {
            throw new IllegalArgumentException("タイトルは200文字以下で入力してください");
        }
        
        // 新規記事作成・保存
        Article article = new Article(title.trim(), content.trim());
        return articleRepository.save(article);
    }
    
    // 記事更新
    public Article updateArticle(Long id, String title, String content) {
        // 既存記事の存在確認
        Optional<Article> existingArticle = articleRepository.findById(id);
        if (existingArticle.isEmpty()) {
            throw new IllegalArgumentException("指定された記事が見つかりません");
        }
        
        // バリデーション
        if (title == null || title.trim().isEmpty()) {
            throw new IllegalArgumentException("タイトルは必須です");
        }
        if (content == null || content.trim().isEmpty()) {
            throw new IllegalArgumentException("内容は必須です");
        }
        if (title.length() > 200) {
            throw new IllegalArgumentException("タイトルは200文字以下で入力してください");
        }
        
        // 更新
        Article article = existingArticle.get();
        article.setTitle(title.trim());
        article.setContent(content.trim());
        return articleRepository.save(article);
    }
    
    // 記事削除
    public void deleteArticle(Long id) {
        if (!articleRepository.existsById(id)) {
            throw new IllegalArgumentException("指定された記事が見つかりません");
        }
        articleRepository.deleteById(id);
    }
    
    // タイトル検索
    public List<Article> searchByTitle(String keyword) {
        if (keyword == null || keyword.trim().isEmpty()) {
            return getAllArticles();
        }
        return articleRepository.findByTitleContaining(keyword.trim());
    }
}