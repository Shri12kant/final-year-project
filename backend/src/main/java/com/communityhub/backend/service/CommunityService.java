package com.communityhub.backend.service;

import com.communityhub.backend.exception.ResourceNotFoundException;
import com.communityhub.backend.model.Community;
import com.communityhub.backend.repository.CommunityRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
@RequiredArgsConstructor
public class CommunityService {

    private final CommunityRepository communityRepository;

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
}
