import React, { useEffect, useState, useRef} from 'react';
import {
    Alert,
    Box,
    Button,
    CircularProgress,
    Container,
    Typography,
} from '@mui/material' ;

import api from '../../api/axiosConfig';

import { useAuth } from '../../contexts/AuthContext';

const amber = '#e7ae55';

const VpnAccountsContent = () => {
    const [ accounts, setAccounts ] = useState([]);
    const [ loading, setLoading ] = useState(true);
    const [ error, setError] = useState('');
    const [ pendingId , setPendingId ] = useState(null);
    const [ visiblePassword, setVisiblePassword ] = useState(null);


    const passwordRequest = useRef(null);


    useEffect(()=>{
        const controller = new AbortController();

        const loadAccounts = async () => {
            try {
                const { data } = await api.get(
                    '/profile/vpn-accounts',
                    { signal: controller.signal }
                );
                if (!controller.signal.aborted) {
                    if (!Array.isArray(data?.accounts)) {
                        throw new Error(" Server vernul not correct list of users ");
                    }
                    setAccounts(data.accounts);
                }
            } catch (err) {
                if (!controller.signal.aborted) {
                    setError(
                        err.response?.data?.error ||
                        'Не удалось загрузить VPN-аккаунты'
                    );
                }
            } finally {
                if (!controller.signal.aborted) {
                    setLoading(false);
                }
            }

        };

        loadAccounts();

        return () => {
            controller.abort();
            passwordRequest.current?.abort();
        };



    },[]);

    const togglePassword = async (accountId) => {
        if ( pendingId !==null ) return ;

        if (visiblePassword?.accountId === accountId) {
            setVisiblePassword(null);
            return;
        }

        const controller = new AbortController();
        passwordRequest.current = controller;

        setError('');
        setVisiblePassword(null);
        setPendingId(accountId);

        try {
            const { data } = await api.get(`/profile/vpn-accounts/${accountId}/password`,{ signal: controller.signal });
            if (!controller.signal.aborted) {
                setVisiblePassword({accountId, password: data.password, });
            }

        } catch (err) {
            if (!controller.signal.aborted) {
                setError(err.response?.data?.error || "Не удалось получить пароль ВПН пользователя");
            }

        } finally {
             if (!controller.signal.aborted) {
                setPendingId(null);
            }
            if (passwordRequest.current === controller) {
                passwordRequest.current = null;
            }

        }





    };

    return(<Container maxWidth="md" sx={{ py: 4 }} >
                    <Box
                        component="section"
                        aria-labelledby="vpn-accounts-title"
                        sx={{
                            p: { xs: 3, sm: 4 },
                            borderRadius: 3,
                            bgcolor: '#111214',
                            border: '1px solid rgba(231,174,85,0.3)',
                            boxShadow: '0 0 25px rgba(231,174,85,0.05)',
                        }}
                    >
                        <Typography
                            id="vpn-accounts-title"
                            component="h2"
                            variant='h5'
                              sx={{
                                 color: amber,
                                 fontFamily: 'monospace',
                                 mb: 1,
                                 }}
                        >
                            ВПН аккаунты
                        </Typography>
                         <Typography sx={{ color: '#b9a17c', mb: 3 }}>
                                 Данные ВПН клиента
                         </Typography>

                         { loading && (
                            <Box sx={{ display: 'flex', justifyContent: 'center', py: 3 }} role= "status">
                                <CircularProgress aria-label='Загрузка учетных записей ВПН'/>
                            </Box>
                         ) }

                         { error && (
                            <Alert severity='error' sx={{ mb: 2}} >
                                { error }
                            </Alert>
                         ) }

                         { !loading && accounts.length === 0 && !error &&   (
                            <Alert severity='info'>
                                Нет учетных записей привязанных к Вашему аккаунту
                            </Alert>
                        )}

                        { !loading && accounts.map( (account) => (
                            <Box key={ account.id }
                                    sx={{
                                        p: 2,
                                        mb: 2,
                                        border: '1px solid rgba(231,174,85,0.3)',
                                        borderRadius: 2,
                                    }}
                            >

                                <Typography sx={{ color: '#b9a17c', mb: 0.5 }} >
                                    VPN - пользователь
                                </Typography>
                                <Typography sx={{
                                                    color: amber,
                                                    fontFamily: 'monospace',
                                                    overflowWrap: 'anywhere',
                                                }}  >

                                    { account.vpnUsername }
                                </Typography>
                            </Box>
                        ))}
                    </Box>

    </Container>);

}

const VpnAccounts = () => {
    const { user, loading } = useAuth();
    if (loading) {
        return <CircularProgress/>;
    }

    if (!user) {
        return <Alert severity='info'>
            Войдите в аккаунт для просмотра учетных записей VPN
        </Alert>
    }

    return <VpnAccountsContent key={user.id}></VpnAccountsContent>


}

export default VpnAccounts;