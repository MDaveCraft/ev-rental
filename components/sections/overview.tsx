import { Card, CardContent } from "@/components/ui/card"

const items = [
  {
    challenge: "Fragmented charging & billing",
    solution: "Unified charging and payments with open protocols.",
  },
  {
    challenge: "Range anxiety & battery health uncertainty",
    solution: "AI range and health assurance with real-time telemetry.",
  },
  {
    challenge: "Low utilization across mixed fleets",
    solution: "Smart aggregation and dispatch across partners.",
  },
  {
    challenge: "Reactive maintenance causing downtime",
    solution: "Proactive co‑pilot flags issues before failure.",
  },
]

export function Overview() {
  return (
    <div className="grid gap-6 md:grid-cols-2">
      {items.map((it, idx) => (
        <Card key={idx}>
          <CardContent className="pt-6">
            <div className="text-sm font-medium">{it.challenge}</div>
            <p className="mt-2 text-muted-foreground">{it.solution}</p>
          </CardContent>
        </Card>
      ))}
    </div>
  )
}
