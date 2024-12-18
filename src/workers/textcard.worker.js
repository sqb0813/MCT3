// 文字转卡片的 Worker

// 预设的卡片样式配置
const cardStyles = {
  'simple-white': {
    background: '#ffffff',
    shadow: '0 4px 12px rgba(0, 0, 0, 0.1)',
    padding: 40,
  },
  'gradient-blue': {
    background: 'linear-gradient(120deg, #a1c4fd 0%, #c2e9fb 100%)',
    shadow: '0 4px 12px rgba(0, 0, 0, 0.15)',
    padding: 40,
  },
  'warm': {
    background: 'linear-gradient(120deg, #fad0c4 0%, #ffd1ff 100%)',
    shadow: '0 4px 12px rgba(0, 0, 0, 0.12)',
    padding: 40,
  },
  'dark': {
    background: '#2c3e50',
    shadow: '0 4px 12px rgba(0, 0, 0, 0.2)',
    padding: 40,
  },
  // 添加星空夜景样式
  'starry-night': {
    background: '#0a192f',
    shadow: '0 4px 12px rgba(0, 0, 0, 0.3)',
    padding: 40,
    decorations: {
      stars: {
        count: 100,
        color: '#ffffff',
        size: [0.5, 2],
      }
    }
  },
  // 添加霓虹灯样式
  'neon': {
    background: '#000000',
    shadow: '0 4px 12px rgba(0, 0, 0, 0.4)',
    padding: 40,
    textEffect: {
      glow: true,
      shadowBlur: 20,
      shadowColor: '#ff00ff',
      strokeWidth: 2
    }
  },
  // 添加水彩画样式
  'watercolor': {
    background: '#f8f9fa',
    shadow: '0 4px 12px rgba(0, 0, 0, 0.1)',
    padding: 40,
    effect: {
      type: 'watercolor',
      colors: ['#FF9AA2', '#FFB7B2', '#FFDAC1', '#E2F0CB', '#B5EAD7'],
      blur: 20,
      opacity: 0.3
    }
  },
  
  // 添加复古样式
  'vintage': {
    background: '#f4e4bc',
    shadow: '0 4px 12px rgba(0, 0, 0, 0.15)',
    padding: 40,
    effect: {
      type: 'vintage',
      sepia: 0.5,
      noise: 0.1,
      vignette: 0.3
    }
  },
  // 添加每日精进样式
  'daily-progress': {
    background: '#ffffff',
    shadow: '0 4px 12px rgba(0, 0, 0, 0.1)', 
    padding: 40,
    layout: {
      headerHeight: 120,
      dividerHeight: 60,
      avatarSize: 100,
      contentPadding: 50,
      contentStyle: {
        marginTop: 30,
        shadow: {
          color: 'rgba(0, 0, 0, 0.2)',
          blur: 2,
          offsetX: 1,
          offsetY: 1
        }
      }
    },
    // 添加边框样式配置
    border: {
      style: 'vintage', // vintage, dreamy, cyberpunk
      width: 20,
      patterns: {
        vintage: {
          colors: ['#8B4513', '#D2691E'],
          ornaments: true
        },
        dreamy: {
          colors: ['#FF69B4', '#87CEEB'],
          glow: true
        },
        cyberpunk: {
          colors: ['#00FF00', '#0000FF'],
          neon: true
        }
      }
    }
  }
};

// 创建离屏 Canvas
let canvas = new OffscreenCanvas(800, 600);
let ctx = canvas.getContext('2d');

// 计算文本换行
function getWrappedLines(text, maxWidth) {
  const words = text.split(/(?<=[\u4e00-\u9fa5])|(?<=\s)|(?<=\n)/);
  const lines = [];
  let currentLine = '';

  for (let i = 0; i < words.length; i++) {
    const word = words[i];
    const testLine = currentLine + word;
    const width = ctx.measureText(testLine).width;
    
    if (width < maxWidth) {
      currentLine = testLine;
    } else {
      lines.push(currentLine);
      currentLine = word;
    }
  }
  
  if (currentLine) {
    lines.push(currentLine);
  }
  
  return lines;
}

// 绘制星空背景
function drawStarryNight(ctx, width, height, style) {
  // 绘制深色背景
  ctx.fillStyle = style.background;
  ctx.fillRect(0, 0, width, height);

  // 绘制星星
  const stars = style.decorations.stars;
  for (let i = 0; i < stars.count; i++) {
    const x = Math.random() * width;
    const y = Math.random() * height;
    const size = stars.size[0] + Math.random() * (stars.size[1] - stars.size[0]);

    ctx.fillStyle = stars.color;
    ctx.shadowColor = stars.color;
    ctx.shadowBlur = size * 2;
    
    ctx.beginPath();
    ctx.arc(x, y, size, 0, Math.PI * 2);
    ctx.fill();
  }
}

// 绘制霓虹效果
function drawNeonText(ctx, text, x, y, style, settings) {
  const effect = style.textEffect;
  
  // 设置字体
  ctx.font = `${settings.fontSize}px "${settings.font}"`;
  
  // 绘制发光效果
  if (effect.glow) {
    ctx.shadowColor = effect.shadowColor;
    ctx.shadowBlur = effect.shadowBlur;
    ctx.strokeStyle = settings.textColor;
    ctx.lineWidth = effect.strokeWidth;
    ctx.strokeText(text, x, y);
  }

  // 绘制主文字
  ctx.shadowBlur = 0;
  ctx.fillStyle = settings.textColor;
  ctx.fillText(text, x, y);
}

// 添加水彩画效果绘制函数
function drawWatercolorEffect(ctx, width, height, style) {
  const effect = style.effect;
  
  // 绘制水彩底色
  ctx.fillStyle = style.background;
  ctx.fillRect(0, 0, width, height);
  
  // 绘制水彩效果
  effect.colors.forEach(color => {
    ctx.save();
    ctx.globalAlpha = effect.opacity;
    ctx.filter = `blur(${effect.blur}px)`;
    
    // 绘制不规则形状
    ctx.beginPath();
    const centerX = Math.random() * width;
    const centerY = Math.random() * height;
    const radius = Math.min(width, height) * 0.2;
    
    ctx.fillStyle = color;
    ctx.arc(centerX, centerY, radius, 0, Math.PI * 2);
    ctx.fill();
    
    ctx.restore();
  });
}

// 添加复古效果绘制函数
function drawVintageEffect(ctx, width, height, style) {
  const effect = style.effect;
  
  // 绘制底色
  ctx.fillStyle = style.background;
  ctx.fillRect(0, 0, width, height);
  
  // 添加复古滤镜效果
  ctx.save();
  ctx.filter = `sepia(${effect.sepia})`;
  
  // 添加噪点效果
  const imageData = ctx.getImageData(0, 0, width, height);
  const pixels = imageData.data;
  
  for (let i = 0; i < pixels.length; i += 4) {
    const noise = (Math.random() - 0.5) * effect.noise * 255;
    pixels[i] += noise;
    pixels[i + 1] += noise;
    pixels[i + 2] += noise;
  }
  
  ctx.putImageData(imageData, 0, 0);
  
  // 添加暗角效果
  const gradient = ctx.createRadialGradient(
    width/2, height/2, 0,
    width/2, height/2, Math.max(width, height)
  );
  gradient.addColorStop(0, 'transparent');
  gradient.addColorStop(1, `rgba(0,0,0,${effect.vignette})`);
  
  ctx.fillStyle = gradient;
  ctx.fillRect(0, 0, width, height);
  
  ctx.restore();
}

// 修改图片加载函数
function loadImage(base64Data) {
  return new Promise((resolve, reject) => {
    if (!base64Data) {
      resolve(null);
      return;
    }
    
    // 将 base64 转换为 Blob
    const byteString = atob(base64Data);
    const ab = new ArrayBuffer(byteString.length);
    const ia = new Uint8Array(ab);
    for (let i = 0; i < byteString.length; i++) {
      ia[i] = byteString.charCodeAt(i);
    }
    const blob = new Blob([ab], { type: 'image/png' });
    
    // 使用 createImageBitmap 替代 Image
    createImageBitmap(blob)
      .then(imageBitmap => {
        resolve(imageBitmap);
      })
      .catch(error => {
        console.error('Failed to load image:', error);
        reject(error);
      });
  });
}

// 修改每日精进样式绘制函数
async function drawDailyProgress(ctx, width, height, text, settings) {
  try {
    const style = cardStyles['daily-progress'];
    const layout = style.layout;
    
    // 预加载头像图片
    const avatarImg = await loadImage(settings.avatar);
    
    // 使用 requestAnimationFrame 优化渲染
    return new Promise((resolve) => {
      requestAnimationFrame(() => {
        // 1. 绘制背景
        ctx.fillStyle = style.background;
        ctx.fillRect(0, 0, width, height);
        
        // 2. 绘制标题区域
        ctx.textAlign = 'center';
        ctx.fillStyle = '#333';
        
        // 主标题
        ctx.font = `bold 28px "${settings.font}"`;
        ctx.fillText(settings.mainTitle || '每日精进', width/2, layout.headerHeight/2 - 10);
        
        // 副标题
        ctx.font = `italic 16px "${settings.font}"`;
        ctx.fillStyle = '#666';
        ctx.fillText(settings.subTitle || 'One sentence everyday', width/2, layout.headerHeight/2 + 20);
        
        // 3. 绘制分隔线和装饰
        drawDividerAndDecorations(ctx, width, height, layout, settings);
        
        // 4. 绘制头像
        if (avatarImg) {
          drawAvatar(ctx, width, height, layout, avatarImg);
        }
        
        // 5. 绘制内容文字
        drawContent(ctx, width, height, text, layout, settings);
        
        // 在绘制完内容后添加边框
        drawBorder(ctx, width, height, style);
        
        resolve();
      });
    });
  } catch (error) {
    console.error('绘制失败:', error);
    throw error;
  }
}

// 拆分绘制函数以优化性能
function drawDividerAndDecorations(ctx, width, height, layout, settings) {
  const dividerY = layout.headerHeight + layout.dividerHeight/2;
  
  // 绘制分隔线
  ctx.beginPath();
  ctx.moveTo(width * 0.1, dividerY);
  ctx.lineTo(width * 0.4, dividerY);
  ctx.moveTo(width * 0.6, dividerY);
  ctx.lineTo(width * 0.9, dividerY);
  ctx.strokeStyle = '#ddd';
  ctx.stroke();
  
  // 分隔线文字
  ctx.font = `16px "${settings.font}"`;
  ctx.fillStyle = '#5f9ea0';
  ctx.fillText(settings.dividerText || '向内生长', width/2, dividerY);
}

// 修改头像��制函数
function drawAvatar(ctx, width, height, layout, avatarImg) {
  const avatarY = layout.headerHeight + layout.dividerHeight + layout.avatarSize/2;
  
  ctx.save();
  // 创建圆形裁剪区域
  ctx.beginPath();
  ctx.arc(width/2, avatarY, layout.avatarSize/2, 0, Math.PI * 2);
  ctx.clip();
  
  // 使用 ImageBitmap 绘制头像
  ctx.drawImage(
    avatarImg,
    width/2 - layout.avatarSize/2,
    avatarY - layout.avatarSize/2,
    layout.avatarSize,
    layout.avatarSize
  );
  ctx.restore();
  
  // 绘制装饰三角形
  drawAvatarDecorations(ctx, width, avatarY, layout);
}

function drawAvatarDecorations(ctx, width, avatarY, layout) {
  ctx.fillStyle = '#5f9ea0';
  
  // 左三角
  ctx.beginPath();
  ctx.moveTo(width/2 - layout.avatarSize/2 - 20, avatarY);
  ctx.lineTo(width/2 - layout.avatarSize/2 - 4, avatarY - 8);
  ctx.lineTo(width/2 - layout.avatarSize/2 - 4, avatarY + 8);
  ctx.fill();
  
  // 右三角
  ctx.beginPath();
  ctx.moveTo(width/2 + layout.avatarSize/2 + 20, avatarY);
  ctx.lineTo(width/2 + layout.avatarSize/2 + 4, avatarY - 8);
  ctx.lineTo(width/2 + layout.avatarSize/2 + 4, avatarY + 8);
  ctx.fill();
  
  // 下三角
  ctx.beginPath();
  ctx.moveTo(width/2, avatarY + layout.avatarSize/2 + 20);
  ctx.lineTo(width/2 - 8, avatarY + layout.avatarSize/2 + 4);
  ctx.lineTo(width/2 + 8, avatarY + layout.avatarSize/2 + 4);
  ctx.fill();
}

// 添加内容绘制函数
function drawContent(ctx, width, height, text, layout, settings) {
  const avatarY = layout.headerHeight + layout.dividerHeight + layout.avatarSize/2;
  const contentY = avatarY + layout.avatarSize/2 + layout.contentPadding + layout.contentStyle.marginTop;
  
  ctx.font = `${settings.fontSize}px "${settings.font}"`;
  ctx.fillStyle = settings.textColor;
  ctx.textAlign = 'center';
  
  const shadow = layout.contentStyle.shadow;
  ctx.shadowColor = shadow.color;
  ctx.shadowBlur = shadow.blur;
  ctx.shadowOffsetX = shadow.offsetX;
  ctx.shadowOffsetY = shadow.offsetY;
  
  const maxWidth = width - layout.contentPadding * 2;
  const lines = getWrappedLines(text, maxWidth);
  const lineHeight = settings.fontSize * 1.5;
  
  lines.forEach((line, index) => {
    ctx.fillText(line, width/2, contentY + index * lineHeight);
  });
  
  ctx.shadowColor = 'transparent';
  ctx.shadowBlur = 0;
  ctx.shadowOffsetX = 0;
  ctx.shadowOffsetY = 0;
}

// 修改主绘制函数
function drawCardBackground(style, width, height) {
  const cardStyle = cardStyles[style];
  
  ctx.clearRect(0, 0, width, height);
  
  // 绘制圆角矩形路径
  const radius = 16;
  ctx.beginPath();
  ctx.moveTo(radius, 0);
  ctx.lineTo(width - radius, 0);
  ctx.quadraticCurveTo(width, 0, width, radius);
  ctx.lineTo(width, height - radius);
  ctx.quadraticCurveTo(width, height, width - radius, height);
  ctx.lineTo(radius, height);
  ctx.quadraticCurveTo(0, height, 0, height - radius);
  ctx.lineTo(0, radius);
  ctx.quadraticCurveTo(0, 0, radius, 0);
  ctx.closePath();

  // 根据样式类型选择绘制方法
  switch (style) {
    case 'daily-progress':
      // 每日精进样式不需要在这里处理背景
      break;
    case 'starry-night':
      drawStarryNight(ctx, width, height, cardStyle);
      break;
    case 'watercolor':
      drawWatercolorEffect(ctx, width, height, cardStyle);
      break;
    case 'vintage':
      drawVintageEffect(ctx, width, height, cardStyle);
      break;
    default:
      if (cardStyle.background.includes('linear-gradient')) {
        // 解析渐变角度和颜色
        const gradientMatch = cardStyle.background.match(/linear-gradient\((\d+)deg,\s*([^)]+)\)/);
        if (gradientMatch) {
          const angle = parseInt(gradientMatch[1]);
          const colorStops = gradientMatch[2].split(',').map(stop => {
            const [color, position] = stop.trim().split(/\s+/);
            return {
              color: color,
              position: parseFloat(position) / 100
            };
          });

          // 计算渐变起点和终点
          const radian = (angle - 90) * (Math.PI / 180);
          const gradientLength = Math.abs(width * Math.sin(radian)) + Math.abs(height * Math.cos(radian));
          const centerX = width / 2;
          const centerY = height / 2;
          const startX = centerX - (Math.cos(radian) * gradientLength / 2);
          const startY = centerY - (Math.sin(radian) * gradientLength / 2);
          const endX = centerX + (Math.cos(radian) * gradientLength / 2);
          const endY = centerY + (Math.sin(radian) * gradientLength / 2);

          // 创建渐变对象
          const gradient = ctx.createLinearGradient(startX, startY, endX, endY);
          
          // 添加渐变色标
          colorStops.forEach(stop => {
            gradient.addColorStop(stop.position, stop.color);
          });

          ctx.fillStyle = gradient;
        } else {
          // 降级处理
          ctx.fillStyle = cardStyle.background;
        }
      } else {
        ctx.fillStyle = cardStyle.background;
      }
      
      // 填充圆角矩形
      ctx.fill();

      // 添加阴影效果
      if (cardStyle.shadow) {
        ctx.shadowColor = 'rgba(0, 0, 0, 0.2)';
        ctx.shadowBlur = 12;
        ctx.shadowOffsetX = 0;
        ctx.shadowOffsetY = 4;
      }
  }
}

// 修改文字绘制函数
function drawText(text, settings, width, height) {
  const cardStyle = cardStyles[settings.style];
  const padding = cardStyle.padding;
  const maxWidth = width - (padding * 2);
  
  // 设置字体
  ctx.font = `${settings.fontSize}px "${settings.font}"`;
  ctx.textBaseline = 'middle';
  
  // 计算行高
  const lineHeight = settings.fontSize * 1.5;
  
  // 获取换行后的文本
  const lines = getWrappedLines(text, maxWidth);
  
  // 计算文本总高度
  const textHeight = lines.length * lineHeight;
  
  // 计算起始坐标（垂直居中）
  let startY = (height - textHeight) / 2;
  
  // 应用文字旋转 - 修改旋转逻辑
  if (settings.rotation) {
    ctx.save();
    
    // 计算文本块的中心点
    const textBlockWidth = maxWidth;
    const textBlockHeight = textHeight;
    const centerX = width / 2;
    const centerY = height / 2;
    
    // 移动到旋转中心点
    ctx.translate(centerX, centerY);
    ctx.rotate((settings.rotation * Math.PI) / 180);
    ctx.translate(-centerX, -centerY);
  }
  
  // 根据样式选择绘制方法
  if (settings.style === 'neon') {
    lines.forEach((line, index) => {
      const lineWidth = ctx.measureText(line).width;
      const x = (width - lineWidth) / 2;
      const y = startY + (index * lineHeight);
      drawNeonText(ctx, line, x, y, cardStyle, settings);
    });
  } else {
    ctx.fillStyle = settings.textColor;
    lines.forEach((line, index) => {
      const lineWidth = ctx.measureText(line).width;
      const x = (width - lineWidth) / 2;
      const y = startY + (index * lineHeight);
      ctx.fillText(line, x, y);
    });
  }
  
  if (settings.rotation) {
    ctx.restore();
  }
}

// 修改生成卡片函数为异步
async function generateCard(text, settings) {
  const width = settings.width || 800;
  const height = settings.height || 600;
  canvas.width = width;
  canvas.height = height;
  
  if(settings.style === 'daily-progress') {
    await drawDailyProgress(ctx, width, height, text, settings);
  } else {
    drawCardBackground(settings.style, width, height);
    drawText(text, settings, width, height);
  }
  
  return canvas.convertToBlob()
    .then(blob => {
      return new Promise((resolve) => {
        const reader = new FileReader();
        reader.onloadend = () => resolve(reader.result);
        reader.readAsDataURL(blob);
      });
    });
}

// 监听主线程消息
self.onmessage = async function(e) {
  const { type, text, settings, index } = e.data;
  
  try {
    const imageData = await generateCard(text, settings);
    
    self.postMessage({
      type,
      imageData,
      index,
    });
  } catch (error) {
    self.postMessage({
      type: 'error',
      error: error.message,
    });
  }
}; 

// 添加边框绘制函数
function drawBorder(ctx, width, height, style) {
  const borderWidth = style.border.width;
  const pattern = style.border.patterns[style.border.style];

  ctx.save();
  
  switch(style.border.style) {
    case 'vintage':
      drawVintageBorder(ctx, width, height, borderWidth, pattern);
      break;
    case 'dreamy':
      drawDreamyBorder(ctx, width, height, borderWidth, pattern);
      break;
    case 'cyberpunk':
      drawCyberpunkBorder(ctx, width, height, borderWidth, pattern);
      break;
  }

  ctx.restore();
}

// 绘制复古风格边框
function drawVintageBorder(ctx, width, height, borderWidth, pattern) {
  // 绘制基础边框
  ctx.lineWidth = borderWidth;
  const gradient = ctx.createLinearGradient(0, 0, width, height);
  gradient.addColorStop(0, pattern.colors[0]);
  gradient.addColorStop(1, pattern.colors[1]);
  ctx.strokeStyle = gradient;
  
  // 绘制圆角矩形边框
  const radius = 16;
  ctx.beginPath();
  ctx.moveTo(radius, borderWidth/2);
  ctx.lineTo(width - radius, borderWidth/2);
  ctx.quadraticCurveTo(width - borderWidth/2, borderWidth/2, width - borderWidth/2, radius);
  ctx.lineTo(width - borderWidth/2, height - radius);
  ctx.quadraticCurveTo(width - borderWidth/2, height - borderWidth/2, width - radius, height - borderWidth/2);
  ctx.lineTo(radius, height - borderWidth/2);
  ctx.quadraticCurveTo(borderWidth/2, height - borderWidth/2, borderWidth/2, height - radius);
  ctx.lineTo(borderWidth/2, radius);
  ctx.quadraticCurveTo(borderWidth/2, borderWidth/2, radius, borderWidth/2);
  ctx.stroke();

  // 绘制复古风格装饰
  if (pattern.ornaments) {
    drawVintageOrnaments(ctx, width, height, borderWidth);
  }
}

// 绘制梦幻风格边框
function drawDreamyBorder(ctx, width, height, borderWidth, pattern) {
  // 创建渐变边框
  const gradient = ctx.createLinearGradient(0, 0, width, height);
  gradient.addColorStop(0, pattern.colors[0]);
  gradient.addColorStop(0.5, pattern.colors[1]);
  gradient.addColorStop(1, pattern.colors[0]);
  
  ctx.lineWidth = borderWidth;
  ctx.strokeStyle = gradient;
  
  // 添加发光效果
  if (pattern.glow) {
    ctx.shadowColor = pattern.colors[0];
    ctx.shadowBlur = 15;
  }
  
  // 绘制圆角边框
  const radius = 16;
  ctx.beginPath();
  ctx.moveTo(radius, borderWidth/2);
  ctx.lineTo(width - radius, borderWidth/2);
  ctx.quadraticCurveTo(width - borderWidth/2, borderWidth/2, width - borderWidth/2, radius);
  ctx.lineTo(width - borderWidth/2, height - radius);
  ctx.quadraticCurveTo(width - borderWidth/2, height - borderWidth/2, width - radius, height - borderWidth/2);
  ctx.lineTo(radius, height - borderWidth/2);
  ctx.quadraticCurveTo(borderWidth/2, height - borderWidth/2, borderWidth/2, height - radius);
  ctx.lineTo(borderWidth/2, radius);
  ctx.quadraticCurveTo(borderWidth/2, borderWidth/2, radius, borderWidth/2);
  ctx.stroke();
  
  // 添加梦幻风格装饰
  drawStarryDecorations(ctx, width, height, borderWidth);
}

// 绘制科幻风格边框
function drawCyberpunkBorder(ctx, width, height, borderWidth, pattern) {
  ctx.lineWidth = borderWidth;
  
  // 创建霓虹效果
  if (pattern.neon) {
    ctx.shadowColor = pattern.colors[0];
    ctx.shadowBlur = 20;
  }
  
  // 绘制几何边框
  const cornerSize = 40;
  const segments = [
    // 左上角
    { x: 0, y: cornerSize, x2: 0, y2: 0, x3: cornerSize, y3: 0 },
    // 右上角
    { x: width - cornerSize, y: 0, x2: width, y2: 0, x3: width, y3: cornerSize },
    // 右下角
    { x: width, y: height - cornerSize, x2: width, y2: height, x3: width - cornerSize, y3: height },
    // 左下角
    { x: cornerSize, y: height, x2: 0, y2: height, x3: 0, y3: height - cornerSize }
  ];
  
  segments.forEach((segment, index) => {
    ctx.beginPath();
    ctx.strokeStyle = pattern.colors[index % 2];
    ctx.moveTo(segment.x, segment.y);
    ctx.lineTo(segment.x2, segment.y2);
    ctx.lineTo(segment.x3, segment.y3);
    ctx.stroke();
  });
  
  // 添加科技风格装饰
  drawTechDecorations(ctx, width, height, borderWidth, pattern.colors);
}

// 绘制复古风格装饰
function drawVintageOrnaments(ctx, width, height, borderWidth) {
  // 绘制四角装饰
  const cornerSize = borderWidth * 2;
  const corners = [
    { x: borderWidth, y: borderWidth }, // 左上
    { x: width - borderWidth, y: borderWidth }, // 右上
    { x: width - borderWidth, y: height - borderWidth }, // 右下
    { x: borderWidth, y: height - borderWidth } // 左下
  ];

  corners.forEach(corner => {
    ctx.save();
    ctx.translate(corner.x, corner.y);
    
    // 绘制花纹
    ctx.beginPath();
    ctx.arc(0, 0, cornerSize/2, 0, Math.PI * 2);
    ctx.strokeStyle = '#8B4513';
    ctx.lineWidth = 2;
    ctx.stroke();

    // 绘制装饰线
    for(let i = 0; i < 4; i++) {
      ctx.beginPath();
      ctx.moveTo(0, 0);
      const angle = (Math.PI / 2) * i;
      ctx.lineTo(
        Math.cos(angle) * cornerSize,
        Math.sin(angle) * cornerSize
      );
      ctx.stroke();
    }

    ctx.restore();
  });

  // 绘制边框装饰点
  const spacing = 40;
  const dotRadius = 3;
  
  ctx.fillStyle = '#8B4513';
  
  // 上下边框装饰
  for(let x = borderWidth * 2; x < width - borderWidth * 2; x += spacing) {
    ctx.beginPath();
    ctx.arc(x, borderWidth/2, dotRadius, 0, Math.PI * 2);
    ctx.arc(x, height - borderWidth/2, dotRadius, 0, Math.PI * 2);
    ctx.fill();
  }
  
  // 左右边框装饰
  for(let y = borderWidth * 2; y < height - borderWidth * 2; y += spacing) {
    ctx.beginPath();
    ctx.arc(borderWidth/2, y, dotRadius, 0, Math.PI * 2);
    ctx.arc(width - borderWidth/2, y, dotRadius, 0, Math.PI * 2);
    ctx.fill();
  }
}

// 绘制梦幻风格装饰
function drawStarryDecorations(ctx, width, height, borderWidth) {
  const starCount = 30;
  const maxStarSize = 3;
  
  // 在边框附近绘制星星
  for(let i = 0; i < starCount; i++) {
    // 随机位置
    const x = Math.random() * width;
    const y = Math.random() * height;
    
    // 确保星星在边框附近
    if(x > borderWidth * 2 && x < width - borderWidth * 2 &&
       y > borderWidth * 2 && y < height - borderWidth * 2) {
      continue;
    }
    
    // 随机大小
    const size = Math.random() * maxStarSize + 1;
    
    // 绘制星星
    ctx.save();
    ctx.fillStyle = '#FFF';
    ctx.shadowColor = '#87CEEB';
    ctx.shadowBlur = size * 3;
    
    // 五角星路径
    ctx.beginPath();
    for(let j = 0; j < 5; j++) {
      const angle = (j * 4 * Math.PI) / 5 - Math.PI / 2;
      const x1 = x + Math.cos(angle) * size;
      const y1 = y + Math.sin(angle) * size;
      if(j === 0) {
        ctx.moveTo(x1, y1);
      } else {
        ctx.lineTo(x1, y1);
      }
    }
    ctx.closePath();
    ctx.fill();
    
    ctx.restore();
  }
  
  // 添加光晕效果
  const gradient = ctx.createRadialGradient(
    width/2, height/2, 0,
    width/2, height/2, Math.max(width, height)/2
  );
  gradient.addColorStop(0, 'rgba(135, 206, 235, 0)');
  gradient.addColorStop(0.8, 'rgba(135, 206, 235, 0.1)');
  gradient.addColorStop(1, 'rgba(135, 206, 235, 0.2)');
  
  ctx.fillStyle = gradient;
  ctx.fillRect(0, 0, width, height);
}

// 绘制科技风格装饰
function drawTechDecorations(ctx, width, height, borderWidth, colors) {
  // 绘制电路线
  const circuitPoints = 8;
  const circuitWidth = 2;
  
  ctx.lineWidth = circuitWidth;
  
  // 在四个角落绘制电路
  const corners = [
    { x: borderWidth * 2, y: borderWidth * 2 }, // 左上
    { x: width - borderWidth * 2, y: borderWidth * 2 }, // 右上
    { x: width - borderWidth * 2, y: height - borderWidth * 2 }, // 右下
    { x: borderWidth * 2, y: height - borderWidth * 2 } // 左下
  ];
  
  corners.forEach((corner, index) => {
    ctx.strokeStyle = colors[index % 2];
    ctx.shadowColor = colors[index % 2];
    ctx.shadowBlur = 10;
    
    // 创建随机电路路径
    ctx.beginPath();
    ctx.moveTo(corner.x, corner.y);
    
    for(let i = 0; i < circuitPoints; i++) {
      const angle = Math.random() * Math.PI * 2;
      const length = Math.random() * 30 + 20;
      ctx.lineTo(
        corner.x + Math.cos(angle) * length,
        corner.y + Math.sin(angle) * length
      );
    }
    
    ctx.stroke();
    
    // 添加端点
    const dotRadius = 4;
    ctx.fillStyle = colors[index % 2];
    ctx.beginPath();
    ctx.arc(corner.x, corner.y, dotRadius, 0, Math.PI * 2);
    ctx.fill();
  });
  
  // 添加数据流动效果
  const flowCount = 3;
  const flowLength = 20;
  const flowSpeed = Date.now() / 1000;
  
  ctx.strokeStyle = colors[0];
  ctx.lineWidth = 1;
  
  for(let i = 0; i < flowCount; i++) {
    const offset = (flowSpeed + i * 5) % (width + height);
    const pos = offset / (width + height);
    
    if(pos < width / (width + height)) {
      // 上边框流动
      const x = offset;
      ctx.beginPath();
      ctx.moveTo(x, borderWidth/2);
      ctx.lineTo(x + flowLength, borderWidth/2);
      ctx.stroke();
    } else {
      // 右边框流动
      const y = offset - width;
      ctx.beginPath();
      ctx.moveTo(width - borderWidth/2, y);
      ctx.lineTo(width - borderWidth/2, y + flowLength);
      ctx.stroke();
    }
  }
} 