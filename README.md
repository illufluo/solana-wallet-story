# Solana Wallet Story

一个用于可视化和理解 Solana 钱包链上活动的 hackathon demo 项目。

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

创建 `.env.local` 文件（已包含在项目中）：

```env
SOLANA_RPC=https://mainnet.helius-rpc.com/?api-key=YOUR_API_KEY
ZHIPU_API_KEY=YOUR_ZHIPU_API_KEY
ZHIPU_BASE_URL=https://open.bigmodel.cn/api/coding/paas/v4
ZHIPU_MODEL=glm4.7
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

## 架构设计

### 后端 API
- `/api/analyze`: 主要的分析端点
  - 获取钱包的签名列表
  - 批量获取交易详情（每批 10 个，避免 RPC 限制）
  - 使用基于规则的分类器识别交易类型
  - 计算摩擦指标
  - 可选地调用 LLM 生成叙述（带超时保护）

### 前端组件
- `WalletAnalyzer`: 主容器组件，处理状态和 API 调用
- `TransactionTimeline`: 时间线视图
- `FrictionView`: 摩擦分析视图

### 核心逻辑
- `lib/solana-analyzer.ts`: Solana 区块链数据分析
- `lib/llm-narrator.ts`: LLM 叙述生成（带优雅降级）

## 设计原则

- **只读**: 不进行任何链上写入操作
- **用户友好**: 将技术细节转化为易于理解的叙述
- **容错性**: 即使 LLM 失败，应用仍可正常工作
- **RPC 友好**: 使用批量请求和延迟来避免速率限制
- **演示优先**: 代码清晰、易于理解，适合 hackathon 展示

## Hackathon 范围

这是一个为期 1 天的 hackathon 项目，专注于：
- ✅ 核心功能完整
- ✅ 用户体验良好
- ✅ 代码清晰易读
- ✅ 演示效果好

不包括：
- ❌ 复杂的链上程序解析
- ❌ 实时数据流
- ❌ 用户认证
- ❌ 数据持久化

## 未来改进方向

- 支持更多交易类型的详细解析
- 添加交易图表和可视化
- 支持多个钱包的对比
- 添加交易搜索和过滤
- 优化 LLM 提示词以获得更好的叙述
- 添加交易导出功能

## License

MIT
