import axios from 'axios'

// baseURL 用 /api，走 vite.config.js 里已配好的反向代理
const request = axios.create({
  baseURL: import.meta.env.VITE_API_BASE || '/api',
  timeout: 10_000,
  headers: {
    'Content-Type': 'application/json',
  },
})

// ---------- 请求拦截器：统一添加自定义请求头 ----------
request.interceptors.request.use(
  (config) => {
    //加上api key 接口鉴权
    config.headers['X-QW-Api-Key'] = '8e4932ba063e4d528267a01680aa74d8'

    // 3. 调用时单独传入的 headers 优先级最高，axios 会自动合并
    return config
  },
  (error) => Promise.reject(error),
)

// ---------- 响应拦截器：统一拆包 + 报错 ----------
request.interceptors.response.use(
  (response) => {
    return response?.data;
  },
  (error) => {
    const message = error.response?.data?.message || error.message || '请求失败'


    return Promise.reject(new Error(message))
  },
)

export default request
