<template>
  <div class="login-container">
    <el-card class="login-card">
      <template #header>
        <div class="card-header">
          <h2>登录</h2>
        </div>
      </template>

      <el-form
        ref="loginFormRef"
        :model="loginForm"
        :rules="loginRules"
        label-position="top"
      >
        <el-form-item label="账号" prop="account">
          <el-input
            v-model="loginForm.account"
            placeholder="请输入邮箱或手机号"
          />
        </el-form-item>

        <el-form-item label="密码" prop="password">
          <el-input
            v-model="loginForm.password"
            type="password"
            placeholder="请输入密码"
            show-password
          />
        </el-form-item>

        <div class="login-options">
          <el-checkbox v-model="rememberMe">记住我</el-checkbox>
          <el-button link type="primary" @click="forgotPassword">
            忘记密码？
          </el-button>
        </div>

        <el-button
          type="primary"
          class="login-btn"
          :loading="loading"
          @click="handleLogin"
        >
          登录
        </el-button>

        <el-divider>或</el-divider>

        <div class="third-party-login">
          <el-button
            v-for="item in thirdPartyOptions"
            :key="item.type"
            :icon="item.icon"
            circle
            @click="thirdPartyLogin(item.type)"
          />
        </div>

        <div class="register-link">
          还没有账号？
          <el-button link type="primary" @click="goToRegister"
            >立即注册</el-button
          >
        </div>
      </el-form>
    </el-card>
  </div>
</template>

<script setup>
import { ref, reactive } from "vue";
import { useRouter } from "vue-router";
import { Apple } from "@element-plus/icons-vue";
import { useUserStore } from "@/stores/user";
import { ElMessage } from "element-plus";
import { userApi } from "@/api";

const router = useRouter();
const loginFormRef = ref(null);
const loading = ref(false);
const rememberMe = ref(false);
const userStore = useUserStore();

// 登录表单数据
const loginForm = reactive({
  account: "",
  password: "",
});

// 表单验证规则
const loginRules = {
  account: [{ required: true, message: "请输入账号", trigger: "blur" }],
  password: [
    { required: true, message: "请输入密码", trigger: "blur" },
    { min: 6, message: "密码不能少于6个字符", trigger: "blur" },
  ],
};

// 第三方登录选项
const thirdPartyOptions = [
  { type: "Apple", icon: Apple },
  { type: "apple", icon: Apple },
  { type: "Apple", icon: Apple },
];

// 处理登录
const handleLogin = async () => {
  if (!loginFormRef.value) return;

  try {
    loading.value = true;
    await loginFormRef.value.validate();
    const { data } = await userApi.login(loginForm);

    // 保存登录状态
    userStore.setToken(data.token);
    userStore.setUserInfo(data.userInfo);

    ElMessage.success("登录成功");
    router.push("/ai-love");
  } catch (error) {
    ElMessage.error(error.message || "登录失败");
  } finally {
    loading.value = false;
  }
};

// 第三方登录
const thirdPartyLogin = (type) => {
  // TODO: 实现第三方登录
  console.log("第三方登录:", type);
};

// 跳转到注册页
const goToRegister = () => {
  router.push("/ai-love/register");
};

// 忘记密码
const forgotPassword = () => {
  // TODO: 实现忘记密码功能
  console.log("忘记密码");
};
</script>

<style scoped>
.login-container {
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: calc(100vh - 120px);
  padding: 20px;
}

.login-card {
  width: 100%;
  max-width: 400px;
}

.card-header {
  text-align: center;
}

.card-header h2 {
  margin: 0;
  font-size: 24px;
  color: var(--love-primary);
}

.login-options {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin: 10px 0;
}

.login-btn {
  width: 100%;
  margin-top: 20px;
}

.third-party-login {
  display: flex;
  justify-content: center;
  gap: 20px;
  margin-top: 20px;
}

.register-link {
  margin-top: 20px;
  text-align: center;
}
</style>
