import React, { useState, useEffect } from 'react';
import { AppBar, Toolbar, Box, Button, Typography } from '@mui/material';
import { styled } from '@mui/material/styles';
import { Link as ScrollLink } from 'react-scroll';
import { useAuth } from '../../contexts/AuthContext';
import { useNavigate } from 'react-router-dom';

const StyledAppBar = styled(AppBar)({
  background: 'rgba(10, 15, 10, 0.95)',
  borderBottom: '2px solid #00ff41',
  boxShadow: '0 0 20px rgba(0, 255, 65, 0.3)',
});

const NavLink = styled(ScrollLink)(({ theme }) => ({
  color: '#00aa2a',
  textDecoration: 'none',
  fontSize: '0.85rem',
  letterSpacing: '1px',
  cursor: 'pointer',
  padding: '0.5rem 1rem',
  transition: 'all 0.3s',
  '&:hover': {
    color: '#00ff41',
    textShadow: '0 0 10px rgba(0, 255, 65, 0.8)',
  },
}));

const Scanline = styled(Box)({
  height: '1px',
  background: 'linear-gradient(90deg, transparent, #00ff41, transparent)',
  animation: 'scan 3s linear infinite',
  '@keyframes scan': {
    '0%': { transform: 'translateX(-100%)' },
    '100%': { transform: 'translateX(100%)' },
  },
});

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
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
          <Typography 
            sx={{ 
              fontSize: '1.5rem', 
              color: '#00ff41',
              textShadow: '0 0 10px rgba(0, 255, 65, 0.8)',
              animation: 'pulse 2s infinite',
            }}
          >
            ☢
          </Typography>
          <Typography variant="h6" sx={{ color: '#00ff41', letterSpacing: 2 }}>
            CHEBURNET_OS
          </Typography>
          <Typography 
            variant="caption" 
            sx={{ 
              color: '#00aa2a', 
              border: '1px solid #00aa2a',
              px: 0.5,
              ml: 1,
            }}
          >
            v2.0.77
          </Typography>
        </Box>

        <Box sx={{ display: 'flex', gap: 3 }}>
          {['status', 'systems', 'vault', 'connect'].map((section) => (
            <NavLink
              key={section}
              to={section}
              spy={true}
              smooth={true}
              offset={-70}
              duration={500}
            >
              [{section.toUpperCase()}]
            </NavLink>
          ))}
        </Box>

        { user ? (
         <>
              <Button 
                href="/dashboard" 
                variant="outlined" 
                size="small"
                sx={{ color: '#00ff41', borderColor: '#00ff41' }}
              >
                [DASHBOARD]
              </Button>
              <Button 
                onClick={handleLogout}
                variant="outlined" 
                size="small"
                sx={{ 
                  color: '#ff4444', 
                  borderColor: '#ff4444',
                  '&:hover': {
                    background: 'rgba(255, 68, 68, 0.1)',
                  }
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
            sx={{ 
              animation: 'glow 2s ease-in-out infinite alternate',
              '@keyframes glow': {
                'from': { boxShadow: '0 0 5px rgba(0, 255, 65, 0.3)' },
                'to': { boxShadow: '0 0 20px rgba(0, 255, 65, 0.6)' },
              },
            }}
          >
            [REGISTER]
          </Button>
          </>

        )} 
      </Toolbar>
      <Scanline />
    </StyledAppBar>
  );
};

export default Navbar;