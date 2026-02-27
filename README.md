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

### Messaging

| Tool | Description |
|------|-------------|
| `send_text` | Send a text message |
| `send_media` | Send image, video, or document |
| `send_audio` | Send audio/voice note |
| `send_location` | Send location pin |
| `send_contact` | Send contact card (vCard) |
| `send_reaction` | React to a message with emoji |
| `send_poll` | Send a poll |

### Chat

| Tool | Description |
|------|-------------|
| `find_contacts` | Search WhatsApp contacts |
| `check_whatsapp_numbers` | Verify if numbers exist on WhatsApp |
| `find_messages` | Retrieve messages from a chat |
| `mark_as_read` | Mark messages as read |
| `delete_message` | Delete a message for everyone |

### Groups

| Tool | Description |
|------|-------------|
| `list_groups` | List all groups |
| `group_participants` | List group members |
| `find_group` | Get group info by JID |
| `check_connection` | Check WhatsApp connection status |

## Authentication

All requests use the `apikey` header. The instance name is automatically appended to API endpoint paths. Environment variables are validated at startup — the server fails fast if any are missing.

## License

MIT
