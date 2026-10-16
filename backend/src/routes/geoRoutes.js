const express = require('express');
const { isIP } = require('node:net');
const authMiddleware = require('../middleware/auth');

const router = express.Router();

router.use(authMiddleware);

router.get('/check', async (req, res) => {
  const ip = req.query.ip;

  if (typeof ip !== 'string' || !isIP(ip)) {
    return res.status(400).json({ error: 'Некорректный IP-адрес' });
  }

  try {
    const response = await fetch(
  `https://ipwho.is/${encodeURIComponent(ip)}`,
  { signal: AbortSignal.timeout(8000) }
);

if (response.status === 429) {
  return res.status(503).json({
    error: 'Лимит сервиса определения региона исчерпан. Попробуйте позже.',
  });
}

if (!response.ok) {
  throw new Error(`Geo service: ${response.status}`);
}

const result = await response.json();

if (
  result.success === false ||
  result.latitude == null ||
  result.longitude == null
) {
  throw new Error('Geo service returned no coordinates');
}

return res.json({
  ip: result.ip,
  city: result.city,
  region: result.region,
  country: result.country,
  latitude: Number(result.latitude),
  longitude: Number(result.longitude),
});
  } catch (error) {
    console.error('IP lookup failed:', error.message);
    return res.status(502).json({ error: 'Не удалось определить регион по IP' });
  }
});

module.exports = router;