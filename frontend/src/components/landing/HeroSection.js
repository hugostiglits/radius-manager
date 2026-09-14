import React, { useEffect, useState } from 'react';
import { Box, Typography, Button, Container } from '@mui/material';
import { styled } from '@mui/material/styles';

const BlinkCursor = styled('span')({
  animation: 'blink 1s infinite',
  '@keyframes blink': {
    '0%, 50%': { opacity: 1 },
    '51%, 100%': { opacity: 0 },
  },
});

const StatBox = styled(Box)({
  border: '1px solid #00aa2a',
  padding: '1rem 1.5rem',
  minWidth: '140px',
  textAlign: 'center',
});

const AsciiArt = styled('pre')({
  fontSize: '0.55rem',
  lineHeight: 1.2,
  color: '#00ff41',
  textShadow: '0 0 5px rgba(0, 255, 65, 0.5)',
  overflow: 'auto',
  marginBottom: '2rem',
});

const HeroSection = () => {
  const [typedText, setTypedText] = useState(['', '', '']);
  const texts = [
    '> INITIALIZING AUTHENTICATION  PROTOCOL...',
    '> VPN SECURE CHANNEL ESTABLISHED',
    '> WELCOME TO THE VAULT, OPERATOR',
  ];

  useEffect(() => {
    texts.forEach((text, index) => {
      setTimeout(() => {
        let i = 0;
        const interval = setInterval(() => {
          if (i <= text.length) {
            setTypedText(prev => {
              const newTexts = [...prev];
              newTexts[index] = text.substring(0, i);
              return newTexts;
            });
            i++;
          } else {
            clearInterval(interval);
          }
        }, 50);
      }, index * 1000);
    });
  }, []);

  return (
    <Box
      id="status"
      sx={{
        minHeight: '100vh',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        pt: '80px',
        position: 'relative',
      }}
    >
      <Container maxWidth="lg">
        <Typography sx={{ color: '#00aa2a', mb: 2 }}>
          root@vault-tec:~$ <BlinkCursor>_</BlinkCursor>
        </Typography>

        <AsciiArt>
{`╔══════════════════════════════════════════════════════════════╗
║  ██████╗  █████╗ ██████╗ ██╗██╗   ██╗███████╗    ███╗   ███╗ ║
║  ██╔══██╗██╔══██╗██╔══██╗██║██║   ██║██╔════╝    ████╗ ████║ ║
║  ██████╔╝███████║██║  ██║██║██║   ██║█████╗      ██╔████╔██║ ║
║  ██╔══██╗██╔══██║██║  ██║██║╚██╗ ██╔╝██╔══╝      ██║╚██╔╝██║ ║
║  ██║  ██║██║  ██║██████╔╝██║ ╚████╔╝ ███████╗    ██║ ╚═╝ ██║ ║
║  ╚═╝  ╚═╝╚═╝  ╚═╝╚═════╝ ╚═╝  ╚═══╝  ╚══════╝    ╚═╝     ╚═╝ ║
╚══════════════════════════════════════════════════════════════╝`}
        </AsciiArt>

        <Box sx={{ mb: 4 }}>
          {typedText.map((text, i) => (
            <Typography key={i} sx={{ color: '#00aa2a', mb: 0.5 }}>
              {text || '_'}
            </Typography>
          ))}
        </Box>

        <Box sx={{ display: 'flex', gap: 2, flexWrap: 'wrap', mb: 4 }}>
          {[
            { label: 'SERVER_STATUS', value: 'ONLINE', status: 'online' },
            { label: 'ACTIVE_USERS', value: '042' },
            { label: 'UPTIME', value: '77d:04:20' },
            { label: 'THREAT_LEVEL', value: 'MINIMAL', status: 'warning' },
          ].map((stat) => (
            <StatBox key={stat.label}>
              <Typography sx={{ fontSize: '0.7rem', color: '#00aa2a', mb: 0.5 }}>
                {stat.label}
              </Typography>
              <Typography 
                sx={{ 
                  fontSize: '1.25rem', 
                  fontWeight: 'bold',
                  color: stat.status === 'warning' ? '#ffaa00' : '#00ff41',
                  animation: stat.status === 'online' ? 'pulse 2s infinite' : 'none',
                }}
              >
                {stat.value}
              </Typography>
            </StatBox>
          ))}
        </Box>

        <Box sx={{ display: 'flex', gap: 2, flexWrap: 'wrap' }}>
          <Button href="/register" variant="outlined" size="large">
            ▶ INITIATE_SEQUENCE
          </Button>
          <Button href="https://github.com/hugostiglits/radius-manager" variant="outlined" size="large" sx={{ borderStyle: 'dashed' }}>
            ⌘ ACCESS_REPOSITORY
          </Button>
        </Box>
      </Container>

      {/* Scroll Indicator */}
      <Box
        sx={{
          position: 'absolute',
          bottom: '2rem',
          left: '50%',
          transform: 'translateX(-50%)',
          textAlign: 'center',
          animation: 'bounce 2s infinite',
          '@keyframes bounce': {
            '0%, 100%': { transform: 'translateX(-50%) translateY(0)' },
            '50%': { transform: 'translateX(-50%) translateY(10px)' },
          },
        }}
      >
        <Typography sx={{ fontSize: '0.7rem', color: '#00aa2a', letterSpacing: 2 }}>
          SCROLL_TO_CONTINUE
        </Typography>
        <Typography sx={{ fontSize: '1.5rem', color: '#00ff41' }}>▼</Typography>
      </Box>
    </Box>
  );
};

export default HeroSection;