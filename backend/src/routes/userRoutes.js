const express = require('express');

const authMiddleWare = require('../middleware/auth');
const requiredRole = require('../middleware/requireRole');


const {
    getUsers,
    getUser,
    createUser,
    updatePassword,
    deleteUser,
    updateGroup,
} = require('../controllers/userController');



const router = express.Router();
router.use((req, res, next)=>{
    console.log('[users] маршрут достигнут');
    next();
}); 


//Ве маршруты защищены JWT
router.use(authMiddleWare);



router.use(requiredRole('admin'));


router.use((req, res, next) => {
    console.log('[users] проверка доступа пройдена');
    next();
});

router.get('/', getUsers);
router.get('/:username', getUser);
router.post('/',createUser);
router.put('/:username/group', updateGroup);
router.put('/:username/password', updatePassword);
router.delete('/:username', deleteUser);

module.exports = router;


