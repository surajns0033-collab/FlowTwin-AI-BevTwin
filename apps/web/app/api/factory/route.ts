import { NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';

export async function GET() {
  try {
    const dataDir = path.join(process.cwd(), '..', '..', 'data');
    const factory = JSON.parse(fs.readFileSync(path.join(dataDir, 'factory.json'), 'utf-8'));
    const machines = JSON.parse(fs.readFileSync(path.join(dataDir, 'machines.json'), 'utf-8'));
    const orders = JSON.parse(fs.readFileSync(path.join(dataDir, 'orders.json'), 'utf-8'));
    const telemetry = JSON.parse(fs.readFileSync(path.join(dataDir, 'telemetry.json'), 'utf-8'));

    return NextResponse.json({
      factory,
      machines,
      orders,
      telemetry,
    });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
