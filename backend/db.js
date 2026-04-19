const sqlite3 = require('sqlite3').verbose();
const db = new sqlite3.Database('./heritage.db');

// 初始化表
db.serialize(() => {
  // 非遗刺绣表
  db.run(`
    CREATE TABLE IF NOT EXISTS heritage (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      name TEXT,
      type TEXT,
      year TEXT,
      content TEXT,
      image TEXT
    )
  `);

  // 新闻表
  db.run(`
    CREATE TABLE IF NOT EXISTS news (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      title TEXT,
      content TEXT,
      create_time DATETIME DEFAULT CURRENT_TIMESTAMP
    )
  `);
});

module.exports = db;
