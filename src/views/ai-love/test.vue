<template>
  <div class="test-container">
    <el-card class="test-card">
      <template #header>
        <div class="card-header">
          <h2>AI恋爱契合度测试</h2>
        </div>
      </template>

      <el-steps :active="activeStep" finish-status="success" simple>
        <el-step title="您的信息" />
        <el-step title="对方信息" />
        <el-step title="分析结果" />
      </el-steps>

      <TestForm
        v-if="activeStep < 2"
        :person-type="activeStep === 0 ? 'person1' : 'person2'"
        :form-data="formData"
        @next-step="handleNextStep"
        @prev-step="handlePrevStep"
      />

      <div v-else class="analyzing">
        <el-progress type="dashboard" :percentage="analyzeProgress" />
        <p>正在进行智能分析...</p>
      </div>
    </el-card>
  </div>
</template>

<script setup>
import { ref, reactive } from "vue";
import { useRouter } from "vue-router";
import TestForm from "@/components/ai-love/TestForm.vue";

const router = useRouter();
const activeStep = ref(0);
const analyzeProgress = ref(0);

const formData = reactive({
  person1: {
    name: "",
    age: null,
    gender: "",
    occupation: "",
    personality: [],
    hobbies: [],
    values: "",
  },
  person2: {
    name: "",
    age: null,
    gender: "",
    occupation: "",
    personality: [],
    hobbies: [],
    values: "",
  },
});

const handleNextStep = () => {
  if (activeStep.value < 2) {
    activeStep.value++;
    if (activeStep.value === 2) {
      simulateAnalysis();
    }
  }
};

const handlePrevStep = () => {
  if (activeStep.value > 0) {
    activeStep.value--;
  }
};

const simulateAnalysis = () => {
  let progress = 0;
  const timer = setInterval(() => {
    progress += 10;
    analyzeProgress.value = progress;
    if (progress >= 100) {
      clearInterval(timer);
      router.push({
        path: "/ai-love/result",
        query: { id: "test123" },
      });
    }
  }, 200);
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

.analyzing {
  text-align: center;
  padding: 40px 0;
}
</style>
