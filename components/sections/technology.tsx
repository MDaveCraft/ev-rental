"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"

const services = [
  { name: "Booking", desc: "Search, reserve, contract, and lifecycle management." },
  { name: "Fleet Orchestrator", desc: "Dispatch, utilization optimization, partner balancing." },
  { name: "Telemetry Ingest", desc: "Stream SOC, temperature, fault codes, and location." },
  { name: "Payments", desc: "Unified invoicing, refunds, reconciliation across partners." },
  { name: "Charging Gateway", desc: "Abstract CPOs/EMSPs; tariffs, roaming, session settlement." },
  { name: "Support", desc: "Case handling, SLAs, escalation, and driver comms." },
]

export function Technology() {
  return (
    <div>
      <h2 className="text-xl font-semibold">Technology & Microservices</h2>
      <p className="mt-2 text-muted-foreground">Hover for details. Open standards for interoperability.</p>

      <TooltipProvider>
        <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {services.map((s) => (
            <Tooltip key={s.name} delayDuration={200}>
              <TooltipTrigger asChild>
                <Card className="cursor-help transition hover:border-primary">
                  <CardHeader>
                    <CardTitle className="text-base">{s.name}</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="text-xs text-muted-foreground">Hover to learn more</div>
                  </CardContent>
                </Card>
              </TooltipTrigger>
              <TooltipContent className="max-w-xs">{s.desc}</TooltipContent>
            </Tooltip>
          ))}
        </div>
      </TooltipProvider>
    </div>
  )
}
