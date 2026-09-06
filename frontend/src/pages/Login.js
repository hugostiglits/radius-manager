import React, {useState} from 'react';
import { useNavigate } from 'react-router-dom';

import { Container, TextField, Button, Typography, Box, Alert } from '@mui/material';
import { useAuth } from '../contexts/AuthContext';

const Login = () => {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');

    const { login } = useAuth();
    const navigate = useNavigate();

    const handleSubmit = async (e) =>{
        e.preventDefault();
        setError('');

        try {
            console.log('Calling LOGIN  with', username, password);
            await login(username, password);
            navigate('/');
        } catch (err) {
            setError(err.response?.data?.error  || 'Ошибка входа')
        }
    };

    return(
        <Container maxWidth="xs">
         <Box sx={{ mt: 8, display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
            <Typography variant='h5'>Вход в панель администратора</Typography>
            {error && <Alert severity="error" sx={{ width: '100%', mt: 2 }}>{error}</Alert>}
            <Box component="form" onSubmit={handleSubmit} sx={{mt:1}}>
                <TextField
                    margin="normal"
                    required
                    fullWidth
                    label="Имя пользователя"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                />
                <TextField
                    margin="normal"
                    required
                    fullWidth
                    label="Пароль"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                />
                <Button type='submit' fullWidth variant='contained' sx={{mt: 3, mb: 2}}>
                    Войти
                </Button>
            </Box>

         </Box>
        </Container>
    )





}




export default Login;