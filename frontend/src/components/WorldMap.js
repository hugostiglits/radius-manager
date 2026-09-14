import React, { useState, useEffect, useRef } from 'react';
import { Box, Typography } from '@mui/material';
import { styled } from '@mui/material/styles';

const MapContainer = styled(Box)({
  width: '100%',
  maxWidth: 600,
  height: 300,
  position: 'relative',
  background: 'rgba(0, 20, 0, 0.3)',
  border: '1px solid #00aa2a',
  overflow: 'hidden',
});


const WorldMap = () => {
        const [localtion, setLocation ] = useState(null);
        const [loading, setLocation ] = useState(true);
        const svgRef = useRef();



     return (
        <Box>

        </Box>
     )   
};



export default WorldMap;




// Замени на свой токен
const TOKEN = 'твой_токен_здесь';

