// Cloudflare Worker API

// 初始化数据库表
async function initDatabase(env) {
  try {
    // 创建用户表
    await env.DB.exec(`
      CREATE TABLE IF NOT EXISTS users (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        username TEXT UNIQUE,
        email TEXT UNIQUE,
        password TEXT,
        role TEXT DEFAULT 'user',
        create_time DATETIME DEFAULT CURRENT_TIMESTAMP
      )
    `);

    // 创建订单表
    await env.DB.exec(`
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

    console.log('数据库初始化成功');
  } catch (error) {
    console.error('数据库初始化失败:', error);
  }
}

// 处理CORS
function handleCORS(request) {
  const headers = new Headers({
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type, Authorization',
  });

  if (request.method === 'OPTIONS') {
    return new Response(null, { headers });
  }

  return headers;
}

// 处理API请求
async function handleRequest(request, env) {
  // 初始化数据库
  await initDatabase(env);

  // 处理CORS
  const corsHeaders = handleCORS(request);
  if (request.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  const url = new URL(request.url);
  const path = url.pathname;

  try {
    // 注册接口
    if (path === '/api/auth/register' && request.method === 'POST') {
      const data = await request.json();
      const { username, email, password, role = 'user' } = data;

      if (!username || !email || !password) {
        return new Response(JSON.stringify({ error: '用户名、邮箱和密码不能为空' }), {
          status: 400,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' }
        });
      }

      // 检查用户是否存在
      const existingUser = await env.DB.prepare(
        'SELECT * FROM users WHERE username = ? OR email = ?'
      ).bind(username, email).first();

      if (existingUser) {
        return new Response(JSON.stringify({ error: '用户名或邮箱已存在' }), {
          status: 400,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' }
        });
      }

      // 创建用户
      await env.DB.prepare(
        'INSERT INTO users (username, email, password, role) VALUES (?, ?, ?, ?)'
      ).bind(username, email, password, role).run();

      // 获取新用户
      const newUser = await env.DB.prepare(
        'SELECT id, username, email, role, create_time FROM users WHERE username = ?'
      ).bind(username).first();

      return new Response(JSON.stringify(newUser), {
        status: 201,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      });
    }

    // 登录接口
    if (path === '/api/auth/login' && request.method === 'POST') {
      const data = await request.json();
      const { username, password, role = 'user' } = data;

      if (!username || !password) {
        return new Response(JSON.stringify({ error: '用户名和密码不能为空' }), {
          status: 400,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' }
        });
      }

      const user = await env.DB.prepare(
        'SELECT * FROM users WHERE username = ? AND password = ?'
      ).bind(username, password).first();

      if (!user) {
        return new Response(JSON.stringify({ error: '用户名或密码错误' }), {
          status: 401,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' }
        });
      }

      if (role === 'admin' && user.role !== 'admin') {
        return new Response(JSON.stringify({ error: '没有管理权限' }), {
          status: 403,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' }
        });
      }

      // 不返回密码
      const { password: _, ...userWithoutPassword } = user;

      return new Response(JSON.stringify(userWithoutPassword), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      });
    }

    // 订单相关接口
    if (path === '/api/orders') {
      if (request.method === 'GET') {
        const orders = await env.DB.prepare(
          'SELECT * FROM orders ORDER BY create_time DESC'
        ).all();
        return new Response(JSON.stringify(orders), {
          headers: { ...corsHeaders, 'Content-Type': 'application/json' }
        });
      }

      if (request.method === 'POST') {
        const data = await request.json();
        const { customerName, customerPhone, customerAddress, items, totalAmount } = data;

        if (!customerName || !customerPhone || !items || items.length === 0) {
          return new Response(JSON.stringify({ error: '请填写完整的订单信息' }), {
            status: 400,
            headers: { ...corsHeaders, 'Content-Type': 'application/json' }
          });
        }

        const itemsJson = JSON.stringify(items);
        await env.DB.prepare(
          'INSERT INTO orders (customerName, customerPhone, customerAddress, items, totalAmount, status) VALUES (?, ?, ?, ?, ?, ?)'
        ).bind(customerName, customerPhone, customerAddress, itemsJson, totalAmount, 'pending').run();

        const newOrder = await env.DB.prepare(
          'SELECT * FROM orders ORDER BY id DESC LIMIT 1'
        ).first();

        return new Response(JSON.stringify(newOrder), {
          status: 201,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' }
        });
      }
    }

    // 订单详情接口
    if (path.match(/^\/api\/orders\/\d+$/) && request.method === 'GET') {
      const id = path.split('/').pop();
      const order = await env.DB.prepare(
        'SELECT * FROM orders WHERE id = ?'
      ).bind(id).first();

      if (!order) {
        return new Response(JSON.stringify({ error: '订单不存在' }), {
          status: 404,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' }
        });
      }

      return new Response(JSON.stringify(order), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      });
    }

    // 更新订单状态
    if (path.match(/^\/api\/orders\/\d+\/status$/) && request.method === 'PUT') {
      const id = path.split('/')[3];
      const data = await request.json();
      const { status } = data;

      if (!status) {
        return new Response(JSON.stringify({ error: '订单状态不能为空' }), {
          status: 400,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' }
        });
      }

      await env.DB.prepare(
        'UPDATE orders SET status = ? WHERE id = ?'
      ).bind(status, id).run();

      const updatedOrder = await env.DB.prepare(
        'SELECT * FROM orders WHERE id = ?'
      ).bind(id).first();

      return new Response(JSON.stringify(updatedOrder), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      });
    }

    // 404
    return new Response(JSON.stringify({ error: '接口不存在' }), {
      status: 404,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' }
    });

  } catch (error) {
    console.error('API错误:', error);
    return new Response(JSON.stringify({ error: '服务器内部错误' }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' }
    });
  }
}

export default {
  async fetch(request, env) {
    return handleRequest(request, env);
  }
};