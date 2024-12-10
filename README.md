# 工具箱项目

## 图片模块

### 图片压缩

这是一个基于 Vue 3 + Element Plus 开发的在线图片压缩工具。采用现代化的技术栈和优雅的界面设计,为用户提供简单易用的图片压缩服务。

主要功能：

- 支持单张图片压缩
- 实时预览压缩效果
- 自定义压缩质量

### 批量图片压缩

支持多张图片同时压缩的功能，提高工作效率。

主要功能：

- 支持多张图片同时上传
- 显示压缩进度和状态
- 支持单张或批量下载
- 显示压缩前后对比数据
- 统一压缩质量设置

### 图片格式转换

支持多种图片格式之间的相互转换，提供简单直观的操作界面。

主要功能：

- 支持 PNG、JPEG、WebP 等常用格式的互转
- 实时预览转换效果
- 可调节输出图片质量
- 支持拖拽上传
- 显示原始图片信息
- 支持一键下载转换后的图片

特点：

- 使用 Canvas API 进行图片格式转换
- 本地转换，保护隐私
- 支持批量处理
- 优雅的苹果风格界面设计

### 图片水印功能

图片水印功能允许用户为图片添加自定义水印，支持以下特性：

1. 水印类型

   - 文字水印：支持自定义文字内容、字体、大小和颜色
   - 图片水印：支持上传自定义图片作为水印

2. 水印设置

   - 透明度调节：0-100%可调
   - 位置选择：支持左上、右上、左下、右下、居中和自定义位置
   - 实时预览：所有修改都可即时预览效果

3. 使用方法

   - 上传图片：支持拖拽或点击上传
   - 选择水印类型：文字或图片
   - 调整水印参数：根据需要设置位置、透明度等
   - 应用水印：点击"应用水印"按钮
   - 下载成品：点击"下载图片"保存处理后的图片

4. 支持格式
   - 输入格式：PNG、JPG、WebP 等常见图片格式
   - 输出格式：保持原始格式

### 图片模糊化

- 上传图片：支持拖拽或点击上传
- 选择模糊模式：支持全图模糊、局部模糊和自定义模糊
- 调整模糊强度：0-100%可调
- 实时预览：所有修改都可即时预览效果
- 应用模糊：点击"应用模糊"按钮
- 下载成品：点击"下载图片"保存处理后的图片

### 图片加滤镜

待定

### 图片转黑白

待定

### 图片裁剪

待定

### 图片转灰度

待定

### 图片画质增强

待定

### 图片裁剪

待定

### 图片去重

待定

### 图片转字符画

待定

### 图片转二维码

待定

## 文件模块

### 文件复制黏贴模块

待定

## 技术栈

- Vue 3 - 渐进式 JavaScript 框架
- Element Plus - 基于 Vue 3 的组件库
- Vite - 下一代前端构建工具
- Pinia - Vue 3 的状态管理方案

## 功能特点

- 支持上传 PNG、JPG 等格式的图片
- 支持自定义压缩比例
- 实时预览压缩前后的图片效果
- 显示压缩前后的文件大小
- 支持下载压缩后的图片
- 优雅的苹果风格界面设计
- 响应式布局,支持移动端访问

## 项目结构

src/
├── assets/ # 静态资源文件
├── components/ # 公共组件
│ └── ModuleList.vue # 模块列表组件
├── layouts/ # 布局组件
│ ├── DefaultLayout.vue # 默认布局
│ └── ModuleLayout.vue # 模块布局
├── router/ # 路由配置
│ └── index.js
├── stores/ # Pinia 状态管理
│ └── compress.js # 压缩相关状态
└── views/ # 页面组件
├── Home.vue # 首页
└── Compress.vue # 压缩页面

## 浏览器支持

- Chrome (最新版本)
- Firefox (最新版本)
- Safari (最新版本)
- Edge (最新版本)

## 性能优化

- 使用 Vite 实现快速的开发体验
- 图片懒加载
- 组件按需加载
- 资源压缩和缓存策略

## 后续规划

- [ ] 支持批量压缩
- [ ] 添加更多图片格式支持
- [ ] 云端存储功能
- [ ] 历史记录功能
- [ ] 暗黑模式支持
- 图片加水印
