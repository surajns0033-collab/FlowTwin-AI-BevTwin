import { NextRequest, NextResponse } from 'next/server';
import { exec } from 'child_process';
import path from 'path';

export const dynamic = 'force-dynamic';

export async function POST(req: NextRequest) {
  try {
    const { query } = await req.json();
    const cleanQuery = (query || 'temperature limit of M07').replace(/"/g, '\\"');

    const repoRoot = path.resolve(process.cwd(), '../..');
    const pyCmd = `python -c "import json, sys; sys.path.insert(0, '.'); from agents.agent_search import search_factory_knowledge; print(json.dumps(search_factory_knowledge('${cleanQuery}')))"`;

    return new Promise((resolve) => {
      exec(pyCmd, { cwd: repoRoot }, (error, stdout, stderr) => {
        if (error) {
          resolve(NextResponse.json({ error: error.message, stderr }, { status: 500 }));
        } else {
          try {
            const data = JSON.parse(stdout.trim());
            resolve(NextResponse.json(data));
          } catch (e: any) {
            resolve(NextResponse.json({ raw: stdout, error: e.message }));
          }
        }
      });
    });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
