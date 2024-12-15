<template>
  <div class="module-list">
    <el-row :gutter="20">
      <!-- 图片工具入口 -->
      <el-col :span="12">
        <el-card class="module-card" @click="goToModule('image')">
          <el-icon><Picture /></el-icon>
          <h3>图片工具</h3>
          <p>提供图片压缩、格式转换等多种图片处理功能</p>
        </el-card>
      </el-col>

      <!-- AI恋爱预测系统 -->
      <el-col :span="12">
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
  display: flex;
  justify-content: center;
  gap: 2rem;
}

.module-card {
  cursor: pointer;
  text-align: center;
  padding: 2rem;
  transition: transform 0.3s;
  height: 250px;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
}

.module-card:hover {
  transform: translateY(-5px);
}

.module-card .el-icon {
  font-size: 3rem;
  color: var(--primary-color);
  margin-bottom: 1rem;
}

.module-card h3 {
  font-size: 1.5rem;
  margin: 1rem 0;
}

.module-card p {
  color: var(--text-secondary);
  margin: 0;
  line-height: 1.5;
}
</style>
