<template>
  <div class="app-container">
    <header class="app-header">
      <h1>文字卡片</h1>
      <p class="subtitle">将文字转换为精美的卡片图片</p>
    </header>

    <main class="main-content">
      <!-- 添加标签页 -->
      <el-tabs v-model="activeTab" class="text-tabs">
        <el-tab-pane label="单张处理" name="single">
          <!-- 单张文字处理区域 -->
          <div class="text-input-section" v-if="!singleText.content">
            <el-input
              type="textarea"
              v-model="tempInputText"
              :rows="6"
              placeholder="请输入要转换的文字内容..."
              resize="none"
              @blur="handleInputBlur"
            />
            <div class="input-tips">
              <el-icon><info-filled /></el-icon>
              <span>支持输入文字、表情符号等内容</span>
            </div>
          </div>

          <div v-else class="process-section single-mode">
            <div class="preview-comparison">
              <!-- 文字预览 -->
              <div class="preview-panel original">
                <h3>原文</h3>
                <div class="text-container">
                  <p>{{ singleText.content }}</p>
                </div>
              </div>

              <!-- 卡片预览 -->
              <div class="preview-panel processed">
                <h3>卡片效果</h3>
                <div class="preview-container">
                  <template v-if="settings.style === 'daily-progress'">
                    <div class="daily-mode">
                      <div class="daily-header">
                        <h2 class="daily-title">{{ settings.mainTitle }}</h2>
                        <p class="daily-subtitle">{{ settings.subTitle }}</p>
                      </div>

                      <div class="daily-divider">
                        <span class="divider-text">{{
                          settings.dividerText
                        }}</span>
                      </div>

                      <div class="avatar-container">
                        <img
                          v-if="settings.avatar"
                          :src="settings.avatar"
                          class="avatar"
                        />
                        <div class="avatar-decorations">
                          <span class="triangle left"></span>
                          <span class="triangle right"></span>
                          <span class="triangle bottom"></span>
                        </div>
                      </div>

                      <div class="daily-content">
                        {{ singleText.content }}
                      </div>
                    </div>
                  </template>
                  <template v-else>
                    <img
                      v-if="singleText.processedPreview"
                      :src="singleText.processedPreview"
                      alt="卡片预览"
                    />
                    <div v-else class="placeholder">
                      <el-icon><picture-rounded /></el-icon>
                      <span>待生成</span>
                    </div>
                  </template>
                </div>
              </div>
            </div>
          </div>
        </el-tab-pane>

        <el-tab-pane label="批量处理" name="batch">
          <!-- 批量处理区域 -->
          <div class="text-input-section" v-if="!texts.length">
            <el-input
              type="textarea"
              v-model="tempBatchInput"
              :rows="8"
              placeholder="请输入要转换的多段文字内容，每段文字用空行分隔..."
              resize="none"
              @blur="handleBatchInputBlur"
            />
            <div class="input-tips">
              <el-icon><info-filled /></el-icon>
              <span>每段文字之间请用空行分隔</span>
            </div>
          </div>

          <div v-else class="process-section batch-mode">
            <!-- 文字列表 -->
            <div class="texts-list">
              <el-scrollbar height="600px">
                <div
                  v-for="(text, index) in texts"
                  :key="index"
                  class="text-item"
                >
                  <div class="preview-comparison">
                    <!-- 文字预览 -->
                    <div class="preview-panel original">
                      <h3>原文</h3>
                      <div class="text-container">
                        <p>{{ text.content }}</p>
                      </div>
                    </div>

                    <!-- 卡片预览 -->
                    <div class="preview-panel processed">
                      <h3>卡片效果</h3>
                      <div class="preview-container">
                        <template v-if="settings.style === 'daily-progress'">
                          <div class="daily-mode">
                            <div class="daily-header">
                              <h2 class="daily-title">
                                {{ settings.mainTitle }}
                              </h2>
                              <p class="daily-subtitle">
                                {{ settings.subTitle }}
                              </p>
                            </div>

                            <div class="daily-divider">
                              <span class="divider-text">{{
                                settings.dividerText
                              }}</span>
                            </div>

                            <div class="avatar-container">
                              <img
                                v-if="settings.avatar"
                                :src="settings.avatar"
                                class="avatar"
                              />
                              <div class="avatar-decorations">
                                <span class="triangle left"></span>
                                <span class="triangle right"></span>
                                <span class="triangle bottom"></span>
                              </div>
                            </div>

                            <div class="daily-content">
                              {{ text.content }}
                            </div>
                          </div>
                        </template>
                        <template v-else>
                          <img
                            v-if="text.processedPreview"
                            :src="text.processedPreview"
                            alt="卡片预览"
                          />
                          <div v-else class="placeholder">
                            <el-icon><picture-rounded /></el-icon>
                            <span>待生成</span>
                          </div>
                        </template>
                      </div>
                    </div>
                  </div>
                </div>
              </el-scrollbar>
            </div>
          </div>
        </el-tab-pane>
      </el-tabs>

      <!-- 控制面板 -->
      <div class="control-panel">
        <el-form :model="settings" label-position="top">
          <!-- 卡片样式选择 -->
          <el-form-item label="卡片样式">
            <el-select v-model="settings.style" class="style-select">
              <el-option
                v-for="style in cardStyles"
                :key="style.value"
                :label="style.label"
                :value="style.value"
              />
            </el-select>
          </el-form-item>

          <!-- 字体选择 -->
          <el-form-item label="字体">
            <el-select v-model="settings.font" class="font-select">
              <el-option
                v-for="font in fonts"
                :key="font.value"
                :label="font.label"
                :value="font.value"
              />
            </el-select>
          </el-form-item>

          <!-- 字体大小滑块 -->
          <el-form-item label="字体大小">
            <div class="font-size-control">
              <el-slider
                v-model="settings.fontSize"
                :min="12"
                :max="72"
                :step="1"
                show-input
                :format-tooltip="(val) => `${val}px`"
              />
            </div>
          </el-form-item>

          <!-- 字体颜色 -->
          <el-form-item label="字体颜色">
            <el-color-picker v-model="settings.textColor" />
          </el-form-item>

          <!-- 背景颜色 -->
          <el-form-item label="背景颜色">
            <el-color-picker v-model="settings.backgroundColor" />
          </el-form-item>

          <!-- 文字旋转控制 -->
          <el-form-item label="文字旋转">
            <div class="rotation-control">
              <el-slider
                v-model="settings.rotation"
                :min="-180"
                :max="180"
                :step="5"
                show-input
                :format-tooltip="(val) => `${val}°`"
              />
            </div>
          </el-form-item>

          <!-- 添加卡片尺寸控制 -->
          <el-form-item label="卡片尺寸">
            <div class="size-control">
              <!-- 宽度控制 -->
              <div class="size-item">
                <span class="size-label">宽度</span>
                <el-slider
                  v-model="settings.width"
                  :min="400"
                  :max="1200"
                  :step="50"
                  show-input
                  :format-tooltip="(val) => `${val}px`"
                />
              </div>
              <!-- 高度控制 -->
              <div class="size-item">
                <span class="size-label">高度</span>
                <el-slider
                  v-model="settings.height"
                  :min="300"
                  :max="900"
                  :step="50"
                  show-input
                  :format-tooltip="(val) => `${val}px`"
                />
              </div>
            </div>
          </el-form-item>

          <!-- 当选择每日精进样式时显示的额外设置 -->
          <template v-if="settings.style === 'daily-progress'">
            <el-form-item label="主标题">
              <el-input
                v-model="settings.mainTitle"
                placeholder="请输入主标题"
              />
            </el-form-item>

            <el-form-item label="副标题">
              <el-input
                v-model="settings.subTitle"
                placeholder="请输入副标题"
              />
            </el-form-item>

            <el-form-item label="分隔线文字">
              <el-input
                v-model="settings.dividerText"
                placeholder="请输入分隔线文字"
              />
            </el-form-item>

            <el-form-item label="头像">
              <el-upload
                class="avatar-uploader"
                action="#"
                :auto-upload="false"
                :show-file-list="false"
                :on-change="handleAvatarChange"
              >
                <img
                  v-if="settings.avatar"
                  :src="settings.avatar"
                  class="avatar"
                />
                <el-icon v-else class="avatar-uploader-icon"><plus /></el-icon>
              </el-upload>
            </el-form-item>

            <el-form-item label="边框样式">
              <el-select v-model="settings.borderStyle">
                <el-option label="复古风格" value="vintage" />
                <el-option label="梦幻风格" value="dreamy" />
                <el-option label="科幻风格" value="cyberpunk" />
              </el-select>
            </el-form-item>
          </template>
        </el-form>

        <!-- 操作按钮 -->
        <div class="action-buttons">
          <template v-if="activeTab === 'single'">
            <el-button
              type="primary"
              @click="processSingleText"
              :loading="processing"
              :disabled="!singleText.content"
            >
              {{ processing ? "生成中..." : "生成卡片" }}
            </el-button>
            <el-button @click="resetSingleText">重新输入</el-button>
            <el-button
              type="success"
              @click="downloadSingleCard"
              :disabled="!singleText.processedPreview"
            >
              下载卡片
            </el-button>
          </template>
          <template v-else>
            <el-button
              type="primary"
              @click="processAllTexts"
              :loading="batchProcessing"
              :disabled="!hasUnprocessedTexts"
            >
              {{ batchProcessing ? "批量生成中..." : "批量生成" }}
            </el-button>
            <el-button @click="resetTexts">重新输入</el-button>
            <el-button
              type="success"
              @click="downloadAllCards"
              :disabled="!hasProcessedTexts"
            >
              打包下载
            </el-button>
          </template>
        </div>
      </div>
    </main>
  </div>
</template>

<script setup>
import { ref, onMounted, onUnmounted, computed, watch } from "vue";
import { ElMessage } from "element-plus";
import { InfoFilled, PictureRounded, Plus } from "@element-plus/icons-vue";

// Web Worker 实例
let worker = null;

// 状态变量
const activeTab = ref("single");
const singleText = ref({
  content: "",
  processedPreview: "",
});
const texts = ref([]);
const batchInput = ref("");
const processing = ref(false);
const batchProcessing = ref(false);

// 卡片样式选项
const cardStyles = [
  { label: "简约白", value: "simple-white" },
  { label: "渐变蓝", value: "gradient-blue" },
  { label: "暖色调", value: "warm" },
  { label: "深色模式", value: "dark" },
  { label: "星空夜景", value: "starry-night" },
  { label: "霓虹灯", value: "neon" },
  { label: "水彩画", value: "watercolor" },
  { label: "复古", value: "vintage" },
  { label: "每日精进", value: "daily-progress" },
];

// 字体选项
const fonts = [
  { label: "思源黑体", value: "Source Han Sans CN" },
  { label: "思源宋体", value: "Source Han Serif CN" },
  { label: "阿里巴巴普惠体", value: "Alibaba PuHuiTi" },
  { label: "站酷高端黑", value: "ZCOOL KuHei" },
];

// 设置选项
const settings = ref({
  style: "simple-white",
  font: "Source Han Sans CN",
  fontSize: 24,
  textColor: "#333333",
  backgroundColor: "#ffffff",
  rotation: 0,
  width: 800,
  height: 600,
  mainTitle: "每日精进",
  subTitle: "One sentence everyday",
  dividerText: "向内生长",
  avatar: "",
  borderStyle: "vintage",
});

// 计算属性
const hasProcessedTexts = computed(() => {
  return texts.value.some((text) => text.processedPreview);
});

const hasUnprocessedTexts = computed(() => {
  return texts.value.some((text) => !text.processedPreview);
});

// 初始化 Web Worker
onMounted(() => {
  worker = new Worker(new URL("@/workers/textcard.worker.js", import.meta.url));

  worker.onmessage = (e) => {
    const { imageData, type, index } = e.data;

    try {
      if (type === "single") {
        singleText.value.processedPreview = imageData;
        processing.value = false;
        ElMessage.success("卡片生成完成");
      } else if (type === "batch") {
        // 检查索引的有效性
        if (
          typeof index !== "number" ||
          index < 0 ||
          index >= texts.value.length
        ) {
          console.error(`无效的处理结果索引: ${index}`);
          return;
        }

        // 确保目标对象存在
        if (!texts.value[index]) {
          console.error(`texts[${index}] 不存在`);
          return;
        }

        // 更新处理结果
        texts.value[index].processedPreview = imageData;
        texts.value[index].processing = false;

        // 检查是否所有处理都完成
        const allCompleted = !texts.value.some((text) => text.processing);
        if (allCompleted) {
          batchProcessing.value = false;
          ElMessage.success("所有卡片生成完成");
        }
      }
    } catch (error) {
      console.error("处理 Worker 返回结果时出错:", error);
      batchProcessing.value = false;
      ElMessage.error("处理结果时出现错误");
    }
  };

  worker.onerror = (error) => {
    processing.value = false;
    batchProcessing.value = false;
    ElMessage.error("处理失败：" + error.message);
    console.error(error);
  };
});

// 清理 Worker
onUnmounted(() => {
  if (worker) {
    worker.terminate();
  }
});

// 处理单个文字
const processSingleText = async () => {
  if (!singleText.value.content || processing.value) return;

  processing.value = true;
  ElMessage.info("正在生成卡片...");

  const timeout = setTimeout(() => {
    if (processing.value) {
      processing.value = false;
      ElMessage.error("生成超时,请重试");
    }
  }, 20000);

  // 确保传递完整的设置对象
  const workerSettings = {
    ...settings.value,
    style: settings.value.style,
    font: settings.value.font,
    fontSize: settings.value.fontSize,
    textColor: settings.value.textColor.toString(),
    backgroundColor: settings.value.backgroundColor.toString(),
    rotation: settings.value.rotation,
    width: settings.value.width,
    height: settings.value.height,
    mainTitle: settings.value.mainTitle,
    subTitle: settings.value.subTitle,
    dividerText: settings.value.dividerText,
    // 预处理头像数据
    avatar: settings.value.avatar ? settings.value.avatar.split(",")[1] : null, // 只传递 base64 数据部分
  };

  try {
    worker.postMessage({
      type: "single",
      text: singleText.value.content,
      settings: workerSettings,
    });
  } catch (error) {
    clearTimeout(timeout);
    processing.value = false;
    ElMessage.error("生成失败:" + error.message);
  }
};

// 修改批量处理函数
const processAllTexts = async () => {
  if (!texts.value.length || batchProcessing.value) return;

  const validTexts = texts.value.filter((text) => text && text.content.trim());
  if (validTexts.length === 0) {
    ElMessage.warning("没有有效的文本内容需要处理");
    return;
  }

  batchProcessing.value = true;
  ElMessage.info("开始批量生成卡片...");

  const timeout = setTimeout(() => {
    if (batchProcessing.value) {
      batchProcessing.value = false;
      texts.value.forEach((text) => {
        text.processing = false;
      });
      ElMessage.error("批量处理超时,请重试");
    }
  }, 60000);

  // 确保传递完整的设置对象
  const workerSettings = {
    ...settings.value,
    style: settings.value.style,
    font: settings.value.font,
    fontSize: settings.value.fontSize,
    textColor: settings.value.textColor.toString(),
    backgroundColor: settings.value.backgroundColor.toString(),
    rotation: settings.value.rotation,
    width: settings.value.width,
    height: settings.value.height,
    mainTitle: settings.value.mainTitle,
    subTitle: settings.value.subTitle,
    dividerText: settings.value.dividerText,
    // 处理头像数据
    avatar: settings.value.avatar ? settings.value.avatar.toString() : null,
  };

  // 保存当前的文本状态
  const currentTexts = [...texts.value];

  // 创建处理队列
  const processQueue = currentTexts
    .map((text, index) => {
      if (!text.processedPreview && text.content.trim()) {
        return {
          index,
          text: text.content.trim(),
          processing: true,
        };
      }
      return null;
    })
    .filter((item) => item !== null);

  // 更新处理状态
  processQueue.forEach((item) => {
    if (texts.value[item.index]) {
      texts.value[item.index].processing = true;
    }
  });

  // 发送处理任务
  processQueue.forEach((item) => {
    try {
      worker.postMessage({
        type: "batch",
        text: item.text,
        settings: workerSettings,
        index: item.index,
      });
    } catch (error) {
      console.error(`发送任务失败: ${error.message}`);
      if (texts.value[item.index]) {
        texts.value[item.index].processing = false;
      }
    }
  });

  // 如果没有任何任务被发送
  if (processQueue.length === 0) {
    batchProcessing.value = false;
    ElMessage.warning("没有需要处理的新文本");
  }
};

// 添加临时输入变量
const tempInputText = ref("");
const tempBatchInput = ref("");

// 处理单个文本输入框失焦事件
const handleInputBlur = () => {
  if (tempInputText.value.trim()) {
    singleText.value.content = tempInputText.value.trim();
  }
};

// 处理批量输入框失焦事件
const handleBatchInputBlur = () => {
  if (tempBatchInput.value.trim()) {
    // 按空行分割文本并过滤空字符串
    const textArray = tempBatchInput.value
      .split(/\n\s*\n/)
      .filter((text) => text.trim())
      .map((content) => ({
        content: content.trim(),
        processedPreview: "",
        processing: false,
      }));

    texts.value = textArray;
  }
};

// 修改重置函数
const resetSingleText = () => {
  singleText.value = {
    content: "",
    processedPreview: "",
  };
  tempInputText.value = ""; // 重置临时输入
};

const resetTexts = () => {
  texts.value = [];
  tempBatchInput.value = ""; // 重置临时批量输入
  batchInput.value = "";
};

// 下载单个卡片
const downloadSingleCard = () => {
  if (!singleText.value.processedPreview) return;

  const link = document.createElement("a");
  link.download = "text-card.png";
  link.href = singleText.value.processedPreview;
  link.click();
};

// 下载所有卡片
const downloadAllCards = async () => {
  try {
    const JSZip = (await import("jszip")).default;
    const zip = new JSZip();

    texts.value.forEach((text, index) => {
      if (text.processedPreview) {
        const base64Data = text.processedPreview.split(",")[1];
        zip.file(`text-card-${index + 1}.png`, base64Data, { base64: true });
      }
    });

    const content = await zip.generateAsync({ type: "blob" });
    const link = document.createElement("a");
    link.href = URL.createObjectURL(content);
    link.download = "text-cards.zip";
    link.click();

    ElMessage.success("打包下载开始");
  } catch (error) {
    ElMessage.error("下载失败");
    console.error(error);
  }
};

// 修改头像上传处理方法
const handleAvatarChange = (file) => {
  const reader = new FileReader();
  reader.onload = (e) => {
    // 确保头像数据是 base64 格式
    settings.value.avatar = e.target.result;
    // 打印检查头像数据
    console.log(
      "Avatar data:",
      settings.value.avatar.substring(0, 100) + "..."
    );
  };
  reader.readAsDataURL(file.raw);
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
  color: var(--el-text-color-primary);
  margin-bottom: 0.5rem;
}

.subtitle {
  color: var(--el-text-color-secondary);
  font-size: 1.1rem;
}

.text-input-section {
  background: var(--el-bg-color);
  border-radius: 12px;
  padding: 2rem;
  box-shadow: var(--el-box-shadow-light);
}

.input-tips {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  margin-top: 1rem;
  color: var(--el-text-color-secondary);
  font-size: 0.9rem;
}

.process-section {
  display: grid;
  grid-template-columns: 1fr;
  gap: 2rem;
  margin-top: 2rem;
}

.preview-comparison {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 1rem;
  margin-bottom: 1rem;
}

.preview-panel {
  background: var(--el-bg-color);
  border-radius: 12px;
  padding: 1rem;
  box-shadow: var(--el-box-shadow-light);
}

.preview-panel h3 {
  text-align: center;
  margin-bottom: 1rem;
  color: var(--el-text-color-primary);
}

.text-container {
  padding: 1rem;
  background: var(--el-fill-color-lighter);
  border-radius: 8px;
  min-height: 200px;
  white-space: pre-wrap;
}

.preview-container {
  aspect-ratio: auto;
  min-height: 300px;
  max-height: 600px;
}

.preview-container img {
  width: 100%;
  height: 100%;
  object-fit: contain;
}

.placeholder {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 0.5rem;
  color: var(--el-text-color-secondary);
}

.control-panel {
  background: var(--el-bg-color);
  border-radius: 12px;
  padding: 2rem;
  box-shadow: var(--el-box-shadow-light);
  margin-top: 2rem;
}

.style-select,
.font-select {
  width: 100%;
}

.action-buttons {
  display: flex;
  gap: 1rem;
  justify-content: center;
  margin-top: 2rem;
  padding-top: 1rem;
  border-top: 1px solid var(--el-border-color-lighter);
}

.action-buttons .el-button {
  min-width: 100px;
}

.texts-list {
  width: 100%;
}

.text-item {
  margin-bottom: 2rem;
  padding-bottom: 2rem;
  border-bottom: 1px solid var(--el-border-color-lighter);
}

.text-item:last-child {
  margin-bottom: 0;
  padding-bottom: 0;
  border-bottom: none;
}

.text-tabs {
  margin-bottom: 2rem;
}

:deep(.el-tabs__nav-wrap::after) {
  height: 1px;
  background-color: var(--el-border-color-lighter);
}

:deep(.el-tabs__item) {
  font-size: 1.1rem;
  padding: 0 2rem;
}

:deep(.el-tabs__item.is-active) {
  font-weight: 600;
}

.main-content {
  max-width: 1200px;
  margin: 0 auto;
}

:deep(.el-tabs__nav) {
  margin-bottom: 1rem;
}

.font-size-control,
.rotation-control {
  width: 100%;
  padding: 0 10px;
}

/* 添加滑块样式 */
:deep(.el-slider) {
  margin-top: 8px;
}

:deep(.el-slider__input) {
  width: 70px;
  margin-left: 20px;
}

.size-control {
  width: 100%;
  padding: 0 10px;
}

.size-item {
  margin-bottom: 1rem;
}

.size-label {
  display: block;
  margin-bottom: 0.5rem;
  color: var(--el-text-color-secondary);
  font-size: 0.9rem;
}

/* 每日精进模式的样式 */
.daily-mode {
  width: 100%;
  max-width: 600px;
  padding: 30px;
  background: white;
  border-radius: 8px;
  box-shadow: 0 2px 12px rgba(0, 0, 0, 0.1);
}

.daily-header {
  text-align: center;
  margin-bottom: 20px;
}

.daily-title {
  font-size: 28px;
  font-weight: bold;
  margin-bottom: 8px;
}

.daily-subtitle {
  font-size: 16px;
  color: #666;
  font-style: italic;
}

.daily-divider {
  position: relative;
  text-align: center;
  margin: 30px 0;
}

.daily-divider::before,
.daily-divider::after {
  content: "";
  position: absolute;
  top: 50%;
  width: 40%;
  height: 1px;
  background: #ddd;
}

.daily-divider::before {
  left: 0;
}

.daily-divider::after {
  right: 0;
}

.divider-text {
  background: white;
  padding: 0 15px;
  color: #5f9ea0;
  font-size: 16px;
}

.avatar-container {
  position: relative;
  width: 100px;
  height: 100px;
  margin: 30px auto;
}

.avatar {
  width: 100%;
  height: 100%;
  border-radius: 50%;
  object-fit: cover;
}

.avatar-decorations {
  position: absolute;
  width: 100%;
  height: 100%;
}

.triangle {
  position: absolute;
  width: 0;
  height: 0;
  border: 8px solid transparent;
}

.triangle.left {
  left: -20px;
  top: 50%;
  transform: translateY(-50%);
  border-right-color: #5f9ea0;
}

.triangle.right {
  right: -20px;
  top: 50%;
  transform: translateY(-50%);
  border-left-color: #5f9ea0;
}

.triangle.bottom {
  bottom: -20px;
  left: 50%;
  transform: translateX(-50%);
  border-top-color: #5f9ea0;
}

.daily-content {
  text-align: center;
  font-size: 18px;
  line-height: 1.6;
  margin-top: 30px;
  color: #333;
}

/* 头像上传样式 */
.avatar-uploader {
  text-align: center;
}

.avatar-uploader .avatar {
  width: 100px;
  height: 100px;
  border-radius: 50%;
}

.avatar-uploader-icon {
  font-size: 28px;
  color: #8c939d;
  width: 100px;
  height: 100px;
  line-height: 100px;
  text-align: center;
  border: 1px dashed #d9d9d9;
  border-radius: 50%;
}
</style>
