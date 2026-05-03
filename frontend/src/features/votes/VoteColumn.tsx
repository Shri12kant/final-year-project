import { useState, useEffect } from 'react'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { postsApi } from '../../api/postsApi'

type Props = {
  postId: number
  className?: string
  voteScore?: number
}

export function VoteColumn({ postId, className, voteScore }: Props) {
  const queryClient = useQueryClient()
  const [displayScore, setDisplayScore] = useState(voteScore || 0)
  
  const { data: userVote, refetch: refetchUserVote } = useQuery({
    queryKey: ['userVote', postId],
    queryFn: () => postsApi.getUserVote(postId),
    enabled: !!postId,
  })

  const voteMutation = useMutation({
    mutationFn: (voteType: number) => postsApi.voteOnPost(postId, voteType),
    onSuccess: async (data) => {
      console.log('DEBUG Vote: Success response:', data)
      
      // Update display score based on vote response
      setDisplayScore(prev => {
        const currentUserVote = userVote?.voteType || 0
        const newVoteType = data.voteType
        
        if (newVoteType === 0) {
          // Vote was removed
          return currentUserVote === 1 ? prev - 1 : prev + 1
        } else if (currentUserVote === 0) {
          // New vote
          return newVoteType === 1 ? prev + 1 : prev - 1
        } else if (currentUserVote !== newVoteType) {
          // Changed vote (up->down or down->up)
          return newVoteType === 1 ? prev + 2 : prev - 2
        }
        return prev
      })
      
      // Invalidate and refetch queries to sync with server
      await queryClient.invalidateQueries({ queryKey: ['userVote', postId] })
      await queryClient.invalidateQueries({ queryKey: ['posts'] })
      await refetchUserVote()
    },
    onError: (error) => {
      console.error('DEBUG Vote: Error:', error)
    }
  })

  useEffect(() => {
    if (voteScore !== undefined) {
      setDisplayScore(voteScore)
    }
  }, [voteScore])

  const handleVote = (voteType: number) => {
    voteMutation.mutate(voteType)
  }

  return (
    <div
      className={`flex w-10 shrink-0 flex-col items-center gap-0.5 bg-[var(--surface-muted)] py-2 text-xs font-semibold text-[var(--text-muted)] ${className ?? ''}`}
    >
      <button
        type="button"
        onClick={() => handleVote(1)}
        className={`rounded px-1 py-0.5 hover:bg-[var(--surface)] ${
          userVote?.voteType === 1 ? 'text-[var(--accent)]' : ''
        }`}
        aria-label="Upvote"
      >
        &#9650;
      </button>
      <span className="text-[var(--text)] tabular-nums">{displayScore}</span>
      <button
        type="button"
        onClick={() => handleVote(-1)}
        className={`rounded px-1 py-0.5 hover:bg-[var(--surface)] ${
          userVote?.voteType === -1 ? 'text-rose-500' : ''
        }`}
        aria-label="Downvote"
      >
        &#9660;
      </button>
    </div>
  )
}
