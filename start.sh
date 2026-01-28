#!/bin/bash

echo "🚀 Starting Solana Wallet Story..."
echo ""
echo "📍 Project: Solana Wallet Story"
echo "🌐 URL: http://localhost:3000"
echo "🔧 Demo Address: EaPKB85tWK6Dt4vhRTR9snZtiV8jckndTRh71xo2bUDN"
echo ""

# Check if .env.local exists
if [ ! -f .env.local ]; then
    echo "⚠️  Warning: .env.local not found"
    echo "Creating .env.local with default values..."
    cat > .env.local << EOF
SOLANA_RPC=https://mainnet.helius-rpc.com/?api-key=3d607f53-8e73-4b4d-b211-204f4863f70b
ZHIPU_API_KEY=142ec32e22ff4061b2a54a0b09d99a6c.8ZeyWwSEIE5bEJBC
ZHIPU_BASE_URL=https://open.bigmodel.cn/api/coding/paas/v4
ZHIPU_MODEL=glm4.7
EOF
fi

# Start the dev server
npm run dev
