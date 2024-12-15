<template>
  <div class="app-container">
    <header class="app-header">
      <h1>批量图片压缩</h1>
      <p class="subtitle">一次性压缩多张图片，提高效率</p>
    </header>

    <main class="main-content">
      <!-- 上传区域 -->
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

      <!-- 文件列表和压缩控制 -->
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
              :disabled="!hasCompressedFiles"
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
                  row.compressedSize ? formatFileSize(row.compressedSize) : "-"
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
                <el-tag :type="getStatusType(row.status)">{{
                  getStatusText(row.status)
                }}</el-tag>
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
    </main>
  </div>
</template>

<script setup>
import { ref, computed } from "vue";
import { UploadFilled } from "@element-plus/icons-vue";
import { ElMessage } from "element-plus";
import { useCompressStore } from "@/stores/compress";

const compressStore = useCompressStore();

// 状态变量
const files = ref([]);
const compressionSettings = ref({
  quality: 80,
});
const compressing = ref(false);

// 是否有已压缩文件
const hasCompressedFiles = computed(() =>
  files.value.some((file) => file.compressedBlob)
);

// 处理文件上传
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

// 压缩单个图片
const compressImage = async (file) => {
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

// 重置
const resetFiles = () => {
  files.value = [];
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

.compress-section {
  background: var(--card-background);
  border-radius: var(--border-radius);
  padding: 2rem;
  box-shadow: var(--shadow-lg);
}

.compression-controls {
  max-width: 500px;
  margin: 0 auto 2rem;
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

.files-list {
  margin-top: 2rem;
}
</style>
