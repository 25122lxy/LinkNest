import { ref, computed } from 'vue'

/**
 * 书签数据处理组合式函数
 * 负责加载、搜索和筛选书签数据
 */
export function useBookmarks() {
  // 原始书签数据
  const bookmarks = ref([])
  // 搜索关键词
  const searchQuery = ref('')
  // 选中的标签筛选条件
  const selectedTags = ref([])
  // 数据加载状态
  const loading = ref(false)
  // 错误信息
  const error = ref(null)

  /**
   * 加载书签数据
   * 从 public/data.json 文件读取数据
   */
  const loadBookmarks = async () => {
    loading.value = true
    error.value = null
    try {
      const response = await fetch('/data.json')
      if (!response.ok) {
        throw new Error('加载数据失败')
      }
      bookmarks.value = await response.json()
    } catch (e) {
      error.value = e.message
      console.error('加载书签数据失败:', e)
    } finally {
      loading.value = false
    }
  }

  /**
   * 获取所有唯一标签
   * 从书签数据中提取所有不重复的标签
   */
  const allTags = computed(() => {
    const tagSet = new Set()
    bookmarks.value.forEach(bookmark => {
      if (bookmark.tags && Array.isArray(bookmark.tags)) {
        bookmark.tags.forEach(tag => tagSet.add(tag))
      }
    })
    return Array.from(tagSet).sort()
  })

  /**
   * 过滤后的书签列表
   * 根据搜索关键词和选中的标签进行过滤
   */
  const filteredBookmarks = computed(() => {
    return bookmarks.value.filter(bookmark => {
      // 搜索过滤
      const query = searchQuery.value.toLowerCase().trim()
      const matchesSearch = !query || 
        bookmark.title.toLowerCase().includes(query) ||
        (bookmark.tags && bookmark.tags.some(tag => tag.toLowerCase().includes(query)))

      // 标签过滤
      const matchesTags = selectedTags.value.length === 0 ||
        selectedTags.value.some(tag => bookmark.tags && bookmark.tags.includes(tag))

      return matchesSearch && matchesTags
    })
  })

  /**
   * 设置搜索关键词
   * @param {string} query - 搜索关键词
   */
  const setSearchQuery = (query) => {
    searchQuery.value = query
  }

  /**
   * 切换标签筛选
   * @param {string} tag - 要切换的标签
   */
  const toggleTag = (tag) => {
    const index = selectedTags.value.indexOf(tag)
    if (index === -1) {
      selectedTags.value.push(tag)
    } else {
      selectedTags.value.splice(index, 1)
    }
  }

  /**
   * 清除所有筛选条件
   */
  const clearFilters = () => {
    searchQuery.value = ''
    selectedTags.value = []
  }

  return {
    bookmarks,
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
  }
}