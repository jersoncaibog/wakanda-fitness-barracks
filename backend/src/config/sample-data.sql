USE reuben_fitness_barracks;
-- Clear existing data
TRUNCATE TABLE records;
DELETE FROM members;
ALTER TABLE members AUTO_INCREMENT = 1;
-- Insert sample members with realistic data
INSERT INTO members (
        name,
        rfid_tag,
        membership_status,
        expiration_date
    )
VALUES (
        'John Doe',
        'FB001-2024',
        'active',
        DATE_ADD(CURDATE(), INTERVAL 30 DAY)
    ),
    (
        'Jane Smith',
        'FB002-2024',
        'active',
        DATE_ADD(CURDATE(), INTERVAL 60 DAY)
    ),
    (
        'Mike Johnson',
        'FB003-2024',
        'active',
        DATE_ADD(CURDATE(), INTERVAL 5 DAY)
    ),
    (
        'Sarah Williams',
        'FB004-2024',
        'expired',
        DATE_SUB(CURDATE(), INTERVAL 5 DAY)
    ),
    (
        'Robert Brown',
        'FB005-2024',
        'active',
        DATE_ADD(CURDATE(), INTERVAL 45 DAY)
    ),
    (
        'Emily Davis',
        'FB006-2024',
        'active',
        DATE_ADD(CURDATE(), INTERVAL 90 DAY)
    ),
    (
        'David Wilson',
        'FB007-2024',
        'expired',
        DATE_SUB(CURDATE(), INTERVAL 10 DAY)
    ),
    (
        'Lisa Anderson',
        'FB008-2024',
        'active',
        DATE_ADD(CURDATE(), INTERVAL 15 DAY)
    ),
    (
        'Michael Taylor',
        'FB009-2024',
        'active',
        DATE_ADD(CURDATE(), INTERVAL 75 DAY)
    ),
    (
        'Jennifer Martin',
        'FB010-2024',
        'active',
        DATE_ADD(CURDATE(), INTERVAL 3 DAY)
    );
-- Insert sample attendance records (multiple visits per member)
INSERT INTO records (member_id, attendance_date)
VALUES -- Today's attendance
    (1, NOW()),
    (2, DATE_SUB(NOW(), INTERVAL 2 HOUR)),
    (3, DATE_SUB(NOW(), INTERVAL 4 HOUR)),
    -- Yesterday's attendance
    (1, DATE_SUB(NOW(), INTERVAL 1 DAY)),
    (2, DATE_SUB(NOW(), INTERVAL 1 DAY)),
    (5, DATE_SUB(NOW(), INTERVAL 1 DAY)),
    -- Two days ago
    (1, DATE_SUB(NOW(), INTERVAL 2 DAY)),
    (3, DATE_SUB(NOW(), INTERVAL 2 DAY)),
    (6, DATE_SUB(NOW(), INTERVAL 2 DAY)),
    (8, DATE_SUB(NOW(), INTERVAL 2 DAY));
-- Create useful views
-- 1. Active Members View
CREATE OR REPLACE VIEW view_active_members AS
SELECT id,
    name,
    rfid_tag,
    expiration_date,
    DATEDIFF(expiration_date, CURDATE()) as days_until_expiry
FROM members
WHERE membership_status = 'active'
ORDER BY expiration_date;
-- 2. Members Expiring Soon View (Next 7 days)
CREATE OR REPLACE VIEW view_expiring_soon AS
SELECT id,
    name,
    rfid_tag,
    expiration_date,
    DATEDIFF(expiration_date, CURDATE()) as days_until_expiry
FROM members
WHERE membership_status = 'active'
    AND expiration_date BETWEEN CURDATE() AND DATE_ADD(CURDATE(), INTERVAL 7 DAY)
ORDER BY expiration_date;
-- 3. Today's Attendance View
CREATE OR REPLACE VIEW view_today_attendance AS
SELECT r.id as record_id,
    m.name as member_name,
    m.rfid_tag,
    r.attendance_date,
    m.membership_status
FROM records r
    JOIN members m ON r.member_id = m.id
WHERE DATE(r.attendance_date) = CURDATE()
ORDER BY r.attendance_date DESC;
-- 4. Member Visit Frequency View (Last 30 days)
CREATE OR REPLACE VIEW view_member_frequency AS
SELECT m.id as member_id,
    m.name as member_name,
    m.membership_status,
    COUNT(r.id) as visit_count,
    MAX(r.attendance_date) as last_visit
FROM members m
    LEFT JOIN records r ON m.id = r.member_id
    AND r.attendance_date >= DATE_SUB(CURDATE(), INTERVAL 30 DAY)
GROUP BY m.id,
    m.name,
    m.membership_status
ORDER BY visit_count DESC;