# Real-Time Systems — Example

## Scenario: Replacing Laggy Polling on a D365 Production Order Dashboard

**Who:** Carlos Mendoza, Full-Stack Developer at an automotive parts manufacturer (D365 F&O, 200 production orders active at any time, factory floor dashboard used by 40 supervisors)
**Where:** Node.js 20 Express API, React 18 frontend, D365 F&O OData API, Azure App Service
**The Problem:** The factory floor dashboard shows live production order status (Scheduled, Released, Started, Reported as Finished). It currently polls the Express API every 30 seconds. Supervisors miss critical status changes — a production order moving to "Reported as Finished" can sit unnoticed for up to 29 seconds, delaying the next stage of the manufacturing process. The 30-second lag directly costs 4-8 minutes of idle time per production order per shift.

**Prerequisites:** Node.js 20+, Express 4+, React 18, D365 F&O Business Events configured in Azure Event Grid or direct webhook. Basic familiarity with the EventSource browser API.

---

### What You Say to the Agent

> "Our D365 production order dashboard polls every 30 seconds and supervisors are missing status changes. I want to replace the polling with Server-Sent Events so updates arrive in real time. Walk me through the implementation."

### What the Agent Does

1. **Designs the SSE architecture:** D365 F&O Business Events send a webhook to the Express API when a production order status changes. The API maintains a Set of active SSE client connections per production area. When a webhook arrives, the API fans out the event to all connected clients watching that area. No WebSocket handshake complexity, no socket.io dependency — SSE is HTTP/1.1, works through Azure App Service without configuration changes

2. **Implements the SSE endpoint:**
   ```typescript
   app.get('/api/production-orders/events', (req, res) => {
     res.setHeader('Content-Type', 'text/event-stream');
     res.setHeader('Cache-Control', 'no-cache');
     res.setHeader('Connection', 'keep-alive');
     res.flushHeaders();

     const areaId = req.query.areaId as string;
     const clientId = crypto.randomUUID();
     clients.get(areaId)?.set(clientId, res) ?? clients.set(areaId, new Map([[clientId, res]]));

     // Heartbeat every 30s to keep connection alive through Azure load balancer
     const heartbeat = setInterval(() => res.write(': heartbeat\n\n'), 30000);

     req.on('close', () => {
       clearInterval(heartbeat);
       clients.get(areaId)?.delete(clientId);
     });
   });
   ```

3. **Implements the D365 Business Event webhook handler:**
   ```typescript
   app.post('/webhooks/d365/production-order', async (req, res) => {
     const event = req.body; // { orderId, newStatus, areaId, timestamp }
     const areaClients = clients.get(event.areaId);
     if (areaClients) {
       const payload = `data: ${JSON.stringify(event)}\n\n`;
       areaClients.forEach(client => client.write(payload));
     }
     res.sendStatus(200);
   });
   ```

4. **Updates the React frontend to use EventSource:**
   ```typescript
   useEffect(() => {
     const source = new EventSource(`/api/production-orders/events?areaId=${areaId}`);
     source.onmessage = (e) => {
       const update = JSON.parse(e.data);
       setOrders(prev => prev.map(o => o.id === update.orderId ? { ...o, status: update.newStatus } : o));
     };
     source.onerror = () => source.close(); // Browser auto-reconnects via EventSource spec
     return () => source.close();
   }, [areaId]);
   ```
   The `EventSource` API automatically reconnects with exponential backoff if the connection drops — built into the browser spec

5. **Configures D365 Business Events:** In D365 F&O, navigates to System Administration > Business Events > Business Events Catalog. Enables "Production order status changed" event. Configures endpoint as the Express API webhook URL with HMAC-SHA256 signature verification. D365 will deliver events within 2-3 seconds of the status change

### The Business Impact

- **Status update latency dropped from 0-30 seconds to 2-3 seconds** — supervisors now see production order completions almost instantly
- **4-8 minutes of idle time per production order eliminated** — over a 12-hour shift with 40 production orders, this recovers 160-320 minutes of production time per shift
- **API server load reduced** — 40 supervisors polling every 30 seconds was 80 requests/minute. SSE replaced that with 40 persistent connections and event-driven pushes. D365 OData polling from the API also dropped by 95% since the server now only queries on webhook trigger, not on a timer

### Try It Yourself

> "SSE is working great for production order status. Now I need to extend it to show live machine utilization percentages that update every 5 seconds from an IoT sensor feed (Azure IoT Hub). The data comes from a different source than D365. How do I merge two event streams (D365 Business Events and IoT Hub) into the same SSE connection so the dashboard only needs one persistent connection?"
