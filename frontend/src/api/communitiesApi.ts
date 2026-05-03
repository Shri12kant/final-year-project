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

  async join(id: number): Promise<void> {
    console.log('DEBUG Frontend: Joining community', id)
    const response = await http.post(`/api/communities/${id}/join`)
    console.log('DEBUG Frontend: Join response', response.data)
    return response.data
  },

  async leave(id: number): Promise<void> {
    console.log('DEBUG Frontend: Leaving community', id)
    const response = await http.post(`/api/communities/${id}/leave`)
    console.log('DEBUG Frontend: Leave response', response.data)
    return response.data
  },

  async getUserCommunities(): Promise<Community[]> {
    console.log('DEBUG Frontend: Fetching user communities')
    const response = await http.get('/api/users/me/communities')
    console.log('DEBUG Frontend: User communities response', response.data)
    return response.data
  },

  async isMember(id: number): Promise<boolean> {
    const response = await http.get(`/api/communities/${id}/is-member`)
    return response.data.isMember
  },
}
