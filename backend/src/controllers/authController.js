const adminService = require ('../services/adminService');

exports.register = async (req, res)=>{
    try {
        const {username, password} = req.body;
        //validation 

        const newAdmin = await adminService.register(username,password);
        if (!newAdmin) {
            return res.status(500).json({ error: 'Failed to create admin' });
        }
        res.status(201).json(newAdmin);
    } catch (err) {
        res.status(400).json({ error: err.message });
        
    }
}

exports.login = async ( req, res ) => {
    try {
        const {username, password} = req.body;
        if (!username || !password) {
            res.status(400).json({error: "Username and password is required"});
        }
        // Добавьте логирование
        console.log('Attempting login for admin:', username);
        const result = await adminService.login(username, password);
        if (!result) {
            res.status(401).json({error: "Invalid credentials"});
        }
  
        res.json(result);

    } catch (err) {
         // Улучшенное логирование ошибки
        console.error('Login error:', err);
        console.error('Stack trace:', err.stack);
        res.status(500).json({ error : err.message });
    }
}