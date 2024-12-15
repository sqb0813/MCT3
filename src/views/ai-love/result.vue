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
          :width="200"
          :stroke-width="15"
        >
          <template #default>
            <div class="score-content">
              <span class="score-number">{{ matchScore }}%</span>
              <span class="score-label">匹配度</span>
            </div>
          </template>
        </el-progress>
      </div>

      <!-- 匹配评价 -->
      <div class="evaluation-section">
        <h3>匹配评价</h3>
        <div class="evaluation-content">
          <el-alert
            :type="getEvaluationType(matchScore)"
            :title="getEvaluationTitle(matchScore)"
            :description="getEvaluationDesc(matchScore)"
            :closable="false"
            show-icon
          />
        </div>
      </div>

      <!-- 详细分析 -->
      <div class="analysis-section">
        <h3>详细分析</h3>
        <el-collapse v-model="activeAnalysis">
          <el-collapse-item title="性格匹配" name="personality">
            <div class="analysis-content">
              <div class="chart-container" ref="personalityChartRef"></div>
              <p>{{ analysis.personality }}</p>
            </div>
          </el-collapse-item>
          <el-collapse-item title="兴趣契合" name="hobbies">
            <div class="analysis-content">
              <div class="chart-container" ref="hobbiesChartRef"></div>
              <p>{{ analysis.hobbies }}</p>
            </div>
          </el-collapse-item>
          <el-collapse-item title="价值观" name="values">
            <div class="analysis-content">
              <div class="chart-container" ref="valuesChartRef"></div>
              <p>{{ analysis.values }}</p>
            </div>
          </el-collapse-item>
        </el-collapse>
      </div>

      <!-- 专业建议 -->
      <div class="suggestions-section">
        <h3>专业建议</h3>
        <el-timeline>
          <el-timeline-item
            v-for="(suggestion, index) in suggestions"
            :key="index"
            :type="suggestion.type"
            :color="suggestion.color"
            :size="suggestion.size"
            :hollow="suggestion.hollow"
          >
            <h4>{{ suggestion.title }}</h4>
            <p>{{ suggestion.content }}</p>
          </el-timeline-item>
        </el-timeline>
      </div>

      <!-- 操作按钮 -->
      <div class="action-buttons">
        <el-button @click="retakeTest">重新测试</el-button>
        <el-button type="primary" @click="saveResult">保存结果</el-button>
        <el-button type="success" @click="shareResult">分享结果</el-button>
      </div>
    </el-card>
  </div>
</template>

<script setup>
import { ref, onMounted } from "vue";
import { useRouter, useRoute } from "vue-router";
import { ElMessage } from "element-plus";
import * as echarts from "echarts";

const router = useRouter();
const route = useRoute();
const activeAnalysis = ref(["personality"]);

// 图表引用
const personalityChartRef = ref(null);
const hobbiesChartRef = ref(null);
const valuesChartRef = ref(null);

// 匹配分数
const matchScore = ref(85);

// 进度条颜色
const progressColors = [
  { color: "#f56c6c", percentage: 60 },
  { color: "#e6a23c", percentage: 75 },
  { color: "#5cb87a", percentage: 90 },
  { color: "#1989fa", percentage: 100 },
];

// 分析结果
const analysis = ref({
  personality:
    "你们的性格特征呈现互补状态。一方外向开朗，另一方内向稳重，这种差异能在日常交往中相互平衡，共同进步。",
  hobbies:
    "在运动、音乐等方面有共同的兴趣爱好，这为你们的相处提供了良好的基础。建议可以多参与共同感兴趣的活动。",
  values:
    "双方在感情观念上较为接近，都倾向于开放包容的态度，这有利于建立长期稳定的关系。",
});

// 专业建议
const suggestions = ref([
  {
    title: "加强沟通",
    content: "建议通过定期交流，增进彼此了解，培养共同话题。",
    type: "primary",
    size: "large",
  },
  {
    title: "发展共同爱好",
    content: "可以一起参与运动或音乐活动，增进感情。",
    type: "success",
    hollow: true,
  },
  {
    title: "保持独立空间",
    content: "在亲密关系中保持适度的个人空间，有助于关系长久发展。",
    type: "warning",
  },
]);

// 获取评价类型
const getEvaluationType = (score) => {
  if (score >= 90) return "success";
  if (score >= 75) return "warning";
  return "info";
};

// 获取评价标题
const getEvaluationTitle = (score) => {
  if (score >= 90) return "非常般配";
  if (score >= 75) return "比较合适";
  if (score >= 60) return "还需努力";
  return "建议多了解";
};

// 获取评价描述
const getEvaluationDesc = (score) => {
  if (score >= 90) {
    return "你们的匹配度非常高！在性格、兴趣和价值观等多个方面都十分契合。";
  }
  if (score >= 75) {
    return "你们有不错的匹配度，通过相处和沟通可以建立更好的关系。";
  }
  if (score >= 60) {
    return "你们存在一些差异，但通过互相理解和包容，仍有发展空间。";
  }
  return "建议多花时间了解对方，看看是否真的适合。";
};

// 初始化图表
const initCharts = () => {
  // 性格匹配雷达图
  const personalityChart = echarts.init(personalityChartRef.value);
  personalityChart.setOption({
    radar: {
      indicator: [
        { name: "外向性", max: 100 },
        { name: "开放性", max: 100 },
        { name: "责任心", max: 100 },
        { name: "亲和力", max: 100 },
        { name: "情绪稳定", max: 100 },
      ],
    },
    series: [
      {
        type: "radar",
        data: [
          {
            value: [80, 90, 70, 85, 75],
            name: "我的性格",
            areaStyle: { opacity: 0.3 },
          },
          {
            value: [70, 85, 80, 75, 85],
            name: "对方性格",
            areaStyle: { opacity: 0.3 },
          },
        ],
      },
    ],
  });

  // 兴趣爱好柱状图
  const hobbiesChart = echarts.init(hobbiesChartRef.value);
  hobbiesChart.setOption({
    xAxis: { type: "category", data: ["运动", "音乐", "阅读", "旅行", "美食"] },
    yAxis: { type: "value" },
    series: [
      {
        type: "bar",
        data: [80, 90, 60, 85, 75],
        name: "兴趣契合度",
      },
    ],
  });

  // 价值观饼图
  const valuesChart = echarts.init(valuesChartRef.value);
  valuesChart.setOption({
    series: [
      {
        type: "pie",
        radius: ["40%", "70%"],
        data: [
          { value: 60, name: "共同价值观" },
          { value: 30, name: "互补价值观" },
          { value: 10, name: "差异价值观" },
        ],
      },
    ],
  });
};

// 重新测试
const retakeTest = () => {
  router.push("/ai-love/test");
};

// 保存结果
const saveResult = async () => {
  try {
    // TODO: 调用保存结果API
    ElMessage.success("保存成功");
  } catch (error) {
    ElMessage.error("保存失败");
  }
};

// 分享结果
const shareResult = () => {
  // TODO: 实现分享功能
  ElMessage.success("分享功能开发中");
};

onMounted(() => {
  // 获取测试结果
  const testId = route.query.id;
  if (!testId) {
    ElMessage.error("无效的测试ID");
    return;
  }

  // TODO: 调用获取结果API
  // 初始化图表
  initCharts();

  // 监听窗口大小变化，重绘图表
  window.addEventListener("resize", () => {
    const charts = [
      personalityChartRef.value,
      hobbiesChartRef.value,
      valuesChartRef.value,
    ];
    charts.forEach(
      (chart) => chart && echarts.getInstanceByDom(chart)?.resize()
    );
  });
});
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

.card-header h2 {
  margin: 0;
  font-size: 24px;
  color: var(--love-primary);
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
  color: var(--love-primary);
}

.score-label {
  margin-top: 5px;
  font-size: 14px;
  color: var(--text-secondary);
}

.evaluation-section,
.analysis-section,
.suggestions-section {
  margin-top: 30px;
}

h3 {
  margin-bottom: 20px;
  font-size: 18px;
  color: var(--text-primary);
}

.analysis-content {
  padding: 20px 0;
}

.chart-container {
  height: 300px;
  margin-bottom: 20px;
}

.action-buttons {
  display: flex;
  justify-content: center;
  gap: 20px;
  margin-top: 30px;
  padding-top: 20px;
  border-top: 1px solid #eee;
}

/* 响应式调整 */
@media (max-width: 768px) {
  .chart-container {
    height: 250px;
  }

  .action-buttons {
    flex-direction: column;
  }

  .action-buttons .el-button {
    width: 100%;
  }
}
</style>
