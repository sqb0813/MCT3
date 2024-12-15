<template>
  <div class="image-home">
    <header class="page-header">
      <h1>图片工具</h1>
      <p class="subtitle">专业的在线图片处理工具集</p>
    </header>

    <div class="tools-grid">
      <el-card
        v-for="tool in tools"
        :key="tool.path"
        class="tool-card"
        @click="goToTool(tool.path)"
      >
        <el-icon class="tool-icon">
          <component :is="tool.icon" />
        </el-icon>
        <h3>{{ tool.name }}</h3>
        <p>{{ tool.description }}</p>
      </el-card>
    </div>
  </div>
</template>

<script setup>
import { useRouter } from "vue-router";
import {
  Picture,
  PictureRounded,
  Stamp,
  MagicStick,
  Brush,
} from "@element-plus/icons-vue";

const router = useRouter();

const tools = [
  {
    name: "图片压缩",
    path: "compress",
    icon: Picture,
    description: "智能压缩图片大小，保持最佳画质",
  },
  {
    name: "格式转换",
    path: "convert",
    icon: PictureRounded,
    description: "支持多种图片格式之间的转换",
  },
  {
    name: "添加水印",
    path: "watermark",
    icon: Stamp,
    description: "为图片添加文字或图片水印",
  },
  {
    name: "图片模糊",
    path: "blur",
    icon: MagicStick,
    description: "智能模糊处理敏感图片区域",
  },
  {
    name: "灰度处理",
    path: "grayScale",
    icon: Brush,
    description: "将图片转换为灰度模式",
  },
];

const goToTool = (path) => {
  router.push(`/image/${path}`);
};
</script>

<style scoped>
.image-home {
  max-width: 1200px;
  margin: 0 auto;
  padding: 2rem;
}

.page-header {
  text-align: center;
  margin-bottom: 3rem;
}

.page-header h1 {
  font-size: 2.5rem;
  color: var(--primary-color);
  margin-bottom: 1rem;
}

.subtitle {
  font-size: 1.2rem;
  color: var(--text-secondary);
}

.tools-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: 2rem;
}

.tool-card {
  cursor: pointer;
  text-align: center;
  padding: 2rem;
  transition: transform 0.3s, box-shadow 0.3s;
}

.tool-card:hover {
  transform: translateY(-5px);
  box-shadow: var(--shadow-md);
}

.tool-icon {
  font-size: 3rem;
  color: var(--primary-color);
  margin-bottom: 1rem;
}

.tool-card h3 {
  font-size: 1.5rem;
  margin-bottom: 0.5rem;
  color: var(--text-primary);
}

.tool-card p {
  color: var(--text-secondary);
}

@media (max-width: 768px) {
  .image-home {
    padding: 1rem;
  }

  .tools-grid {
    grid-template-columns: 1fr;
  }
}
</style>
