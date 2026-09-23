import { NextRequest, NextResponse } from 'next/server';
import { exec } from 'child_process';
import path from 'path';

export const dynamic = 'force-dynamic';

export async function GET() {
  try {
    const repoRoot = path.resolve(process.cwd(), '../..');
    const pyCmd = `python -c "import json, sys; sys.path.insert(0, '.'); from cloud.storage_manager import TwinStorageManager; mgr = TwinStorageManager(); print(json.dumps(mgr.list_factory_documents()))"`;

    return new Promise((resolve) => {
      exec(pyCmd, { cwd: repoRoot }, (error, stdout, stderr) => {
        if (error) {
          resolve(NextResponse.json({ error: error.message, stderr }, { status: 500 }));
        } else {
          try {
            const data = JSON.parse(stdout.trim());
            resolve(NextResponse.json({ documents: data }));
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

export async function POST(req: NextRequest) {
  try {
    const { scenarioName, payload } = await req.json();
    const repoRoot = path.resolve(process.cwd(), '../..');
    const safePayload = JSON.stringify(payload || {}).replace(/"/g, '\\"');
    const pyCmd = `python -c "import json, sys; sys.path.insert(0, '.'); from cloud.storage_manager import TwinStorageManager; mgr = TwinStorageManager(); print(mgr.export_scenario_report('${scenarioName || 'scenario'}', json.loads('${safePayload}')))"`;

    return new Promise((resolve) => {
      exec(pyCmd, { cwd: repoRoot }, (error, stdout, stderr) => {
        if (error) {
          resolve(NextResponse.json({ error: error.message, stderr }, { status: 500 }));
        } else {
          resolve(NextResponse.json({ uri: stdout.trim(), message: 'Exported report to Google Cloud Storage' }));
        }
      });
    });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
