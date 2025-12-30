package com.example.blog_backend.controller;

import com.example.blog_backend.entity.Article;
import com.example.blog_backend.service.ArticleService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.util.List;
import java.util.Map;
import java.util.Optional;

@RestController
@RequestMapping("/api/articles")
@CrossOrigin(origins = "http://localhost:5173") // React用CORS設定
public class ArticleController {
    
    @Autowired
    private ArticleService articleService;
    
    // 全記事取得
    @GetMapping
    public ResponseEntity<List<Article>> getAllArticles() {
        try {
            List<Article> articles = articleService.getAllArticles();
            return ResponseEntity.ok(articles);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }
    }
    
    // 特定記事取得
    @GetMapping("/{id}")
    public ResponseEntity<Article> getArticleById(@PathVariable Long id) {
        try {
            Optional<Article> article = articleService.getArticleById(id);
            if (article.isPresent()) {
                return ResponseEntity.ok(article.get());
            } else {
                return ResponseEntity.notFound().build();
            }
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }
    }
    
    // 記事作成
    @PostMapping
    public ResponseEntity<?> createArticle(@RequestBody Map<String, String> request) {
        try {
            String title = request.get("title");
            String content = request.get("content");
            
            Article createdArticle = articleService.createArticle(title, content);
            return ResponseEntity.status(HttpStatus.CREATED).body(createdArticle);
            
        } catch (IllegalArgumentException e) {
            return ResponseEntity.badRequest().body(Map.of("error", e.getMessage()));
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                .body(Map.of("error", "記事の作成に失敗しました"));
        }
    }
    
    // 記事更新
    @PutMapping("/{id}")
    public ResponseEntity<?> updateArticle(@PathVariable Long id, @RequestBody Map<String, String> request) {
        try {
            String title = request.get("title");
            String content = request.get("content");
            
            Article updatedArticle = articleService.updateArticle(id, title, content);
            return ResponseEntity.ok(updatedArticle);
            
        } catch (IllegalArgumentException e) {
            return ResponseEntity.badRequest().body(Map.of("error", e.getMessage()));
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                .body(Map.of("error", "記事の更新に失敗しました"));
        }
    }
    
    // 記事削除
    @DeleteMapping("/{id}")
    public ResponseEntity<?> deleteArticle(@PathVariable Long id) {
        try {
            articleService.deleteArticle(id);
            return ResponseEntity.ok(Map.of("message", "記事を削除しました"));
            
        } catch (IllegalArgumentException e) {
            return ResponseEntity.badRequest().body(Map.of("error", e.getMessage()));
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                .body(Map.of("error", "記事の削除に失敗しました"));
        }
    }
    
    // タイトル検索
    @GetMapping("/search")
    public ResponseEntity<List<Article>> searchArticles(@RequestParam(required = false) String keyword) {
        try {
            List<Article> articles = articleService.searchByTitle(keyword);
            return ResponseEntity.ok(articles);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }
    }
}