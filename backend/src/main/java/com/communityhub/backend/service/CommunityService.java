package com.communityhub.backend.service;

import com.communityhub.backend.exception.ResourceNotFoundException;
import com.communityhub.backend.model.Community;
import com.communityhub.backend.model.CommunityMember;
import com.communityhub.backend.repository.CommunityMemberRepository;
import com.communityhub.backend.repository.CommunityRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class CommunityService {

    private final CommunityRepository communityRepository;
    private final CommunityMemberRepository communityMemberRepository;

    public Community createCommunity(Community community) {
        if (communityRepository.existsBySlug(community.getSlug())) {
            throw new IllegalArgumentException("Community with slug '" + community.getSlug() + "' already exists");
        }
        return communityRepository.save(community);
    }

    public List<Community> getAllCommunities() {
        return communityRepository.findAll();
    }

    public Community getCommunityBySlug(String slug) {
        return communityRepository.findBySlug(slug)
                .orElseThrow(() -> new ResourceNotFoundException("Community not found with slug: " + slug));
    }

    public Community getCommunityById(Long id) {
        return communityRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Community not found with id: " + id));
    }

    @Transactional
    public Community updateCommunity(Long id, Community communityDetails, String requesterUsername) {
        Community community = getCommunityById(id);
        
        // Only creator can update
        if (!community.getCreatedBy().equals(requesterUsername)) {
            throw new IllegalArgumentException("Only the creator can update this community");
        }

        community.setName(communityDetails.getName());
        community.setDescription(communityDetails.getDescription());
        community.setRules(communityDetails.getRules());
        community.setAccent(communityDetails.getAccent());
        
        return communityRepository.save(community);
    }

    @Transactional
    public void deleteCommunity(Long id, String requesterUsername) {
        Community community = getCommunityById(id);
        
        // Only creator can delete
        if (!community.getCreatedBy().equals(requesterUsername)) {
            throw new IllegalArgumentException("Only the creator can delete this community");
        }
        
        communityRepository.delete(community);
    }

    @Transactional
    public void incrementMemberCount(String slug) {
        Community community = getCommunityBySlug(slug);
        community.setMemberCount(community.getMemberCount() + 1);
        communityRepository.save(community);
    }

    @Transactional
    public void decrementMemberCount(String slug) {
        Community community = getCommunityBySlug(slug);
        if (community.getMemberCount() > 0) {
            community.setMemberCount(community.getMemberCount() - 1);
            communityRepository.save(community);
        }
    }

    @Transactional
    public void joinCommunity(Long communityId, String username) {
        System.out.println("DEBUG: joinCommunity called - communityId: " + communityId + ", username: " + username);
        
        // Check if community exists
        Community community = getCommunityById(communityId);
        System.out.println("DEBUG: Found community: " + community.getSlug());
        
        // Check if already joined
        if (communityMemberRepository.existsByCommunityIdAndUsername(communityId, username)) {
            System.out.println("DEBUG: User already joined this community");
            throw new IllegalArgumentException("Already joined this community");
        }
        
        // Create membership
        CommunityMember member = new CommunityMember();
        member.setCommunityId(communityId);
        member.setUsername(username);
        communityMemberRepository.save(member);
        System.out.println("DEBUG: Saved community member");
        
        // Increment member count
        community.setMemberCount(community.getMemberCount() + 1);
        communityRepository.save(community);
        System.out.println("DEBUG: Incremented member count to: " + community.getMemberCount());
    }

    @Transactional
    public void leaveCommunity(Long communityId, String username) {
        System.out.println("DEBUG: leaveCommunity called - communityId: " + communityId + ", username: " + username);
        
        // Check if community exists
        Community community = getCommunityById(communityId);
        System.out.println("DEBUG: Found community: " + community.getSlug());
        
        // Check if member exists
        CommunityMember member = communityMemberRepository
                .findByCommunityIdAndUsername(communityId, username)
                .orElseThrow(() -> new IllegalArgumentException("Not a member of this community"));
        
        // Delete membership
        communityMemberRepository.delete(member);
        System.out.println("DEBUG: Deleted community member");
        
        // Decrement member count
        if (community.getMemberCount() > 0) {
            community.setMemberCount(community.getMemberCount() - 1);
            communityRepository.save(community);
            System.out.println("DEBUG: Decremented member count to: " + community.getMemberCount());
        }
    }

    public List<Community> getUserCommunities(String username) {
        System.out.println("DEBUG: getUserCommunities called for username: " + username);
        
        List<CommunityMember> memberships = communityMemberRepository.findByUsername(username);
        System.out.println("DEBUG: Found " + memberships.size() + " memberships");
        
        List<Community> communities = memberships.stream()
                .map(membership -> {
                    try {
                        return communityRepository.findById(membership.getCommunityId()).orElse(null);
                    } catch (Exception e) {
                        System.out.println("DEBUG: Failed to find community with id: " + membership.getCommunityId());
                        return null;
                    }
                })
                .filter(community -> community != null)
                .distinct()
                .collect(Collectors.toList());
        
        System.out.println("DEBUG: Returning " + communities.size() + " communities");
        communities.forEach(c -> System.out.println("DEBUG: - " + c.getSlug() + " (id: " + c.getId() + ")"));
        
        return communities;
    }

    public boolean isMember(Long communityId, String username) {
        return communityMemberRepository.existsByCommunityIdAndUsername(communityId, username);
    }
}
