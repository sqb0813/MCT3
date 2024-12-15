<template>
  <div class="ai-love-container">
    <!-- Hero Section -->
    <section class="hero-section">
      <div class="hero-content">
        <h1 class="hero-title">AI 智能情感分析，助你找到真爱</h1>
        <p class="hero-subtitle">基于深度学习的匹配算法，准确率达 95%</p>
        <div class="hero-buttons">
          <el-button type="primary" size="large" @click="startTest">
            立即开始测试
          </el-button>
          <el-button size="large" @click="learnMore">了解更多</el-button>
        </div>
      </div>
      <div class="hero-image">
        <img src="@/assets/images/couple.svg" alt="情侣剪影" />
      </div>
    </section>

    <!-- 数据统计 -->
    <section class="stats-section">
      <div class="stats-grid">
        <div class="stat-item">
          <h3>100,000+</h3>
          <p>累计用户</p>
        </div>
        <div class="stat-item">
          <h3>50,000+</h3>
          <p>成功案例</p>
        </div>
        <div class="stat-item">
          <h3>95%</h3>
          <p>匹配准确率</p>
        </div>
        <div class="stat-item">
          <h3>50+</h3>
          <p>专家团队</p>
        </div>
      </div>
    </section>

    <!-- 功能特点 -->
    <section class="features-section">
      <h2>核心功能</h2>
      <div class="features-grid">
        <div class="feature-card" @click="navigateTo('/ai-love/test')">
          <el-icon><Edit /></el-icon>
          <h3>智能测试</h3>
          <p>快速评估契合度</p>
        </div>
        <div class="feature-card" @click="navigateTo('/ai-love/history')">
          <el-icon><List /></el-icon>
          <h3>历史记录</h3>
          <p>追踪感情发展</p>
        </div>
        <div class="feature-card" @click="navigateTo('/ai-love/community')">
          <el-icon><ChatDotRound /></el-icon>
          <h3>社区讨论</h3>
          <p>分享情感经历</p>
        </div>
      </div>
    </section>

    <!-- 成功案例 -->
    <section class="cases-section">
      <h2>成功案例</h2>
      <el-carousel :interval="4000" type="card">
        <el-carousel-item v-for="item in successCases" :key="item.id">
          <div class="case-card">
            <div class="case-avatar">
              <img :src="item.avatar" :alt="item.name" />
            </div>
            <h3>{{ item.name }}</h3>
            <p class="case-match">匹配度: {{ item.matchRate }}%</p>
            <p class="case-story">{{ item.story }}</p>
          </div>
        </el-carousel-item>
      </el-carousel>
    </section>
  </div>
</template>

<script setup>
import { ref } from "vue";
import { useRouter } from "vue-router";
import { Edit, List, ChatDotRound } from "@element-plus/icons-vue";

const router = useRouter();

// 开始测试
const startTest = () => {
  router.push("/ai-love/test");
};

// 导航到指定路由
const navigateTo = (path) => {
  router.push(path);
};

// 滚动到功能区
const learnMore = () => {
  document
    .querySelector(".features-section")
    .scrollIntoView({ behavior: "smooth" });
};

// 模拟成功案例数据
const successCases = ref([
  {
    id: 1,
    name: "小王 & 小李",
    avatar: "/images/couple1.jpg",
    matchRate: 95,
    story: "通过AI匹配发现我们在很多方面都很契合，现在已经在一起一年了。",
  },
  {
    id: 2,
    name: "张先生 & 李小姐",
    avatar: "/images/couple2.jpg",
    matchRate: 92,
    story: "AI的分析帮助我们更好地了解彼此，克服了很多沟通障碍。",
  },
  {
    id: 3,
    name: "陈先生 & 王小姐",
    avatar: "/images/couple3.jpg",
    matchRate: 88,
    story: "感谢这个平台让我们相遇，现在我们已经订婚了。",
  },
]);
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
  min-height: 500px;
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

.stats-section {
  padding: 60px 0;
  background: var(--background-light);
  border-radius: var(--border-radius);
  margin: 40px 0;
}

.stats-grid {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 30px;
  padding: 0 40px;
}

.stat-item {
  text-align: center;
}

.stat-item h3 {
  font-size: 2rem;
  color: var(--love-primary);
  margin-bottom: 0.5rem;
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
  grid-template-columns: repeat(3, 1fr);
  gap: 30px;
}

.feature-card {
  padding: 30px;
  background: var(--card-background);
  border-radius: var(--border-radius);
  box-shadow: var(--shadow-sm);
  transition: transform 0.3s;
  cursor: pointer;
}

.feature-card:hover {
  transform: translateY(-5px);
}

.feature-card .el-icon {
  font-size: 2.5rem;
  color: var(--love-primary);
  margin-bottom: 1rem;
}

.cases-section {
  padding: 60px 0;
}

.cases-section h2 {
  text-align: center;
  font-size: 2rem;
  margin-bottom: 40px;
  color: var(--love-primary);
}

.case-card {
  padding: 30px;
  background: white;
  border-radius: var(--border-radius);
  text-align: center;
  height: 100%;
}

.case-avatar {
  width: 100px;
  height: 100px;
  margin: 0 auto 20px;
  border-radius: 50%;
  overflow: hidden;
}

.case-avatar img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.case-match {
  color: var(--love-primary);
  font-weight: bold;
  margin: 10px 0;
}

.case-story {
  color: var(--text-secondary);
  line-height: 1.6;
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

  .stats-grid {
    grid-template-columns: repeat(2, 1fr);
  }

  .features-grid {
    grid-template-columns: 1fr;
  }
}
</style>
