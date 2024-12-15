<template>
  <div class="expert-container">
    <!-- 筛选区域 -->
    <div class="filter-section">
      <el-form :inline="true" :model="filterForm">
        <el-form-item label="专业领域">
          <el-select v-model="filterForm.specialty">
            <el-option label="全部" value="" />
            <el-option label="婚恋咨询" value="marriage" />
            <el-option label="情感分析" value="emotion" />
            <el-option label="心理疏导" value="psychology" />
          </el-select>
        </el-form-item>
        <el-form-item label="咨询价格">
          <el-select v-model="filterForm.priceRange">
            <el-option label="全部" value="" />
            <el-option label="100以下" value="0-100" />
            <el-option label="100-300" value="100-300" />
            <el-option label="300以上" value="300-up" />
          </el-select>
        </el-form-item>
        <el-form-item label="评分">
          <el-rate v-model="filterForm.rating" />
        </el-form-item>
      </el-form>
    </div>

    <!-- 专家列表 -->
    <div class="expert-list">
      <el-row :gutter="20">
        <el-col
          v-for="expert in experts"
          :key="expert.id"
          :xs="24"
          :sm="12"
          :md="8"
          :lg="6"
        >
          <el-card class="expert-card">
            <div class="expert-header">
              <el-avatar :size="80" :src="expert.avatar" />
              <div class="expert-info">
                <h3>{{ expert.name }}</h3>
                <p>{{ expert.title }}</p>
                <el-rate v-model="expert.rating" disabled show-score />
              </div>
            </div>
            <div class="expert-content">
              <div class="specialties">
                <el-tag
                  v-for="specialty in expert.specialties"
                  :key="specialty"
                  size="small"
                  class="specialty-tag"
                >
                  {{ specialty }}
                </el-tag>
              </div>
              <p class="introduction">{{ expert.introduction }}</p>
              <div class="price-info">
                <span class="price">¥{{ expert.price }}/次</span>
                <span class="consultation-count">
                  已咨询{{ expert.consultationCount }}次
                </span>
              </div>
            </div>
            <div class="expert-footer">
              <el-button type="primary" @click="startConsultation(expert)">
                立即咨询
              </el-button>
              <el-button @click="viewExpertDetail(expert)">
                查看详情
              </el-button>
            </div>
          </el-card>
        </el-col>
      </el-row>
    </div>

    <!-- 咨询预约对话框 -->
    <el-dialog v-model="consultationDialogVisible" title="预约咨询" width="50%">
      <el-form
        :model="consultationForm"
        :rules="consultationRules"
        ref="consultationFormRef"
      >
        <el-form-item label="咨询类型" prop="type">
          <el-select v-model="consultationForm.type">
            <el-option label="在线咨询" value="online" />
            <el-option label="视频咨询" value="video" />
          </el-select>
        </el-form-item>
        <el-form-item label="预约时间" prop="time">
          <el-date-picker
            v-model="consultationForm.time"
            type="datetime"
            placeholder="选���日期时间"
            :disabled-date="disabledDate"
            :disabled-time="disabledTime"
          />
        </el-form-item>
        <el-form-item label="咨询时长" prop="duration">
          <el-select v-model="consultationForm.duration">
            <el-option label="30分钟" :value="30" />
            <el-option label="60分钟" :value="60" />
            <el-option label="90分钟" :value="90" />
          </el-select>
        </el-form-item>
        <el-form-item label="咨询问题" prop="description">
          <el-input
            v-model="consultationForm.description"
            type="textarea"
            :rows="4"
            placeholder="请简要描述您想咨询的问题"
          />
        </el-form-item>
      </el-form>
      <template #footer>
        <span class="dialog-footer">
          <el-button @click="consultationDialogVisible = false">
            取消
          </el-button>
          <el-button type="primary" @click="submitConsultation">
            确认预约
          </el-button>
        </span>
      </template>
    </el-dialog>
  </div>
</template>

<script setup>
import { ref, reactive } from "vue";
import { useRouter } from "vue-router";

const router = useRouter();
const experts = ref([]);
const consultationDialogVisible = ref(false);

// 筛选表单
const filterForm = reactive({
  specialty: "",
  priceRange: "",
  rating: 0,
});

// 咨询表单
const consultationForm = reactive({
  type: "",
  time: "",
  duration: 30,
  description: "",
});

// 表单验证规则
const consultationRules = {
  type: [{ required: true, message: "请选择咨询类型", trigger: "change" }],
  time: [{ required: true, message: "请选择预约时间", trigger: "change" }],
  description: [
    { required: true, message: "请描述咨询问题", trigger: "blur" },
    { min: 10, message: "描述不能少于10个字符", trigger: "blur" },
  ],
};

// 获取专家列表
const getExperts = async () => {
  // 实现获取专家列表的逻辑
};

// 开始咨询
const startConsultation = (expert) => {
  consultationDialogVisible.value = true;
};

// 查看专家详情
const viewExpertDetail = (expert) => {
  router.push(`/expert/${expert.id}`);
};

// 提交咨询预约
const submitConsultation = async () => {
  // 实现提交预约的逻辑
};
</script>

<style scoped>
.expert-container {
  padding: 20px;
}

.filter-section {
  margin-bottom: 20px;
}

.expert-card {
  margin-bottom: 20px;
}

.expert-header {
  display: flex;
  gap: 20px;
  margin-bottom: 15px;
}

.expert-info h3 {
  margin: 0 0 5px 0;
}

.expert-info p {
  margin: 0 0 5px 0;
  color: #666;
}

.specialties {
  margin: 10px 0;
}

.specialty-tag {
  margin-right: 5px;
  margin-bottom: 5px;
}

.introduction {
  margin: 10px 0;
  color: #666;
  display: -webkit-box;
  -webkit-box-orient: vertical;
  -webkit-line-clamp: 2;
  overflow: hidden;
}

.price-info {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin: 10px 0;
}

.price {
  color: #f56c6c;
  font-size: 18px;
  font-weight: bold;
}

.consultation-count {
  color: #909399;
  font-size: 14px;
}

.expert-footer {
  display: flex;
  justify-content: space-between;
  margin-top: 15px;
}
</style>
