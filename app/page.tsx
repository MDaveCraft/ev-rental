import { Navbar } from "@/components/brand/navbar"
import { Hero } from "@/components/hero"
import { Features } from "@/components/sections/features"
import { MarketTrajectoryChart } from "@/components/sections/charts/market-trajectory-chart"
import { RoadmapChart } from "@/components/sections/charts/roadmap-chart"
import { UseCases } from "@/components/sections/use-cases"
import { Footer } from "@/components/brand/footer"

export default function Page() {
  return (
    <main className="scroll-smooth">
      <Navbar />
      <section id="hero" aria-label="Hero" className="border-b">
        <Hero />
      </section>

      <section id="features" aria-label="Features" className="container mx-auto px-4 py-16 md:py-24 border-t">
        <Features />
      </section>

      <section id="analytics" aria-label="Analytics" className="py-16 md:py-24 border-t">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-white tracking-tight">Platform Analytics</h2>
            <p className="text-zinc-400 mt-3 max-w-2xl mx-auto">
              Real-time insights into market growth and development progress
            </p>
          </div>

          <div className="grid gap-8 lg:grid-cols-2">
            <MarketTrajectoryChart />
            <RoadmapChart />
          </div>
        </div>
      </section>

      <section id="use-cases" aria-label="Use cases" className="container mx-auto px-4 py-16 md:py-24 border-t">
        <UseCases />
      </section>

      <Footer />
    </main>
  )
}
