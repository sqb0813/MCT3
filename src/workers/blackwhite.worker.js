// 处理图片转黑白的 Worker

// 预计算亮度和对比度查找表
const brightnessContrastLookupTable = new Uint8Array(256);

// 初始化查找表
function initLookupTable(brightness, contrast) {
  const factor = (259 * (contrast + 255)) / (255 * (259 - contrast));
  
  for (let i = 0; i < 256; i++) {
    let value = i;
    // 应用亮度
    value += brightness;
    // 应用对比度
    value = factor * (value - 128) + 128;
    // 限制在有效范围内
    brightnessContrastLookupTable[i] = Math.max(0, Math.min(255, value)) | 0;
  }
}

// 使用查找表优化的黑白处理
function processBlackAndWhite(imageData, threshold, brightness, contrast) {
  // 初始化亮度和对比度查找表
  initLookupTable(brightness, contrast);
  
  const data = imageData.data;
  const len = data.length;
  
  // 使用 Uint32Array 视图加速访问
  const pixels = new Uint32Array(data.buffer);
  const pixelCount = len >> 2;
  
  for (let i = 0; i < pixelCount; i++) {
    const offset = i << 2;
    
    // 获取RGB值并应用亮度和对比度
    const r = brightnessContrastLookupTable[data[offset]];
    const g = brightnessContrastLookupTable[data[offset + 1]];
    const b = brightnessContrastLookupTable[data[offset + 2]];
    
    // 计算灰度值 (使用加权平均法)
    const gray = (r * 0.299 + g * 0.587 + b * 0.114) | 0;
    
    // 根据阈值决定黑白
    const value = gray >= threshold ? 255 : 0;
    
    // 一次性设置RGB值（保持Alpha不变）
    pixels[i] = (data[offset + 3] << 24) | // Alpha
                (value << 16) |            // Red
                (value << 8) |             // Green
                value;                     // Blue
  }
  
  return imageData;
}

// 接收主线程消息
self.onmessage = function(e) {
  const { imageData, threshold, brightness, contrast } = e.data;
  
  // 处理图片
  const processedData = processBlackAndWhite(
    imageData,
    threshold,
    brightness,
    contrast
  );
  
  // 返回处理后的数据
  self.postMessage(processedData);
} 