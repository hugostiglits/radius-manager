import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { ThemeProvider, CssBaseline, createTheme } from '@mui/material';
import { cyberpunkTheme } from './theme';


import { AuthProvider } from './contexts/AuthContext';
import ProtectedRoute from './components/ProtectedRoute';


import TestIpInfo from './TestIpInfo';



//Pagez
import Login from './pages/Login';
import Register from './pages/Register';
import Dashboard from './pages/Dashboard';
import LandingPage from './pages/LandingPage';
import AccountPage from './pages/AccountPage';
import VpnAccounts from './components/accounts/VpnAccounts';

// Тёмная тема для Material-UI
const darkTheme = createTheme({
  palette: {
    mode: 'dark',
    primary: {
      main: '#3b82f6',
    },
    secondary: {
      main: '#8b5cf6',
    },
    background: {
      default: '#0a0a0f',
      paper: '#0f172a',
    },
  },
});

console.log('API URL:', process.env.REACT_APP_API_URL);





function App() {
  return (

    <ThemeProvider theme={cyberpunkTheme}>

      <CssBaseline />
       {/* <TestIpInfo/> */}
      <AuthProvider>
        <BrowserRouter>
            <Routes>
              {/* Страница по умолчанию */}
              <Route path="/" element={<Login />} />
              {/* Сохраняем отдельный адрес входа */}
              <Route path="/login" element={<Login />} />
              <Route path="/register" element={<Register />} />
              {/* Основная страница сайта */}
              <Route path="/home" element={<LandingPage />} />
              {/* Личный кабинет пользователя */}
              <Route path="/account"
                     element={
                          <ProtectedRoute>
                            <AccountPage/>
                          </ProtectedRoute>
                    }
              />


              {/* Административная панель */}
              <Route
                path="/dashboard"
                element={
                  <ProtectedRoute requiredRole="admin">
                    <Dashboard />
                  </ProtectedRoute>
                }
              />
              <Route path="*" element={<Navigate to="/" replace />} />
            </Routes>
        </BrowserRouter>
      </AuthProvider>
    </ThemeProvider>
  );
}

export default App;