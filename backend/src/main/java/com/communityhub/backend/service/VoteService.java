package com.communityhub.backend.service;

import com.communityhub.backend.exception.ResourceNotFoundException;
import com.communityhub.backend.model.Post;
import com.communityhub.backend.model.Vote;
import com.communityhub.backend.repository.PostRepository;
import com.communityhub.backend.repository.VoteRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.Optional;

@Service
@RequiredArgsConstructor
public class VoteService {

    private final VoteRepository voteRepository;
    private final PostRepository postRepository;
    private final NotificationService notificationService;

    @Transactional
    public Vote voteOnPost(Long postId, String username, Integer voteType) {
        // Validate voteType
        if (voteType != 1 && voteType != -1) {
            throw new IllegalArgumentException("Vote type must be 1 (upvote) or -1 (downvote)");
        }

        // Check if post exists
        Post post = postRepository.findById(postId)
                .orElseThrow(() -> new ResourceNotFoundException("Post not found with id: " + postId));

        // Check if user has already voted
        Optional<Vote> existingVote = voteRepository.findByPostIdAndUsername(postId, username);

        if (existingVote.isPresent()) {
            Vote vote = existingVote.get();
            
            if (vote.getVoteType().equals(voteType)) {
                // User is voting the same way - remove the vote
                voteRepository.delete(vote);
                updatePostVoteCounts(postId);
                return null; // Indicates vote was removed
            } else {
                // User is changing their vote
                vote.setVoteType(voteType);
                Vote savedVote = voteRepository.save(vote);
                updatePostVoteCounts(postId);
                return savedVote;
            }
        } else {
            // New vote
            Vote newVote = Vote.builder()
                    .postId(postId)
                    .username(username)
                    .voteType(voteType)
                    .build();
            Vote savedVote = voteRepository.save(newVote);
            updatePostVoteCounts(postId);
            
            // Create notification for post author (async - don't block response)
            new Thread(() -> {
                try {
                    notificationService.createVoteNotification(post.getUsername(), username, postId, post.getTitle());
                } catch (Exception e) {
                    // Notification failure shouldn't affect vote
                    System.out.println("DEBUG: Vote notification failed (non-blocking): " + e.getMessage());
                }
            }).start();
            
            return savedVote;
        }
    }

    @Transactional
    public void updatePostVoteCounts(Long postId) {
        Post post = postRepository.findById(postId)
                .orElseThrow(() -> new ResourceNotFoundException("Post not found with id: " + postId));

        Long upvotes = voteRepository.countUpvotesByPostId(postId);
        Long downvotes = voteRepository.countDownvotesByPostId(postId);

        post.setUpvotes(upvotes.intValue());
        post.setDownvotes(downvotes.intValue());
        postRepository.save(post);
    }

    public Optional<Vote> getUserVote(Long postId, String username) {
        return voteRepository.findByPostIdAndUsername(postId, username);
    }
}
