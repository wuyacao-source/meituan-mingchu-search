const express = require('express');
const path = require('path');
const { searchMeituanRestaurants } = require('./scraper');

const app = express();
const PORT = process.env.PORT || 3456;

app.use(express.json());
app.use(express.static(path.join(__dirname, 'public')));

// API: Search restaurants by city
app.post('/api/search', async (req, res) => {
  const { city } = req.body;

  if (!city || typeof city !== 'string' || city.trim().length === 0) {
    return res.status(400).json({ error: '请提供城市名称' });
  }

  try {
    const results = await searchMeituanRestaurants(city.trim());
    res.json(results);
  } catch (err) {
    console.error('搜索失败:', err.message);
    res.status(500).json({ error: `搜索失败: ${err.message}` });
  }
});

// Health check
app.get('/api/health', (_req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

app.listen(PORT, () => {
  console.log(`服务器已启动: http://localhost:${PORT}`);
  console.log(`打开浏览器访问上述地址即可使用`);
});
