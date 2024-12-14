<template>
  <div class="ai-love-container">
    <!-- Hero Section -->
    <section class="hero-section">
      <div class="hero-content">
        <h1 class="hero-title">AI 智能情感分析，助你找到真爱</h1>
        <p class="hero-subtitle">基于深度学习的匹配算法，准确率达 95%</p>
        <div class="hero-buttons">
          <el-button type="primary" size="large" @click="startTest"
            >开始测试</el-button
          >
          <el-button size="large" @click="learnMore">了解更多</el-button>
        </div>
      </div>
      <div class="hero-image">
        <img src="@/assets/images/couple.svg" alt="情侣剪影" />
      </div>
    </section>

    <!-- 功能特点 -->
    <section class="features-section">
      <h2>为什么选择我们</h2>
      <div class="features-grid">
        <div class="feature-card">
          <el-icon><DataLine /></el-icon>
          <h3>AI 智能算法</h3>
          <p>基于机器学习的智能匹配系统</p>
        </div>
        <div class="feature-card">
          <el-icon><Lock /></el-icon>
          <h3>隐私保护</h3>
          <p>严格的数据加密和隐私保护机制</p>
        </div>
        <div class="feature-card">
          <el-icon><ChatDotRound /></el-icon>
          <h3>专业建议</h3>
          <p>提供个性化的情感咨询和建议</p>
        </div>
      </div>
    </section>
  </div>
</template>

<script setup>
import { useRouter } from "vue-router";
import { DataLine, Lock, ChatDotRound } from "@element-plus/icons-vue";

const router = useRouter();

const startTest = () => {
  router.push("/ai-love/test");
};

const learnMore = () => {
  // 滚动到功能特点部分
  document
    .querySelector(".features-section")
    .scrollIntoView({ behavior: "smooth" });
};
</script>

<style scoped>
.ai-love-container {
  max-width: 1200px;
  margin: 0 auto;
  padding: 20px;
}

.hero-section {
  display: flex;
  align-items: center;
  gap: 40px;
  margin: 40px 0;
}

.hero-content {
  flex: 1;
}

.hero-title {
  font-size: 2.5rem;
  color: var(--love-primary);
  margin-bottom: 1rem;
}

.hero-subtitle {
  font-size: 1.2rem;
  color: var(--text-secondary);
  margin-bottom: 2rem;
}

.hero-buttons {
  display: flex;
  gap: 1rem;
}

.hero-image {
  flex: 1;
  max-width: 500px;
}

.hero-image img {
  width: 100%;
  height: auto;
}

.features-section {
  padding: 60px 0;
  text-align: center;
}

.features-section h2 {
  font-size: 2rem;
  margin-bottom: 40px;
  color: var(--love-primary);
}

.features-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: 30px;
}

.feature-card {
  padding: 30px;
  background: var(--card-background);
  border-radius: var(--border-radius);
  box-shadow: var(--shadow-sm);
  transition: transform 0.3s;
}

.feature-card:hover {
  transform: translateY(-5px);
}

.feature-card .el-icon {
  font-size: 2.5rem;
  color: var(--love-primary);
  margin-bottom: 1rem;
}

.feature-card h3 {
  font-size: 1.2rem;
  margin-bottom: 0.5rem;
}

.feature-card p {
  color: var(--text-secondary);
}

/* 响应式设计 */
@media (max-width: 768px) {
  .hero-section {
    flex-direction: column;
    text-align: center;
  }

  .hero-buttons {
    justify-content: center;
  }

  .hero-title {
    font-size: 2rem;
  }
}
</style>
