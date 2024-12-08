<template>
  <div class="app-container">
    <header class="app-header">
      <h1>图片压缩工具</h1>
      <p class="subtitle">简单高效的在线图片压缩服务</p>
    </header>

    <main class="main-content">
      <!-- Tab 切换 -->
      <el-tabs v-model="activeTab" class="compress-tabs">
        <el-tab-pane label="单图压缩" name="single">
          <!-- 单图压缩上传区域 -->
          <div class="upload-section" v-if="!originalImage">
            <el-upload
              class="upload-drop-zone"
              drag
              :auto-upload="false"
              accept="image/png,image/jpeg,image/jpg"
              :show-file-list="false"
              @change="handleFileChange"
            >
              <el-icon class="upload-icon"><upload-filled /></el-icon>
              <div class="upload-text">
                <h3>将图片拖到此处，或点击上传</h3>
                <p>支持 PNG、JPG 格式</p>
              </div>
            </el-upload>
          </div>

          <!-- 单图预览和压缩控制区域 -->
          <div v-else class="preview-section">
            <div class="image-comparison">
              <!-- 原图预览 -->
              <div class="image-card">
                <h3>原始图片</h3>
                <div class="image-wrapper">
                  <img :src="originalImageUrl" alt="原始图片" />
                </div>
                <div class="image-info">
                  <p>文件大小：{{ formatFileSize(originalSize) }}</p>
                  <p>
                    尺寸：{{ originalDimensions.width }} x
                    {{ originalDimensions.height }}
                  </p>
                </div>
              </div>

              <!-- 压缩后预览 -->
              <div class="image-card" v-if="compressedImageUrl">
                <h3>压缩后</h3>
                <div class="image-wrapper">
                  <img :src="compressedImageUrl" alt="压缩后图片" />
                </div>
                <div class="image-info">
                  <p>文件大小：{{ formatFileSize(compressedSize) }}</p>
                  <p>压缩率：{{ compressionRatio }}%</p>
                </div>
              </div>
            </div>

            <!-- 压缩控制 -->
            <div class="compression-controls">
              <el-form :model="compressionSettings" label-position="top">
                <el-form-item label="压缩质量">
                  <el-slider
                    v-model="compressionSettings.quality"
                    :min="1"
                    :max="100"
                    @change="handleCompress"
                  />
                </el-form-item>
              </el-form>

              <div class="action-buttons">
                <el-button type="primary" @click="downloadCompressedImage">
                  下载压缩图片
                </el-button>
                <el-button @click="resetImage">重新上传</el-button>
              </div>
            </div>
          </div>
        </el-tab-pane>

        <el-tab-pane label="批量压缩" name="batch">
          <!-- 批量压缩上传区域 -->
          <div class="upload-section" v-if="!files.length">
            <el-upload
              class="upload-drop-zone"
              drag
              multiple
              :auto-upload="false"
              accept="image/png,image/jpeg,image/jpg"
              :show-file-list="false"
              @change="handleFilesChange"
            >
              <el-icon class="upload-icon"><upload-filled /></el-icon>
              <div class="upload-text">
                <h3>将多张图片拖到此处，或点击上传</h3>
                <p>支持 PNG、JPG 格式</p>
              </div>
            </el-upload>
          </div>

          <!-- 批量压缩文件列表和控制区域 -->
          <div v-else class="compress-section">
            <!-- 压缩设置 -->
            <div class="compression-controls">
              <el-form :model="compressionSettings" label-position="top">
                <el-form-item label="压缩质量">
                  <el-slider
                    v-model="compressionSettings.quality"
                    :min="1"
                    :max="100"
                  />
                </el-form-item>
              </el-form>

              <div class="action-buttons">
                <el-button
                  type="primary"
                  @click="compressAll"
                  :loading="compressing"
                >
                  开始压缩
                </el-button>
                <el-button @click="resetFiles">重新选择</el-button>
                <el-button
                  type="success"
                  @click="downloadAll"
                  :disabled="!files.some((f) => f.compressedBlob)"
                >
                  下载全部
                </el-button>
              </div>
            </div>

            <!-- 文件列表 -->
            <div class="files-list">
              <el-table :data="files" style="width: 100%">
                <el-table-column label="文件名" prop="name" />
                <el-table-column label="原始大小" width="120">
                  <template #default="{ row }">
                    {{ formatFileSize(row.size) }}
                  </template>
                </el-table-column>
                <el-table-column label="压缩后大小" width="120">
                  <template #default="{ row }">
                    {{
                      row.compressedSize
                        ? formatFileSize(row.compressedSize)
                        : "-"
                    }}
                  </template>
                </el-table-column>
                <el-table-column label="压缩率" width="120">
                  <template #default="{ row }">
                    {{
                      row.compressedSize
                        ? Math.round(
                            (1 - row.compressedSize / row.size) * 100
                          ).toString() + "%"
                        : "-"
                    }}
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
                      @click="downloadSingle(row)"
                      :disabled="!row.compressedBlob"
                    >
                      下载
                    </el-button>
                  </template>
                </el-table-column>
              </el-table>
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
import { useCompressStore } from "@/stores/compress";

const compressStore = useCompressStore();

// Tab 切换状态
const activeTab = ref("single");

// 单图压缩状态变量
const originalImage = ref(null);
const originalImageUrl = ref("");
const compressedImageUrl = ref("");
const originalSize = ref(0);
const compressedSize = ref(0);
const originalDimensions = ref({ width: 0, height: 0 });
const compressionSettings = ref({
  quality: 80,
});

// 计算压缩率
const compressionRatio = computed(() => {
  if (!originalSize.value || !compressedSize.value) return 0;
  return Math.round((1 - compressedSize.value / originalSize.value) * 100);
});

// 处理文件上传
const handleFileChange = (file) => {
  const fileObj = file.raw;
  if (!fileObj) return;

  // 验证文件类型
  if (!["image/jpeg", "image/png"].includes(fileObj.type)) {
    ElMessage.error("只支持 JPG 和 PNG 格式的图片");
    return;
  }

  originalSize.value = fileObj.size;
  originalImage.value = fileObj;

  // 创建预览URL
  originalImageUrl.value = URL.createObjectURL(fileObj);

  // 获取图片尺寸
  const img = new Image();
  img.onload = () => {
    originalDimensions.value = {
      width: img.width,
      height: img.height,
    };
    handleCompress();
  };
  img.src = originalImageUrl.value;
};

// 压缩图片
const handleCompress = async () => {
  if (!originalImage.value) return;

  const canvas = document.createElement("canvas");
  const ctx = canvas.getContext("2d");
  const img = new Image();

  img.onload = () => {
    canvas.width = img.width;
    canvas.height = img.height;

    ctx.drawImage(img, 0, 0);

    // 进行压缩
    canvas.toBlob(
      (blob) => {
        if (blob) {
          compressedImageUrl.value = URL.createObjectURL(blob);
          compressedSize.value = blob.size;
        }
      },
      originalImage.value.type,
      compressionSettings.value.quality / 100
    );
  };

  img.src = originalImageUrl.value;
};

// 通用压缩图片函数
const compressImage = (file) => {
  return new Promise((resolve, reject) => {
    const canvas = document.createElement("canvas");
    const ctx = canvas.getContext("2d");
    const img = new Image();

    img.onload = () => {
      canvas.width = img.width;
      canvas.height = img.height;
      ctx.drawImage(img, 0, 0);

      canvas.toBlob(
        (blob) => {
          if (blob) {
            resolve(blob);
          } else {
            reject(new Error("压缩失败"));
          }
        },
        file.type,
        compressionSettings.value.quality / 100
      );
    };

    img.onerror = () => reject(new Error("图片加载失败"));
    img.src = URL.createObjectURL(file);
  });
};

// 下载压缩后的图片
const downloadCompressedImage = () => {
  if (!compressedImageUrl.value) return;

  const link = document.createElement("a");
  link.download = `compressed_${originalImage.value.name}`;
  link.href = compressedImageUrl.value;
  link.click();
};

// 重置
const resetImage = () => {
  originalImage.value = null;
  originalImageUrl.value = "";
  compressedImageUrl.value = "";
  originalSize.value = 0;
  compressedSize.value = 0;
  originalDimensions.value = { width: 0, height: 0 };
  compressionSettings.value.quality = 80;
};

// 格式化文件大小
const formatFileSize = (bytes) => {
  if (bytes === 0) return "0 B";
  const k = 1024;
  const sizes = ["B", "KB", "MB", "GB"];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return `${(bytes / Math.pow(k, i)).toFixed(2)} ${sizes[i]}`;
};

// 批量压缩状态变量
const files = ref([]);
const compressing = ref(false);

// 处理批量文件上传
const handleFilesChange = (file) => {
  const fileObj = file.raw;
  if (!fileObj) return;

  // 验证文件类型
  if (!["image/jpeg", "image/png"].includes(fileObj.type)) {
    ElMessage.error("只支持 JPG 和 PNG 格式的图片");
    return;
  }

  // 添加到文件列表
  files.value.push({
    id: Date.now() + Math.random(),
    name: fileObj.name,
    size: fileObj.size,
    type: fileObj.type,
    file: fileObj,
    status: "pending", // pending, compressing, done, error
    compressedBlob: null,
    compressedSize: null,
  });
};

// 压缩所有图片
const compressAll = async () => {
  if (compressing.value) return;
  compressing.value = true;

  try {
    for (const file of files.value) {
      if (file.status === "done") continue;

      file.status = "compressing";
      try {
        const compressedBlob = await compressImage(file.file);
        file.compressedBlob = compressedBlob;
        file.compressedSize = compressedBlob.size;
        file.status = "done";

        // 添加到压缩历史
        compressStore.addHistory({
          name: file.name,
          originalSize: file.size,
          compressedSize: file.compressedSize,
          quality: compressionSettings.value.quality,
        });
      } catch (err) {
        file.status = "error";
        ElMessage.error(`压缩失败: ${file.name}`);
      }
    }
  } finally {
    compressing.value = false;
  }
};

// 下载单个文件
const downloadSingle = (file) => {
  if (!file.compressedBlob) return;

  const link = document.createElement("a");
  link.download = `compressed_${file.name}`;
  link.href = URL.createObjectURL(file.compressedBlob);
  link.click();
};

// 下载所有文件
const downloadAll = () => {
  files.value
    .filter((file) => file.compressedBlob)
    .forEach((file) => downloadSingle(file));
};

// 重置批量文件
const resetFiles = () => {
  files.value = [];
};

// 获取状态文本
const getStatusText = (status) => {
  const statusMap = {
    pending: "待处理",
    compressing: "压缩中",
    done: "已完成",
    error: "失败",
  };
  return statusMap[status];
};

// 获取状态类型
const getStatusType = (status) => {
  const typeMap = {
    pending: "info",
    compressing: "warning",
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

.upload-section {
  background: var(--card-background);
  border-radius: var(--border-radius);
  padding: 2rem;
  box-shadow: var(--shadow-lg);
  transition: transform 0.3s ease, box-shadow 0.3s ease;
}

.upload-section:hover {
  transform: translateY(-2px);
  box-shadow: 0 12px 32px rgba(0, 0, 0, 0.12);
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

.upload-text h3 {
  font-size: 1.2rem;
  color: #303133;
  margin-bottom: 0.5rem;
}

.upload-text p {
  color: #909399;
}

.preview-section {
  background: var(--card-background);
  border-radius: var(--border-radius);
  padding: 2rem;
  box-shadow: var(--shadow-lg);
}

.image-comparison {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  gap: 2rem;
  margin-bottom: 2rem;
}

.image-card {
  background: rgba(245, 245, 247, 0.6);
  border-radius: var(--border-radius);
  padding: 1.5rem;
  transition: transform 0.3s ease;
}

.image-card:hover {
  transform: translateY(-2px);
}

.image-card h3 {
  font-size: 1.1rem;
  color: #303133;
  margin-bottom: 1rem;
}

.image-wrapper {
  border-radius: var(--border-radius);
  overflow: hidden;
  background: white;
  box-shadow: var(--shadow-sm);
}

.image-wrapper img {
  width: 100%;
  height: 100%;
  object-fit: contain;
}

.image-info {
  color: #606266;
  font-size: 0.9rem;
}

.compression-controls {
  max-width: 500px;
  margin: 2rem auto 0;
  padding: 2rem;
  background: rgba(245, 245, 247, 0.6);
  border-radius: var(--border-radius);
}

.action-buttons {
  display: flex;
  gap: 1rem;
  justify-content: center;
  margin-top: 2rem;
}

:deep(.el-slider__runway) {
  margin: 16px 0;
}

:deep(.el-button) {
  border-radius: 8px;
  font-weight: 500;
  transition: all 0.3s ease;
}

:deep(.el-button--primary) {
  background: var(--primary-gradient);
  border: none;
}

:deep(.el-button--primary:hover) {
  transform: translateY(-1px);
  box-shadow: 0 4px 12px rgba(52, 199, 89, 0.3);
}

.compress-tabs {
  background: var(--card-background);
  border-radius: var(--border-radius);
  padding: 1rem;
  box-shadow: var(--shadow-lg);
}

:deep(.el-tabs__header) {
  margin-bottom: 2rem;
}

:deep(.el-tabs__nav-wrap::after) {
  height: 1px;
  background: rgba(0, 0, 0, 0.05);
}

:deep(.el-tabs__item) {
  font-size: 1.1rem;
  padding: 0 2rem;
}

:deep(.el-tabs__item.is-active) {
  color: var(--primary-color);
  font-weight: 600;
}

.files-list {
  margin-top: 2rem;
}

:deep(.el-table) {
  border-radius: var(--border-radius);
  overflow: hidden;
}

:deep(.el-tag) {
  border-radius: 4px;
}
</style>
