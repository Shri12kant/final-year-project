import axios from 'axios'

const API_BASE = import.meta.env.VITE_API_BASE_URL ?? 'http://localhost:8084'

export interface UploadResponse {
  success: boolean
  url?: string
  publicId?: string
  error?: string
  message?: string
}

export async function uploadImage(file: File): Promise<UploadResponse> {
  const formData = new FormData()
  formData.append('file', file)

  try {
    const response = await axios.post<UploadResponse>(
      `${API_BASE}/api/images/upload`,
      formData
      // Don't set Content-Type - axios sets it automatically with boundary
    )
    return response.data
  } catch (error) {
    if (axios.isAxiosError(error)) {
      return {
        success: false,
        error: error.response?.data?.error || 'Upload failed',
      }
    }
    return {
      success: false,
      error: 'Network error',
    }
  }
}

export async function deleteImage(publicId: string): Promise<UploadResponse> {
  try {
    const response = await axios.delete<UploadResponse>(
      `${API_BASE}/api/images/delete/${publicId}`
    )
    return response.data
  } catch (error) {
    if (axios.isAxiosError(error)) {
      return {
        success: false,
        error: error.response?.data?.error || 'Delete failed',
      }
    }
    return {
      success: false,
      error: 'Network error',
    }
  }
}
