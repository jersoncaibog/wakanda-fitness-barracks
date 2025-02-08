const Record = require('../models/Record');
const Member = require('../models/Member');

const recordController = {
    // Get all records
    async getAllRecords(req, res) {
        try {
            const records = await Record.getAll();
            res.json(records);
        } catch (error) {
            console.error('Error getting records:', error);
            res.status(500).json({ message: 'Error getting records' });
        }
    },

    // Get record by ID
    async getRecordById(req, res) {
        try {
            const record = await Record.getById(req.params.id);
            if (!record) {
                return res.status(404).json({ message: 'Record not found' });
            }
            res.json(record);
        } catch (error) {
            console.error('Error getting record:', error);
            res.status(500).json({ message: 'Error getting record' });
        }
    },

    // Create new record (record attendance)
    async createRecord(req, res) {
        try {
            const { rfidTag } = req.body;
            
            if (!rfidTag) {
                return res.status(400).json({ message: 'RFID tag is required' });
            }

            // Get member by RFID
            const member = await Member.getByRFID(rfidTag);
            if (!member) {
                return res.status(404).json({ message: 'Member not found' });
            }

            // Check if membership is expired
            const isExpired = new Date(member.expiration_date) < new Date();
            if (isExpired) {
                return res.status(400).json({ 
                    message: 'Membership expired',
                    member: {
                        ...member,
                        id: Number(member.id) // Convert BigInt to Number
                    }
                });
            }

            // Create attendance record
            const result = await Record.create({
                memberId: member.id,
                attendanceDate: new Date()
            });

            res.status(201).json({
                message: 'Attendance recorded successfully',
                recordId: Number(result.insertId), // Convert BigInt to Number
                member: {
                    ...member,
                    id: Number(member.id) // Convert BigInt to Number
                }
            });
        } catch (error) {
            console.error('Error creating record:', error);
            res.status(500).json({ message: 'Error creating record' });
        }
    },

    // Delete record
    async deleteRecord(req, res) {
        try {
            const recordId = req.params.id;

            // Check if record exists
            const record = await Record.getById(recordId);
            if (!record) {
                return res.status(404).json({ message: 'Record not found' });
            }

            await Record.delete(recordId);
            res.json({ message: 'Record deleted successfully' });
        } catch (error) {
            console.error('Error deleting record:', error);
            res.status(500).json({ message: 'Error deleting record' });
        }
    },

    // Get records by date range
    async getRecordsByDateRange(req, res) {
        try {
            const { startDate, endDate } = req.query;
            
            if (!startDate || !endDate) {
                return res.status(400).json({ message: 'Start date and end date are required' });
            }

            const records = await Record.getByDateRange(startDate, endDate);
            res.json(records);
        } catch (error) {
            console.error('Error getting records by date range:', error);
            res.status(500).json({ message: 'Error getting records' });
        }
    },

    // Get records by member
    async getRecordsByMember(req, res) {
        try {
            const memberId = req.params.memberId;

            // Check if member exists
            const member = await Member.getById(memberId);
            if (!member) {
                return res.status(404).json({ message: 'Member not found' });
            }

            const records = await Record.getByMember(memberId);
            res.json(records);
        } catch (error) {
            console.error('Error getting member records:', error);
            res.status(500).json({ message: 'Error getting records' });
        }
    },

    // Get today's attendance count
    async getTodayCount(req, res) {
        try {
            const count = await Record.getTodayCount();
            res.json({ count: parseInt(count) || 0 });
        } catch (error) {
            console.error('Error getting today\'s count:', error);
            res.status(500).json({ message: 'Error getting count', count: 0 });
        }
    },

    // Get recent activity
    async getRecentActivity(req, res) {
        try {
            const limit = parseInt(req.query.limit) || 5;
            const records = await Record.getRecentActivity(limit);
            res.json(records);
        } catch (error) {
            console.error('Error getting recent activity:', error);
            res.status(500).json({ message: 'Error getting recent activity' });
        }
    }
};

module.exports = recordController; 