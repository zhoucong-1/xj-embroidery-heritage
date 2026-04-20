-- 初始化数据库表结构

-- 创建用户表
CREATE TABLE IF NOT EXISTS users (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  username TEXT UNIQUE,
  email TEXT UNIQUE,
  password TEXT,
  role TEXT DEFAULT 'user',
  create_time DATETIME DEFAULT CURRENT_TIMESTAMP
);

-- 创建订单表
CREATE TABLE IF NOT EXISTS orders (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  customerName TEXT,
  customerPhone TEXT,
  customerAddress TEXT,
  items TEXT,
  totalAmount REAL,
  status TEXT,
  create_time DATETIME DEFAULT CURRENT_TIMESTAMP
);