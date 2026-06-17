"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.registerRoutes = registerRoutes;
function registerRoutes(app) {
    app.get('/api/version', (_req, res) => {
        res.json({
            name: 'init-salescoach-mvp',
            version: '0.1.0'
        });
    });
    // Placeholder endpoints to keep the API surface stable for the MVP.
    // The full EventBus-only orchestration and MongoDB persistence will be added next.
    app.post('/api/calls', async (req, res) => {
        const body = req.body;
        const callId = body.callId;
        if (!callId || typeof callId !== 'string') {
            res.status(400).json({ error: 'callId is required' });
            return;
        }
        res.status(201).json({ callId, createdAtIso: new Date().toISOString() });
    });
    app.get('/api/calls/:callId', async (req, res) => {
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
//# sourceMappingURL=routes.js.map