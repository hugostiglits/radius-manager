import React from 'react';
import { Navigate } from 'react-router-dom';
import { Box, CircularProgress, Container, Typography } from '@mui/material';

import { useAuth } from '../contexts/AuthContext';
import VpnAccounts from '../components/accounts/VpnAccounts';


const AccountPage = () => {
    const {user, loading} = useAuth();

    if (loading) {
        return (
            <Box sx={{ display : 'flex', justifyContent : 'center' , py: 6 }} >
                <CircularProgress aria-label='Проверяем вход...' ></CircularProgress>
            </Box>
        );
    }

    if (!user) {
        return (
            <Navigate to="/login" replace></Navigate>
        );
    }


    return (
        <Box component="main" sx={{minHeight: '100vh', py: 4}}  >
            <Typography component="h1" variant="h4" sx={{ textAlign: 'center', px: 2 }} >
                Личный кабинет
            </Typography>
            <VpnAccounts/>
        </Box>
    );


}

export default AccountPage;