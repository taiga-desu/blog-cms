package com.example.blog_backend.repository;

import com.example.blog_backend.entity.Article;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;
import java.util.List;

@Repository
public interface ArticleRepository extends JpaRepository<Article, Long> {
    
    // タイトルで検索
    List<Article> findByTitleContaining(String title);
    
    // 作成日時の降順で全記事取得
    @Query("SELECT a FROM Article a ORDER BY a.createdAt DESC")
    List<Article> findAllOrderByCreatedAtDesc();
    
    // 最新の記事を指定件数取得
    @Query("SELECT a FROM Article a ORDER BY a.createdAt DESC LIMIT :limit")
    List<Article> findLatestArticles(int limit);
}