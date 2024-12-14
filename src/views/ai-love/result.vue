<template>
  <div class="result-container">
    <el-card class="result-card">
      <template #header>
        <div class="card-header">
          <h2>匹配分析结果</h2>
        </div>
      </template>

      <!-- 匹配分数展示 -->
      <div class="score-section">
        <el-progress
          type="dashboard"
          :percentage="matchScore"
          :color="progressColors"
          :width="180"
        >
          <template #default="{ percentage }">
            <div class="score-content">
              <span class="score-number">{{ percentage }}</span>
              <span class="score-label">匹配度</span>
            </div>
          </template>
        </el-progress>
      </div>

      <!-- 匹配评价 -->
      <div class="evaluation-section">
        <h3>匹配评价</h3>
        <p class="evaluation-text">{{ matchEvaluation }}</p>
      </div>

      <!-- 详细分析 -->
      <div class="analysis-section">
        <h3>详细分析</h3>
        <el-collapse v-model="activeAnalysis">
          <el-collapse-item title="性格匹配" name="personality">
            <div class="analysis-content">
              <el-progress
                :percentage="personalityScore"
                :color="progressColors"
              />
              <p>{{ analysis.personality }}</p>
            </div>
          </el-collapse-item>
          <el-collapse-item title="兴趣契合" name="interests">
            <div class="analysis-content">
              <el-progress
                :percentage="interestsScore"
                :color="progressColors"
              />
              <p>{{ analysis.interests }}</p>
            </div>
          </el-collapse-item>
          <el-collapse-item title="价值观一致" name="values">
            <div class="analysis-content">
              <el-progress :percentage="valuesScore" :color="progressColors" />
              <p>{{ analysis.values }}</p>
            </div>
          </el-collapse-item>
        </el-collapse>
      </div>

      <!-- 建议部分 -->
      <div class="suggestions-section">
        <h3>AI 建议</h3>
        <div class="suggestions-list">
          <div
            v-for="(suggestion, index) in suggestions"
            :key="index"
            class="suggestion-item"
          >
            <el-icon><InfoFilled /></el-icon>
            <p>{{ suggestion }}</p>
          </div>
        </div>
      </div>

      <!-- 操作按钮 -->
      <div class="action-buttons">
        <el-button type="primary" @click="startNewTest">重新测试</el-button>
        <el-button @click="shareResult">分享结果</el-button>
        <el-button @click="saveResult">保存结果</el-button>
      </div>
    </el-card>
  </div>
</template>

<script setup>
import { ref, computed } from "vue";
import { useRouter, useRoute } from "vue-router";
import { InfoFilled } from "@element-plus/icons-vue";
import { ElMessage } from "element-plus";

const router = useRouter();
const route = useRoute();

// 模拟数据 - 实际项目中应该从API获取
const matchScore = ref(85);
const personalityScore = ref(90);
const interestsScore = ref(75);
const valuesScore = ref(88);
const activeAnalysis = ref(["personality"]);

const analysis = ref({
  personality: "你们的性格特征非常互补，能够在关系中相互理解和包容。",
  interests: "在兴趣爱好方面有较多共同点，有利于增进感情和共同话题。",
  values: "在重要的人生价值观上达成一致，为长期关系奠定了良好基础。",
});

const suggestions = ref([
  "建议多创造共同体验的机会，增进感情",
  "在沟通方式上可以更加开放和直接",
  "注意保持适当的个人空间，尊重彼此的独立性",
]);

// 计算匹配评价
const matchEvaluation = computed(() => {
  if (matchScore.value >= 90)
    return "天作之合！你们的匹配度非常高，很有可能发展出稳定的长期关系。";
  if (matchScore.value >= 80)
    return "非常般配！你们在多个方面都很契合，有很大的发展潜力。";
  if (matchScore.value >= 70)
    return "比较合适！虽然存在一些差异，但整体来说是个不错的搭配。";
  return "还需要更多了解！建议在进一步发展关系前多互相了解。";
});

// 进度条颜色配置
const progressColors = [
  { color: "#f56c6c", percentage: 20 },
  { color: "#e6a23c", percentage: 40 },
  { color: "#5cb87a", percentage: 60 },
  { color: "#1989fa", percentage: 80 },
  { color: "#6f7ad3", percentage: 100 },
];

// 按钮操作
const startNewTest = () => {
  router.push("/ai-love/test");
};

const shareResult = () => {
  ElMessage.success("分享功能开发中...");
};

const saveResult = () => {
  ElMessage.success("结果已保存");
};
</script>

<style scoped>
.result-container {
  max-width: 800px;
  margin: 20px auto;
  padding: 20px;
}

.result-card {
  margin-bottom: 20px;
}

.card-header {
  text-align: center;
}

.score-section {
  text-align: center;
  margin: 30px 0;
}

.score-content {
  display: flex;
  flex-direction: column;
  align-items: center;
}

.score-number {
  font-size: 28px;
  font-weight: bold;
  color: var(--love-primary);
}

.score-label {
  font-size: 14px;
  color: var(--text-secondary);
}

.evaluation-section {
  text-align: center;
  margin: 30px 0;
  padding: 20px;
  background: var(--background-light);
  border-radius: var(--border-radius);
}

.evaluation-text {
  color: var(--text-primary);
  line-height: 1.6;
}

.analysis-section {
  margin: 30px 0;
}

.analysis-content {
  padding: 10px 0;
}

.suggestions-section {
  margin: 30px 0;
}

.suggestions-list {
  margin-top: 20px;
}

.suggestion-item {
  display: flex;
  align-items: flex-start;
  gap: 10px;
  margin-bottom: 15px;
  padding: 10px;
  background: var(--background-light);
  border-radius: var(--border-radius);
}

.suggestion-item .el-icon {
  color: var(--love-primary);
  font-size: 20px;
  margin-top: 2px;
}

.action-buttons {
  display: flex;
  justify-content: center;
  gap: 20px;
  margin-top: 40px;
}

/* 响应式设计 */
@media (max-width: 768px) {
  .result-container {
    padding: 10px;
  }

  .action-buttons {
    flex-direction: column;
    gap: 10px;
  }
}
</style>
