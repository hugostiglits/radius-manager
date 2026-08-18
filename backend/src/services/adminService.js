const pool = require ('../config/db');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');


class AdminService {
    async register(username, password, role = 'admin') {
        const existingUser = await pool.query('SELECT * from admins where username = $1',[username]);
        if (existingUser.rows.length > 0 ) {
            throw new Error("User already exist");
        }

        const hashedPass = await bcrypt.hash(password,10);
        console.log('Хеш пароля:', hashedPass);
        const query = `
            INSERT INTO admins (username, password_hash, role)
            VALUES ($1,$2,$3) 

            RETURNING id, username, role, created_at
        `;
        const {rows} = await pool.query(query,[username, hashedPass, role]);
        return rows[0];
    }

    async login(username, password) {
        const query = 'SELECT * from admins where username = $1';
        const { rows } =  await pool.query(query,[username]);
        if (rows.length === 0) return null;
        const admin = rows[0];
        const isValid = bcrypt.compare(password, admin.password_hash);
        if (!isValid) return null;
        const token = jwt.sign(
            {id: admin.id, username: admin.username, role: admin.role},
            process.env.JWT_SECRET,
            {expiresIn: process.env.JWT_EXPIRES_IN || '7d'}
        );
        return {token, 
                admin: {id: admin.id, username: admin.username, role: admin.role, created_at: admin.created_at}};


    }
}

module.exports = new AdminService();