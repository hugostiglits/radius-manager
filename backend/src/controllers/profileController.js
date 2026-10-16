const pool = require('../config/db');

exports.listVpnAccounts = async (req, res) => {
    try {
        const { rows } = await pool.query(
            `SELECT
                id,
                radius_username AS "vpnUsername",
                created_at AS "createdAt"
             FROM vpn_accounts
             WHERE user_id = $1
             ORDER BY created_at, id`,
            [req.user.id]
        );

        return res.json({ accounts: rows });
    } catch (err) {
        console.error('VPN accounts lookup failed:', err.code);

        return res.status(500).json({
            error: 'Не удалось получить VPN-аккаунты',
        });
    }
};

exports.getVpnPassword = async (req, res) => {
    const rawId = req.params.accountId;
    const accountId = Number(rawId);

    if (
        !/^[1-9]\d*$/.test(rawId) ||
        !Number.isSafeInteger(accountId)
    ) {
        return res.status(400).json({
            error: 'Некорректный ID VPN-аккаунта',
        });
    }

    try {
        const { rows } = await pool.query(
            `SELECT r.value AS password
             FROM vpn_accounts v
             JOIN radcheck r
                ON r.username = v.radius_username
                AND r.attribute = 'Cleartext-Password'
             WHERE v.id = $1
               AND v.user_id = $2
             LIMIT 1`,
            [accountId, req.user.id]
        );

        if (rows.length === 0) {
            return res.status(404).json({
                error: 'VPN-аккаунт не найден',
            });
        }

        return res.json({ password: rows[0].password });
    } catch (err) {
        console.error('VPN password lookup failed:', err.code);

        return res.status(500).json({
            error: 'Не удалось получить VPN-пароль',
        });
    }
};