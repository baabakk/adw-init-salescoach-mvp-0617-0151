import type { Express, Request, Response } from 'express';

export function registerRoutes(app: Express): void {
  app.get('/api/version', (_req: Request, res: Response) => {
    res.json({
      name: 'init-salescoach-mvp',
      version: '0.1.0'
    });
  });

  // Placeholder endpoints to keep the API surface stable for the MVP.
  // The full EventBus-only orchestration and MongoDB persistence will be added next.

  app.post('/api/calls', async (req: Request, res: Response) => {
    const body = req.body as Partial<{ callId: string }>;
    const callId = body.callId;

    if (!callId || typeof callId !== 'string') {
      res.status(400).json({ error: 'callId is required' });
      return;
    }

    res.status(201).json({ callId, createdAtIso: new Date().toISOString() });
  });

  app.get('/api/calls/:callId', async (req: Request, res: Response) => {
    const { callId } = req.params;
    if (!callId) {
      res.status(400).json({ error: 'callId is required' });
      return;
    }

    res.json({
      callId,
      status: 'initialized',
      updatedAtIso: new Date().toISOString()
    });
  });
}
