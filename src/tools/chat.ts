import type { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { z } from "zod";
import { apiRequest, chatUrl, toolResult, toolError } from "../client.js";

export function registerChatTools(server: McpServer) {
  // --- Archive chat ---
  server.registerTool(
    "archive_chat",
    {
      title: "Archive Chat",
      description:
        "Archive or unarchive a WhatsApp chat.",
      inputSchema: {
        remote_jid: z
          .string()
          .describe("Chat JID (e.g. 5538999999999@s.whatsapp.net or group JID)"),
        archive: z
          .boolean()
          .describe("True to archive, false to unarchive"),
      },
      annotations: {
        readOnlyHint: false,
        destructiveHint: false,
        openWorldHint: true,
      },
    },
    async ({ remote_jid, archive }) => {
      try {
        const data = await apiRequest(
          chatUrl("archiveChat"),
          "POST",
          {
            lastMessage: { key: { remoteJid: remote_jid } },
            archive,
          },
        );
        return toolResult(data);
      } catch (error) {
        return toolError(`Failed to archive chat: ${(error as Error).message}`);
      }
    },
  );

  // --- Check WhatsApp numbers ---
  server.registerTool(
    "check_whatsapp_numbers",
    {
      title: "Check WhatsApp Numbers",
      description:
        "Verify if phone numbers are registered on WhatsApp. Returns which numbers exist and their JIDs.",
      inputSchema: {
        numbers: z
          .array(z.string())
          .min(1)
          .describe("Phone numbers to check, with country code, no + (e.g. ['5538999999999'])"),
      },
      annotations: {
        readOnlyHint: true,
        destructiveHint: false,
        openWorldHint: true,
      },
    },
    async ({ numbers }) => {
      try {
        const data = await apiRequest(
          chatUrl("whatsappNumbers"),
          "POST",
          { numbers },
        );
        return toolResult(data);
      } catch (error) {
        return toolError(`Failed to check WhatsApp numbers: ${(error as Error).message}`);
      }
    },
  );

  // --- Delete message ---
  server.registerTool(
    "delete_message",
    {
      title: "Delete Message",
      description:
        "Delete a WhatsApp message for everyone in the chat. Only works for messages you sent within the time limit.",
      inputSchema: {
        remote_jid: z
          .string()
          .describe("Chat JID (e.g. 5538999999999@s.whatsapp.net)"),
        message_id: z
          .string()
          .describe("ID of the message to delete"),
        from_me: z
          .boolean()
          .describe("Whether the message was sent by you (true) or received (false)"),
      },
      annotations: {
        readOnlyHint: false,
        destructiveHint: true,
        openWorldHint: true,
      },
    },
    async ({ remote_jid, message_id, from_me }) => {
      try {
        const data = await apiRequest(
          chatUrl("deleteMessage"),
          "DELETE",
          {
            key: {
              remoteJid: remote_jid,
              fromMe: from_me,
              id: message_id,
            },
          },
        );
        return toolResult(data);
      } catch (error) {
        return toolError(`Failed to delete message: ${(error as Error).message}`);
      }
    },
  );

  // --- Fetch profile ---
  server.registerTool(
    "fetch_profile",
    {
      title: "Fetch Profile",
      description:
        "Fetch the WhatsApp profile information of a contact (name, status, etc.).",
      inputSchema: {
        number: z
          .string()
          .describe("Phone number with country code, no + (e.g. 5538999999999)"),
      },
      annotations: {
        readOnlyHint: true,
        destructiveHint: false,
        openWorldHint: true,
      },
    },
    async ({ number }) => {
      try {
        const data = await apiRequest(
          chatUrl("fetchProfile"),
          "POST",
          { number },
        );
        return toolResult(data);
      } catch (error) {
        return toolError(`Failed to fetch profile: ${(error as Error).message}`);
      }
    },
  );

  // --- Fetch profile picture ---
  server.registerTool(
    "fetch_profile_picture",
    {
      title: "Fetch Profile Picture",
      description:
        "Get the profile picture URL of a WhatsApp contact.",
      inputSchema: {
        number: z
          .string()
          .describe("Phone number with country code, no + (e.g. 5538999999999)"),
      },
      annotations: {
        readOnlyHint: true,
        destructiveHint: false,
        openWorldHint: true,
      },
    },
    async ({ number }) => {
      try {
        const data = await apiRequest(
          chatUrl("fetchProfilePictureUrl"),
          "POST",
          { number },
        );
        return toolResult(data);
      } catch (error) {
        return toolError(`Failed to fetch profile picture: ${(error as Error).message}`);
      }
    },
  );

  // --- Find chats ---
  server.registerTool(
    "find_chats",
    {
      title: "Find Chats",
      description:
        "List all WhatsApp chats/conversations. Returns chat metadata including last message, unread count, etc.",
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
          chatUrl("findChats"),
          "POST",
          {},
        );
        return toolResult(data);
      } catch (error) {
        return toolError(`Failed to find chats: ${(error as Error).message}`);
      }
    },
  );

  // --- Find contacts ---
  server.registerTool(
    "find_contacts",
    {
      title: "Find Contacts",
      description:
        "Search WhatsApp contacts. Returns all contacts if no filter is provided, or a specific contact by JID.",
      inputSchema: {
        filter_id: z
          .string()
          .optional()
          .describe("Optional JID to filter (e.g. 5538999999999@s.whatsapp.net). Omit to list all contacts."),
      },
      annotations: {
        readOnlyHint: true,
        destructiveHint: false,
        openWorldHint: true,
      },
    },
    async ({ filter_id }) => {
      try {
        const body: Record<string, unknown> = {};
        if (filter_id) {
          body.where = { id: filter_id };
        }

        const data = await apiRequest(
          chatUrl("findContacts"),
          "POST",
          body,
        );
        return toolResult(data);
      } catch (error) {
        return toolError(`Failed to find contacts: ${(error as Error).message}`);
      }
    },
  );

  // --- Find messages ---
  server.registerTool(
    "find_messages",
    {
      title: "Find Messages",
      description:
        "Retrieve messages from a specific WhatsApp chat. Returns recent messages ordered by timestamp.",
      inputSchema: {
        remote_jid: z
          .string()
          .describe("Chat JID (e.g. 5538999999999@s.whatsapp.net or group JID)"),
        limit: z
          .number()
          .optional()
          .describe("Maximum number of messages to return (default: 20)"),
      },
      annotations: {
        readOnlyHint: true,
        destructiveHint: false,
        openWorldHint: true,
      },
    },
    async ({ remote_jid, limit }) => {
      try {
        const data = await apiRequest(
          chatUrl("findMessages"),
          "POST",
          {
            where: {
              key: {
                remoteJid: remote_jid,
              },
            },
            limit: limit ?? 20,
          },
        );
        return toolResult(data);
      } catch (error) {
        return toolError(`Failed to find messages: ${(error as Error).message}`);
      }
    },
  );

  // --- Get base64 from media ---
  server.registerTool(
    "get_base64_from_media",
    {
      title: "Get Base64 from Media Message",
      description:
        "Extract media content as base64 from a WhatsApp message. Use this instead of temporary media URLs which expire quickly. Pass the message key ID from find_messages results.",
      inputSchema: {
        message_id: z
          .string()
          .describe("Message key ID (from find_messages results, field key.id)"),
        convert_to_mp4: z
          .boolean()
          .optional()
          .describe("Convert video to MP4 format (default: false)"),
      },
      annotations: {
        readOnlyHint: true,
        destructiveHint: false,
        openWorldHint: true,
      },
    },
    async ({ message_id, convert_to_mp4 }) => {
      try {
        const body: Record<string, unknown> = {
          message: { key: { id: message_id } },
        };
        if (convert_to_mp4 !== undefined) body.convertToMp4 = convert_to_mp4;

        const data = await apiRequest(
          chatUrl("getBase64FromMediaMessage"),
          "POST",
          body,
        );
        return toolResult(data);
      } catch (error) {
        return toolError(`Failed to get base64 from media: ${(error as Error).message}`);
      }
    },
  );

  // --- Mark as read ---
  server.registerTool(
    "mark_as_read",
    {
      title: "Mark Messages as Read",
      description: "Mark specific messages as read in a WhatsApp chat.",
      inputSchema: {
        remote_jid: z
          .string()
          .describe("Chat JID (e.g. 5538999999999@s.whatsapp.net)"),
        message_ids: z
          .array(z.string())
          .min(1)
          .describe("Array of message IDs to mark as read"),
      },
      annotations: {
        readOnlyHint: false,
        destructiveHint: false,
        openWorldHint: true,
      },
    },
    async ({ remote_jid, message_ids }) => {
      try {
        const data = await apiRequest(
          chatUrl("markMessageAsRead"),
          "POST",
          {
            readMessages: message_ids.map((id) => ({
              remoteJid: remote_jid,
              id,
            })),
          },
        );
        return toolResult(data);
      } catch (error) {
        return toolError(`Failed to mark messages as read: ${(error as Error).message}`);
      }
    },
  );

  // --- Send presence ---
  server.registerTool(
    "send_presence",
    {
      title: "Send Presence",
      description:
        "Send a presence/typing indicator to a WhatsApp chat (composing, recording, paused, etc.).",
      inputSchema: {
        number: z
          .string()
          .describe("Phone number or JID to send presence to"),
        presence: z
          .enum(["composing", "recording", "paused", "available", "unavailable"])
          .describe("Presence type to send"),
      },
      annotations: {
        readOnlyHint: false,
        destructiveHint: false,
        openWorldHint: true,
      },
    },
    async ({ number, presence }) => {
      try {
        const data = await apiRequest(
          chatUrl("sendPresence"),
          "POST",
          { number, presence },
        );
        return toolResult(data);
      } catch (error) {
        return toolError(`Failed to send presence: ${(error as Error).message}`);
      }
    },
  );

  // --- Update message ---
  server.registerTool(
    "update_message",
    {
      title: "Update Message",
      description:
        "Edit a previously sent WhatsApp message. Only works for your own messages (fromMe: true).",
      inputSchema: {
        remote_jid: z
          .string()
          .describe("Chat JID (e.g. 5538999999999@s.whatsapp.net or group JID)"),
        message_id: z
          .string()
          .describe("ID of the message to edit"),
        text: z
          .string()
          .min(1)
          .describe("New text content for the message"),
      },
      annotations: {
        readOnlyHint: false,
        destructiveHint: false,
        openWorldHint: true,
      },
    },
    async ({ remote_jid, message_id, text }) => {
      try {
        const number = remote_jid.includes("@")
          ? remote_jid.split("@")[0]
          : remote_jid;

        const data = await apiRequest(
          chatUrl("updateMessage"),
          "POST",
          {
            number,
            text,
            key: {
              remoteJid: remote_jid,
              fromMe: true,
              id: message_id,
            },
          },
        );
        return toolResult(data);
      } catch (error) {
        return toolError(`Failed to update message: ${(error as Error).message}`);
      }
    },
  );
}
