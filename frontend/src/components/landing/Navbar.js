import React, { useState, useEffect } from 'react';
import { AppBar, Toolbar, Box, Button, Typography } from '@mui/material';
import { styled } from '@mui/material/styles';
import { Link as ScrollLink } from 'react-scroll';
import { useAuth } from '../../contexts/AuthContext';
import { useNavigate } from 'react-router-dom';

const StyledAppBar = styled(AppBar)(({ theme }) => ({
  background: 'rgba(34, 33, 31, 0.96)',
  borderBottom: `1px solid ${theme.palette.divider}`,
  boxShadow: '0 8px 24px rgba(0, 0, 0, 0.18)',
}));

const NavLink = styled(ScrollLink)(({ theme }) => ({
  color: theme.palette.text.secondary,
  textDecoration: 'none',
  fontSize: '0.85rem',
  letterSpacing: '0.04em',
  cursor: 'pointer',
  padding: '0.5rem 0.75rem',
  borderRadius: 9,
  transition: 'color 0.2s, background-color 0.2s',
  '&:hover': {
    color: theme.palette.primary.main,
    backgroundColor: 'rgba(229, 189, 130, 0.08)',
  },
}));


const Navbar = () => {
  const { user, logout} = useAuth();
  const [scrolled, setScrolled] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 50);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);


const handleLogout = () => {
    logout();
    navigate('/login');
}


  return (
    <StyledAppBar position="fixed">
      <Toolbar sx={{ justifyContent: 'space-between' }}>
<Box
  component="a"
  href="/"
  aria-label="На главную"
  sx={{ display: 'inline-flex', alignItems: 'center' }}
>
  <Box
    component="img"
    src="/brand-mark.svg"
    alt=""
    sx={{ width: 50, height: 40, display: 'block' }}
  />
</Box>

        <Box sx={{ display: 'flex', gap: 3 }}>
            {[
              { id: 'home', label: 'Главная' },
              { id: 'status', label: 'Проверка IP' },
            ].map(({ id, label }) => (
              <NavLink
                key={id}
                to={id}
                spy={true}
                smooth={true}
                offset={-80}
                duration={400}
              >
                {label}
              </NavLink>
            ))}
        </Box>
        {/* Прроверяем , авторизован ли пользователь */}
        { user ? (
         <>
              {user?.role === 'admin' && (
                <Button
                  href="/dashboard"
                  variant="outlined"
                  size="small"
                >
                  [DASHBOARD]
                </Button>
              )}
              <Button 
                onClick={handleLogout}
                variant="outlined" 
                size="small"
                sx={{
                  color: 'text.secondary',
                  borderColor: 'divider',
                }}
              >
                [LOGOUT]
              </Button>
            </>
        ) : (
          <>
          <Button href="/login" variant="outlined" size="small">
            [LOGIN]
          </Button>
          <Button 
            href="/register" 
            variant="outlined" 
            size="small"
          >
            [REGISTER]
          </Button>
          </>

        )} 
      </Toolbar>
    </StyledAppBar>
  );
};

export default Navbar;