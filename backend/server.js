const express = require('express');
const cors = require('cors');
const path = require('path');
const db = require('./db');

const app = express();
const PORT = 5180;

app.use(cors());
app.use(express.json());

// 静态页面托管（关键：让所有HTML都能访问）
app.use(express.static(path.join(__dirname, '../frontend')));

// 首页
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, '../frontend/index.html'));
});

// 获取所有非遗刺绣
app.get('/api/heritage', (req, res) => {
  db.all('SELECT * FROM heritage', (err, rows) => {
    res.json(rows || []);
  });
});

// 获取单条非遗
app.get('/api/heritage/:id', (req, res) => {
  db.get('SELECT * FROM heritage WHERE id = ?', [req.params.id], (err, row) => {
    res.json(row || {});
  });
});

// 获取新闻
app.get('/api/news', (req, res) => {
  db.all('SELECT * FROM news ORDER BY id DESC', (err, rows) => {
    res.json(rows || []);
  });
});

// 启动服务
app.listen(PORT, () => {
  console.log(`✅ 新疆非遗数字图谱运行在：http://localhost:${PORT}`);
});
