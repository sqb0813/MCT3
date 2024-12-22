<template>
  <div class="module-list">
    <el-row :gutter="20">
      <!-- 图片工具入口 -->
      <el-col :xs="24" :sm="12">
        <el-card class="module-card" @click="goToModule('image')">
          <el-icon><Picture /></el-icon>
          <h3>图片工具</h3>
          <p>提供图片压缩、格式转换等多种图片处理功能</p>
        </el-card>
      </el-col>

      <!-- 爬虫模块入口 -->
      <el-col :xs="24" :sm="12">
        <el-card class="module-card" @click="goToModule('spider')">
          <el-icon><HomeFilled /></el-icon>
          <h3>爬虫模块</h3>
          <p>提供Youtube视频下载器、抖音/小红书爬虫下载等</p>
        </el-card>
      </el-col>

      <!-- AI恋爱预测系统 -->
      <el-col :xs="24" :sm="12">
        <el-card class="module-card" @click="goToModule('ai-love')">
          <el-icon><HomeFilled /></el-icon>
          <h3>AI恋爱预测系统</h3>
          <p>基于AI的智能情感分析与匹配系统</p>
        </el-card>
      </el-col>
    </el-row>
  </div>
</template>

<script setup>
import { useRouter } from "vue-router";
import { Picture, HomeFilled } from "@element-plus/icons-vue";

const router = useRouter();

const goToModule = (module) => {
  router.push(`/${module}`);
};
</script>

<style scoped>
.module-list {
  padding: 2rem;
  max-width: 1200px;
  margin: 0 auto;
}

.el-row {
  margin-bottom: 20px;
  display: flex;
  flex-wrap: wrap;
}

.el-col {
  margin-bottom: 20px;
}

.module-card {
  cursor: pointer;
  text-align: center;
  padding: 2rem;
  transition: all 0.3s ease;
  height: 250px;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  border-radius: 8px;
  box-shadow: 0 2px 12px 0 rgba(0, 0, 0, 0.1);
}

.module-card:hover {
  transform: translateY(-5px);
  box-shadow: 0 5px 15px rgba(0, 0, 0, 0.2);
}

.module-card .el-icon {
  font-size: 3rem;
  color: var(--primary-color);
  margin-bottom: 1rem;
}

.module-card h3 {
  font-size: 1.5rem;
  margin: 1rem 0;
  color: var(--text-primary);
}

.module-card p {
  color: var(--text-secondary);
  margin: 0;
  line-height: 1.5;
}

/* 响应式调整 */
@media screen and (max-width: 768px) {
  .module-list {
    padding: 1rem;
  }

  .module-card {
    height: 200px;
  }
}
</style>
