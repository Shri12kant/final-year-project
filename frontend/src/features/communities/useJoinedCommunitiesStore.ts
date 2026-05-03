import { create } from 'zustand'
import { communitiesApi, type Community } from '../../api/communitiesApi'

type State = {
  joined: Community[]
  joinedSlugs: string[]
  isLoading: boolean
  error: string | null
  fetchJoined: () => Promise<void>
  join: (community: Community) => Promise<void>
  leave: (community: Community) => Promise<void>
  isJoined: (slug: string) => boolean
  clearJoined: () => void
}

export const useJoinedCommunitiesStore = create<State>()((set, get) => ({
  joined: [],
  joinedSlugs: [],
  isLoading: false,
  error: null,

  fetchJoined: async () => {
    console.log('DEBUG Store: Fetching joined communities from backend')
    set({ isLoading: true, error: null })
    try {
      const communities = await communitiesApi.getUserCommunities()
      console.log('DEBUG Store: Fetched', communities.length, 'communities')
      
      // Deduplicate by id
      const uniqueCommunities = Array.from(
        new Map(communities.map(c => [c.id, c])).values()
      )
      console.log('DEBUG Store: After dedupe:', uniqueCommunities.length, 'communities')
      
      set({ 
        joined: uniqueCommunities,
        joinedSlugs: uniqueCommunities.map(c => c.slug),
        isLoading: false 
      })
    } catch (error: any) {
      console.error('DEBUG Store: Error fetching joined communities:', error)
      set({ error: error.message || 'Failed to fetch joined communities', isLoading: false })
    }
  },

  join: async (community) => {
    console.log('DEBUG Store: Joining community', community.id, community.slug)
    try {
      await communitiesApi.join(community.id)
      console.log('DEBUG Store: Successfully joined, refetching...')
      
      // Refetch from backend to ensure consistency
      await get().fetchJoined()
    } catch (error: any) {
      console.error('DEBUG Store: Error joining community:', error)
      set({ error: error.response?.data?.error || 'Failed to join community' })
      throw error
    }
  },

  leave: async (community) => {
    console.log('DEBUG Store: Leaving community', community.id, community.slug)
    try {
      await communitiesApi.leave(community.id)
      console.log('DEBUG Store: Successfully left, refetching...')
      
      // Refetch from backend to ensure consistency
      await get().fetchJoined()
    } catch (error: any) {
      console.error('DEBUG Store: Error leaving community:', error)
      set({ error: error.response?.data?.error || 'Failed to leave community' })
      throw error
    }
  },

  isJoined: (slug) => {
    return get().joinedSlugs.includes(slug)
  },

  clearJoined: () => {
    set({ joined: [], joinedSlugs: [], error: null })
  }
}))
