#!/bin/bash

echo "🚀 Solana Wallet Story - 快速提交脚本"
echo "======================================="
echo ""

# 颜色定义
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# 检查是否在正确的目录
if [ ! -f "package.json" ]; then
    echo -e "${RED}❌ 错误：请在项目根目录运行此脚本${NC}"
    exit 1
fi

echo -e "${BLUE}📋 提交前检查...${NC}"
echo ""

# 检查 demo.md 是否已更新
if grep -q "\[你的昵称\]" demo.md 2>/dev/null; then
    echo -e "${YELLOW}⚠️  警告：demo.md 中的个人信息尚未填写！${NC}"
    echo ""
    echo "请先编辑 demo.md 文件，填写："
    echo "  1. 创作者昵称"
    echo "  2. 创作者联系方式"
    echo "  3. Solana 钱包地址"
    echo ""
    read -p "是否已完成填写？(y/N) " -n 1 -r
    echo
    if [[ ! $REPLY =~ ^[Yy]$ ]]; then
        echo -e "${RED}❌ 已取消。请先完成 demo.md 的填写。${NC}"
        exit 1
    fi
fi

# 询问 GitHub 用户名
echo -e "${BLUE}📝 请输入你的 GitHub 用户名：${NC}"
read -p "GitHub 用户名: " github_username

if [ -z "$github_username" ]; then
    echo -e "${RED}❌ GitHub 用户名不能为空${NC}"
    exit 1
fi

echo ""
echo -e "${GREEN}✅ GitHub 用户名：$github_username${NC}"
echo ""

# 更新 demo.md 中的 GitHub 链接
if [[ "$OSTYPE" == "darwin"* ]]; then
    # macOS
    sed -i '' "s|https://github.com/\[你的-github-用户名\]/solana-wallet-story|https://github.com/$github_username/solana-wallet-story|g" demo.md
else
    # Linux
    sed -i "s|https://github.com/\[你的-github-用户名\]/solana-wallet-story|https://github.com/$github_username/solana-wallet-story|g" demo.md
fi

echo -e "${GREEN}✅ 已更新 demo.md 中的 GitHub 链接${NC}"
echo ""

# 检查 Git 配置
if ! git config user.name > /dev/null 2>&1; then
    echo -e "${YELLOW}⚠️  Git 用户名未配置${NC}"
    read -p "请输入你的名字: " git_name
    git config --global user.name "$git_name"
fi

if ! git config user.email > /dev/null 2>&1; then
    echo -e "${YELLOW}⚠️  Git 邮箱未配置${NC}"
    read -p "请输入你的邮箱: " git_email
    git config --global user.email "$git_email"
fi

echo ""
echo -e "${BLUE}🔄 开始 Git 操作...${NC}"
echo ""

# 初始化 Git（如果需要）
if [ ! -d ".git" ]; then
    echo "初始化 Git 仓库..."
    git init
    echo -e "${GREEN}✅ Git 仓库已初始化${NC}"
else
    echo -e "${GREEN}✅ Git 仓库已存在${NC}"
fi

# 添加所有文件
echo "添加文件到 Git..."
git add .

# 提交
echo "提交代码..."
git commit -m "feat: Solana Wallet Story - 链上活动可视化 Hackathon 项目

- 实现交易时间线视图
- 实现摩擦/成本分析
- 集成 AI 叙述生成（智谱 AI）
- 完整的文档和测试指南
- 支持任意 Solana 钱包地址分析"

# 检查是否已有 remote
if git remote | grep -q "origin"; then
    echo -e "${YELLOW}⚠️  Remote 'origin' 已存在，将更新为新地址${NC}"
    git remote remove origin
fi

# 添加 remote
echo "连接到 GitHub 仓库..."
git remote add origin "https://github.com/$github_username/solana-wallet-story.git"

# 设置主分支
git branch -M main

echo ""
echo -e "${GREEN}✅ Git 配置完成！${NC}"
echo ""
echo -e "${YELLOW}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"
echo ""
echo -e "${BLUE}📤 准备推送到 GitHub...${NC}"
echo ""
echo "请确保你已经："
echo "  1. ✅ 在 GitHub 上创建了名为 'solana-wallet-story' 的仓库"
echo "  2. ✅ 仓库设置为 Public（公开）"
echo ""
echo "如果还没有创建，请访问："
echo -e "${GREEN}https://github.com/new${NC}"
echo ""
read -p "是否已准备好推送？(y/N) " -n 1 -r
echo

if [[ ! $REPLY =~ ^[Yy]$ ]]; then
    echo ""
    echo -e "${YELLOW}⚠️  已取消推送。${NC}"
    echo ""
    echo "当你准备好后，手动运行："
    echo -e "${GREEN}git push -u origin main${NC}"
    exit 0
fi

echo ""
echo "推送代码到 GitHub..."
echo ""

# 推送
if git push -u origin main; then
    echo ""
    echo -e "${GREEN}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"
    echo -e "${GREEN}🎉 提交成功！${NC}"
    echo -e "${GREEN}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"
    echo ""
    echo -e "${BLUE}📝 你的项目地址：${NC}"
    echo -e "${GREEN}https://github.com/$github_username/solana-wallet-story${NC}"
    echo ""
    echo -e "${BLUE}📋 下一步：${NC}"
    echo "  1. 访问上面的链接，确认代码已上传"
    echo "  2. 在 demo.md 中填写演示视频链接（如果有）"
    echo "  3. 提交 demo.md 到 Hackathon 平台"
    echo ""
    echo -e "${BLUE}💡 可选步骤：${NC}"
    echo "  • 部署到 Vercel: https://vercel.com/new"
    echo "  • 录制演示视频"
    echo "  • 在 README 中添加截图"
    echo ""
    echo -e "${GREEN}🏆 祝你 Hackathon 取得好成绩！${NC}"
    echo ""
else
    echo ""
    echo -e "${RED}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"
    echo -e "${RED}❌ 推送失败${NC}"
    echo -e "${RED}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"
    echo ""
    echo -e "${YELLOW}可能的原因：${NC}"
    echo "  1. GitHub 仓库尚未创建"
    echo "  2. 需要 GitHub 认证（token 或 SSH）"
    echo "  3. 网络连接问题"
    echo ""
    echo -e "${BLUE}解决方案：${NC}"
    echo ""
    echo "方案 1 - 使用 GitHub CLI (推荐):"
    echo -e "${GREEN}  brew install gh${NC}  # 安装 gh cli"
    echo -e "${GREEN}  gh auth login${NC}    # 登录 GitHub"
    echo -e "${GREEN}  git push -u origin main${NC}"
    echo ""
    echo "方案 2 - 使用 Personal Access Token:"
    echo "  1. 访问 https://github.com/settings/tokens"
    echo "  2. 生成新 token (repo 权限)"
    echo "  3. 使用 token 作为密码推送"
    echo ""
    echo "方案 3 - 先在 GitHub 网站创建仓库:"
    echo "  1. 访问 https://github.com/new"
    echo "  2. 仓库名: solana-wallet-story"
    echo "  3. 设为 Public"
    echo "  4. 不要初始化 README"
    echo "  5. 创建后再次运行 'git push -u origin main'"
    echo ""
    exit 1
fi
