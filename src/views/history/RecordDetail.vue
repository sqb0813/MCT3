<template>
  <div class="record-detail">
    <div class="detail-header">
      <h2>测试报告详情</h2>
      <el-button type="primary" @click="exportPDF">导出PDF</el-button>
    </div>

    <el-card class="detail-card">
      <!-- 基本信息 -->
      <div class="basic-info">
        <h3>基本信息</h3>
        <el-descriptions :column="2" border>
          <el-descriptions-item label="测试时间">
            {{ formatTime(record.createTime) }}
          </el-descriptions-item>
          <el-descriptions-item label="测试类型">
            {{ record.type }}
          </el-descriptions-item>
          <el-descriptions-item label="匹配度">
            <el-progress
              type="circle"
              :percentage="record.score"
              :color="getScoreColor(record.score)"
            />
          </el-descriptions-item>
        </el-descriptions>
      </div>

      <!-- 详细分析 -->
      <div class="analysis-section">
        <h3>详细分析</h3>
        <el-collapse v-model="activeNames">
          <el-collapse-item title="性格匹配" name="personality">
            <div class="analysis-content">
              <div class="chart-container" ref="personalityChart"></div>
              <p>{{ record.analysis.personality }}</p>
            </div>
          </el-collapse-item>
          <el-collapse-item title="兴趣爱好" name="interests">
            <div class="analysis-content">
              <div class="chart-container" ref="interestsChart"></div>
              <p>{{ record.analysis.interests }}</p>
            </div>
          </el-collapse-item>
          <el-collapse-item title="价值观" name="values">
            <div class="analysis-content">
              <div class="chart-container" ref="valuesChart"></div>
              <p>{{ record.analysis.values }}</p>
            </div>
          </el-collapse-item>
        </el-collapse>
      </div>

      <!-- 建议部分 -->
      <div class="suggestions-section">
        <h3>改进建议</h3>
        <el-timeline>
          <el-timeline-item
            v-for="(suggestion, index) in record.suggestions"
            :key="index"
            :type="suggestion.type"
          >
            <h4>{{ suggestion.title }}</h4>
            <p>{{ suggestion.content }}</p>
          </el-timeline-item>
        </el-timeline>
      </div>
    </el-card>
  </div>
</template>

<script setup>
import { ref, onMounted } from "vue";
import { useRoute } from "vue-router";
import { recordApi } from "@/api";
import { formatTime } from "@/utils/time";
import * as echarts from "echarts";

const route = useRoute();
const record = ref({});
const activeNames = ref(["personality"]);

// 获取记录详情
const getRecordDetail = async () => {
  try {
    const res = await recordApi.getRecordDetail(route.params.id);
    record.value = res.data;
    initCharts();
  } catch (error) {
    console.error("获取记录详情失败:", error);
  }
};

// 初始化图表
const initCharts = () => {
  // 实现图表初始化逻辑
};

// 导出PDF
const exportPDF = async () => {
  try {
    await recordApi.exportRecord(route.params.id);
  } catch (error) {
    console.error("导出PDF失败:", error);
  }
};

onMounted(() => {
  getRecordDetail();
});
</script>

<style scoped>
.record-detail {
  padding: 20px;
}

.detail-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20px;
}

.detail-card {
  margin-bottom: 20px;
}

.basic-info {
  margin-bottom: 30px;
}

.analysis-section {
  margin: 30px 0;
}

.chart-container {
  height: 300px;
  margin: 20px 0;
}

.suggestions-section {
  margin-top: 30px;
}
</style>
