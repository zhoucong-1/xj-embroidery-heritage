const express = require('express');
const cors = require('cors');
const path = require('path');
const db = require('./db');
const initData = require('./initData');

const app = express();
const PORT = 5184;

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

// 获取商品列表
app.get('/api/products', async (req, res) => {
  try {
    const rows = await db.all('SELECT * FROM products');
    res.json(rows || []);
  } catch (err) {
    res.status(500).json({ error: '获取商品数据失败' });
  }
});

// 获取单条商品
app.get('/api/products/:id', async (req, res) => {
  const { id } = req.params;
  try {
    const row = await db.get('SELECT * FROM products WHERE id = ?', [id]);
    if (!row) {
      res.status(404).json({ error: '商品不存在' });
      return;
    }
    res.json(row);
  } catch (err) {
    res.status(500).json({ error: '获取商品数据失败' });
  }
});

// 创建订单
app.post('/api/orders', async (req, res) => {
  const { customerName, customerPhone, customerAddress, items, totalAmount } = req.body;
  
  if (!customerName || !customerPhone || !items || items.length === 0) {
    res.status(400).json({ error: '请填写完整的订单信息' });
    return;
  }
  
  try {
    const itemsJson = JSON.stringify(items);
    await db.run(
      'INSERT INTO orders (customerName, customerPhone, customerAddress, items, totalAmount, status) VALUES (?, ?, ?, ?, ?, ?)',
      [customerName, customerPhone, customerAddress, itemsJson, totalAmount, 'pending']
    );
    const rows = await db.all('SELECT * FROM orders ORDER BY id DESC LIMIT 1');
    const newOrder = rows[0];
    res.status(201).json(newOrder);
  } catch (err) {
    res.status(500).json({ error: '创建订单失败' });
  }
});

// 获取所有订单（管理端）
app.get('/api/orders', async (req, res) => {
  try {
    const rows = await db.all('SELECT * FROM orders ORDER BY create_time DESC');
    res.json(rows || []);
  } catch (err) {
    res.status(500).json({ error: '获取订单列表失败' });
  }
});

// 获取单个订单
app.get('/api/orders/:id', async (req, res) => {
  const { id } = req.params;
  try {
    const row = await db.get('SELECT * FROM orders WHERE id = ?', [id]);
    if (!row) {
      res.status(404).json({ error: '订单不存在' });
      return;
    }
    res.json(row);
  } catch (err) {
    res.status(500).json({ error: '获取订单数据失败' });
  }
});

// 更新订单状态
app.put('/api/orders/:id/status', async (req, res) => {
  const { id } = req.params;
  const { status } = req.body;
  
  if (!status) {
    res.status(400).json({ error: '订单状态不能为空' });
    return;
  }
  
  try {
    await db.run('UPDATE orders SET status = ? WHERE id = ?', [status, id]);
    const row = await db.get('SELECT * FROM orders WHERE id = ?', [id]);
    res.json(row);
  } catch (err) {
    res.status(500).json({ error: '更新订单状态失败' });
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

// 用户注册
app.post('/api/auth/register', async (req, res) => {
  const { username, email, password, role = 'user' } = req.body;
  
  if (!username || !email || !password) {
    res.status(400).json({ error: '用户名、邮箱和密码不能为空' });
    return;
  }
  
  try {
    console.log('注册请求数据:', { username, email, password, role });
    
    // 检查用户名是否已存在
    const existingUser = await db.get('SELECT * FROM users WHERE username = ? OR email = ?', [username, email]);
    console.log('查询现有用户结果:', existingUser);
    
    if (existingUser) {
      res.status(400).json({ error: '用户名或邮箱已存在' });
      return;
    }
    
    const insertResult = await db.run(
      'INSERT INTO users (username, email, password, role) VALUES (?, ?, ?, ?)',
      [username, email, password, role]
    );
    console.log('插入用户结果:', insertResult);
    
    const newUser = await db.get('SELECT * FROM users WHERE username = ?', [username]);
    console.log('查询新用户结果:', newUser);
    
    // 不返回密码
    if (newUser) {
      delete newUser.password;
      res.status(201).json(newUser);
    } else {
      res.status(500).json({ error: '注册失败：创建用户后无法查询' });
    }
  } catch (err) {
    console.error('注册失败错误:', err);
    res.status(500).json({ error: '注册失败' });
  }
});

// 用户登录
app.post('/api/auth/login', async (req, res) => {
  const { username, password, role = 'user' } = req.body;
  
  if (!username || !password) {
    res.status(400).json({ error: '用户名和密码不能为空' });
    return;
  }
  
  try {
    const user = await db.get('SELECT * FROM users WHERE username = ? AND password = ?', [username, password]);
    if (!user) {
      res.status(401).json({ error: '用户名或密码错误' });
      return;
    }
    
    if (role === 'admin' && user.role !== 'admin') {
      res.status(403).json({ error: '没有管理权限' });
      return;
    }
    
    // 不返回密码
    delete user.password;
    res.json(user);
  } catch (err) {
    res.status(500).json({ error: '登录失败' });
  }
});

// 获取当前用户信息
app.get('/api/auth/me', async (req, res) => {
  const { userId } = req.body;
  
  if (!userId) {
    res.status(401).json({ error: '未登录' });
    return;
  }
  
  try {
    const user = await db.get('SELECT * FROM users WHERE id = ?', [userId]);
    if (!user) {
      res.status(404).json({ error: '用户不存在' });
      return;
    }
    
    // 不返回密码
    delete user.password;
    res.json(user);
  } catch (err) {
    res.status(500).json({ error: '获取用户信息失败' });
  }
});

// 获取所有用户（管理端）
app.get('/api/users', async (req, res) => {
  try {
    const users = await db.all('SELECT * FROM users');
    // 不返回密码
    const usersWithoutPassword = users.map(user => {
      const { password, ...userWithoutPassword } = user;
      return userWithoutPassword;
    });
    res.json(usersWithoutPassword);
  } catch (err) {
    res.status(500).json({ error: '获取用户列表失败' });
  }
});

// 启动服务
async function startServer() {
  await initData();
  app.listen(PORT, () => {
    console.log(`✅ 新疆非遗数字图谱运行在：http://localhost:${PORT}`);
  });
}

startServer();
