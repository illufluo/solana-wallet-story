# 项目名称

Solana Wallet Story - 链上活动可视化分析工具

## 💻 项目 Repo

https://github.com/illufluo/solana-wallet-story

> ⚠️ 注意：提交前需要将代码推送到 GitHub，并在上面填入实际的 repo 链接

## 📌 项目简介

**Solana Wallet Story** 是一个专注于提升 Solana 用户体验的链上活动可视化工具。给定任何 Solana 主网钱包地址，它能以时间线形式呈现所有交易历史，并提供独特的"摩擦分析"视图，帮助用户理解在 Solana 上的操作成本和难度。

与传统区块链浏览器不同，本项目不关注交易或盈利，而是将冰冷的链上数据转化为人类友好的故事。通过简单的规则分类和可选的 AI 叙述生成，让每个人都能轻松理解钱包在链上"做了什么"。项目还创新性地引入了"摩擦评分"概念，综合成功率、交易复杂度和费用成本，量化用户使用 Solana 的体验。

## 🛠️ 技术栈

- **前端框架**: Next.js 16 (App Router) + React 19 + TypeScript
- **样式**: Tailwind CSS 4
- **区块链**: @solana/web3.js (Solana 主网 RPC 集成)
- **AI 服务**: 智谱 AI GLM-4 (可选的交易叙述生成)
- **部署**: Vercel (或本地运行)

## 🎬 Demo 演示

### 演示链接
- 🌐 本地运行：http://localhost:3000
- 🎥 视频演示：[待录制后填写]
- 🖼️ 在线 Demo：[如部署到 Vercel 后填写]

### 测试地址
使用默认测试钱包查看效果：
```
EaPKB85tWK6Dt4vhRTR9snZtiV8jckndTRh71xo2bUDN
```

### 功能截图

> 💡 提示：启动应用后截图，或使用以下描述：
- 截图 1：主页面 - 渐变背景 + 搜索框 + 统计卡片
- 截图 2：交易时间线视图 - 带图标和 AI 叙述的交易列表
- 截图 3：摩擦分析视图 - 评分、分布图、失败分析

## 💡 核心功能

1. **交易时间线可视化** - 以直观的时间线形式展示钱包的所有链上活动，自动分类交易类型（Transfer、Swap、Staking、NFT 等）

2. **摩擦/成本分析** - 独创的摩擦评分系统，综合评估成功率、交易复杂度和费用，帮助理解在 Solana 上的操作体验

3. **AI 智能叙述** - 可选的 AI 功能，将技术性的交易数据转化为人类友好的简短故事（1-2 句话）

4. **RPC 优化设计** - 批量请求 + 智能延迟，优雅处理 RPC 速率限制，确保数据获取稳定

5. **优雅降级机制** - 即使 AI 服务失败，核心功能仍完全可用，展示出色的容错设计

## 🚀 快速启动

```bash
# 进入项目目录
cd solana-story

# 安装依赖（已完成）
npm install

# 启动开发服务器
npm run dev

# 访问
http://localhost:3000
```

## 📁 项目亮点

- ✅ **1 天 Hackathon 范围** - 功能完整但不过度工程化
- ✅ **清晰的代码结构** - 易于理解和扩展
- ✅ **完善的文档** - README、测试指南、架构说明齐全
- ✅ **创新的视角** - 关注用户体验而非金融指标
- ✅ **实用性强** - 即刻可用的工具

## ✍️ 项目创作者

1. **创作者昵称**: [你的昵称]
2. **创作者联系方式**: [你的邮箱/Twitter/Telegram]
3. **创作者 Solana USDC 钱包地址**: [你的 Solana 钱包地址]

---

## 📝 补充说明

### 环境变量配置
项目需要以下环境变量（已在 `.env.local` 中配置）：
- `SOLANA_RPC`: Solana RPC 端点
- `ZHIPU_API_KEY`: 智谱 AI API Key（可选）
- `ZHIPU_BASE_URL`: 智谱 AI 接口地址
- `ZHIPU_MODEL`: 使用的模型名称

### 项目文件结构
```
solana-story/
├── app/              # Next.js 页面和 API
├── components/       # React 组件
├── lib/              # 核心逻辑
├── types/            # TypeScript 类型
└── docs/             # 完整文档
```

完整文档请查看 `README.md` 和 `PROJECT_STRUCTURE.md`。
