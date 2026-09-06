import React, {createContext, useState, useContext, useEffect, Children} from 'react';
import api from '../api/axiosConfig';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
    const [admin, setAdmin] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect( () =>{
        const token = localStorage.getItem('token');
        const savedAdmin = localStorage.getItem('admin');

        if (token && savedAdmin) {
          setAdmin(JSON.parse(savedAdmin));  
        }
        setLoading(false);
    },[]);

    //вход
    const login = async (username, password) =>{
        console.log('AuthContext login called', username, password);
        const res = await api.post('/auth/login',{username, password});
        const {token, admin} = res.data;
        localStorage.setItem('token',token);
        localStorage.setItem('admin',JSON.stringify(admin));
        setAdmin(admin);
        return admin;
    };
    //регистрация
    const register = async (username, password) => {
        const res = await api.post('/auth/register', {username, password});
        return res.data;
    }
    //выход
    const logout = () => {
        localStorage.removeItem('token');
        localStorage.removeItem('admin');
        setAdmin(null);
    } 

    const value =  { admin, loading, login, register, logout };

    return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>

    
};

export const useAuth = () => useContext(AuthContext);