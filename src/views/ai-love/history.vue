<template>
  <div class="history-container">
    <el-card class="history-card">
      <template #header>
        <div class="card-header">
          <h2>测试历史记录</h2>
        </div>
      </template>

      <el-table :data="historyRecords" style="width: 100%">
        <el-table-column prop="date" label="测试日期" width="180" />
        <el-table-column prop="score" label="匹配度" width="120">
          <template #default="{ row }">
            <el-tag :type="getScoreType(row.score)">{{ row.score }}%</el-tag>
          </template>
        </el-table-column>
        <el-table-column prop="status" label="状态" width="120" />
        <el-table-column label="操作">
          <template #default="{ row }">
            <el-button type="primary" link @click="viewDetail(row.id)">
              查看详情
            </el-button>
            <el-button type="danger" link @click="deleteRecord(row.id)">
              删除
            </el-button>
          </template>
        </el-table-column>
      </el-table>
    </el-card>
  </div>
</template>

<script setup>
import { ref } from "vue";
import { useRouter } from "vue-router";

const router = useRouter();

// 模拟历史记录数据
const historyRecords = ref([
  {
    id: 1,
    date: "2024-01-15",
    score: 85,
    status: "已完成",
  },
  {
    id: 2,
    date: "2024-01-10",
    score: 92,
    status: "已完成",
  },
]);

const getScoreType = (score) => {
  if (score >= 90) return "success";
  if (score >= 75) return "warning";
  return "danger";
};

const viewDetail = (id) => {
  router.push(`/ai-love/result?id=${id}`);
};

const deleteRecord = async (id) => {
  // TODO: 调用API删除记录
  historyRecords.value = historyRecords.value.filter(
    (record) => record.id !== id
  );
};
</script>

<style scoped>
.history-container {
  max-width: 1000px;
  margin: 20px auto;
  padding: 20px;
}

.history-card {
  margin-bottom: 20px;
}

.card-header {
  text-align: center;
}
</style>
