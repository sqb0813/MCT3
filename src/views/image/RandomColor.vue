<template>
  <div class="app-container">
    <header class="app-header">
      <h1>图片随机色</h1>
      <p class="subtitle">专业的图片随机色处理工具，支持多种算法</p>
    </header>

    <main class="main-content">
      <!-- 添加标签页 -->
      <el-tabs v-model="activeTab" class="image-tabs">
        <el-tab-pane label="单张处理" name="single">
          <!-- 单张图片处理区域 -->
          <div class="upload-section" v-if="!singleImage">
            <el-upload
              class="upload-drop-zone"
              drag
              :auto-upload="false"
              accept="image/*"
              :show-file-list="false"
              :multiple="false"
              @change="handleSingleFileChange"
            >
              <el-icon class="upload-icon"><upload-filled /></el-icon>
              <div class="upload-text">
                <h3>将图片拖到此处，或点击上传</h3>
                <p>支持 PNG、JPG、WebP 等常见格式</p>
              </div>
            </el-upload>
          </div>

          <div v-else class="process-section single-mode">
            <div class="image-comparison">
              <!-- 原图预览 -->
              <div class="image-preview original">
                <h3>原图</h3>
                <div class="image-container">
                  <img :src="singleImage.originalPreview" :alt="singleImage.file.name" />
                </div>
              </div>

              <!-- 随机色效果预览 -->
              <div class="image-preview processed">
                <h3>随机色效果</h3>
                <div class="image-container">
                  <img 
                    v-if="singleImage.processedPreview" 
                    :src="singleImage.processedPreview" 
                    :alt="singleImage.file.name + '(随机色)'" 
                  />
                  <div v-else class="placeholder">
                    <el-icon><picture-rounded /></el-icon>
                    <span>待处理</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </el-tab-pane>

        <el-tab-pane label="批量处理" name="batch">
          <!-- 批量处理区域 -->
          <div class="upload-section" v-if="!images.length">
            <el-upload
              class="upload-drop-zone"
              drag
              :auto-upload="false"
              accept="image/*"
              :show-file-list="false"
              :multiple="true"
              @change="handleBatchFileChange"
            >
              <el-icon class="upload-icon"><upload-filled /></el-icon>
              <div class="upload-text">
                <h3>将图片拖到此处，或点击上传</h3>
                <p>支持批量上传多张图片，PNG、JPG、WebP 等常见格式</p>
              </div>
            </el-upload>
          </div>

          <div v-else class="process-section batch-mode">
            <!-- 图片列表 -->
            <div class="images-list">
              <el-scrollbar height="600px">
                <div v-for="(image, index) in images" :key="index" class="image-item">
                  <div class="image-comparison">
                    <!-- 原图预览 -->
                    <div class="image-preview original">
                      <h3>原图</h3>
                      <div class="image-container">
                        <img :src="image.originalPreview" :alt="image.file.name" />
                      </div>
                    </div>

                    <!-- 随机色效果预览 -->
                    <div class="image-preview processed">
                      <h3>随机色效果</h3>
                      <div class="image-container">
                        <img 
                          v-if="image.processedPreview" 
                          :src="image.processedPreview" 
                          :alt="image.file.name + '(随机色)'" 
                        />
                        <div v-else class="placeholder">
                          <el-icon><picture-rounded /></el-icon>
                          <span>待处理</span>
                        </div>
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
          <!-- 随机色算法选择 -->
          <el-form-item label="随机色算法">
            <el-select v-model="settings.algorithm" class="algorithm-select">
              <el-option
                v-for="algo in algorithms"
                :key="algo.value"
                :label="algo.label"
                :value="algo.value"
              />
            </el-select>
          </el-form-item>

          <!-- 色相范围 -->
          <el-form-item label="色相范围">
            <el-slider
              v-model="settings.hueRange"
              range
              :min="0"
              :max="360"
              :format-tooltip="(val) => `${val}°`"
            />
          </el-form-item>

          <!-- 饱和度范围 -->
          <el-form-item label="饱和度范围">
            <el-slider
              v-model="settings.saturationRange"
              range
              :min="0"
              :max="100"
              :format-tooltip="(val) => `${val}%`"
            />
          </el-form-item>

          <!-- 亮度范围 -->
          <el-form-item label="亮度范围">
            <el-slider
              v-model="settings.lightnessRange"
              range
              :min="0"
              :max="100"
              :format-tooltip="(val) => `${val}%`"
            />
          </el-form-item>
        </el-form>

        <!-- 操作按钮 -->
        <div class="action-buttons">
          <template v-if="activeTab === 'single'">
            <el-button 
              type="primary"
              @click="processSingleImage"
              :loading="processing"
              :disabled="!singleImage"
            >
              {{ processing ? '处理中...' : '开始处理' }}
            </el-button>
            <el-button @click="resetSingleImage">重新选择</el-button>
            <el-button
              type="success"
              @click="downloadSingleImage"
              :disabled="!singleImage?.processedPreview"
            >
              下载图片
            </el-button>
          </template>
          <template v-else>
            <el-button
              type="primary"
              @click="processAllImages"
              :loading="batchProcessing"
              :disabled="!hasUnprocessedImages"
            >
              {{ batchProcessing ? '批量处理中...' : '批量处理' }}
            </el-button>
            <el-button @click="resetImages">重新选择</el-button>
            <el-button
              type="success"
              @click="downloadAllImages"
              :disabled="!hasProcessedImages"
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
import { ref, onMounted, onUnmounted, watch, computed } from 'vue'
import { ElMessage } from 'element-plus'
import { UploadFilled, PictureRounded } from '@element-plus/icons-vue'

// Web Worker 实例
let worker = null

// 状态变量
const activeTab = ref('single')
const singleImage = ref(null)
const images = ref([])
const processing = ref(false)
const batchProcessing = ref(false)

// 随机色算法选项
const algorithms = [
  { label: '全局随机', value: 'global' },
  { label: '区域随机', value: 'regional' },
  { label: '渐变随机', value: 'gradient' }
]

// 处理设置
const settings = ref({
  algorithm: 'global',
  hueRange: [0, 360],
  saturationRange: [50, 100],
  lightnessRange: [30, 70]
})

// 计算属性
const hasProcessedImages = computed(() => {
  return images.value.some(img => img.processedPreview)
})

const hasUnprocessedImages = computed(() => {
  return images.value.some(img => !img.processedPreview)
})

// 初始化 Web Worker
onMounted(() => {
  worker = new Worker(new URL('@/workers/randomcolor.worker.js', import.meta.url))
  
  worker.onmessage = (e) => {
    const { imageData, id } = e.data
    const canvas = document.createElement('canvas')
    const ctx = canvas.getContext('2d')
    
    canvas.width = imageData.width
    canvas.height = imageData.height
    
    // 从接收到的 buffer 重建 ImageData
    const newImageData = new ImageData(
      new Uint8ClampedArray(imageData.data),
      imageData.width,
      imageData.height
    )
    
    ctx.putImageData(newImageData, 0, 0)
    
    if (id === 'single') {
      singleImage.value.processedPreview = canvas.toDataURL('image/png')
      processing.value = false
      ElMessage.success('处理完成')
    } else {
      const image = images.value.find(img => img.id === id)
      if (image) {
        image.processedPreview = canvas.toDataURL('image/png')
      }
    }
  }
  
  worker.onerror = (error) => {
    processing.value = false
    ElMessage.error('处理失败：' + error.message)
    console.error(error)
  }
})

// 清理 Worker
onUnmounted(() => {
  if (worker) {
    worker.terminate()
  }
  resetSingleImage()
  resetImages()
})

// 处理单张文件上传
const handleSingleFileChange = (file) => {
  const fileObj = file.raw
  if (!fileObj || !fileObj.type.startsWith('image/')) {
    ElMessage.error('请上传图片文件')
    return
  }
  
  singleImage.value = {
    id: 'single',
    file: fileObj,
    originalPreview: URL.createObjectURL(fileObj),
    processedPreview: ''
  }
}

// 处理批量文件上传
const handleBatchFileChange = (file) => {
  const files = Array.isArray(file) ? file : [file]
  
  files.forEach(f => {
    const fileObj = f.raw
    if (!fileObj || !fileObj.type.startsWith('image/')) {
      ElMessage.error(`${fileObj.name} 不是有效的图片文件`)
      return
    }
    
    images.value.push({
      id: Date.now() + Math.random(),
      file: fileObj,
      originalPreview: URL.createObjectURL(fileObj),
      processedPreview: ''
    })
  })
}

// 处理所有图片
const processSingleImage = async () => {
  if (!singleImage.value || processing.value) return
  
  processing.value = true
  try {
    await processImage(singleImage.value)
    ElMessage.success('转换完成')
  } catch (error) {
    ElMessage.error('处理失败，请重试')
    console.error(error)
  } finally {
    processing.value = false
  }
}

// 处理单张图片的通用函数
const processImage = (image) => {
  return new Promise((resolve, reject) => {
    const canvas = document.createElement('canvas')
    const ctx = canvas.getContext('2d')
    const img = new Image()
    
    img.onload = () => {
      canvas.width = img.width
      canvas.height = img.height
      ctx.drawImage(img, 0, 0)
      
      const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height)
      
      // 创建一个可传输的对象
      const transferableImageData = {
        data: imageData.data.buffer, // 使用 ArrayBuffer
        width: imageData.width,
        height: imageData.height
      }
      
      worker.postMessage({
        imageData: transferableImageData,
        settings: {
          algorithm: settings.value.algorithm,
          hueRange: settings.value.hueRange,
          saturationRange: settings.value.saturationRange,
          lightnessRange: settings.value.lightnessRange
        },
        id: image.id
      }, [transferableImageData.data]) // 将 buffer 作为 transferable 对象传递
    }
    
    img.onerror = reject
    img.src = image.originalPreview
  })
}

// 下载单张处理后的图片
const downloadSingleImage = () => {
  if (!singleImage.value?.processedPreview) return
  
  const link = document.createElement('a')
  const fileName = singleImage.value.file.name.split('.')[0]
  link.download = `${fileName}_random_color.png`
  link.href = singleImage.value.processedPreview
  link.click()
}

// 下载所有处理后的图片
const downloadAllImages = async () => {
  try {
    const JSZip = (await import('jszip')).default
    const zip = new JSZip()
    
    images.value.forEach((image, index) => {
      if (image.processedPreview) {
        const base64Data = image.processedPreview.split(',')[1]
        const fileName = `${image.file.name.split('.')[0]}_random_color.png`
        zip.file(fileName, base64Data, { base64: true })
      }
    })
    
    const content = await zip.generateAsync({ type: 'blob' })
    const link = document.createElement('a')
    link.href = URL.createObjectURL(content)
    link.download = 'random_color_images.zip'
    link.click()
    
    ElMessage.success('打包下载开始')
  } catch (error) {
    ElMessage.error('下载失败')
    console.error(error)
  }
}

// 重置单张状态
const resetSingleImage = () => {
  if (singleImage.value) {
    URL.revokeObjectURL(singleImage.value.originalPreview)
  }
  singleImage.value = null
}

// 重置所有状态
const resetImages = () => {
  images.value.forEach(image => {
    URL.revokeObjectURL(image.originalPreview)
  })
  images.value = []
}

// 监听设置变化，自动重新处理图片
watch(
  () => settings.value,
  () => {
    if (activeTab.value === 'single' && singleImage.value?.processedPreview) {
      processSingleImage()
    } else if (activeTab.value === 'batch' && hasProcessedImages.value) {
      processAllImages()
    }
  },
  { deep: true }
)
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

.upload-section {
  background: var(--el-bg-color);
  border-radius: 12px;
  padding: 2rem;
  box-shadow: var(--el-box-shadow-light);
}

.upload-drop-zone {
  border: 2px dashed var(--el-border-color);
  border-radius: 8px;
  padding: 3rem 1rem;
  transition: all 0.3s ease;
}

.upload-drop-zone:hover {
  border-color: var(--el-color-primary);
  background: rgba(64, 158, 255, 0.04);
}

.upload-icon {
  font-size: 3rem;
  color: var(--el-text-color-secondary);
  margin-bottom: 1rem;
}

.process-section {
  display: grid;
  grid-template-columns: 1fr;
  gap: 2rem;
  margin-top: 2rem;
}

.image-comparison {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 1rem;
  margin-bottom: 1rem;
}

.image-preview {
  background: var(--el-bg-color);
  border-radius: 12px;
  padding: 1rem;
  box-shadow: var(--el-box-shadow-light);
}

.image-preview h3 {
  text-align: center;
  margin-bottom: 1rem;
  color: var(--el-text-color-primary);
}

.image-container {
  aspect-ratio: 16/9;
  display: flex;
  align-items: center;
  justify-content: center;
  background: var(--el-fill-color-lighter);
  border-radius: 8px;
  overflow: hidden;
}

.image-container img {
  max-width: 100%;
  max-height: 100%;
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

.algorithm-select {
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

.images-list {
  width: 100%;
}

.image-item {
  margin-bottom: 2rem;
  padding-bottom: 2rem;
  border-bottom: 1px solid var(--el-border-color-lighter);
}

.image-item:last-child {
  margin-bottom: 0;
  padding-bottom: 0;
  border-bottom: none;
}

.image-tabs {
  margin-bottom: 2rem;
}

.single-mode {
  display: flex;
  flex-direction: column;
  gap: 2rem;
}

.batch-mode {
  display: flex;
  flex-direction: column;
  gap: 2rem;
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
</style>
