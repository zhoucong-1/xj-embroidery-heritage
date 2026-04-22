// Cloudflare Worker API

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
  // 处理CORS
  const corsHeaders = handleCORS(request);
  if (request.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  const url = new URL(request.url);
  const path = url.pathname;

  try {
    // 根路径
    if (path === '/') {
      return new Response('Welcome to xj-embroidery API!', {
        headers: { ...corsHeaders, 'Content-Type': 'text/plain' }
      });
    }

    // 健康检查
    if (path === '/health') {
      return new Response(JSON.stringify({ status: 'ok' }), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      });
    }

    // 用户注册
    if (path === '/api/auth/register' && request.method === 'POST') {
      const data = await request.json();
      
      // 插入用户数据
      const result = await env.DB.prepare(
        'INSERT INTO users (username, email, password, role) VALUES (?, ?, ?, ?)'
      ).bind(data.username, data.email, data.password, data.role || 'user').run();
      
      // 查询创建的用户
      const user = await env.DB.prepare(
        'SELECT id, username, email, role, create_time FROM users WHERE id = ?'
      ).bind(result.lastInsertRowid).first();
      
      return new Response(JSON.stringify(user), {
        status: 201,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      });
    }

    // 用户登录
    if (path === '/api/auth/login' && request.method === 'POST') {
      const data = await request.json();
      
      // 查询用户
      const user = await env.DB.prepare(
        'SELECT id, username, email, role, create_time FROM users WHERE username = ? AND password = ?'
      ).bind(data.username, data.password).first();
      
      if (!user) {
        return new Response(JSON.stringify({ error: '用户名或密码错误' }), {
          status: 401,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' }
        });
      }
      
      return new Response(JSON.stringify(user), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      });
    }

    // 创建订单
    if (path === '/api/orders' && request.method === 'POST') {
      const data = await request.json();
      
      // 插入订单数据
      const result = await env.DB.prepare(
        'INSERT INTO orders (customerName, customerPhone, customerAddress, items, totalAmount, status) VALUES (?, ?, ?, ?, ?, ?)'
      ).bind(
        data.customerName,
        data.customerPhone,
        data.customerAddress,
        JSON.stringify(data.items),
        data.totalAmount,
        data.status || 'pending'
      ).run();
      
      // 查询创建的订单
      const order = await env.DB.prepare(
        'SELECT id, customerName, customerPhone, customerAddress, items, totalAmount, status, create_time FROM orders WHERE id = ?'
      ).bind(result.lastInsertRowid).first();
      
      // 解析items字段
      if (order && order.items) {
        order.items = JSON.parse(order.items);
      }
      
      return new Response(JSON.stringify(order), {
        status: 201,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      });
    }

    // 获取订单列表
    if (path === '/api/orders' && request.method === 'GET') {
      const orders = await env.DB.prepare(
        'SELECT id, customerName, customerPhone, customerAddress, items, totalAmount, status, create_time FROM orders ORDER BY create_time DESC'
      ).all();
      
      // 解析items字段
      const parsedOrders = orders.results.map(order => {
        if (order.items) {
          order.items = JSON.parse(order.items);
        }
        return order;
      });
      
      return new Response(JSON.stringify(parsedOrders), {
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
    try {
      return handleRequest(request, env);
    } catch (error) {
      console.error('Worker错误:', error);
      return new Response('Worker错误', { status: 500 });
    }
  }
};