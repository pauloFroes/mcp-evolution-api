import type { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { z } from "zod";
import { apiRequest, groupUrl, instanceBaseUrl, toolResult, toolError } from "../client.js";

export function registerGroupTools(server: McpServer) {
  // --- List groups ---
  server.registerTool(
    "list_groups",
    {
      title: "List Groups",
      description:
        "List all WhatsApp groups the connected number participates in.",
      inputSchema: {
        get_participants: z
          .boolean()
          .optional()
          .describe("Include participant list for each group (default: false)"),
      },
      annotations: {
        readOnlyHint: true,
        destructiveHint: false,
        openWorldHint: true,
      },
    },
    async ({ get_participants }) => {
      try {
        const data = await apiRequest(
          groupUrl("fetchAllGroups"),
          "GET",
          undefined,
          { getParticipants: get_participants ? "true" : "false" },
        );
        return toolResult(data);
      } catch (error) {
        return toolError(`Failed to list groups: ${(error as Error).message}`);
      }
    },
  );

  // --- Group participants ---
  server.registerTool(
    "group_participants",
    {
      title: "Group Participants",
      description: "List all members/participants of a specific WhatsApp group.",
      inputSchema: {
        group_jid: z
          .string()
          .describe("Group JID (e.g. 120363012345678901@g.us)"),
      },
      annotations: {
        readOnlyHint: true,
        destructiveHint: false,
        openWorldHint: true,
      },
    },
    async ({ group_jid }) => {
      try {
        const data = await apiRequest(
          groupUrl("participants"),
          "GET",
          undefined,
          { groupJid: group_jid },
        );
        return toolResult(data);
      } catch (error) {
        return toolError(`Failed to get group participants: ${(error as Error).message}`);
      }
    },
  );

  // --- Find group ---
  server.registerTool(
    "find_group",
    {
      title: "Find Group",
      description: "Get detailed information about a specific WhatsApp group by JID.",
      inputSchema: {
        group_jid: z
          .string()
          .describe("Group JID (e.g. 120363012345678901@g.us)"),
      },
      annotations: {
        readOnlyHint: true,
        destructiveHint: false,
        openWorldHint: true,
      },
    },
    async ({ group_jid }) => {
      try {
        const data = await apiRequest(
          groupUrl("findGroupInfos"),
          "GET",
          undefined,
          { groupJid: group_jid },
        );
        return toolResult(data);
      } catch (error) {
        return toolError(`Failed to find group: ${(error as Error).message}`);
      }
    },
  );

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
