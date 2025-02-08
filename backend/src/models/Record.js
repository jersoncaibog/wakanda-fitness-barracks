const pool = require('../config/db');

class Record {
    static async getAll() {
        try {
            const conn = await pool.getConnection();
            const rows = await conn.query(`
                SELECT r.*, m.name as member_name, m.rfid_tag 
                FROM records r 
                JOIN members m ON r.member_id = m.id 
                ORDER BY r.attendance_date DESC
            `);
            conn.release();
            return rows;
        } catch (error) {
            throw error;
        }
    }

    static async getById(id) {
        try {
            const conn = await pool.getConnection();
            const rows = await conn.query(`
                SELECT r.*, m.name as member_name, m.rfid_tag 
                FROM records r 
                JOIN members m ON r.member_id = m.id 
                WHERE r.id = ?
            `, [id]);
            conn.release();
            return rows[0];
        } catch (error) {
            throw error;
        }
    }

    static async create(recordData) {
        try {
            const conn = await pool.getConnection();
            const result = await conn.query(
                'INSERT INTO records (member_id, attendance_date) VALUES (?, ?)',
                [Number(recordData.memberId), recordData.attendanceDate || new Date()]
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

    static async delete(id) {
        try {
            const conn = await pool.getConnection();
            const result = await conn.query('DELETE FROM records WHERE id = ?', [id]);
            conn.release();
            return result;
        } catch (error) {
            throw error;
        }
    }

    static async getByDateRange(startDate, endDate) {
        try {
            const conn = await pool.getConnection();
            const rows = await conn.query(`
                SELECT r.*, m.name as member_name, m.rfid_tag 
                FROM records r 
                JOIN members m ON r.member_id = m.id 
                WHERE r.attendance_date BETWEEN ? AND ?
                ORDER BY r.attendance_date DESC
            `, [startDate, endDate]);
            conn.release();
            return rows;
        } catch (error) {
            throw error;
        }
    }

    static async getByMember(memberId) {
        try {
            const conn = await pool.getConnection();
            const rows = await conn.query(`
                SELECT r.*, m.name as member_name, m.rfid_tag 
                FROM records r 
                JOIN members m ON r.member_id = m.id 
                WHERE r.member_id = ?
                ORDER BY r.attendance_date DESC
            `, [memberId]);
            conn.release();
            return rows;
        } catch (error) {
            throw error;
        }
    }

    static async getTodayCount() {
        try {
            const conn = await pool.getConnection();
            const rows = await conn.query(`
                SELECT COUNT(*) as count 
                FROM records 
                WHERE DATE(attendance_date) = CURDATE()
            `);
            conn.release();
            return rows[0].count;
        } catch (error) {
            throw error;
        }
    }

    static async getRecentActivity(limit = 5) {
        try {
            const conn = await pool.getConnection();
            const rows = await conn.query(`
                SELECT r.*, m.name as member_name, m.rfid_tag 
                FROM records r 
                JOIN members m ON r.member_id = m.id 
                ORDER BY r.attendance_date DESC 
                LIMIT ?
            `, [limit]);
            conn.release();
            return rows;
        } catch (error) {
            throw error;
        }
    }
}

module.exports = Record; 