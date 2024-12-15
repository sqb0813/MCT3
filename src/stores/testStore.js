import { defineStore } from "pinia";
import { ref } from "vue";
import { ElMessage } from "element-plus";

export const useTestStore = defineStore("test", () => {
  // 状态
  const testHistory = ref([]);
  const currentTest = ref(null);

  // 获取测试历史
  const getTestHistory = async () => {
    try {
      // TODO: 调用获取历史API
      const response = {
        list: [
          {
            id: "test_1",
            date: "2024-01-15",
            score: 85,
            status: "已完成",
          },
          {
            id: "test_2",
            date: "2024-01-10",
            score: 92,
            status: "已完成",
          },
        ],
      };
      testHistory.value = response.list;
    } catch (error) {
      ElMessage.error(error.message || "获取历史记录失败");
    }
  };

  // 获取测试详情
  const getTestDetail = async (id) => {
    try {
      // TODO: 调用获取详情API
      const response = {
        id,
        score: 85,
        person1: {
          name: "张三",
          gender: "male",
          age: 25,
          personality: ["outgoing", "rational"],
          hobbies: ["sports", "music"],
          values: "modern",
        },
        person2: {
          name: "李四",
          gender: "female",
          age: 23,
          personality: ["introvert", "emotional"],
          hobbies: ["reading", "music"],
          values: "neutral",
        },
        analysis: {
          personality: "性格特征互补...",
          hobbies: "音乐爱好相同...",
          values: "价值观较为接近...",
        },
        suggestions: [
          {
            title: "加强沟通",
            content: "建议定期交流...",
            type: "primary",
          },
        ],
        createTime: "2024-01-15 10:00:00",
      };
      currentTest.value = response;
      return response;
    } catch (error) {
      ElMessage.error(error.message || "获取测试详情失败");
      throw error;
    }
  };

  // 提交测试
  const submitTest = async (formData) => {
    try {
      // TODO: 调用提交测试API
      const response = {
        id: "test_" + Date.now(),
        score: 85,
      };
      return response;
    } catch (error) {
      ElMessage.error(error.message || "提交测试失败");
      throw error;
    }
  };

  // 删除测试记录
  const deleteTest = async (id) => {
    try {
      // TODO: 调用删除API
      testHistory.value = testHistory.value.filter((item) => item.id !== id);
      ElMessage.success("删除成功");
    } catch (error) {
      ElMessage.error(error.message || "删除失败");
      throw error;
    }
  };

  return {
    testHistory,
    currentTest,
    getTestHistory,
    getTestDetail,
    submitTest,
    deleteTest,
  };
}); 