import { useState, useEffect } from 'react'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { notificationsApi } from '../../api/notificationsApi'
import type { NotificationDto, NotificationCountResponse } from '../../types/notifications'

export function NotificationBell() {
  const [isOpen, setIsOpen] = useState(false)
  const queryClient = useQueryClient()

  const { data: countData, error: countError } = useQuery<NotificationCountResponse>({
    queryKey: ['notifications', 'count'],
    queryFn: () => notificationsApi.getUnreadCount(),
    refetchInterval: 5000, // Auto refresh every 5 seconds
    retry: 2, // Retry twice on failure
    staleTime: 3000, // Consider data fresh for 3 seconds
    initialData: { count: 0 }, // Default value to prevent undefined
  })

  const { data: notifications = [], error: notificationsError } = useQuery<NotificationDto[]>({
    queryKey: ['notifications', 'unread'],
    queryFn: () => notificationsApi.getUnreadNotifications(),
    enabled: isOpen,
    retry: 1,
    staleTime: 30000,
  })

  const markAsReadMutation = useMutation({
    mutationFn: (notificationId: number) => notificationsApi.markAsRead(notificationId),
    onMutate: async () => {
      // Cancel outgoing refetches
      await queryClient.cancelQueries({ queryKey: ['notifications'] })
      
      // Snapshot previous value
      const previousCount = queryClient.getQueryData(['notifications', 'count'])
      const previousUnread = queryClient.getQueryData(['notifications', 'unread'])
      
      // Optimistically update count
      queryClient.setQueryData(['notifications', 'count'], (old: any) => {
        if (!old) return { count: 0 }
        return { count: Math.max(0, old.count - 1) }
      })
      
      // Optimistically update unread list
      queryClient.setQueryData(['notifications', 'unread'], (old: any) => {
        if (!old) return []
        return old.filter((n: any) => n.id !== undefined)
      })
      
      return { previousCount, previousUnread }
    },
    onError: (_error, _variables, context) => {
      // Restore on error
      if (context?.previousCount) {
        queryClient.setQueryData(['notifications', 'count'], context.previousCount)
      }
      if (context?.previousUnread) {
        queryClient.setQueryData(['notifications', 'unread'], context.previousUnread)
      }
    },
    onSettled: () => {
      // Refetch to ensure consistency
      queryClient.invalidateQueries({ queryKey: ['notifications'] })
    },
  })

  const markAllAsReadMutation = useMutation({
    mutationFn: () => notificationsApi.markAllAsRead(),
    onMutate: async () => {
      // Cancel outgoing refetches
      await queryClient.cancelQueries({ queryKey: ['notifications'] })
      
      // Snapshot previous value
      const previousCount = queryClient.getQueryData(['notifications', 'count'])
      const previousUnread = queryClient.getQueryData(['notifications', 'unread'])
      
      // Optimistically update count to 0
      queryClient.setQueryData(['notifications', 'count'], { count: 0 })
      queryClient.setQueryData(['notifications', 'unread'], [])
      
      return { previousCount, previousUnread }
    },
    onError: (_error, _variables, context) => {
      // Restore on error
      if (context?.previousCount) {
        queryClient.setQueryData(['notifications', 'count'], context.previousCount)
      }
      if (context?.previousUnread) {
        queryClient.setQueryData(['notifications', 'unread'], context.previousUnread)
      }
    },
    onSuccess: () => {
      setIsOpen(false)
    },
    onSettled: () => {
      // Refetch to ensure consistency
      queryClient.invalidateQueries({ queryKey: ['notifications'] })
    },
  })

  // Function to manually refresh notifications
  const refreshNotifications = () => {
    queryClient.invalidateQueries({ queryKey: ['notifications'] })
  }

  // Make refreshNotifications available globally
  useEffect(() => {
    // Store refresh function in window for global access
    (window as any).refreshNotifications = refreshNotifications
    return () => {
      delete (window as any).refreshNotifications
    }
  }, [])

  const unreadCount = countData?.count || 0

  // Show error state if there are issues
  const hasError = countError || notificationsError

  const handleNotificationClick = (notification: NotificationDto) => {
    if (!notification.isRead) {
      markAsReadMutation.mutate(notification.id)
    }
    // TODO: Navigate to related post if needed
  }

  const handleMarkAllAsRead = () => {
    markAllAsReadMutation.mutate()
  }

  return (
    <div className="relative">
      {/* Notification Bell */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="relative p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors border border-gray-300 dark:border-gray-600"
        title="Notifications"
      >
        <svg
          className="w-6 h-6 text-gray-700 dark:text-gray-200"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9"
          />
        </svg>
        
        {/* Fallback text for debugging */}
        <span className="sr-only">Notifications</span>
        
        {/* Notification Badge */}
        {unreadCount > 0 && (
          <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full w-6 h-6 flex items-center justify-center font-bold border-2 border-white dark:border-gray-800 shadow-lg">
            {unreadCount > 99 ? '99+' : unreadCount}
          </span>
        )}
      </button>

      {/* Notification Dropdown */}
      {isOpen && (
        <div className="absolute right-0 mt-2 w-80 bg-white dark:bg-gray-800 rounded-lg shadow-lg border border-gray-200 dark:border-gray-700 z-50">
          <div className="p-4 border-b border-gray-200 dark:border-gray-700">
            <div className="flex items-center justify-between">
              <h3 className="font-semibold text-gray-900 dark:text-white">Notifications</h3>
              {unreadCount > 0 && (
                <button
                  onClick={handleMarkAllAsRead}
                  className="text-sm text-blue-600 hover:text-blue-700 dark:text-blue-400 dark:hover:text-blue-300"
                >
                  Mark all as read
                </button>
              )}
            </div>
          </div>

          <div className="max-h-96 overflow-y-auto">
            {hasError ? (
              <div className="p-4 text-center text-red-500 dark:text-red-400">
                Unable to load notifications
              </div>
            ) : notifications.length === 0 ? (
              <div className="p-4 text-center text-gray-500 dark:text-gray-400">
                No new notifications
              </div>
            ) : (
              notifications.map((notification) => (
                <div
                  key={notification.id}
                  onClick={() => handleNotificationClick(notification)}
                  className={`p-4 border-b border-gray-100 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700 cursor-pointer transition-colors ${
                    !notification.isRead ? 'bg-blue-50 dark:bg-blue-900/20' : ''
                  }`}
                >
                  <div className="flex items-start space-x-3">
                    <div className="flex-shrink-0">
                      {notification.type === 'VOTE' && (
                        <svg className="w-5 h-5 text-green-500" fill="currentColor" viewBox="0 0 20 20">
                          <path d="M2 10.5a1.5 1.5 0 113 0v6a1.5 1.5 0 01-3 0v-6zM6 10.333v5.43a2 2 0 001.106 1.79l.05.025A4 4 0 008.943 18h5.416a2 2 0 001.962-1.608l1.2-6A2 2 0 0015.56 8H12V4a2 2 0 00-2-2 1 1 0 00-1 1v.667a4 4 0 01-.8 2.4L6.8 7.933a4 4 0 00-.8 2.4z" />
                        </svg>
                      )}
                      {notification.type === 'COMMENT' && (
                        <svg className="w-5 h-5 text-blue-500" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M18 10c0 3.866-3.582 7-8 7a8.841 8.841 0 01-4.083-.98L2 17l1.338-3.123C2.493 12.767 2 11.434 2 10c0-3.866 3.582-7 8-7s8 3.134 8 7zM7 9H5v2h2V9zm8 0h-2v2h2V9zM9 9h2v2H9V9z" clipRule="evenodd" />
                        </svg>
                      )}
                      {notification.type === 'MENTION' && (
                        <svg className="w-5 h-5 text-purple-500" fill="currentColor" viewBox="0 0 20 20">
                          <path d="M8 9a3 3 0 100-6 3 3 0 000 6zM8 11a6 6 0 016 6H2a6 6 0 016-6zM16 7a1 1 0 10-2 0v1h-1a1 1 0 100 2h1v1a1 1 0 102 0v-1h1a1 1 0 100-2h-1V7z" />
                        </svg>
                      )}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm text-gray-900 dark:text-white">
                        {notification.message}
                      </p>
                      <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                        {new Date(notification.createdAt).toLocaleDateString()}
                      </p>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      )}
    </div>
  )
}
