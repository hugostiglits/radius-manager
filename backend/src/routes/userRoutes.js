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
router.get('usernmae', getUser);
router.post('/',createUser);
router.put('/:username/passwrod', updatePassword);
router.delete('/:username', deleteUser);

module.exports = router;


