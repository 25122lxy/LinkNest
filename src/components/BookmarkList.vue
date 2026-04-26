<template>
  <div class="bookmark-list">
    <!-- 复制成功提示 -->
    <div v-if="showCopyTip" class="copy-toast">链接已复制</div>
    <!-- 空状态 -->
    <div v-if="bookmarks.length === 0" class="empty-state">
      <div class="empty-icon">
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5">
          <path d="M19 21l-7-5-7 5V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2z"/>
        </svg>
      </div>
      <p>没有找到匹配的书签</p>
      <span>试试调整搜索条件</span>
    </div>

    <!-- 书签列表 -->
    <div v-else class="bookmark-items">
      <a
        v-for="(bookmark, index) in bookmarks"
        :key="index"
        :href="bookmark.url"
        target="_blank"
        rel="noopener noreferrer"
        class="bookmark-item"
        :style="{ '--delay': index * 0.05 + 's' }"
      >
        <!-- 网站图标 -->
        <div class="item-icon">
          <img 
            :src="getFavicon(bookmark.url)" 
            :alt="bookmark.title"
            class="favicon-img"
            @error="handleImageError"
          />
        </div>

        <!-- 内容 -->
        <div class="bookmark-content">
          <div class="item-header">
            <h3 class="bookmark-title">{{ bookmark.title }}</h3>
            <button class="copy-btn" @click.stop.prevent="copyUrl(bookmark.url)" title="复制链接">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <rect x="9" y="9" width="13" height="13" rx="2" ry="2"/>
                <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"/>
              </svg>
            </button>
            <svg class="arrow-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <path d="M5 12h14M12 5l7 7-7 7"/>
            </svg>
          </div>
          <p class="bookmark-url">{{ formatUrl(bookmark.url) }}</p>
          <div class="bookmark-tags" v-if="bookmark.tags && bookmark.tags.length > 0">
            <span
              v-for="(tag, tagIndex) in bookmark.tags"
              :key="tagIndex"
              class="tag"
              @click.stop="$emit('tag-click', tag)"
            >
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <path d="M20.59 13.41l-7.17 7.17a2 2 0 0 1-2.83 0L2 12V2h10l8.59 8.59a2 2 0 0 1 0 2.82z"/>
              </svg>
              {{ tag }}
            </span>
          </div>
        </div>
      </a>
    </div>
  </div>
</template>

<script>
export default {
  name: 'BookmarkList',
  props: {
    bookmarks: {
      type: Array,
      default: () => []
    }
  },
  emits: ['tag-click'],
  data() {
    return {
      showCopyTip: false
    }
  },
  methods: {
    // 获取网站favicon - 优先用网站自己的favicon.ico
    getFavicon(url) {
      try {
        const hostname = new URL(url).hostname
        return `https://${hostname}/favicon.ico`
      } catch {
        return ''
      }
    },
    // 格式化URL显示
    formatUrl(url) {
      try {
        const parsed = new URL(url)
        return parsed.hostname
      } catch {
        return url
      }
    },
    // 图片加载失败时使用默认图标
    handleImageError(e) {
      e.target.style.display = 'none'
    },
    // 复制链接
    copyUrl(url) {
      navigator.clipboard.writeText(url).then(() => {
        this.showCopyTip = true
        setTimeout(() => {
          this.showCopyTip = false
        }, 2000)
      })
    }
  }
}
</script>

<style scoped>
.bookmark-list {
  width: 100%;
  max-width: 720px;
  margin: 0 auto;
}

/* 空状态 */
.empty-state {
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 80px 16px;
  text-align: center;
}

.empty-icon {
  width: 80px;
  height: 80px;
  display: flex;
  align-items: center;
  justify-content: center;
  margin-bottom: 24px;
  background: linear-gradient(135deg, #f1f5f9, #e2e8f0);
  border-radius: 24px;
}

.empty-icon svg {
  width: 36px;
  height: 36px;
  color: #94a3b8;
}

.empty-state p {
  margin: 0;
  font-size: 17px;
  font-weight: 600;
  color: #475569;
}

.empty-state span {
  margin-top: 6px;
  font-size: 14px;
  color: #94a3b8;
}

/* 书签列表 */
.bookmark-items {
  display: flex;
  flex-direction: column;
  gap: 10px;
}

/* 书签卡片 */
.bookmark-item {
  display: flex;
  align-items: center;
  gap: 16px;
  padding: 16px 20px;
  background: #fff;
  border: 1px solid #f1f5f9;
  border-radius: 16px;
  text-decoration: none;
  color: inherit;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  animation: slideIn 0.4s ease backwards;
  animation-delay: var(--delay);
}

@keyframes slideIn {
  from {
    opacity: 0;
    transform: translateY(12px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

.bookmark-item:hover {
  background: #fafbfc;
  border-color: #e2e8f0;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.06);
  transform: translateX(4px);
}

/* 网站图标 */
.item-icon {
  flex-shrink: 0;
  width: 48px;
  height: 48px;
  display: flex;
  align-items: center;
  justify-content: center;
  background: #f8fafc;
  border-radius: 12px;
  overflow: hidden;
}

.favicon-img {
  width: 32px;
  height: 32px;
  object-fit: contain;
  border-radius: 6px;
}

/* 内容区 */
.bookmark-content {
  flex: 1;
  min-width: 0;
}

.item-header {
  display: flex;
  align-items: center;
  gap: 8px;
}

.bookmark-title {
  margin: 0;
  font-size: 16px;
  font-weight: 600;
  color: #1e293b;
  line-height: 1.4;
  letter-spacing: -0.01em;
}

.copy-btn {
  flex-shrink: 0;
  display: flex;
  align-items: center;
  justify-content: center;
  width: 28px;
  height: 28px;
  padding: 0;
  background: transparent;
  border: none;
  border-radius: 6px;
  cursor: pointer;
  opacity: 0;
  transition: all 0.2s ease;
}

.copy-btn svg {
  width: 16px;
  height: 16px;
  color: #94a3b8;
}

.copy-btn:hover {
  background: #f1f5f9;
}

.copy-btn:hover svg {
  color: #6366f1;
}

.bookmark-item:hover .copy-btn {
  opacity: 1;
}

.arrow-icon {
  flex-shrink: 0;
  width: 18px;
  height: 18px;
  color: #cbd5e1;
  opacity: 0;
  transform: translateX(-4px);
  transition: all 0.3s ease;
}

.bookmark-item:hover .arrow-icon {
  opacity: 1;
  transform: translateX(0);
  color: #6366f1;
}

.bookmark-url {
  margin: 3px 0 0;
  font-size: 13px;
  color: #94a3b8;
  font-family: 'SF Mono', 'Fira Code', monospace;
}

/* 标签 */
.bookmark-tags {
  display: flex;
  flex-wrap: wrap;
  gap: 6px;
  margin-top: 10px;
}

.tag {
  display: inline-flex;
  align-items: center;
  gap: 4px;
  padding: 4px 10px;
  font-size: 12px;
  font-weight: 500;
  color: #64748b;
  background: #f1f5f9;
  border-radius: 20px;
  cursor: pointer;
  transition: all 0.2s ease;
}

.tag svg {
  width: 11px;
  height: 11px;
}

.tag:hover {
  background: #e0e7ff;
  color: #6366f1;
}

/* 移动端适配 */
@media (max-width: 640px) {
  .bookmark-item {
    padding: 14px 16px;
    gap: 12px;
  }

  .item-icon {
    width: 40px;
    height: 40px;
  }

  .favicon-img {
    width: 26px;
    height: 26px;
  }

  .bookmark-title {
    font-size: 15px;
  }

  .copy-btn {
    opacity: 1;
  }

  .arrow-icon {
    display: none;
  }

  .bookmark-url {
    font-size: 12px;
  }

  .tag {
    padding: 3px 8px;
    font-size: 11px;
  }
}

/* 复制成功提示 */
.copy-toast {
  position: fixed;
  top: 24px;
  left: 50%;
  transform: translateX(-50%);
  padding: 10px 20px;
  font-size: 14px;
  font-weight: 500;
  color: #fff;
  background: #1e293b;
  border-radius: 8px;
  box-shadow: 0 4px 16px rgba(0, 0, 0, 0.15);
  z-index: 1000;
  animation: fadeIn 0.2s ease;
}

@keyframes fadeIn {
  from {
    opacity: 0;
    transform: translateX(-50%) translateY(-10px);
  }
  to {
    opacity: 1;
    transform: translateX(-50%) translateY(0);
  }
}
</style>