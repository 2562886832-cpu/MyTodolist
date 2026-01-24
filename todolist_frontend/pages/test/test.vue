<template>
  <view class="search-bar">
    <!-- 搜索框 -->
    <view class="search-container" :class="{ 'active': isActive }" @click="focusInput">
      <!-- 搜索图标 -->
      <view class="search-icon">
        <uni-icons type="search" size="20" color="#999"></uni-icons>
      </view>
      
      <!-- 输入框 -->
      <input
        v-model="keyword"
        class="search-input"
        :placeholder="placeholder"
        :focus="isFocus"
        @focus="onFocus"
        @blur="onBlur"
        @confirm="onSearch"
        confirm-type="search"
        :maxlength="maxlength"
      />
      
      <!-- 清除按钮 -->
      <view v-if="keyword && showClear" class="clear-icon" @click="clearKeyword">
        <uni-icons type="clear" size="18" color="#999"></uni-icons>
      </view>
      
      <!-- 取消按钮 -->
      <view v-if="showCancel" class="cancel-btn" @click="onCancel">
        <text>取消</text>
      </view>
    </view>
    
    <!-- 热门搜索标签（可选） -->
    <view v-if="hotKeywords.length > 0 && !keyword" class="hot-search">
      <text class="hot-title">热门搜索</text>
      <view class="keyword-tags">
        <view
          v-for="(item, index) in hotKeywords"
          :key="index"
          class="keyword-tag"
          @click="selectHotKeyword(item)"
        >
          <text>{{ item }}</text>
        </view>
      </view>
    </view>
  </view>
</template>

<script>
export default {
  name: 'SearchBar',
  props: {
    // 初始值
    value: {
      type: String,
      default: ''
    },
    // 占位符
    placeholder: {
      type: String,
      default: '请输入搜索关键词'
    },
    // 是否显示清除按钮
    showClear: {
      type: Boolean,
      default: true
    },
    // 是否显示取消按钮
    showCancel: {
      type: Boolean,
      default: false
    },
    // 最大输入长度
    maxlength: {
      type: Number,
      default: 50
    },
    // 热门搜索关键词
    hotKeywords: {
      type: Array,
      default: () => []
    }
  },
  data() {
    return {
      keyword: this.value,
      isActive: false,
      isFocus: false
    };
  },
  watch: {
    value(newVal) {
      this.keyword = newVal;
    },
    keyword(newVal) {
      this.$emit('input', newVal);
      this.$emit('change', newVal);
    }
  },
  methods: {
    // 聚焦输入框
    onFocus() {
      this.isActive = true;
      this.isFocus = true;
      this.$emit('focus');
    },
    
    // 失焦输入框
    onBlur() {
      this.isActive = false;
      this.$emit('blur');
    },
    
    // 搜索确认
    onSearch() {
      const keyword = this.keyword.trim();
      if (keyword) {
        this.$emit('search', keyword);
      }
    },
    
    // 清除关键词
    clearKeyword() {
      this.keyword = '';
      this.$emit('clear');
    },
    
    // 点击取消
    onCancel() {
      this.keyword = '';
      this.isActive = false;
      this.isFocus = false;
      this.$emit('cancel');
    },
    
    // 点击搜索框
    focusInput() {
      this.isFocus = true;
    },
    
    // 选择热门关键词
    selectHotKeyword(keyword) {
      this.keyword = keyword;
      this.$emit('select-hot', keyword);
      this.$emit('search', keyword);
    }
  }
};
</script>

<style lang="scss" scoped>
.search-bar {
  width: 100%;
  padding: 15rpx 30rpx;
  box-sizing: border-box;
  background-color: #fff;
}

.search-container {
  display: flex;
  align-items: center;
  height: 70rpx;
  background-color: #f5f5f5;
  border-radius: 35rpx;
  padding: 0 20rpx;
  transition: all 0.3s;
  
  &.active {
    background-color: #fff;
    box-shadow: 0 0 10rpx rgba(0, 0, 0, 0.1);
  }
}

.search-icon {
  display: flex;
  align-items: center;
  justify-content: center;
  margin-right: 10rpx;
}

.search-input {
  flex: 1;
  height: 100%;
  font-size: 28rpx;
  color: #333;
  background-color: transparent;
  
  &::placeholder {
    color: #999;
    font-size: 26rpx;
  }
}

.clear-icon {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 40rpx;
  height: 40rpx;
  border-radius: 50%;
  background-color: #e0e0e0;
  margin-left: 10rpx;
}

.cancel-btn {
  margin-left: 20rpx;
  padding: 0 20rpx;
  
  text {
    font-size: 28rpx;
    color: #666;
  }
}

// 热门搜索
.hot-search {
  margin-top: 30rpx;
}

.hot-title {
  font-size: 26rpx;
  color: #999;
  margin-bottom: 20rpx;
  display: block;
}

.keyword-tags {
  display: flex;
  flex-wrap: wrap;
  gap: 20rpx;
}

.keyword-tag {
  padding: 10rpx 25rpx;
  background-color: #f5f5f5;
  border-radius: 30rpx;
  font-size: 26rpx;
  color: #666;
  
  &:active {
    background-color: #e0e0e0;
  }
}
</style>