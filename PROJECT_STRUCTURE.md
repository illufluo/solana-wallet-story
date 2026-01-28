# Solana Wallet Story - 项目结构

## 📁 文件结构

```
solana-story/
├── app/                          # Next.js App Router
│   ├── api/
│   │   └── analyze/
│   │       └── route.ts         # 主 API 端点：分析钱包交易
│   ├── layout.tsx               # 根布局
│   ├── page.tsx                 # 主页面
│   └── globals.css              # 全局样式
│
├── components/                   # React 组件
│   ├── WalletAnalyzer.tsx       # 主分析器组件（搜索 + 标签页）
│   ├── TransactionTimeline.tsx  # 交易时间线视图
│   └── FrictionView.tsx         # 摩擦分析视图
│
├── lib/                         # 核心逻辑
│   ├── solana-analyzer.ts       # Solana 区块链数据分析
│   └── llm-narrator.ts          # LLM 叙述生成（带容错）
│
├── types/                       # TypeScript 类型定义
│   └── solana.ts                # 所有类型定义
│
├── .env.local                   # 环境变量（包含 API keys）
├── package.json                 # 依赖和脚本
├── tsconfig.json                # TypeScript 配置
├── next.config.ts               # Next.js 配置
├── start.sh                     # 快速启动脚本
├── README.md                    # 项目文档
└── PROJECT_STRUCTURE.md         # 本文件
```

## 🔑 核心文件说明

### 1. API 层 (`app/api/analyze/route.ts`)
- **功能**: 接收钱包地址，返回分析数据
- **流程**:
  1. 验证钱包地址
  2. 调用 `solana-analyzer` 获取交易
  3. 可选调用 `llm-narrator` 生成 AI 叙述
  4. 计算统计数据和摩擦指标
- **端点**: `GET /api/analyze?address=XXX&limit=50&narrative=true`

### 2. Solana 分析器 (`lib/solana-analyzer.ts`)
- **核心函数**:
  - `analyzeWalletTransactions()`: 获取并分析交易
  - `classifyTransaction()`: 基于规则的交易分类
  - `generateDescription()`: 生成人类可读的描述
  - `calculateFrictionMetrics()`: 计算摩擦指标
- **RPC 优化**: 批量请求 + 延迟，避免速率限制

### 3. LLM 叙述器 (`lib/llm-narrator.ts`)
- **功能**: 使用智谱 AI 生成交易叙述
- **容错设计**:
  - 如果没有 API key，静默跳过
  - 15 秒超时
  - 任何错误都返回 null（不影响主功能）
- **批量处理**: 只为最近的 10 笔交易生成叙述（节省时间和成本）

### 4. 前端组件

#### WalletAnalyzer (`components/WalletAnalyzer.tsx`)
- 搜索输入框
- 加载状态
- 错误处理
- 统计卡片（总交易数、成功率、总费用、平均复杂度）
- 标签页切换

#### TransactionTimeline (`components/TransactionTimeline.tsx`)
- 时间线视图
- 交易类型图标和颜色编码
- AI 叙述显示（如果有）
- 交易详情（费用、指令数、slot）
- 可展开的签名

#### FrictionView (`components/FrictionView.tsx`)
- 总体摩擦评分（0-100）
- 关键指标卡片
- 交易类型分布柱状图
- 复杂度分布（简单/中等/复杂/非常复杂）
- 费用分布（低/中/高）
- 失败原因分析

## 🎨 设计决策

### 1. 交易分类
使用简单的日志匹配进行分类：
- Transfer: 包含 "transfer"
- Swap/DEX: 包含 "swap", "raydium", "jupiter"
- Staking: 包含 "stake"
- NFT: 包含 "nft", "metaplex"
- Vote: 包含 "vote"
- Account Creation: 包含 "create account"

这种方法简单但有效，适合 hackathon 范围。

### 2. 摩擦评分算法
```
frictionScore = 
  (100 - successRate) * 0.4 +     // 失败率权重 40%
  min(avgComplexity * 5, 40) +    // 复杂度权重最多 40%
  min(totalCost * 1000, 20)       // 成本权重最多 20%
```

分级：
- 0-20: Low Friction
- 20-50: Moderate Friction
- 50+: High Friction

### 3. RPC 速率限制处理
- 批量大小：每批 10 个交易
- 批次间延迟：200ms
- 先获取签名（轻量），再批量获取详情

### 4. LLM 集成策略
- 只为最近 10 笔交易生成叙述
- 15 秒总超时
- 失败时优雅降级（显示基础描述）
- 不阻塞主数据加载

## 🚀 运行指南

### 方法 1: 使用启动脚本
```bash
./start.sh
```

### 方法 2: 手动启动
```bash
npm run dev
```

访问 http://localhost:3000

### 方法 3: 生产构建
```bash
npm run build
npm start
```


## 📊 数据流

```
用户输入地址
    ↓
WalletAnalyzer 组件
    ↓
API /api/analyze
    ↓
solana-analyzer.ts
    ├→ 获取交易签名
    ├→ 批量获取交易详情
    ├→ 分类和描述
    └→ 计算指标
    ↓
llm-narrator.ts (可选)
    └→ 生成 AI 叙述
    ↓
返回 JSON 数据
    ↓
显示在 UI
    ├→ TransactionTimeline
    └→ FrictionView
```
