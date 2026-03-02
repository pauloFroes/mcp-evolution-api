import type { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { apiRequest, instanceBaseUrl, toolResult, toolError } from "../client.js";

export function registerInstanceTools(server: McpServer) {
  // --- Check connection ---
  server.registerTool(
    "check_connection",
    {
      title: "Check Connection",
      description:
        "Check the connection status of the WhatsApp instance. Returns state (open/close/connecting).",
      inputSchema: {},
      annotations: {
        readOnlyHint: true,
        destructiveHint: false,
        openWorldHint: true,
      },
    },
    async () => {
      try {
        const data = await apiRequest(
          instanceBaseUrl("connectionState"),
          "GET",
        );
        return toolResult(data);
      } catch (error) {
        return toolError(`Failed to check connection: ${(error as Error).message}`);
      }
    },
  );
}
