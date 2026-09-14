import React, { useState, useRef, useEffect } from 'react';
import { Box, Typography, Button, Paper } from '@mui/material';
import { styled } from '@mui/material/styles';

const MapContainer = styled(Paper)({
  width: '100%',
  maxWidth: 700,
  height: 350,
  margin: '0 auto',
  background: 'rgba(10, 15, 10, 0.9)',
  border: '1px solid #00aa2a',
  position: 'relative',
  overflow: 'hidden',
});

const ScanLine = styled(Box)({
  position: 'absolute',
  top: 0,
  left: 0,
  right: 0,
  height: '2px',
  background: 'rgba(0, 255, 65, 0.5)',
  animation: 'scan 3s linear infinite',
  '@keyframes scan': {
    '0%': { transform: 'translateY(0)' },
    '100%': { transform: 'translateY(350px)' },
  },
});

const GeoCheck = () => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const svgRef = useRef(null);

  const handleCheck = async () => {
    setLoading(true);
    setError(null);
    
    try {
      const TOKEN = process.env.REACT_APP_IPINFO_TOKEN;
      const response = await fetch(`https://ipinfo.io/json?token=${TOKEN}`);
      
      if (!response.ok) throw new Error(`HTTP ${response.status}`);
      
      const result = await response.json();
      setData(result);
      
      // Рисуем карту после получения данных
      drawMap(result.country);
      
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const drawMap = async (userCountry) => {
    // Динамически импортируем D3
    const d3 = await import('d3');
    const topojson = await import('topojson-client');
    
    const svg = d3.select(svgRef.current);
    svg.selectAll('*').remove();
    
    const width = 700;
    const height = 350;
    
    // Проекция
    const projection = d3.geoNaturalEarth1()
      .scale(120)
      .translate([width / 2, height / 2]);
    
    const path = d3.geoPath().projection(projection);
    
    // Загружаем данные карты
    const worldData = await fetch(
      'https://cdn.jsdelivr.net/npm/world-atlas@2/countries-110m.json'
    ).then(r => r.json());
    
    const countries = topojson.feature(worldData, worldData.objects.countries).features;
    
    // Рисуем страны
    svg.selectAll('path')
      .data(countries)
      .enter()
      .append('path')
      .attr('d', path)
      .attr('fill', d => {
        // Подсвечиваем страну пользователя
        if (d.properties.name === userCountry || 
            d.id === userCountry?.toUpperCase()) {
          return '#ff4444';
        }
        return '#0a2a0a';
      })
      .attr('stroke', '#00aa2a')
      .attr('stroke-width', 0.5)
      .attr('opacity', d => {
        const isUserCountry = d.properties.name === userCountry;
        return isUserCountry ? 1 : 0.4;
      })
      .style('filter', d => {
        const isUserCountry = d.properties.name === userCountry;
        return isUserCountry ? 'drop-shadow(0 0 10px #ff4444)' : 'none';
      });
    
    // Добавляем пульсирующий круг на страну пользователя
    const userCountryFeature = countries.find(c => 
      c.properties.name === userCountry
    );
    
    if (userCountryFeature) {
      const centroid = path.centroid(userCountryFeature);
      
      svg.append('circle')
        .attr('cx', centroid[0])
        .attr('cy', centroid[1])
        .attr('r', 5)
        .attr('fill', 'none')
        .attr('stroke', '#ff4444')
        .attr('stroke-width', 2)
        .style('opacity', 0.8)
        .transition()
        .duration(2000)
        .ease(d3.easeSinInOut)
        .attr('r', 30)
        .style('opacity', 0)
        .on('end', function repeat() {
          d3.select(this)
            .attr('r', 5)
            .style('opacity', 0.8)
            .transition()
            .duration(2000)
            .ease(d3.easeSinInOut)
            .attr('r', 30)
            .style('opacity', 0)
            .on('end', repeat);
        });
    }
  };

  return (
    <Box id="status" sx={{ py: 8, textAlign: 'center' }}>
      {/* Заголовок секции */}
      <Typography 
        variant="h2" 
        sx={{ 
          color: '#00ff41', 
          fontSize: '1.5rem',
          letterSpacing: 3,
          mb: 1 
        }}
      >
        &lt;STATUS_CHECK/&gt;
      </Typography>
      
      <Typography sx={{ color: '#00aa2a', mb: 4, fontSize: '0.9rem' }}>
        Проверьте, какое местоположение видят сервисы в интернете
      </Typography>

      {/* Кнопка проверки */}
      {!data && !loading && (
        <Button
          onClick={handleCheck}
          variant="outlined"
          size="large"
          sx={{
            color: '#00ff41',
            borderColor: '#00ff41',
            mb: 4,
            '&:hover': {
              background: 'rgba(0, 255, 65, 0.1)',
              boxShadow: '0 0 20px rgba(0, 255, 65, 0.4)',
            },
          }}
        >
          ▶ ПРОВЕРИТЬ_МОЁ_МЕСТОПОЛОЖЕНИЕ
        </Button>
      )}

      {/* Состояние загрузки */}
      {loading && (
        <Box sx={{ mb: 4 }}>
          <Typography sx={{ color: '#00aa2a', mb: 2 }}>
            Сканирование сети...
          </Typography>
          <Box sx={{ 
            width: 200, 
            height: 4, 
            bgcolor: '#0a2a0a',
            mx: 'auto',
            position: 'relative',
            overflow: 'hidden'
          }}>
            <Box sx={{
              position: 'absolute',
              top: 0,
              left: 0,
              height: '100%',
              width: '30%',
              bgcolor: '#00ff41',
              animation: 'progress 1.5s ease-in-out infinite',
              '@keyframes progress': {
                '0%': { left: '-30%' },
                '100%': { left: '100%' },
              },
            }} />
          </Box>
        </Box>
      )}

      {/* Ошибка */}
      {error && (
        <Paper sx={{ 
          p: 2, 
          mb: 4, 
          bgcolor: 'rgba(255, 0, 0, 0.1)',
          border: '1px solid #ff4444',
          maxWidth: 400,
          mx: 'auto'
        }}>
          <Typography sx={{ color: '#ff4444' }}>
            ⚠ ОШИБКА: {error}
          </Typography>
        </Paper>
      )}

      {/* Результаты */}
      {data && (
        <Box>
          {/* Карта */}
          <MapContainer elevation={0}>
            <ScanLine />
            <svg 
              ref={svgRef}
              width="100%" 
              height="100%" 
              viewBox="0 0 700 350"
            />
            
            {/* Оверлей с данными */}
            <Box sx={{
              position: 'absolute',
              bottom: 10,
              left: 10,
              background: 'rgba(0, 0, 0, 0.9)',
              border: '1px solid #ff4444',
              p: 1.5,
              minWidth: 150,
            }}>
              <Typography sx={{ color: '#ff4444', fontSize: '0.7rem', mb: 0.5 }}>
                ⚠ ОБНАРУЖЕНО
              </Typography>
              <Typography sx={{ color: '#00ff41', fontSize: '1rem', fontWeight: 'bold' }}>
                {data.country}
              </Typography>
              <Typography sx={{ color: '#00aa2a', fontSize: '0.75rem' }}>
                IP: {data.ip}
              </Typography>
              {data.city && (
                <Typography sx={{ color: '#008822', fontSize: '0.7rem' }}>
                  {data.city}, {data.region}
                </Typography>
              )}
            </Box>
          </MapContainer>

          {/* Рекомендация */}
          <Paper sx={{ 
            mt: 3, 
            p: 2, 
            maxWidth: 500,
            mx: 'auto',
            bgcolor: 'rgba(255, 170, 0, 0.05)',
            border: '1px solid #ffaa00',
          }}>
            <Typography sx={{ color: '#ffaa00', fontSize: '0.9rem' }}>
              ⚠ ВАША СТРАНА ВИДНА ВСЕМ В ИНТЕРНЕТЕ
            </Typography>
            <Typography sx={{ color: '#00aa2a', fontSize: '0.8rem', mt: 1 }}>
              Используйте VPN, чтобы скрыть реальное местоположение и получить доступ к свободному интернету
            </Typography>
            <Button 
              href="/register" 
              variant="outlined" 
              size="small"
              sx={{ 
                mt: 2,
                color: '#00ff41',
                borderColor: '#00ff41',
              }}
            >
              ЗАЩИТИТЬ СОЕДИНЕНИЕ →
            </Button>
          </Paper>

          {/* Кнопка повторной проверки */}
          <Button
            onClick={() => {
              setData(null);
              setError(null);
            }}
            variant="outlined"
            size="small"
            sx={{
              mt: 3,
              color: '#00aa2a',
              borderColor: '#00aa2a',
            }}
          >
            ⟲ ПОВТОРИТЬ ПРОВЕРКУ
          </Button>
        </Box>
      )}
    </Box>
  );
};

export default GeoCheck;