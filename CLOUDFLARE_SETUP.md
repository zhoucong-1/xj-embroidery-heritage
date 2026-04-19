# Cloudflare Pages 自动部署设置指南

## 步骤 1：获取 Cloudflare 凭证

### 1.1 获取 Cloudflare Account ID
1. 登录 [Cloudflare Dashboard](https://dash.cloudflare.com/)
2. 选择您的账户（右下角）
3. 复制页面顶部的 **Account ID**

### 1.2 创建 Cloudflare API Token
1. 进入 [API Tokens 页面](https://dash.cloudflare.com/profile/api-tokens)
2. 点击 **Create Token**
3. 选择 **Custom token** → **Get started**
4. 配置权限：
   - **Account**:
     - `Cloudflare Pages`: `Edit`
   - **Zone**:
     - `Zone Settings`: `Read`
     - `Zone DNS`: `Edit`
5. 设置 **Account Resources**:
   - Include: `Specific account` → 选择您的账户
6. 点击 **Continue to Summary**
7. 点击 **Create Token**
8. **重要**：复制生成的 API Token（只会显示一次！）

## 步骤 2：在 GitHub 仓库中配置密钥

1. 打开 GitHub 仓库: https://github.com/zhoucong-1/xj-embroidery-heritage
2. 进入 **Settings** → **Secrets and variables** → **Actions**
3. 点击 **New repository secret**，添加以下两个密钥：

### 添加 CLOUDFLARE_ACCOUNT_ID
- **Name**: `CLOUDFLARE_ACCOUNT_ID`
- **Secret**: 您刚才复制的 Account ID

### 添加 CLOUDFLARE_API_TOKEN
- **Name**: `CLOUDFLARE_API_TOKEN`
- **Secret**: 您刚才创建的 API Token

## 步骤 3：启用 GitHub Actions

1. 在 GitHub 仓库页面，进入 **Actions** 标签
2. 如果看到 "Workflows need to be enabled" 提示，点击 **I understand my workflows, go ahead and enable them**

## 步骤 4：推送代码触发部署

1. 将更改推送到 GitHub：
   ```bash
   git add .
   git commit -m "添加 Cloudflare Pages 自动部署配置"
   git push origin main
   ```

2. 进入 GitHub 仓库的 **Actions** 标签，查看部署状态

3. 部署成功后，Cloudflare 会提供您的网站 URL

## 验证部署

部署完成后，您可以：
1. 在 Cloudflare Dashboard 的 Pages 项目中查看
2. 访问提供的 `.pages.dev` 域名

## 常见问题

### Q: 部署失败怎么办？
A: 检查 GitHub 仓库的 Actions 标签页，查看错误日志

### Q: 如何重新部署？
A: 在 GitHub 仓库中，进入 Actions → Deploy to Cloudflare Pages → Re-run all jobs

### Q: 如何查看 Cloudflare 部署日志？
A: 在 Cloudflare Dashboard → Pages → 选择项目 → 查看 Deployments

---

**注意**: 此配置仅部署前端静态页面。后端 API 需要单独部署。