"use client"

import { motion } from "framer-motion"
import { Leaf, TrendingUp, Lock, Clock, Zap, Car, MapPin, Info, ChevronRight } from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"
import { V2GTreeVisualization } from "./v2g-tree-visualization"
import { V2GTimeSeriesChart } from "./v2g-time-series-chart"
import { V2GCircularGauge } from "./v2g-circular-gauge"
import Image from "next/image"

const fadeUp = {
  initial: { opacity: 0, y: 16 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.5, ease: [0.22, 1, 0.36, 1] },
}

const stagger = {
  animate: {
    transition: {
      staggerChildren: 0.1,
    },
  },
}

// Credit data
const creditData = {
  total: 2847,
  locked: 1923,
  vesting: 682,
  claimable: 242,
  estimatedValue: "$1,847",
  gridScore: 87,
  avgKwhPerSession: 12.4,
  reliabilityScore: 94,
}

// Credit breakdown cards
const creditBreakdown = [
  {
    title: "Vehicle Contribution",
    value: "1,284 kWh",
    subtitle: "Tata Nexon EV",
    icon: Car,
    color: "text-amber-600",
    image: "/modern-ev-charging.png",
  },
  {
    title: "Grid Zone",
    value: "South Region",
    subtitle: "Karnataka Grid",
    icon: MapPin,
    color: "text-emerald-600",
    image: "/city-skyline-bangalore-modern-buildings.jpg",
  },
  {
    title: "Peak Contribution",
    value: "68%",
    subtitle: "During high demand",
    icon: Zap,
    color: "text-orange-600",
    image: "/electrical-power-grid-tower-sunset.jpg",
  },
  {
    title: "Carbon Offset",
    value: "847 kg",
    subtitle: "CO₂ equivalent",
    icon: Leaf,
    color: "text-green-600",
    image: "/green-forest-trees-nature-aerial-view.jpg",
  },
]

// Future use cases
const futureUseCases = [
  { title: "Apply credits to rentals", status: "Coming Q2 2026" },
  { title: "Offset charging costs", status: "Coming Q3 2026" },
  { title: "Convert to carbon credits", status: "Regulatory review" },
  { title: "Energy marketplace settlement", status: "Coming 2027" },
  { title: "Cash payout", status: "Where regulation permits" },
]

export function V2GCreditsPage() {
  return (
    <TooltipProvider>
      <motion.div variants={stagger} initial="initial" animate="animate" className="space-y-6 pb-8">
        {/* Header Section */}
        <motion.div variants={fadeUp} className="space-y-1">
          <h1 className="text-2xl font-semibold tracking-tight text-foreground">V2G Credits</h1>
          <p className="text-muted-foreground">Your contribution to the energy grid</p>
        </motion.div>

        {/* KPI Summary Strip */}
        <motion.div variants={fadeUp} className="grid gap-3 grid-cols-2 lg:grid-cols-4">
          {[
            {
              label: "Total Credits",
              value: creditData.total.toLocaleString(),
              icon: Leaf,
              tooltip: "Total V2G credits earned from grid participation",
              color: "text-amber-600",
            },
            {
              label: "Locked",
              value: creditData.locked.toLocaleString(),
              icon: Lock,
              tooltip: "Credits earned but not yet usable. Typically unlocks after 90 days.",
              color: "text-stone-500",
            },
            {
              label: "Vesting",
              value: creditData.vesting.toLocaleString(),
              icon: Clock,
              tooltip: "Credits maturing over time. Expected unlock: 30-60 days.",
              color: "text-amber-500",
            },
            {
              label: "Est. Future Value",
              value: creditData.estimatedValue,
              icon: TrendingUp,
              tooltip: "Projected value based on current market rates. This is an estimate only.",
              color: "text-emerald-600",
            },
          ].map((kpi, i) => (
            <Card key={kpi.label} className="border-border/50 bg-card/50">
              <CardContent className="p-4">
                <div className="flex items-start justify-between">
                  <div className="space-y-1">
                    <div className="flex items-center gap-1.5">
                      <p className="text-xs font-medium text-muted-foreground uppercase tracking-wide">{kpi.label}</p>
                      <Tooltip>
                        <TooltipTrigger>
                          <Info className="h-3 w-3 text-muted-foreground/50" />
                        </TooltipTrigger>
                        <TooltipContent className="max-w-[200px]">
                          <p className="text-xs">{kpi.tooltip}</p>
                        </TooltipContent>
                      </Tooltip>
                    </div>
                    <p className={`text-2xl font-bold ${kpi.color}`}>{kpi.value}</p>
                  </div>
                  <kpi.icon className={`h-5 w-5 ${kpi.color} opacity-50`} />
                </div>
              </CardContent>
            </Card>
          ))}
        </motion.div>

        {/* Main Visualization Section */}
        <motion.div variants={fadeUp} className="grid gap-4 lg:grid-cols-12">
          {/* Left Panel - Contribution Health */}
          <Card className="lg:col-span-3 border-border/50 bg-gradient-to-b from-stone-50/50 to-stone-100/30 dark:from-stone-900/30 dark:to-stone-950/50">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-semibold text-stone-700 dark:text-stone-300">
                Contribution Health
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <V2GCircularGauge value={creditData.gridScore} label="Grid Participation" />

              <div className="space-y-3">
                <div className="flex justify-between items-center text-sm">
                  <span className="text-muted-foreground">Avg kWh/session</span>
                  <span className="font-medium">{creditData.avgKwhPerSession}</span>
                </div>
                <div className="flex justify-between items-center text-sm">
                  <span className="text-muted-foreground">Reliability Score</span>
                  <span className="font-medium text-emerald-600">{creditData.reliabilityScore}%</span>
                </div>
              </div>

              {/* Credit Status Legend */}
              <div className="pt-4 border-t border-border/50 space-y-2">
                <p className="text-xs font-medium text-muted-foreground uppercase tracking-wide">Credit Status</p>
                <div className="space-y-1.5">
                  <div className="flex items-center gap-2 text-xs">
                    <span className="h-2.5 w-2.5 rounded-full bg-stone-400" />
                    <span className="text-muted-foreground">Locked</span>
                  </div>
                  <div className="flex items-center gap-2 text-xs">
                    <span className="h-2.5 w-2.5 rounded-full bg-amber-500" />
                    <span className="text-muted-foreground">Vesting</span>
                  </div>
                  <div className="flex items-center gap-2 text-xs">
                    <span className="h-2.5 w-2.5 rounded-full bg-emerald-500" />
                    <span className="text-muted-foreground">Claimable (future)</span>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Central Tree Visualization */}
          <Card className="lg:col-span-6 border-border/50 overflow-hidden bg-gradient-to-b from-stone-50 to-amber-50/30 dark:from-stone-900/50 dark:to-amber-950/20">
            <CardContent className="p-0">
              <V2GTreeVisualization
                totalCredits={creditData.total}
                lockedCredits={creditData.locked}
                vestingCredits={creditData.vesting}
                claimableCredits={creditData.claimable}
              />
            </CardContent>
          </Card>

          {/* Right Panel - Growth Over Time */}
          <Card className="lg:col-span-3 border-border/50 bg-gradient-to-b from-stone-50/50 to-stone-100/30 dark:from-stone-900/30 dark:to-stone-950/50">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-semibold text-stone-700 dark:text-stone-300">
                Growth Over Time
              </CardTitle>
            </CardHeader>
            <CardContent>
              <V2GTimeSeriesChart />

              <div className="mt-4 pt-4 border-t border-border/50">
                <div className="flex items-center justify-between text-sm">
                  <span className="text-muted-foreground">This month</span>
                  <span className="font-medium text-emerald-600">+127 credits</span>
                </div>
                <div className="flex items-center justify-between text-sm mt-2">
                  <span className="text-muted-foreground">Growth rate</span>
                  <span className="font-medium text-amber-600">+12%</span>
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Time-Series Section */}
        <motion.div variants={fadeUp}>
          <Card className="border-border/50 bg-stone-950 text-stone-100">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-semibold text-stone-300">How Your Credits Grew</CardTitle>
              <p className="text-xs text-stone-500">Monthly contribution and credit accrual</p>
            </CardHeader>
            <CardContent>
              <V2GTimeSeriesChart variant="dark" expanded />
            </CardContent>
          </Card>
        </motion.div>

        {/* Credit Breakdown Cards */}
        <motion.div variants={fadeUp}>
          <h2 className="text-sm font-semibold text-muted-foreground uppercase tracking-wide mb-3">Credit Breakdown</h2>
          <div className="grid gap-3 grid-cols-2 lg:grid-cols-4">
            {creditBreakdown.map((card, i) => (
              <motion.div
                key={card.title}
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4 + i * 0.05 }}
              >
                <Card className="border-border/50 bg-card/50 hover:bg-card/80 transition-all cursor-pointer group overflow-hidden relative">
                  {/* Background Image */}
                  <div className="absolute inset-0 z-0">
                    <Image
                      src={card.image || "/placeholder.svg"}
                      alt={card.title}
                      fill
                      className="object-cover opacity-20 group-hover:opacity-30 group-hover:scale-105 transition-all duration-500"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-background via-background/90 to-background/70" />
                  </div>
                  <CardContent className="p-4 relative z-10">
                    <div className="flex items-start justify-between">
                      <div className="space-y-1">
                        <p className="text-xs text-muted-foreground">{card.title}</p>
                        <p className={`text-lg font-bold ${card.color}`}>{card.value}</p>
                        <p className="text-xs text-muted-foreground">{card.subtitle}</p>
                      </div>
                      <card.icon
                        className={`h-5 w-5 ${card.color} opacity-50 group-hover:opacity-100 transition-opacity`}
                      />
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* Future Claims Section */}
        <motion.div variants={fadeUp}>
          <Card className="border-border/50 bg-stone-100/50 dark:bg-stone-900/30">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-semibold text-stone-600 dark:text-stone-400">
                Planned Uses for V2G Credits
              </CardTitle>
              <p className="text-xs text-muted-foreground">
                These features are under development and subject to regulatory approval
              </p>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                {futureUseCases.map((useCase, i) => (
                  <div
                    key={useCase.title}
                    className="flex items-center justify-between p-3 rounded-lg bg-stone-200/50 dark:bg-stone-800/30 opacity-60"
                  >
                    <div className="flex items-center gap-3">
                      <div className="h-2 w-2 rounded-full bg-stone-400" />
                      <span className="text-sm text-stone-600 dark:text-stone-400">{useCase.title}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="text-xs text-stone-500 dark:text-stone-500">{useCase.status}</span>
                      <ChevronRight className="h-4 w-4 text-stone-400" />
                    </div>
                  </div>
                ))}
              </div>
              <p className="mt-4 text-xs text-stone-500 text-center">
                All features subject to policy and regulatory changes
              </p>
            </CardContent>
          </Card>
        </motion.div>
      </motion.div>
    </TooltipProvider>
  )
}
