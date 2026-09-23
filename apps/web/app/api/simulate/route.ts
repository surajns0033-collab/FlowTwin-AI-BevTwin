import { NextRequest, NextResponse } from 'next/server';
import { runDeterministicFailureSim, getDeterministicScenarioComparison } from '@/lib/simulation/simEngine';

export async function POST(req: NextRequest) {
  try {
    const { action, machineId, hours, scenarioType } = await req.json();

    if (action === 'compare') {
      const data = getDeterministicScenarioComparison(scenarioType || 'm07_down');
      return NextResponse.json(data);
    }

    const sim = runDeterministicFailureSim(machineId || 'M07', hours || 4.0);
    return NextResponse.json(sim);
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
