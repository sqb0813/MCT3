<template>
  <div class="module-layout">
    <!-- 左侧导航 -->
    <div class="module-sidebar">
      <div class="sidebar-header">
        <el-button class="back-button" text @click="router.back()">
          <el-icon><ArrowLeft /></el-icon>
          返回
        </el-button>
        <h2 class="sidebar-title">图片工具</h2>
      </div>
      <el-menu
        :default-active="activeFunction"
        class="module-menu"
        @select="handleSelect"
      >
        <el-menu-item index="compress">
          <el-icon><Picture /></el-icon>
          <span>图片压缩</span>
        </el-menu-item>
        <el-menu-item index="convert">
          <el-icon><PictureRounded /></el-icon>
          <span>格式转换</span>
        </el-menu-item>
        <el-menu-item index="watermark">
          <el-icon><Stamp /></el-icon>
          <span>图片加水印</span>
        </el-menu-item>
        <el-menu-item index="blur">
          <el-icon><MagicStick /></el-icon>
          <span>图片模糊化</span>
        </el-menu-item>
        <el-menu-item index="grayScale">
          <el-icon><Brush /></el-icon>
          <span>图片转灰度</span>
        </el-menu-item>
        <el-menu-item index="blackOrWhite">
          <el-icon><Camera /></el-icon>
          <span>图片转黑白</span>
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
import { useRouter } from "vue-router";
import {
  Picture,
  PictureRounded,
  Stamp,
  MagicStick,
  Brush,
  ArrowLeft,
  Camera,
} from "@element-plus/icons-vue";
import CompressComponent from "../views/image/Compress.vue";
import ConvertComponent from "../views/image/Convert.vue";
import WatermarkComponent from "../views/image/Watermark.vue";
import ImageBlurComponent from "../views/image/ImageBlur.vue";
import ImageGrayScaleComponent from "../views/image/ImageToGrayScale.vue";
import ImageBlackOrWhiteComponent from "../views/image/BlackOrWhite.vue";
// 当前选中的功能
const activeFunction = ref("compress");

// 组件映射表
const componentMap = {
  compress: markRaw(CompressComponent),
  convert: markRaw(ConvertComponent),
  watermark: markRaw(WatermarkComponent),
  blur: markRaw(ImageBlurComponent),
  grayScale: markRaw(ImageGrayScaleComponent),
  blackOrWhite: markRaw(ImageBlackOrWhiteComponent),
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
