import { create } from 'zustand'
import { persist } from 'zustand/middleware'

type State = {
  joined: string[]
  join: (slug: string) => void
  leave: (slug: string) => void
  isJoined: (slug: string) => boolean
}

export const useJoinedCommunitiesStore = create<State>()(
  persist(
    (set, get) => ({
      joined: [],
      join: (slug) =>
        set((s) => ({
          joined: s.joined.includes(slug) ? s.joined : [...s.joined, slug],
        })),
      leave: (slug) =>
        set((s) => ({
          joined: s.joined.filter((x) => x !== slug),
        })),
      isJoined: (slug) => get().joined.includes(slug),
    }),
    { name: 'ch_joined_communities' },
  ),
)
