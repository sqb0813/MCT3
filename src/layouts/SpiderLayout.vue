<template>
  <div class="module-layout">
    <!-- 左侧导航 -->
    <div class="module-sidebar">
      <div class="sidebar-header">
        <el-button class="back-button" text @click="router.back()">
          <el-icon><ArrowLeft /></el-icon>
          返回
        </el-button>
        <h2 class="sidebar-title">爬虫工具</h2>
      </div>
      <el-menu
        :default-active="activeFunction"
        class="module-menu"
        @select="handleSelect"
      >
        <el-menu-item index="youtube">
          <el-icon><Download /></el-icon>
          <span>YouTube下载器</span>
        </el-menu-item>
      </el-menu>
    </div>

    <!-- 主内容区 -->
    <div class="module-content">
      <transition name="fade" mode="out-in">
        <component :is="currentComponent" />
      </transition>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, markRaw } from "vue";
import { useRouter } from "vue-router";
import { ArrowLeft, Download } from "@element-plus/icons-vue";
import YoutubeSpiderComponent from "../views/spider/YoutubeSpider.vue";

// 当前选中��功能
const activeFunction = ref("youtube");

// 组件映射表
const componentMap = {
  youtube: markRaw(YoutubeSpiderComponent),
};

// 当前显示的组件
const currentComponent = computed(() => componentMap[activeFunction.value]);

// 处理菜单选择
const handleSelect = (index) => {
  activeFunction.value = index;
};

const router = useRouter();
</script>

<style scoped>
.module-layout {
  display: flex;
  min-height: calc(100vh - 60px);
  background-color: #f5f7fa;
}

.module-sidebar {
  width: 260px;
  background: #ffffff;
  border-right: 1px solid #e6e6e6;
  padding: 2rem 0;
}

.sidebar-header {
  display: flex;
  align-items: center;
  padding: 0 20px;
  margin-bottom: 20px;
}

.back-button {
  margin-right: 10px;
  font-size: 14px;
}

.back-button :deep(.el-icon) {
  margin-right: 4px;
}

.sidebar-title {
  margin: 0;
  font-size: 18px;
  color: var(--primary-color);
}

.module-menu {
  border-right: none;
}

.module-menu :deep(.el-menu-item) {
  height: 50px;
  line-height: 50px;
  margin: 4px 0;
}

.module-menu :deep(.el-menu-item.is-active) {
  background: rgba(52, 199, 89, 0.1);
  color: #34c759;
}

.module-content {
  flex: 1;
  padding: 2rem;
  background: #ffffff;
}

.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.3s ease;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}
</style>
