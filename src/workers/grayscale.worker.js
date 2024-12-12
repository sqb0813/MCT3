// 处理图片转灰度的 Worker

// 预计算灰度值查找表
const grayLookupTable = new Uint8Array(256 * 3);
const weights = {
  weighted: [0.2126, 0.7152, 0.0722],
  average: [0.3333, 0.3333, 0.3334],
  luminosity: [0.299, 0.587, 0.114]
};

// 初始化查找表
function initLookupTables() {
  Object.keys(weights).forEach(method => {
    const [r, g, b] = weights[method];
    for (let i = 0; i < 256; i++) {
      grayLookupTable[i * 3] = i * r;
      grayLookupTable[i * 3 + 1] = i * g;
      grayLookupTable[i * 3 + 2] = i * b;
    }
  });
}

initLookupTables();

// 使用 SIMD 优化的灰度处理（如果浏览器支持）
function processGrayscaleSIMD(imageData, algorithm = 'weighted') {
  const data = imageData.data;
  const len = data.length;
  const [r, g, b] = weights[algorithm];
  
  // 使用 SIMD 优化
  if (typeof SIMD !== 'undefined' && SIMD.Float32x4) {
    const rWeight = SIMD.Float32x4.splat(r);
    const gWeight = SIMD.Float32x4.splat(g);
    const bWeight = SIMD.Float32x4.splat(b);
    
    for (let i = 0; i < len; i += 16) {
      const rgba0 = SIMD.Float32x4.load(data, i);
      const rgba1 = SIMD.Float32x4.load(data, i + 4);
      const rgba2 = SIMD.Float32x4.load(data, i + 8);
      const rgba3 = SIMD.Float32x4.load(data, i + 12);
      
      const gray0 = SIMD.Float32x4.add(
        SIMD.Float32x4.mul(rgba0, rWeight),
        SIMD.Float32x4.add(
          SIMD.Float32x4.mul(rgba1, gWeight),
          SIMD.Float32x4.mul(rgba2, bWeight)
        )
      );
      
      SIMD.Float32x4.store(data, i, gray0);
      SIMD.Float32x4.store(data, i + 4, gray0);
      SIMD.Float32x4.store(data, i + 8, gray0);
    }
    return imageData;
  }
  
  return processGrayscaleStandard(imageData, algorithm);
}

// 标准灰度处理（使用查找表优化）
function processGrayscaleStandard(imageData, algorithm = 'weighted') {
  const data = imageData.data;
  const len = data.length;
  const tableOffset = algorithm === 'weighted' ? 0 : (algorithm === 'average' ? 256 : 512);
  
  // 使用 Uint32Array 视图加速访问
  const pixels = new Uint32Array(data.buffer);
  const pixelCount = len >> 2;
  
  for (let i = 0; i < pixelCount; i++) {
    const offset = i << 2;
    const r = data[offset];
    const g = data[offset + 1];
    const b = data[offset + 2];
    
    // 使用查找表计算灰度值
    const gray = (
      grayLookupTable[tableOffset + r] +
      grayLookupTable[tableOffset + g + 1] +
      grayLookupTable[tableOffset + b + 2]
    ) | 0;
    
    // 一次性设置 RGB 值（保持 Alpha 不变）
    pixels[i] = (data[offset + 3] << 24) | // Alpha
                (gray << 16) |             // Red
                (gray << 8) |              // Green
                gray;                      // Blue
  }
  
  return imageData;
}

// 优化的亮度和对比度处理
function adjustBrightnessContrast(imageData, brightness, contrast) {
  const data = imageData.data;
  const len = data.length;
  const factor = (259 * (contrast + 255)) / (255 * (259 - contrast));
  
  // 预计算亮度和对比度查找表
  const lookupTable = new Uint8Array(256);
  for (let i = 0; i < 256; i++) {
    let value = i;
    // 应用亮度
    value += brightness;
    // 应用对比度
    value = factor * (value - 128) + 128;
    // 限制在有效范围内
    lookupTable[i] = Math.max(0, Math.min(255, value)) | 0;
  }
  
  // 使用 Uint32Array 视图加速访问
  const pixels = new Uint32Array(data.buffer);
  const pixelCount = len >> 2;
  
  for (let i = 0; i < pixelCount; i++) {
    const offset = i << 2;
    const r = lookupTable[data[offset]];
    const g = lookupTable[data[offset + 1]];
    const b = lookupTable[data[offset + 2]];
    
    pixels[i] = (data[offset + 3] << 24) | // Alpha
                (r << 16) |                // Red
                (g << 8) |                 // Green
                b;                         // Blue
  }
  
  return imageData;
}

// 接收主线程消息
self.onmessage = function(e) {
  const { imageData, algorithm, brightness, contrast } = e.data;
  
  // 使用优化后的灰度处理
  let processedData = processGrayscaleSIMD(imageData, algorithm);
  
  // 使用优化后的亮度和对比度处理
  if (brightness !== 0 || contrast !== 0) {
    processedData = adjustBrightnessContrast(processedData, brightness, contrast);
  }
  
  // 返回处理后的数据
  self.postMessage(processedData);
} 