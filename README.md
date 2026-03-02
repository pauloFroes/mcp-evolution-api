# mcp-evolution-api

MCP server that wraps the [Evolution API](https://doc.evolution-api.com/) (WhatsApp) as semantic tools for LLM agents.

Works with **Claude Code**, **Codex**, **Claude Desktop**, **Cursor**, **VS Code**, **Windsurf**, and any MCP-compatible client.

---

## Prerequisites

- Node.js 18+
- Evolution API instance running ([docs](https://doc.evolution-api.com/))

| Variable | Description |
| -------- | ----------- |
| `EVOLUTION_BASE_URL` | Base URL of your Evolution API instance |
| `EVOLUTION_API_KEY` | API key for authentication |
| `EVOLUTION_INSTANCE` | Instance name (e.g. `whatsapp-paulo`) |

## Installation

### Claude Code

Three installation scopes are available:

| Scope | Flag | Config file | Use case |
|-------|------|-------------|----------|
| **local** | `-s local` | `.mcp.json` | This project only (default) |
| **project** | `-s project` | `.claude/mcp.json` | Shared with team via git |
| **user** | `-s user` | `~/.claude/mcp.json` | All your projects |

```bash
claude mcp add evolution-api -s user \
  -e EVOLUTION_BASE_URL=https://your-instance.example.com \
  -e EVOLUTION_API_KEY=your-key \
  -e EVOLUTION_INSTANCE=your-instance \
  -- npx -y github:pauloFroes/mcp-evolution-api
```

> Replace `-s user` with `-s local` or `-s project` as needed.

### Codex

Add to your Codex configuration:

```toml
[mcp_servers.evolution-api]
command = "npx"
args = ["-y", "github:pauloFroes/mcp-evolution-api"]
env_vars = ["EVOLUTION_BASE_URL", "EVOLUTION_API_KEY", "EVOLUTION_INSTANCE"]
```

### Claude Desktop

Add to `claude_desktop_config.json`:

```json
{
  "mcpServers": {
    "evolution-api": {
      "command": "npx",
      "args": ["-y", "github:pauloFroes/mcp-evolution-api"],
      "env": {
        "EVOLUTION_BASE_URL": "https://your-instance.example.com",
        "EVOLUTION_API_KEY": "your-key",
        "EVOLUTION_INSTANCE": "your-instance"
      }
    }
  }
}
```

### Cursor

Add to `~/.cursor/mcp.json`:

```json
{
  "mcpServers": {
    "evolution-api": {
      "command": "npx",
      "args": ["-y", "github:pauloFroes/mcp-evolution-api"],
      "env": {
        "EVOLUTION_BASE_URL": "https://your-instance.example.com",
        "EVOLUTION_API_KEY": "your-key",
        "EVOLUTION_INSTANCE": "your-instance"
      }
    }
  }
}
```

### VS Code

Add to `.vscode/mcp.json` in your project:

```json
{
  "servers": {
    "evolution-api": {
      "command": "npx",
      "args": ["-y", "github:pauloFroes/mcp-evolution-api"],
      "env": {
        "EVOLUTION_BASE_URL": "https://your-instance.example.com",
        "EVOLUTION_API_KEY": "your-key",
        "EVOLUTION_INSTANCE": "your-instance"
      }
    }
  }
}
```

### Windsurf

Add to `~/.codeium/windsurf/mcp_config.json`:

```json
{
  "mcpServers": {
    "evolution-api": {
      "command": "npx",
      "args": ["-y", "github:pauloFroes/mcp-evolution-api"],
      "env": {
        "EVOLUTION_BASE_URL": "https://your-instance.example.com",
        "EVOLUTION_API_KEY": "your-key",
        "EVOLUTION_INSTANCE": "your-instance"
      }
    }
  }
}
```

## Available Tools

### Messaging (9)

| Tool | Description |
|------|-------------|
| `block_contact` | Block or unblock a contact |
| `send_audio` | Send audio/voice note |
| `send_contact` | Send contact card (vCard) |
| `send_location` | Send location pin |
| `send_media` | Send image, video, or document |
| `send_poll` | Send a poll |
| `send_reaction` | React to a message with emoji |
| `send_sticker` | Send a sticker |
| `send_text` | Send a text message |

### Chat (12)

| Tool | Description |
|------|-------------|
| `archive_chat` | Archive or unarchive a chat |
| `check_whatsapp_numbers` | Verify if numbers exist on WhatsApp |
| `delete_message` | Delete a message for everyone |
| `fetch_profile` | Fetch contact profile information |
| `fetch_profile_picture` | Get contact profile picture URL |
| `find_chats` | List all chats/conversations |
| `find_contacts` | Search WhatsApp contacts |
| `find_messages` | Retrieve messages from a chat |
| `get_base64_from_media` | Extract media as base64 from a message |
| `mark_as_read` | Mark messages as read |
| `send_presence` | Send typing/recording indicator |
| `update_message` | Edit a previously sent message |

### Groups (10)

| Tool | Description |
|------|-------------|
| `create_group` | Create a new group |
| `fetch_invite_code` | Get group invite link |
| `find_group` | Get group info by JID |
| `group_participants` | List group members |
| `leave_group` | Leave a group |
| `list_groups` | List all groups |
| `send_group_invite` | Send group invite to numbers |
| `update_group_description` | Update group description |
| `update_group_picture` | Update group profile picture |
| `update_group_subject` | Update group name |

### Instance (1)

| Tool | Description |
|------|-------------|
| `check_connection` | Check WhatsApp connection status |

## Authentication

All requests use the `apikey` header. The instance name is automatically appended to API endpoint paths. Environment variables are validated at startup — the server fails fast if any are missing.

## License

MIT
