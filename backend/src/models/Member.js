const pool = require('../config/db');

class Member {
    static async getAll() {
        try {
            const conn = await pool.getConnection();
            const rows = await conn.query('SELECT * FROM members');
            conn.release();
            return rows.map(row => ({
                ...row,
                id: Number(row.id)
            }));
        } catch (error) {
            throw error;
        }
    }

    static async getById(id) {
        try {
            const conn = await pool.getConnection();
            const rows = await conn.query('SELECT * FROM members WHERE id = ?', [id]);
            conn.release();
            const member = rows[0];
            return member ? {
                ...member,
                id: Number(member.id)
            } : null;
        } catch (error) {
            throw error;
        }
    }

    static async create(memberData) {
        try {
            const conn = await pool.getConnection();
            const result = await conn.query(
                'INSERT INTO members (name, rfid_tag, membership_status, expiration_date) VALUES (?, ?, ?, ?)',
                [memberData.name, memberData.rfidTag, memberData.membershipStatus, memberData.expirationDate]
            );
            conn.release();
            return {
                ...result,
                insertId: Number(result.insertId)
            };
        } catch (error) {
            throw error;
        }
    }

    static async update(id, memberData) {
        try {
            const conn = await pool.getConnection();
            const result = await conn.query(
                'UPDATE members SET name = ?, rfid_tag = ?, membership_status = ?, expiration_date = ? WHERE id = ?',
                [memberData.name, memberData.rfidTag, memberData.membershipStatus, memberData.expirationDate, id]
            );
            conn.release();
            return {
                ...result,
                affectedRows: Number(result.affectedRows)
            };
        } catch (error) {
            throw error;
        }
    }

    static async delete(id) {
        try {
            const conn = await pool.getConnection();
            const result = await conn.query('DELETE FROM members WHERE id = ?', [id]);
            conn.release();
            return {
                ...result,
                affectedRows: Number(result.affectedRows)
            };
        } catch (error) {
            throw error;
        }
    }

    static async getByRFID(rfidTag) {
        try {
            const conn = await pool.getConnection();
            const rows = await conn.query('SELECT * FROM members WHERE rfid_tag = ?', [rfidTag]);
            conn.release();
            const member = rows[0];
            return member ? {
                ...member,
                id: Number(member.id)
            } : null;
        } catch (error) {
            throw error;
        }
    }

    static async getExpiringSoon() {
        try {
            const conn = await pool.getConnection();
            const rows = await conn.query(
                'SELECT * FROM members WHERE expiration_date BETWEEN CURDATE() AND DATE_ADD(CURDATE(), INTERVAL 7 DAY)'
            );
            conn.release();
            return rows.map(row => ({
                ...row,
                id: Number(row.id)
            }));
        } catch (error) {
            throw error;
        }
    }
}

module.exports = Member; 