const API_BASE_URL = 'http://localhost:3000/api';

const api = {
    // Members API
    members: {
        getAll: async () => {
            const response = await fetch(`${API_BASE_URL}/members`);
            if (!response.ok) throw new Error('Failed to fetch members');
            return response.json();
        },

        getById: async (id) => {
            const response = await fetch(`${API_BASE_URL}/members/${id}`);
            if (!response.ok) throw new Error('Failed to fetch member');
            return response.json();
        },

        create: async (memberData) => {
            const response = await fetch(`${API_BASE_URL}/members`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(memberData)
            });
            if (!response.ok) throw new Error('Failed to create member');
            return response.json();
        },

        update: async (id, memberData) => {
            const response = await fetch(`${API_BASE_URL}/members/${id}`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(memberData)
            });
            if (!response.ok) throw new Error('Failed to update member');
            return response.json();
        },

        delete: async (id) => {
            const response = await fetch(`${API_BASE_URL}/members/${id}`, {
                method: 'DELETE'
            });
            if (!response.ok) throw new Error('Failed to delete member');
            return response.json();
        },

        verifyRFID: async (rfidTag) => {
            const response = await fetch(`${API_BASE_URL}/members/verify-rfid`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ rfidTag })
            });
            if (!response.ok) throw new Error('Failed to verify RFID');
            return response.json();
        },

        getExpiringSoon: async () => {
            const response = await fetch(`${API_BASE_URL}/members/expiring-soon`);
            if (!response.ok) throw new Error('Failed to fetch expiring members');
            return response.json();
        }
    },

    // Records API
    records: {
        getAll: async () => {
            const response = await fetch(`${API_BASE_URL}/records`);
            if (!response.ok) throw new Error('Failed to fetch records');
            return response.json();
        },

        getById: async (id) => {
            const response = await fetch(`${API_BASE_URL}/records/${id}`);
            if (!response.ok) throw new Error('Failed to fetch record');
            return response.json();
        },

        create: async (rfidTag) => {
            const response = await fetch(`${API_BASE_URL}/records`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ rfidTag })
            });
            if (!response.ok) throw new Error('Failed to create record');
            return response.json();
        },

        delete: async (id) => {
            const response = await fetch(`${API_BASE_URL}/records/${id}`, {
                method: 'DELETE'
            });
            if (!response.ok) throw new Error('Failed to delete record');
            return response.json();
        },

        getByDateRange: async (startDate, endDate) => {
            const response = await fetch(`${API_BASE_URL}/records/date-range?startDate=${startDate}&endDate=${endDate}`);
            if (!response.ok) throw new Error('Failed to fetch records by date range');
            return response.json();
        },

        getByMember: async (memberId) => {
            const response = await fetch(`${API_BASE_URL}/records/member/${memberId}`);
            if (!response.ok) throw new Error('Failed to fetch member records');
            return response.json();
        },

        getTodayCount: async () => {
            const response = await fetch(`${API_BASE_URL}/records/today-count`);
            if (!response.ok) throw new Error('Failed to fetch today\'s count');
            return response.json();
        },

        getRecentActivity: async (limit = 5) => {
            const response = await fetch(`${API_BASE_URL}/records/recent-activity?limit=${limit}`);
            if (!response.ok) throw new Error('Failed to fetch recent activity');
            return response.json();
        }
    }
}; 