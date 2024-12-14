<template>
  <div class="expert-detail-container">
    <el-card class="expert-profile">
      <div class="expert-header">
        <div class="expert-avatar">
          <img :src="expert.avatar" :alt="expert.name" />
        </div>
        <div class="expert-info">
          <h1 class="expert-name">{{ expert.name }}</h1>
          <p class="expert-title">{{ expert.title }}</p>
          <div class="expert-tags">
            <el-tag v-for="tag in expert.tags" :key="tag" size="small">
              {{ tag }}
            </el-tag>
          </div>
        </div>
      </div>

      <div class="expert-content">
        <h2>专业背景</h2>
        <p>{{ expert.background }}</p>

        <h2>擅长领域</h2>
        <ul>
          <li v-for="skill in expert.skills" :key="skill">{{ skill }}</li>
        </ul>

        <h2>咨询价格</h2>
        <div class="price-cards">
          <el-card v-for="price in expert.prices" :key="price.type">
            <h3>{{ price.type }}</h3>
            <p class="price">¥{{ price.amount }}/次</p>
            <p class="duration">{{ price.duration }}分���</p>
            <el-button type="primary" @click="bookConsultation(price)">
              立即预约
            </el-button>
          </el-card>
        </div>
      </div>
    </el-card>

    <el-card class="consultation-schedule">
      <h2>咨询时间表</h2>
      <el-calendar v-model="currentDate">
        <template #dateCell="{ data }">
          <div class="calendar-cell">
            <p>{{ data.day.split("-").slice(2).join("") }}</p>
            <p class="available-slots" v-if="getAvailableSlots(data.day)">
              {{ getAvailableSlots(data.day) }}个可用
            </p>
          </div>
        </template>
      </el-calendar>
    </el-card>
  </div>
</template>

<script setup>
import { ref, onMounted } from "vue";
import { useRoute } from "vue-router";

const route = useRoute();
const currentDate = ref(new Date());

// 模拟专家数据
const expert = ref({
  id: route.params.id,
  name: "张教授",
  title: "资深心理咨询师",
  avatar: "/avatars/expert1.jpg",
  tags: ["婚恋心理", "情感修复", "人格测评"],
  background: "从事心理咨询20年，具有丰富的婚恋咨询经验...",
  skills: ["婚恋关系咨询", "情感危机干预", "人格特征分析", "伴侣沟通指导"],
  prices: [
    { type: "单次咨询", amount: 500, duration: 60 },
    { type: "连续3次", amount: 1200, duration: 60 },
    { type: "月度套餐", amount: 2000, duration: 60 },
  ],
});

// 获取可用时间槽
const getAvailableSlots = (day) => {
  // 模拟数据，实际应该从后端获取
  return Math.floor(Math.random() * 5);
};

// 预约咨询
const bookConsultation = (price) => {
  // 实现预约逻辑
  console.log("预约咨询", price);
};
</script>

<style scoped>
.expert-detail-container {
  max-width: 1200px;
  margin: 2rem auto;
  padding: 0 1rem;
  display: grid;
  gap: 2rem;
  grid-template-columns: 2fr 1fr;
}

.expert-header {
  display: flex;
  gap: 2rem;
  margin-bottom: 2rem;
}

.expert-avatar {
  width: 200px;
  height: 200px;
  border-radius: 50%;
  overflow: hidden;
}

.expert-avatar img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.expert-info {
  flex: 1;
}

.expert-name {
  font-size: 2rem;
  margin-bottom: 0.5rem;
}

.expert-title {
  color: var(--text-secondary);
  margin-bottom: 1rem;
}

.expert-tags {
  display: flex;
  gap: 0.5rem;
  flex-wrap: wrap;
}

.expert-content h2 {
  margin: 2rem 0 1rem;
  font-size: 1.5rem;
}

.price-cards {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 1rem;
  margin-top: 1rem;
}

.price {
  font-size: 1.5rem;
  color: var(--love-primary);
  font-weight: bold;
  margin: 1rem 0;
}

.duration {
  color: var(--text-secondary);
  margin-bottom: 1rem;
}

.calendar-cell {
  text-align: center;
}

.available-slots {
  font-size: 0.8rem;
  color: var(--love-primary);
}

@media (max-width: 768px) {
  .expert-detail-container {
    grid-template-columns: 1fr;
  }

  .expert-header {
    flex-direction: column;
    align-items: center;
    text-align: center;
  }

  .expert-avatar {
    width: 150px;
    height: 150px;
  }
}
</style>
