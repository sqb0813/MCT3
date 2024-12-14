<template>
  <router-link :to="to" class="module-card">
    <div class="card-icon">
      <el-icon><component :is="icon" /></el-icon>
    </div>
    <h3>{{ title }}</h3>
    <p>{{ description }}</p>
  </router-link>
</template>

<script setup>
defineProps({
  to: {
    type: String,
    required: true,
  },
  icon: {
    type: String,
    required: true,
  },
  title: {
    type: String,
    required: true,
  },
  description: {
    type: String,
    required: true,
  },
});
</script>

<style scoped>
.module-card {
  background: var(--card-background);
  border-radius: var(--border-radius);
  padding: 2rem;
  text-align: center;
  text-decoration: none;
  color: var(--text-primary);
  transition: all 0.3s ease;
  box-shadow: var(--shadow-sm);
}

.module-card:hover {
  transform: translateY(-4px);
  box-shadow: var(--shadow-lg);
}

.card-icon {
  width: 64px;
  height: 64px;
  margin: 0 auto 1.5rem;
  display: flex;
  align-items: center;
  justify-content: center;
  background: var(--background-color);
  border-radius: 16px;
}

.card-icon :deep(svg) {
  font-size: 45px;
  color: #34c759;
}

.el-icon :deep(svg) {
  font-size: 45px;
  color: #34c759;
}

h3 {
  font-size: 1.5rem;
  margin-bottom: 0.5rem;
}

p {
  color: var(--text-secondary);
  line-height: 1.5;
}
</style>
