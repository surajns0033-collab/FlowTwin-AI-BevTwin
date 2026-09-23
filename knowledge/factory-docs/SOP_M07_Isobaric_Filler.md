# Standard Operating Procedure (SOP) — M07 Rotary Counter-Pressure Isobaric Filler

## Equipment ID: M07 (Line 3 Canning Line)
- **Manufacturer:** Krones / CFT Monobloc Packaging Systems
- **Configuration:** 64-Head Isobaric Counter-Pressure Rotary Carousel
- **Nominal Operating Speed:** 600 cans/min (330ml / 500ml sleek cans)
- **Counter-Pressure CO2 Manifold:** 2.8 – 3.2 bar
- **Product Infeed Temperature:** 2.0°C – 4.0°C (Cold-Brew Coffee & Kombucha)
- **Foaming Critical Threshold:** > 12% headspace displacement or differential > 0.25 bar

## Micro-Leakage & Severe Foaming Protocol (ALT-M07-FOAM)
1. **Symptom & Root Cause:**
   - Valve head #7 pneumatic bellow seal micro-leakage causes an isobaric chamber drop to 2.45 bar (0.35 bar below manifold specification).
   - The pressure differential causes violent CO2 breakout, generating excessive micro-foam upon can sniff/depressurization.
   - Fill volume is displaced, triggering high-speed reject flags at downstream QC01 (fill-height tolerance ±0.5mm).
   - Line 3 throughput drops from 600 cans/min to ~370 cans/min (-38% bottleneck).

2. **Automated Twin Mitigation Workflow:**
   - Step 1: Modulate Line 3 infeed metering servo to 65% to avoid conveyor backlog and line jamming.
   - Step 2: Reroute 20% beverage flow to Line 2 buffer / Tubular UHT Pasteurizer (M05) holding tanks.
   - Step 3: Trigger an 8-minute automated CIP (Clean-in-Place) hot sanitization backflush sequence on filling manifold #7 to clear crystallized residue.
   - Step 4: Dispatch robotic/maintenance technician for 12-minute quick-disconnect Viton elastomer seal replacement.
   - Step 5: Resume 100% nominal speed (600 cans/min), restoring order SLA delivery.
