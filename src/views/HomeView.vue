<template>
  <div class="home-view">
    <div class="container">
      <!-- 页面标题 -->
      <header class="header">
        <div class="brand">
          <div class="logo">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71"/>
              <path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71"/>
            </svg>
          </div>
          <div class="title-group">
            <h1 class="title">LinkNest</h1>
            <p class="subtitle">链接库</p>
          </div>
        </div>
      </header>

      <!-- 搜索框 -->
      <div class="search-section">
        <SearchBar 
          v-model="searchQuery" 
          @search="setSearchQuery"
        />
      </div>

      <!-- 标签筛选 -->
      <div class="tag-filter" v-if="allTags.length > 0">
        <div class="tag-header">
          <span class="tag-label">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <path d="M20.59 13.41l-7.17 7.17a2 2 0 0 1-2.83 0L2 12V2h10l8.59 8.59a2 2 0 0 1 0 2.82z"/>
              <line x1="7" y1="7" x2="7.01" y2="7"/>
            </svg>
            标签筛选
          </span>
          <button 
            v-if="selectedTags.length > 0" 
            class="clear-button"
            @click="clearFilters"
          >
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <path d="M18 6L6 18M6 6l12 12"/>
            </svg>
            清除
          </button>
        </div>
        <div class="tag-list">
          <button
            v-for="tag in allTags"
            :key="tag"
            :class="['tag-button', { active: selectedTags.includes(tag) }]"
            @click="toggleTag(tag)"
          >
            {{ tag }}
          </button>
        </div>
      </div>

      <!-- 加载状态 -->
      <div v-if="loading" class="loading">
        <div class="spinner"></div>
        <p>加载中...</p>
      </div>

      <!-- 错误提示 -->
      <div v-else-if="error" class="error">
        <div class="error-icon">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <circle cx="12" cy="12" r="10"/>
            <line x1="12" y1="8" x2="12" y2="12"/>
            <line x1="12" y1="16" x2="12.01" y2="16"/>
          </svg>
        </div>
        <p>{{ error }}</p>
        <button @click="loadBookmarks" class="retry-btn">重新加载</button>
      </div>

      <!-- 书签列表 -->
      <BookmarkList 
        v-else 
        :bookmarks="filteredBookmarks"
        @tag-click="handleTagClick"
      />

      <!-- 统计信息 -->
      <footer class="footer" v-if="!loading && !error">
        <div class="footer-content">
          <span class="count">{{ filteredBookmarks.length }} 个书签</span>
          <span class="divider">·</span>
          <span class="tips">按 Enter 搜索</span>
        </div>
      </footer>
    </div>
  </div>
</template>

<script>
import { onMounted } from 'vue'
import SearchBar from '../components/SearchBar.vue'
import BookmarkList from '../components/BookmarkList.vue'
import { useBookmarks } from '../composables/useBookmarks.js'

export default {
  name: 'HomeView',
  components: {
    SearchBar,
    BookmarkList
  },
  setup() {
    const {
      searchQuery,
      selectedTags,
      loading,
      error,
      allTags,
      filteredBookmarks,
      loadBookmarks,
      setSearchQuery,
      toggleTag,
      clearFilters
    } = useBookmarks()

    const handleTagClick = (tag) => {
      toggleTag(tag)
    }

    onMounted(() => {
      loadBookmarks()
    })

    return {
      searchQuery,
      selectedTags,
      loading,
      error,
      allTags,
      filteredBookmarks,
      loadBookmarks,
      handleTagClick,
      setSearchQuery,
      toggleTag,
      clearFilters
    }
  }
}
</script>

<style scoped>
.home-view {
  min-height: 100vh;
  padding: 48px 20px 60px;
}

/* 容器 */
.container {
  max-width: 680px;
  margin: 0 auto;
}

/* 头部 */
.header {
  margin-bottom: 40px;
}

.brand {
  display: flex;
  align-items: center;
  gap: 16px;
}

.logo {
  width: 52px;
  height: 52px;
  display: flex;
  align-items: center;
  justify-content: center;
  background: linear-gradient(135deg, #1e293b, #334155);
  border-radius: 14px;
  box-shadow: 0 8px 24px rgba(30, 41, 59, 0.2);
}

.logo svg {
  width: 26px;
  height: 26px;
  color: #fff;
}

.title-group {
  display: flex;
  flex-direction: column;
  gap: 2px;
}

.title {
  margin: 0;
  font-size: 28px;
  font-weight: 700;
  letter-spacing: -0.03em;
  color: #0f172a;
}

.subtitle {
  margin: 0;
  font-size: 14px;
  font-weight: 400;
  color: #64748b;
  letter-spacing: 0.05em;
}

/* 搜索区 */
.search-section {
  margin-bottom: 24px;
}

/* 标签筛选 */
.tag-filter {
  background: #fff;
  border-radius: 16px;
  padding: 20px;
  margin-bottom: 32px;
  border: 1px solid #f1f5f9;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.02);
}

.tag-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 14px;
}

.tag-label {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  font-size: 13px;
  font-weight: 500;
  color: #94a3b8;
  text-transform: uppercase;
  letter-spacing: 0.05em;
}

.tag-label svg {
  width: 14px;
  height: 14px;
}

.clear-button {
  display: inline-flex;
  align-items: center;
  gap: 4px;
  padding: 6px 10px;
  font-size: 12px;
  font-weight: 500;
  color: #6366f1;
  background: transparent;
  border: none;
  border-radius: 6px;
  cursor: pointer;
  transition: all 0.2s;
}

.clear-button:hover {
  background: #f1f5f9;
}

.clear-button svg {
  width: 12px;
  height: 12px;
}

.tag-list {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
}

.tag-button {
  padding: 8px 16px;
  font-size: 13px;
  font-weight: 500;
  color: #64748b;
  background: #f8fafc;
  border: 1px solid #e2e8f0;
  border-radius: 22px;
  cursor: pointer;
  transition: all 0.2s ease;
}

.tag-button:hover {
  background: #f1f5f9;
  border-color: #cbd5e1;
}

.tag-button.active {
  color: #fff;
  background: #1e293b;
  border-color: #1e293b;
}

/* 加载 */
.loading {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 16px;
  padding: 80px 16px;
}

.spinner {
  width: 28px;
  height: 28px;
  border: 2.5px solid #f1f5f9;
  border-top-color: #6366f1;
  border-radius: 50%;
  animation: spin 0.7s linear infinite;
}

@keyframes spin {
  to { transform: rotate(360deg); }
}

.loading p {
  margin: 0;
  font-size: 14px;
  color: #94a3b8;
}

/* 错误 */
.error {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 16px;
  padding: 60px 16px;
  background: #fef2f2;
  border-radius: 16px;
}

.error-icon {
  width: 48px;
  height: 48px;
  display: flex;
  align-items: center;
  justify-content: center;
  background: #fee2e2;
  border-radius: 12px;
}

.error-icon svg {
  width: 24px;
  height: 24px;
  color: #ef4444;
}

.error p {
  margin: 0;
  font-size: 14px;
  color: #dc2626;
}

.retry-btn {
  padding: 10px 20px;
  font-size: 14px;
  font-weight: 500;
  color: #fff;
  background: #ef4444;
  border: none;
  border-radius: 10px;
  transition: all 0.2s;
}

.retry-btn:hover {
  background: #dc2626;
}

/* 底部 */
.footer {
  margin-top: 48px;
}

.footer-content {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  font-size: 13px;
  color: #94a3b8;
}

.count {
  font-weight: 600;
  color: #64748b;
}

.divider {
  opacity: 0.5;
}

.tips {
  opacity: 0.7;
}
</style>