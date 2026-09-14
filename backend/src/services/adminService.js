const pool = require ('../config/db');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');


class AdminService {
    async register(username, password, role = 'admin') {
        const existingUser = await pool.query('SELECT * from users where username = $1',[username]);
        if (existingUser.rows.length > 0 ) {
            throw new Error("User already exist");
        }

        const hashedPass = await bcrypt.hash(password,10);
        console.log('Хеш пароля:', hashedPass);
        const query = `
            INSERT INTO users (username, password_hash, role)
            VALUES ($1,$2,$3) 

            RETURNING id, username, role, created_at
        `;
        const {rows} = await pool.query(query,[username, hashedPass, role]);
        return rows[0];
    }

    async login(username, password) {
        const query = 'SELECT * from users where username = $1';
        const { rows } =  await pool.query(query,[username]);
        if (rows.length === 0) return null;
        const user = rows[0];
        const isValid =  await bcrypt.compare(password, user.password_hash);
        if (!isValid) return null;
        const token = jwt.sign(
            {id: user.id, username: user.username, role: user.role},
            process.env.JWT_SECRET,
            {expiresIn: process.env.JWT_EXPIRES_IN || '7d'}
        );
        return {token, 
                user: {id: user.id, username: user.username, role: user.role, created_at: user.created_at}};


    }

    async findById() {
        const result =  await pool.query(
            `SELECT id, username, email, is_2fa_enabled, otp_secret,
                    otp_code, otp_expires, otp_attempts, backup_codes
             FROM users WHERE id = $1`,
            [id]
            );

        return result.rows[0] || null;
    }
}

module.exports = new AdminService();