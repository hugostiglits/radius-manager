import { useEffect, useState } from 'react';

function TestIpInfo() {
  const [result, setResult] = useState(null);
  const [error, setError] = useState(null);

  useEffect(() => {
    // Вставь свой токен сюда
    const TOKEN = 'b9c29df52706bb';
    
    fetch(`https://ipinfo.io/json?token=${TOKEN}`)
      .then(res => {
        if (!res.ok) throw new Error(`HTTP ${res.status}`);
        return res.json();
      })
      .then(data => {
        console.log('✅ ipinfo ответ:', data);
        setResult(data);
      })
      .catch(err => {
        console.error('❌ Ошибка:', err);
        setError(err.message);
      });
  }, []);

  if (error) return (
    <div style={{padding: 20, color: '#ff4444'}}>
      <h3>❌ Ошибка</h3>
      <p>{error}</p>
      <p>Проверь токен в коде</p>
    </div>
  );
  
  if (!result) return (
    <div style={{padding: 20, color: '#00aa2a'}}>
      Загрузка данных из ipinfo.io...
    </div>
  );
  
  return (
    <div style={{
      padding: 20, 
      background: '#0a0f0a', 
      color: '#00ff41',
      border: '1px solid #00ff41',
      fontFamily: 'monospace'
    }}>
      <h3>✅ ipinfo.io работает!</h3>
      <p><span style={{color: '#00aa2a'}}>Страна:</span> {result.country}</p>
      <p><span style={{color: '#00aa2a'}}>IP:</span> {result.ip}</p>
      <p><span style={{color: '#00aa2a'}}>Город:</span> {result.city || 'N/A'}</p>
      <p><span style={{color: '#00aa2a'}}>Регион:</span> {result.region}</p>
      <p><span style={{color: '#00aa2a'}}>Координаты:</span> {result.loc}</p>
    </div>
  );
}

export default TestIpInfo;