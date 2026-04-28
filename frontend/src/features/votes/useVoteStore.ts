import { create } from 'zustand'
import { persist } from 'zustand/middleware'

/** Local demo votes (until backend voting API exists). */
export type PostVoteState = {
  up: number
  down: number
  /** -1 | 0 | 1 */
  my: -1 | 0 | 1
}

function seedBase(postId: number): { up: number; down: number } {
  const up = 3 + (postId * 17) % 42
  const down = (postId * 11) % 8
  return { up, down }
}

type VoteMap = Record<number, PostVoteState>

type State = {
  votes: VoteMap
  vote: (postId: number, dir: 'up' | 'down') => void
}

/** Use with `votes[postId]` from the store — do not use a selector that returns a fresh object each call (React 19 / useSyncExternalStore). */
export function getVoteDisplay(
  postId: number,
  stored: PostVoteState | undefined,
): PostVoteState {
  if (stored) return stored
  const seed = seedBase(postId)
  return { up: seed.up, down: seed.down, my: 0 }
}

export const useVoteStore = create<State>()(
  persist(
    (set) => ({
      votes: {},
      vote: (postId, dir) => {
        set((s) => {
          const cur = s.votes[postId] ?? {
            ...seedBase(postId),
            my: 0 as const,
          }
          let { up, down, my } = cur

          if (dir === 'up') {
            if (my === 1) {
              my = 0
              up -= 1
            } else if (my === -1) {
              my = 1
              up += 1
              down -= 1
            } else {
              my = 1
              up += 1
            }
          } else {
            if (my === -1) {
              my = 0
              down -= 1
            } else if (my === 1) {
              my = -1
              up -= 1
              down += 1
            } else {
              my = -1
              down += 1
            }
          }

          return {
            votes: {
              ...s.votes,
              [postId]: { up: Math.max(0, up), down: Math.max(0, down), my },
            },
          }
        })
      },
    }),
    { name: 'ch_post_votes_v1' },
  ),
)

export function scoreFromVote(v: PostVoteState): number {
  return v.up - v.down
}
