# Cloudflare Configuration

## Cloudflare Pages 部署说明

### 快速部署前端静态页面

1. **登录 Cloudflare Dashboard**
   - 访问: https://dash.cloudflare.com/
   - 进入 Pages 项目

2. **创建新项目**
   - 选择 "Create a project"
   - 选择 "Direct Upload" 选项

3. **上传文件**
   - 将 `frontend` 目录下的所有文件上传
   - 目录结构:
     ```
     frontend/
     ├── css/
     │   └── style.css
     ├── js/
     │   └── app.js
     ├── images/
     ├── about.html
     ├── contact.html
     ├── craft.html
     ├── heritage.html
     ├── index.html
     └── news.html
     ```

4. **配置构建设置**（如有需要）
   - Build command: (留空)
   - Build output directory: (留空或填 `/`)

5. **完成部署**
   - 您的网站将获得一个 `.pages.dev` 域名

### API 后端说明

当前项目的后端 API（运行在 Node.js + Express）无法直接部署到 Cloudflare Pages。

**解决方案选项：**

1. **使用 Cloudflare Workers**（需要代码重写）
   - 将 Express API 重写为 Workers 兼容代码
   - 使用 KV 存储替代 sql.js

2. **继续使用本地后端**
   - 前端通过 CORS 访问部署的 API
   - 需要单独部署后端服务

### 环境变量配置

如需连接后端 API，在 Cloudflare Pages 设置中添加：
```
API_URL = https://your-api-domain.com
```

### Wrangler CLI 部署（可选）

```bash
# 安装 Wrangler
npm install -g wrangler

# 登录 Cloudflare
wrangler login

# 部署前端
wrangler pages deploy frontend --project-name=xj-embroidery-heritage
```

---

**注意**: 此配置适用于前端静态网站部署。后端服务需要单独的部署方案。