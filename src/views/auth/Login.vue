<template>
  <div class="login-container">
    <el-card class="login-card">
      <template #header>
        <h2>登录</h2>
      </template>

      <el-form
        ref="loginForm"
        :model="loginForm"
        :rules="rules"
        label-position="top"
      >
        <el-form-item label="账号" prop="account">
          <el-input
            v-model="loginForm.account"
            placeholder="请输入手机号/邮箱"
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
          <el-link type="primary" @click="forgotPassword">忘记密码?</el-link>
        </div>

        <el-button type="primary" class="login-btn" @click="handleLogin">
          登录
        </el-button>

        <div class="third-party-login">
          <p class="divider">其他登录方式</p>
          <div class="login-icons">
            <el-button circle @click="thirdPartyLogin('wechat')">
              <el-icon><WechatFilled /></el-icon>
            </el-button>
            <el-button circle @click="thirdPartyLogin('qq')">
              <el-icon><QqFilled /></el-icon>
            </el-button>
          </div>
        </div>

        <div class="register-link">
          还没有账号?
          <el-link type="primary" @click="goToRegister">立即注册</el-link>
        </div>
      </el-form>
    </el-card>
  </div>
</template>

<script setup>
import { ref, reactive } from "vue";
import { useRouter } from "vue-router";
import { useUserStore } from "@/stores/user";
import { ElMessage } from "element-plus";

const router = useRouter();
const userStore = useUserStore();

// 表单数据
const loginForm = reactive({
  account: "",
  password: "",
});

// 表单验证规则
const rules = {
  account: [{ required: true, message: "请输入账号", trigger: "blur" }],
  password: [
    { required: true, message: "请输入密码", trigger: "blur" },
    { min: 6, message: "密码长度不能小于6位", trigger: "blur" },
  ],
};

const rememberMe = ref(false);

// 处理登录
const handleLogin = async () => {
  try {
    await userStore.login(loginForm);
    ElMessage.success("登录成功");
    router.push("/");
  } catch (error) {
    ElMessage.error(error.message || "登录失败");
  }
};

// 第三方登录
const thirdPartyLogin = (type) => {
  // 实现第三方登录逻辑
};

// 跳转到注册页
const goToRegister = () => {
  router.push("/register");
};

// 忘记密码
const forgotPassword = () => {
  router.push("/forgot-password");
};
</script>

<style scoped>
.login-container {
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: 100vh;
  background-color: #f5f7fa;
}

.login-card {
  width: 400px;
}

.login-btn {
  width: 100%;
  margin-top: 20px;
}

.login-options {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin: 10px 0;
}

.third-party-login {
  margin-top: 30px;
  text-align: center;
}

.divider {
  color: #909399;
  margin: 20px 0;
}

.login-icons {
  display: flex;
  justify-content: center;
  gap: 20px;
}

.register-link {
  margin-top: 20px;
  text-align: center;
}
</style>
