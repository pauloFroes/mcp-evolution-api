import { z } from "zod";
import { apiRequest, chatUrl, toolResult, toolError } from "../client.js";
export function registerChatTools(server) {
    // --- Find contacts ---
    server.registerTool("find_contacts", {
        title: "Find Contacts",
        description: "Search WhatsApp contacts. Returns all contacts if no filter is provided, or a specific contact by JID.",
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
    }, async ({ filter_id }) => {
        try {
            const body = {};
            if (filter_id) {
                body.where = { id: filter_id };
            }
            const data = await apiRequest(chatUrl("findContacts"), "POST", body);
            return toolResult(data);
        }
        catch (error) {
            return toolError(`Failed to find contacts: ${error.message}`);
        }
    });
    // --- Check WhatsApp numbers ---
    server.registerTool("check_whatsapp_numbers", {
        title: "Check WhatsApp Numbers",
        description: "Verify if phone numbers are registered on WhatsApp. Returns which numbers exist and their JIDs.",
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
    }, async ({ numbers }) => {
        try {
            const data = await apiRequest(chatUrl("whatsappNumbers"), "POST", { numbers });
            return toolResult(data);
        }
        catch (error) {
            return toolError(`Failed to check WhatsApp numbers: ${error.message}`);
        }
    });
    // --- Find messages ---
    server.registerTool("find_messages", {
        title: "Find Messages",
        description: "Retrieve messages from a specific WhatsApp chat. Returns recent messages ordered by timestamp.",
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
    }, async ({ remote_jid, limit }) => {
        try {
            const body = {
                where: {
                    key: {
                        remoteJid: remote_jid,
                    },
                },
                limit: limit ?? 20,
            };
            const data = await apiRequest(chatUrl("findMessages"), "POST", body);
            return toolResult(data);
        }
        catch (error) {
            return toolError(`Failed to find messages: ${error.message}`);
        }
    });
    // --- Mark as read ---
    server.registerTool("mark_as_read", {
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
    }, async ({ remote_jid, message_ids }) => {
        try {
            const body = {
                readMessages: message_ids.map((id) => ({
                    remoteJid: remote_jid,
                    id,
                })),
            };
            const data = await apiRequest(chatUrl("markMessageAsRead"), "PUT", body);
            return toolResult(data);
        }
        catch (error) {
            return toolError(`Failed to mark messages as read: ${error.message}`);
        }
    });
    // --- Delete message ---
    server.registerTool("delete_message", {
        title: "Delete Message",
        description: "Delete a WhatsApp message for everyone in the chat. Only works for messages you sent within the time limit.",
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
    }, async ({ remote_jid, message_id, from_me }) => {
        try {
            const body = {
                key: {
                    remoteJid: remote_jid,
                    fromMe: from_me,
                    id: message_id,
                },
            };
            const data = await apiRequest(chatUrl("deleteMessage"), "DELETE", body);
            return toolResult(data);
        }
        catch (error) {
            return toolError(`Failed to delete message: ${error.message}`);
        }
    });
}
