<template>
  <div class="community-container">
    <!-- 顶部操作栏 -->
    <div class="action-bar">
      <el-button type="primary" @click="showPostDialog"> 发布话题 </el-button>
      <el-input
        v-model="searchKeyword"
        placeholder="搜索话题"
        class="search-input"
      >
        <template #prefix>
          <el-icon><Search /></el-icon>
        </template>
      </el-input>
    </div>

    <!-- 话题分类 -->
    <div class="category-tabs">
      <el-tabs v-model="activeCategory" @tab-click="handleCategoryChange">
        <el-tab-pane label="全部" name="all" />
        <el-tab-pane label="情感分享" name="share" />
        <el-tab-pane label="求助咨询" name="help" />
        <el-tab-pane label="成功案例" name="success" />
      </el-tabs>
    </div>

    <!-- 话题列表 -->
    <div class="post-list">
      <el-card v-for="post in posts" :key="post.id" class="post-card">
        <div class="post-header">
          <div class="user-info">
            <el-avatar :src="post.author.avatar" />
            <span class="username">{{ post.author.name }}</span>
          </div>
          <span class="post-time">{{ formatTime(post.createTime) }}</span>
        </div>
        <h3 class="post-title" @click="viewPost(post)">
          {{ post.title }}
        </h3>
        <p class="post-content">{{ post.content }}</p>
        <div class="post-images" v-if="post.images?.length">
          <el-image
            v-for="img in post.images"
            :key="img"
            :src="img"
            :preview-src-list="post.images"
          />
        </div>
        <div class="post-footer">
          <div class="action-items">
            <span class="action-item" @click="likePost(post)">
              <el-icon><ThumbsUp /></el-icon>
              {{ post.likes }}
            </span>
            <span class="action-item" @click="viewPost(post)">
              <el-icon><ChatDotRound /></el-icon>
              {{ post.comments }}
            </span>
            <span class="action-item" @click="collectPost(post)">
              <el-icon><Star /></el-icon>
              {{ post.collects }}
            </span>
          </div>
        </div>
      </el-card>
    </div>

    <!-- 发布话题对话框 -->
    <el-dialog v-model="postDialogVisible" title="发布话题" width="50%">
      <el-form :model="postForm" :rules="postRules" ref="postFormRef">
        <el-form-item label="标题" prop="title">
          <el-input v-model="postForm.title" />
        </el-form-item>
        <el-form-item label="内容" prop="content">
          <el-input v-model="postForm.content" type="textarea" :rows="4" />
        </el-form-item>
        <el-form-item label="图片">
          <el-upload
            action="/api/upload"
            list-type="picture-card"
            :on-success="handleUploadSuccess"
            :on-remove="handleUploadRemove"
          >
            <el-icon><Plus /></el-icon>
          </el-upload>
        </el-form-item>
      </el-form>
      <template #footer>
        <span class="dialog-footer">
          <el-button @click="postDialogVisible = false">取消</el-button>
          <el-button type="primary" @click="submitPost"> 发布 </el-button>
        </span>
      </template>
    </el-dialog>
  </div>
</template>

<script setup>
import { ref, reactive } from "vue";
import { useRouter } from "vue-router";
import { formatTime } from "@/utils/time";

const router = useRouter();
const searchKeyword = ref("");
const activeCategory = ref("all");
const postDialogVisible = ref(false);
const posts = ref([]);

// 发布表单
const postForm = reactive({
  title: "",
  content: "",
  images: [],
});

// 表单验证规则
const postRules = {
  title: [
    { required: true, message: "请输入标题", trigger: "blur" },
    { min: 2, max: 50, message: "标题长度在2-50个字符之间", trigger: "blur" },
  ],
  content: [
    { required: true, message: "请输入内容", trigger: "blur" },
    { min: 10, message: "内容不能少于10个字符", trigger: "blur" },
  ],
};

// 获取话题列表
const getPosts = async () => {
  // 实现获取话题列表的逻辑
};

// 查看话题详情
const viewPost = (post) => {
  router.push(`/post/${post.id}`);
};

// 点赞
const likePost = async (post) => {
  // 实现点赞逻辑
};

// 收藏
const collectPost = async (post) => {
  // 实现收藏逻辑
};

// 提交发布
const submitPost = async () => {
  // 实现发布话题的逻辑
};
</script>

<style scoped>
.community-container {
  padding: 20px;
}

.action-bar {
  display: flex;
  justify-content: space-between;
  margin-bottom: 20px;
}

.search-input {
  width: 300px;
}

.post-card {
  margin-bottom: 20px;
}

.post-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 10px;
}

.user-info {
  display: flex;
  align-items: center;
  gap: 10px;
}

.post-title {
  cursor: pointer;
  margin: 10px 0;
}

.post-images {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 10px;
  margin: 10px 0;
}

.post-footer {
  margin-top: 10px;
  border-top: 1px solid #eee;
  padding-top: 10px;
}

.action-items {
  display: flex;
  gap: 20px;
}

.action-item {
  cursor: pointer;
  display: flex;
  align-items: center;
  gap: 5px;
}
</style>
