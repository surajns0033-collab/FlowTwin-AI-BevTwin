import { NextRequest, NextResponse } from 'next/server';
import { exec } from 'child_process';
import path from 'path';
import fs from 'fs';

export const dynamic = 'force-dynamic';

export async function GET() {
  try {
    const repoRoot = path.resolve(process.cwd(), '../..');
    const localStateFile = path.join(repoRoot, 'cloud', 'firestore_local_cache.json');

    if (fs.existsSync(localStateFile)) {
      const data = JSON.parse(fs.readFileSync(localStateFile, 'utf-8'));
      return NextResponse.json(data);
    }

    return NextResponse.json({
      status: 'pending',
      message: 'Firestore cache not yet initialized. Trigger POST to sync.',
    });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function POST() {
  try {
    const repoRoot = path.resolve(process.cwd(), '../..');
    const syncScript = path.join(repoRoot, 'cloud', 'firestore_sync.py');

    return new Promise((resolve) => {
      exec(`python -u "${syncScript}"`, { cwd: repoRoot }, (error, stdout, stderr) => {
        if (error) {
          resolve(NextResponse.json({ error: error.message, stderr }, { status: 500 }));
        } else {
          resolve(
            NextResponse.json({
              status: 'success',
              output: stdout.trim(),
              message: 'Synchronized all 9 Firestore collections.',
            })
          );
        }
      });
    });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
