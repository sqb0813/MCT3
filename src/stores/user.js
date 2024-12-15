import { defineStore } from 'pinia'
import { ref } from 'vue'
import axios from 'axios'

export const useUserStore = defineStore('user', () => {
  const token = ref(localStorage.getItem('token') || '')
  const userInfo = ref(null)

  // 登录
  const login = async (loginForm) => {
    try {
      const res = await axios.post('/api/auth/login', loginForm)
      token.value = res.data.token
      localStorage.setItem('token', res.data.token)
      await getUserInfo()
    } catch (error) {
      throw error
    }
  }

  // 获取用户信息
  const getUserInfo = async () => {
    try {
      const res = await axios.get('/api/user/info')
      userInfo.value = res.data
    } catch (error) {
      throw error
    }
  }

  // 登出
  const logout = () => {
    token.value = ''
    userInfo.value = null
    localStorage.removeItem('token')
  }

  return {
    token,
    userInfo,
    login,
    getUserInfo,
    logout
  }
}) 