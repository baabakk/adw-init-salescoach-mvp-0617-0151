"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
require("dotenv/config");
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const helmet_1 = __importDefault(require("helmet"));
const http_1 = __importDefault(require("http"));
const ws_1 = require("ws");
const routes_1 = require("./routes");
const PORT = Number(process.env.PORT ?? 3000);
const ALLOWED_ORIGIN = process.env.ALLOWED_ORIGIN ?? 'http://localhost:4200';
const app = (0, express_1.default)();
app.use((0, helmet_1.default)());
app.use((0, cors_1.default)({ origin: ALLOWED_ORIGIN, credentials: true }));
app.use(express_1.default.json({ limit: '1mb' }));
const server = http_1.default.createServer(app);
// Minimal WebSocket server scaffold.
// Full AC-05/AC-09/AC-12 implementation is expected in subsequent iterations.
const wss = new ws_1.WebSocketServer({ server, path: '/ws' });
wss.on('connection', (socket, req) => {
    // Basic single-user gate (assumption: auth TBD).
    // If no auth is provided, we still allow connection for local dev.
    const url = new URL(req.url ?? '/', `http://${req.headers.host ?? 'localhost'}`);
    const callId = url.searchParams.get('callId');
    if (!callId) {
        socket.send(JSON.stringify({
            type: 'error',
            message: 'Missing required query param: callId'
        }));
        socket.close(1008, 'Missing callId');
        return;
    }
    socket.on('message', (data) => {
        // Echo scaffold to keep the server usable.
        // Contract requires callId in all messages; enforce it here.
        try {
            const msg = JSON.parse(data.toString('utf8'));
            if (!msg || typeof msg !== 'object')
                return;
            const obj = msg;
            const incomingCallId = typeof obj.callId === 'string' ? obj.callId : undefined;
            if (!incomingCallId) {
                socket.send(JSON.stringify({ type: 'error', message: 'Message missing callId' }));
                return;
            }
            if (incomingCallId !== callId) {
                socket.send(JSON.stringify({
                    type: 'error',
                    message: 'callId mismatch between connection and message'
                }));
                return;
            }
            socket.send(JSON.stringify({
                type: 'ack',
                callId,
                receivedAtIso: new Date().toISOString()
            }));
        }
        catch {
            socket.send(JSON.stringify({ type: 'error', message: 'Invalid JSON' }));
        }
    });
});
(0, routes_1.registerRoutes)(app);
app.get('/healthz', (_req, res) => {
    res.status(200).json({ ok: true });
});
server.listen(PORT, () => {
    // eslint-disable-next-line no-console
    console.log(`SalesCoach MVP server listening on http://localhost:${PORT}`);
});
//# sourceMappingURL=index.js.map