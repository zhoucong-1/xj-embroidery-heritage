#!/usr/bin/env bash

# Cloudflare Pages 部署脚本
# 用于将前端静态文件部署到 Cloudflare Pages

# 构建输出目录
BUILD_DIR="dist"

# 创建构建目录
mkdir -p $BUILD_DIR

# 复制前端文件到构建目录
cp -r frontend/* $BUILD_DIR/

echo "✅ 前端构建完成！"
echo "📁 构建目录: $BUILD_DIR"
echo ""
echo "下一步："
echo "1. 登录 Cloudflare Dashboard"
echo "2. 进入 Pages 项目"
echo "3. 选择 'Direct Upload' 上传 $BUILD_DIR 目录"
echo "4. 或者使用 Wrangler CLI: wrangler pages deploy $BUILD_DIR"
echo ""
echo "⚠️ 注意：后端 API 需要单独部署或使用 Cloudflare Workers 重写"