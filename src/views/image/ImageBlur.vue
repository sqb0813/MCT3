<template>
  <div class="image-blur-container">
    <header class="app-header">
      <h1>图片模糊化</h1>
      <p class="subtitle">给图片增加模糊效果</p>
    </header>
    <!-- 图片上传区域 -->
    <el-upload
      class="upload-area"
      drag
      :show-file-list="false"
      accept="image/*"
      :on-change="handleImageChange"
      :auto-upload="false"
    >
      <el-icon class="el-icon--upload"><upload-filled /></el-icon>
      <div class="el-upload__text">拖拽图片到此处或 <em>点击上传</em></div>
    </el-upload>

    <!-- 图片预览和编辑区域 -->
    <div v-if="imageUrl" class="preview-area">
      <div class="image-container" ref="imageContainer">
        <!-- 原始图片 -->
        <img :src="imageUrl" ref="previewImage" class="original-image" />

        <!-- 绘制层 Canvas -->
        <canvas
          v-if="blurMode === 'custom'"
          ref="drawCanvas"
          class="draw-canvas"
          @mousedown="startDrawing"
          @mousemove="draw"
          @mouseup="stopDrawing"
          @mouseleave="stopDrawing"
        ></canvas>
      </div>

      <!-- 控制面板 -->
      <div class="control-panel">
        <el-form :model="blurConfig" label-width="100px">
          <!-- 模糊程度 -->
          <el-form-item label="模糊程度">
            <el-select v-model="blurConfig.level">
              <el-option label="低" value="low" />
              <el-option label="中" value="medium" />
              <el-option label="高" value="high" />
            </el-select>
          </el-form-item>

          <!-- 模糊区域 -->
          <el-form-item label="模糊区域">
            <el-select v-model="blurMode">
              <el-option label="全部" value="all" />
              <el-option label="局部" value="partial" />
              <el-option label="自定义" value="custom" />
            </el-select>
          </el-form-item>

          <!-- 区域大小 -->
          <el-form-item label="区域大小">
            <el-select v-model="blurConfig.size">
              <el-option label="小" value="small" />
              <el-option label="中" value="medium" />
              <el-option label="大" value="large" />
            </el-select>
          </el-form-item>

          <!-- 区域位置 -->
          <el-form-item label="区域位置">
            <el-select v-model="blurConfig.position">
              <el-option label="左上" value="top-left" />
              <el-option label="右上" value="top-right" />
              <el-option label="左下" value="bottom-left" />
              <el-option label="右下" value="bottom-right" />
              <el-option label="居中" value="center" />
              <el-option label="自定义" value="custom" />
            </el-select>
          </el-form-item>

          <!-- 透明度 -->
          <el-form-item label="透明度">
            <el-slider
              v-model="blurConfig.opacity"
              :min="0"
              :max="100"
              :step="1"
            />
          </el-form-item>
        </el-form>

        <!-- 操作按钮 -->
        <div class="action-buttons">
          <el-button type="primary" @click="applyBlur">应用模糊</el-button>
          <el-button @click="downloadImage">下载图片</el-button>
          <el-button @click="resetImage">重置</el-button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, reactive, computed, onMounted, watch, nextTick } from "vue";
import { UploadFilled } from "@element-plus/icons-vue";
import { ElMessage } from "element-plus";

// 图片相关状态
const imageUrl = ref("");
const previewImage = ref(null);
const imageContainer = ref(null);

// 模糊配置
const blurMode = ref("all");
const blurConfig = reactive({
  level: "medium",
  size: "medium",
  position: "center",
  opacity: 50,
});

// 拖拽相关状态
const isDragging = ref(false);
const dragStart = reactive({ x: 0, y: 0 });
const selectionPosition = reactive({ x: 0, y: 0 });

// 添加原始图片存储
const originalImageUrl = ref("");

// 添加选择框引用
const selectionBox = ref(null);

// 画布相关状态
const drawCanvas = ref(null);
const isDrawing = ref(false);
const drawContext = ref(null);
const maskData = ref(null);

// 监听图片变化，重置画布
watch(imageUrl, () => {
  nextTick(() => {
    if (drawCanvas.value && previewImage.value) {
      initCanvas();
    }
  });
});

// 监听模糊模式变化
watch(blurMode, (newMode) => {
  if (newMode === "custom") {
    nextTick(() => {
      initCanvas();
    });
  }
});

// 初始化画布
const initCanvas = () => {
  const canvas = drawCanvas.value;
  const img = previewImage.value;

  if (!canvas || !img) {
    console.error("Canvas or Image not found");
    return;
  }

  // 等待图片加载完成
  if (!img.complete) {
    img.onload = () => {
      setupCanvas(canvas, img);
    };
  } else {
    setupCanvas(canvas, img);
  }
};

// 修改画布设置逻辑
const setupCanvas = (canvas, img) => {
  // 获取图片实际显示尺寸
  const imgRect = img.getBoundingClientRect();
  canvas.width = imgRect.width;
  canvas.height = imgRect.height;

  const ctx = canvas.getContext("2d");
  if (!ctx) {
    console.error("Failed to get canvas context");
    return;
  }

  drawContext.value = ctx;
  ctx.strokeStyle = "rgba(255, 0, 0, 0.5)";
  ctx.lineWidth = 2;
  ctx.lineCap = "round";
  ctx.lineJoin = "round";

  // 清空画布
  ctx.clearRect(0, 0, canvas.width, canvas.height);
};

// 开始绘制
const startDrawing = (e) => {
  const img = previewImage.value;
  if (!img) return;

  const imgRect = img.getBoundingClientRect();
  const canvasRect = drawCanvas.value.getBoundingClientRect();
  console.log("canvasRect", canvasRect);

  // 计算鼠标相对于画布的位置
  const x = e.clientX - canvasRect.left;
  const y = e.clientY - canvasRect.top;

  // 计算原始图片的宽高
  const originImg = document.querySelector(".original-image");
  const originImgRect = originImg.getBoundingClientRect();
  console.log("originImgRect", originImgRect);

  let offset = (canvasRect.width - originImgRect.width) / 2;

  // 检查是否在图片范围内
  if (
    x >= imgRect.left - canvasRect.left &&
    x <= imgRect.right - canvasRect.left &&
    y >= imgRect.top - canvasRect.top &&
    y <= imgRect.bottom - canvasRect.top
  ) {
    isDrawing.value = true;
    const ctx = drawContext.value;
    ctx.beginPath();
    ctx.moveTo(x - offset, y);
  }
};

// 修改绘制过程
const draw = (e) => {
  if (!isDrawing.value) return;

  const img = previewImage.value;
  if (!img) return;

  const imgRect = img.getBoundingClientRect();
  const canvasRect = drawCanvas.value.getBoundingClientRect();
  console.log("canvasRect", canvasRect);

  // 计算原始图片的宽高
  const originImg = document.querySelector(".original-image");
  const originImgRect = originImg.getBoundingClientRect();
  console.log("originImgRect", originImgRect);

  let offset = (canvasRect.width - originImgRect.width) / 2;

  // 计算鼠标相对于画布的位置
  const x = e.clientX - canvasRect.left;
  const y = e.clientY - canvasRect.top;

  // 检查是否在图片范围内
  if (
    x >= imgRect.left - canvasRect.left &&
    x <= imgRect.right - canvasRect.left &&
    y >= imgRect.top - canvasRect.top &&
    y <= imgRect.bottom - canvasRect.top
  ) {
    const ctx = drawContext.value;
    ctx.lineTo(x - offset, y);
    ctx.stroke();
  }
};

// 停止绘制
const stopDrawing = () => {
  if (!isDrawing.value) return;

  isDrawing.value = false;
  if (drawContext.value) {
    drawContext.value.closePath();
    // 保存绘制的蒙版数据
    maskData.value = drawContext.value.getImageData(
      0,
      0,
      drawCanvas.value.width,
      drawCanvas.value.height
    );
  }
};

// 修改应用模糊效果函数
const applyBlur = () => {
  if (!previewImage.value) {
    ElMessage.error("请先上传图片！");
    return;
  }

  const canvas = document.createElement("canvas");
  const ctx = canvas.getContext("2d");
  const img = previewImage.value;

  canvas.width = img.naturalWidth;
  canvas.height = img.naturalHeight;

  // 先绘制原始图片
  ctx.drawImage(img, 0, 0);

  const blurValue = {
    low: 2,
    medium: 5,
    high: 10,
  }[blurConfig.level];

  if (blurMode.value === "custom" && maskData.value) {
    try {
      // 获取自定义模糊区域的边界
      const maskCanvas = document.createElement("canvas");
      const maskCtx = maskCanvas.getContext("2d");
      maskCanvas.width = canvas.width;
      maskCanvas.height = canvas.height;

      // 计算缩放比例
      const scaleX = canvas.width / drawCanvas.value.width;
      const scaleY = canvas.height / drawCanvas.value.height;

      // 绘制蒙版
      maskCtx.scale(scaleX, scaleY);
      maskCtx.drawImage(drawCanvas.value, 0, 0);

      // 获取蒙版数据
      const maskImageData = maskCtx.getImageData(
        0,
        0,
        maskCanvas.width,
        maskCanvas.height
      );
      const maskPixels = maskImageData.data;

      // 计算模糊区域的边界
      let minX = canvas.width,
        minY = canvas.height,
        maxX = 0,
        maxY = 0;
      for (let i = 0; i < maskPixels.length; i += 4) {
        const alpha = maskPixels[i + 3];
        if (alpha > 0) {
          const x = (i / 4) % canvas.width;
          const y = Math.floor(i / 4 / canvas.width);
          if (x < minX) minX = x;
          if (x > maxX) maxX = x;
          if (y < minY) minY = y;
          if (y > maxY) maxY = y;
        }
      }

      // 创建模糊效果画布
      const blurCanvas = document.createElement("canvas");
      const blurCtx = blurCanvas.getContext("2d");
      blurCanvas.width = canvas.width;
      blurCanvas.height = canvas.height;

      // 应用模糊效果
      blurCtx.filter = `blur(${blurValue}px)`;
      blurCtx.drawImage(img, 0, 0);

      // 将模糊区域绘制到原始画布
      ctx.drawImage(
        blurCanvas,
        minX,
        minY,
        maxX - minX,
        maxY - minY,
        minX,
        minY,
        maxX - minX,
        maxY - minY
      );
    } catch (error) {
      console.error("Error applying blur effect:", error);
      ElMessage.error("应用模糊效果失败，请重试！");
      return;
    }
  } else if (blurMode.value === "partial") {
    // 处理局部模糊逻辑
    const tempCanvas = document.createElement("canvas");
    const tempCtx = tempCanvas.getContext("2d");
    tempCanvas.width = canvas.width;
    tempCanvas.height = canvas.height;

    // 计算局部模糊区域
    let x, y, w, h;
    const { width, height } = canvas;

    switch (blurConfig.position) {
      case "top-left":
        x = 0;
        y = 0;
        w = width / 3;
        h = height / 3;
        break;
      case "top-right":
        x = (width * 2) / 3;
        y = 0;
        w = width / 3;
        h = height / 3;
        break;
      case "bottom-left":
        x = 0;
        y = (height * 2) / 3;
        w = width / 3;
        h = height / 3;
        break;
      case "bottom-right":
        x = (width * 2) / 3;
        y = (height * 2) / 3;
        w = width / 3;
        h = height / 3;
        break;
      case "center":
        x = width / 3;
        y = height / 3;
        w = width / 3;
        h = height / 3;
        break;
      default:
        x = width / 3;
        y = height / 3;
        w = width / 3;
        h = height / 3;
    }

    // 应用模糊效果到指定区域
    tempCtx.drawImage(img, 0, 0);
    ctx.filter = `blur(${blurValue}px)`;
    ctx.drawImage(tempCanvas, x, y, w, h, x, y, w, h);
    ctx.filter = "none";
  } else if (blurMode.value === "all") {
    ctx.filter = `blur(${blurValue}px)`;
    ctx.drawImage(img, 0, 0);
  }

  // 更新预览图
  imageUrl.value = canvas.toDataURL();
  ElMessage.success("模糊效果已应用");
};

// 重置图片时同时清空画布
const resetImage = () => {
  if (originalImageUrl.value) {
    imageUrl.value = originalImageUrl.value;
    if (drawContext.value) {
      drawContext.value.clearRect(
        0,
        0,
        drawCanvas.value.width,
        drawCanvas.value.height
      );
      maskData.value = null;
    }
    ElMessage.success("图片已重置");
  }
};

// 修改图片上传处理函数
const handleImageChange = (file) => {
  // 添加文件类型检查
  const isImage = file.raw.type.startsWith("image/");
  if (!isImage) {
    ElMessage.error("请上传图片文件！");
    return;
  }

  // 添加文件大小限制
  const isLt2M = file.raw.size / 1024 / 1024 < 2;
  if (!isLt2M) {
    ElMessage.error("图片大小不能超过 2MB!");
    return;
  }

  const reader = new FileReader();
  reader.onload = (e) => {
    // 创建图片对象以确保图片加载完成
    const img = new Image();
    img.onload = () => {
      imageUrl.value = img.src;
      originalImageUrl.value = img.src;
      nextTick(() => {
        if (blurMode.value === "custom") {
          initCanvas();
        }
      });
    };
    img.src = e.target.result;
  };
  reader.onerror = (error) => {
    ElMessage.error("图片加载失败！");
    console.error("Error: ", error);
  };
  reader.readAsDataURL(file.raw);
};

// 下载处理后的图片
const downloadImage = () => {
  const link = document.createElement("a");
  link.download = "blurred-image.png";
  link.href = imageUrl.value;
  link.click();
};

// 修改拖拽相关方法
const startDrag = (e) => {
  // 判断是否点击到调整大小的手柄
  if (e.target.classList.contains("resize-handle")) {
    const handle = e.target;
    const startX = e.clientX;
    const startY = e.clientY;
    const startWidth = selectionSize.width;
    const startHeight = selectionSize.height;
    const handleClass = handle.className;

    const handleMouseMove = (e) => {
      const deltaX = e.clientX - startX;
      const deltaY = e.clientY - startY;

      if (handleClass.includes("se")) {
        selectionSize.width = Math.max(50, startWidth + deltaX);
        selectionSize.height = Math.max(50, startHeight + deltaY);
      } else if (handleClass.includes("sw")) {
        selectionSize.width = Math.max(50, startWidth - deltaX);
        selectionPosition.x = Math.min(
          startX + deltaX,
          startX + startWidth - 50
        );
        selectionSize.height = Math.max(50, startHeight + deltaY);
      } else if (handleClass.includes("ne")) {
        selectionSize.width = Math.max(50, startWidth + deltaX);
        selectionSize.height = Math.max(50, startHeight - deltaY);
        selectionPosition.y = Math.min(
          startY + deltaY,
          startY + startHeight - 50
        );
      } else if (handleClass.includes("nw")) {
        selectionSize.width = Math.max(50, startWidth - deltaX);
        selectionSize.height = Math.max(50, startHeight - deltaY);
        selectionPosition.x = Math.min(
          startX + deltaX,
          startX + startWidth - 50
        );
        selectionPosition.y = Math.min(
          startY + deltaY,
          startY + startHeight - 50
        );
      }
    };

    const handleMouseUp = () => {
      document.removeEventListener("mousemove", handleMouseMove);
      document.removeEventListener("mouseup", handleMouseUp);
    };

    document.addEventListener("mousemove", handleMouseMove);
    document.addEventListener("mouseup", handleMouseUp);
    return;
  }

  // 处理拖动逻辑
  if (e.target.classList.contains("blur-selection")) {
    isDragging.value = true;
    dragStart.x = e.clientX - selectionPosition.x;
    dragStart.y = e.clientY - selectionPosition.y;

    const handleMouseMove = (e) => {
      if (isDragging.value) {
        const rect = imageContainer.value.getBoundingClientRect();
        const newX = e.clientX - dragStart.x;
        const newY = e.clientY - dragStart.y;

        // 限制选择框在片围内
        selectionPosition.x = Math.max(
          0,
          Math.min(newX, rect.width - selectionSize.width)
        );
        selectionPosition.y = Math.max(
          0,
          Math.min(newY, rect.height - selectionSize.height)
        );
      }
    };

    const handleMouseUp = () => {
      isDragging.value = false;
      document.removeEventListener("mousemove", handleMouseMove);
      document.removeEventListener("mouseup", handleMouseUp);
    };

    document.addEventListener("mousemove", handleMouseMove);
    document.addEventListener("mouseup", handleMouseUp);
  }
};

// 添加选择框大小变化监听
const handleSelectionResize = (e) => {
  const target = e.target;
  selectionSize.width = target.offsetWidth;
  selectionSize.height = target.offsetHeight;
};
</script>

<style scoped>
.image-blur-container {
  padding: 20px;
  max-width: 1200px;
  margin: 0 auto;
}

.upload-area {
  width: 100%;
  border: 2px dashed #dcdfe6;
  border-radius: 8px;
  padding: 20px;
  text-align: center;
  background: #fff;
}

.preview-area {
  margin-top: 20px;
  display: flex;
  gap: 20px;
}

.image-container {
  flex: 1;
  position: relative;
  background: #fff;
  border-radius: 8px;
  padding: 10px;
  min-height: 400px;
  display: flex;
  align-items: center;
  justify-content: center;
  overflow: hidden;
  user-select: none;
}

.image-container img {
  max-width: 100%;
  max-height: 400px;
  object-fit: contain;
  display: block;
  pointer-events: none;
}

.control-panel {
  width: 300px;
  background: #fff;
  padding: 20px;
  border-radius: 8px;
}

.action-buttons {
  margin-top: 20px;
  display: flex;
  gap: 10px;
  justify-content: center;
}

.blur-selection {
  user-select: none;
  min-width: 50px;
  min-height: 50px;
  max-width: 100%;
  max-height: 100%;
  position: relative;
}

.resize-handle {
  position: absolute;
  width: 10px;
  height: 10px;
  background-color: #409eff;
  border-radius: 50%;
}

.resize-handle-se {
  bottom: -5px;
  right: -5px;
  cursor: se-resize;
}

.resize-handle-sw {
  bottom: -5px;
  left: -5px;
  cursor: sw-resize;
}

.resize-handle-ne {
  top: -5px;
  right: -5px;
  cursor: ne-resize;
}

.resize-handle-nw {
  top: -5px;
  left: -5px;
  cursor: nw-resize;
}

.blur-selection:hover {
  cursor: move;
}

.draw-canvas {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  cursor: crosshair;
  z-index: 1;
  pointer-events: auto;
  touch-action: none;
  background: transparent;
}

.image-container img {
  position: relative;
  z-index: 0;
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
</style>
