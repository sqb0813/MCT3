<template>
  <div class="register-container">
    <el-card class="register-card">
      <template #header>
        <div class="card-header">
          <h2>注册账号</h2>
        </div>
      </template>

      <el-form
        ref="registerFormRef"
        :model="registerForm"
        :rules="registerRules"
        label-position="top"
      >
        <el-form-item label="邮箱" prop="email">
          <el-input v-model="registerForm.email" placeholder="请输入邮箱" />
        </el-form-item>

        <el-form-item label="手机号" prop="phone">
          <el-input v-model="registerForm.phone" placeholder="请输入手机号">
            <template #append>
              <el-button :disabled="!!countdown" @click="sendVerificationCode">
                {{ countdown ? `${countdown}s` : "获取验证码" }}
              </el-button>
            </template>
          </el-input>
        </el-form-item>

        <el-form-item label="验证码" prop="verificationCode">
          <el-input
            v-model="registerForm.verificationCode"
            placeholder="请输入验证码"
          />
        </el-form-item>

        <el-form-item label="密码" prop="password">
          <el-input
            v-model="registerForm.password"
            type="password"
            placeholder="请设置密码"
            show-password
          />
        </el-form-item>

        <el-form-item label="确认密码" prop="confirmPassword">
          <el-input
            v-model="registerForm.confirmPassword"
            type="password"
            placeholder="请确认密码"
            show-password
          />
        </el-form-item>

        <el-form-item>
          <el-checkbox v-model="registerForm.agreement">
            我已阅读并同意
            <el-button link type="primary" @click="showAgreement">
              用户协议
            </el-button>
            和
            <el-button link type="primary" @click="showPrivacy">
              隐私政策
            </el-button>
          </el-checkbox>
        </el-form-item>

        <el-button
          type="primary"
          class="register-btn"
          :loading="loading"
          @click="handleRegister"
        >
          注册
        </el-button>

        <div class="login-link">
          已有账号？
          <el-button link type="primary" @click="goToLogin">立即登录</el-button>
        </div>
      </el-form>
    </el-card>
  </div>
</template>

<script setup>
import { ref, reactive } from "vue";
import { useRouter } from "vue-router";
import { ElMessage } from "element-plus";

const router = useRouter();
const registerFormRef = ref(null);
const loading = ref(false);
const countdown = ref(0);

// 注册表单数据
const registerForm = reactive({
  email: "",
  phone: "",
  verificationCode: "",
  password: "",
  confirmPassword: "",
  agreement: false,
});

// 表单验证规则
const registerRules = {
  email: [
    { required: true, message: "请输入邮箱", trigger: "blur" },
    { type: "email", message: "请输入正确的邮箱格式", trigger: "blur" },
  ],
  phone: [
    { required: true, message: "请输入手机号", trigger: "blur" },
    {
      pattern: /^1[3-9]\d{9}$/,
      message: "请输入正确的手机号",
      trigger: "blur",
    },
  ],
  verificationCode: [
    { required: true, message: "请输入验证码", trigger: "blur" },
    { len: 6, message: "验证码为6位数字", trigger: "blur" },
  ],
  password: [
    { required: true, message: "请设置密码", trigger: "blur" },
    { min: 6, message: "密码不能少于6个字符", trigger: "blur" },
  ],
  confirmPassword: [
    { required: true, message: "请确认密码", trigger: "blur" },
    {
      validator: (rule, value, callback) => {
        if (value !== registerForm.password) {
          callback(new Error("两次输入的密码不一致"));
        } else {
          callback();
        }
      },
      trigger: "blur",
    },
  ],
  agreement: [
    {
      validator: (rule, value, callback) => {
        if (!value) {
          callback(new Error("请阅读并同意用户协议和隐私政策"));
        } else {
          callback();
        }
      },
      trigger: "change",
    },
  ],
};

// 发送验证码
const sendVerificationCode = async () => {
  try {
    await registerFormRef.value.validateField("phone");
    // TODO: 调用发送验证码API
    countdown.value = 60;
    const timer = setInterval(() => {
      countdown.value--;
      if (countdown.value <= 0) {
        clearInterval(timer);
      }
    }, 1000);
    ElMessage.success("验证码已发送");
  } catch (error) {
    ElMessage.error(error.message || "发送验证码失败");
  }
};

// 处理注册
const handleRegister = async () => {
  if (!registerFormRef.value) return;

  try {
    loading.value = true;
    await registerFormRef.value.validate();
    // TODO: 调用注册API
    ElMessage.success("注册成功");
    router.push("/ai-love/login");
  } catch (error) {
    ElMessage.error(error.message || "注册失败");
  } finally {
    loading.value = false;
  }
};

// 跳转到登录页
const goToLogin = () => {
  router.push("/ai-love/login");
};

// 显示用户协议
const showAgreement = () => {
  // TODO: 显示用户协议
};

// 显示隐私政策
const showPrivacy = () => {
  // TODO: 显示隐私政策
};
</script>

<style scoped>
.register-container {
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: calc(100vh - 120px);
  padding: 20px;
}

.register-card {
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

.register-btn {
  width: 100%;
  margin-top: 20px;
}

.login-link {
  margin-top: 20px;
  text-align: center;
}
</style>
