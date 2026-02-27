#!/usr/bin/env node

import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";

import { registerMessagingTools } from "./tools/messaging.js";
import { registerChatTools } from "./tools/chat.js";
import { registerGroupTools } from "./tools/groups.js";

const server = new McpServer({
  name: "mcp-evolution-api",
  version: "1.0.0",
});

registerMessagingTools(server);
registerChatTools(server);
registerGroupTools(server);

async function main() {
  const transport = new StdioServerTransport();
  await server.connect(transport);
  console.error("mcp-evolution-api server running on stdio");
}

main().catch((error) => {
  console.error("Fatal error:", error);
  process.exit(1);
});
