import Link from "next/link"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { FileText, PieChart } from "lucide-react"

export default function HomePage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
      <div className="container mx-auto px-6 py-12">
        <div className="text-center mb-16">
          <h1 className="text-5xl font-bold mb-6" style={{ color: "#112A43" }}>
            Climate Risk Analytics
          </h1>
          <p className="text-2xl text-gray-600 max-w-4xl mx-auto leading-relaxed">
            Advanced climate-financial risk assessment for commercial real estate portfolios
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-12 max-w-7xl mx-auto h-[600px]">
          {/* Asset Analysis Card */}
          <Link href="/asset/search" className="group h-full">
            <Card className="h-full hover:shadow-2xl transition-all duration-500 cursor-pointer overflow-hidden rounded-3xl transform group-hover:-translate-y-2">
              <div className="h-48 relative overflow-hidden bg-gradient-to-br from-blue-600 via-blue-500 to-teal-400">
                <div className="absolute inset-0 bg-gradient-to-br from-black/20 to-black/40"></div>
                <div className="absolute inset-0 bg-gradient-to-t from-transparent via-transparent to-white/10"></div>
                <div className="absolute top-8 left-8">
                  <div className="w-20 h-20 bg-white/20 rounded-full flex items-center justify-center backdrop-blur-sm">
                    <FileText className="w-10 h-10 text-white" />
                  </div>
                </div>
              </div>
              <CardContent className="p-10 flex-1 flex flex-col justify-between">
                <div>
                  <h2 className="text-3xl font-bold mb-6" style={{ color: "#112A43" }}>
                    Asset Analysis
                  </h2>
                  <p className="text-gray-600 mb-8 leading-relaxed text-lg">
                    Analyze individual commercial buildings for climate transition risks, energy efficiency, and future
                    resilience scenarios with comprehensive financial modeling.
                  </p>
                </div>
                <div className="flex gap-4">
                  <Badge
                    variant="secondary"
                    className="rounded-full px-6 py-3 text-sm font-medium"
                    style={{ backgroundColor: "#99EFE4", color: "#112A43" }}
                  >
                    Risk Forecasting
                  </Badge>
                  <Badge
                    variant="secondary"
                    className="rounded-full px-6 py-3 text-sm font-medium"
                    style={{ backgroundColor: "#66DCCC", color: "#112A43" }}
                  >
                    Financial Impact
                  </Badge>
                </div>
              </CardContent>
            </Card>
          </Link>

          {/* Portfolio Overview Card */}
          <Link href="/portfolio/filter" className="group h-full">
            <Card className="h-full hover:shadow-2xl transition-all duration-500 cursor-pointer overflow-hidden rounded-3xl transform group-hover:-translate-y-2">
              <div className="h-48 relative overflow-hidden bg-gradient-to-br from-purple-600 via-indigo-500 to-blue-500">
                <div className="absolute inset-0 bg-gradient-to-br from-black/20 to-black/40"></div>
                <div className="absolute inset-0 bg-gradient-to-t from-transparent via-transparent to-white/10"></div>
                <div className="absolute top-8 left-8">
                  <div className="w-20 h-20 bg-white/20 rounded-full flex items-center justify-center backdrop-blur-sm">
                    <PieChart className="w-10 h-10 text-white" />
                  </div>
                </div>
              </div>
              <CardContent className="p-10 flex-1 flex flex-col justify-between">
                <div>
                  <h2 className="text-3xl font-bold mb-6" style={{ color: "#112A43" }}>
                    Portfolio Overview
                  </h2>
                  <p className="text-gray-600 mb-8 leading-relaxed text-lg">
                    Comprehensive portfolio analysis across multiple properties with risk segmentation, exposure
                    management insights, and advanced financial modeling.
                  </p>
                </div>
                <div className="flex gap-4">
                  <Badge
                    variant="secondary"
                    className="rounded-full px-6 py-3 text-sm font-medium"
                    style={{ backgroundColor: "#99EFE4", color: "#112A43" }}
                  >
                    Portfolio Metrics
                  </Badge>
                  <Badge
                    variant="secondary"
                    className="rounded-full px-6 py-3 text-sm font-medium"
                    style={{ backgroundColor: "#66DCCC", color: "#112A43" }}
                  >
                    Risk Aggregation
                  </Badge>
                </div>
              </CardContent>
            </Card>
          </Link>
        </div>
      </div>
    </div>
  )
}
