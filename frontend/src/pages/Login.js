import React, { useState } from 'react';
import {
    Navigate,
    Link as RouterLink,
    useNavigate,
} from 'react-router-dom';
import {
    Container,
    TextField,
    Button,
    Typography,
    Box,
    Alert,
    Link,
} from '@mui/material';

import { useAuth } from '../contexts/AuthContext';

const amber = '#e7ae55';

const fieldStyles = {
    '& .MuiInputLabel-root': {
        color: '#b9a17c',
    },
    '& .MuiInputLabel-root.Mui-focused': {
        color: amber,
    },
    '& .MuiOutlinedInput-root': {
        color: '#f3e4cd',
        backgroundColor: 'rgba(0, 0, 0, 0.25)',
        '& fieldset': {
            borderColor: 'rgba(231, 174, 85, 0.3)',
        },
        '&:hover fieldset': {
            borderColor: 'rgba(231, 174, 85, 0.65)',
        },
        '&.Mui-focused fieldset': {
            borderColor: amber,
        },
    },
};

const Login = () => {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [submitting, setSubmitting] = useState(false);

    const { login, user, loading } = useAuth();
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (submitting) return;

        const cleanUsername = username.trim();

        if (!cleanUsername || !password) {
            setError('Введите имя пользователя и пароль');
            return;
        }

        setError('');
        setSubmitting(true);

        try {
            await login(cleanUsername, password);
            navigate('/home', { replace: true });
        } catch (err) {
            setError(
                err.response?.data?.error || 'Не удалось войти'
            );
        } finally {
            setSubmitting(false);
        }
    };

    if (loading) {
        return (
            <Box
                sx={{
                    minHeight: '100vh',
                    display: 'grid',
                    placeItems: 'center',
                    backgroundColor: '#0b0c0e',
                    color: amber,
                    fontFamily: 'monospace',
                }}
            >
                Загрузка…
            </Box>
        );
    }

    if (user) {
        return <Navigate to="/home" replace />;
    }

    return (
        <Box
            component="main"
            sx={{
                minHeight: '100vh',
                display: 'flex',
                alignItems: 'center',
                py: 5,
                backgroundColor: '#0b0c0e',
                backgroundImage:
                    'radial-gradient(ellipse at center, rgba(231,174,85,0.08), transparent 65%)',
            }}
        >
            <Container maxWidth="xs">
                <Box
                    sx={{
                        position: 'relative',
                        overflow: 'hidden',
                        p: { xs: 3, sm: 4 },
                        borderRadius: 3,
                        border: '1px solid rgba(231,174,85,0.35)',
                        backgroundColor: '#111214',
                        boxShadow:
                            '0 0 35px rgba(231,174,85,0.08), inset 0 0 45px rgba(0,0,0,0.4)',

                        // Статичные полосы развёртки.
                        '&::after': {
                            content: '""',
                            position: 'absolute',
                            inset: 0,
                            pointerEvents: 'none',
                            zIndex: 1,
                            backgroundImage:
                                'repeating-linear-gradient(0deg, transparent 0px, transparent 3px, rgba(0,0,0,0.08) 3px, rgba(0,0,0,0.08) 4px)',
                        },
                    }}
                >
                    <Typography
                        sx={{
                            mb: 2,
                            color: '#b9a17c',
                            fontFamily: 'monospace',
                            fontSize: 12,
                            letterSpacing: 2,
                        }}
                    >
                     CLIENT ACCESS
                    </Typography>

                    <Typography
                        component="h1"
                        variant="h5"
                        sx={{
                            color: amber,
                            fontFamily: 'monospace',
                            textShadow: '0 0 12px rgba(231,174,85,0.3)',
                        }}
                    >
                        Вход в систему
                    </Typography>



                    {error && (
                        <Alert severity="error" sx={{ mb: 2 }}>
                            {error}
                        </Alert>
                    )}

                    <Box component="form" onSubmit={handleSubmit}>
                        <TextField
                            fullWidth
                            required
                            margin="normal"
                            label="Имя пользователя"
                            name="username"
                            autoComplete="username"
                            value={username}
                            disabled={submitting}
                            onChange={(e) => setUsername(e.target.value)}
                            sx={fieldStyles}
                        />

                        <TextField
                            fullWidth
                            required
                            margin="normal"
                            label="Пароль"
                            name="password"
                            type="password"
                            autoComplete="current-password"
                            value={password}
                            disabled={submitting}
                            onChange={(e) => setPassword(e.target.value)}
                            sx={fieldStyles}
                        />

                        <Button
                            type="submit"
                            fullWidth
                            variant="contained"
                            disabled={submitting}
                            sx={{
                                mt: 3,
                                py: 1.4,
                                backgroundColor: amber,
                                color: '#111214',
                                fontFamily: 'monospace',
                                fontWeight: 700,
                                '&:hover': {
                                    backgroundColor: '#f2be6b',
                                },
                            }}
                        >
                            {submitting ? 'Входим…' : 'Войти'}
                        </Button>
                    </Box>

                    <Typography
                        sx={{
                            mt: 3,
                            textAlign: 'center',
                            color: '#b9a17c',
                            fontSize: 14,
                        }}
                    >
                        Нет аккаунта?{' '}
                        <Link
                            component={RouterLink}
                            to="/register"
                            sx={{ color: amber }}
                        >
                            Регистрация
                        </Link>
                    </Typography>
                </Box>
            </Container>
        </Box>
    );
};

export default Login;