import express from 'express';
import cors from 'cors';
import session from 'express-session';
import { AIProjectClient } from '@azure/ai-projects';
import { DefaultAzureCredential } from '@azure/identity';
import dotenv from 'dotenv';
import path from 'path';

declare module 'express-session' {
  interface SessionData {
    threadId?: string;
  }
}

// Load .env from the backend root (works whether run from dist/ or via ts-node)
dotenv.config({ path: path.resolve(__dirname, '..', '.env') });

const app = express();
const port = process.env.PORT || 5000;
const isProduction = process.env.NODE_ENV === 'production';

// Trust Azure App Service proxy
if (isProduction) {
  app.set('trust proxy', 1);
}

app.use(cors({
  origin: process.env.FRONTEND_URL || 'http://localhost:3000',
  credentials: true,
}));
app.use(express.json());

app.use(
  session({
    secret: process.env.SESSION_SECRET!,
    resave: false,
    saveUninitialized: false,
    cookie: {
      maxAge: 24 * 60 * 60 * 1000,
      httpOnly: true,
      secure: isProduction,
      sameSite: isProduction ? 'none' : 'lax',
    },
  })
);

const project = new AIProjectClient(
  process.env.PROJECT_ENDPOINT!,
  new DefaultAzureCredential()
);

const agentId = process.env.AGENT_ID!;

// Health check endpoint (used by Azure App Service)
app.get('/api/health', (_req, res) => {
  res.json({ status: 'ok' });
});

// Get or create thread per user session
app.get('/api/thread', async (req, res) => {
  if (!req.session.threadId) {
    const thread = await project.agents.threads.create();
    req.session.threadId = thread.id;
    console.log('Created new thread:', thread.id);
  }
  res.json({ threadId: req.session.threadId });
});

// Main chat endpoint
app.post('/api/chat', async (req, res) => {
  const { message } = req.body;
  let threadId = req.session.threadId;

  if (!threadId) {
    const thread = await project.agents.threads.create();
    threadId = thread.id;
    req.session.threadId = threadId;
    console.log('Auto-created thread:', threadId);
  }

  if (!message) {
    return res.status(400).json({ error: 'Missing message' });
  }


  try {
    // Add user message
    await project.agents.messages.create(threadId, 'user', message);

    // Create & run
    let run = await project.agents.runs.create(threadId, agentId);

    // Poll until terminal state
    while (run.status === 'queued' || run.status === 'in_progress') {
      await new Promise((r) => setTimeout(r, 1000));
      run = await project.agents.runs.get(threadId, run.id);
    }

    if (run.status === 'failed') {
      return res.status(500).json({ error: run.lastError?.message || 'Run failed' });
    }

    // Get latest messages (last one should be assistant)
    const messagesIter = await project.agents.messages.list(threadId, { order: 'desc', limit: 1 });
    const messagesArr: any[] = [];
    for await (const msg of messagesIter) {
      messagesArr.push(msg);
    }
    const assistantMsg = messagesArr.find(m => m.role === 'assistant');

    const content = assistantMsg?.content.find((c: { type: string }) => c.type === 'text');
    const text = content ? (content as any).text.value : 'No response';

    res.json({ response: text, threadId });
  } catch (err: any) {
    console.error(err);
    res.status(500).json({ error: err.message || 'Server error' });
  }
});

// Global error handler (catches JSON parse errors etc.)
app.use((err: any, _req: express.Request, res: express.Response, _next: express.NextFunction) => {
  console.error('Unhandled error:', err.message);
  res.status(err.status || 500).json({ error: err.message || 'Internal server error' });
});

app.listen(port, () => {
  console.log(`Backend running on http://localhost:${port}`);
});