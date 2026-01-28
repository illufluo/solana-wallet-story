# Solana Wallet Story

一个用于可视化和理解 Solana 钱包链上活动的工具。

## 功能特点

### 📜 交易时间线
- 以时间线形式展示钱包的所有交易
- 自动分类交易类型（转账、Swap、质押、NFT 等）
- 显示交易状态、费用、指令数量
- 可选的 AI 生成的交易叙述（更人性化的解释）

### ⚡ 摩擦分析
- 总体摩擦评分（基于成功率、复杂度和成本）
- 成功率统计
- 交易类型分布
- 复杂度分布（简单、中等、复杂、非常复杂）
- 费用分布分析
- 失败原因分析

## 技术栈

- **前端**: Next.js 16 + React 19 + TypeScript + Tailwind CSS 4
- **区块链**: @solana/web3.js
- **AI 叙述**: 智谱 AI (可选)

## 快速开始

### 1. 安装依赖

```bash
npm install
```

### 2. 配置环境变量

创建 `.env.local` 文件：

```env
# Solana RPC Configuration

# Helius:
SOLANA_RPC=https://mainnet.helius-rpc.com/?api-key=YOUR_API_KEY


# ============================================
# OpenAI-Compatible LLM Configuration (可选)
# ============================================
# 支持任何 OpenAI 兼容的 API 提供商
# 如果留空，AI 叙述功能将被禁用（核心功能不受影响）

LLM_API_KEY=
LLM_BASE_URL=
LLM_MODEL=

# ============================================
# 配置示例
# ============================================


# 示例 : 任何其他 OpenAI 兼容的 API
# LLM_API_KEY=your-api-key-here
# LLM_BASE_URL=https://your-provider.com/v1
# LLM_MODEL=your-model-name

```

### 3. 启动开发服务器

```bash
npm run dev
```

应用将在 http://localhost:3000 启动。

### 4. 测试

默认使用测试地址：`EaPKB85tWK6Dt4vhRTR9snZtiV8jckndTRh71xo2bUDN`

## 使用方法

1. 在搜索框输入任何 Solana 主网钱包地址
2. 点击 "Analyze" 或按回车键
3. 可选：勾选 "Generate AI narratives" 来获得 AI 生成的交易解释（会慢一些）
4. 查看两个标签页：
   - **Transaction Timeline**: 按时间顺序查看所有交易
   - **Friction Analysis**: 查看钱包使用的摩擦程度和统计数据

