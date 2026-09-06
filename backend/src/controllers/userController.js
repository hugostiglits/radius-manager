const radiusService = require('../services/radiusService');

exports.getUsers = async (req, res)=> {
    try{
        const { limit = 10, offset = 0 } = req.query;
        const users = await radiusService.getUsers(parseInt(limit), parseInt(offset));
        res.json(users);

    } catch (error) {
        res.status(500).json({err : error.message});
    }

}

exports.getUser = async (req, res) => {
    try {
    const { username }  = req.params;
    const user = await radiusService.getUser(username);
    if (!user) return res.status(404).json({error: 'User not found'});
    res.json(user);
    } catch (err) {
        res.status(500).json({err : err.message});
    }
}

exports.createUser = async (req, res) =>{
    try {
        const { username, password, group } = req.body;
        if (!username || !password) {
            return res.status(400).json({error: "Username and password are required"});
        }
        const newUser = await radiusService.createUser(username, password, group);
        res.status(201).json(newUser);
    } catch (err) {
        res.status(400).json({error: err.message});
    }
}

exports.updatePassword = async (req, res) =>{
    try {
        const { username } = req.params;
        const { password } = req.body ;
        if (!password) {
            return res.status(400).json({error: "New password is required"});
        }
        const updated = await radiusService.updatePassword(username,password);
        if (!updated) {
            return res.status(404).json({error: "User not found or attribute missing"});
        }
        res.json({message : "Password Updated"});

    } catch (err) {
        res.status(400).json({error: err.message});
    }

}

exports.deleteUser = async (req, res) => {
    try {
        const { username }  = req.params;

        if (!username || username.trim === '') {
            return res.status(400).json({message: "Нужно здесь быть пользователя имени"});
        }
        const result = await radiusService.deleteUser(username);
          if (!result.success) {
            return res.status(400).json({
                success: false,
                error: result.message
            });
        }
        res.json({
            success: true,
            message: result.message,
            data: {
                username: result.username,
                deletedCount: result.deletedCount
            }
        });

    } catch (err) {
        console.error('Ошибка в deleteUser:', err);
        res.status(400).json({error : err.message});

    }
    


}