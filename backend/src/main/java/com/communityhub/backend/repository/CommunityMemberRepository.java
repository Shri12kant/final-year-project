package com.communityhub.backend.repository;

import com.communityhub.backend.model.CommunityMember;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface CommunityMemberRepository extends JpaRepository<CommunityMember, Long> {
    
    List<CommunityMember> findByUsername(String username);
    
    Optional<CommunityMember> findByCommunityIdAndUsername(Long communityId, String username);
    
    boolean existsByCommunityIdAndUsername(Long communityId, String username);
    
    void deleteByCommunityIdAndUsername(Long communityId, String username);
    
    long countByCommunityId(Long communityId);
}
