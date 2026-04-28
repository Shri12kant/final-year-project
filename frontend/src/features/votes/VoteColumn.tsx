import { useState, useEffect } from 'react'
import { useMutation, useQuery } from '@tanstack/react-query'
import { postsApi } from '../../api/postsApi'

type Props = {
  postId: number
  className?: string
  voteScore?: number
}

export function VoteColumn({ postId, className, voteScore }: Props) {
  const [displayScore, setDisplayScore] = useState(voteScore || 0)
  
  const { data: userVote } = useQuery({
    queryKey: ['userVote', postId],
    queryFn: () => postsApi.getUserVote(postId),
  })

  const voteMutation = useMutation({
    mutationFn: (voteType: number) => postsApi.voteOnPost(postId, voteType),
    onSuccess: (data) => {
      setDisplayScore(prev => {
        if (data.voteType === 0) {
          // Vote was removed
          return userVote?.voteType === 1 ? prev - 1 : prev + 1
        } else if (userVote?.voteType === 0) {
          // New vote
          return data.voteType === 1 ? prev + 1 : prev - 1
        } else {
          // Changed vote
          return data.voteType === 1 ? prev + 2 : prev - 2
        }
      })
    },
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
