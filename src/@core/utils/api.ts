// Api.ts
import axios, { AxiosInstance } from 'axios'

const api: AxiosInstance = axios.create({
  // baseURL: 'http://192.168.137.1:5000/api/'
  baseURL: 'http://localhost:5000/api/'
})

export default api
