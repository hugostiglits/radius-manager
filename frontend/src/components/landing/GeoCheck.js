import React, { useEffect, useRef, useState } from 'react';
import {
  Box,
  Button,
  CircularProgress,
  Paper,
  Typography,
} from '@mui/material';
import { useAuth } from '../../contexts/AuthContext';
import api from '../../api/axiosConfig';

const GeoCheck = () => {
  const { user } = useAuth();
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const svgRef = useRef(null);
  const requestId = useRef(0);

  // При выходе убираем результат предыдущего пользователя.
  useEffect(() => {
    if (!user) {
      requestId.current += 1;
      setData(null);
      setLoading(false);
      setError('');
    }
  }, [user]);

  const handleCheck = async () => {
    if (!user || loading) return;

    const currentRequest = ++requestId.current;
    setLoading(true);
    setError('');
    setData(null);

    try {
      const ipResponse = await fetch('https://api64.ipify.org?format=json');
      if (!ipResponse.ok) throw new Error('Не удалось получить публичный IP');

      const { ip } = await ipResponse.json();
      if (!ip) throw new Error('Сервис не вернул IP-адрес');

      // api уже добавляет токен к запросам.
      const response = await api.get('/geo/check', { params: { ip } });

      if (currentRequest === requestId.current) {
        setData(response.data);
      }
    } catch (err) {
      if (currentRequest === requestId.current) {
        setError(
          err.response?.status === 401
            ? 'Сессия завершилась. Войдите снова.'
            : 'Не удалось выполнить проверку. Попробуйте позже.'
        );
      }
    } finally {
      if (currentRequest === requestId.current) {
        setLoading(false);
      }
    }
  };

  // Карта строится после того, как результат и SVG появились на странице.
  useEffect(() => {
    if (!user || !data || !svgRef.current) return;

    let cancelled = false;

    const drawMap = async () => {
      const [d3, topojson] = await Promise.all([
        import('d3'),
        import('topojson-client'),
      ]);

      const response = await fetch(
        'https://cdn.jsdelivr.net/npm/world-atlas@2/countries-110m.json'
      );
      if (!response.ok) throw new Error('Не удалось загрузить карту');

      const world = await response.json();
      if (cancelled || !svgRef.current) return;

      const svg = d3.select(svgRef.current);
      svg.selectAll('*').remove();

      const projection = d3
        .geoNaturalEarth1()
        .fitSize([700, 350], { type: 'Sphere' });
      const path = d3.geoPath(projection);
      const countries = topojson.feature(
        world,
        world.objects.countries
      ).features;

      svg
        .selectAll('path')
        .data(countries)
        .join('path')
        .attr('d', path)
        .attr('fill', '#36332f')
        .attr('stroke', '#746a5d')
        .attr('stroke-width', 0.6);

      const point = projection([
        Number(data.longitude),
        Number(data.latitude),
      ]);

      if (point && point.every(Number.isFinite)) {
        const [x, y] = point;

        svg
          .append('circle')
          .attr('cx', x)
          .attr('cy', y)
          .attr('r', 15)
          .attr('fill', '#e5bd82')
          .attr('opacity', 0.18);

        svg
          .append('circle')
          .attr('cx', x)
          .attr('cy', y)
          .attr('r', 6)
          .attr('fill', '#e5bd82')
          .attr('stroke', '#1b1b1b')
          .attr('stroke-width', 2);
      }
    };

    drawMap().catch(() => {
      if (!cancelled) setError('Регион определён, но карта не загрузилась.');
    });

    return () => {
      cancelled = true;
    };
  }, [data, user]);

  return (
    <Box
      component="section"
      id="status"
      sx={{
        py: { xs: 8, md: 12 },
        px: 2,
        textAlign: 'center',
        scrollMarginTop: '80px',
      }}
    >
      <Typography
        component="h2"
        sx={{
          color: 'text.primary',
          fontSize: { xs: '2rem', md: '2.75rem' },
          fontWeight: 700,
          mb: 1.5,
        }}
      >
        Как сейчас Вас видят в Иннтернете ?
      </Typography>

      <Typography
        sx={{ color: 'text.secondary', maxWidth: 560, mx: 'auto', mb: 4 }}
      >
        Карта покажет примерный регион, определённый по публичному IP.
        Это не точное физическое местоположение.
      </Typography>

      {!user ? (
        <Box sx={{ mb: 4 }}>
          <Typography sx={{ color: 'text.secondary', mb: 2 }}>
            Чтобы увидеть свой IP и регион на карте, войдите в аккаунт.
          </Typography>
          <Box
            sx={{
              display: 'flex',
              justifyContent: 'center',
              flexWrap: 'wrap',
              gap: 2,
            }}
          >
            <Button href="/register" variant="contained">
              Зарегистрироваться
            </Button>
            <Button href="/login" variant="outlined">
              Войти
            </Button>
          </Box>
        </Box>
      ) : (
        <>
          {!data && !loading && (
            <Button onClick={handleCheck} variant="outlined" size="large">
              Проверить IP-адрес
            </Button>
          )}

          {loading && <CircularProgress aria-label="Идёт проверка IP" />}

          {error && (
            <Typography role="alert" sx={{ color: 'error.main', mt: 3 }}>
              {error}
            </Typography>
          )}

          {data && (
            <Box sx={{ maxWidth: 760, mx: 'auto', mt: 3 }}>
              <Paper
                sx={{
                  p: { xs: 1, sm: 2 },
                  borderRadius: 3,
                  overflow: 'hidden',
                  bgcolor: 'background.paper',
                }}
              >
                <Box
                  component="svg"
                  ref={svgRef}
                  viewBox="0 0 700 350"
                  role="img"
                  aria-label={`Карта мира: примерный регион ${data.region || data.country || 'неизвестен'}`}
                  sx={{
                    display: 'block',
                    width: '100%',
                    height: 'auto',
                    bgcolor: '#242321',
                    borderRadius: 2,
                  }}
                />
              </Paper>

              <Typography sx={{ mt: 2, color: 'text.primary' }}>
                {data.region || 'Регион не определён'}
                {data.country ? `, ${data.country}` : ''}
              </Typography>
              <Typography sx={{ color: 'text.secondary' }}>
                Публичный IP: {data.ip}
              </Typography>
              <Typography
                sx={{
                  color: 'text.secondary',
                  fontSize: '0.8rem',
                  mt: 1,
                }}
              >
                Отметка приблизительная. Если VPN уже включён, результат
                может относиться к его выходному серверу.
              </Typography>

              <Button
                onClick={handleCheck}
                variant="outlined"
                sx={{ mt: 3 }}
              >
                Проверить ещё раз
              </Button>
            </Box>
          )}
        </>
      )}
    </Box>
  );
};

export default GeoCheck;