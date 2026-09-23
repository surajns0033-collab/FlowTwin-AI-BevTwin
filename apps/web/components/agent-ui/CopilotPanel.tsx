'use client';

import React, { useState } from 'react';
import { useTwinStore } from '@/lib/store/twinStore';
import { StepDots } from './StepDots';
import { DecisionTile } from './DecisionTile';
import { getDeterministicScenarioComparison } from '@/lib/simulation/simEngine';
import { Bot, Send, Sparkles, AlertCircle } from 'lucide-react';

export const CopilotPanel: React.FC = () => {
  const [input, setInput] = useState('');
  const copilotMessages = useTwinStore((s) => s.copilotMessages);
  const addMessage = useTwinStore((s) => s.addMessage);
  const isSimulating = useTwinStore((s) => s.isSimulating);
  const setIsSimulating = useTwinStore((s) => s.setIsSimulating);
  const setStepProgress = useTwinStore((s) => s.setStepProgress);
  const resetStepProgress = useTwinStore((s) => s.resetStepProgress);
  const setFocusedTarget = useTwinStore((s) => s.setFocusedTarget);
  const setActiveCausalChain = useTwinStore((s) => s.setActiveCausalChain);
  const setActiveScenario = useTwinStore((s) => s.setActiveScenario);
  const setActiveDecision = useTwinStore((s) => s.setActiveDecision);
  const activeDecision = useTwinStore((s) => s.activeDecision);

  const handleSend = async (userPrompt: string) => {
    if (!userPrompt.trim()) return;

    // Add user message
    addMessage({ sender: 'user', text: userPrompt });
    setInput('');
    setIsSimulating(true);
    resetStepProgress();

    // Trigger sequential visual orchestration steps
    setStepProgress({ state: 'running' });
    await new Promise((r) => setTimeout(r, 450));
    setStepProgress({ state: 'done', dependencies: 'running' });

    await new Promise((r) => setTimeout(r, 500));
    setStepProgress({ dependencies: 'done', simulation: 'running' });

    await new Promise((r) => setTimeout(r, 600));
    setStepProgress({ simulation: 'done', evaluating: 'running' });

    await new Promise((r) => setTimeout(r, 550));
    setStepProgress({ evaluating: 'done', recommendation: 'running' });

    await new Promise((r) => setTimeout(r, 500));
    setStepProgress({ recommendation: 'done' });
    setIsSimulating(false);

    const promptLower = userPrompt.toLowerCase();

    if (
      promptLower.includes('why') ||
      promptLower.includes('slow') ||
      promptLower.includes('line 3') ||
      promptLower.includes('throttl') ||
      promptLower.includes('speed')
    ) {
      setFocusedTarget('M07');
      setActiveCausalChain(['M07', 'L3', 'QC01', 'SHIP01'], 'high');
      addMessage({
        sender: 'agent',
        text: 'Line 3 Canning Bottleneck Diagnosis: M07 Rotary Isobaric Filler Valve #7 has developed dynamic seal micro-leakage. Counter-pressure has dropped by 0.35 bar, elevating product temperature to 14.8°C and causing violent dissolved CO2 foaming. PLC line interlocks automatically throttled conveyor pacing to 68% (820 cans/min) to prevent can brim spillover.',
        actions: ['Show affected area', 'Compare scenarios', 'Optimize beverage flow'],
      });
    } else if (
      promptLower.includes('m07') ||
      promptLower.includes('valve') ||
      promptLower.includes('foam') ||
      promptLower.includes('down') ||
      promptLower.includes('fail') ||
      promptLower.includes('hour')
    ) {
      setFocusedTarget('M07');
      setActiveCausalChain(['M07', 'L3', 'QC01', 'PACK01', 'SHIP01'], 'critical');
      const comp = getDeterministicScenarioComparison('m07_down');
      setActiveScenario(comp);

      const decision = {
        title: 'BEVTWIN AI DECISION: Dynamic Flow Balancing & CIP Flush',
        actions: [
          'Reroute 20% beverage flow → Line 2 (M05 Tubular Pasteurizer holding tanks)',
          'Throttle Line 3 filler pacing to 820 cans/min with chilled CO2 booster',
          'Queue 8-minute automated CIP backflush on Valve #7 at next shift change',
        ],
        expected: {
          production: '9,600 cases (330ml cold brew / kombucha)',
          qc_queue: 'Normalized (-28% reject rate)',
          shipment_delay: '0.8h (Walmart Order #8921 SLA Preserved)',
        },
        confidence: 0.96,
        buttons: ['SIMULATE', 'APPLY PLAN'],
      };
      setActiveDecision(decision);

      addMessage({
        sender: 'agent',
        text: 'M07 Counter-Pressure Anomaly: Unmitigated 4-hour failure will create a 5.5h delivery delay on Walmart Order #8921 (financial penalty: -$18,400). Recommended AI mitigation reroutes 20% volume through Line 2 UHT holding tanks, stabilizing yield at 9,600 cases/hr with SLA preserved.',
        actions: ['Show affected area', 'Compare scenarios', 'Optimize beverage flow'],
        decision,
      });
    } else if (
      promptLower.includes('energy') ||
      promptLower.includes('sustainability') ||
      promptLower.includes('power') ||
      promptLower.includes('kwh') ||
      promptLower.includes('tariff')
    ) {
      setFocusedTarget('M05');
      const comp = getDeterministicScenarioComparison('sustainability');
      setActiveScenario(comp);

      const decision = {
        title: 'BEVTWIN AI DECISION: Chilling Loop & CIP Peak-Shaving',
        actions: [
          'Shift CIP (Clean-In-Place) caustic wash cycles to off-peak tariff window (22:00 - 05:00)',
          'Modulate CO2 chilling compressor head pressure on Line 3 to match throttled flow',
          'Enable variable-frequency drive power modulation on blending pumps M01 & M04',
        ],
        expected: {
          production: '10,000 cases (330ml)',
          energy: '14,200 kWh (-14.2% power draw)',
          cost_savings: '$1,620/day tariff reduction',
        },
        confidence: 0.95,
        buttons: ['SIMULATE', 'APPLY PLAN'],
      };
      setActiveDecision(decision);

      addMessage({
        sender: 'agent',
        text: 'Beverage Thermal & Chilling Optimization: Shifting energy-intensive thermal pasteurization loops and CIP sanitization to off-peak tariff hours preserves full 10,000 cases throughput while cutting electricity by 14.2% (1,120 kg CO2e avoided daily).',
        actions: ['Show affected area', 'Compare scenarios', 'Optimize beverage flow'],
        decision,
      });
    } else if (
      promptLower.includes('qc') ||
      promptLower.includes('reject') ||
      promptLower.includes('underfill') ||
      promptLower.includes('quality') ||
      promptLower.includes('headspace')
    ) {
      setFocusedTarget('QC01');
      setActiveCausalChain(['M07', 'L3', 'QC01'], 'critical');
      addMessage({
        sender: 'agent',
        text: 'QC01 High-Speed Vision & Acoustic Station: Underfill rejection rate is currently 6.40% (normal SLA threshold: <0.20%). Foam turbulence inside 330ml cans is causing false liquid level displacement. Rejection queue has surged by +28%. Rerouting batch volume to Line 2 immediately normalizes inspection yield.',
        actions: ['Show affected area', 'Compare scenarios', 'Optimize beverage flow'],
      });
    } else if (
      promptLower.includes('walmart') ||
      promptLower.includes('ship') ||
      promptLower.includes('delivery') ||
      promptLower.includes('order') ||
      promptLower.includes('delay') ||
      promptLower.includes('dispatch')
    ) {
      setFocusedTarget('SHIP01');
      setActiveCausalChain(['M07', 'L3', 'QC01', 'PACK01', 'SHIP01'], 'critical');
      addMessage({
        sender: 'agent',
        text: 'Dispatch Logistics Status: Walmart Order #8921 requires 10,000 cases of 330ml cold brew / kombucha by 18:00. Unmitigated M07 valve failure results in a 5.5-hour delay (OTIF penalty: -$18,400). Applying the Flow Re-Balance plan caps maximum delay to 0.8h, safely inside logistics SLA grace window.',
        actions: ['Show affected area', 'Compare scenarios', 'Optimize beverage flow'],
      });
    } else if (
      promptLower.includes('optimize') ||
      promptLower.includes('plan') ||
      promptLower.includes('mitigate') ||
      promptLower.includes('fix') ||
      promptLower.includes('solve')
    ) {
      const decision = {
        title: 'BEVTWIN AI DECISION: Flow Re-Balance & CIP Flush',
        actions: [
          'Reroute 20% beverage flow → Line 2 (M05 Tubular Pasteurizer holding tanks)',
          'Throttle Line 3 filler speed to 820 cans/min with chilled CO2 booster',
          'Queue 8-minute automated CIP backflush on Valve #7 at next shift change',
        ],
        expected: {
          production: '9,600 cases (330ml cold brew / kombucha)',
          qc_queue: 'Normalized (-28% reject rate)',
          shipment_delay: '0.8h (Walmart Order #8921 SLA Preserved)',
        },
        confidence: 0.96,
        buttons: ['SIMULATE', 'APPLY PLAN'],
      };
      setActiveDecision(decision);
      addMessage({
        sender: 'agent',
        text: 'Prescriptive Mitigation Ready: Diverting 20% flow to Line 2 UHT holding tanks balances hydraulic pressure across the plant, reduces M07 foam disturbance, and restores packaging queue throughput. Click [APPLY PLAN] below to dispatch commands.',
        actions: ['Show affected area', 'Compare scenarios'],
        decision,
      });
    } else {
      addMessage({
        sender: 'agent',
        text: 'Beverage Operations Twin Telemetry Evaluated: Line 1 (Bottling) operating at 98% nominal. Line 2 (Pasteurization) has 25% surplus buffering capacity. Line 3 (Canning) is experiencing backpressure foaming at M07 Isobaric Filler Valve #7 (temp 14.8°C, reject rate 6.4%).',
        actions: ['Show affected area', 'Compare scenarios', 'Optimize beverage flow'],
      });
    }
  };

  const handleActionButton = (action: string) => {
    if (action === 'Show affected area') {
      setFocusedTarget('M07');
      setActiveCausalChain(['M07', 'L3', 'QC01', 'PACK01', 'SHIP01'], 'critical');
      addMessage({
        sender: 'agent',
        text: 'Target Focused: Highlighting critical causal cascade on Line 3 in 3D Live Twin: M07 Rotary Isobaric Filler (Valve #7 leak, 14.8°C thermal rise) → Line 3 Infeed Conveyor (choked to 68%) → QC01 Inspection (6.4% underfill rejects) → Case Packer PACK01 → Dispatch Bay SHIP01 (Walmart Order #8921 risk).',
        actions: ['Compare scenarios', 'Optimize beverage flow'],
      });
    } else if (action === 'Compare scenarios') {
      const comp = getDeterministicScenarioComparison('m07_down');
      setActiveScenario(comp);
      addMessage({
        sender: 'agent',
        text: 'Scenario Comparison Generated: Baseline unmitigated bottleneck results in 5.5-hour delay on Walmart Order #8921 ($18,400 penalty, 8,200 cases/hr). Recommended AI Mitigation Plan reroutes 20% volume to Line 2 UHT holding tanks, restoring throughput to 9,600 cases/hr with delay reduced to 0.8h.',
        actions: ['Show affected area', 'Optimize beverage flow'],
      });
    } else if (action === 'Optimize' || action === 'Optimize beverage flow') {
      const decision = {
        title: 'BEVTWIN AI DECISION: Flow Re-Balance & CIP Flush',
        actions: [
          'Reroute 20% beverage flow → Line 2 (M05 Tubular Pasteurizer holding tanks)',
          'Throttle Line 3 filler speed to 820 cans/min with chilled CO2 booster',
          'Queue 8-minute automated CIP backflush on Valve #7 at next shift change',
        ],
        expected: {
          production: '9,600 cases (330ml cold brew / kombucha)',
          qc_queue: 'Normalized (-28% reject rate)',
          shipment_delay: '0.8h (Walmart Order #8921 SLA Preserved)',
        },
        confidence: 0.96,
        buttons: ['SIMULATE', 'APPLY PLAN'],
      };
      setActiveDecision(decision);
      addMessage({
        sender: 'agent',
        text: 'Prescriptive Optimization Generated: Balancing 20% beverage volume to Line 2 bypass relieves M07 backpressure while maintaining 9,600 cases/hr throughput. Click [APPLY PLAN] below to dispatch commands.',
        actions: ['Show affected area', 'Compare scenarios'],
        decision,
      });
    }
  };

  return (
    <div className="flex h-full flex-col rounded-xl border border-twin-panelBorder bg-twin-panel/95 shadow-2xl backdrop-blur-xl">
      {/* Header */}
      <div className="flex items-center justify-between border-b border-twin-panelBorder px-4 py-3">
        <div className="flex items-center space-x-2.5">
          <div className="relative">
            <Bot className="h-5 w-5 text-twin-accent" />
            <span className="absolute -top-0.5 -right-0.5 h-2.5 w-2.5 rounded-full bg-twin-green animate-pulse" />
          </div>
          <div>
            <h3 className="font-sans text-xs font-bold uppercase tracking-wider text-white">
              AI Operations Assistant
            </h3>
            <span className="font-sans text-[11px] text-cyan-300 font-medium">Gemini 3.8 Flash • ADK</span>
          </div>
        </div>
        <span className="rounded-full border border-cyan-500/40 bg-cyan-950/70 px-2.5 py-0.5 font-sans text-[11px] font-semibold text-cyan-200">
          State Synchronized
        </span>
      </div>

      {/* Message history */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {copilotMessages.map((msg) => (
          <div
            key={msg.id}
            className={`flex flex-col ${msg.sender === 'user' ? 'items-end' : 'items-start'}`}
          >
            <div
              className={`max-w-[94%] rounded-xl px-4 py-3 text-[13px] font-sans leading-relaxed tracking-normal ${
                msg.sender === 'user'
                  ? 'border border-cyan-500/50 bg-cyan-950/80 text-cyan-50 font-medium'
                  : 'border border-slate-700/90 bg-slate-900/95 text-slate-100 shadow-md'
              }`}
            >
              {msg.text}
            </div>

            {msg.actions && msg.actions.length > 0 && (
              <div className="mt-2 flex flex-wrap gap-2">
                {msg.actions.map((act) => (
                  <button
                    key={act}
                    onClick={() => handleActionButton(act)}
                    className="rounded-lg border border-cyan-500/40 bg-cyan-950/60 px-3 py-1.5 text-xs font-sans font-semibold text-cyan-200 transition-all hover:border-twin-accent hover:bg-cyan-900 hover:text-white shadow-sm"
                  >
                    {act}
                  </button>
                ))}
              </div>
            )}

            {msg.decision && <DecisionTile decision={msg.decision} />}
          </div>
        ))}

        <StepDots />
      </div>

      {/* Suggested Quick Prompts */}
      <div className="border-t border-twin-panelBorder/60 px-3 pt-2">
        <div className="flex flex-wrap gap-1.5 pb-1">
          <button
            onClick={() => handleSend('What if M07 is down for 4 hours?')}
            className="flex-1 min-w-[130px] rounded-md border border-slate-700/80 bg-slate-800/90 px-2.5 py-1 text-center text-xs font-sans text-slate-200 hover:border-cyan-400 hover:text-white transition-colors truncate"
            title="What if M07 is down for 4 hours?"
          >
            &quot;What if M07 down 4h?&quot;
          </button>
          <button
            onClick={() => handleSend('Why is Line 3 canning throttled?')}
            className="flex-1 min-w-[130px] rounded-md border border-slate-700/80 bg-slate-800/90 px-2.5 py-1 text-center text-xs font-sans text-slate-200 hover:border-cyan-400 hover:text-white transition-colors truncate"
            title="Why is Line 3 canning throttled?"
          >
            &quot;Why is Line 3 throttled?&quot;
          </button>
        </div>
      </div>

      {/* Input bar */}
      <div className="p-3">
        <div className="flex items-center space-x-2 rounded-lg border border-twin-panelBorder bg-slate-950/90 p-2 focus-within:border-twin-accent shadow-inner">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleSend(input)}
            placeholder="Ask Operations Assistant (e.g. 'M07 filler foaming diagnosis?')..."
            className="flex-1 bg-transparent px-2 text-xs font-sans text-white placeholder-slate-400 focus:outline-none"
          />
          <button
            onClick={() => handleSend(input)}
            disabled={isSimulating}
            className="rounded-md bg-twin-accent p-2 text-slate-950 font-bold transition-colors hover:brightness-110 disabled:opacity-50"
          >
            <Send className="h-4 w-4" />
          </button>
        </div>
      </div>
    </div>
  );
};
