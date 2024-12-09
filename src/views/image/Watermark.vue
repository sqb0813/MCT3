<template>
  <div class="app-container">
    <header class="app-header">
      <h1>图片水印</h1>
      <p class="subtitle">为你的图片添加文字或图片水印</p>
    </header>

    <main class="main-content">
      <el-tabs v-model="activeTab" class="watermark-tabs">
        <el-tab-pane label="单张水印" name="single">
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
                <p>支持 PNG、JPG、WebP 等格式</p>
              </div>
            </el-upload>
          </div>

          <!-- 编辑区域 -->
          <div v-else class="edit-section">
            <div class="preview-area">
              <div class="canvas-container" ref="canvasContainer">
                <canvas ref="cacheCanvas" style="display: none"></canvas>
                <canvas
                  ref="canvas"
                  @mousedown="handleDrag"
                  @mousemove="handleDrag"
                  @mouseup="handleDrag"
                ></canvas>
              </div>
            </div>

            <div class="control-panel">
              <el-form :model="watermarkSettings" label-position="top">
                <!-- 水印类型选择 -->
                <el-form-item label="水印类型">
                  <el-radio-group v-model="watermarkSettings.type">
                    <el-radio label="text">文字水印</el-radio>
                    <el-radio label="image">图片水印</el-radio>
                  </el-radio-group>
                </el-form-item>

                <!-- 文字水印设置 -->
                <template v-if="watermarkSettings.type === 'text'">
                  <el-form-item label="水印文字">
                    <el-input
                      v-model="watermarkSettings.text"
                      placeholder="请输入水印文字"
                    />
                  </el-form-item>

                  <el-form-item label="字体">
                    <el-select v-model="watermarkSettings.fontFamily">
                      <el-option label="苹方" value="PingFang SC" />
                      <el-option label="黑体" value="SimHei" />
                      <el-option label="宋体" value="SimSun" />
                    </el-select>
                  </el-form-item>

                  <el-form-item label="字号">
                    <el-slider
                      v-model="watermarkSettings.fontSize"
                      :min="12"
                      :max="72"
                    />
                  </el-form-item>

                  <el-form-item label="颜色">
                    <el-color-picker v-model="watermarkSettings.color" />
                  </el-form-item>
                </template>

                <!-- 图片水印设置 -->
                <template v-if="watermarkSettings.type === 'image'">
                  <el-form-item label="水印图片">
                    <el-upload
                      class="watermark-image-upload"
                      :auto-upload="false"
                      accept="image/*"
                      :show-file-list="false"
                      @change="handleWatermarkImageChange"
                    >
                      <el-button type="primary">选择水印图片</el-button>
                    </el-upload>
                  </el-form-item>
                </template>

                <!-- 通用设置 -->
                <el-form-item label="透明度">
                  <el-slider
                    v-model="watermarkSettings.opacity"
                    :min="0"
                    :max="100"
                  />
                </el-form-item>

                <el-form-item label="位置">
                  <el-radio-group v-model="watermarkSettings.position">
                    <el-radio-button label="topLeft">左上</el-radio-button>
                    <el-radio-button label="topRight">右上</el-radio-button>
                    <el-radio-button label="bottomLeft">左下</el-radio-button>
                    <el-radio-button label="bottomRight">右下</el-radio-button>
                    <el-radio-button label="center">居中</el-radio-button>
                    <el-radio-button label="custom">自定义</el-radio-button>
                  </el-radio-group>
                </el-form-item>

                <div class="action-buttons">
                  <el-button
                    type="primary"
                    @click="applyWatermark"
                    :loading="processing"
                  >
                    应用水印
                  </el-button>
                  <el-button @click="resetImage">重新选择</el-button>
                  <el-button
                    type="success"
                    @click="downloadImage"
                    :disabled="!hasWatermark"
                  >
                    下载图片
                  </el-button>
                </div>
              </el-form>
            </div>
          </div>
        </el-tab-pane>

        <el-tab-pane label="批量水印" name="batch">
          <div class="batch-section">
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
                  <p>支持 PNG、JPG、WebP 等格式</p>
                </div>
              </el-upload>
            </div>

            <div v-else class="batch-content">
              <div class="batch-main">
                <div class="preview-area" v-if="batchFiles.length">
                  <div
                    class="canvas-container"
                    ref="batchCanvasContainer"
                    style="min-height: 200px"
                  >
                    <canvas
                      ref="batchCacheCanvas"
                      style="display: none"
                    ></canvas>
                    <canvas ref="batchCanvas"></canvas>
                  </div>
                </div>

                <div class="control-panel">
                  <el-form :model="batchWatermarkSettings" label-position="top">
                    <el-form-item label="水印类型">
                      <el-radio-group v-model="batchWatermarkSettings.type">
                        <el-radio label="text">文字水印</el-radio>
                        <el-radio label="image">图片水印</el-radio>
                      </el-radio-group>
                    </el-form-item>

                    <template v-if="batchWatermarkSettings.type === 'text'">
                      <el-form-item label="水印文字">
                        <el-input
                          v-model="batchWatermarkSettings.text"
                          placeholder="请输入水印文字"
                        />
                      </el-form-item>

                      <el-form-item label="字体">
                        <el-select v-model="batchWatermarkSettings.fontFamily">
                          <el-option label="苹方" value="PingFang SC" />
                          <el-option label="黑体" value="SimHei" />
                          <el-option label="宋体" value="SimSun" />
                        </el-select>
                      </el-form-item>

                      <el-form-item label="字号">
                        <el-slider
                          v-model="batchWatermarkSettings.fontSize"
                          :min="12"
                          :max="72"
                        />
                      </el-form-item>

                      <el-form-item label="颜色">
                        <el-color-picker
                          v-model="batchWatermarkSettings.color"
                        />
                      </el-form-item>
                    </template>

                    <template v-if="batchWatermarkSettings.type === 'image'">
                      <el-form-item label="水印图片">
                        <el-upload
                          class="watermark-image-upload"
                          :auto-upload="false"
                          accept="image/*"
                          :show-file-list="false"
                          @change="handleBatchWatermarkImageChange"
                        >
                          <el-button type="primary">选择水印图片</el-button>
                        </el-upload>
                      </el-form-item>
                    </template>

                    <el-form-item label="透明度">
                      <el-slider
                        v-model="batchWatermarkSettings.opacity"
                        :min="0"
                        :max="100"
                      />
                    </el-form-item>

                    <el-form-item label="位置">
                      <el-radio-group v-model="batchWatermarkSettings.position">
                        <el-radio-button label="topLeft">左上</el-radio-button>
                        <el-radio-button label="topRight">右上</el-radio-button>
                        <el-radio-button label="bottomLeft"
                          >左下</el-radio-button
                        >
                        <el-radio-button label="bottomRight"
                          >右下</el-radio-button
                        >
                        <el-radio-button label="center">居中</el-radio-button>
                      </el-radio-group>
                    </el-form-item>
                  </el-form>
                </div>
              </div>

              <div class="batch-footer">
                <div class="files-list">
                  <el-table :data="batchFiles" style="width: 100%">
                    <el-table-column label="文件名" prop="name" />
                    <el-table-column label="预览" width="100">
                      <template #default="{ row }">
                        <el-button
                          link
                          type="primary"
                          @click="previewBatchImage(row)"
                        >
                          预览
                        </el-button>
                      </template>
                    </el-table-column>
                    <el-table-column label="状态" width="120">
                      <template #default="{ row }">
                        <el-tag :type="getStatusType(row.status)">
                          {{ getStatusText(row.status) }}
                        </el-tag>
                      </template>
                    </el-table-column>
                    <el-table-column label="操作" width="120">
                      <template #default="{ row }">
                        <el-button
                          link
                          type="primary"
                          @click="downloadSingleBatchImage(row)"
                          :disabled="row.status !== 'done'"
                        >
                          下载
                        </el-button>
                      </template>
                    </el-table-column>
                  </el-table>
                </div>

                <div class="batch-actions">
                  <el-button
                    type="primary"
                    @click="applyBatchWatermark"
                    :loading="processing"
                  >
                    批量添加水印
                  </el-button>
                  <el-button @click="resetBatchFiles">重新选择</el-button>
                  <el-button
                    type="success"
                    @click="downloadBatchImages"
                    :disabled="!hasBatchWatermark"
                  >
                    下载全部
                  </el-button>
                </div>
              </div>
            </div>
          </div>
        </el-tab-pane>
      </el-tabs>
    </main>
  </div>
</template>

<script setup>
import { ref, reactive, onMounted, watch, nextTick } from "vue";
import { ElMessage } from "element-plus";
import { UploadFilled } from "@element-plus/icons-vue";

// 状态变量
const currentImage = ref(null);
const canvas = ref(null);
const canvasContainer = ref(null);
const processing = ref(false);
const hasWatermark = ref(false);
const activeTab = ref("single");
const cacheCanvas = ref(null);
const batchCanvas = ref(null);
const batchCanvasContainer = ref(null);
const batchFiles = ref([]);
const hasBatchWatermark = ref(false);

// 水印设置
const watermarkSettings = reactive({
  type: "text",
  text: "水印文字",
  fontFamily: "PingFang SC",
  fontSize: 24,
  color: "#000000",
  opacity: 50,
  position: "bottomRight",
  watermarkImage: null,
  x: 0,
  y: 0,
});

// 添加批量水印的设置
const batchWatermarkSettings = reactive({
  type: "text",
  text: "水印文字",
  fontFamily: "PingFang SC",
  fontSize: 24,
  color: "#000000",
  opacity: 50,
  position: "bottomRight",
  watermarkImage: null,
});

// 处理图片上传
const handleFileChange = (file) => {
  const fileObj = file.raw;
  if (!fileObj) return;

  if (!fileObj.type.startsWith("image/")) {
    ElMessage.error("请上传图片文件");
    return;
  }

  currentImage.value = fileObj;
  loadImage();
};

// 加载图片到画布
const loadImage = () => {
  if (!canvas.value || !cacheCanvas.value) {
    setTimeout(loadImage, 50);
    return;
  }

  const img = new Image();

  img.onload = () => {
    // 设置缓存画布尺寸并绘制原始图片
    cacheCanvas.value.width = img.width;
    cacheCanvas.value.height = img.height;
    const cacheCtx = cacheCanvas.value.getContext("2d");
    cacheCtx.drawImage(img, 0, 0);

    // 设置显示画布尺寸
    canvas.value.width = img.width;
    canvas.value.height = img.height;

    // 调整容器大小（只在首次加载时调整）
    if (!canvasContainer.value.style.width) {
      const container = canvasContainer.value;
      const maxWidth = container.clientWidth;
      const scale = maxWidth / img.width;

      if (scale < 1) {
        container.style.width = maxWidth + "px";
        container.style.height = img.height * scale + "px";
      } else {
        container.style.width = img.width + "px";
        container.style.height = img.height + "px";
      }
    }

    // 重新绘制图片
    refreshCanvas();
  };

  img.src = URL.createObjectURL(currentImage.value);
};

// 添加刷新画布函数
const refreshCanvas = () => {
  const ctx = canvas.value.getContext("2d");
  ctx.clearRect(0, 0, canvas.value.width, canvas.value.height);
  ctx.drawImage(cacheCanvas.value, 0, 0);
};

// 应用水印
const applyWatermark = async () => {
  if (!currentImage.value) return;

  processing.value = true;
  const ctx = canvas.value.getContext("2d");

  try {
    // 重新绘制原始图片
    refreshCanvas();

    // 应用水印
    if (watermarkSettings.type === "text") {
      // 应用文字水印
      ctx.globalAlpha = watermarkSettings.opacity / 100;
      ctx.fillStyle = watermarkSettings.color;
      ctx.font = `${watermarkSettings.fontSize}px ${watermarkSettings.fontFamily}`;

      const position = calculatePosition(
        ctx.measureText(watermarkSettings.text).width,
        watermarkSettings.fontSize
      );

      ctx.fillText(watermarkSettings.text, position.x, position.y);
    } else {
      // 应用图片水印
      if (watermarkSettings.watermarkImage) {
        const watermarkImg = new Image();
        watermarkImg.src = URL.createObjectURL(
          watermarkSettings.watermarkImage
        );

        await new Promise((resolve) => {
          watermarkImg.onload = () => {
            ctx.globalAlpha = watermarkSettings.opacity / 100;
            const position = calculatePosition(
              watermarkImg.width,
              watermarkImg.height
            );
            ctx.drawImage(watermarkImg, position.x, position.y);
            resolve();
          };
        });
      }
    }

    hasWatermark.value = true;
    ElMessage.success("水印添加成功");
  } catch (error) {
    ElMessage.error("水印添加失败");
    console.error(error);
  } finally {
    processing.value = false;
    ctx.globalAlpha = 1;
  }
};

// 计算水印位置
const calculatePosition = (width, height) => {
  const canvasWidth = canvas.value.width;
  const canvasHeight = canvas.value.height;
  const padding = 20;

  if (watermarkSettings.position === "custom") {
    // 如果是首次设置自定义位置，将水印放在中心
    if (watermarkSettings.x === 0 && watermarkSettings.y === 0) {
      watermarkSettings.x = (canvasWidth - width) / 2;
      watermarkSettings.y = (canvasHeight + height) / 2;
    }
    return {
      x: Math.min(Math.max(watermarkSettings.x, 0), canvasWidth - width),
      y: Math.min(Math.max(watermarkSettings.y, 0), canvasHeight - height),
    };
  }

  const positions = {
    topLeft: { x: padding, y: padding + height },
    topRight: { x: canvasWidth - width - padding, y: padding + height },
    bottomLeft: { x: padding, y: canvasHeight - padding },
    bottomRight: {
      x: canvasWidth - width - padding,
      y: canvasHeight - padding,
    },
    center: { x: (canvasWidth - width) / 2, y: (canvasHeight + height) / 2 },
  };

  return positions[watermarkSettings.position];
};

// 处理水印图片上传
const handleWatermarkImageChange = (file) => {
  watermarkSettings.watermarkImage = file.raw;
};

// 下载处理后的图片
const downloadImage = () => {
  const link = document.createElement("a");
  link.download = `watermarked_${currentImage.value.name}`;
  link.href = canvas.value.toDataURL();
  link.click();
};

// 重置
const resetImage = () => {
  currentImage.value = null;
  hasWatermark.value = false;
  watermarkSettings.watermarkImage = null;
};

// 修改拖拽功能实现
let isDragging = false;
let startX = 0;
let startY = 0;
let dragDebounceTimer = null;
let isFirstDrag = true;

const handleDrag = (event) => {
  if (watermarkSettings.position !== "custom") return;

  const rect = canvas.value.getBoundingClientRect();
  const scale = canvas.value.width / rect.width;

  switch (event.type) {
    case "mousedown":
      isDragging = true;
      isFirstDrag = true;
      startX = event.clientX;
      startY = event.clientY;
      break;

    case "mousemove":
      if (!isDragging) return;

      const deltaX = (event.clientX - startX) * scale;
      const deltaY = (event.clientY - startY) * scale;

      watermarkSettings.x += deltaX;
      watermarkSettings.y += deltaY;

      startX = event.clientX;
      startY = event.clientY;

      // 使用防抖处理水印应用
      if (dragDebounceTimer) clearTimeout(dragDebounceTimer);
      dragDebounceTimer = setTimeout(() => {
        refreshCanvas();
        updateWatermark();
      }, 16);
      break;

    case "mouseup":
      isDragging = false;
      if (dragDebounceTimer) {
        clearTimeout(dragDebounceTimer);
        if (!isFirstDrag) {
          applyWatermark();
        }
      }
      isFirstDrag = false;
      break;
  }
};

// 添加更新水印函数（不显示提示）
const updateWatermark = async () => {
  if (!currentImage.value) return;

  const ctx = canvas.value.getContext("2d");

  try {
    // 重新绘制原始图片
    refreshCanvas();

    // 应用水印
    if (watermarkSettings.type === "text") {
      ctx.globalAlpha = watermarkSettings.opacity / 100;
      ctx.fillStyle = watermarkSettings.color;
      ctx.font = `${watermarkSettings.fontSize}px ${watermarkSettings.fontFamily}`;

      const position = calculatePosition(
        ctx.measureText(watermarkSettings.text).width,
        watermarkSettings.fontSize
      );

      ctx.fillText(watermarkSettings.text, position.x, position.y);
    } else if (watermarkSettings.watermarkImage) {
      const watermarkImg = new Image();
      watermarkImg.src = URL.createObjectURL(watermarkSettings.watermarkImage);

      await new Promise((resolve) => {
        watermarkImg.onload = () => {
          ctx.globalAlpha = watermarkSettings.opacity / 100;
          const position = calculatePosition(
            watermarkImg.width,
            watermarkImg.height
          );
          ctx.drawImage(watermarkImg, position.x, position.y);
          resolve();
        };
      });
    }
  } finally {
    ctx.globalAlpha = 1;
  }
};

// 修改水印设置监听
watch(
  watermarkSettings,
  (newVal, oldVal) => {
    if (currentImage.value) {
      // 当切换到自定义位置时，重置坐标
      if (newVal.position === "custom" && oldVal.position !== "custom") {
        watermarkSettings.x = 0;
        watermarkSettings.y = 0;
      }
      nextTick(() => {
        loadImage();
        if (hasWatermark.value) {
          updateWatermark();
        }
      });
    }
  },
  { deep: true }
);

onMounted(() => {
  // 确保组件完全挂载后再初始化
  nextTick(() => {
    if (currentImage.value) {
      loadImage();
    }
  });
});

// 添加批量处理相关函数
const handleBatchFilesChange = (file) => {
  const fileObj = file.raw;
  if (!fileObj) return;

  if (!fileObj.type.startsWith("image/")) {
    ElMessage.error("请上传图片文件");
    return;
  }

  batchFiles.value.push({
    id: Date.now() + Math.random(),
    name: fileObj.name,
    file: fileObj,
    status: "pending",
    processedBlob: null,
  });

  // 如果是第一个文件，自动加载预览
  if (batchFiles.value.length === 1) {
    nextTick(() => {
      previewBatchImage(batchFiles.value[0]);
    });
  }
};

const previewBatchImage = (file) => {
  if (!batchCanvas.value) return;

  const ctx = batchCanvas.value.getContext("2d");
  const img = new Image();

  img.onload = () => {
    batchCanvas.value.width = img.width;
    batchCanvas.value.height = img.height;
    ctx.clearRect(0, 0, img.width, img.height);
    ctx.drawImage(img, 0, 0);

    // 立即应用水印预览
    if (batchWatermarkSettings.type === "text") {
      ctx.globalAlpha = batchWatermarkSettings.opacity / 100;
      ctx.fillStyle = batchWatermarkSettings.color;
      ctx.font = `${batchWatermarkSettings.fontSize}px ${batchWatermarkSettings.fontFamily}`;

      const position = calculatePositionForBatch(
        ctx.measureText(batchWatermarkSettings.text).width,
        batchWatermarkSettings.fontSize,
        batchCanvas.value
      );

      ctx.fillText(batchWatermarkSettings.text, position.x, position.y);
      ctx.globalAlpha = 1;
    } else if (batchWatermarkSettings.watermarkImage) {
      const watermarkImg = new Image();
      watermarkImg.onload = () => {
        ctx.globalAlpha = batchWatermarkSettings.opacity / 100;
        const position = calculatePositionForBatch(
          watermarkImg.width,
          watermarkImg.height,
          batchCanvas.value
        );
        ctx.drawImage(watermarkImg, position.x, position.y);
        ctx.globalAlpha = 1;
      };
      watermarkImg.src = URL.createObjectURL(
        batchWatermarkSettings.watermarkImage
      );
    }

    // 调整容器大小
    const container = batchCanvasContainer.value;
    const maxWidth = container.clientWidth;
    const scale = maxWidth / img.width;

    if (scale < 1) {
      container.style.width = maxWidth + "px";
      container.style.height = img.height * scale + "px";
    } else {
      container.style.width = img.width + "px";
      container.style.height = img.height + "px";
    }
  };

  img.src = URL.createObjectURL(file.file);
};

const applyBatchWatermark = async () => {
  if (!batchFiles.value.length) return;

  processing.value = true;

  try {
    for (const file of batchFiles.value) {
      file.status = "processing";
      await processImage(file);
      file.status = "done";
    }

    hasBatchWatermark.value = true;
    ElMessage.success("批量处理完成");
  } catch (error) {
    ElMessage.error("批量处理失败");
    console.error(error);
  } finally {
    processing.value = false;
  }
};

const processImage = async (file) => {
  return new Promise((resolve, reject) => {
    const tempCanvas = document.createElement("canvas");
    const tempCtx = tempCanvas.getContext("2d");
    const img = new Image();

    img.onload = async () => {
      tempCanvas.width = img.width;
      tempCanvas.height = img.height;
      tempCtx.drawImage(img, 0, 0);

      try {
        // 应用水印
        if (batchWatermarkSettings.type === "text") {
          tempCtx.globalAlpha = batchWatermarkSettings.opacity / 100;
          tempCtx.fillStyle = batchWatermarkSettings.color;
          tempCtx.font = `${batchWatermarkSettings.fontSize}px ${batchWatermarkSettings.fontFamily}`;

          const position = calculatePositionForBatch(
            tempCtx.measureText(batchWatermarkSettings.text).width,
            batchWatermarkSettings.fontSize,
            tempCanvas
          );

          tempCtx.fillText(batchWatermarkSettings.text, position.x, position.y);
        } else if (batchWatermarkSettings.watermarkImage) {
          // 处理图片水印
          // ... 类似的图片水印处理逻辑 ...
        }

        // 转换为 Blob
        tempCanvas.toBlob((blob) => {
          if (blob) {
            file.processedBlob = blob;
            resolve(blob);
          } else {
            reject(new Error("转换失败"));
          }
        }, file.file.type);
      } catch (error) {
        reject(error);
      }
    };

    img.onerror = () => reject(new Error("图片加载失败"));
    img.src = URL.createObjectURL(file.file);
  });
};

// 添加批量水印位置计算函数
const calculatePositionForBatch = (width, height, canvas) => {
  const canvasWidth = canvas.width;
  const canvasHeight = canvas.height;
  const padding = 20;

  const positions = {
    topLeft: { x: padding, y: padding + height },
    topRight: { x: canvasWidth - width - padding, y: padding + height },
    bottomLeft: { x: padding, y: canvasHeight - padding },
    bottomRight: {
      x: canvasWidth - width - padding,
      y: canvasHeight - padding,
    },
    center: { x: (canvasWidth - width) / 2, y: (canvasHeight + height) / 2 },
  };

  return positions[batchWatermarkSettings.position];
};

// 修改下载批量图片函数
const downloadBatchImages = () => {
  batchFiles.value.forEach((file) => {
    if (file.status === "done") {
      const link = document.createElement("a");
      link.download = `watermarked_${file.name}`;
      const blob = file.processedBlob || file.file;
      link.href = URL.createObjectURL(blob);
      link.click();
      setTimeout(() => URL.revokeObjectURL(link.href), 100);
    }
  });
};

const resetBatchFiles = () => {
  batchFiles.value = [];
  hasBatchWatermark.value = false;
};

// 状态显示辅助函数
const getStatusText = (status) => {
  const statusMap = {
    pending: "待处理",
    processing: "处理中",
    done: "已完成",
    error: "失败",
  };
  return statusMap[status];
};

const getStatusType = (status) => {
  const typeMap = {
    pending: "info",
    processing: "warning",
    done: "success",
    error: "danger",
  };
  return typeMap[status];
};

// 添加批量水印图片处理函数
const handleBatchWatermarkImageChange = (file) => {
  batchWatermarkSettings.watermarkImage = file.raw;
};

// 添加单个批量图片下载功能
const downloadSingleBatchImage = (file) => {
  if (file.status !== "done") return;

  const link = document.createElement("a");
  link.download = `watermarked_${file.name}`;
  const blob = file.processedBlob || file.file;
  link.href = URL.createObjectURL(blob);
  link.click();
  setTimeout(() => URL.revokeObjectURL(link.href), 100);
};

// 添加批量水印设置变化监听
watch(
  batchWatermarkSettings,
  () => {
    if (batchFiles.value.length > 0) {
      // 重新预览当前显示的图片
      previewBatchImage(batchFiles.value[0]);
    }
  },
  { deep: true }
);
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
  color: var(--el-text-color-primary);
  margin-bottom: 0.5rem;
}

.subtitle {
  color: var(--el-text-color-secondary);
  font-size: 1.1rem;
}

.main-content {
  background: var(--el-bg-color);
  border-radius: 12px;
  padding: 2rem;
  box-shadow: 0 2px 12px rgba(0, 0, 0, 0.1);
}

.upload-section {
  padding: 2rem;
}

.upload-drop-zone {
  border: 2px dashed var(--el-border-color);
  border-radius: 8px;
  padding: 3rem 1rem;
  transition: all 0.3s ease;
}

.upload-drop-zone:hover {
  border-color: var(--el-color-primary);
  background: rgba(var(--el-color-primary-rgb), 0.1);
}

.upload-icon {
  font-size: 3rem;
  color: var(--el-text-color-secondary);
  margin-bottom: 1rem;
}

.edit-section {
  display: grid;
  grid-template-columns: 2fr 1fr;
  gap: 2rem;
}

.preview-area {
  background: var(--el-bg-color-page);
  border-radius: 8px;
  padding: 1rem;
  overflow: hidden;
}

.canvas-container {
  position: relative;
  overflow: auto;
}

.canvas-container canvas {
  max-width: 100%;
  height: auto;
}

.control-panel {
  background: var(--el-bg-color-page);
  border-radius: 8px;
  padding: 1.5rem;
}

.action-buttons {
  display: flex;
  gap: 1rem;
  margin-top: 2rem;
}

:deep(.el-form-item) {
  margin-bottom: 1.5rem;
}

:deep(.el-radio-group) {
  width: 100%;
  display: flex;
  flex-wrap: wrap;
  gap: 0.5rem;
}

:deep(.el-radio-button__inner) {
  border-radius: 6px;
}

.watermark-image-upload {
  width: 100%;
}

.watermark-tabs {
  margin-bottom: 2rem;
}

.batch-section {
  min-height: 400px;
}

.batch-content {
  display: flex;
  flex-direction: column;
  gap: 2rem;
}

.files-list {
  margin: 2rem 0;
}

.batch-actions {
  display: flex;
  gap: 1rem;
  justify-content: center;
  margin-top: 2rem;
}

.batch-main {
  display: grid;
  grid-template-columns: 2fr 1fr;
  gap: 2rem;
  margin-bottom: 2rem;
}

.batch-footer {
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.batch-main .preview-area {
  background: var(--el-bg-color-page);
  border-radius: 8px;
  padding: 1rem;
  overflow: hidden;
  min-height: 300px;
}

.batch-main .canvas-container {
  position: relative;
  overflow: auto;
  display: flex;
  justify-content: center;
  align-items: center;
}

.batch-main .canvas-container canvas {
  max-width: 100%;
  height: auto;
  box-shadow: 0 2px 12px rgba(0, 0, 0, 0.1);
}
</style>
