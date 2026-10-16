import React, {useState, useEffect} from 'react';
import { useNavigate } from 'react-router-dom';
import { Container, Typography, Table, TableBody, TableCell, TableContainer,
  TableHead, TableRow, Paper, Button, Dialog, DialogActions,
  DialogContent, DialogTitle, IconButton, Alert, Box, CircularProgress, TextField} from '@mui/material';

import {Add, Delete, Edit } from '@mui/icons-material';

import api from '../api/axiosConfig';

import { useAuth } from '../contexts/AuthContext';

const Dashboard = () => {
    const [users, setUsers] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [openDialog, setOpenDialog] = useState(false);
    const [editingUser, setEditingUser] = useState(null);
    const [formData, setFormData] = useState({username: '', password: '', group: ''});
    const {logout} = useAuth();
    const [visiblePassword, setVisiblePassword] = useState(null);


    const fetchUsers = async () => {
        setLoading(true);
        try {
            const res = await api.get('/users');
            setUsers(res.data);
            setError('');

        } catch (err) {
            setError(err.response?.data?.error || 'Ошибка при получении пользователей');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchUsers();
    }, []);
    
    const handleOpenDialog = (user = null) => {
        if (user) {
            setEditingUser(user);
            setFormData({username: user.username, password: '', group: user.groups || ''});
        } else {
            setEditingUser(null);
            setFormData({ username: '', password: '', group: '' });
        }
        setOpenDialog(true);

    };

    const handleCloseDialog = () => {
        setOpenDialog(false);
        setEditingUser(null);
        setFormData({ username: '', password: '', group: '' });

    };

    //создание или обновление 
    const handleSubmit = async () => {
          if (!editingUser && !formData.username.trim()) {
              setError('Имя пользователя обязательно');
              return;
          }
    
          if (!editingUser && !formData.password) {
              setError('Пароль обязателен для нового пользователя');
              return;
          }

          if (editingUser && formData.password && formData.password.length < 6) {
              setError('Пароль должен содержать минимум 6 символов');
              return;
          }

              
              setError('');

        try {
            if (editingUser) {
              const newGroup = formData.group.trim();
              const oldGroup = (editingUser.groups || '').trim();
              if (newGroup !== oldGroup) {
                  if (!newGroup) {
                    setError('Группа не может быть пустой');
                    return;
                }
    await api.put(
        `/users/${encodeURIComponent(editingUser.username)}/group`,
        { group: newGroup }
    );
}
              //режим редактирования 
                if (formData.password) {
                    await api.put(`/users/${editingUser.username}/password`, { password: formData.password });
                }

            } else {
              //Режим создания 
                const payload = {
                      username: formData.username.trim(), // обрезаем пробелы
                      password: formData.password,
                      group: formData.group || null   // если группа не указана — null
                };

              await api.post('/users', payload);

            }
            await fetchUsers();
            handleCloseDialog();


        } catch(err) {
          console.error('Ебливая ошибка при подстверждении запроса',err);
          let errorMessage = err.response?.data?.error || 'операция не удалась, при подтверждении в рот его ебать';
            
          setError(err.response?.data?.error || 'операция не удалась');
        }

    };

    const handleDelete = async (username) => {
       if (window.confirm(`Удалить пользователя ${username}?`)) {
            try {
                await api.delete(`/users/${username}`);
                fetchUsers();
            } catch (err) {
                setError(err.response?.data?.error || 'Не удалось удалить');
            }
        }
    };


    const togglePassword = async  (username) => {
        if (visiblePassword?.username === username) {
          setVisiblePassword(null);
          return;
        }
        try {
          setVisiblePassword(null);
          const response = await api.get(`/users/${encodeURIComponent(username)}`);

          setVisiblePassword({ username, password: response.data.password } );
        } catch (err) {
          setError(err.response?.data?.error || 'Не удалось получить пароль');
        }

    };

    return (
            <Container>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', mt: 4, mb: 2 }}>
                <Typography variant="h4">Пользователи RADIUS</Typography>
                <Box>
                  <Button variant="outlined" color="secondary" onClick={logout} sx={{ mr: 2 }}>
                    Выйти
                  </Button>
                  <Button variant="contained" startIcon={<Add />} onClick={() => handleOpenDialog()}>
                    Добавить
                  </Button>
                </Box>
              </Box>
      {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}
      {loading ? (
        <CircularProgress />
      ) : (
        <TableContainer component={Paper}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>Имя пользователя</TableCell>
                <TableCell>Пароль (скрыт)</TableCell>
                <TableCell>Группы</TableCell>
                <TableCell align="right">Действия</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {users.map((user) => (
                <TableRow key={user.username}>
                  <TableCell> {user.username}</TableCell>
                  
                  <TableCell>
                    { visiblePassword?.username === user.username ? visiblePassword.password : 'xxxxxx'}
                    <Button
                      size='small'
                      onClick={() => togglePassword(user.username)}
                    >
                      {visiblePassword?.username === user.username ? 'скрыть' : 'показать'}
                    </Button>




                  </TableCell>
                  <TableCell>{user.groups || '-'}</TableCell>
                  <TableCell align="right">
                    <IconButton color="primary" onClick={() => handleOpenDialog(user)}>
                      <Edit />
                    </IconButton>
                    <IconButton color="error" onClick={() =>   handleDelete(user.username)}>
                      <Delete />
                    </IconButton>
                  </TableCell>
                </TableRow>
              ))}
              {users.length === 0 && (
                <TableRow>
                  <TableCell colSpan={4} align="center">Пользователи не найдены</TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </TableContainer>
      )}

      <Dialog open={openDialog} onClose={handleCloseDialog} aria-modal="true">
        <DialogTitle>{editingUser ? 'Редактировать пользователя' : 'Новый пользователь'}</DialogTitle>
        <DialogContent>
          <TextField
            autoFocus
            margin="dense"
            label="Имя пользователя"
            fullWidth
            value={formData.username}
            onChange={(e) => setFormData({ ...formData, username: e.target.value })}
            disabled={!!editingUser}
          />
          <TextField
            margin="dense"
            label="Пароль"
            type="password"
            fullWidth
            value={formData.password}
            onChange={(e) => setFormData({ ...formData, password: e.target.value })}
            required={!editingUser}
          />
          <TextField
            margin="dense"
            label="Группа (опционально)"
            fullWidth
            value={formData.group}
            onChange={(e) => setFormData({ ...formData, group: e.target.value })}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseDialog}>Отмена</Button>
          <Button onClick={handleSubmit} variant="contained">
            {editingUser ? 'Обновить' : 'Создать'}
          </Button>
        </DialogActions>
      </Dialog>
    </Container>

    );

};

export default Dashboard;