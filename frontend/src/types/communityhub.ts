export type PostDto = {
  id: number
  title: string
  content: string
  username: string
  mediaUrl?: string | null
  mediaType?: 'image' | 'video' | null
  createdAt: string
  upvotes?: number
  downvotes?: number
  communitySlug?: string | null
}

export type CommentDto = {
  id: number
  postId: number
  text: string
  username: string
  createdAt: string
}
