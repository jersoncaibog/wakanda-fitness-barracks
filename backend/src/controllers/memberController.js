const Member = require('../models/Member');

const memberController = {
    // Get all members
    async getAllMembers(req, res) {
        try {
            const members = await Member.getAll();
            res.json(members);
        } catch (error) {
            console.error('Error getting members:', error);
            res.status(500).json({ message: 'Error getting members' });
        }
    },

    // Get member by ID
    async getMemberById(req, res) {
        try {
            const member = await Member.getById(req.params.id);
            if (!member) {
                return res.status(404).json({ message: 'Member not found' });
            }
            res.json(member);
        } catch (error) {
            console.error('Error getting member:', error);
            res.status(500).json({ message: 'Error getting member' });
        }
    },

    // Create new member
    async createMember(req, res) {
        try {
            const { name, rfidTag, membershipStatus, expirationDate } = req.body;
            
            // Validate required fields
            if (!name || !rfidTag || !membershipStatus || !expirationDate) {
                return res.status(400).json({ message: 'All fields are required' });
            }

            // Check if RFID tag is already in use
            const existingMember = await Member.getByRFID(rfidTag);
            if (existingMember) {
                return res.status(400).json({ message: 'RFID tag is already in use' });
            }

            const result = await Member.create({
                name,
                rfidTag,
                membershipStatus,
                expirationDate
            });

            res.status(201).json({
                message: 'Member created successfully',
                memberId: Number(result.insertId)
            });
        } catch (error) {
            console.error('Error creating member:', error);
            res.status(500).json({ message: 'Error creating member' });
        }
    },

    // Update member
    async updateMember(req, res) {
        try {
            const { name, rfidTag, membershipStatus, expirationDate } = req.body;
            const memberId = req.params.id;

            // Validate required fields
            if (!name || !rfidTag || !membershipStatus || !expirationDate) {
                return res.status(400).json({ message: 'All fields are required' });
            }

            // Check if member exists
            const existingMember = await Member.getById(memberId);
            if (!existingMember) {
                return res.status(404).json({ message: 'Member not found' });
            }

            // Check if new RFID tag is already in use by another member
            if (rfidTag !== existingMember.rfid_tag) {
                const memberWithRFID = await Member.getByRFID(rfidTag);
                if (memberWithRFID && memberWithRFID.id !== parseInt(memberId)) {
                    return res.status(400).json({ message: 'RFID tag is already in use' });
                }
            }

            await Member.update(memberId, {
                name,
                rfidTag,
                membershipStatus,
                expirationDate
            });

            res.json({ message: 'Member updated successfully' });
        } catch (error) {
            console.error('Error updating member:', error);
            res.status(500).json({ message: 'Error updating member' });
        }
    },

    // Delete member
    async deleteMember(req, res) {
        try {
            const memberId = req.params.id;

            // Check if member exists
            const member = await Member.getById(memberId);
            if (!member) {
                return res.status(404).json({ message: 'Member not found' });
            }

            await Member.delete(memberId);
            res.json({ message: 'Member deleted successfully' });
        } catch (error) {
            console.error('Error deleting member:', error);
            res.status(500).json({ message: 'Error deleting member' });
        }
    },

    // Get members expiring soon
    async getExpiringSoon(req, res) {
        try {
            const members = await Member.getExpiringSoon();
            res.json(members);
        } catch (error) {
            console.error('Error getting expiring members:', error);
            res.status(500).json({ message: 'Error getting expiring members' });
        }
    },

    // Verify RFID
    async verifyRFID(req, res) {
        try {
            const { rfidTag } = req.body;
            
            if (!rfidTag) {
                return res.status(400).json({ message: 'RFID tag is required' });
            }

            const member = await Member.getByRFID(rfidTag);
            if (!member) {
                return res.status(404).json({ message: 'Member not found' });
            }

            // Check if membership is expired
            const isExpired = new Date(member.expiration_date) < new Date();

            res.json({
                member,
                isExpired,
                message: isExpired ? 'Membership expired' : 'Membership active'
            });
        } catch (error) {
            console.error('Error verifying RFID:', error);
            res.status(500).json({ message: 'Error verifying RFID' });
        }
    }
};

module.exports = memberController; 