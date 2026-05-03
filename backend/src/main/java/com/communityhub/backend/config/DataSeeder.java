package com.communityhub.backend.config;

import com.communityhub.backend.model.Community;
import com.communityhub.backend.repository.CommunityRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.boot.CommandLineRunner;
import org.springframework.stereotype.Component;

@Component
@RequiredArgsConstructor
public class DataSeeder implements CommandLineRunner {

    private final CommunityRepository communityRepository;

    @Override
    public void run(String... args) {
        System.out.println("DEBUG: DataSeeder - Checking if communities exist...");
        
        // Only seed if no communities exist
        if (communityRepository.count() > 0) {
            System.out.println("DEBUG: Communities already exist, skipping seed");
            return;
        }

        System.out.println("DEBUG: Creating 5 initial communities with categories...");

        // Community 1: 11th Science
        Community community1 = new Community();
        community1.setSlug("11th-science");
        community1.setName("11th Science");
        community1.setDescription("Discussion forum for 11th grade Science students. Share notes, ask doubts, and prepare for your exams together.");
        community1.setRules("1. Be respectful to fellow students\n2. Share helpful study materials\n3. No spam or off-topic posts");
        community1.setAccent("from-blue-500/20 to-cyan-500/20");
        community1.setCategory("11th");
        community1.setCreatedBy("system");
        community1.setMemberCount(0);
        communityRepository.save(community1);
        System.out.println("DEBUG: Created 11th Science community");

        // Community 2: 12th Commerce
        Community community2 = new Community();
        community2.setSlug("12th-commerce");
        community2.setName("12th Commerce");
        community2.setDescription("A community for 12th grade Commerce students. Discuss accounts, economics, business studies, and prepare for board exams.");
        community2.setRules("1. Help each other with studies\n2. Share exam tips and strategies\n3. Keep discussions relevant to commerce subjects");
        community2.setAccent("from-green-500/20 to-emerald-500/20");
        community2.setCategory("12th");
        community2.setCreatedBy("system");
        community2.setMemberCount(0);
        communityRepository.save(community2);
        System.out.println("DEBUG: Created 12th Commerce community");

        // Community 3: Graduation CS
        Community community3 = new Community();
        community3.setSlug("graduation-cs");
        community3.setName("Computer Science Graduation");
        community3.setDescription("For B.Tech, BCA, and MCA students. Discuss programming, projects, placements, and career guidance in tech.");
        community3.setRules("1. Share coding resources and projects\n2. Help with technical doubts\n3. Post job and internship opportunities");
        community3.setAccent("from-violet-500/20 to-fuchsia-500/20");
        community3.setCategory("Graduation");
        community3.setCreatedBy("system");
        community3.setMemberCount(0);
        communityRepository.save(community3);
        System.out.println("DEBUG: Created Graduation CS community");

        // Community 4: Competitive Exams
        Community community4 = new Community();
        community4.setSlug("competitive-exams");
        community4.setName("Competitive Exams Preparation");
        community4.setDescription("Prepare for JEE, NEET, CAT, UPSC, SSC, and other competitive exams. Get study plans, resources, and motivation.");
        community4.setRules("1. Share authentic study materials\n2. Discuss exam strategies\n3. Support and motivate each other");
        community4.setAccent("from-orange-500/20 to-red-500/20");
        community4.setCategory("Competitive exams");
        community4.setCreatedBy("system");
        community4.setMemberCount(0);
        communityRepository.save(community4);
        System.out.println("DEBUG: Created Competitive Exams community");

        // Community 5: Government Jobs
        Community community5 = new Community();
        community5.setSlug("government-jobs");
        community5.setName("Government Exam Preparation");
        community5.setDescription("Preparation hub for government jobs - Banking, Railway, SSC, UPSC, State PSCs. Get notifications, study materials, and guidance.");
        community5.setRules("1. Share genuine job notifications\n2. Post study resources and notes\n3. Help fellow aspirants");
        community5.setAccent("from-indigo-500/20 to-purple-500/20");
        community5.setCategory("Government exam preparation");
        community5.setCreatedBy("system");
        community5.setMemberCount(0);
        communityRepository.save(community5);
        System.out.println("DEBUG: Created Government Jobs community");

        System.out.println("DEBUG: DataSeeder completed - Created 5 communities successfully!");
    }
}
