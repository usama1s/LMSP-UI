// Api.ts
import axios, { AxiosInstance } from 'axios'

const api: AxiosInstance = axios.create({
  // baseURL: 'http://192.168.1.10:5000/api/'
  baseURL: 'http://localhost:4000/api/'
})

export default api
