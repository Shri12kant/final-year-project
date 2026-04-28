import { http } from './http'

export interface UserProfile {
  username: string
  email: string
  profileImage?: string
  createdAt: string
}

export const userApi = {
  async getProfile(): Promise<UserProfile> {
    const response = await http.get('/users/profile')
    return response.data
  },

  async uploadProfileImage(file: File): Promise<{ profileImage: string }> {
    const formData = new FormData()
    formData.append('file', file)
    
    const response = await http.post('/users/profile/image', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    })
    return response.data
  },

  async removeProfileImage(): Promise<void> {
    await http.delete('/users/profile/image')
  }
}
