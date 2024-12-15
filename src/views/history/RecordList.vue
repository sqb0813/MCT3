<template>
  <div class="record-list">
    <div class="record-header">
      <h2>测试历史记录</h2>
      <el-button type="primary" @click="exportAllRecords">
        导出所有记录
      </el-button>
    </div>

    <!-- 筛选器 -->
    <div class="filter-section">
      <el-form :inline="true" :model="filterForm">
        <el-form-item label="测试类型">
          <el-select v-model="filterForm.type">
            <el-option label="全部" value="" />
            <el-option label="基础测试" value="basic" />
            <el-option label="深度测试" value="deep" />
          </el-select>
        </el-form-item>
        <el-form-item label="时间范围">
          <el-date-picker
            v-model="filterForm.dateRange"
            type="daterange"
            range-separator="至"
            start-placeholder="开始日期"
            end-placeholder="结束日期"
          />
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="handleFilter">筛选</el-button>
          <el-button @click="resetFilter">重置</el-button>
        </el-form-item>
      </el-form>
    </div>

    <!-- 趋势图表 -->
    <div class="chart-section">
      <div ref="chartRef" style="height: 300px"></div>
    </div>

    <!-- 记录列表 -->
    <el-table :data="records" style="width: 100%">
      <el-table-column prop="date" label="测试日期" width="180" />
      <el-table-column prop="type" label="测试类型" width="120" />
      <el-table-column prop="score" label="匹配度" width="100">
        <template #default="{ row }">
          <el-tag :type="getScoreType(row.score)">{{ row.score }}%</el-tag>
        </template>
      </el-table-column>
      <el-table-column label="操作">
        <template #default="{ row }">
          <el-button link type="primary" @click="viewDetail(row)">
            查看详情
          </el-button>
          <el-button link type="primary" @click="exportRecord(row)">
            导出报告
          </el-button>
          <el-button link type="danger" @click="deleteRecord(row)">
            删除
          </el-button>
        </template>
      </el-table-column>
    </el-table>

    <!-- 分页 -->
    <div class="pagination">
      <el-pagination
        v-model:current-page="currentPage"
        v-model:page-size="pageSize"
        :total="total"
        @current-change="handlePageChange"
      />
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, reactive } from "vue";
import { useRouter } from "vue-router";
import * as echarts from "echarts";

const router = useRouter();
const chartRef = ref(null);
let chart = null;

// 筛选表单
const filterForm = reactive({
  type: "",
  dateRange: [],
});

// 分页数据
const currentPage = ref(1);
const pageSize = ref(10);
const total = ref(0);
const records = ref([]);

// 初始化图表
const initChart = () => {
  chart = echarts.init(chartRef.value);
  const option = {
    title: {
      text: "匹配度趋势",
    },
    tooltip: {
      trigger: "axis",
    },
    xAxis: {
      type: "category",
      data: ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"],
    },
    yAxis: {
      type: "value",
    },
    series: [
      {
        data: [80, 85, 75, 90, 82, 88, 92],
        type: "line",
        smooth: true,
      },
    ],
  };
  chart.setOption(option);
};

// 获取记录列表
const getRecords = async () => {
  // 实现获取记录的逻辑
};

// 查看详情
const viewDetail = (record) => {
  router.push(`/record/${record.id}`);
};

// 导出记录
const exportRecord = async (record) => {
  // 实现导出单条记录的逻辑
};

// 删除记录
const deleteRecord = async (record) => {
  // ���现删除记录的逻辑
};

onMounted(() => {
  initChart();
  getRecords();
});
</script>

<style scoped>
.record-list {
  padding: 20px;
}

.record-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20px;
}

.filter-section {
  margin-bottom: 20px;
}

.chart-section {
  margin-bottom: 30px;
  background: #fff;
  padding: 20px;
  border-radius: 4px;
}

.pagination {
  margin-top: 20px;
  text-align: right;
}
</style>
