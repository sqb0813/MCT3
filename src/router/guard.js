import router from "./index";
import { useUserStore } from "@/stores/userStore";
import { ElMessage } from "element-plus";

// 需要登录才能访问的路由
const authRoutes = [
  "/ai-love/history",
  "/ai-love/community",
  "/ai-love/result",
];

// 全局前置守卫
router.beforeEach(async (to, from, next) => {
  const userStore = useUserStore();

  // 如果有token但没有用户信息,获取用户信息
  if (userStore.token && !userStore.userInfo) {
    await userStore.getUserInfo();
  }

  // 检查是否需要登录
  if (authRoutes.includes(to.path)) {
    if (!userStore.isLoggedIn) {
      ElMessage.warning("请先登录");
      next({
        path: "/ai-love/login",
        query: { redirect: to.fullPath },
      });
      return;
    }
  }

  // 已登录用户不能访问登录注册页
  if (["/ai-love/login", "/ai-love/register"].includes(to.path)) {
    if (userStore.isLoggedIn) {
      next("/ai-love");
      return;
    }
  }

  next();
});

export default router; 