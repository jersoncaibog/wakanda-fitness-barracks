document.addEventListener('DOMContentLoaded', async () => {
    // Initialize tooltips
    const tooltipTriggerList = [].slice.call(document.querySelectorAll('[data-bs-toggle="tooltip"]'));
    tooltipTriggerList.map(function (tooltipTriggerEl) {
        return new bootstrap.Tooltip(tooltipTriggerEl);
    });

    // Initialize dashboard if on dashboard page
    if (document.querySelector('.scanner-status')) {
        initializeRFIDScanner();
        await updateDashboardStats();
        await loadRecentActivity();
    }
});

// RFID Scanner initialization and handling
function initializeRFIDScanner() {
    const rfidInput = document.getElementById('rfidInput');
    const checkInBtn = document.getElementById('checkInBtn');
    const scannerStatus = document.querySelector('.scanner-status');
    const lastScan = document.querySelector('.last-scan');
    const scanDetails = document.querySelector('.scan-details');
    const resultMessage = document.getElementById('resultMessage');

    // Handle check-in button click
    checkInBtn.addEventListener('click', async () => {
        const rfidTag = rfidInput.value.trim();
        if (!rfidTag) {
            showResult('Please enter an RFID tag', 'danger');
            return;
        }
        await handleRFIDScan(rfidTag);
    });

    // Handle Enter key in input
    rfidInput.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') {
            checkInBtn.click();
        }
    });

    // RFID scan handler
    async function handleRFIDScan(rfidTag) {
        try {
            showResult('Processing scan...', 'info');
            const result = await api.records.create(rfidTag);
            
            const success = result.message.includes('successfully');
            showResult(result.message, success ? 'success' : 'danger');

            // Show last scan details
            lastScan.style.display = 'block';
            scanDetails.innerHTML = `
                <p><strong>Member:</strong> ${result.member.name}</p>
                <p><strong>Time:</strong> ${new Date().toLocaleTimeString()}</p>
                <p><strong>Status:</strong> ${success ? 'Success' : 'Failed'}</p>
            `;

            // Update dashboard stats and recent activity
            await updateDashboardStats();
            await loadRecentActivity();

            // Clear input on success
            if (success) {
                rfidInput.value = '';
            }

        } catch (error) {
            showResult(error.message || 'Error processing scan', 'danger');
        }
    }

    function showResult(message, type) {
        resultMessage.className = `alert alert-${type} mt-3`;
        resultMessage.textContent = message;
        resultMessage.classList.remove('d-none');
    }
}

// Update dashboard stats
async function updateDashboardStats() {
    try {
        const stats = document.querySelectorAll('.dashboard-stat');
        if (!stats.length) return;

        // Get all data in parallel
        const [members, todayCount, expiringSoon] = await Promise.all([
            api.members.getAll(),
            api.records.getTodayCount(),
            api.members.getExpiringSoon()
        ]);

        // Calculate active members
        const activeMembers = members.filter(m => m.membership_status === 'active');

        // Update stats
        stats[0].textContent = members.length;
        stats[1].textContent = activeMembers.length;
        stats[2].textContent = todayCount.count;
        stats[3].textContent = expiringSoon.length;

    } catch (error) {
        console.error('Error updating dashboard stats:', error);
        // Set default values in case of error
        stats.forEach(stat => stat.textContent = '0');
    }
}

// Load recent activity
async function loadRecentActivity() {
    try {
        const recentActivity = await api.records.getRecentActivity();
        const tbody = document.querySelector('#recentActivityTable tbody');
        if (!tbody) return;

        tbody.innerHTML = '';
        recentActivity.forEach(record => {
            const row = document.createElement('tr');
            row.innerHTML = `
                <td>${formatDateTime(record.attendance_date)}</td>
                <td>${record.member_name}</td>
                <td><span class="badge bg-success">Success</span></td>
            `;
            tbody.appendChild(row);
        });
    } catch (error) {
        console.error('Error loading recent activity:', error);
    }
}

// Format time for display
function formatTime(date) {
    return new Date(date).toLocaleTimeString();
}

// Format date for display
function formatDate(date) {
    return new Date(date).toLocaleDateString();
}

// Format date and time for display
function formatDateTime(date) {
    return new Date(date).toLocaleString();
} 