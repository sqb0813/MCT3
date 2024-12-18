// 随机色处理的 Worker

// HSL 转 RGB 的辅助函数
function hslToRgb(h, s, l) {
  h /= 360;
  s /= 100;
  l /= 100;
  
  let r, g, b;

  if (s === 0) {
    r = g = b = l;
  } else {
    const hue2rgb = (p, q, t) => {
      if (t < 0) t += 1;
      if (t > 1) t -= 1;
      if (t < 1/6) return p + (q - p) * 6 * t;
      if (t < 1/2) return q;
      if (t < 2/3) return p + (q - p) * (2/3 - t) * 6;
      return p;
    };

    const q = l < 0.5 ? l * (1 + s) : l + s - l * s;
    const p = 2 * l - q;
    r = hue2rgb(p, q, h + 1/3);
    g = hue2rgb(p, q, h);
    b = hue2rgb(p, q, h - 1/3);
  }

  return [
    Math.round(r * 255),
    Math.round(g * 255),
    Math.round(b * 255)
  ];
}

// 获取随机数
function getRandom(min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

// 全局随机色处理
function processGlobalRandom(imageData, settings) {
  const { hueRange, saturationRange, lightnessRange } = settings;
  const [h1, h2] = hueRange;
  const [s1, s2] = saturationRange;
  const [l1, l2] = lightnessRange;
  
  const hue = getRandom(h1, h2);
  const saturation = getRandom(s1, s2);
  const lightness = getRandom(l1, l2);
  
  const [r, g, b] = hslToRgb(hue, saturation, lightness);
  
  const data = imageData.data;
  for (let i = 0; i < data.length; i += 4) {
    const gray = (data[i] + data[i + 1] + data[i + 2]) / 3;
    const factor = gray / 255;
    
    data[i] = Math.round(r * factor);
    data[i + 1] = Math.round(g * factor);
    data[i + 2] = Math.round(b * factor);
  }
  
  return imageData;
}

// 区域随机色处理
function processRegionalRandom(imageData, settings) {
  const { hueRange, saturationRange, lightnessRange } = settings;
  const [h1, h2] = hueRange;
  const [s1, s2] = saturationRange;
  const [l1, l2] = lightnessRange;
  
  const blockSize = 32; // 区块大小
  const width = imageData.width;
  const height = imageData.height;
  const data = imageData.data;
  
  for (let y = 0; y < height; y += blockSize) {
    for (let x = 0; x < width; x += blockSize) {
      const hue = getRandom(h1, h2);
      const saturation = getRandom(s1, s2);
      const lightness = getRandom(l1, l2);
      const [r, g, b] = hslToRgb(hue, saturation, lightness);
      
      for (let by = 0; by < blockSize && y + by < height; by++) {
        for (let bx = 0; bx < blockSize && x + bx < width; bx++) {
          const i = ((y + by) * width + (x + bx)) * 4;
          const gray = (data[i] + data[i + 1] + data[i + 2]) / 3;
          const factor = gray / 255;
          
          data[i] = Math.round(r * factor);
          data[i + 1] = Math.round(g * factor);
          data[i + 2] = Math.round(b * factor);
        }
      }
    }
  }
  
  return imageData;
}

// 渐变随机色处理
function processGradientRandom(imageData, settings) {
  const { hueRange, saturationRange, lightnessRange } = settings;
  const [h1, h2] = hueRange;
  const [s1, s2] = saturationRange;
  const [l1, l2] = lightnessRange;
  
  const width = imageData.width;
  const height = imageData.height;
  const data = imageData.data;
  
  const startHue = getRandom(h1, h2);
  const endHue = getRandom(h1, h2);
  const startSat = getRandom(s1, s2);
  const endSat = getRandom(s1, s2);
  const startLight = getRandom(l1, l2);
  const endLight = getRandom(l1, l2);
  
  for (let y = 0; y < height; y++) {
    const factor = y / height;
    const hue = startHue + (endHue - startHue) * factor;
    const saturation = startSat + (endSat - startSat) * factor;
    const lightness = startLight + (endLight - startLight) * factor;
    
    const [r, g, b] = hslToRgb(hue, saturation, lightness);
    
    for (let x = 0; x < width; x++) {
      const i = (y * width + x) * 4;
      const gray = (data[i] + data[i + 1] + data[i + 2]) / 3;
      const grayFactor = gray / 255;
      
      data[i] = Math.round(r * grayFactor);
      data[i + 1] = Math.round(g * grayFactor);
      data[i + 2] = Math.round(b * grayFactor);
    }
  }
  
  return imageData;
}

// 接收主线程消息
self.onmessage = function(e) {
  const { imageData, settings, id } = e.data;
  
  // 从传输的 buffer 重建 ImageData
  const reconstructedImageData = new ImageData(
    new Uint8ClampedArray(imageData.data),
    imageData.width,
    imageData.height
  );
  
  // 处理设置的默认值
  const processSettings = {
    algorithm: settings?.algorithm || 'global',
    hueRange: settings?.hueRange || [0, 360],
    saturationRange: settings?.saturationRange || [50, 100],
    lightnessRange: settings?.lightnessRange || [30, 70]
  };
  
  // 根据算法处理图片
  let processedData;
  switch (processSettings.algorithm) {
    case 'regional':
      processedData = processRegionalRandom(reconstructedImageData, processSettings);
      break;
    case 'gradient':
      processedData = processGradientRandom(reconstructedImageData, processSettings);
      break;
    case 'global':
    default:
      processedData = processGlobalRandom(reconstructedImageData, processSettings);
      break;
  }
  
  // 获取处理后数据的 buffer
  const buffer = processedData.data.buffer;
  
  // 发送处理后的数据回主线程
  self.postMessage({
    imageData: buffer,
    width: processedData.width,
    height: processedData.height,
    id
  }); // 不再使用 transferable objects 列表
} 