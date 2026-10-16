const adminService = require ('../services/adminService');

exports.register = async (req, res)=>{
    try {
        const username = req.body?.username?.trim();
        const password = req.body?.password;
        const email = req.body?.email?.trim().toLowerCase();
        //validation 
        if (!username || !password || !email  ) {
             return res.status(400).json({message: 'Username, password and email required ebanii nasos'});
        }

        const newUser = await adminService.register(username,password, email);
        if (!newUser) {
            return res.status(500).json({ error: 'Failed to create user mazafaka' });
        }
        res.status(201).json(newUser);
    } catch (err) {
        res.status(400).json({ error: err.message });
        
    }
}

exports.login = async ( req, res ) => {
    try {
        const username = req.body?.username?.trim();
        const password = req.body?.password;
        const email = req.body?.email?.trim().toLowerCase();
        if (!username || !password) {
           return  res.status(400).json({error: "Username and password is required"});
        }
        
        
        const result = await adminService.login(username, password);
        if (!result) {
           return  res.status(401).json({error: "Invalid credentials"});
        }
  
        return res.json(result);

    } catch (err) {
         // Улучшенное логирование ошибки
        console.error('Login error:', err);
        console.error('Stack trace:', err.stack);
        res.status(500).json({ error : err.message });
    }
}