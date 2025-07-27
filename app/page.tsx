import Link from "next/link"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"
import {
  FileText,
  PieChart,
  TrendingUp,
  DollarSign,
  AlertTriangle,
  Building2,
  Landmark,
  Globe,
  Info,
  Brain,
  Radio,
  BarChart3,
} from "lucide-react"

export default function HomePage() {
  return (
    <TooltipProvider>
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 flex flex-col">
        <div className="container mx-auto px-4 py-3 flex-1 flex flex-col">
          {/* Header Section */}
          <div className="text-center mb-4">
            <h1 className="text-3xl font-bold mb-2" style={{ color: "#112A43" }}>
              Climate Risk Analytics
            </h1>
            <p className="text-lg text-gray-600 max-w-5xl mx-auto leading-relaxed">
              Advanced climate-financial risk assessment for commercial real estate portfolios
            </p>
          </div>

          {/* Main Content Grid */}
          <div className="flex-1 flex flex-col">
            <div className="grid grid-cols-3 gap-6 max-w-full mx-auto flex-1">
              {/* Left Side - Key Insights Card (2/3 width) */}
              <div className="col-span-2">
                <Link href="/key-insights" className="group h-full block">
                  <Card className="h-full hover:shadow-2xl transition-all duration-500 cursor-pointer overflow-hidden rounded-3xl transform group-hover:-translate-y-2">
                    <div className="h-16 relative overflow-hidden bg-gradient-to-br from-emerald-600 via-teal-500 to-cyan-400">
                      <div className="absolute inset-0 bg-gradient-to-br from-black/20 to-black/40"></div>
                      <div className="absolute inset-0 bg-gradient-to-t from-transparent via-transparent to-white/10"></div>
                      <div className="absolute top-2 left-4">
                        <div className="w-8 h-8 bg-white/20 rounded-full flex items-center justify-center backdrop-blur-sm">
                          <TrendingUp className="w-4 h-4 text-white" />
                        </div>
                      </div>
                    </div>
                    <CardContent className="p-4 flex-1 flex flex-col justify-between">
                      <div>
                        <h2 className="text-xl font-bold mb-2" style={{ color: "#112A43" }}>
                          Key Insights
                        </h2>
                        <p className="text-gray-500 mb-3 leading-relaxed text-sm font-medium">
                          Tracking over <span className="font-bold">$5B+</span> in real estate loans across global
                          regions. Real-time climate risk at your fingertips.
                        </p>
                      </div>

                      {/* Regional Portfolio Metrics - 2x2 Grid */}
                      <div className="grid grid-cols-2 gap-2 mb-3">
                        {/* Global Portfolio */}
                        <div className="bg-white rounded-xl p-3 shadow-md border border-gray-100">
                          <div className="text-sm font-bold text-gray-800 mb-2 flex items-center gap-2">
                            <div className="w-2 h-2 bg-blue-600 rounded-full"></div>
                            Global Portfolio
                          </div>
                          <div className="grid grid-cols-3 gap-1 mb-2">
                            <div className="text-center">
                              <div className="flex items-center justify-center gap-1 mb-1">
                                <DollarSign className="w-2 h-2 text-green-600" />
                                <span className="text-xs font-medium text-gray-600">Total Loan</span>
                              </div>
                              <div className="text-sm font-bold text-green-600">$2.8B</div>
                            </div>
                            <div className="text-center">
                              <div className="flex items-center justify-center gap-1 mb-1">
                                <TrendingUp className="w-2 h-2 text-red-600" />
                                <span className="text-xs font-medium text-gray-600 flex items-center gap-1">
                                  <span className="font-semibold">NOI</span> Loss
                                  <Tooltip>
                                    <TooltipTrigger>
                                      <Info className="w-2 h-2 text-gray-400 hover:text-gray-600" />
                                    </TooltipTrigger>
                                    <TooltipContent>
                                      <p className="text-xs max-w-xs">
                                        Estimated 10-year Net Operating Income degradation under modeled climate
                                        transition scenarios.
                                      </p>
                                    </TooltipContent>
                                  </Tooltip>
                                </span>
                              </div>
                              <div className="text-sm font-bold text-red-600">-$145M</div>
                            </div>
                            <div className="text-center">
                              <div className="flex items-center justify-center gap-1 mb-1">
                                <AlertTriangle className="w-2 h-2 text-orange-600" />
                                <span className="text-xs font-medium text-gray-600 flex items-center gap-1">
                                  Prob. <span className="font-semibold">Default</span>
                                  <Tooltip>
                                    <TooltipTrigger>
                                      <Info className="w-2 h-2 text-gray-400 hover:text-gray-600" />
                                    </TooltipTrigger>
                                    <TooltipContent>
                                      <p className="text-xs max-w-xs">
                                        Modeled probability of default based on asset-level cash flow disruption and
                                        refinancing risk.
                                      </p>
                                    </TooltipContent>
                                  </Tooltip>
                                </span>
                              </div>
                              <div className="text-sm font-bold text-orange-600">+12.4%</div>
                            </div>
                          </div>
                          <div className="text-xs text-gray-500 text-center">
                            ↑ Risk driven by retrofit delays in aging buildings
                          </div>
                        </div>

                        {/* Canadian Portfolio */}
                        <div className="bg-white rounded-xl p-3 shadow-md border border-gray-100">
                          <div className="text-sm font-bold text-gray-800 mb-2 flex items-center gap-2">
                            <div className="w-2 h-2 bg-red-600 rounded-full"></div>
                            Canada
                          </div>
                          <div className="grid grid-cols-3 gap-1 mb-2">
                            <div className="text-center">
                              <div className="flex items-center justify-center gap-1 mb-1">
                                <DollarSign className="w-2 h-2 text-green-600" />
                                <span className="text-xs font-medium text-gray-600">Total Loan</span>
                              </div>
                              <div className="text-sm font-bold text-green-600">$1.2B</div>
                            </div>
                            <div className="text-center">
                              <div className="flex items-center justify-center gap-1 mb-1">
                                <TrendingUp className="w-2 h-2 text-red-600" />
                                <span className="text-xs font-medium text-gray-600 flex items-center gap-1">
                                  <span className="font-semibold">NOI</span> Loss
                                  <Tooltip>
                                    <TooltipTrigger>
                                      <Info className="w-2 h-2 text-gray-400 hover:text-gray-600" />
                                    </TooltipTrigger>
                                    <TooltipContent>
                                      <p className="text-xs max-w-xs">
                                        Estimated 10-year Net Operating Income degradation under modeled climate
                                        transition scenarios.
                                      </p>
                                    </TooltipContent>
                                  </Tooltip>
                                </span>
                              </div>
                              <div className="text-sm font-bold text-red-600">-$58M</div>
                            </div>
                            <div className="text-center">
                              <div className="flex items-center justify-center gap-1 mb-1">
                                <AlertTriangle className="w-2 h-2 text-orange-600" />
                                <span className="text-xs font-medium text-gray-600 flex items-center gap-1">
                                  Prob. <span className="font-semibold">Default</span>
                                  <Tooltip>
                                    <TooltipTrigger>
                                      <Info className="w-2 h-2 text-gray-400 hover:text-gray-600" />
                                    </TooltipTrigger>
                                    <TooltipContent>
                                      <p className="text-xs max-w-xs">
                                        Modeled probability of default based on asset-level cash flow disruption and
                                        refinancing risk.
                                      </p>
                                    </TooltipContent>
                                  </Tooltip>
                                </span>
                              </div>
                              <div className="text-sm font-bold text-orange-600">+9.8%</div>
                            </div>
                          </div>
                          <div className="text-xs text-gray-500 text-center">
                            Steady NOI loss in energy-inefficient offices
                          </div>
                        </div>

                        {/* U.S. Portfolio */}
                        <div className="bg-white rounded-xl p-3 shadow-md border border-gray-100">
                          <div className="text-sm font-bold text-gray-800 mb-2 flex items-center gap-2">
                            <div className="w-2 h-2 bg-blue-800 rounded-full"></div>
                            USA
                          </div>
                          <div className="grid grid-cols-3 gap-1 mb-2">
                            <div className="text-center">
                              <div className="flex items-center justify-center gap-1 mb-1">
                                <DollarSign className="w-2 h-2 text-green-600" />
                                <span className="text-xs font-medium text-gray-600">Total Loan</span>
                              </div>
                              <div className="text-sm font-bold text-green-600">$1.1B</div>
                            </div>
                            <div className="text-center">
                              <div className="flex items-center justify-center gap-1 mb-1">
                                <TrendingUp className="w-2 h-2 text-red-600" />
                                <span className="text-xs font-medium text-gray-600 flex items-center gap-1">
                                  <span className="font-semibold">NOI</span> Loss
                                  <Tooltip>
                                    <TooltipTrigger>
                                      <Info className="w-2 h-2 text-gray-400 hover:text-gray-600" />
                                    </TooltipTrigger>
                                    <TooltipContent>
                                      <p className="text-xs max-w-xs">
                                        Estimated 10-year Net Operating Income degradation under modeled climate
                                        transition scenarios.
                                      </p>
                                    </TooltipContent>
                                  </Tooltip>
                                </span>
                              </div>
                              <div className="text-sm font-bold text-red-600">-$62M</div>
                            </div>
                            <div className="text-center">
                              <div className="flex items-center justify-center gap-1 mb-1">
                                <AlertTriangle className="w-2 h-2 text-orange-600" />
                                <span className="text-xs font-medium text-gray-600 flex items-center gap-1">
                                  Prob. <span className="font-semibold">Default</span>
                                  <Tooltip>
                                    <TooltipTrigger>
                                      <Info className="w-2 h-2 text-gray-400 hover:text-gray-600" />
                                    </TooltipTrigger>
                                    <TooltipContent>
                                      <p className="text-xs max-w-xs">
                                        Modeled probability of default based on asset-level cash flow disruption and
                                        refinancing risk.
                                      </p>
                                    </TooltipContent>
                                  </Tooltip>
                                </span>
                              </div>
                              <div className="text-sm font-bold text-orange-600">+14.2%</div>
                            </div>
                          </div>
                          <div className="text-xs text-gray-500 text-center">
                            ↑ Defaults due to outdated HVAC compliance
                          </div>
                        </div>

                        {/* European Portfolio */}
                        <div className="bg-white rounded-xl p-3 shadow-md border border-gray-100">
                          <div className="text-sm font-bold text-gray-800 mb-2 flex items-center gap-2">
                            <div className="w-2 h-2 bg-purple-600 rounded-full"></div>
                            Europe
                          </div>
                          <div className="grid grid-cols-3 gap-1 mb-2">
                            <div className="text-center">
                              <div className="flex items-center justify-center gap-1 mb-1">
                                <DollarSign className="w-2 h-2 text-green-600" />
                                <span className="text-xs font-medium text-gray-600">Total Loan</span>
                              </div>
                              <div className="text-sm font-bold text-green-600">$500M</div>
                            </div>
                            <div className="text-center">
                              <div className="flex items-center justify-center gap-1 mb-1">
                                <TrendingUp className="w-2 h-2 text-red-600" />
                                <span className="text-xs font-medium text-gray-600 flex items-center gap-1">
                                  <span className="font-semibold">NOI</span> Loss
                                  <Tooltip>
                                    <TooltipTrigger>
                                      <Info className="w-2 h-2 text-gray-400 hover:text-gray-600" />
                                    </TooltipTrigger>
                                    <TooltipContent>
                                      <p className="text-xs max-w-xs">
                                        Estimated 10-year Net Operating Income degradation under modeled climate
                                        transition scenarios.
                                      </p>
                                    </TooltipContent>
                                  </Tooltip>
                                </span>
                              </div>
                              <div className="text-sm font-bold text-red-600">-$25M</div>
                            </div>
                            <div className="text-center">
                              <div className="flex items-center justify-center gap-1 mb-1">
                                <AlertTriangle className="w-2 h-2 text-orange-600" />
                                <span className="text-xs font-medium text-gray-600 flex items-center gap-1">
                                  Prob. <span className="font-semibold">Default</span>
                                  <Tooltip>
                                    <TooltipTrigger>
                                      <Info className="w-2 h-2 text-gray-400 hover:text-gray-600" />
                                    </TooltipTrigger>
                                    <TooltipContent>
                                      <p className="text-xs max-w-xs">
                                        Modeled probability of default based on asset-level cash flow disruption and
                                        refinancing risk.
                                      </p>
                                    </TooltipContent>
                                  </Tooltip>
                                </span>
                              </div>
                              <div className="text-sm font-bold text-orange-600">+11.7%</div>
                            </div>
                          </div>
                          <div className="text-xs text-gray-500 text-center">
                            Rising risk in coastal commercial hubs
                          </div>
                        </div>
                      </div>

                      <div className="space-y-2">
                        <div className="flex gap-2">
                          <Badge
                            variant="secondary"
                            className="rounded-full px-3 py-1 text-xs font-medium"
                            style={{ backgroundColor: "#99EFE4", color: "#112A43" }}
                          >
                            Risk Analytics
                          </Badge>
                          <Badge
                            variant="secondary"
                            className="rounded-full px-3 py-1 text-xs font-medium"
                            style={{ backgroundColor: "#66DCCC", color: "#112A43" }}
                          >
                            Financial Impact
                          </Badge>
                        </div>

                        {/* Impacted Sectors */}
                        <div className="flex items-center justify-center gap-4 pt-2 border-t border-gray-100">
                          <div className="flex items-center gap-1 text-gray-500">
                            <Building2 className="w-3 h-3" />
                            <span className="text-xs font-medium">Real Estate</span>
                          </div>
                          <div className="flex items-center gap-1 text-gray-500">
                            <Landmark className="w-3 h-3" />
                            <span className="text-xs font-medium">Lending</span>
                          </div>
                          <div className="flex items-center gap-1 text-gray-500">
                            <Globe className="w-3 h-3" />
                            <span className="text-xs font-medium">ESG Compliance</span>
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </Link>
              </div>

              {/* Right Side - Stacked Cards (1/3 width) */}
              <div className="col-span-1 flex flex-col h-full">
                {/* Explore Tools Heading */}
                <div className="mb-2">
                  <h3 className="text-lg font-semibold text-gray-700">Explore RBC Risk Tools</h3>
                </div>

                {/* Call-to-Action Button */}
                <div className="mb-3">
                  <Link href="/portfolio/overview">
                    <Button
                      className="w-full py-2 text-white font-semibold rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1"
                      style={{ backgroundColor: "#112A43" }}
                    >
                      Start Your Analysis
                    </Button>
                  </Link>
                </div>

                <div className="flex flex-col gap-3 flex-1">
                  {/* Asset Analysis Card - Top */}
                  <Link href="/asset/search" className="group flex-1">
                    <Card className="h-full hover:shadow-2xl transition-all duration-500 cursor-pointer overflow-hidden rounded-3xl transform group-hover:-translate-y-2">
                      <div className="h-12 relative overflow-hidden bg-gradient-to-br from-blue-600 via-blue-500 to-teal-400">
                        <div className="absolute inset-0 bg-gradient-to-br from-black/20 to-black/40"></div>
                        <div className="absolute inset-0 bg-gradient-to-t from-transparent via-transparent to-white/10"></div>
                        <div className="absolute top-2 left-3">
                          <div className="w-6 h-6 bg-white/20 rounded-full flex items-center justify-center backdrop-blur-sm">
                            <FileText className="w-3 h-3 text-white" />
                          </div>
                        </div>
                      </div>
                      <CardContent className="p-3 flex-1 flex flex-col justify-between">
                        <div>
                          <h2 className="text-base font-bold mb-1" style={{ color: "#112A43" }}>
                            Asset Analysis
                          </h2>
                          <p className="text-gray-600 mb-2 leading-relaxed text-xs">
                            Analyze individual commercial buildings for climate transition risks, energy efficiency, and
                            future resilience scenarios with comprehensive financial modeling.
                          </p>
                        </div>
                        <div className="flex gap-1 flex-wrap">
                          <Badge
                            variant="secondary"
                            className="rounded-full px-2 py-1 text-xs font-medium"
                            style={{ backgroundColor: "#99EFE4", color: "#112A43" }}
                          >
                            Risk Forecasting
                          </Badge>
                          <Badge
                            variant="secondary"
                            className="rounded-full px-2 py-1 text-xs font-medium"
                            style={{ backgroundColor: "#66DCCC", color: "#112A43" }}
                          >
                            Financial Impact
                          </Badge>
                        </div>
                      </CardContent>
                    </Card>
                  </Link>

                  {/* Portfolio Overview Card - Bottom */}
                  <Link href="/portfolio/filter" className="group flex-1">
                    <Card className="h-full hover:shadow-2xl transition-all duration-500 cursor-pointer overflow-hidden rounded-3xl transform group-hover:-translate-y-2">
                      <div className="h-12 relative overflow-hidden bg-gradient-to-br from-purple-600 via-indigo-500 to-blue-500">
                        <div className="absolute inset-0 bg-gradient-to-br from-black/20 to-black/40"></div>
                        <div className="absolute inset-0 bg-gradient-to-t from-transparent via-transparent to-white/10"></div>
                        <div className="absolute top-2 left-3">
                          <div className="w-6 h-6 bg-white/20 rounded-full flex items-center justify-center backdrop-blur-sm">
                            <PieChart className="w-3 h-3 text-white" />
                          </div>
                        </div>
                      </div>
                      <CardContent className="p-3 flex-1 flex flex-col justify-between">
                        <div>
                          <h2 className="text-base font-bold mb-1" style={{ color: "#112A43" }}>
                            Portfolio Overview
                          </h2>
                          <p className="text-gray-600 mb-2 leading-relaxed text-xs">
                            Comprehensive portfolio analysis across multiple properties with risk segmentation, exposure
                            management insights, and advanced financial modeling.
                          </p>
                        </div>
                        <div className="flex gap-1 flex-wrap">
                          <Badge
                            variant="secondary"
                            className="rounded-full px-2 py-1 text-xs font-medium"
                            style={{ backgroundColor: "#99EFE4", color: "#112A43" }}
                          >
                            Portfolio Metrics
                          </Badge>
                          <Badge
                            variant="secondary"
                            className="rounded-full px-2 py-1 text-xs font-medium"
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
          </div>

          {/* Bottom Banner Section - Fixed at Bottom */}
          <div className="mt-4 bg-white rounded-2xl shadow-lg border border-gray-200 p-3">
            <div className="flex items-center justify-between mb-2">
              <h3 className="text-sm font-semibold text-gray-800">What's Under the Hood</h3>
              <div className="text-xs text-gray-500">Powered by Amplify</div>
            </div>

            <div className="grid grid-cols-3 gap-3">
              <div className="flex items-start gap-2">
                <div className="w-6 h-6 bg-blue-100 rounded-full flex items-center justify-center">
                  <Brain className="w-3 h-3 text-blue-600" />
                </div>
                <div>
                  <h4 className="font-semibold text-gray-800 mb-1 text-xs">ML Forecasts</h4>
                  <p className="text-xs text-gray-600">
                    Scenario-aware financial projections driven by real-time building & climate data.
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-2">
                <div className="w-6 h-6 bg-green-100 rounded-full flex items-center justify-center">
                  <Radio className="w-3 h-3 text-green-600" />
                </div>
                <div>
                  <h4 className="font-semibold text-gray-800 mb-1 text-xs">Climate Data Feeds</h4>
                  <p className="text-xs text-gray-600">
                    Geospatial climate data and emissions layers from trusted policy sources.
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-2">
                <div className="w-6 h-6 bg-purple-100 rounded-full flex items-center justify-center">
                  <BarChart3 className="w-3 h-3 text-purple-600" />
                </div>
                <div>
                  <h4 className="font-semibold text-gray-800 mb-1 text-xs">Financial Modeling Engine</h4>
                  <p className="text-xs text-gray-600">Custom-built engine quantifying NOI risk and cash flow loss.</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </TooltipProvider>
  )
}
