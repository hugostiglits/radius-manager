const express = require("express");
const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');






const authMiddleware = require('./middleware/auth');

const pool = require ('./config/db');

require('dotenv').config();

const app = express();

//Подключаем миддлеваре 

app.use(helmet());
app.use(cors());
app.use(morgan('common'));
app.use(express.json());  // Позволяю принимать ДЖэсон в теле завроса 


//тестовая поебень
app.get('/api/health',(req,res)=>{
    res.json({
        status : 'OK',
        time : new Date(),
    });
});

app.get('/api/db-test', async (req,res)=>{
    try {
        const result = await pool.query('SELECT NOW() at time zone \'europe/moscow\' as current_time');
        res.json({success: true, current_time: result.rows[0].current_time});
    } catch (error) {
        console.error('Database connection error:', error);
        res.status(500).json({success: false, message: error.message});
    }
});


app.get('/api/protected',authMiddleware,(req, res)=>{
    return res.json({message: 'You are authenticated', admin: req.admin});
});
//конец тестовой поебеньи


//Возня рабочая 
const authRoutes = require('./routes/authRoutes');
app.use('/api/auth',authRoutes);

const userRoutes = require('./routes/userRoutes');
app.use('/api/users',userRoutes);





const PORT  = process.env.PORT || '8000';

app.listen(PORT,()=>{
    console.log(`Server running on port ${PORT}`);
});
