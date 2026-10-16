const express = require('express');
const auth = require('../middleware/auth');
const profileController = require('../controllers/profileController');

const router = express.Router();

// Не разрешаем кешировать ответы с личными данными.
router.use((req, res, next) => {
    res.set('Cache-Control', 'no-store');
    next();
});

// Защищаем все маршруты этого роутера.
router.use(auth);

router.get(
    '/vpn-accounts',
    profileController.listVpnAccounts
);

router.get(
    '/vpn-accounts/:accountId/password',
    profileController.getVpnPassword
);

module.exports = router;