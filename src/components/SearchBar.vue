<template>
  <div class="search-bar">
    <!-- 搜索图标 -->
    <svg class="search-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5">
      <circle cx="11" cy="11" r="8"/>
      <path d="M21 21l-1.5-1.5"/>
    </svg>
    <input
      type="text"
      :value="modelValue"
      placeholder="搜索书签... (/ 聚焦)"
      ref="searchInput"
      @input="handleInput"
      @keydown.enter="handleEnter"
      @keydown.escape="handleClear"
      class="search-input"
    />
    <!-- 清除按钮 -->
    <button
      v-if="modelValue"
      @click="handleClear"
      class="clear-btn"
      title="清除 (Esc)"
    >
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
        <path d="M18 6L6 18M6 6l12 12"/>
      </svg>
    </button>
  </div>
</template>

<script>
export default {
  name: 'SearchBar',
  props: {
    modelValue: {
      type: String,
      default: ''
    }
  },
  emits: ['update:modelValue', 'search'],
  data() {
    return {
      searchInputRef: null
    }
  },
  mounted() {
    this.searchInputRef = this.$refs.searchInput
  },
  methods: {
    focus() {
      this.$refs.searchInput?.focus()
    },
    handleInput(e) {
      this.$emit('update:modelValue', e.target.value)
    },
    handleEnter() {
      this.$emit('search', this.modelValue)
    },
    handleClear() {
      this.$emit('update:modelValue', '')
      this.$emit('search', '')
    }
  }
}
</script>

<style scoped>
.search-bar {
  position: relative;
  width: 100%;
  max-width: 560px;
  margin: 0 auto;
}

.search-icon {
  position: absolute;
  left: 20px;
  top: 50%;
  transform: translateY(-50%);
  width: 20px;
  height: 20px;
  color: #94a3b8;
  pointer-events: none;
  transition: color 0.2s;
}

.search-input {
  width: 100%;
  padding: 16px 52px;
  font-size: 15px;
  font-weight: 400;
  letter-spacing: -0.01em;
  color: #1e293b;
  background: #fff;
  border: 1.5px solid #f1f5f9;
  border-radius: 14px;
  outline: none;
  transition: all 0.25s cubic-bezier(0.4, 0, 0.2, 1);
}

.search-input::placeholder {
  color: #94a3b8;
}

.search-input:focus {
  border-color: #6366f1;
  box-shadow: 0 0 0 4px rgba(99, 102, 241, 0.1);
}

.search-input:focus + .search-icon,
.search-bar:focus-within .search-icon {
  color: #6366f1;
}

.clear-btn {
  position: absolute;
  right: 14px;
  top: 50%;
  transform: translateY(-50%);
  display: flex;
  align-items: center;
  justify-content: center;
  width: 30px;
  height: 30px;
  padding: 0;
  color: #94a3b8;
  background: #f1f5f9;
  border: none;
  border-radius: 8px;
  cursor: pointer;
  transition: all 0.2s;
}

.clear-btn:hover {
  color: #475569;
  background: #e2e8f0;
}

.clear-btn svg {
  width: 14px;
  height: 14px;
}

@media (max-width: 640px) {
  .search-input {
    padding: 14px 48px;
    font-size: 14px;
    border-radius: 12px;
  }

  .search-icon {
    left: 16px;
    width: 18px;
    height: 18px;
  }

  .clear-btn {
    right: 12px;
    width: 26px;
    height: 26px;
    border-radius: 6px;
  }
}
</style>