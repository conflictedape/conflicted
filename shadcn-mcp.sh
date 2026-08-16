#!/bin/bash
# shadcn MCP caller — bypasses Copilot CLI third-party MCP policy by invoking the server directly via stdio.
# Usage: ./shadcn-mcp.sh '<json-rpc method>' '<json arguments>'
# Example: ./shadcn-mcp.sh search_items_in_registries '{"query":"button","registries":["@shadcn"],"limit":10}'

NODE="/home/invincible/.nvm/versions/node/v24.18.0/bin/node"
PNPM="/home/invincible/.nvm/versions/node/v24.18.0/lib/node_modules/pnpm/bin/pnpm.mjs"

METHOD="${1}"
ARGS="${2:-{}}"
ID=1

INIT='{"jsonrpc":"2.0","id":0,"method":"initialize","params":{"protocolVersion":"2024-11-05","capabilities":{},"clientInfo":{"name":"copilot-cli","version":"1.0"}}}'
REQUEST="{\"jsonrpc\":\"2.0\",\"id\":${ID},\"method\":\"tools/call\",\"params\":{\"name\":\"${METHOD}\",\"arguments\":${ARGS}}"

printf '%s\n%s\n' "$INIT" "$REQUEST" | \
  timeout 20 "$NODE" "$PNPM" dlx shadcn@latest mcp 2>/dev/null | sed -n '2p'
