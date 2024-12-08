import { defineStore } from 'pinia'
import { ref } from 'vue'

export const useCompressStore = defineStore('compress', () => {
  // 状态
  const history = ref([])
  
  // 添加压缩记录
  const addHistory = (record) => {
    history.value.unshift({
      id: Date.now(),
      ...record,
      date: new Date().toLocaleString()
    })
  }
  
  // 清空历史记录
  const clearHistory = () => {
    history.value = []
  }
  
  return {
    history,
    addHistory,
    clearHistory
  }
}) 