import { defineStore } from "pinia";
import { ref } from "vue";
import { ElMessage } from "element-plus";

export const useUserStore = defineStore("user", () => {
  // 状态
  const token = ref(localStorage.getItem("token") || "");
  const userInfo = ref(null);
  const isLoggedIn = ref(false);

  // 登录
  const login = async (loginForm) => {
    try {
      // TODO: 调用登录API
      const response = {
        token: "mock_token",
        user: {
          id: 1,
          username: "测试用户",
          avatar: "",
        },
      };

      token.value = response.token;
      userInfo.value = response.user;
      isLoggedIn.value = true;

      // 保存token到本地存储
      localStorage.setItem("token", response.token);
    } catch (error) {
      ElMessage.error(error.message || "登录失败");
      throw error;
    }
  };

  // 登出
  const logout = () => {
    token.value = "";
    userInfo.value = null;
    isLoggedIn.value = false;
    localStorage.removeItem("token");
  };

  // 获取用户信息
  const getUserInfo = async () => {
    try {
      if (!token.value) return;
      // TODO: 调用获取用户信息API
      const response = {
        user: {
          id: 1,
          username: "测试用户",
          avatar: "",
        },
      };
      userInfo.value = response.user;
      isLoggedIn.value = true;
    } catch (error) {
      ElMessage.error(error.message || "获取用户信息失败");
    }
  };

  return {
    token,
    userInfo,
    isLoggedIn,
    login,
    logout,
    getUserInfo,
  };
}); 