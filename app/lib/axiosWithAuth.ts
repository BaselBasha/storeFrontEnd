// utils/axiosWithAuth.ts
import axios from 'axios'

const axiosWithAuth = axios.create({
  baseURL: 'http://localhost:4000',
})

axiosWithAuth.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('accessToken')
    if (token) {
      config.headers.Authorization = `Bearer ${token}`
    }
    return config
  },
  (error) => Promise.reject(error)
)

export default axiosWithAuth
