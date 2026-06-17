import 'dotenv/config';
import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import http from 'http';
import { WebSocketServer } from 'ws';
import { registerRoutes } from './routes';

const PORT = Number(process.env.PORT ?? 3000);
const ALLOWED_ORIGIN = process.env.ALLOWED_ORIGIN ?? 'http://localhost:4200';

const app = express();
app.use(helmet());
app.use(cors({ origin: ALLOWED_ORIGIN, credentials: true }));
app.use(express.json({ limit: '1mb' }));

const server = http.createServer(app);

// Minimal WebSocket server scaffold.
// Full AC-05/AC-09/AC-12 implementation is expected in subsequent iterations.
const wss = new WebSocketServer({ server, path: '/ws' });

wss.on('connection', (socket, req) => {
  // Basic single-user gate (assumption: auth TBD).
  // If no auth is provided, we still allow connection for local dev.
  const url = new URL(req.url ?? '/', `http://${req.headers.host ?? 'localhost'}`);
  const callId = url.searchParams.get('callId');

  if (!callId) {
    socket.send(
      JSON.stringify({
        type: 'error',
        message: 'Missing required query param: callId'
      })
    );
    socket.close(1008, 'Missing callId');
    return;
  }

  socket.on('message', (data) => {
    // Echo scaffold to keep the server usable.
    // Contract requires callId in all messages; enforce it here.
    try {
      const msg = JSON.parse(data.toString('utf8')) as unknown;
      if (!msg || typeof msg !== 'object') return;
      const obj = msg as Record<string, unknown>;
      const incomingCallId = typeof obj.callId === 'string' ? obj.callId : undefined;
      if (!incomingCallId) {
        socket.send(JSON.stringify({ type: 'error', message: 'Message missing callId' }));
        return;
      }
      if (incomingCallId !== callId) {
        socket.send(
          JSON.stringify({
            type: 'error',
            message: 'callId mismatch between connection and message'
          })
        );
        return;
      }

      socket.send(
        JSON.stringify({
          type: 'ack',
          callId,
          receivedAtIso: new Date().toISOString()
        })
      );
    } catch {
      socket.send(JSON.stringify({ type: 'error', message: 'Invalid JSON' }));
    }
  });
});

registerRoutes(app);

app.get('/healthz', (_req, res) => {
  res.status(200).json({ ok: true });
});

server.listen(PORT, () => {
  // eslint-disable-next-line no-console
  console.log(`SalesCoach MVP server listening on http://localhost:${PORT}`);
});
