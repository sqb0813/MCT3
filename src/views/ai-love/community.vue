<template>
  <div class="community-container">
    <!-- 顶部操作栏 -->
    <div class="action-bar">
      <el-button type="primary" @click="showPostDialog">
        <el-icon><Edit /></el-icon>
        发布话题
      </el-button>
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
        <h3 class="post-title" @click="viewPostDetail(post.id)">
          {{ post.title }}
        </h3>
        <p class="post-content">{{ post.content }}</p>
        <div class="post-footer">
          <div class="post-stats">
            <span class="stat-item">
              <el-icon><View /></el-icon>
              {{ post.views }}
            </span>
            <span class="stat-item">
              <el-icon><ChatLineRound /></el-icon>
              {{ post.comments }}
            </span>
            <span class="stat-item">
              <el-icon><Star /></el-icon>
              {{ post.likes }}
            </span>
          </div>
          <el-tag size="small" :type="getCategoryType(post.category)">
            {{ post.category }}
          </el-tag>
        </div>
      </el-card>
    </div>

    <!-- 分页 -->
    <div class="pagination">
      <el-pagination
        v-model:current-page="currentPage"
        v-model:page-size="pageSize"
        :total="total"
        :page-sizes="[10, 20, 30, 50]"
        layout="total, sizes, prev, pager, next"
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
      />
    </div>

    <!-- 发布话题对话框 -->
    <el-dialog
      v-model="postDialogVisible"
      title="发布话题"
      width="600px"
      :before-close="handleDialogClose"
    >
      <el-form
        ref="postFormRef"
        :model="postForm"
        :rules="postRules"
        label-position="top"
      >
        <el-form-item label="标题" prop="title">
          <el-input v-model="postForm.title" placeholder="请输入标题" />
        </el-form-item>

        <el-form-item label="分类" prop="category">
          <el-select v-model="postForm.category" placeholder="请选择分类">
            <el-option label="情感分享" value="share" />
            <el-option label="求助咨询" value="help" />
            <el-option label="成功案例" value="success" />
          </el-select>
        </el-form-item>

        <el-form-item label="内容" prop="content">
          <el-input
            v-model="postForm.content"
            type="textarea"
            :rows="6"
            placeholder="请输入内容"
          />
        </el-form-item>
      </el-form>
      <template #footer>
        <span class="dialog-footer">
          <el-button @click="handleDialogClose">取消</el-button>
          <el-button type="primary" @click="submitPost" :loading="submitting">
            发布
          </el-button>
        </span>
      </template>
    </el-dialog>
  </div>
</template>

<script setup>
import { ref, reactive, onMounted } from "vue";
import { useRouter } from "vue-router";
import { ElMessage } from "element-plus";
import {
  Edit,
  Search,
  View,
  ChatLineRound,
  Star,
} from "@element-plus/icons-vue";

const router = useRouter();
const searchKeyword = ref("");
const activeCategory = ref("all");
const currentPage = ref(1);
const pageSize = ref(10);
const total = ref(0);
const postDialogVisible = ref(false);
const submitting = ref(false);

// 话题列表数据
const posts = ref([
  {
    id: 1,
    title: "分享我的恋爱经历",
    content: "这是一段美好的恋爱经历...",
    author: {
      name: "用户1",
      avatar: "https://example.com/avatar1.jpg",
    },
    createTime: "2024-01-15T10:00:00",
    views: 100,
    comments: 20,
    likes: 30,
    category: "share",
  },
  // 更多帖子数据...
]);

// 发布话题表单
const postForm = reactive({
  title: "",
  category: "",
  content: "",
});

// 表单验证规则
const postRules = {
  title: [
    { required: true, message: "请输入标题", trigger: "blur" },
    { min: 5, max: 50, message: "标题长度在5-50个字符之间", trigger: "blur" },
  ],
  category: [{ required: true, message: "请选择分类", trigger: "change" }],
  content: [
    { required: true, message: "请输入内容", trigger: "blur" },
    { min: 10, message: "内容不能少于10个字符", trigger: "blur" },
  ],
};

// 获取话题列表
const getPosts = async () => {
  try {
    // TODO: 调用获取话题列表API
    // const { data } = await api.getPosts({
    //   page: currentPage.value,
    //   pageSize: pageSize.value,
    //   category: activeCategory.value,
    //   keyword: searchKeyword.value,
    // });
    // posts.value = data.list;
    // total.value = data.total;
  } catch (error) {
    ElMessage.error("获取话题列表失败");
  }
};

// 格式化时间
const formatTime = (time) => {
  // TODO: 实现时间格式化
  return time;
};

// 获取分类标签类型
const getCategoryType = (category) => {
  const types = {
    share: "",
    help: "warning",
    success: "success",
  };
  return types[category] || "";
};

// 查看话题详情
const viewPostDetail = (id) => {
  router.push(`/ai-love/community/post/${id}`);
};

// 显示发布话题对话框
const showPostDialog = () => {
  postDialogVisible.value = true;
};

// 关闭对话框
const handleDialogClose = () => {
  postDialogVisible.value = false;
  postForm.title = "";
  postForm.category = "";
  postForm.content = "";
};

// 提交话题
const submitPost = async () => {
  const postFormRef = ref(null);
  if (!postFormRef.value) return;

  try {
    submitting.value = true;
    await postFormRef.value.validate();
    // TODO: 调用发布话题API
    ElMessage.success("发布成功");
    handleDialogClose();
    getPosts();
  } catch (error) {
    ElMessage.error(error.message || "发布失败");
  } finally {
    submitting.value = false;
  }
};

// 处理分页大小变化
const handleSizeChange = (val) => {
  pageSize.value = val;
  getPosts();
};

// 处理页码变化
const handleCurrentChange = (val) => {
  currentPage.value = val;
  getPosts();
};

// 处理分类变化
const handleCategoryChange = () => {
  currentPage.value = 1;
  getPosts();
};

onMounted(() => {
  getPosts();
});
</script>

<style scoped>
.community-container {
  max-width: 1000px;
  margin: 0 auto;
  padding: 20px;
}

.action-bar {
  display: flex;
  gap: 20px;
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

.username {
  font-weight: 500;
}

.post-time {
  color: var(--text-secondary);
  font-size: 14px;
}

.post-title {
  font-size: 18px;
  margin: 10px 0;
  cursor: pointer;
}

.post-title:hover {
  color: var(--love-primary);
}

.post-content {
  color: var(--text-secondary);
  margin-bottom: 15px;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}

.post-footer {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.post-stats {
  display: flex;
  gap: 15px;
}

.stat-item {
  display: flex;
  align-items: center;
  gap: 5px;
  color: var(--text-secondary);
}

.pagination {
  margin-top: 20px;
  display: flex;
  justify-content: center;
}

.dialog-footer {
  display: flex;
  justify-content: flex-end;
  gap: 10px;
}
</style>
