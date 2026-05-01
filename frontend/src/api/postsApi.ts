import { http } from './http'
import type { CommentDto, PostDto } from '../types/communityhub'

/** Alias for list response — matches UI naming */
export type Post = PostDto

export async function fetchPosts(sort?: string): Promise<PostDto[]> {
  return postsApi.fetchPosts(sort)
}

export const postsApi = {
  async fetchPosts(sort?: string): Promise<PostDto[]> {
    const params = new URLSearchParams();
    if (sort) params.append('sortBy', sort);
    
    const response = await http.get(`/api/posts?${params}`);
    return response.data;
  },

  async getVoteCount(postId: number): Promise<number> {
    const response = await http.get(`/api/posts/${postId}/vote-count`);
    return response.data;
  },

  async fetchSortedPosts(sort: string = 'top'): Promise<PostDto[]> {
    const response = await http.get(`/api/posts/sorted?sortBy=${sort}`);
    return response.data;
  },

  getPost: async (id: number) => {
    const res = await http.get<PostDto>(`/api/posts/${id}`)
    return res.data
  },

  createPost: async (input: { title: string; content: string; username?: string; communitySlug?: string; imageUrl?: string }) => {
    const res = await http.post<PostDto>('/api/posts', input)
    return res.data
  },

  deletePost: async (id: number) => {
    await http.delete(`/api/posts/${id}`)
  },

  listComments: async (postId: number) => {
    const res = await http.get<CommentDto[]>(`/api/posts/${postId}/comments`)
    return res.data
  },

  addComment: async (postId: number, input: { text: string; username?: string }) => {
    const res = await http.post<CommentDto>(`/api/posts/${postId}/comments`, input)
    return res.data
  },

  voteOnPost: async (postId: number, voteType: number) => {
    const res = await http.post(`/api/posts/${postId}/vote`, { voteType })
    return res.data
  },

  getUserVote: async (postId: number) => {
    const res = await http.get(`/api/posts/${postId}/vote`)
    return res.data
  },
}
