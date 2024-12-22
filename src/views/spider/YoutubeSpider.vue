<template>
  <div class="youtube-spider">
    <!-- 标题区域 -->
    <div class="title-section">
      <h1>Youtube视频下载器 v1.0.0</h1>
      <div class="version-info">Windows 64位版本</div>
      <div class="update-date">更新日期: 2024-03-12</div>
    </div>

    <!-- 下载区域 -->
    <div class="download-section">
      <el-button
        type="danger"
        size="large"
        class="download-btn"
        @click="handleDownload"
      >
        <el-icon class="download-icon"><Download /></el-icon>
        立即下载
      </el-button>
      <div class="download-info">
        <span>文件大小: 15.6MB</span>
        <span>支持系统: Windows 7/8/10/11</span>
      </div>
    </div>

    <!-- 软件预览 -->
    <div class="preview-section">
      <el-image :src="previewImage" fit="contain" class="preview-image">
        <template #error>
          <div class="preview-placeholder">软件界面预览</div>
        </template>
      </el-image>
    </div>

    <!-- 功能特点 -->
    <div class="features-section">
      <el-row :gutter="20">
        <el-col :span="8">
          <el-card class="feature-card">
            <template #header>
              <div class="feature-header">
                <el-icon><VideoPlay /></el-icon>
                支持多种格式
              </div>
            </template>
            <div class="feature-content">
              支持下载MP4、WebM等主流视频格式,自动选择最高清晰度
            </div>
          </el-card>
        </el-col>

        <el-col :span="8">
          <el-card class="feature-card">
            <template #header>
              <div class="feature-header">
                <el-icon><Lightning /></el-icon>
                快速下载
              </div>
            </template>
            <div class="feature-content">
              多线程下载技术,支持断点续传,下载速度快
            </div>
          </el-card>
        </el-col>

        <el-col :span="8">
          <el-card class="feature-card">
            <template #header>
              <div class="feature-header">
                <el-icon><Monitor /></el-icon>
                简单易用
              </div>
            </template>
            <div class="feature-content">
              简洁的操作界面,复制链接即可一键下载
            </div>
          </el-card>
        </el-col>
      </el-row>
    </div>

    <!-- 使用说明 -->
    <div class="guide-section">
      <h2>使用说明</h2>
      <ol class="guide-steps">
        <li>下载并安装Youtube视频下载器</li>
        <li>打开Youtube网页,复制想要下载的视频链接</li>
        <li>打开下载器,粘贴链接后点击下载</li>
        <li>选择保存位置,等待下载完成</li>
      </ol>
    </div>
  </div>
</template>

<script setup>
import {
  Download,
  VideoPlay,
  Lightning,
  Monitor,
} from "@element-plus/icons-vue";
import { ElMessage } from "element-plus";
import { ref } from "vue";
import previewImageUrl from "@/assets/images/youtube-downloader-preview.png";

const previewImage = ref(previewImageUrl);

const handleDownload = () => {
  // TODO: 实现软件下载逻辑
  window.location.href = "/downloads/youtube-downloader-v1.0.0.exe";
  ElMessage.success("开始下载软件...");
};
</script>

<style scoped>
.youtube-spider {
  max-width: 1200px;
  margin: 0 auto;
  padding: 20px;
}

.title-section {
  text-align: center;
  margin-bottom: 40px;
}

.title-section h1 {
  color: #ff0000;
  margin-bottom: 10px;
  font-size: 2.5em;
}

.version-info,
.update-date {
  color: #666;
  font-size: 14px;
}

.download-section {
  text-align: center;
  margin-bottom: 50px;
}

.download-btn {
  padding: 20px 50px;
  font-size: 1.5em;
}

.download-icon {
  margin-right: 10px;
  font-size: 1.2em;
}

.download-info {
  margin-top: 15px;
  color: #666;
}

.download-info span {
  margin: 0 15px;
}

.preview-section {
  margin-bottom: 50px;
  text-align: center;
}

.preview-image {
  max-width: 800px;
  border-radius: 8px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
}

.preview-placeholder {
  width: 800px;
  height: 450px;
  background: #f5f5f5;
  display: flex;
  align-items: center;
  justify-content: center;
  color: #999;
  border-radius: 8px;
}

.features-section {
  margin-bottom: 50px;
}

.feature-card {
  height: 100%;
  transition: transform 0.3s;
}

.feature-card:hover {
  transform: translateY(-5px);
}

.feature-header {
  display: flex;
  align-items: center;
  font-size: 1.2em;
  font-weight: bold;
}

.feature-header .el-icon {
  margin-right: 8px;
  font-size: 1.4em;
  color: #ff0000;
}

.feature-content {
  color: #666;
  line-height: 1.6;
}

.guide-section {
  max-width: 800px;
  margin: 0 auto;
}

.guide-section h2 {
  text-align: center;
  color: #333;
  margin-bottom: 20px;
}

.guide-steps {
  background: #f8f8f8;
  padding: 30px 50px;
  border-radius: 8px;
  line-height: 2;
}

.guide-steps li {
  margin-bottom: 10px;
  color: #444;
}
</style>
