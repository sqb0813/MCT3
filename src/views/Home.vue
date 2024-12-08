<template>
  <div class="home-container">
    <header class="home-header">
      <h1 class="home-title">猫晨工具箱</h1>
      <p class="home-subtitle">简单高效的在线工具集合</p>
    </header>

    <main class="home-main">
      <ModuleList />
    </main>
  </div>
</template>

<script setup>
import ModuleList from "../components/ModuleList.vue";
</script>

<style scoped>
.home-container {
  max-width: 1200px;
  margin: 0 auto;
  padding: 4rem 2rem;
}

.home-header {
  text-align: center;
  margin-bottom: 4rem;
}

.home-title {
  font-size: 3rem;
  font-weight: 700;
  background: var(--primary-gradient);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  margin-bottom: 1rem;
}

.home-subtitle {
  font-size: 1.2rem;
  color: var(--text-secondary);
}

.home-main {
  animation: fadeIn 0.6s ease-out;
}

@keyframes fadeIn {
  from {
    opacity: 0;
    transform: translateY(20px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}
</style>
