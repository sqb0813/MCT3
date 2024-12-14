<template>
  <div class="ai-love-layout">
    <!-- 左侧导航 -->
    <div class="ai-love-sidebar">
      <h2 class="sidebar-title">AI 恋爱预测</h2>
      <el-menu
        :default-active="activeFunction"
        class="ai-love-menu"
        @select="handleSelect"
      >
        <el-menu-item index="">
          <el-icon><HomeFilled /></el-icon>
          <span>首页</span>
        </el-menu-item>
        <el-menu-item index="test">
          <el-icon><Edit /></el-icon>
          <span>开始测试</span>
        </el-menu-item>
        <el-menu-item index="history">
          <el-icon><List /></el-icon>
          <span>历史记录</span>
        </el-menu-item>
        <el-menu-item index="community">
          <el-icon><ChatDotRound /></el-icon>
          <span>社区讨论</span>
        </el-menu-item>
      </el-menu>
    </div>

    <!-- 主内容区 -->
    <div class="ai-love-content">
      <router-view></router-view>
    </div>
  </div>
</template>

<script setup>
import { ref, computed } from "vue";
import { useRoute, useRouter } from "vue-router";
import { HomeFilled, Edit, List, ChatDotRound } from "@element-plus/icons-vue";

const route = useRoute();
const router = useRouter();

// 当前激活的菜单项
const activeFunction = computed(() => {
  const path = route.path;
  return path.split("/").pop();
});

// 处理菜单选择
const handleSelect = (index) => {
  router.push(`/ai-love/${index}`);
};
</script>

<style scoped>
.ai-love-layout {
  display: flex;
  min-height: calc(100vh - 60px);
  background-color: var(--background-color);
}

.ai-love-sidebar {
  width: 240px;
  background: var(--card-background);
  border-right: 1px solid #eee;
  padding: 20px 0;
}

.sidebar-title {
  padding: 0 20px;
  margin-bottom: 20px;
  font-size: 18px;
  color: var(--love-primary);
}

.ai-love-menu {
  border-right: none;
}

.ai-love-content {
  flex: 1;
  padding: 20px;
  overflow-y: auto;
}

/* 适配移动端 */
@media (max-width: 768px) {
  .ai-love-layout {
    flex-direction: column;
  }

  .ai-love-sidebar {
    width: 100%;
    border-right: none;
    border-bottom: 1px solid #eee;
  }
}
</style>
