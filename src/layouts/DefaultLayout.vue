<template>
  <div class="layout-container">
    <el-header class="layout-header">
      <div class="header-logo">
        <router-link to="/" class="logo-link">
          <h1>猫晨工具箱</h1>
        </router-link>
      </div>
    </el-header>

    <el-main class="layout-main">
      <router-view v-slot="{ Component }">
        <transition name="fade" mode="out-in">
          <component :is="Component" />
        </transition>
      </router-view>
    </el-main>
  </div>
</template>

<style scoped>
.layout-container {
  min-height: 100vh;
  background-color: var(--background-color);
}

.layout-header {
  background: rgba(255, 255, 255, 0.8);
  backdrop-filter: blur(10px);
  border-bottom: 1px solid rgba(0, 0, 0, 0.1);
  position: sticky;
  top: 0;
  z-index: 100;
}

.header-logo h1 {
  font-size: 1.5rem;
  font-weight: 600;
  background: var(--primary-gradient);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
}

.apple-menu {
  border: none;
  background: transparent;
}

.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.3s ease;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}

.logo-link {
  text-decoration: none;
}

.layout-main {
  padding: 0;
  background: var(--background-color);
}
</style>
