import { createTheme } from '@mui/material/styles';

export const cyberpunkTheme = createTheme({
palette: {
  mode: 'dark',
  primary: {
    main: '#e5bd82',
    dark: '#c7985b',
    light: '#f3d5ac',
  },
  secondary: {
    main: '#9daf9d',
  },
  background: {
    default: '#1b1b1b',
    paper: '#2a2926',
  },
  text: {
    primary: '#f0eae0',
    secondary: '#b4aa9d',
  },
  divider: '#48423a',
},
typography: {
  fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif',
  h4: {
    fontWeight: 650,
    letterSpacing: '-0.025em',
  },
  h5: {
    fontWeight: 650,
    letterSpacing: '-0.02em',
  },
  button: {
    fontWeight: 600,
    letterSpacing: 0,
  },
},
  components: {
  MuiButton: {
    styleOverrides: {
      root: {
        borderRadius: 11,
        textTransform: 'none',
        fontWeight: 600,
      },
      contained: {
        boxShadow: 'none',
        '&:hover': {
          boxShadow: 'none',
        },
      },
    },
  },
  MuiPaper: {
    styleOverrides: {
      root: {
        backgroundImage: 'none',
        border: '1px solid #48423a',
        borderRadius: 16,
      },
    },
  },
  MuiOutlinedInput: {
    styleOverrides: {
      root: {
        borderRadius: 11,
      },
    },
  },
},
});