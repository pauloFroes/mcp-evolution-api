import type { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { z } from "zod";
import { apiRequest, groupUrl, toolResult, toolError } from "../client.js";

export function registerGroupTools(server: McpServer) {
  // --- Create group ---
  server.registerTool(
    "create_group",
    {
      title: "Create Group",
      description:
        "Create a new WhatsApp group with specified participants.",
      inputSchema: {
        subject: z
          .string()
          .min(1)
          .describe("Group name/subject"),
        participants: z
          .array(z.string())
          .min(1)
          .describe("Phone numbers to add as participants (with country code, no +)"),
        description: z
          .string()
          .optional()
          .describe("Optional group description"),
      },
      annotations: {
        readOnlyHint: false,
        destructiveHint: false,
        openWorldHint: true,
      },
    },
    async ({ subject, participants, description }) => {
      try {
        const body: Record<string, unknown> = {
          subject,
          participants,
        };
        if (description) body.description = description;

        const data = await apiRequest(
          groupUrl("create"),
          "POST",
          body,
        );
        return toolResult(data);
      } catch (error) {
        return toolError(`Failed to create group: ${(error as Error).message}`);
      }
    },
  );

  // --- Fetch invite code ---
  server.registerTool(
    "fetch_invite_code",
    {
      title: "Fetch Invite Code",
      description:
        "Get the invite link/code for a WhatsApp group. Requires admin privileges.",
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
          groupUrl("inviteCode"),
          "GET",
          undefined,
          { groupJid: group_jid },
        );
        return toolResult(data);
      } catch (error) {
        return toolError(`Failed to fetch invite code: ${(error as Error).message}`);
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

  // --- Leave group ---
  server.registerTool(
    "leave_group",
    {
      title: "Leave Group",
      description:
        "Leave a WhatsApp group. This action is irreversible — you will need a new invite to rejoin.",
      inputSchema: {
        group_jid: z
          .string()
          .describe("Group JID (e.g. 120363012345678901@g.us)"),
      },
      annotations: {
        readOnlyHint: false,
        destructiveHint: true,
        openWorldHint: true,
      },
    },
    async ({ group_jid }) => {
      try {
        const data = await apiRequest(
          groupUrl("leaveGroup"),
          "DELETE",
          { groupJid: group_jid },
        );
        return toolResult(data);
      } catch (error) {
        return toolError(`Failed to leave group: ${(error as Error).message}`);
      }
    },
  );

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

  // --- Send group invite ---
  server.registerTool(
    "send_group_invite",
    {
      title: "Send Group Invite",
      description:
        "Send a group invite link to specified phone numbers via WhatsApp.",
      inputSchema: {
        group_jid: z
          .string()
          .describe("Group JID (e.g. 120363012345678901@g.us)"),
        numbers: z
          .array(z.string())
          .min(1)
          .describe("Phone numbers to invite (with country code, no +)"),
        description: z
          .string()
          .optional()
          .describe("Optional invite message description"),
      },
      annotations: {
        readOnlyHint: false,
        destructiveHint: false,
        openWorldHint: true,
      },
    },
    async ({ group_jid, numbers, description }) => {
      try {
        const body: Record<string, unknown> = {
          groupJid: group_jid,
          numbers,
        };
        if (description) body.description = description;

        const data = await apiRequest(
          groupUrl("sendInvite"),
          "POST",
          body,
        );
        return toolResult(data);
      } catch (error) {
        return toolError(`Failed to send group invite: ${(error as Error).message}`);
      }
    },
  );

  // --- Update group description ---
  server.registerTool(
    "update_group_description",
    {
      title: "Update Group Description",
      description:
        "Update the description of a WhatsApp group. Requires admin privileges.",
      inputSchema: {
        group_jid: z
          .string()
          .describe("Group JID (e.g. 120363012345678901@g.us)"),
        description: z
          .string()
          .describe("New group description"),
      },
      annotations: {
        readOnlyHint: false,
        destructiveHint: false,
        openWorldHint: true,
      },
    },
    async ({ group_jid, description }) => {
      try {
        const data = await apiRequest(
          groupUrl("updateGroupDescription"),
          "POST",
          { groupJid: group_jid, description },
        );
        return toolResult(data);
      } catch (error) {
        return toolError(`Failed to update group description: ${(error as Error).message}`);
      }
    },
  );

  // --- Update group picture ---
  server.registerTool(
    "update_group_picture",
    {
      title: "Update Group Picture",
      description:
        "Update the profile picture of a WhatsApp group. Requires admin privileges.",
      inputSchema: {
        group_jid: z
          .string()
          .describe("Group JID (e.g. 120363012345678901@g.us)"),
        image_url: z
          .string()
          .url()
          .describe("Publicly accessible URL of the new group picture"),
      },
      annotations: {
        readOnlyHint: false,
        destructiveHint: false,
        openWorldHint: true,
      },
    },
    async ({ group_jid, image_url }) => {
      try {
        const data = await apiRequest(
          groupUrl("updateGroupPicture"),
          "POST",
          { groupJid: group_jid, image: image_url },
        );
        return toolResult(data);
      } catch (error) {
        return toolError(`Failed to update group picture: ${(error as Error).message}`);
      }
    },
  );

  // --- Update group subject ---
  server.registerTool(
    "update_group_subject",
    {
      title: "Update Group Subject",
      description:
        "Update the name/subject of a WhatsApp group. Requires admin privileges.",
      inputSchema: {
        group_jid: z
          .string()
          .describe("Group JID (e.g. 120363012345678901@g.us)"),
        subject: z
          .string()
          .min(1)
          .describe("New group name/subject"),
      },
      annotations: {
        readOnlyHint: false,
        destructiveHint: false,
        openWorldHint: true,
      },
    },
    async ({ group_jid, subject }) => {
      try {
        const data = await apiRequest(
          groupUrl("updateGroupSubject"),
          "POST",
          { groupJid: group_jid, subject },
        );
        return toolResult(data);
      } catch (error) {
        return toolError(`Failed to update group subject: ${(error as Error).message}`);
      }
    },
  );
}
