export interface NotificationDto {
  id: number;
  username: string;
  type: 'VOTE' | 'COMMENT' | 'MENTION';
  message: string;
  relatedPostId?: number;
  relatedUsername?: string;
  createdAt: string;
  isRead: boolean;
}

export interface NotificationCountResponse {
  count: number;
}
