const pool = require ('../config/db');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const {
    generateVpnUsername,
    generateVpnPassphrase,
} = require('../utils/generateVpnUserName');


class AdminService {

    
async register(username, password, email) {
    const role = 'user';
    const hashedPass = await bcrypt.hash(password, 10);

    let vpnPassphrase;

    do {
        vpnPassphrase = generateVpnPassphrase();
    } while (vpnPassphrase === password);

    const client = await pool.connect();

    try {
        await client.query('BEGIN');

        const existingUser = await client.query(
            'SELECT id FROM users WHERE username = $1',
            [username]
        );

        if (existingUser.rows.length > 0) {
            throw new Error('User already exist');
        }

        const userResult = await client.query(
            `INSERT INTO users (
                username, password_hash, email, role
             )
             VALUES ($1, $2, $3, $4)
             RETURNING id, username, email, role, created_at`,
            [username, hashedPass, email, role]
        );

        const user = userResult.rows[0];
        let radiusUsername = null;

        for (let attempt = 0; attempt < 30; attempt++) {
            const candidate = generateVpnUsername(username);

            // Не используем имя существующего RADIUS-пользователя.
            const existingRadius = await client.query(
                `SELECT 1
                 FROM radcheck
                 WHERE username = $1
                 LIMIT 1`,
                [candidate]
            );

            if (existingRadius.rows.length > 0) {
                continue;
            }

            // Резервируем имя в таблице приложения.
            // UNIQUE(radius_username) защищает от совпадения
            // между одновременными запросами сайта.
            const accountResult = await client.query(
                `INSERT INTO vpn_accounts (
                    user_id, radius_username
                 )
                 VALUES ($1, $2)
                 ON CONFLICT (radius_username) DO NOTHING
                 RETURNING radius_username`,
                [user.id, candidate]
            );

            if (accountResult.rows.length === 0) {
                continue;
            }

            await client.query(
                `INSERT INTO radcheck (
                    username, attribute, op, value
                 )
                 VALUES ($1, $2, $3, $4)`,
                [
                    candidate,
                    'Cleartext-Password',
                    ':=',
                    vpnPassphrase,
                ]
            );

            radiusUsername = candidate;
            break;
        }

        if (!radiusUsername) {
            throw new Error('Could not allocate VPN username');
        }

        await client.query('COMMIT');

        return {
            ...user,
            vpnUsername: radiusUsername,
        };
    } catch (err) {
        await client.query('ROLLBACK');
        throw err;
    } finally {
        client.release();
    }
}

async login(username, password) {
        const query = 'SELECT * from users where username = $1';
        const { rows } =  await pool.query(query,[username]);
        if (rows.length === 0) return null;
        const user = rows[0];
        const isValid =  await bcrypt.compare(password, user.password_hash);
        if (!isValid) return null;
        const token = jwt.sign(
            {id: user.id, username: user.username, email: user.email, role: user.role},
            process.env.JWT_SECRET,
            {expiresIn: process.env.JWT_EXPIRES_IN || '7d'}
        );
        return {token, 
                user: {id: user.id, username: user.username,email: user.email, role: user.role, created_at: user.created_at}};


    }

    async findById(id) {
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