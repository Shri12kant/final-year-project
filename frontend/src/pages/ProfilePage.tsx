import { useParams } from 'react-router-dom'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { Link } from 'react-router-dom'
import { postsApi } from '../api/postsApi'
import { userApi } from '../api/userApi'
import { ProfilePictureUpload } from '../components/ProfilePictureUpload'
import { useState, useEffect } from 'react'
import { toast } from 'sonner'

export function ProfilePage() {
  const { username } = useParams()

  // Mock user data (will come from API later)
  const [user, setUser] = useState({
    username: username || 'user',
    bio: 'Passionate about technology and community building. Love to share knowledge and learn from others.',
    joinedDate: 'January 2024',
    karma: 1250,
    postCount: 42,
    commentCount: 156,
    profileImage: undefined as string | undefined // Will be loaded from API
  })

  const queryClient = useQueryClient()

  // Load user profile from API
  const { data: userProfile } = useQuery({
    queryKey: ['user-profile'],
    queryFn: () => userApi.getProfile(),
    enabled: true
  })

  // Update local state when API data changes
  useEffect(() => {
    if (userProfile) {
      setUser(prev => ({
        ...prev,
        username: userProfile.username,
        profileImage: userProfile.profileImage
      }))
    }
  }, [userProfile])

  // Mutation for uploading profile image
  const uploadProfileImageMutation = useMutation({
    mutationFn: userApi.uploadProfileImage,
    onSuccess: (data) => {
      setUser(prev => ({
        ...prev,
        profileImage: data.profileImage
      }))
      queryClient.invalidateQueries({ queryKey: ['user-profile'] })
      toast.success('Profile picture updated successfully!')
    },
    onError: (error) => {
      console.error('Failed to upload profile image:', error)
      toast.error('Failed to update profile picture')
    }
  })

  const handleProfilePictureChange = (file: File) => {
    console.log('Profile picture selected:', file.name)
    if (file) {
      updateProfileImage(file)
    }
  }

  const updateProfileImage = (file: File) => {
    uploadProfileImageMutation.mutate(file)
  }

  const { data: userPosts = [], isLoading } = useQuery({
    queryKey: ['user-posts', username],
    queryFn: () => postsApi.fetchPosts(),
    enabled: !!username
  })

  useEffect(() => {
    console.log('Current user.profileImage in ProfilePage:', user.profileImage)
  }, [user.profileImage])

  return (
    <div className="space-y-6">
      <div
        className="rounded-xl border p-6"
        style={{ borderColor: 'var(--border)', background: 'var(--surface)' }}
      >
        <div className="flex items-start gap-4">
          <ProfilePictureUpload
            currentImage={user.profileImage}
            onImageChange={handleProfilePictureChange}
          />
          <div className="flex-1">
            <h1 className="text-2xl font-semibold tracking-tight">
              @{user.username}
            </h1>
            <p className="mt-2 text-sm" style={{ color: 'var(--text-secondary)' }}>
              {user.bio}
            </p>
            <p className="mt-1 text-xs" style={{ color: 'var(--text-muted)' }}>
              Joined {user.joinedDate}
            </p>
          </div>
        </div>

        <div className="mt-6 grid grid-cols-3 gap-4">
          <div className="text-center">
            <div className="text-2xl font-bold" style={{ color: 'var(--text-primary)' }}>
              {user.karma}
            </div>
            <div className="text-xs" style={{ color: 'var(--text-muted)' }}>
              Karma
            </div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold" style={{ color: 'var(--text-primary)' }}>
              {user.postCount}
            </div>
            <div className="text-xs" style={{ color: 'var(--text-muted)' }}>
              Posts
            </div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold" style={{ color: 'var(--text-primary)' }}>
              {user.commentCount}
            </div>
            <div className="text-xs" style={{ color: 'var(--text-muted)' }}>
              Comments
            </div>
          </div>
        </div>
      </div>

      <div
        className="rounded-xl border p-6"
        style={{ borderColor: 'var(--border)', background: 'var(--surface)' }}
      >
        <h2 className="text-lg font-semibold mb-4" style={{ color: 'var(--text-primary)' }}>
          Recent Posts
        </h2>
        {isLoading ? (
          <p className="text-sm" style={{ color: 'var(--text-muted)' }}>
            Loading posts...
          </p>
        ) : userPosts.length > 0 ? (
          <div className="space-y-3">
            {userPosts.slice(0, 5).map((post) => (
              <div key={post.id} className="border-b pb-3" style={{ borderColor: 'var(--border)' }}>
                <Link
                  to={`/post/${post.id}`}
                  className="block hover:opacity-80 transition-opacity"
                  style={{ color: 'var(--text-primary)' }}
                >
                  <h3 className="font-medium">{post.title}</h3>
                  <p className="mt-1 text-sm" style={{ color: 'var(--text-muted)' }}>
                    {post.content?.substring(0, 100)}...
                  </p>
                </Link>
              </div>
            ))}
          </div>
        ) : (
          <p className="text-sm" style={{ color: 'var(--text-muted)' }}>
            No posts yet.
          </p>
        )}
      </div>

      <div className="flex gap-3">
        <button
          className="px-4 py-2 rounded-lg border text-sm font-medium transition-all hover:scale-105"
          style={{
            borderColor: 'var(--border)',
            background: 'var(--surface)',
            color: 'var(--text-primary)'
          }}
        >
          Edit Profile
        </button>
        <button
          className="px-4 py-2 rounded-lg text-sm font-medium transition-all hover:scale-105"
          style={{
            background: 'var(--accent)',
            color: 'white'
          }}
        >
          Message
        </button>
      </div>
    </div>
  )
}