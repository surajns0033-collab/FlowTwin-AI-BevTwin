import { NextRequest } from 'next/server';
import { spawn } from 'child_process';
import path from 'path';

export const dynamic = 'force-dynamic';

export async function POST(req: NextRequest) {
  try {
    const { prompt } = await req.json();
    const cleanPrompt = (prompt || 'Why is Line 3 slow?').replace(/"/g, '\\"');

    // Locate agent_runner.py at repository root
    const repoRoot = path.resolve(process.cwd(), '../..');
    const runnerScript = path.join(repoRoot, 'agents', 'agent_runner.py');

    // Launch Python Agent Pipeline
    const pythonProcess = spawn('python', ['-u', runnerScript, cleanPrompt], {
      cwd: repoRoot,
      env: {
        ...process.env,
        PYTHONUNBUFFERED: '1',
      },
    });

    const encoder = new TextEncoder();

    const stream = new ReadableStream({
      start(controller) {
        pythonProcess.stdout.on('data', (chunk: Buffer) => {
          const lines = chunk.toString().split('\n');
          for (const line of lines) {
            const trimmed = line.trim();
            if (trimmed.startsWith('{') && trimmed.endsWith('}')) {
              controller.enqueue(encoder.encode(`data: ${trimmed}\n\n`));
            }
          }
        });

        pythonProcess.stderr.on('data', (errChunk: Buffer) => {
          console.error('[Agent Runner Error]:', errChunk.toString());
        });

        pythonProcess.on('close', (code) => {
          if (code !== 0) {
            controller.enqueue(
              encoder.encode(`data: ${JSON.stringify({ event: 'DONE', status: 'error', code })}\n\n`)
            );
          }
          controller.close();
        });

        pythonProcess.on('error', (err) => {
          console.error('[Agent Process Launch Error]:', err);
          controller.enqueue(
            encoder.encode(`data: ${JSON.stringify({ event: 'DONE', status: 'launch_failed' })}\n\n`)
          );
          controller.close();
        });
      },
      cancel() {
        pythonProcess.kill();
      },
    });

    return new Response(stream, {
      headers: {
        'Content-Type': 'text/event-stream',
        'Cache-Control': 'no-cache, no-transform',
        Connection: 'keep-alive',
      },
    });
  } catch (error: any) {
    return new Response(JSON.stringify({ error: error.message }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' },
    });
  }
}
