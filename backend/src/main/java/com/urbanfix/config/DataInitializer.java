package com.urbanfix.config;

import com.urbanfix.entity.Complaint;
import com.urbanfix.entity.User;
import com.urbanfix.enums.ComplaintStatus;
import com.urbanfix.enums.Role;
import com.urbanfix.repository.ComplaintRepository;
import com.urbanfix.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.boot.CommandLineRunner;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;

import java.time.LocalDateTime;
import java.util.List;

@Component
@RequiredArgsConstructor
public class DataInitializer implements CommandLineRunner {

    private final UserRepository userRepository;
    private final ComplaintRepository complaintRepository;
    private final PasswordEncoder passwordEncoder;

    @Override
    public void run(String... args) throws Exception {
        // 1. Initialize or reset Admin Demo user
        User admin = userRepository.findByEmail("admin@urbanfix.com").map(user -> {
            user.setPassword(passwordEncoder.encode("admin123"));
            user.setRole(Role.ADMIN);
            return userRepository.save(user);
        }).orElseGet(() -> {
            User newAdmin = User.builder()
                    .fullName("System Admin")
                    .email("admin@urbanfix.com")
                    .password(passwordEncoder.encode("admin123"))
                    .role(Role.ADMIN)
                    .build();
            return userRepository.save(newAdmin);
        });

        // 2. Initialize or reset Citizen Demo user (Ghosh)
        User citizen = userRepository.findByEmail("armytech400@gmail.com").map(user -> {
            user.setFullName("Ghosh");
            user.setPassword(passwordEncoder.encode("4321"));
            user.setRole(Role.USER);
            return userRepository.save(user);
        }).orElseGet(() -> {
            User newCitizen = User.builder()
                    .fullName("Ghosh")
                    .email("armytech400@gmail.com")
                    .password(passwordEncoder.encode("4321"))
                    .role(Role.USER)
                    .build();
            return userRepository.save(newCitizen);
        });

        // 3. Purge old complaints with NULL or zero GPS coordinates
        List<Complaint> allComplaints = complaintRepository.findAll();
        for (Complaint c : allComplaints) {
            if (c.getLatitude() == null || c.getLongitude() == null || c.getLatitude() == 0 || c.getLongitude() == 0) {
                complaintRepository.delete(c);
            }
        }

        // 4. Seed realistic Pune complaints with exact GPS coordinates if dataset is small
        if (complaintRepository.count() < 5) {
            createComplaint(citizen, "Damaged Road near AIT College", "Deep potholes and cracked asphalt causing heavy traffic delays.", "Roads & Traffic", "Near OAC, AIT Pune", 18.6186, 73.8752, ComplaintStatus.PENDING, 1);
            createComplaint(citizen, "Broken Street Light Pole on NH-50", "Dangerous unlit stretch on national highway during night hours.", "Electrical & Lighting", "NH-50, Pune", 18.6300, 73.8500, ComplaintStatus.IN_PROGRESS, 2);
            createComplaint(citizen, "Excessive Loudspeaker Noise at Night", "Loud music played beyond permissible night limits near residential area.", "Noise & Pollution", "Koregaon Park, Pune", 18.5362, 73.8940, ComplaintStatus.IN_PROGRESS, 3);
            createComplaint(citizen, "Stray Animals Hazard on Road", "Stray cattle blocking main traffic arterial road during peak morning hours.", "Other", "Kharadi, Pune", 18.5515, 73.9348, ComplaintStatus.PENDING, 4);
            createComplaint(citizen, "Large Pothole on MG Road", "Severe crater on main market road damaging vehicles.", "Roads & Traffic", "MG Road, Camp, Pune", 18.5167, 73.8742, ComplaintStatus.PENDING, 5);
            createComplaint(citizen, "Traffic Signal Malfunction at Hinjewadi", "Signal lights stuck on red, causing major IT park traffic bottleneck.", "Roads & Traffic", "Hinjewadi Phase 1, Pune", 18.5912, 73.7389, ComplaintStatus.IN_PROGRESS, 6);
            createComplaint(citizen, "Power Cable Fault in Viman Nagar", "Underground feeder cable short circuit causing neighborhood blackout.", "Electrical & Lighting", "Viman Nagar, Pune", 18.5679, 73.9143, ComplaintStatus.PENDING, 7);
            createComplaint(citizen, "Main Water Pipeline Leakage", "High pressure municipal pipe leaking thousands of liters onto road.", "Water Supply", "Shivajinagar, Pune", 18.5314, 73.8446, ComplaintStatus.IN_PROGRESS, 8);
            createComplaint(citizen, "Open Sewage Overflow on Street", "Drainage overflow creating unhygienic conditions and foul odor.", "Sanitation & Waste", "Camp Area, Pune", 18.5125, 73.8790, ComplaintStatus.PENDING, 9);
            createComplaint(citizen, "Broken Park Bench in Saras Baug", "Vandalized wooden bench requiring replacement in public park.", "Public Parks", "Saras Baug, Pune", 18.5005, 73.8530, ComplaintStatus.RESOLVED, 10);
        }
    }

    private void createComplaint(User user, String title, String desc, String category, String loc, double lat, double lng, ComplaintStatus status, int daysAgo) {
        Complaint c = new Complaint();
        c.setUser(user);
        c.setTitle(title);
        c.setDescription(desc);
        c.setCategory(category);
        c.setLocation(loc);
        c.setLatitude(lat);
        c.setLongitude(lng);
        c.setStatus(status);
        c.setCreatedAt(LocalDateTime.now().minusDays(daysAgo));
        c.setUpdatedAt(LocalDateTime.now().minusDays(daysAgo));
        complaintRepository.save(c);
    }
}
