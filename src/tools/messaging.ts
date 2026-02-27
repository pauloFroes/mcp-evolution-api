import type { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { z } from "zod";
import { apiRequest, instanceUrl, toolResult, toolError } from "../client.js";

export function registerMessagingTools(server: McpServer) {
  // --- Send text message ---
  server.registerTool(
    "send_text",
    {
      title: "Send Text Message",
      description:
        "Send a WhatsApp text message to a phone number via Evolution API.",
      inputSchema: {
        number: z
          .string()
          .describe("Recipient phone number with country code, no + (e.g. 5538999999999)"),
        text: z.string().min(1).describe("Message text content"),
        delay: z
          .number()
          .optional()
          .describe("Typing simulation delay in milliseconds before sending"),
        link_preview: z
          .boolean()
          .optional()
          .describe("Enable link preview in message (default: true)"),
      },
      annotations: {
        readOnlyHint: false,
        destructiveHint: false,
        openWorldHint: true,
      },
    },
    async ({ number, text, delay, link_preview }) => {
      try {
        const body: Record<string, unknown> = {
          number,
          text,
        };
        if (delay !== undefined) body.delay = delay;
        if (link_preview !== undefined) body.linkPreview = link_preview;

        const data = await apiRequest(
          instanceUrl("sendText"),
          "POST",
          body,
        );
        return toolResult(data);
      } catch (error) {
        return toolError(`Failed to send text message: ${(error as Error).message}`);
      }
    },
  );

  // --- Send media message ---
  server.registerTool(
    "send_media",
    {
      title: "Send Media Message",
      description:
        "Send a WhatsApp media message (image, video, or document). Media URL must be publicly accessible.",
      inputSchema: {
        number: z
          .string()
          .describe("Recipient phone number with country code, no + (e.g. 5538999999999)"),
        media_type: z
          .enum(["image", "video", "document"])
          .describe("Type of media to send"),
        media_url: z
          .string()
          .url()
          .describe("Publicly accessible URL of the media file"),
        caption: z
          .string()
          .optional()
          .describe("Optional caption for the media"),
        file_name: z
          .string()
          .optional()
          .describe("File name for documents (e.g. report.pdf)"),
        delay: z
          .number()
          .optional()
          .describe("Typing simulation delay in milliseconds"),
      },
      annotations: {
        readOnlyHint: false,
        destructiveHint: false,
        openWorldHint: true,
      },
    },
    async ({ number, media_type, media_url, caption, file_name, delay }) => {
      try {
        const body: Record<string, unknown> = {
          number,
          mediatype: media_type,
          media: media_url,
        };
        if (caption) body.caption = caption;
        if (file_name) body.fileName = file_name;
        if (delay !== undefined) body.delay = delay;

        const data = await apiRequest(
          instanceUrl("sendMedia"),
          "POST",
          body,
        );
        return toolResult(data);
      } catch (error) {
        return toolError(`Failed to send media message: ${(error as Error).message}`);
      }
    },
  );

  // --- Send audio message ---
  server.registerTool(
    "send_audio",
    {
      title: "Send Audio Message",
      description:
        "Send a WhatsApp audio message (voice note). Audio URL must be publicly accessible.",
      inputSchema: {
        number: z
          .string()
          .describe("Recipient phone number with country code, no + (e.g. 5538999999999)"),
        audio_url: z
          .string()
          .url()
          .describe("Publicly accessible URL of the audio file"),
        delay: z
          .number()
          .optional()
          .describe("Recording simulation delay in milliseconds"),
      },
      annotations: {
        readOnlyHint: false,
        destructiveHint: false,
        openWorldHint: true,
      },
    },
    async ({ number, audio_url, delay }) => {
      try {
        const body: Record<string, unknown> = {
          number,
          audio: audio_url,
        };
        if (delay !== undefined) body.delay = delay;

        const data = await apiRequest(
          instanceUrl("sendWhatsAppAudio"),
          "POST",
          body,
        );
        return toolResult(data);
      } catch (error) {
        return toolError(`Failed to send audio message: ${(error as Error).message}`);
      }
    },
  );

  // --- Send location ---
  server.registerTool(
    "send_location",
    {
      title: "Send Location",
      description: "Send a WhatsApp location pin to a phone number.",
      inputSchema: {
        number: z
          .string()
          .describe("Recipient phone number with country code, no + (e.g. 5538999999999)"),
        latitude: z.number().describe("Latitude coordinate"),
        longitude: z.number().describe("Longitude coordinate"),
        name: z
          .string()
          .optional()
          .describe("Location name (e.g. restaurant name)"),
        address: z
          .string()
          .optional()
          .describe("Full address text"),
        delay: z
          .number()
          .optional()
          .describe("Typing simulation delay in milliseconds"),
      },
      annotations: {
        readOnlyHint: false,
        destructiveHint: false,
        openWorldHint: true,
      },
    },
    async ({ number, latitude, longitude, name, address, delay }) => {
      try {
        const body: Record<string, unknown> = {
          number,
          latitude,
          longitude,
        };
        if (name) body.name = name;
        if (address) body.address = address;
        if (delay !== undefined) body.delay = delay;

        const data = await apiRequest(
          instanceUrl("sendLocation"),
          "POST",
          body,
        );
        return toolResult(data);
      } catch (error) {
        return toolError(`Failed to send location: ${(error as Error).message}`);
      }
    },
  );

  // --- Send contact card ---
  server.registerTool(
    "send_contact",
    {
      title: "Send Contact Card",
      description: "Send a WhatsApp contact card (vCard) to a phone number.",
      inputSchema: {
        number: z
          .string()
          .describe("Recipient phone number with country code, no + (e.g. 5538999999999)"),
        contact_name: z
          .string()
          .describe("Full name of the contact to share"),
        contact_phone: z
          .string()
          .describe("Phone number of the contact to share (with country code, no +)"),
        delay: z
          .number()
          .optional()
          .describe("Typing simulation delay in milliseconds"),
      },
      annotations: {
        readOnlyHint: false,
        destructiveHint: false,
        openWorldHint: true,
      },
    },
    async ({ number, contact_name, contact_phone, delay }) => {
      try {
        const body: Record<string, unknown> = {
          number,
          contact: [
            {
              fullName: contact_name,
              wuid: contact_phone,
              phoneNumber: contact_phone,
            },
          ],
        };
        if (delay !== undefined) body.delay = delay;

        const data = await apiRequest(
          instanceUrl("sendContact"),
          "POST",
          body,
        );
        return toolResult(data);
      } catch (error) {
        return toolError(`Failed to send contact card: ${(error as Error).message}`);
      }
    },
  );

  // --- Send reaction ---
  server.registerTool(
    "send_reaction",
    {
      title: "Send Reaction",
      description: "React to a specific WhatsApp message with an emoji.",
      inputSchema: {
        remote_jid: z
          .string()
          .describe("Chat JID (e.g. 5538999999999@s.whatsapp.net or group JID)"),
        message_id: z
          .string()
          .describe("ID of the message to react to"),
        emoji: z
          .string()
          .describe("Reaction emoji (e.g. \ud83d\udc4d, \u2764\ufe0f, \ud83d\ude02). Send empty string to remove reaction."),
      },
      annotations: {
        readOnlyHint: false,
        destructiveHint: false,
        openWorldHint: true,
      },
    },
    async ({ remote_jid, message_id, emoji }) => {
      try {
        const body: Record<string, unknown> = {
          key: {
            remoteJid: remote_jid,
            id: message_id,
          },
          reaction: emoji,
        };

        const data = await apiRequest(
          instanceUrl("sendReaction"),
          "POST",
          body,
        );
        return toolResult(data);
      } catch (error) {
        return toolError(`Failed to send reaction: ${(error as Error).message}`);
      }
    },
  );

  // --- Send poll ---
  server.registerTool(
    "send_poll",
    {
      title: "Send Poll",
      description: "Send a WhatsApp poll to a phone number.",
      inputSchema: {
        number: z
          .string()
          .describe("Recipient phone number with country code, no + (e.g. 5538999999999)"),
        question: z
          .string()
          .describe("Poll question text"),
        options: z
          .array(z.string())
          .min(2)
          .max(12)
          .describe("Poll answer options (2-12 choices)"),
        max_selections: z
          .number()
          .optional()
          .describe("Maximum number of selections allowed (default: 1 for single choice)"),
        delay: z
          .number()
          .optional()
          .describe("Typing simulation delay in milliseconds"),
      },
      annotations: {
        readOnlyHint: false,
        destructiveHint: false,
        openWorldHint: true,
      },
    },
    async ({ number, question, options, max_selections, delay }) => {
      try {
        const body: Record<string, unknown> = {
          number,
          name: question,
          values: options,
          selectableCount: max_selections ?? 1,
        };
        if (delay !== undefined) body.delay = delay;

        const data = await apiRequest(
          instanceUrl("sendPoll"),
          "POST",
          body,
        );
        return toolResult(data);
      } catch (error) {
        return toolError(`Failed to send poll: ${(error as Error).message}`);
      }
    },
  );
}
