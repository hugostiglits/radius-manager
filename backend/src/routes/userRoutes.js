const express = require('express');

const authMiddleWare = require('../middleware/auth');

const {
    getUsers,
    getUser,
    createUser,
    updatePassword,
    deleteUser
} = require('../controllers/userController');


const router = express.Router();

//Ве маршруты защищены JWT
router.use(authMiddleWare);

router.get('/', getUsers);
router.get('/:username', getUser);
router.post('/',createUser);
router.put('/:username/password', updatePassword);
router.delete('/:username', deleteUser);

module.exports = router;


