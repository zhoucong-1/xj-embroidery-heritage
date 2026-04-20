const initSqlJs = require('sql.js');

// 内存数据库
let db;
let dbInitialized = false;

// 初始化数据库
async function initDatabase() {
  if (dbInitialized) {
    return db;
  }
  
  try {
    const SQL = await initSqlJs();
    db = new SQL.Database();
    
    // 初始化表
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

    // 商品表
    db.run(`
      CREATE TABLE IF NOT EXISTS products (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        name TEXT,
        category TEXT,
        price REAL,
        description TEXT,
        image TEXT,
        story TEXT
      )
    `);

    // 订单表
    db.run(`
      CREATE TABLE IF NOT EXISTS orders (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        customerName TEXT,
        customerPhone TEXT,
        customerAddress TEXT,
        items TEXT,
        totalAmount REAL,
        status TEXT,
        create_time DATETIME DEFAULT CURRENT_TIMESTAMP
      )
    `);

    // 用户表
    db.run(`
      CREATE TABLE IF NOT EXISTS users (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        username TEXT UNIQUE,
        email TEXT UNIQUE,
        password TEXT,
        role TEXT DEFAULT 'user',
        create_time DATETIME DEFAULT CURRENT_TIMESTAMP
      )
    `);
    
    dbInitialized = true;
    console.log('数据库初始化成功');
    return db;
  } catch (error) {
    console.error('数据库初始化失败:', error);
    throw error;
  }
}

// 确保数据库初始化
async function ensureDatabase() {
  if (!dbInitialized) {
    await initDatabase();
  }
  return db;
}

// 执行查询
async function run(sql, params = []) {
  const db = await ensureDatabase();
  return new Promise((resolve, reject) => {
    try {
      const stmt = db.prepare(sql);
      stmt.bind(params);
      stmt.step();
      // sql.js 不需要调用 finalize()
      resolve({ lastID: db.getRowsModified() });
    } catch (error) {
      reject(error);
    }
  });
}

// 执行查询并返回所有结果
async function all(sql, params = []) {
  const db = await ensureDatabase();
  return new Promise((resolve, reject) => {
    try {
      const stmt = db.prepare(sql);
      stmt.bind(params);
      const results = [];
      while (stmt.step()) {
        results.push(stmt.getAsObject());
      }
      // sql.js 不需要调用 finalize()
      resolve(results);
    } catch (error) {
      reject(error);
    }
  });
}

// 执行查询并返回单个结果
async function get(sql, params = []) {
  const db = await ensureDatabase();
  return new Promise((resolve, reject) => {
    try {
      const stmt = db.prepare(sql);
      stmt.bind(params);
      let result = null;
      if (stmt.step()) {
        result = stmt.getAsObject();
      }
      // sql.js 不需要调用 finalize()
      resolve(result);
    } catch (error) {
      reject(error);
    }
  });
}

// 导出数据库操作函数
module.exports = {
  run,
  all,
  get,
  initDatabase
};
