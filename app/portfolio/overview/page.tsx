"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { Checkbox } from "@/components/ui/checkbox"
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, LineChart, Line } from "recharts"
import { Stepper } from "@/components/stepper"
import { CollapsibleControlsSidebar } from "@/components/collapsible-controls-sidebar"
import { HelpCircle, TrendingUp, DollarSign, Shield, Building, Settings, Zap, Leaf } from "lucide-react"
import type { CustomScenario } from "@/components/scenario-modal"

const basePortfolioData = [
  { category: "Ontario", propertyCount: 45, dollarValue: 2.1, highRisk: 15, mediumRisk: 60, lowRisk: 25 },
  { category: "Quebec", propertyCount: 32, dollarValue: 1.8, highRisk: 20, mediumRisk: 55, lowRisk: 25 },
  { category: "BC", propertyCount: 28, dollarValue: 2.4, highRisk: 10, mediumRisk: 65, lowRisk: 25 },
  { category: "Alberta", propertyCount: 18, dollarValue: 1.2, highRisk: 25, mediumRisk: 50, lowRisk: 25 },
]

const baseRiskTrendData = [
  {
    year: 2024,
    risk: 6.8,
    revenue: 45.2,
    expenses: 18.3,
    noi: 26.9,
    revenuePayFines: 8.2,
    revenueRetrofit: 8.8,
    expensePayFines: 2.8,
    expenseRetrofit: 1.8,
  },
  {
    year: 2026,
    risk: 7.2,
    revenue: 47.1,
    expenses: 19.8,
    noi: 27.3,
    revenuePayFines: 8.4,
    revenueRetrofit: 9.2,
    expensePayFines: 3.2,
    expenseRetrofit: 1.8,
  },
  {
    year: 2028,
    risk: 7.8,
    revenue: 49.3,
    expenses: 21.5,
    noi: 27.8,
    revenuePayFines: 8.6,
    revenueRetrofit: 9.8,
    expensePayFines: 3.8,
    expenseRetrofit: 1.8,
  },
  {
    year: 2030,
    risk: 8.4,
    revenue: 51.8,
    expenses: 23.4,
    noi: 28.4,
    revenuePayFines: 8.8,
    revenueRetrofit: 10.4,
    expensePayFines: 4.5,
    expenseRetrofit: 1.9,
  },
  {
    year: 2035,
    risk: 9.6,
    revenue: 58.2,
    expenses: 28.1,
    noi: 30.1,
    revenuePayFines: 9.2,
    revenueRetrofit: 11.8,
    expensePayFines: 5.8,
    expenseRetrofit: 1.8,
  },
  {
    year: 2040,
    risk: 10.8,
    revenue: 65.4,
    expenses: 33.8,
    noi: 31.6,
    revenuePayFines: 9.8,
    revenueRetrofit: 12.6,
    expensePayFines: 7.2,
    expenseRetrofit: 1.8,
  },
  {
    year: 2045,
    risk: 12.1,
    revenue: 73.2,
    expenses: 40.2,
    noi: 33.0,
    revenuePayFines: 10.2,
    revenueRetrofit: 13.4,
    expensePayFines: 8.8,
    expenseRetrofit: 1.6,
  },
  {
    year: 2050,
    risk: 13.5,
    revenue: 81.8,
    expenses: 47.5,
    noi: 34.3,
    revenuePayFines: 10.8,
    revenueRetrofit: 14.0,
    expensePayFines: 10.5,
    expenseRetrofit: 1.7,
  },
]

const allTableColumns = [
  { key: "address", label: "Address", enabled: true },
  { key: "risk", label: "Risk Rating", enabled: true },
  { key: "noiChange", label: "NOI Change", enabled: true },
  { key: "dscrChange", label: "DSCR Change", enabled: true },
  { key: "ltvDirection", label: "LTV Direction", enabled: false },
  { key: "efficiency", label: "Energy Efficiency", enabled: false },
  { key: "retrofitCost", label: "Cost per Retrofit", enabled: false },
  { key: "regulatoryShocks", label: "Avg. Regulatory Shocks", enabled: false },
]

const tableData = [
  {
    address: "123 Bay Street, Toronto",
    risk: "Medium",
    noiChange: "+2.3%",
    dscrChange: "-0.15",
    ltvDirection: "↑",
    efficiency: "B+",
    retrofitCost: "$2.1M",
    regulatoryShocks: "3.2",
  },
  {
    address: "456 King Street, Vancouver",
    risk: "High",
    noiChange: "-1.8%",
    dscrChange: "-0.22",
    ltvDirection: "↑",
    efficiency: "C",
    retrofitCost: "$3.4M",
    regulatoryShocks: "4.1",
  },
  {
    address: "789 Queen Street, Montreal",
    risk: "Low",
    noiChange: "+4.1%",
    dscrChange: "+0.08",
    ltvDirection: "↓",
    efficiency: "A-",
    retrofitCost: "$1.2M",
    regulatoryShocks: "2.1",
  },
  {
    address: "321 Main Street, Calgary",
    risk: "Medium",
    noiChange: "+1.2%",
    dscrChange: "-0.05",
    ltvDirection: "→",
    efficiency: "B",
    retrofitCost: "$1.8M",
    regulatoryShocks: "2.8",
  },
]

export default function PortfolioOverviewPage() {
  const [chartView, setChartView] = useState("propertyCount")
  const [breakdownBy, setBreakdownBy] = useState("province")
  const [expandedCharts, setExpandedCharts] = useState(false)
  const [tableColumns, setTableColumns] = useState(allTableColumns)
  const [portfolioData, setPortfolioData] = useState(basePortfolioData)
  const [riskTrendData, setRiskTrendData] = useState(baseRiskTrendData)
  const [portfolioMetrics, setPortfolioMetrics] = useState({
    totalProperties: "123",
    portfolioValue: "$7.5B",
    avgRiskNumber: "6.8", // Changed from avgRiskClassification
    avgNOIChange: "+1.4%",
    avgDSCR: "-0.08",
    ltvDirection: "↑ Increasing",
    riskExposure: "$1.2B",
  })

  const toggleColumn = (key: string) => {
    setTableColumns((prev) => prev.map((col) => (col.key === key ? { ...col, enabled: !col.enabled } : col)))
  }

  const enabledColumns = tableColumns.filter((col) => col.enabled)

  const handleScenarioChange = (scenario: string, customData?: CustomScenario) => {
    // Simulate scenario impact on portfolio data
    let multiplier = 1
    switch (scenario) {
      case "aggressive":
        multiplier = 0.8 // Lower risk due to aggressive transition
        break
      case "delayed":
        multiplier = 1.3 // Higher risk due to delayed policy
        break
      default:
        if (scenario.startsWith("custom-") && customData) {
          // Custom scenario logic based on sliders
          const energyImpact = (customData.energyPrices - 50) / 100
          const carbonImpact = customData.carbonTax / 100
          const regulatoryImpact = (customData.regulatoryIntensity - 50) / 100
          multiplier = 1 + energyImpact + carbonImpact + regulatoryImpact
        }
        break
    }

    const updatedRiskData = baseRiskTrendData.map((item) => ({
      ...item,
      risk: item.risk * multiplier,
      expenses: item.expenses * (1 + (multiplier - 1) * 0.5),
      revenue: item.revenue * (1 + (multiplier - 1) * 0.2),
      noi: item.noi * (1 + (multiplier - 1) * 0.3),
    }))

    const updatedPortfolioData = basePortfolioData.map((item) => ({
      ...item,
      highRisk: Math.min(100, item.highRisk * multiplier),
      mediumRisk: Math.max(0, item.mediumRisk * (2 - multiplier)),
      lowRisk: Math.max(0, item.lowRisk * (2 - multiplier)),
    }))

    setRiskTrendData(updatedRiskData)
    setPortfolioData(updatedPortfolioData)

    // Update portfolio metrics
    setPortfolioMetrics({
      ...portfolioMetrics,
      avgRiskNumber: (6.8 * multiplier).toFixed(1), // Updated to show numeric value
      avgNOIChange: `${multiplier > 1 ? "-" : "+"}${Math.abs((multiplier - 1) * 2).toFixed(1)}%`,
      riskExposure: `$${(1.2 * multiplier).toFixed(1)}B`,
    })
  }

  const handlePaymentChange = (
    method: "upfront" | "loan",
    loanCoverage?: number,
    loanTerm?: number,
    interestRate?: number,
  ) => {
    if (method === "loan" && loanCoverage && loanTerm && interestRate) {
      // Simulate loan impact on portfolio metrics with interest rate consideration
      const dscrImpact = (loanCoverage / 100) * (interestRate / 5.5) * (30 / loanTerm) * 0.1
      const ltvImpact = loanCoverage > 75 ? "↑ Increasing" : "→ Stable"

      setPortfolioMetrics({
        ...portfolioMetrics,
        avgDSCR: `-${(0.08 + dscrImpact).toFixed(2)}`,
        ltvDirection: ltvImpact,
      })
    } else {
      // Reset to base values for upfront payment
      setPortfolioMetrics({
        ...portfolioMetrics,
        avgDSCR: "-0.08",
        ltvDirection: "↑ Increasing",
      })
    }
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Collapsible Controls Sidebar */}
      <CollapsibleControlsSidebar onScenarioChange={handleScenarioChange} onPaymentChange={handlePaymentChange} />

      <div className="container mx-auto px-6 py-8">
        {/* Page Title and Subtitle */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold mb-4" style={{ color: "#112A43" }}>
            Portfolio View
          </h1>
          <p className="text-xl text-gray-600">Explore your filtered portfolio's climate and financial risk summary.</p>
        </div>

        <Stepper steps={["Filter", "View"]} currentStep={1} type="portfolio" />

        {/* Top Stats */}
        <div className="grid grid-cols-4 gap-6 mb-8 max-w-6xl mx-auto">
          {[
            { label: "Total Properties", value: portfolioMetrics.totalProperties, icon: Building, color: "#2B6CA9" },
            { label: "Total Asset Value", value: portfolioMetrics.portfolioValue, icon: DollarSign, color: "#10b981" },
            {
              label: "Average Risk Number", // Changed from "Average Risk Classification"
              value: portfolioMetrics.avgRiskNumber, // Now shows numeric value
              icon: Shield,
              color: "#f59e0b",
            },
            {
              label: "Average Change to NOI",
              value: portfolioMetrics.avgNOIChange,
              icon: TrendingUp,
              color: "#8b5cf6",
            },
          ].map((stat, index) => {
            const Icon = stat.icon
            return (
              <Card key={index} className="rounded-2xl shadow-lg hover:shadow-xl transition-shadow">
                <CardContent className="p-6 text-center">
                  <Icon className="w-8 h-8 mx-auto mb-3" style={{ color: stat.color }} />
                  <div className="text-3xl font-bold mb-2" style={{ color: stat.color }}>
                    {stat.value}
                  </div>
                  <div className="text-sm text-gray-600 font-medium">{stat.label}</div>
                </CardContent>
              </Card>
            )
          })}
        </div>

        <div className="max-w-7xl mx-auto grid grid-cols-4 gap-8">
          {/* Main Content - 3 columns */}
          <div className="col-span-3 space-y-8">
            {/* Portfolio Distribution Chart */}
            <Card className="rounded-2xl shadow-lg">
              <CardHeader>
                <CardTitle className="flex items-center justify-between" style={{ color: "#112A43" }}>
                  <div className="flex items-center gap-3">
                    <Building className="w-6 h-6" />
                    Portfolio Distribution
                    <Popover>
                      <PopoverTrigger>
                        <HelpCircle className="w-5 h-5 text-gray-400 hover:text-gray-600" />
                      </PopoverTrigger>
                      <PopoverContent className="w-80">
                        <p className="text-sm">
                          Portfolio breakdown showing property distribution and risk segmentation across different
                          categories with customizable views. Updates based on scenario selections.
                        </p>
                      </PopoverContent>
                    </Popover>
                  </div>
                  <div className="flex gap-4">
                    <Select value={chartView} onValueChange={setChartView}>
                      <SelectTrigger className="w-40 rounded-full">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="propertyCount">Property Count</SelectItem>
                        <SelectItem value="dollarValue">Dollar Value</SelectItem>
                      </SelectContent>
                    </Select>
                    <Select value={breakdownBy} onValueChange={setBreakdownBy}>
                      <SelectTrigger className="w-40 rounded-full">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="province">Province</SelectItem>
                        <SelectItem value="country">Country</SelectItem>
                        <SelectItem value="certification">Green Certification</SelectItem>
                        <SelectItem value="lob">LOB / Sub-LOB</SelectItem>
                        <SelectItem value="efficiency">Efficiency Range</SelectItem>
                        <SelectItem value="energy">Energy Source</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="h-80 mb-6">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={portfolioData}>
                      <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                      <XAxis dataKey="category" stroke="#6b7280" />
                      <YAxis stroke="#6b7280" />
                      <Tooltip
                        contentStyle={{
                          backgroundColor: "white",
                          border: "1px solid #e5e7eb",
                          borderRadius: "12px",
                          boxShadow: "0 4px 6px -1px rgba(0, 0, 0, 0.1)",
                        }}
                      />
                      <Bar dataKey="highRisk" stackId="risk" fill="#ef4444" radius={[0, 0, 0, 0]} />
                      <Bar dataKey="mediumRisk" stackId="risk" fill="#f59e0b" radius={[0, 0, 0, 0]} />
                      <Bar dataKey="lowRisk" stackId="risk" fill="#10b981" radius={[8, 8, 0, 0]} />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
                <div className="grid grid-cols-4 gap-6">
                  {portfolioData.map((item) => (
                    <div key={item.category} className="text-center p-4 rounded-xl bg-gray-50">
                      <div className="font-bold text-lg mb-3" style={{ color: "#112A43" }}>
                        {item.category}
                      </div>
                      <div className="flex justify-center gap-2">
                        <div className="text-center">
                          <div className="w-4 h-4 bg-red-500 rounded-full mx-auto mb-1"></div>
                          <div className="text-xs font-semibold text-red-600">{Math.round(item.highRisk)}%</div>
                          <div className="text-xs text-gray-500">High</div>
                        </div>
                        <div className="text-center">
                          <div className="w-4 h-4 bg-yellow-500 rounded-full mx-auto mb-1"></div>
                          <div className="text-xs font-semibold text-yellow-600">{Math.round(item.mediumRisk)}%</div>
                          <div className="text-xs text-gray-500">Medium</div>
                        </div>
                        <div className="text-center">
                          <div className="w-4 h-4 bg-green-500 rounded-full mx-auto mb-1"></div>
                          <div className="text-xs font-semibold text-green-600">{Math.round(item.lowRisk)}%</div>
                          <div className="text-xs text-gray-500">Low</div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Risk Trend Analysis */}
            <Card className="rounded-2xl shadow-lg">
              <CardHeader>
                <CardTitle className="flex items-center justify-between" style={{ color: "#112A43" }}>
                  <div className="flex items-center gap-3">
                    <TrendingUp className="w-6 h-6" />
                    Risk Trend Analysis
                    <Popover>
                      <PopoverTrigger>
                        <HelpCircle className="w-5 h-5 text-gray-400 hover:text-gray-600" />
                      </PopoverTrigger>
                      <PopoverContent className="w-80">
                        <p className="text-sm">
                          Portfolio-wide climate risk trends from 2024 to 2050 with expandable revenue, expense, and NOI
                          projections. Updates in real-time based on scenario and payment structure selections.
                        </p>
                      </PopoverContent>
                    </Popover>
                  </div>
                  <Button
                    variant={expandedCharts ? "default" : "outline"}
                    size="sm"
                    className="rounded-full"
                    onClick={() => setExpandedCharts(!expandedCharts)}
                    style={{ backgroundColor: expandedCharts ? "#2B6CA9" : "transparent" }}
                  >
                    Expand
                  </Button>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="h-80 mb-6">
                  <ResponsiveContainer width="100%" height="100%">
                    <LineChart data={riskTrendData}>
                      <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                      <XAxis dataKey="year" stroke="#6b7280" />
                      <YAxis stroke="#6b7280" tickFormatter={(value) => `$${value}M`} />
                      <Tooltip
                        contentStyle={{
                          backgroundColor: "white",
                          border: "1px solid #e5e7eb",
                          borderRadius: "12px",
                          boxShadow: "0 4px 6px -1px rgba(0, 0, 0, 0.1)",
                        }}
                      />
                      <Line
                        type="monotone"
                        dataKey="risk"
                        stroke="#2B6CA9"
                        strokeWidth={4}
                        dot={{ fill: "#2B6CA9", strokeWidth: 2, r: 6 }}
                        activeDot={{ r: 8, stroke: "#2B6CA9", strokeWidth: 2 }}
                      />
                    </LineChart>
                  </ResponsiveContainer>
                </div>

                {expandedCharts && (
                  <div className="space-y-12 mt-8 pt-8 border-t border-gray-200">
                    {/* Portfolio Revenue Trends - Vertical Stack */}
                    <div>
                      <h3 className="text-2xl font-bold mb-6" style={{ color: "#112A43" }}>
                        Portfolio Revenue Trends
                      </h3>
                      <div className="grid grid-cols-2 gap-8">
                        <Card className="rounded-2xl shadow-md">
                          <CardHeader className="pb-4">
                            <CardTitle className="text-lg flex items-center gap-2">
                              Revenue (Pay Fines)
                              <Popover>
                                <PopoverTrigger>
                                  <HelpCircle className="w-4 h-4 text-gray-400 hover:text-gray-600" />
                                </PopoverTrigger>
                                <PopoverContent className="w-80">
                                  <p className="text-sm">
                                    Revenue projections under a "pay fines" strategy where properties continue current
                                    operations and pay regulatory penalties as they arise.
                                  </p>
                                </PopoverContent>
                              </Popover>
                            </CardTitle>
                          </CardHeader>
                          <CardContent>
                            <div className="h-48 mb-4">
                              <ResponsiveContainer width="100%" height="100%">
                                <LineChart data={riskTrendData}>
                                  <CartesianGrid strokeDasharray="3 3" />
                                  <XAxis dataKey="year" />
                                  <YAxis tickFormatter={(value) => `$${value}M`} />
                                  <Tooltip />
                                  <Line
                                    type="monotone"
                                    dataKey="revenuePayFines"
                                    stroke="#ef4444"
                                    strokeWidth={3}
                                    dot={{ fill: "#ef4444", r: 4 }}
                                  />
                                </LineChart>
                              </ResponsiveContainer>
                            </div>
                            <div className="space-y-2">
                              <div className="flex items-center gap-3">
                                <div className="w-6 h-6 rounded-full bg-red-500 flex items-center justify-center shadow-lg">
                                  <DollarSign className="w-3 h-3 text-white" />
                                </div>
                                <span className="text-sm">Declining revenue due to penalties</span>
                              </div>
                              <div className="flex items-center gap-3">
                                <div className="w-6 h-6 rounded-full bg-orange-500 flex items-center justify-center shadow-lg">
                                  <TrendingUp className="w-3 h-3 text-white" />
                                </div>
                                <span className="text-sm">Regulatory compliance costs</span>
                              </div>
                            </div>
                          </CardContent>
                        </Card>

                        <Card className="rounded-2xl shadow-md">
                          <CardHeader className="pb-4">
                            <CardTitle className="text-lg flex items-center gap-2">
                              Revenue (Retrofit)
                              <Popover>
                                <PopoverTrigger>
                                  <HelpCircle className="w-4 h-4 text-gray-400 hover:text-gray-600" />
                                </PopoverTrigger>
                                <PopoverContent className="w-80">
                                  <p className="text-sm">
                                    Revenue projections under a proactive retrofit strategy with climate adaptation
                                    investments and green premium benefits.
                                  </p>
                                </PopoverContent>
                              </Popover>
                            </CardTitle>
                          </CardHeader>
                          <CardContent>
                            <div className="h-48 mb-4">
                              <ResponsiveContainer width="100%" height="100%">
                                <LineChart data={riskTrendData}>
                                  <CartesianGrid strokeDasharray="3 3" />
                                  <XAxis dataKey="year" />
                                  <YAxis tickFormatter={(value) => `$${value}M`} />
                                  <Tooltip />
                                  <Line
                                    type="monotone"
                                    dataKey="revenueRetrofit"
                                    stroke="#10b981"
                                    strokeWidth={3}
                                    dot={{ fill: "#10b981", r: 4 }}
                                  />
                                </LineChart>
                              </ResponsiveContainer>
                            </div>
                            <div className="space-y-2">
                              <div className="flex items-center gap-3">
                                <div className="w-6 h-6 rounded-full bg-green-500 flex items-center justify-center shadow-lg">
                                  <TrendingUp className="w-3 h-3 text-white" />
                                </div>
                                <span className="text-sm">Green premium benefits</span>
                              </div>
                              <div className="flex items-center gap-3">
                                <div className="w-6 h-6 rounded-full bg-blue-500 flex items-center justify-center shadow-lg">
                                  <Leaf className="w-3 h-3 text-white" />
                                </div>
                                <span className="text-sm">Energy efficiency savings</span>
                              </div>
                            </div>
                          </CardContent>
                        </Card>
                      </div>
                    </div>

                    {/* Portfolio Expense Trends - Vertical Stack */}
                    <div>
                      <h3 className="text-2xl font-bold mb-6" style={{ color: "#112A43" }}>
                        Portfolio Expense Trends
                      </h3>
                      <div className="grid grid-cols-2 gap-8">
                        <Card className="rounded-2xl shadow-md">
                          <CardHeader className="pb-4">
                            <CardTitle className="text-lg flex items-center gap-2">
                              Expenses (Pay Fines)
                              <Popover>
                                <PopoverTrigger>
                                  <HelpCircle className="w-4 h-4 text-gray-400 hover:text-gray-600" />
                                </PopoverTrigger>
                                <PopoverContent className="w-80">
                                  <p className="text-sm">
                                    Operating expense projections under a "pay fines" strategy including escalating
                                    regulatory penalties and energy costs.
                                  </p>
                                </PopoverContent>
                              </Popover>
                            </CardTitle>
                          </CardHeader>
                          <CardContent>
                            <div className="h-48 mb-4">
                              <ResponsiveContainer width="100%" height="100%">
                                <LineChart data={riskTrendData}>
                                  <CartesianGrid strokeDasharray="3 3" />
                                  <XAxis dataKey="year" />
                                  <YAxis tickFormatter={(value) => `$${value}M`} />
                                  <Tooltip />
                                  <Line
                                    type="monotone"
                                    dataKey="expensePayFines"
                                    stroke="#ef4444"
                                    strokeWidth={3}
                                    dot={{ fill: "#ef4444", r: 4 }}
                                  />
                                </LineChart>
                              </ResponsiveContainer>
                            </div>
                            <div className="space-y-2">
                              <div className="flex items-center gap-3">
                                <div className="w-6 h-6 rounded-full bg-red-500 flex items-center justify-center shadow-lg">
                                  <Zap className="w-3 h-3 text-white" />
                                </div>
                                <span className="text-sm">Escalating energy costs</span>
                              </div>
                              <div className="flex items-center gap-3">
                                <div className="w-6 h-6 rounded-full bg-orange-500 flex items-center justify-center shadow-lg">
                                  <Shield className="w-3 h-3 text-white" />
                                </div>
                                <span className="text-sm">Regulatory fines and penalties</span>
                              </div>
                            </div>
                          </CardContent>
                        </Card>

                        <Card className="rounded-2xl shadow-md">
                          <CardHeader className="pb-4">
                            <CardTitle className="text-lg flex items-center gap-2">
                              Expenses (Retrofit)
                              <Popover>
                                <PopoverTrigger>
                                  <HelpCircle className="w-4 h-4 text-gray-400 hover:text-gray-600" />
                                </PopoverTrigger>
                                <PopoverContent className="w-80">
                                  <p className="text-sm">
                                    Operating expense projections under a proactive retrofit strategy with upfront
                                    investments leading to long-term operational savings.
                                  </p>
                                </PopoverContent>
                              </Popover>
                            </CardTitle>
                          </CardHeader>
                          <CardContent>
                            <div className="h-48 mb-4">
                              <ResponsiveContainer width="100%" height="100%">
                                <LineChart data={riskTrendData}>
                                  <CartesianGrid strokeDasharray="3 3" />
                                  <XAxis dataKey="year" />
                                  <YAxis tickFormatter={(value) => `$${value}M`} />
                                  <Tooltip />
                                  <Line
                                    type="monotone"
                                    dataKey="expenseRetrofit"
                                    stroke="#10b981"
                                    strokeWidth={3}
                                    dot={{ fill: "#10b981", r: 4 }}
                                  />
                                </LineChart>
                              </ResponsiveContainer>
                            </div>
                            <div className="space-y-2">
                              <div className="flex items-center gap-3">
                                <div className="w-6 h-6 rounded-full bg-green-500 flex items-center justify-center shadow-lg">
                                  <Leaf className="w-3 h-3 text-white" />
                                </div>
                                <span className="text-sm">Energy efficiency savings</span>
                              </div>
                              <div className="flex items-center gap-3">
                                <div className="w-6 h-6 rounded-full bg-blue-500 flex items-center justify-center shadow-lg">
                                  <Shield className="w-3 h-3 text-white" />
                                </div>
                                <span className="text-sm">Reduced operational costs</span>
                              </div>
                            </div>
                          </CardContent>
                        </Card>
                      </div>
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Portfolio Table */}
            <Card className="rounded-2xl shadow-lg">
              <CardHeader>
                <CardTitle className="flex items-center justify-between" style={{ color: "#112A43" }}>
                  <div className="flex items-center gap-3">
                    <Building className="w-6 h-6" />
                    Portfolio Properties
                  </div>
                  <Popover>
                    <PopoverTrigger asChild>
                      <Button variant="outline" size="sm" className="rounded-full bg-transparent">
                        <Settings className="w-4 h-4 mr-2" />
                        Columns ({enabledColumns.length})
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-80">
                      <div className="space-y-3">
                        <h4 className="font-semibold">Select Columns to Display</h4>
                        {tableColumns.map((column) => (
                          <div key={column.key} className="flex items-center space-x-2">
                            <Checkbox
                              id={column.key}
                              checked={column.enabled}
                              onCheckedChange={() => toggleColumn(column.key)}
                              disabled={column.key === "address" || column.key === "risk"}
                            />
                            <label htmlFor={column.key} className="text-sm cursor-pointer">
                              {column.label}
                            </label>
                          </div>
                        ))}
                        <p className="text-xs text-gray-500 mt-2">Address and Risk Rating are always shown</p>
                      </div>
                    </PopoverContent>
                  </Popover>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead>
                      <tr className="border-b-2 border-gray-200">
                        {enabledColumns.map((column) => (
                          <th key={column.key} className="text-left p-4 font-bold text-gray-700">
                            {column.label}
                          </th>
                        ))}
                      </tr>
                    </thead>
                    <tbody>
                      {tableData.map((row, index) => (
                        <tr key={index} className="border-b hover:bg-gray-50 transition-colors">
                          {enabledColumns.map((column) => (
                            <td key={column.key} className="p-4">
                              {column.key === "address" && (
                                <span className="font-semibold text-gray-900">{row.address}</span>
                              )}
                              {column.key === "risk" && (
                                <Badge
                                  className="rounded-full text-white font-bold px-3 py-1"
                                  style={{
                                    backgroundColor:
                                      row.risk === "High" ? "#ef4444" : row.risk === "Medium" ? "#f59e0b" : "#10b981",
                                  }}
                                >
                                  {row.risk}
                                </Badge>
                              )}
                              {column.key === "noiChange" && (
                                <span
                                  className={`font-bold ${row.noiChange.startsWith("+") ? "text-green-600" : "text-red-600"}`}
                                >
                                  {row.noiChange}
                                </span>
                              )}
                              {column.key === "dscrChange" && (
                                <span
                                  className={`font-bold ${row.dscrChange.startsWith("+") ? "text-green-600" : "text-red-600"}`}
                                >
                                  {row.dscrChange}
                                </span>
                              )}
                              {column.key === "ltvDirection" && (
                                <span className="text-2xl font-bold">{row.ltvDirection}</span>
                              )}
                              {column.key === "efficiency" && (
                                <Badge
                                  className="rounded-full font-bold"
                                  style={{ backgroundColor: "#99EFE4", color: "#112A43" }}
                                >
                                  {row.efficiency}
                                </Badge>
                              )}
                              {column.key === "retrofitCost" && (
                                <span className="font-semibold text-blue-600">{row.retrofitCost}</span>
                              )}
                              {column.key === "regulatoryShocks" && (
                                <span className="font-semibold">{row.regulatoryShocks}</span>
                              )}
                            </td>
                          ))}
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Right Sidebar */}
          <div className="space-y-6">
            <Card className="rounded-2xl shadow-lg">
              <CardHeader>
                <CardTitle className="flex items-center justify-between" style={{ color: "#112A43" }}>
                  Portfolio Risk KPIs
                  <Select defaultValue="energy-efficiency">
                    <SelectTrigger className="w-48 rounded-full">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="energy-efficiency">Energy Efficiency</SelectItem>
                      <SelectItem value="retrofit-cost">Retrofit Cost</SelectItem>
                      <SelectItem value="regulatory-shocks">Regulatory Shocks</SelectItem>
                    </SelectContent>
                  </Select>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="grid grid-cols-2 gap-4 font-semibold text-sm border-b pb-2">
                    <div>Metric</div>
                    <div>Value</div>
                  </div>
                  <div className="grid grid-cols-2 gap-4 text-sm">
                    <div>Portfolio Average</div>
                    <div className="font-semibold" style={{ color: "#2B6CA9" }}>
                      85 kWh/m²/yr
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-4 text-sm">
                    <div>Benchmark</div>
                    <div className="text-gray-600">95 kWh/m²/yr</div>
                  </div>
                  <div className="border-t pt-4">
                    <div className="grid grid-cols-2 gap-4 text-sm">
                      <div>Retrofit Cost Average</div>
                      <div className="font-semibold" style={{ color: "#2B6CA9" }}>
                        $2.1M
                      </div>
                    </div>
                    <div className="grid grid-cols-2 gap-4 text-sm mt-2">
                      <div>Benchmark</div>
                      <div className="text-gray-600">$2.5M</div>
                    </div>
                  </div>
                  <div className="border-t pt-4">
                    <div className="grid grid-cols-2 gap-4 text-sm">
                      <div>Regulatory Shocks</div>
                      <div className="font-semibold" style={{ color: "#2B6CA9" }}>
                        3.2 events/yr
                      </div>
                    </div>
                    <div className="grid grid-cols-2 gap-4 text-sm mt-2">
                      <div>Benchmark</div>
                      <div className="text-gray-600">2.8 events/yr</div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="rounded-2xl shadow-lg">
              <CardHeader>
                <CardTitle style={{ color: "#112A43" }}>Key Insights About Risks</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-start gap-3 p-3 rounded-xl hover:bg-gray-50 transition-colors">
                  <div
                    className="w-8 h-8 rounded-full flex items-center justify-center"
                    style={{ backgroundColor: "#99EFE4" }}
                  >
                    <Shield className="w-4 h-4" style={{ color: "#112A43" }} />
                  </div>
                  <div className="text-sm">
                    <div className="font-semibold mb-1">Portfolio Diversification</div>
                    <div className="text-gray-600">Reduce geographic concentration risk</div>
                  </div>
                </div>
                <div className="flex items-start gap-3 p-3 rounded-xl hover:bg-gray-50 transition-colors">
                  <div
                    className="w-8 h-8 rounded-full flex items-center justify-center"
                    style={{ backgroundColor: "#66DCCC" }}
                  >
                    <Zap className="w-4 h-4" style={{ color: "#112A43" }} />
                  </div>
                  <div className="text-sm">
                    <div className="font-semibold mb-1">Energy Efficiency Program</div>
                    <div className="text-gray-600">Implement across 45 properties</div>
                  </div>
                </div>
                <div className="flex items-start gap-3 p-3 rounded-xl hover:bg-gray-50 transition-colors">
                  <div
                    className="w-8 h-8 rounded-full flex items-center justify-center"
                    style={{ backgroundColor: "#99EFE4" }}
                  >
                    <DollarSign className="w-4 h-4" style={{ color: "#112A43" }} />
                  </div>
                  <div className="text-sm">
                    <div className="font-semibold mb-1">Green Bond Financing</div>
                    <div className="text-gray-600">Access lower cost capital</div>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="rounded-2xl shadow-lg">
              <CardHeader>
                <CardTitle style={{ color: "#112A43" }}>Portfolio Financial Impact</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex justify-between items-center">
                  <span className="text-sm font-medium">Average Change to DSCR</span>
                  <span className="font-bold text-lg text-red-600">{portfolioMetrics.avgDSCR}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm font-medium">LTV Directionality</span>
                  <span className="font-bold text-lg text-orange-600">
                    {portfolioMetrics.ltvDirection.includes("↑")
                      ? "Up"
                      : portfolioMetrics.ltvDirection.includes("↓")
                        ? "Down"
                        : "Flat"}
                  </span>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  )
}
