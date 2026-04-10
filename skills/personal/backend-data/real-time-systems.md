---
name: real-time-systems
description: "Build real-time features with WebSockets, SSE, Redis Pub/Sub — with reconnection logic, scaling, and when each approach fits. Use when user says 'real-time websocket', 'SSE streaming', 'server-sent events', 'Redis pub/sub', 'WebSocket reconnect', 'scale websockets', 'real-time dashboard', 'long polling vs SSE'."
version: 1.1.0
author: Ragnar Pitla | skill.rbuild.ai
tags: [intermediate, backend, real-time, websockets]
---

# Real-Time Systems

"Real-time" means different things for different use cases. Choose the right transport before building anything.

## Choosing the Right Transport

| Transport | Direction | Use For | Scale Complexity |
|---|---|---|---|
| **HTTP Polling** | Client -> Server | Simple, infrequent updates | Low |
| **SSE** | Server -> Client | Notifications, feeds, streaming | Low |
| **WebSockets** | Bidirectional | Chat, collaborative editing, games | High |
| **WebRTC** | P2P | Video/audio, large binary data | Very High |

**Start with SSE** if you only need server-to-client messages. Add WebSockets only when you need bidirectional communication.

## Server-Sent Events (SSE)

SSE is HTTP with a persistent connection and a specific text format. Much simpler than WebSockets.

```javascript
// Server (Node.js/Express)
app.get('/events', (req, res) => {
  res.setHeader('Content-Type', 'text/event-stream');
  res.setHeader('Cache-Control', 'no-cache');
  res.setHeader('Connection', 'keep-alive');

  const send = (data) => res.write(`data: ${JSON.stringify(data)}\n\n`);

  // Send events
  const interval = setInterval(() => {
    send({ type: 'heartbeat', timestamp: Date.now() });
  }, 30000);

  // Cleanup on disconnect
  req.on('close', () => clearInterval(interval));
});

// Client
const source = new EventSource('/events');
source.onmessage = (event) => {
  const data = JSON.parse(event.data);
  console.log(data);
};
source.onerror = () => {
  // Browser auto-reconnects after error
};
```

SSE supports automatic reconnection (browser handles it), event IDs for resuming missed events, and named event types.

## WebSockets

Use when clients also need to send messages to the server (chat, collaborative editing).

```javascript
// Server (with ws library)
import { WebSocketServer } from 'ws';
const wss = new WebSocketServer({ port: 8080 });

wss.on('connection', (ws) => {
  ws.on('message', (message) => {
    const data = JSON.parse(message.toString());
    // Handle message, broadcast to others
    wss.clients.forEach(client => {
      if (client !== ws && client.readyState === WebSocket.OPEN) {
        client.send(JSON.stringify(data));
      }
    });
  });

  ws.on('close', () => { /* cleanup */ });
  
  // Heartbeat to detect dead connections
  ws.isAlive = true;
  ws.on('pong', () => { ws.isAlive = true; });
});

// Ping all clients every 30s, terminate dead ones
setInterval(() => {
  wss.clients.forEach(ws => {
    if (!ws.isAlive) return ws.terminate();
    ws.isAlive = false;
    ws.ping();
  });
}, 30000);
```

**Client reconnection logic:**
```javascript
function connect() {
  const ws = new WebSocket('wss://api.example.com/ws');
  let reconnectDelay = 1000;

  ws.onclose = () => {
    setTimeout(connect, reconnectDelay);
    reconnectDelay = Math.min(reconnectDelay * 2, 30000); // Exponential backoff, max 30s
  };
  ws.onopen = () => { reconnectDelay = 1000; }; // Reset on success
}
connect();
```

## Scaling with Redis Pub/Sub

Single-server WebSocket state doesn't work with multiple server instances. Use Redis for fan-out:

```javascript
import { createClient } from 'redis';

const publisher = createClient();
const subscriber = createClient();
await publisher.connect();
await subscriber.connect();

// Subscribe to channel
await subscriber.subscribe('chat:room:123', (message) => {
  // Broadcast to all clients connected to this server
  wss.clients.forEach(client => {
    if (client.readyState === WebSocket.OPEN) {
      client.send(message);
    }
  });
});

// Publish from any server instance
await publisher.publish('chat:room:123', JSON.stringify({ text: 'Hello' }));
```

Redis Pub/Sub delivers messages to all subscribers — so all server instances get the message and broadcast to their connected clients.

## Connection State Management

Track user-to-connection mapping server-side:

```javascript
const connections = new Map(); // userId -> Set<WebSocket>

ws.on('message', (message) => {
  const { userId, token } = authenticate(message);
  if (!connections.has(userId)) connections.set(userId, new Set());
  connections.get(userId).add(ws);
});

ws.on('close', () => {
  connections.forEach(sockets => sockets.delete(ws));
});

// Send to specific user (all their connections)
function sendToUser(userId, data) {
  const sockets = connections.get(userId);
  sockets?.forEach(ws => {
    if (ws.readyState === WebSocket.OPEN) {
      ws.send(JSON.stringify(data));
    }
  });
}
```

## LLM Streaming with SSE

A common pattern for streaming AI responses to clients:

```typescript
// Stream Claude response to browser via SSE
app.get('/stream-chat', async (req, res) => {
  res.setHeader('Content-Type', 'text/event-stream');
  res.setHeader('Cache-Control', 'no-cache');
  
  const stream = await anthropic.messages.stream({
    model: 'claude-sonnet-4-5',
    max_tokens: 1024,
    messages: [{ role: 'user', content: req.query.message as string }]
  });
  
  for await (const chunk of stream) {
    if (chunk.type === 'content_block_delta') {
      res.write(`data: ${JSON.stringify({ text: chunk.delta.text })}\n\n`);
    }
  }
  
  res.write('data: [DONE]\n\n');
  res.end();
});
```

## Trigger Phrases

- "real-time websocket"
- "SSE streaming"
- "server-sent events"
- "Redis pub/sub"
- "WebSocket reconnect"
- "scale websockets"
- "real-time dashboard"
- "long polling vs SSE"

## Quick Example

> See `real-time-systems-example.md` in this folder for a full worked scenario with business impact.

## Troubleshooting

| Issue | Cause | Fix |
|---|---|---|
| WebSocket connections drop after 60s | Proxy or load balancer timeout with no heartbeat | Add ping/pong heartbeat every 30s; configure proxy timeout to 90s+ |
| Messages lost on server restart | No message persistence, in-memory only | Use Redis Streams or a message queue for persistence; replay on reconnect using last event ID |
| Memory leak with many connections | Connections not cleaned up from tracking Map | Ensure ws.on('close') removes from all connection Maps; log connection count periodically |
| SSE not working behind nginx | Nginx buffering the response | Add `proxy_buffering off;` and `X-Accel-Buffering: no` header for SSE endpoints |

## Version History
| Version | Date | Changes |
|---|---|---|
| 1.1.0 | 2026-04-10 | Improved frontmatter, triggers, troubleshooting, and content |
| 1.0.1 | 2026-04-10 | Updated format, added triggers, examples, troubleshooting |
| 1.0.0 | 2026-04-09 | Initial skill definition |
