import { http } from './http'
import type { NotificationDto, NotificationCountResponse } from '../types/notifications'

export const notificationsApi = {
  async getAllNotifications(): Promise<NotificationDto[]> {
    const response = await http.get('/api/notifications');
    return response.data;
  },

  async getUnreadNotifications(): Promise<NotificationDto[]> {
    const response = await http.get('/api/notifications/unread');
    return response.data;
  },

  async getUnreadCount(): Promise<NotificationCountResponse> {
    const response = await http.get('/api/notifications/count');
    return response.data;
  },

  async markAsRead(notificationId: number): Promise<void> {
    await http.put(`/api/notifications/${notificationId}/read`);
  },

  async markAllAsRead(): Promise<void> {
    await http.put('/api/notifications/read-all');
  },

  async cleanupReadNotifications(): Promise<void> {
    await http.delete('/api/notifications/cleanup');
  }
};
