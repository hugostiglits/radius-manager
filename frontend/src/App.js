import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { ThemeProvider, createTheme } from '@mui/material';
import { AuthProvider } from './contexts/AuthContext';
import ProtectedRoute from './components/ProtectedRoute';


//Pagez
import Login from './pages/Login';
import Register from './pages/Register';
import Dashboard from './pages/Dashboard';
import mainPage from './pages/MainPage";

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
    <ThemeProvider theme={darkTheme}>
      <AuthProvider>
        <BrowserRouter>
          <Routes>
              {/* Публичные маршруты */}
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />

             {/* Защищённые маршруты */}
            <Route path="/" element={
              <ProtectedRoute>
                <Dashboard />
              </ProtectedRoute>
            } />
              {/* Редирект */}
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </BrowserRouter>
      </AuthProvider>
    </ThemeProvider>
  );
}

export default App;