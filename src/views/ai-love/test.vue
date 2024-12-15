<template>
  <div class="test-container">
    <el-card class="test-card">
      <template #header>
        <div class="card-header">
          <h2>AI恋爱契合度测试</h2>
          <p class="subtitle">基于深度学习的智能匹配算法,准确率高达95%</p>
        </div>
      </template>

      <el-steps :active="activeStep" finish-status="success" class="test-steps">
        <el-step title="您的信息" />
        <el-step title="对方信息" />
        <el-step title="分析结果" />
      </el-steps>

      <!-- 第一步：填写自己的信息 -->
      <div v-if="activeStep === 0" class="step-content">
        <el-form
          ref="loginFormRef"
          :model="formData.person1"
          :rules="formRules"
          label-position="top"
        >
          <el-form-item label="姓名" prop="name">
            <el-input
              v-model="formData.person1.name"
              placeholder="请输入姓名"
            />
          </el-form-item>

          <el-form-item label="性别" prop="gender">
            <el-radio-group v-model="formData.person1.gender">
              <el-radio label="male">男</el-radio>
              <el-radio label="female">女</el-radio>
            </el-radio-group>
          </el-form-item>

          <el-form-item label="年龄" prop="age">
            <el-input-number
              v-model="formData.person1.age"
              :min="18"
              :max="100"
              placeholder="请输入年龄"
            />
          </el-form-item>

          <el-form-item label="性格特征(可多选)" prop="personality">
            <el-checkbox-group v-model="formData.person1.personality">
              <el-checkbox label="outgoing">外向开朗</el-checkbox>
              <el-checkbox label="introvert">内向安静</el-checkbox>
              <el-checkbox label="rational">理性稳重</el-checkbox>
              <el-checkbox label="emotional">感性浪漫</el-checkbox>
              <el-checkbox label="active">积极主动</el-checkbox>
              <el-checkbox label="careful">谨慎细心</el-checkbox>
            </el-checkbox-group>
          </el-form-item>

          <el-form-item label="兴趣爱好(可多选)" prop="hobbies">
            <el-checkbox-group v-model="formData.person1.hobbies">
              <el-checkbox label="sports">运动健身</el-checkbox>
              <el-checkbox label="reading">阅读写作</el-checkbox>
              <el-checkbox label="music">音乐艺术</el-checkbox>
              <el-checkbox label="travel">旅游探索</el-checkbox>
              <el-checkbox label="food">美食烹饪</el-checkbox>
              <el-checkbox label="games">游戏动漫</el-checkbox>
            </el-checkbox-group>
          </el-form-item>

          <el-form-item label="感情观" prop="values">
            <el-radio-group v-model="formData.person1.values">
              <el-radio label="traditional">传统稳定</el-radio>
              <el-radio label="modern">现代开放</el-radio>
              <el-radio label="neutral">中立包容</el-radio>
            </el-radio-group>
          </el-form-item>
        </el-form>

        <div class="step-buttons">
          <el-button type="primary" @click="nextStep">下一步</el-button>
        </div>
      </div>

      <!-- 第二步：填写对方信息 -->
      <div v-if="activeStep === 1" class="step-content">
        <el-form
          ref="person2FormRef"
          :model="formData.person2"
          :rules="formRules"
          label-position="top"
        >
          <el-form-item label="姓名" prop="name">
            <el-input
              v-model="formData.person2.name"
              placeholder="请输入姓名"
            />
          </el-form-item>

          <el-form-item label="性别" prop="gender">
            <el-radio-group v-model="formData.person2.gender">
              <el-radio label="male">男</el-radio>
              <el-radio label="female">女</el-radio>
            </el-radio-group>
          </el-form-item>

          <el-form-item label="年龄" prop="age">
            <el-input-number
              v-model="formData.person2.age"
              :min="18"
              :max="100"
              placeholder="请输入年龄"
            />
          </el-form-item>

          <el-form-item label="性格特征(可多选)" prop="personality">
            <el-checkbox-group v-model="formData.person2.personality">
              <el-checkbox label="outgoing">外向开朗</el-checkbox>
              <el-checkbox label="introvert">内向安静</el-checkbox>
              <el-checkbox label="rational">理性稳重</el-checkbox>
              <el-checkbox label="emotional">感性浪漫</el-checkbox>
              <el-checkbox label="active">积极主动</el-checkbox>
              <el-checkbox label="careful">谨慎细心</el-checkbox>
            </el-checkbox-group>
          </el-form-item>

          <el-form-item label="兴趣爱好(可多选)" prop="hobbies">
            <el-checkbox-group v-model="formData.person2.hobbies">
              <el-checkbox label="sports">运动健身</el-checkbox>
              <el-checkbox label="reading">阅读写作</el-checkbox>
              <el-checkbox label="music">音乐艺术</el-checkbox>
              <el-checkbox label="travel">旅游探索</el-checkbox>
              <el-checkbox label="food">美食烹饪</el-checkbox>
              <el-checkbox label="games">游戏动漫</el-checkbox>
            </el-checkbox-group>
          </el-form-item>

          <el-form-item label="感情观" prop="values">
            <el-radio-group v-model="formData.person2.values">
              <el-radio label="traditional">传统稳定</el-radio>
              <el-radio label="modern">现代开放</el-radio>
              <el-radio label="neutral">中立包容</el-radio>
            </el-radio-group>
          </el-form-item>
        </el-form>

        <div class="step-buttons">
          <el-button @click="prevStep">上一步</el-button>
          <el-button type="primary" @click="startAnalysis">开始分析</el-button>
        </div>
      </div>

      <!-- 第三步：分析中 -->
      <div v-if="activeStep === 2" class="step-content analyzing">
        <el-progress
          type="dashboard"
          :percentage="analyzeProgress"
          :stroke-width="8"
          :width="180"
          :show-text="false"
        >
          <template #default>
            <div class="progress-content">
              <span class="progress-text">{{ analyzeProgress }}%</span>
              <span class="progress-label">分析中...</span>
            </div>
          </template>
        </el-progress>
      </div>
    </el-card>
  </div>
</template>

<script setup>
import { ref, reactive } from "vue";
import { useRouter } from "vue-router";
import { ElMessage } from "element-plus";
import { userApi } from "@/api";

const router = useRouter();
const activeStep = ref(0);
const analyzeProgress = ref(0);

const loginFormRef = ref(null);
const person2FormRef = ref(null);

// 表单数据
const formData = reactive({
  person1: {
    name: "",
    gender: "",
    age: null,
    personality: [],
    hobbies: [],
    values: "",
  },
  person2: {
    name: "",
    gender: "",
    age: null,
    personality: [],
    hobbies: [],
    values: "",
  },
});

// 表单验证规则
const formRules = {
  name: [{ required: true, message: "请输入姓名", trigger: "blur" }],
  gender: [{ required: true, message: "请选择性别", trigger: "change" }],
  age: [{ required: true, message: "请输入年龄", trigger: "change" }],
  personality: [
    {
      type: "array",
      required: true,
      message: "请至少选择一个性格特征",
      trigger: "change",
    },
  ],
  hobbies: [
    {
      type: "array",
      required: true,
      message: "请至少选择一个兴趣爱好",
      trigger: "change",
    },
  ],
  values: [{ required: true, message: "请选择感情观", trigger: "change" }],
};

// 下一步
const nextStep = async () => {
  if (!loginFormRef.value) return;

  try {
    await loginFormRef.value.validate();
    activeStep.value++;
  } catch (error) {
    ElMessage.error("请完善所有必填信息");
  }
};

// 上一步
const prevStep = () => {
  activeStep.value--;
};

// 开始分析
const startAnalysis = async () => {
  if (!person2FormRef.value) return;

  try {
    await person2FormRef.value.validate();

    // 添加API调用
    const { data } = await userApi.submitTest(formData);

    activeStep.value++;
    simulateAnalysis();
  } catch (error) {
    ElMessage.error(error.message || "请完善所有必填信息");
  }
};

// 模拟分析过程
const simulateAnalysis = () => {
  let progress = 0;
  const timer = setInterval(() => {
    progress += 5;
    analyzeProgress.value = progress;
    if (progress >= 100) {
      clearInterval(timer);
      router.push({
        path: "/ai-love/result",
        query: { id: generateTestId() },
      });
    }
  }, 100);
};

// 生成测试ID
const generateTestId = () => {
  return "test_" + Date.now();
};
</script>

<style scoped>
.test-container {
  max-width: 800px;
  margin: 20px auto;
  padding: 20px;
}

.test-card {
  margin-bottom: 20px;
}

.card-header {
  text-align: center;
}

.card-header h2 {
  margin: 0;
  font-size: 24px;
  color: var(--love-primary);
}

.subtitle {
  margin: 10px 0 0;
  color: var(--text-secondary);
  font-size: 14px;
}

.test-steps {
  margin: 30px 0;
}

.step-content {
  animation: fadeIn 0.3s ease-out;
}

.step-buttons {
  display: flex;
  justify-content: space-between;
  margin-top: 30px;
  padding-top: 20px;
  border-top: 1px solid #eee;
}

.analyzing {
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 40px 0;
}

.progress-content {
  display: flex;
  flex-direction: column;
  align-items: center;
}

.progress-text {
  font-size: 24px;
  font-weight: bold;
  color: var(--love-primary);
}

.progress-label {
  margin-top: 5px;
  font-size: 14px;
  color: var(--text-secondary);
}

@keyframes fadeIn {
  from {
    opacity: 0;
    transform: translateY(10px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}
</style>
