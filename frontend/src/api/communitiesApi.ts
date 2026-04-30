import { http } from './http'

export interface Community {
  id: number
  slug: string
  name: string
  description: string
  rules?: string
  memberCount: number
  accent?: string
  createdBy: string
  createdAt: string
}

export interface CreateCommunityInput {
  name: string
  description: string
  rules?: string
  accent?: string
}

export const communitiesApi = {
  async fetchAll(): Promise<Community[]> {
    const response = await http.get('/api/communities')
    return response.data
  },

  async getBySlug(slug: string): Promise<Community> {
    const response = await http.get(`/api/communities/${slug}`)
    return response.data
  },

  async create(input: CreateCommunityInput): Promise<Community> {
    const response = await http.post('/api/communities', input)
    return response.data
  },

  async update(id: number, input: CreateCommunityInput): Promise<Community> {
    const response = await http.put(`/api/communities/${id}`, input)
    return response.data
  },

  async delete(id: number): Promise<void> {
    await http.delete(`/api/communities/${id}`)
  },
}
