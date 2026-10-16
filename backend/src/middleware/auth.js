const jwt = require('jsonwebtoken');

module.exports = (req, res, next) => {
    const authHeader = req.headers.authorization;
    const parts = authHeader?.split(' ');

    if (
        !parts ||
        parts.length !== 2 ||
        parts[0] !== 'Bearer' ||
        !parts[1]
    ) {
        return res.status(401).json({
            error: 'Требуется авторизация',
        });
    }

    try {
        const decoded = jwt.verify(
            parts[1],
            process.env.JWT_SECRET,
            { algorithms: ['HS256'] }
        );

        if (!Number.isSafeInteger(decoded.id) || decoded.id <= 0) {
            return res.status(401).json({
                error: 'Недействительный токен',
            });
        }

        req.user = decoded;
        return next();
    } catch {
        return res.status(401).json({
            error: 'Токен недействителен или истёк',
        });
    }
};