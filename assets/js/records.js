document.addEventListener('DOMContentLoaded', () => {
    // Initialize date range picker functionality
    const dateRange = document.getElementById('dateRange');
    const customDateRange = document.getElementById('customDateRange');
    const exportCustomRange = document.getElementById('exportCustomRange');

    // Show/hide custom date range based on selection
    dateRange.addEventListener('change', (e) => {
        customDateRange.style.display = e.target.value === 'custom' ? 'block' : 'none';
    });

    // Show/hide export custom date range based on selection
    document.querySelector('select[name="exportRange"]').addEventListener('change', (e) => {
        exportCustomRange.style.display = e.target.value === 'custom' ? 'block' : 'none';
    });

    // Initialize filter functionality
    const applyFilter = document.getElementById('applyFilter');
    applyFilter.addEventListener('click', fetchRecords);

    // Initialize export functionality
    const exportRecords = document.getElementById('exportRecords');
    exportRecords.addEventListener('click', handleExport);

    // Load members for the filter dropdown
    loadMembers();

    // Initial load
    fetchRecords();
});

// Load members for filter dropdown
async function loadMembers() {
    try {
        const members = await api.members.getAll();
        const memberFilter = document.getElementById('memberFilter');
        
        members.forEach(member => {
            const option = document.createElement('option');
            option.value = member.id;
            option.textContent = member.name;
            memberFilter.appendChild(option);
        });
    } catch (error) {
        console.error('Error loading members:', error);
    }
}

// Fetch records from the server
async function fetchRecords() {
    try {
        const dateRangeValue = dateRange.value;
        const memberValue = document.getElementById('memberFilter').value;
        const startDate = document.getElementById('startDate').value;
        const endDate = document.getElementById('endDate').value;

        let records;

        if (memberValue) {
            records = await api.records.getByMember(memberValue);
        } else if (dateRangeValue === 'custom' && startDate && endDate) {
            records = await api.records.getByDateRange(startDate, endDate);
        } else {
            records = await api.records.getAll();
        }

        displayRecords(records);
    } catch (error) {
        console.error('Error fetching records:', error);
        alert('Failed to fetch records. Please try again.');
    }
}

// Display records in the table
function displayRecords(records) {
    const tbody = document.getElementById('recordsTableBody');
    tbody.innerHTML = '';

    records.forEach(record => {
        const row = document.createElement('tr');
        row.innerHTML = `
            <td>${formatDateTime(record.attendance_date)}</td>
            <td>${record.member_name}</td>
            <td>${record.rfid_tag}</td>
            <td><span class="badge bg-success">Success</span></td>
            <td>
                <button class="btn btn-sm btn-outline-primary me-1" onclick="viewRecord(${record.id})">
                    <i class="fas fa-eye"></i>
                </button>
                <button class="btn btn-sm btn-outline-danger" onclick="deleteRecord(${record.id})">
                    <i class="fas fa-trash"></i>
                </button>
            </td>
        `;
        tbody.appendChild(row);
    });
}

// Handle export functionality
async function handleExport() {
    try {
        const format = document.querySelector('select[name="format"]').value;
        const exportRange = document.querySelector('select[name="exportRange"]').value;
        const startDate = document.querySelector('input[name="exportStartDate"]').value;
        const endDate = document.querySelector('input[name="exportEndDate"]').value;

        let records;

        if (exportRange === 'filtered') {
            // Get currently filtered records
            const dateRangeValue = dateRange.value;
            const memberValue = document.getElementById('memberFilter').value;
            const filterStartDate = document.getElementById('startDate').value;
            const filterEndDate = document.getElementById('endDate').value;

            if (memberValue) {
                records = await api.records.getByMember(memberValue);
            } else if (dateRangeValue === 'custom' && filterStartDate && filterEndDate) {
                records = await api.records.getByDateRange(filterStartDate, filterEndDate);
            } else {
                records = await api.records.getAll();
            }
        } else if (exportRange === 'custom' && startDate && endDate) {
            records = await api.records.getByDateRange(startDate, endDate);
        } else {
            records = await api.records.getAll();
        }

        // Generate CSV content
        let csvContent = 'Date & Time,Member Name,RFID Tag,Status\n';
        records.forEach(record => {
            csvContent += `${formatDateTime(record.attendance_date)},${record.member_name},${record.rfid_tag},Success\n`;
        });

        // Create and download file
        const blob = new Blob([csvContent], { type: 'text/csv' });
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `attendance_records.${format}`;
        document.body.appendChild(a);
        a.click();
        window.URL.revokeObjectURL(url);
        document.body.removeChild(a);

        // Close the modal
        const modal = bootstrap.Modal.getInstance(document.getElementById('exportModal'));
        modal.hide();
    } catch (error) {
        console.error('Error exporting records:', error);
        alert('Failed to export records. Please try again.');
    }
}

// View record details
async function viewRecord(id) {
    try {
        const record = await api.records.getById(id);
        const recordDetails = document.querySelector('.record-details');
        recordDetails.innerHTML = `
            <div class="mb-3">
                <strong>Member Name:</strong>
                <p>${record.member_name}</p>
            </div>
            <div class="mb-3">
                <strong>RFID Tag:</strong>
                <p>${record.rfid_tag}</p>
            </div>
            <div class="mb-3">
                <strong>Date & Time:</strong>
                <p>${formatDateTime(record.attendance_date)}</p>
            </div>
        `;
        
        const modal = new bootstrap.Modal(document.getElementById('viewRecordModal'));
        modal.show();
    } catch (error) {
        console.error('Error viewing record:', error);
        showErrorAlert('Failed to view record details. Please try again.');
    }
}

// Delete record
async function deleteRecord(id) {
    const deleteModal = new bootstrap.Modal(document.getElementById('deleteRecordModal'));
    const confirmDeleteBtn = document.getElementById('confirmDeleteRecord');
    
    // Store the current record ID
    confirmDeleteBtn.dataset.recordId = id;
    
    // Show delete confirmation modal
    deleteModal.show();
    
    // Handle delete confirmation
    confirmDeleteBtn.onclick = async function() {
        try {
            await api.records.delete(this.dataset.recordId);
            deleteModal.hide();
            fetchRecords(); // Refresh the records table
        } catch (error) {
            console.error('Error deleting record:', error);
            showErrorAlert('Failed to delete record. Please try again.');
        }
    };
}

// Helper function to show error alerts
function showErrorAlert(message) {
    const alertDiv = document.createElement('div');
    alertDiv.className = 'alert alert-danger alert-dismissible fade show';
    alertDiv.innerHTML = `
        ${message}
        <button type="button" class="btn-close" data-bs-dismiss="alert"></button>
    `;
    document.querySelector('.main-content').insertAdjacentElement('afterbegin', alertDiv);
    
    // Auto dismiss after 5 seconds
    setTimeout(() => {
        alertDiv.remove();
    }, 5000);
}

// Helper function to format date and time
function formatDateTime(date) {
    return new Date(date).toLocaleString();
} 