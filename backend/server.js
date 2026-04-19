const express = require('express');
const cors = require('cors');
const path = require('path');
const db = require('./db');

const app = express();
const PORT = 5181;

app.use(cors());
app.use(express.json());

// 静态页面托管（关键：让所有HTML都能访问）
app.use(express.static(path.join(__dirname, '../frontend')));

// 首页
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, '../frontend/index.html'));
});

// 错误处理中间件
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ error: '服务器内部错误' });
});

// 获取所有非遗刺绣
app.get('/api/heritage', async (req, res) => {
  try {
    const rows = await db.all('SELECT * FROM heritage');
    res.json(rows || []);
  } catch (err) {
    res.status(500).json({ error: '获取非遗数据失败' });
  }
});

// 获取单条非遗
app.get('/api/heritage/:id', async (req, res) => {
  const { id } = req.params;
  try {
    const row = await db.get('SELECT * FROM heritage WHERE id = ?', [id]);
    if (!row) {
      res.status(404).json({ error: '非遗项目不存在' });
      return;
    }
    res.json(row);
  } catch (err) {
    res.status(500).json({ error: '获取非遗数据失败' });
  }
});

// 添加新的非遗项目
app.post('/api/heritage', async (req, res) => {
  const { name, type, year, content, image } = req.body;
  if (!name) {
    res.status(400).json({ error: '项目名称不能为空' });
    return;
  }
  
  try {
    await db.run(
      'INSERT INTO heritage (name, type, year, content, image) VALUES (?, ?, ?, ?, ?)',
      [name, type, year, content, image]
    );
    // 获取刚插入的记录
    const rows = await db.all('SELECT * FROM heritage ORDER BY id DESC LIMIT 1');
    const newItem = rows[0];
    res.status(201).json(newItem);
  } catch (err) {
    res.status(500).json({ error: '添加非遗项目失败' });
  }
});

// 更新非遗项目
app.put('/api/heritage/:id', async (req, res) => {
  const { id } = req.params;
  const { name, type, year, content, image } = req.body;
  
  try {
    const result = await db.run(
      'UPDATE heritage SET name = ?, type = ?, year = ?, content = ?, image = ? WHERE id = ?',
      [name, type, year, content, image, id]
    );
    
    if (result.lastID === 0) {
      res.status(404).json({ error: '非遗项目不存在' });
      return;
    }
    
    res.json({ id, name, type, year, content, image });
  } catch (err) {
    res.status(500).json({ error: '更新非遗项目失败' });
  }
});

// 删除非遗项目
app.delete('/api/heritage/:id', async (req, res) => {
  const { id } = req.params;
  
  try {
    const result = await db.run('DELETE FROM heritage WHERE id = ?', [id]);
    
    if (result.lastID === 0) {
      res.status(404).json({ error: '非遗项目不存在' });
      return;
    }
    
    res.json({ message: '非遗项目删除成功' });
  } catch (err) {
    res.status(500).json({ error: '删除非遗项目失败' });
  }
});

// 获取新闻
app.get('/api/news', async (req, res) => {
  try {
    const rows = await db.all('SELECT * FROM news ORDER BY id DESC');
    res.json(rows || []);
  } catch (err) {
    res.status(500).json({ error: '获取新闻数据失败' });
  }
});

// 添加新闻
app.post('/api/news', async (req, res) => {
  const { title, content } = req.body;
  if (!title) {
    res.status(400).json({ error: '新闻标题不能为空' });
    return;
  }
  
  try {
    await db.run(
      'INSERT INTO news (title, content) VALUES (?, ?)',
      [title, content]
    );
    // 获取刚插入的记录
    const rows = await db.all('SELECT * FROM news ORDER BY id DESC LIMIT 1');
    const newItem = rows[0];
    res.status(201).json(newItem);
  } catch (err) {
    res.status(500).json({ error: '添加新闻失败' });
  }
});

// 启动服务
app.listen(PORT, () => {
  console.log(`✅ 新疆非遗数字图谱运行在：http://localhost:${PORT}`);
});
