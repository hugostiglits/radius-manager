import React from 'react';
import { Box, Button, Container, Typography } from '@mui/material';
import { useAuth } from '../../contexts/AuthContext';




const HeroSection = () => {
  const { user } = useAuth();


  
  return (
    <Box
      component="section"
      id="home"
      sx={{
        minHeight: { xs: 'auto', md: '100vh' },
        display: 'flex',
        alignItems: 'center',
        pt: { xs: 15, md: 12 },
        pb: { xs: 10, md: 12 },
      }}
    >
      <Container maxWidth="lg">
        <Box
          sx={{
            display: 'grid',
            gridTemplateColumns: { xs: '1fr', md: '1.1fr 0.9fr' },
            alignItems: 'center',
            gap: { xs: 6, md: 8 },
          }}
        >
          <Box>
            <Typography
              sx={{
                color: 'primary.main',
                fontSize: '0.8rem',
                fontWeight: 700,
                letterSpacing: '0.16em',
                mb: 2,
              }}
            >
              Невиртуальный доступ к виртуальному
            </Typography>

            <Typography
              component="h1"
              sx={{
                fontSize: { xs: '2.7rem', sm: '3.8rem', md: '4.5rem' },
                lineHeight: 1.08,
                fontWeight: 700,
                letterSpacing: '-0.04em',
                mb: 3,
              }}
            >
              Интернет —
              <Box component="span" sx={{ display: 'block', color: 'primary.main' }}>
                на ваших условиях.
              </Box>
            </Typography>

            <Typography
              sx={{
                color: 'text.secondary',
                fontSize: { xs: '1rem', md: '1.125rem' },
                lineHeight: 1.7,
                maxWidth: 520,
                mb: 4,
              }}
            >
              Устройтесь поудобнее, сейчас Вы получите комфортный и безопасный доступ в сеть без посторонних глаз.  Мы не обходим блокировки, мы просто дарим Вам свободу
            </Typography>

            <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 2 }}>
              <Button
                href={user ? '#status' : '/register'}
                variant="contained"
                size="large"
                sx={{
                  px: 3,
                  py: 1.25,
                  bgcolor: 'primary.main',
                  color: '#1b1b1b',
                  textTransform: 'none',
                  fontWeight: 700,
                  '&:hover': {
                    bgcolor: 'primary.light',
                    boxShadow: 'none',
                  },
                }}
              >
                {user ? 'Проверить IP' : 'Создать аккаунт'}
              </Button>

              {!user && (
                <Button href="#status" variant="outlined" size="large">
                  Как работает проверка IP
                </Button>
              )}
            </Box>
          </Box>

          <Box
            sx={{
              p: { xs: 3, sm: 4 },
              border: '1px solid',
              borderColor: 'divider',
              borderRadius: '24px',
              bgcolor: 'background.paper',
            }}
          >
            <Typography
              sx={{
                color: 'text.secondary',
                fontSize: '0.75rem',
                letterSpacing: '0.12em',
                mb: 3,
              }}
            >
              СХЕМА ПОДКЛЮЧЕНИЯ
            </Typography>

            <Box
              component="svg"
              viewBox="0 0 460 230"
              aria-hidden="true"
              sx={{
                display: 'block',
                width: '100%',
                height: 'auto',
                color: 'primary.main',
              }}
            >
              <path
                d="M70 102 H390"
                stroke="currentColor"
                strokeWidth="2"
                strokeDasharray="6 8"
                opacity="0.5"
              />
              <circle cx="70" cy="102" r="23" fill="none" stroke="currentColor" strokeWidth="3" />
              <circle cx="230" cy="102" r="42" fill="none" stroke="currentColor" strokeWidth="3" />
              <circle cx="230" cy="102" r="53" fill="none" stroke="currentColor" opacity="0.25" />
              <circle cx="390" cy="102" r="23" fill="none" stroke="currentColor" strokeWidth="3" />
              <circle cx="70" cy="102" r="5" fill="currentColor" />
              <circle cx="390" cy="102" r="5" fill="currentColor" />
              <text
                x="230"
                y="108"
                textAnchor="middle"
                fill="currentColor"
                fontSize="17"
                fontWeight="700"
              >
                VPN
              </text>
              <text x="70" y="165" textAnchor="middle" fill="currentColor" fontSize="12">
                ВЫ
              </text>
              <text x="230" y="185" textAnchor="middle" fill="currentColor" fontSize="12">
                ПОДКЛЮЧЕНИЕ
              </text>
              <text x="390" y="165" textAnchor="middle" fill="currentColor" fontSize="12">
                ИНТЕРНЕТ
              </text>
            </Box>

            <Typography sx={{ color: 'text.secondary', fontSize: '0.85rem', mt: 1 }}>
              Простой путь от устройства к сети.
            </Typography>
          </Box>
        </Box>
      </Container>
    </Box>
  );
};

export default HeroSection;