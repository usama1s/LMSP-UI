// useAuth.tsx
import { useEffect, useState } from 'react'
import { jwtDecode } from 'jwt-decode'
import api from './api'
import { User } from './Types/User'

interface AuthHook {
  user: User | null
  loading: boolean
  login: (credentials: { username: string; password: string; role: number }) => void
  logout: () => void
  customApiCall: <T>(method: string, endpoint: string, data?: any) => Promise<T>
  getProfileImage: <T>(filename: string) => Promise<void>
}

const useAuth = (): AuthHook => {
  const [user, setUser] = useState<User | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const checkAuth = async () => {
      const storedUser = localStorage.getItem('user')
      const storedToken = localStorage.getItem('token')

      if (storedUser && storedToken) {
        const decodedToken = jwtDecode(storedToken) as { exp: number }

        // Check if the token is expired
        if (decodedToken.exp * 1000 > Date.now()) {
          setUser(JSON.parse(storedUser))
        }
      }

      setLoading(false)
    }

    checkAuth()
  }, [])

  const login = async (credentials: { username: string; password: string; role: number }) => {
    try {
      const response = await api.post('/auth/login', credentials)
      // const { user } = response.data
      console.log('user', response)
      // localStorage.setItem('user', JSON.stringify(user))
      //   localStorage.setItem('token', token)
      // setUser(user)
    } catch (error) {
      console.error('Login failed:', error)
    }
  }

  const getProfileImage = async (filename: string) => {
    try {
      const lastIndex = filename.lastIndexOf('\\')
      const result = filename.substring(lastIndex + 1)
      console.log(result)
      const response = await api.get(`/general/uploads/${result}`)
      return response?.data
    } catch (error) {
      console.error('Failed to fetch image:', error)
    }
  }

  const logout = () => {
    localStorage.removeItem('user')
    localStorage.removeItem('token')
    setUser(null)
  }

  const customApiCall = async <T = any>(method: string, endpoint: string, data?: any): Promise<T> => {
    try {
      const storedToken = localStorage.getItem('token')
      //   if (!storedToken) {
      //     throw new Error('Token not found. User may not be logged in.')
      //   }

      //   const decodedToken = jwtDecode(storedToken) as { exp: number }

      //   if (decodedToken.exp * 1000 <= Date.now()) {
      //     logout()
      //     throw new Error('Token has expired. User has been logged out.')
      //   }

      const config: {
        headers: Record<string, string>
      } = {
        headers: {
          //   Authorization: `Bearer ${storedToken}`
        }
      }

      let requestData

      if (data instanceof FormData) {
        // If data is FormData, set Content-Type to 'multipart/form-data'
        config.headers['Content-Type'] = 'multipart/form-data'
        requestData = data
      } else {
        // If data is not FormData, stringify it as JSON and set Content-Type accordingly
        requestData = JSON.stringify(data)
        config.headers['Content-Type'] = 'application/json'
      }
      console.log(config)
      const response = await (api as any)[method](endpoint, requestData, config)

      return response.data as T
    } catch (error) {
      console.log('Endpoint', endpoint)
      console.error('API call failed:', error)
      throw error
    }
  }

  return { user, loading, login, logout, customApiCall, getProfileImage }
}

export default useAuth
