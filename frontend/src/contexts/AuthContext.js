import React, {createContext, useState, useContext, useEffect, Children} from 'react';
import api from '../api/axiosConfig';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect( () =>{
        const token = localStorage.getItem('token');
        const savedUser = localStorage.getItem('user');

        if (token && savedUser) {
          setUser(JSON.parse(savedUser));  
        }
        setLoading(false);
    },[]);

    //вход
    const login = async (username, password) =>{
        console.log('AuthContext login called', username, password);
        const res = await api.post('/auth/login',{username, password});
        const {token, user} = res.data;
        localStorage.setItem('token',token);
        localStorage.setItem('user',JSON.stringify(user));
        setUser(user);
        return user;
    };
    //регистрация
    const register = async (username, password) => {
        const res = await api.post('/auth/register', {username, password});
        return res.data;
    }
    //выход 
    const logout = () => {
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        setUser(null);
    } 

    const value =  { user, loading, login, register, logout };

    return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>

    
};

export const useAuth = () => useContext(AuthContext);