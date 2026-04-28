package com.communityhub.backend.repository;

import com.communityhub.backend.model.Notification;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface NotificationRepository extends JpaRepository<Notification, Long> {
    
    List<Notification> findByUsernameOrderByCreatedAtDesc(String username);
    
    List<Notification> findByUsernameAndIsReadFalseOrderByCreatedAtDesc(String username);
    
    @Query("SELECT COUNT(n) FROM Notification n WHERE n.username = :username AND n.isRead = false")
    Long countUnreadNotifications(@Param("username") String username);
    
    @Modifying
    @Query("UPDATE Notification n SET n.isRead = true WHERE n.username = :username")
    void markAllAsRead(@Param("username") String username);
    
    @Modifying
    @Query("UPDATE Notification n SET n.isRead = true WHERE n.id = :notificationId AND n.username = :username")
    void markAsRead(@Param("notificationId") Long notificationId, @Param("username") String username);
    
    void deleteByUsernameAndIsReadTrue(String username);
}
