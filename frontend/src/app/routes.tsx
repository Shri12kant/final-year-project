import { Navigate, Route, Routes } from 'react-router-dom'
import { ProtectedRoute } from '../components/ProtectedRoute'
import { AppShell } from './shell/AppShell'
import { AboutPage } from '../pages/AboutPage'
import { CommunityDetailPage } from '../pages/CommunityDetailPage'
import { CommunitiesPage } from '../pages/CommunitiesPage'
import { HomePage } from '../pages/HomePage'
import { LoginPage } from '../pages/LoginPage'
import { ModerationPage } from '../pages/ModerationPage'
import { NotFoundPage } from '../pages/NotFoundPage'
import { PostPage } from '../pages/PostPage'
import { ProfilePage } from '../pages/ProfilePage'
import { RegisterPage } from '../pages/RegisterPage'
import { SettingsPage } from '../pages/SettingsPage'
import { SubmitPostPage } from '../pages/SubmitPostPage'
import { CreateCommunityPage } from '../pages/CreateCommunityPage'

export function AppRoutes() {
  return (
    <Routes>
      {/* `path="/"` required so `/` matches reliably; pathless layout can render nothing on some RR versions */}
      <Route path="/" element={<AppShell />}>
        <Route index element={<HomePage />} />
        <Route path="about" element={<AboutPage />} />
        <Route path="search" element={<HomePage />} />
        <Route path="communities" element={<CommunitiesPage />} />
        <Route path="c/:slug" element={<CommunityDetailPage />} />
        <Route path="r/:slug" element={<CommunityDetailPage />} />
        <Route path="post/:id" element={<PostPage />} />
        <Route path="u/:username" element={<ProfilePage />} />
        <Route path="moderation" element={<ModerationPage />} />

        <Route
          path="submit"
          element={
            <ProtectedRoute>
              <SubmitPostPage />
            </ProtectedRoute>
          }
        />

        <Route
          path="settings"
          element={
            <ProtectedRoute>
              <SettingsPage />
            </ProtectedRoute>
          }
        />

        <Route
          path="create-community"
          element={
            <ProtectedRoute>
              <CreateCommunityPage />
            </ProtectedRoute>
          }
        />
      </Route>

      <Route path="login" element={<LoginPage />} />
      <Route path="register" element={<RegisterPage />} />
      <Route path="logout" element={<Navigate to="/" replace />} />

      <Route path="*" element={<NotFoundPage />} />
    </Routes>
  )
}

