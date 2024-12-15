<template>
  <div class="analysis-container">
    <el-card class="analysis-card">
      <template #header>
        <div class="card-header">
          <h2>匹配分析结果</h2>
        </div>
      </template>

      <div v-if="loading" class="loading-container">
        <el-skeleton :rows="6" animated />
      </div>

      <div v-else-if="error" class="error-container">
        <el-empty description="获取分析结果失败" />
        <el-button type="primary" @click="fetchAnalysis">重试</el-button>
      </div>

      <div v-else>
        <!-- 匹配分数 -->
        <div class="score-section">
          <el-progress
            type="dashboard"
            :percentage="analysis.score"
            :color="progressColors"
            :width="200"
            :stroke-width="15"
          >
            <template #default>
              <div class="score-content">
                <span class="score-number">{{ analysis.score }}%</span>
                <span class="score-label">匹配度</span>
              </div>
            </template>
          </el-progress>
        </div>

        <!-- 分析内容 -->
        <div class="analysis-content">
          <el-alert
            :type="getEvaluationType(analysis.score)"
            :title="getEvaluationTitle(analysis.score)"
            :description="analysis.analysis"
            :closable="false"
            show-icon
          />
        </div>

        <!-- 建议内容 -->
        <div class="suggestions-section" v-if="analysis.suggestions">
          <h3>专业建议</h3>
          <el-timeline>
            <el-timeline-item
              v-for="(suggestion, index) in analysis.suggestions.split('。')"
              :key="index"
              :type="suggestionTypes[index % suggestionTypes.length]"
            >
              <p>{{ suggestion }}</p>
            </el-timeline-item>
          </el-timeline>
        </div>

        <!-- 操作按钮 -->
        <div class="action-buttons">
          <el-button @click="retakeTest">重新测试</el-button>
          <el-button type="primary" @click="saveResult">保存结果</el-button>
        </div>
      </div>
    </el-card>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from "vue";
import { useRoute, useRouter } from "vue-router";
import { testApi } from "@/api";
import { ElMessage } from "element-plus";

const route = useRoute();
const router = useRouter();
const loading = ref(true);
const error = ref(false);
const analysis = ref<any>({});

// 进度条颜色
const progressColors = [
  { color: "#f56c6c", percentage: 60 },
  { color: "#e6a23c", percentage: 75 },
  { color: "#5cb87a", percentage: 90 },
  { color: "#1989fa", percentage: 100 },
];

const suggestionTypes = ["primary", "success", "warning", "info"];

// 获取评价类型
const getEvaluationType = (score: number) => {
  if (score >= 90) return "success";
  if (score >= 75) return "warning";
  return "info";
};

// 获取评价标题
const getEvaluationTitle = (score: number) => {
  if (score >= 90) return "非常般配";
  if (score >= 75) return "比较合适";
  if (score >= 60) return "还需努力";
  return "建议多了解";
};

// 获取分析结果
const fetchAnalysis = async () => {
  const testId = route.query.id;
  if (!testId) {
    ElMessage.error("无效的测试ID");
    return;
  }

  try {
    loading.value = true;
    error.value = false;
    const response = await testApi.getTestDetail(testId as string);
    analysis.value = response.data;
  } catch (err) {
    error.value = true;
    ElMessage.error("获取分析结果失败");
  } finally {
    loading.value = false;
  }
};

// 重新测试
const retakeTest = () => {
  router.push("/love/test");
};

// 保存结果
const saveResult = async () => {
  try {
    await testApi.submitTest(analysis.value);
    ElMessage.success("保存成功");
  } catch (err) {
    ElMessage.error("保存失败");
  }
};

onMounted(() => {
  fetchAnalysis();
});
</script>

<style scoped>
.analysis-container {
  max-width: 800px;
  margin: 2rem auto;
  padding: 2rem;
}

.card-header {
  text-align: center;
}

.score-section {
  display: flex;
  justify-content: center;
  margin: 30px 0;
}

.score-content {
  display: flex;
  flex-direction: column;
  align-items: center;
}

.score-number {
  font-size: 36px;
  font-weight: bold;
  color: var(--el-color-primary);
}

.score-label {
  margin-top: 5px;
  font-size: 14px;
  color: var(--el-text-color-secondary);
}

.analysis-content {
  margin: 30px 0;
}

.suggestions-section {
  margin: 30px 0;
}

.action-buttons {
  display: flex;
  justify-content: center;
  gap: 20px;
  margin-top: 30px;
}

.loading-container,
.error-container {
  padding: 40px;
  text-align: center;
}
</style>
