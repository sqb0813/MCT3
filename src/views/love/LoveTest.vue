<template>
  <div class="test-container">
    <el-steps :active="currentStep" finish-status="success" class="test-steps">
      <el-step title="基础信息" />
      <el-step title="性格测评" />
      <el-step title="生活习惯" />
      <el-step title="感情观" />
    </el-steps>

    <div class="test-content">
      <el-form
        ref="testForm"
        :model="formData"
        :rules="rules"
        label-position="top"
      >
        <!-- 基础信息 -->
        <div v-show="currentStep === 0" class="step-content">
          <h2>基础信息</h2>
          <el-form-item label="姓名" prop="name">
            <el-input
              v-model="formData.name"
              placeholder="请输入姓名（选填）"
            />
          </el-form-item>
          <el-form-item label="年龄" prop="age">
            <el-input-number v-model="formData.age" :min="18" :max="100" />
          </el-form-item>
          <el-form-item label="性别" prop="gender">
            <el-radio-group v-model="formData.gender">
              <el-radio label="male">男</el-radio>
              <el-radio label="female">女</el-radio>
            </el-radio-group>
          </el-form-item>
          <el-form-item label="职业" prop="occupation">
            <el-select v-model="formData.occupation" placeholder="请选择职业">
              <el-option
                v-for="item in occupations"
                :key="item.value"
                :label="item.label"
                :value="item.value"
              />
            </el-select>
          </el-form-item>
        </div>

        <!-- 性格测评 -->
        <div v-show="currentStep === 1" class="step-content">
          <h2>性格测评</h2>
          <div v-for="(question, index) in personalityQuestions" :key="index">
            <el-form-item :label="question.text" :prop="'personality.' + index">
              <el-rate
                v-model="formData.personality[index]"
                :texts="['非常不同意', '不同意', '一般', '同意', '非常同意']"
                show-text
              />
            </el-form-item>
          </div>
        </div>

        <!-- 生活习惯 -->
        <div v-show="currentStep === 2" class="step-content">
          <h2>生活习惯</h2>
          <div v-for="(habit, index) in habitQuestions" :key="index">
            <el-form-item :label="habit.text" :prop="'habits.' + index">
              <el-select v-model="formData.habits[index]" placeholder="请选择">
                <el-option
                  v-for="option in habit.options"
                  :key="option.value"
                  :label="option.label"
                  :value="option.value"
                />
              </el-select>
            </el-form-item>
          </div>
        </div>

        <!-- 感情观 -->
        <div v-show="currentStep === 3" class="step-content">
          <h2>感情观</h2>
          <div v-for="(view, index) in loveViewQuestions" :key="index">
            <el-form-item :label="view.text" :prop="'loveViews.' + index">
              <el-radio-group v-model="formData.loveViews[index]">
                <el-radio
                  v-for="option in view.options"
                  :key="option.value"
                  :label="option.value"
                >
                  {{ option.label }}
                </el-radio>
              </el-radio-group>
            </el-form-item>
          </div>
        </div>
      </el-form>

      <div class="step-buttons">
        <el-button v-if="currentStep > 0" @click="prevStep">上一步</el-button>
        <el-button v-if="currentStep < 3" type="primary" @click="nextStep"
          >��一步</el-button
        >
        <el-button
          v-else
          type="success"
          @click="submitTest"
          :loading="submitting"
          >提交测试</el-button
        >
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, reactive } from "vue";
import { useRouter } from "vue-router";

const router = useRouter();
const currentStep = ref(0);
const submitting = ref(false);
const testForm = ref(null);

// 表单数据
const formData = reactive({
  name: "",
  age: 25,
  gender: "",
  occupation: "",
  personality: Array(10).fill(3),
  habits: Array(5).fill(""),
  loveViews: Array(5).fill(""),
});

// 职业选项
const occupations = [
  { label: "学生", value: "student" },
  { label: "教师", value: "teacher" },
  { label: "IT/互联网", value: "it" },
  { label: "金融", value: "finance" },
  { label: "医疗", value: "medical" },
  { label: "其他", value: "other" },
];

// 性格测评问题
const personalityQuestions = [
  { text: "我是一个外向的人" },
  { text: "我喜欢尝试新事物" },
  { text: "我容易相信他人" },
  { text: "我是一个有条理的人" },
  { text: "我很少感到焦虑" },
];

// 生活习惯问题
const habitQuestions = [
  {
    text: "你通常几点睡觉？",
    options: [
      { label: "22点前", value: "before_22" },
      { label: "22-23点", value: "22_23" },
      { label: "23-24点", value: "23_24" },
      { label: "24点后", value: "after_24" },
    ],
  },
  {
    text: "周末喜欢做什么？",
    options: [
      { label: "宅在家", value: "stay_home" },
      { label: "外出游玩", value: "go_out" },
      { label: "运动健身", value: "exercise" },
      { label: "社交聚会", value: "social" },
    ],
  },
];

// 感情观问题
const loveViewQuestions = [
  {
    text: "你认为婚姻中最重要的是什么？",
    options: [
      { label: "相互理解", value: "understanding" },
      { label: "经济基础", value: "economy" },
      { label: "共同成长", value: "growth" },
      { label: "忠诚信任", value: "trust" },
    ],
  },
];

// 表单验证规则
const rules = {
  age: [{ required: true, message: "请输入年龄", trigger: "blur" }],
  gender: [{ required: true, message: "请选择性别", trigger: "change" }],
};

// 下一步
const nextStep = async () => {
  if (currentStep.value < 3) {
    currentStep.value++;
  }
};

// 上一步
const prevStep = () => {
  if (currentStep.value > 0) {
    currentStep.value--;
  }
};

// 提交测试
const submitTest = async () => {
  try {
    submitting.value = true;
    // TODO: 调用API提交测试数据
    await new Promise((resolve) => setTimeout(resolve, 1500)); // 模拟API调用
    router.push("/love/analysis");
  } catch (error) {
    console.error("提交失败:", error);
  } finally {
    submitting.value = false;
  }
};
</script>

<style scoped>
.test-container {
  max-width: 800px;
  margin: 2rem auto;
  padding: 2rem;
}

.test-steps {
  margin-bottom: 3rem;
}

.test-content {
  background: white;
  padding: 2rem;
  border-radius: var(--border-radius);
  box-shadow: var(--shadow-sm);
}

.step-content {
  animation: fadeIn 0.3s ease-out;
}

.step-content h2 {
  margin-bottom: 2rem;
  color: var(--love-primary);
  font-size: 1.5rem;
}

.step-buttons {
  display: flex;
  justify-content: space-between;
  margin-top: 2rem;
  padding-top: 2rem;
  border-top: 1px solid #eee;
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

@media (max-width: 768px) {
  .test-container {
    padding: 1rem;
  }

  .test-content {
    padding: 1rem;
  }
}
</style>
