import { createTheme } from '@mui/material/styles';

export const cyberpunkTheme = createTheme({
  palette: {
    mode: 'dark',
    primary: {
      main: '#00ff41',      // Фосфорный зелёный
      dark: '#00aa2a',
      light: '#4dff7a',
    },
    secondary: {
      main: '#ffaa00',      // Янтарный для предупреждений
    },
    background: {
      default: '#0a0f0a',   // Тёмный терминал
      paper: '#0a150a',
    },
    text: {
      primary: '#00ff41',
      secondary: '#00aa2a',
    },
  },
  typography: {
    fontFamily: '"Courier New", "Courier", monospace',
    h1: { letterSpacing: '0.1em' },
    h2: { letterSpacing: '0.05em' },
    button: { letterSpacing: '0.1em' },
  },
  components: {
    MuiButton: {
      styleOverrides: {
        root: {
          borderRadius: 0,
          textTransform: 'uppercase',
          border: '1px solid #00ff41',
          background: 'transparent',
          '&:hover': {
            background: 'rgba(0, 255, 65, 0.1)',
            boxShadow: '0 0 20px rgba(0, 255, 65, 0.4)',
          },
        },
      },
    },
    MuiPaper: {
      styleOverrides: {
        root: {
          backgroundImage: 'none',
          backgroundColor: 'rgba(10, 21, 10, 0.95)',
          border: '1px solid #00aa2a',
        },
      },
    },
  },
});