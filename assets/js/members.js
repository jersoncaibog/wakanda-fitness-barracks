document.addEventListener('DOMContentLoaded', () => {
    // Initialize search and filter functionality
    const searchInput = document.querySelector('input[type="text"]');
    const statusFilter = document.getElementById('statusFilter');
    const sortBy = document.getElementById('sortBy');

    // Add event listeners for search and filters
    if (searchInput) {
        searchInput.addEventListener('input', debounce(() => filterMembers(searchInput, statusFilter, sortBy), 300));
    }
    
    if (statusFilter) {
        statusFilter.addEventListener('change', () => filterMembers(searchInput, statusFilter, sortBy));
    }
    
    if (sortBy) {
        sortBy.addEventListener('change', () => filterMembers(searchInput, statusFilter, sortBy));
    }

    // Initialize form submissions
    const addMemberForm = document.getElementById('addMemberForm');
    const editMemberForm = document.getElementById('editMemberForm');
    const saveNewMember = document.getElementById('saveNewMember');
    const updateMember = document.getElementById('updateMember');

    if (saveNewMember) {
        saveNewMember.addEventListener('click', handleAddMember);
    }
    
    if (updateMember) {
        updateMember.addEventListener('click', handleUpdateMember);
    }

    // Add real-time validation for add member form
    if (addMemberForm) {
        const inputs = addMemberForm.querySelectorAll('input, select');
        inputs.forEach(input => {
            input.addEventListener('blur', () => validateField(input));
            input.addEventListener('input', () => {
                // Remove error when user starts typing
                input.classList.remove('is-invalid');
                const errorDiv = input.nextElementSibling;
                if (errorDiv && errorDiv.classList.contains('invalid-feedback')) {
                    errorDiv.remove();
                }
            });
        });
    }

    // Initial load
    fetchMembers();
});

// Fetch and display members
async function fetchMembers() {
    try {
        const members = await api.members.getAll();
        displayMembers(members);
    } catch (error) {
        console.error('Error fetching members:', error);
        alert('Failed to fetch members. Please try again.');
    }
}

// Display members in the table
function displayMembers(members) {
    const tbody = document.getElementById('membersTableBody');
    tbody.innerHTML = '';

    members.forEach(member => {
        const row = document.createElement('tr');
        const expirationDate = new Date(member.expiration_date);
        const isExpired = expirationDate < new Date();
        
        row.innerHTML = `
            <td>${member.name}</td>
            <td>${member.rfid_tag}</td>
            <td>
                <span class="badge ${member.membership_status === 'active' ? 'bg-success' : 'bg-danger'}">
                    ${member.membership_status}
                </span>
            </td>
            <td>
                <span class="${isExpired ? 'text-danger' : ''}">${formatDate(member.expiration_date)}</span>
            </td>
            <td>
                <button class="btn btn-sm btn-outline-primary me-1" onclick="editMember(${member.id})">
                    <i class="fas fa-edit"></i>
                </button>
                <button class="btn btn-sm btn-outline-danger" onclick="deleteMember(${member.id})">
                    <i class="fas fa-trash"></i>
                </button>
            </td>
        `;
        tbody.appendChild(row);
    });
}

// Validate individual field
function validateField(field) {
    let isValid = true;
    const value = field.value.trim();

    // Clear previous error
    field.classList.remove('is-invalid');
    const existingError = field.nextElementSibling;
    if (existingError && existingError.classList.contains('invalid-feedback')) {
        existingError.remove();
    }

    switch (field.name) {
        case 'name':
            if (!value) {
                showFormError('addMemberForm', 'name', 'Name is required');
                isValid = false;
            }
            break;
        case 'rfidTag':
            if (!value) {
                showFormError('addMemberForm', 'rfidTag', 'RFID Tag is required');
                isValid = false;
            }
            break;
        case 'status':
            if (!value) {
                showFormError('addMemberForm', 'status', 'Membership Status is required');
                isValid = false;
            }
            break;
        case 'expirationDate':
            if (!value) {
                showFormError('addMemberForm', 'expirationDate', 'Expiration Date is required');
                isValid = false;
            } else {
                const today = new Date();
                today.setHours(0, 0, 0, 0);
                const expirationDate = new Date(value);
                if (expirationDate < today) {
                    showFormError('addMemberForm', 'expirationDate', 'Expiration Date cannot be in the past');
                    isValid = false;
                }
            }
            break;
    }

    return isValid;
}

// Handle adding new member
async function handleAddMember() {
    try {
        const formData = new FormData(addMemberForm);
        const memberData = {
            name: formData.get('name').trim(),
            rfidTag: formData.get('rfidTag').trim(),
            membershipStatus: formData.get('status'),
            expirationDate: formData.get('expirationDate')
        };

        // Clear previous error messages
        clearFormErrors('addMemberForm');

        // Validate all fields
        const inputs = addMemberForm.querySelectorAll('input, select');
        let hasErrors = false;

        inputs.forEach(input => {
            if (!validateField(input)) {
                hasErrors = true;
            }
        });

        if (hasErrors) {
            return;
        }

        await api.members.create(memberData);

        // Close modal and refresh table
        const modal = bootstrap.Modal.getInstance(document.getElementById('addMemberModal'));
        modal.hide();
        addMemberForm.reset();
        fetchMembers();

        // Show success message
        showSuccessAlert('Member added successfully');
    } catch (error) {
        console.error('Error adding member:', error);
        if (error.message.includes('RFID tag is already in use')) {
            showFormError('addMemberForm', 'rfidTag', 'This RFID tag is already in use');
        } else {
            // Show general error at the top of the form
            const formAlert = document.createElement('div');
            formAlert.className = 'alert alert-danger mb-3';
            formAlert.textContent = 'Failed to add member. Please try again.';
            addMemberForm.insertBefore(formAlert, addMemberForm.firstChild);
        }
    }
}

// Helper function to show form field error
function showFormError(formId, fieldName, message) {
    const form = document.getElementById(formId);
    const field = form.elements[fieldName];
    const errorDiv = document.createElement('div');
    errorDiv.className = 'invalid-feedback d-block'; // Added d-block to ensure visibility
    errorDiv.style.color = '#dc3545'; // Bootstrap danger color
    errorDiv.textContent = message;
    
    field.classList.add('is-invalid');
    field.style.borderColor = '#dc3545'; // Bootstrap danger color
    
    // Remove any existing error message
    const existingError = field.nextElementSibling;
    if (existingError && existingError.classList.contains('invalid-feedback')) {
        existingError.remove();
    }
    
    field.parentNode.appendChild(errorDiv);
}

// Helper function to show success alert
function showSuccessAlert(message) {
    const alertDiv = document.createElement('div');
    alertDiv.className = 'alert alert-success alert-dismissible fade show';
    alertDiv.innerHTML = `
        ${message}
        <button type="button" class="btn-close" data-bs-dismiss="alert"></button>
    `;
    document.querySelector('.main-content').insertAdjacentElement('afterbegin', alertDiv);
    
    // Auto dismiss after 3 seconds
    setTimeout(() => {
        alertDiv.remove();
    }, 3000);
}

// Helper function to clear all form errors
function clearFormErrors(formId) {
    const form = document.getElementById(formId);
    const invalidFields = form.querySelectorAll('.is-invalid');
    const errorMessages = form.querySelectorAll('.invalid-feedback');
    const alerts = form.querySelectorAll('.alert');
    
    invalidFields.forEach(field => field.classList.remove('is-invalid'));
    errorMessages.forEach(msg => msg.remove());
    alerts.forEach(alert => alert.remove());
}

// Handle updating member
async function handleUpdateMember() {
    try {
        const formData = new FormData(editMemberForm);
        const memberId = formData.get('memberId');
        const memberData = {
            name: formData.get('name'),
            rfidTag: formData.get('rfidTag'),
            membershipStatus: formData.get('status'),
            expirationDate: formData.get('expirationDate')
        };

        await api.members.update(memberId, memberData);

        // Close modal and refresh table
        const modal = bootstrap.Modal.getInstance(document.getElementById('editMemberModal'));
        modal.hide();
        editMemberForm.reset();
        fetchMembers();
    } catch (error) {
        console.error('Error updating member:', error);
        alert('Failed to update member. Please try again.');
    }
}

// Filter members based on search and filter values
async function filterMembers(searchInput, statusFilter, sortBy) {
    try {
        // Always get fresh data from the API
        const members = await api.members.getAll();
        const searchTerm = searchInput ? searchInput.value.toLowerCase() : '';
        const status = statusFilter ? statusFilter.value.toLowerCase() : '';

        // Filter members
        let filteredMembers = members.filter(member => {
            const matchesSearch = !searchTerm || member.name.toLowerCase().includes(searchTerm);
            const matchesStatus = !status || member.membership_status === status;
            return matchesSearch && matchesStatus;
        });

        // Sort members
        if (sortBy && sortBy.value) {
            filteredMembers.sort((a, b) => {
                switch (sortBy.value) {
                    case 'name':
                        return a.name.localeCompare(b.name);
                    case 'status':
                        return a.membership_status.localeCompare(b.membership_status);
                    case 'expiration':
                        return new Date(a.expiration_date) - new Date(b.expiration_date);
                    default:
                        return 0;
                }
            });
        }

        // Display filtered members
        displayMembers(filteredMembers);
    } catch (error) {
        console.error('Error filtering members:', error);
    }
}

// Edit member
async function editMember(id) {
    try {
        const member = await api.members.getById(id);
        const form = document.getElementById('editMemberForm');
        form.elements['memberId'].value = member.id;
        form.elements['name'].value = member.name;
        form.elements['rfidTag'].value = member.rfid_tag;
        form.elements['status'].value = member.membership_status;
        form.elements['expirationDate'].value = member.expiration_date.split('T')[0];

        const modal = new bootstrap.Modal(document.getElementById('editMemberModal'));
        modal.show();
    } catch (error) {
        console.error('Error fetching member details:', error);
        alert('Failed to load member details. Please try again.');
    }
}

// Delete member
async function deleteMember(id) {
    // Create and show confirmation dialog
    const dialog = document.createElement('div');
    dialog.className = 'modal fade';
    dialog.innerHTML = `
        <div class="modal-dialog">
            <div class="modal-content">
                <div class="modal-header">
                    <h5 class="modal-title">Confirm Deletion</h5>
                    <button type="button" class="btn-close" data-bs-dismiss="modal"></button>
                </div>
                <div class="modal-body">
                    <p>Are you sure you want to delete this member? This action cannot be undone.</p>
                </div>
                <div class="modal-footer">
                    <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Cancel</button>
                    <button type="button" class="btn btn-danger" id="confirmDelete">Delete</button>
                </div>
            </div>
        </div>
    `;
    document.body.appendChild(dialog);

    const modal = new bootstrap.Modal(dialog);
    modal.show();

    // Handle delete confirmation
    document.getElementById('confirmDelete').addEventListener('click', async () => {
        try {
            await api.members.delete(id);
            modal.hide();
            // Remove dialog after modal is hidden
            dialog.addEventListener('hidden.bs.modal', () => {
                if (dialog && dialog.parentNode === document.body) {
                    document.body.removeChild(dialog);
                }
                fetchMembers();
            }, { once: true }); // Use once: true to ensure the listener is removed after execution
        } catch (error) {
            console.error('Error deleting member:', error);
            const errorAlert = document.createElement('div');
            errorAlert.className = 'alert alert-danger mt-3';
            errorAlert.textContent = 'Failed to delete member. Please try again.';
            dialog.querySelector('.modal-body').appendChild(errorAlert);
        }
    });

    // Clean up modal when closed
    dialog.addEventListener('hidden.bs.modal', () => {
        if (dialog && dialog.parentNode === document.body) {
            document.body.removeChild(dialog);
        }
    }, { once: true }); // Use once: true to ensure the listener is removed after execution
}

// Helper function to format date
function formatDate(date) {
    return new Date(date).toLocaleDateString();
}

// Debounce function for search input
function debounce(func, wait) {
    let timeout;
    return function executedFunction(...args) {
        const later = () => {
            clearTimeout(timeout);
            func(...args);
        };
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
    };
} 