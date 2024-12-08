<template>
  <div class="module-layout">
    <!-- 左侧导航 -->
    <div class="module-sidebar">
      <h2 class="sidebar-title">图片工具</h2>
      <el-menu
        :default-active="activeFunction"
        class="module-menu"
        @select="handleSelect"
      >
        <el-menu-item index="compress">
          <el-icon><Picture /></el-icon>
          <span>图片压缩</span>
        </el-menu-item>
        <el-menu-item index="batch-compress">
          <el-icon><Files /></el-icon>
          <span>批量压缩</span>
        </el-menu-item>
        <el-menu-item index="convert">
          <el-icon><RefreshRight /></el-icon>
          <span>格式转换</span>
        </el-menu-item>
      </el-menu>
    </div>

    <!-- 主内容区 -->
    <div class="module-content">
      <!-- 使用动态组件替代路由视图 -->
      <transition name="fade" mode="out-in">
        <component :is="currentComponent" />
      </transition>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, markRaw } from "vue";
import { Picture, RefreshRight, Files } from "@element-plus/icons-vue";
import CompressComponent from "../views/image/Compress.vue";
import BatchCompressComponent from "../views/image/BatchCompress.vue";
// import ConvertComponent from "../views/image/Convert.vue";

// 当前选中的功能
const activeFunction = ref("compress");

// 组件映射表
const componentMap = {
  compress: markRaw(CompressComponent),
  "batch-compress": markRaw(BatchCompressComponent),
  // convert: markRaw(ConvertComponent),
};

// 当前显示的组件
const currentComponent = computed(() => componentMap[activeFunction.value]);

// 处理菜单选择
const handleSelect = (index) => {
  activeFunction.value = index;
};
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

.sidebar-title {
  padding: 0 1.5rem;
  margin-bottom: 1.5rem;
  font-size: 1.25rem;
  color: #333333;
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
