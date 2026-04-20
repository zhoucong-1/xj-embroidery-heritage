# Cloudflare D1 部署指南

## 准备工作

1. **安装 Wrangler CLI**
   ```bash
   npm install -g wrangler
   ```

2. **登录 Cloudflare**
   ```bash
   wrangler login
   ```

## 部署步骤

### 1. 创建 D1 数据库

```bash
wrangler d1 create xj-embroidery
```

### 2. 配置数据库 ID

编辑 `wrangler.toml` 文件，将 `database_id` 替换为实际的数据库 ID：

```toml
[[d1_databases]]
binding = "DB"
database_name = "xj-embroidery"
database_id = "your-database-id"
```

### 3. 部署 Worker

```bash
wrangler deploy
```

### 4. 更新 API 配置

编辑 `frontend/js/config.js` 文件，将 `BASE_URL` 替换为实际的 Worker 地址：

```javascript
const API_CONFIG = {
  BASE_URL: 'https://xj-embroidery-api.your-username.workers.dev'
};
```

## 测试功能

1. **访问登录页面**：
   - Cloudflare Pages 上的登录页面

2. **测试注册**：
   - 注册普通用户和管理员账号

3. **测试登录**：
   - 普通用户登录后跳转到首页
   - 管理员登录后跳转到管理端

4. **测试订单**：
   - 添加商品到购物车
   - 提交订单
   - 在管理端查看订单

## 注意事项

1. **密码安全**：当前实现使用明文存储密码，生产环境建议使用加密存储

2. **CORS 配置**：已在 Worker 中配置了 CORS 头，允许跨域请求

3. **错误处理**：Worker 中添加了基本的错误处理

4. **数据库备份**：建议定期备份 D1 数据库

## 故障排查

- **API 调用失败**：检查 Worker 地址是否正确
- **数据库连接失败**：检查 D1 数据库配置
- **注册失败**：检查用户名和邮箱是否已存在
- **登录失败**：检查用户名和密码是否正确

## 技术支持

如果遇到问题，请参考 Cloudflare 文档或联系 Cloudflare 支持。