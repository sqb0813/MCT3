<template>
  <div class="module-grid">
    <ModuleCard
      v-for="module in modules"
      :key="module.path"
      :to="module.path"
      :icon="module.icon"
      :title="module.title"
      :description="module.description"
    />
  </div>
</template>

<script setup>
import { ref } from "vue";
import ModuleCard from "./ModuleCard.vue";
import { Picture, Cellphone } from "@element-plus/icons-vue";

const modules = ref([
  {
    path: "/image",
    icon: Picture,
    title: "图片工具",
    description: "图片压缩、格式转换、水印添加等",
  },
  // AI恋爱/婚姻契合度预测
  {
    path: "/ai-love",
    icon: Cellphone,
    title: "AI恋爱/婚姻契合度预测",
    description: "AI恋爱/婚姻契合度预测",
  },
  // 后续可以添加更多模块
  // {
  //   path: "/document",
  //   icon: "Document",
  //   title: "文档工具",
  //   description: "PDF转换、文档压缩、OCR识别等",
  // },
  // {
  //   path: "/video",
  //   icon: "VideoPlay",
  //   title: "视频工具",
  //   description: "视频压缩、格式转换、剪辑等",
  // },
]);
</script>

<style scoped>
.module-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
  gap: 2rem;
  padding: 1rem;
}
</style>
