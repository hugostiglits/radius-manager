import React from 'react';
import { Box } from '@mui/material';
import { styled } from '@mui/material/styles';

const Scanlines = styled(Box)({
  position: 'fixed',
  top: 0,
  left: 0,
  width: '100%',
  height: '100%',
  background: `linear-gradient(
    to bottom,
    rgba(0, 0, 0, 0) 50%,
    rgba(0, 0, 0, 0.1) 50%
  )`,
  backgroundSize: '100% 4px',
  pointerEvents: 'none',
  zIndex: 9999,
});

const Flicker = styled(Box)({
  position: 'fixed',
  top: 0,
  left: 0,
  width: '100%',
  height: '100%',
  background: 'rgba(0, 255, 65, 0.02)',
  opacity: 0,
  animation: 'flicker 0.15s infinite',
  pointerEvents: 'none',
  zIndex: 9998,
  '@keyframes flicker': {
    '0%': { opacity: 0.02 },
    '50%': { opacity: 0.05 },
    '100%': { opacity: 0.02 },
  },
});

const Vignette = styled(Box)({
  position: 'fixed',
  top: 0,
  left: 0,
  width: '100%',
  height: '100%',
  background: 'radial-gradient(ellipse at center, transparent 50%, rgba(0, 0, 0, 0.4) 100%)',
  pointerEvents: 'none',
  zIndex: 9997,
});

const Glow = styled(Box)({
  position: 'fixed',
  top: 0,
  left: 0,
  width: '100%',
  height: '100%',
  boxShadow: 'inset 0 0 100px rgba(0, 255, 65, 0.05)',
  pointerEvents: 'none',
  zIndex: 9996,
});

const CRTEffects = () => (
  <>
    <Scanlines />
    <Flicker />
    <Vignette />
    <Glow />
  </>
);

export default CRTEffects;