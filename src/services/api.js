import axios from 'axios'

const API_BASE_URL = 'http://127.0.0.1:8000'

export const registerUser = async (userData) => {
  try {
    const { data } = await axios.post(`${API_BASE_URL}/users/register`, userData)
    return { data, error: null }
  } catch (error) {
    return {
      data: null,
      error: error.response?.data?.detail || 'Registration failed',
    }
  }
}
