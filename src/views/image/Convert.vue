<template>
  <div class="app-container">
    <header class="app-header">
      <h1>图片格式转换</h1>
      <p class="subtitle">支持多种图片格式之间的相互转换</p>
    </header>

    <main class="main-content">
      <!-- Tab 切换 -->
      <el-tabs v-model="activeTab" class="convert-tabs">
        <el-tab-pane label="单个转换" name="single">
          <!-- 单个转换的内容 -->
          <!-- 上传区域 -->
          <div class="upload-section" v-if="!currentImage">
            <el-upload
              class="upload-drop-zone"
              drag
              :auto-upload="false"
              accept="image/*"
              :show-file-list="false"
              @change="handleFileChange"
            >
              <el-icon class="upload-icon"><upload-filled /></el-icon>
              <div class="upload-text">
                <h3>将图片拖到此处，或点击上传</h3>
                <p>支持 PNG、JPG、WebP、GIF 等格式</p>
              </div>
            </el-upload>
          </div>

          <!-- 转换区域 -->
          <div v-else class="convert-section">
            <div class="preview-section">
              <div class="image-preview">
                <img :src="previewUrl" alt="预览图" />
              </div>
              <div class="image-info">
                <p>文件名：{{ currentImage.name }}</p>
                <p>
                  原始格式：{{ currentImage.type.split("/")[1].toUpperCase() }}
                </p>
                <p>文件大小：{{ formatFileSize(currentImage.size) }}</p>
              </div>
            </div>

            <div class="convert-controls">
              <el-form :model="convertSettings" label-position="top">
                <el-form-item label="目标格式">
                  <el-select
                    v-model="convertSettings.format"
                    class="format-select"
                  >
                    <el-option
                      v-for="format in supportedFormats"
                      :key="format.value"
                      :label="format.label"
                      :value="format.value"
                    />
                  </el-select>
                </el-form-item>

                <el-form-item label="图片质量" v-if="showQualitySlider">
                  <el-slider
                    v-model="convertSettings.quality"
                    :min="1"
                    :max="100"
                    :format-tooltip="(value) => value + '%'"
                  />
                </el-form-item>
              </el-form>

              <div class="action-buttons">
                <el-button
                  type="primary"
                  @click="convertImage"
                  :loading="converting"
                >
                  开始转换
                </el-button>
                <el-button @click="resetImage">重新选择</el-button>
                <el-button
                  type="success"
                  @click="downloadImage"
                  :disabled="!convertedImage"
                >
                  下载图片
                </el-button>
              </div>
            </div>
          </div>
        </el-tab-pane>

        <el-tab-pane label="批量转换" name="batch">
          <!-- 批量转换的内容 -->
          <div class="batch-convert-section">
            <!-- 批量上传区域 -->
            <div class="upload-section" v-if="!batchFiles.length">
              <el-upload
                class="upload-drop-zone"
                drag
                multiple
                :auto-upload="false"
                accept="image/*"
                :show-file-list="false"
                @change="handleBatchFilesChange"
              >
                <el-icon class="upload-icon"><upload-filled /></el-icon>
                <div class="upload-text">
                  <h3>将多张图片拖到此处，或点击上传</h3>
                  <p>支持 PNG、JPG、WebP、GIF 等格式</p>
                </div>
              </el-upload>
            </div>

            <!-- 批量文件列表和转换控制 -->
            <div v-else class="batch-files-section">
              <!-- 批量转换设置 -->
              <div class="batch-controls">
                <el-form :model="convertSettings" label-position="top">
                  <el-form-item label="目标格式">
                    <el-select
                      v-model="convertSettings.format"
                      class="format-select"
                    >
                      <el-option
                        v-for="format in supportedFormats"
                        :key="format.value"
                        :label="format.label"
                        :value="format.value"
                      />
                    </el-select>
                  </el-form-item>

                  <el-form-item label="图片质量" v-if="showQualitySlider">
                    <el-slider
                      v-model="convertSettings.quality"
                      :min="1"
                      :max="100"
                      :format-tooltip="(value) => value + '%'"
                    />
                  </el-form-item>
                </el-form>

                <div class="action-buttons">
                  <el-button
                    type="primary"
                    @click="convertBatchImages"
                    :loading="converting"
                  >
                    开始转换
                  </el-button>
                  <el-button @click="resetBatchFiles">重新选择</el-button>
                  <el-button
                    type="success"
                    @click="downloadAllImages"
                    :disabled="!hasConvertedFiles"
                  >
                    下载全部
                  </el-button>
                </div>
              </div>

              <!-- 文件列表 -->
              <div class="files-list">
                <el-table :data="batchFiles" style="width: 100%">
                  <el-table-column label="文件名" prop="name" />
                  <el-table-column label="原始格式" width="120">
                    <template #default="{ row }">
                      {{ row.type.split("/")[1].toUpperCase() }}
                    </template>
                  </el-table-column>
                  <el-table-column label="状态" width="120">
                    <template #default="{ row }">
                      <el-tag :type="getStatusType(row.status)">
                        {{ getStatusText(row.status) }}
                      </el-tag>
                    </template>
                  </el-table-column>
                  <el-table-column label="操作" width="120" align="center">
                    <template #default="{ row }">
                      <el-button
                        link
                        type="primary"
                        @click="downloadSingleImage(row)"
                        :disabled="!row.convertedBlob"
                      >
                        下载
                      </el-button>
                    </template>
                  </el-table-column>
                </el-table>
              </div>
            </div>
          </div>
        </el-tab-pane>
      </el-tabs>
    </main>
  </div>
</template>

<script setup>
import { ref, computed } from "vue";
import { UploadFilled } from "@element-plus/icons-vue";
import { ElMessage } from "element-plus";

// 当前激活的 tab
const activeTab = ref("single");

// 支持的格式列表
const supportedFormats = [
  { label: "PNG", value: "png" },
  { label: "JPEG", value: "jpeg" },
  { label: "WebP", value: "webp" },
];

// 单个转换相关的状态变量
const currentImage = ref(null);
const previewUrl = ref("");
const convertedImage = ref(null);
const converting = ref(false);

// 批量转换相关的状态变量
const batchFiles = ref([]);

// 转换设置
const convertSettings = ref({
  format: "png",
  quality: 90,
});

// 是否显示质量滑块
const showQualitySlider = computed(() =>
  ["jpeg", "webp"].includes(convertSettings.value.format)
);

// 是否有已转换文件
const hasConvertedFiles = computed(() =>
  batchFiles.value.some((file) => file.convertedBlob)
);

// 处理单个文件上传
const handleFileChange = (file) => {
  const fileObj = file.raw;
  if (!fileObj) return;

  // 验证是否为图片
  if (!fileObj.type.startsWith("image/")) {
    ElMessage.error("请上传图片文件");
    return;
  }

  currentImage.value = fileObj;
  previewUrl.value = URL.createObjectURL(fileObj);
};

// 处理批量文件上传
const handleBatchFilesChange = (file) => {
  const fileObj = file.raw;
  if (!fileObj) return;

  // 验证是否为图片
  if (!fileObj.type.startsWith("image/")) {
    ElMessage.error("请上传图片文件");
    return;
  }

  // 添加到文件列表
  batchFiles.value.push({
    id: Date.now() + Math.random(),
    name: fileObj.name,
    type: fileObj.type,
    file: fileObj,
    status: "pending", // pending, converting, done, error
    convertedBlob: null,
  });
};

// 转换单个图片
const convertImage = async () => {
  if (!currentImage.value || converting.value) return;

  converting.value = true;
  try {
    const blob = await convertSingleImage(currentImage.value);
    convertedImage.value = blob;
    ElMessage.success("转换成功");
  } catch (error) {
    ElMessage.error("转换失败，请重试");
    console.error(error);
  } finally {
    converting.value = false;
  }
};

// 转换批量图片
const convertBatchImages = async () => {
  if (converting.value) return;
  converting.value = true;

  try {
    for (const file of batchFiles.value) {
      if (file.status === "done") continue;

      file.status = "converting";
      try {
        const blob = await convertSingleImage(file.file);
        file.convertedBlob = blob;
        file.status = "done";
      } catch (err) {
        file.status = "error";
        ElMessage.error(`转换失败: ${file.name}`);
      }
    }
  } finally {
    converting.value = false;
  }
};

// 图片转换核心逻辑
const convertSingleImage = async (file) => {
  return new Promise((resolve, reject) => {
    const canvas = document.createElement("canvas");
    const ctx = canvas.getContext("2d");
    const img = new Image();

    img.onload = () => {
      canvas.width = img.width;
      canvas.height = img.height;
      ctx.drawImage(img, 0, 0);

      const quality = ["jpeg", "webp"].includes(convertSettings.value.format)
        ? convertSettings.value.quality / 100
        : undefined;

      canvas.toBlob(
        (blob) => {
          if (blob) {
            resolve(blob);
          } else {
            reject(new Error("转换失败"));
          }
        },
        `image/${convertSettings.value.format}`,
        quality
      );
    };

    img.onerror = () => reject(new Error("图片加载失败"));
    img.src = URL.createObjectURL(file);
  });
};

// 下载单个转换后的图片
const downloadImage = () => {
  if (!convertedImage.value) return;

  const link = document.createElement("a");
  const fileName = currentImage.value.name.split(".")[0];
  link.download = `${fileName}.${convertSettings.value.format}`;
  link.href = URL.createObjectURL(convertedImage.value);
  link.click();
};

// 下载批量转换后的单个图片
const downloadSingleImage = (file) => {
  if (!file.convertedBlob) return;

  const link = document.createElement("a");
  const fileName = file.name.split(".")[0];
  link.download = `${fileName}.${convertSettings.value.format}`;
  link.href = URL.createObjectURL(file.convertedBlob);
  link.click();
};

// 下载所有转换后的图片
const downloadAllImages = () => {
  batchFiles.value
    .filter((file) => file.convertedBlob)
    .forEach((file) => downloadSingleImage(file));
};

// 重置单个转换
const resetImage = () => {
  currentImage.value = null;
  previewUrl.value = "";
  convertedImage.value = null;
  convertSettings.value.format = "png";
  convertSettings.value.quality = 90;
};

// 重置批量转换
const resetBatchFiles = () => {
  batchFiles.value = [];
};

// 格式化文件大小
const formatFileSize = (bytes) => {
  if (bytes === 0) return "0 B";
  const k = 1024;
  const sizes = ["B", "KB", "MB", "GB"];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return `${(bytes / Math.pow(k, i)).toFixed(2)} ${sizes[i]}`;
};

// 获取状态文本
const getStatusText = (status) => {
  const statusMap = {
    pending: "待处理",
    converting: "转换中",
    done: "已完成",
    error: "失败",
  };
  return statusMap[status];
};

// 获取状态类型
const getStatusType = (status) => {
  const typeMap = {
    pending: "info",
    converting: "warning",
    done: "success",
    error: "danger",
  };
  return typeMap[status];
};
</script>

<style scoped>
.app-container {
  max-width: 1200px;
  margin: 0 auto;
  padding: 2rem;
}

.app-header {
  text-align: center;
  margin-bottom: 3rem;
}

.app-header h1 {
  font-size: 2.5rem;
  font-weight: 600;
  color: var(--text-primary);
  margin-bottom: 0.5rem;
}

.subtitle {
  color: var(--text-secondary);
  font-size: 1.1rem;
}

/* Tab 相关样式 */
.convert-tabs {
  background: var(--card-background);
  border-radius: var(--border-radius);
  padding: 2rem;
  box-shadow: var(--shadow-lg);
}

.convert-tabs :deep(.el-tabs__nav-wrap::after) {
  height: 1px;
  background-color: var(--border-color);
}

.convert-tabs :deep(.el-tabs__item) {
  font-size: 1.1rem;
  padding: 0 2rem;
}

.convert-tabs :deep(.el-tabs__item.is-active) {
  color: #34c759;
}

.convert-tabs :deep(.el-tabs__active-bar) {
  background-color: #34c759;
}

/* 上传区域样式 */
.upload-section {
  background: var(--card-background);
  border-radius: var(--border-radius);
  padding: 2rem;
}

.upload-drop-zone {
  border: 2px dashed #e5e5e5;
  border-radius: var(--border-radius);
  padding: 3rem 1rem;
  transition: all 0.3s ease;
}

.upload-drop-zone:hover {
  border-color: #34c759;
  background: rgba(52, 199, 89, 0.04);
}

.upload-icon {
  font-size: 3rem;
  color: #909399;
  margin-bottom: 1rem;
}

/* 转换区域样式 */
.convert-section,
.batch-files-section {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 2rem;
  margin-top: 2rem;
}

.preview-section {
  text-align: center;
}

.image-preview {
  margin-bottom: 1rem;
  border-radius: var(--border-radius);
  overflow: hidden;
  box-shadow: var(--shadow-md);
}

.image-preview img {
  max-width: 100%;
  height: auto;
}

.image-info,
.convert-controls,
.batch-controls {
  padding: 2rem;
  background: rgba(245, 245, 247, 0.6);
  border-radius: var(--border-radius);
}

.format-select {
  width: 100%;
}

.action-buttons {
  display: flex;
  gap: 1rem;
  justify-content: center;
  margin-top: 2rem;
}

/* 批量转换特有样式 */
.batch-files-section {
  grid-template-columns: 1fr;
}

.files-list {
  margin-top: 2rem;
}

:deep(.el-button--primary) {
  background: var(--primary-gradient);
  border: none;
}
</style>
