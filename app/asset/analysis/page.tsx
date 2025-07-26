"use client"

import { useState, useEffect } from "react"
import { useSearchParams } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts"
import { MultiAssetStepper } from "@/components/multi-asset-stepper"
import { CollapsibleControlsSidebar } from "@/components/collapsible-controls-sidebar"
import {
  HelpCircle,
  Download,
  MapPin,
  TrendingUp,
  DollarSign,
  Shield,
  Zap,
  Leaf,
  X,
  Building,
  AlertTriangle,
} from "lucide-react"
import type { CustomScenario } from "@/components/scenario-modal"
import { mockProperties } from "@/lib/mock-data"

const baseRiskData = [
  {
    year: 2024,
    risk: 7.2,
    benchmark: 6.8,
    revenue: 8.5,
    expenses: 2.3,
    revenuePayFines: 8.2,
    revenueRetrofit: 8.8,
    expensePayFines: 2.8,
    expenseRetrofit: 1.8,
  },
  {
    year: 2026,
    risk: 7.8,
    benchmark: 7.2,
    revenue: 8.8,
    expenses: 2.5,
    revenuePayFines: 8.4,
    revenueRetrofit: 9.2,
    expensePayFines: 3.2,
    expenseRetrofit: 1.8,
  },
  {
    year: 2028,
    risk: 8.4,
    benchmark: 7.8,
    revenue: 9.2,
    expenses: 2.8,
    revenuePayFines: 8.6,
    revenueRetrofit: 9.8,
    expensePayFines: 3.8,
    expenseRetrofit: 1.8,
  },
  {
    year: 2030,
    risk: 9.1,
    benchmark: 8.5,
    revenue: 9.6,
    expenses: 3.2,
    revenuePayFines: 8.8,
    revenueRetrofit: 10.4,
    expensePayFines: 4.5,
    expenseRetrofit: 1.9,
  },
  {
    year: 2035,
    risk: 10.2,
    benchmark: 9.8,
    revenue: 10.5,
    expenses: 3.8,
    revenuePayFines: 9.2,
    revenueRetrofit: 11.8,
    expensePayFines: 5.8,
    expenseRetrofit: 1.8,
  },
  {
    year: 2040,
    risk: 11.5,
    benchmark: 11.1,
    revenue: 11.2,
    expenses: 4.5,
    revenuePayFines: 9.8,
    revenueRetrofit: 12.6,
    expensePayFines: 7.2,
    expenseRetrofit: 1.8,
  },
  {
    year: 2045,
    risk: 12.8,
    benchmark: 12.4,
    revenue: 11.8,
    expenses: 5.2,
    revenuePayFines: 10.2,
    revenueRetrofit: 13.4,
    expensePayFines: 8.8,
    expenseRetrofit: 1.6,
  },
  {
    year: 2050,
    risk: 14.2,
    benchmark: 13.8,
    revenue: 12.4,
    expenses: 6.1,
    revenuePayFines: 10.8,
    revenueRetrofit: 14.0,
    expensePayFines: 10.5,
    expenseRetrofit: 1.7,
  },
]

export default function AssetAnalysisPage() {
  const searchParams = useSearchParams()
  const [showBenchmark, setShowBenchmark] = useState(false)
  const [expandedCharts, setExpandedCharts] = useState(false)
  const [selectedAssets, setSelectedAssets] = useState<string[]>([])
  const [riskData, setRiskData] = useState(baseRiskData)
  const [isInitialized, setIsInitialized] = useState(false)
  const [financialMetrics, setFinancialMetrics] = useState({
    assetValue: "$45M",
    riskScore: "7.2/10",
    annualRiskCost: "$2.1M",
    netSavings: "$8.4M",
    ltv: "71.1%",
    dscr: "2.21",
  })

  // Load property data from URL params - only run once
  useEffect(() => {
    if (isInitialized) return

    const propertyIds = searchParams.get("properties")?.split(",").map(Number) || []
    const propertyDataParam = searchParams.get("data")

    // Get property addresses for display
    const addresses = propertyIds.map((id) => {
      const property = mockProperties.find((p) => p.id === id)
      return property?.address || `Property ${id}`
    })

    if (addresses.length > 0) {
      setSelectedAssets(addresses)
    } else {
      // Default fallback for direct navigation
      setSelectedAssets(["123 Bay Street, Toronto, ON"])
    }

    // Parse and use property data if available
    if (propertyDataParam) {
      try {
        const propertyData = JSON.parse(decodeURIComponent(propertyDataParam))
        console.log("Loaded property data:", propertyData)

        // Calculate aggregate metrics from all properties
        const totalValue = Object.values(propertyData).reduce((sum: number, data: any) => {
          return sum + (Number.parseFloat(data.propertyValue) || 0)
        }, 0)

        if (totalValue > 0) {
          setFinancialMetrics((prev) => ({
            ...prev,
            assetValue: `$${(totalValue / 1000000).toFixed(0)}M`,
          }))
        }
      } catch (error) {
        console.error("Error parsing property data:", error)
      }
    }

    setIsInitialized(true)
  }, [searchParams, isInitialized])

  const removeAsset = (asset: string) => {
    setSelectedAssets((prev) => prev.filter((a) => a !== asset))
  }

  const handleScenarioChange = (scenario: string, customData?: CustomScenario) => {
    // Simulate scenario impact on data
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

    const updatedData = baseRiskData.map((item) => ({
      ...item,
      risk: item.risk * multiplier,
      expenses: item.expenses * (1 + (multiplier - 1) * 0.5),
      revenue: item.revenue * (1 + (multiplier - 1) * 0.2),
      revenuePayFines: item.revenuePayFines * (1 + (multiplier - 1) * 0.1),
      revenueRetrofit: item.revenueRetrofit * (1 + (multiplier - 1) * 0.3),
      expensePayFines: item.expensePayFines * multiplier,
      expenseRetrofit: item.expenseRetrofit * (1 + (multiplier - 1) * 0.2),
    }))

    setRiskData(updatedData)

    // Update financial metrics
    setFinancialMetrics((prev) => ({
      ...prev,
      riskScore: `${(7.2 * multiplier).toFixed(1)}/10`,
      annualRiskCost: `$${(2.1 * multiplier).toFixed(1)}M`,
      netSavings: `$${(8.4 / multiplier).toFixed(1)}M`,
    }))
  }

  const handlePaymentChange = (
    method: "upfront" | "loan",
    loanCoverage?: number,
    loanTerm?: number,
    interestRate?: number,
  ) => {
    if (method === "loan" && loanCoverage && loanTerm && interestRate) {
      // Simulate loan impact on LTV and DSCR with interest rate consideration
      const baseLTV = 71.1
      const baseDSCR = 2.21

      const ltvImpact = (loanCoverage / 100) * 0.15 // Loan increases LTV
      const dscrImpact = (loanCoverage / 100) * (interestRate / 5.5) * (30 / loanTerm) * 0.1 // Interest rate affects DSCR

      setFinancialMetrics((prev) => ({
        ...prev,
        ltv: `${(baseLTV + ltvImpact).toFixed(1)}%`,
        dscr: `${(baseDSCR - dscrImpact).toFixed(2)}`,
      }))
    } else {
      // Reset to base values for upfront payment
      setFinancialMetrics((prev) => ({
        ...prev,
        ltv: "71.1%",
        dscr: "2.21",
      }))
    }
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Collapsible Controls Sidebar */}
      <CollapsibleControlsSidebar onScenarioChange={handleScenarioChange} onPaymentChange={handlePaymentChange} />

      <div className="container mx-auto px-6 py-8">
        <MultiAssetStepper currentAsset={selectedAssets.length} totalAssets={selectedAssets.length} currentStep={2} />

        {/* Multi-Asset Header */}
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold mb-2" style={{ color: "#112A43" }}>
            Multi-Asset Climate Risk Analysis
          </h1>
          <p className="text-lg text-gray-600">
            Comprehensive analysis across {selectedAssets.length} selected{" "}
            {selectedAssets.length === 1 ? "property" : "properties"}
          </p>
        </div>

        {/* Top Stats */}
        <div className="grid grid-cols-4 gap-6 mb-8 max-w-6xl mx-auto">
          {[
            { label: "Total Properties", value: selectedAssets.length.toString(), icon: Building, color: "#2B6CA9" },
            { label: "Total Asset Value", value: financialMetrics.assetValue, icon: DollarSign, color: "#10b981" },
            {
              label: "Average Risk Classification",
              value: financialMetrics.riskScore.replace("/10", ""),
              icon: Shield,
              color: "#f59e0b",
            },
            { label: "Average Change to NOI", value: financialMetrics.netSavings, icon: TrendingUp, color: "#8b5cf6" },
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
            {/* Map Section */}
            <Card className="rounded-2xl shadow-lg">
              <CardHeader>
                <CardTitle className="flex items-center gap-3" style={{ color: "#112A43" }}>
                  <MapPin className="w-6 h-6" />
                  Interactive Multi-Asset Map
                  <Popover>
                    <PopoverTrigger>
                      <HelpCircle className="w-5 h-5 text-gray-400 hover:text-gray-600" />
                    </PopoverTrigger>
                    <PopoverContent className="w-80">
                      <p className="text-sm">
                        Interactive climate risk visualization showing flood zones, temperature projections, and
                        environmental hazards for all selected properties with comparative analysis.
                      </p>
                    </PopoverContent>
                  </Popover>
                </CardTitle>
                <p className="text-gray-600 text-lg">
                  Climate zones, flood risks, and environmental factors across {selectedAssets.length} properties
                </p>
              </CardHeader>
              <CardContent>
                <div className="h-80 bg-gradient-to-br from-blue-100 to-green-100 rounded-2xl flex items-center justify-center mb-6 border-2 border-dashed border-gray-300">
                  <div className="text-center">
                    <MapPin className="w-16 h-16 mx-auto mb-4 text-gray-400" />
                    <div className="text-xl text-gray-500 font-medium">Interactive Multi-Asset Climate Risk Map</div>
                    <div className="text-gray-400">Comparative analysis across {selectedAssets.length} properties</div>
                  </div>
                </div>

                <div className="mb-6">
                  <h4 className="text-lg font-semibold mb-3" style={{ color: "#112A43" }}>
                    Selected Properties ({selectedAssets.length})
                  </h4>
                  <div className="flex flex-wrap gap-3">
                    {selectedAssets.map((asset, index) => (
                      <Badge
                        key={index}
                        className="rounded-full px-6 py-3 text-sm font-medium flex items-center gap-2 shadow-md"
                        style={{ backgroundColor: "#2B6CA9", color: "white" }}
                      >
                        {asset}
                        <X className="w-4 h-4 cursor-pointer hover:text-red-300" onClick={() => removeAsset(asset)} />
                      </Badge>
                    ))}
                  </div>
                </div>

                <div className="flex gap-4">
                  <Select>
                    <SelectTrigger className="rounded-full w-48">
                      <SelectValue placeholder="Select Scenario" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="baseline">Baseline Scenario</SelectItem>
                      <SelectItem value="optimistic">Optimistic Scenario</SelectItem>
                      <SelectItem value="pessimistic">Pessimistic Scenario</SelectItem>
                    </SelectContent>
                  </Select>
                  <Button variant="outline" className="rounded-full bg-white shadow-md hover:shadow-lg">
                    <Download className="w-4 h-4 mr-2" />
                    Export Portfolio Data
                  </Button>
                </div>
              </CardContent>
            </Card>

            {/* Risk Forecast Timeline */}
            <Card className="rounded-2xl shadow-lg">
              <CardHeader>
                <CardTitle className="flex items-center justify-between" style={{ color: "#112A43" }}>
                  <div className="flex items-center gap-3">
                    <TrendingUp className="w-6 h-6" />
                    Portfolio Risk Forecast Timeline
                    <Popover>
                      <PopoverTrigger>
                        <HelpCircle className="w-5 h-5 text-gray-400 hover:text-gray-600" />
                      </PopoverTrigger>
                      <PopoverContent className="w-80">
                        <p className="text-sm">
                          Aggregated climate risk projections from 2024 to 2050 across all selected properties,
                          incorporating physical and transition risks with financial impact modeling. Updates in
                          real-time based on scenario and payment structure selections.
                        </p>
                      </PopoverContent>
                    </Popover>
                  </div>
                  <div className="flex gap-3">
                    <Button
                      variant={showBenchmark ? "default" : "outline"}
                      size="sm"
                      className="rounded-full"
                      onClick={() => setShowBenchmark(!showBenchmark)}
                      style={{ backgroundColor: showBenchmark ? "#2B6CA9" : "transparent" }}
                    >
                      Benchmark
                    </Button>
                    <Button
                      variant={expandedCharts ? "default" : "outline"}
                      size="sm"
                      className="rounded-full"
                      onClick={() => setExpandedCharts(!expandedCharts)}
                      style={{ backgroundColor: expandedCharts ? "#2B6CA9" : "transparent" }}
                    >
                      Expand
                    </Button>
                  </div>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="h-80 mb-6">
                  <ResponsiveContainer width="100%" height="100%">
                    <LineChart data={riskData}>
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
                      {selectedAssets.map((_, index) => (
                        <Line
                          key={index}
                          type="monotone"
                          dataKey="risk"
                          stroke="#2B6CA9"
                          strokeWidth={3}
                          dot={{ fill: "#2B6CA9", strokeWidth: 2, r: 4 }}
                          activeDot={{ r: 6, stroke: "#2B6CA9", strokeWidth: 2 }}
                        />
                      ))}
                    </LineChart>
                  </ResponsiveContainer>
                </div>

                <div className="grid grid-cols-3 gap-6 mb-6">
                  <div>
                    <label className="text-sm font-semibold text-gray-700 mb-2 block">Interest Rate (%)</label>
                    <Input type="number" defaultValue="5.5" className="rounded-full h-12" />
                  </div>
                  <div>
                    <label className="text-sm font-semibold text-gray-700 mb-2 block">Term (years)</label>
                    <Input type="number" defaultValue="25" className="rounded-full h-12" />
                  </div>
                  <div>
                    <label className="text-sm font-semibold text-gray-700 mb-2 block">Annual Payment</label>
                    <Input type="number" defaultValue="2800000" className="rounded-full h-12" />
                  </div>
                </div>

                {/* Vertical Layout for Revenue and Expense Trends */}
                {expandedCharts && (
                  <div className="space-y-8 mt-8 pt-8 border-t border-gray-200">
                    {/* Revenue Trends - Split into Pay Fines vs Retrofit */}
                    <div>
                      <h3 className="text-xl font-bold mb-4" style={{ color: "#112A43" }}>
                        Portfolio Revenue Trends
                      </h3>
                      <div className="grid grid-cols-2 gap-6">
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
                                <LineChart data={riskData}>
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
                                  <AlertTriangle className="w-3 h-3 text-white" />
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
                                <LineChart data={riskData}>
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

                    {/* Expense Trends - Split into Pay Fines vs Retrofit */}
                    <div>
                      <h3 className="text-xl font-bold mb-4" style={{ color: "#112A43" }}>
                        Portfolio Expense Trends
                      </h3>
                      <div className="grid grid-cols-2 gap-6">
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
                                <LineChart data={riskData}>
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
                                  <AlertTriangle className="w-3 h-3 text-white" />
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
                                <LineChart data={riskData}>
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
                    <div>Property Address</div>
                    <div>Energy Intensity</div>
                  </div>
                  {selectedAssets.slice(0, 5).map((asset, index) => (
                    <div key={index} className="grid grid-cols-2 gap-4 text-sm">
                      <div className="truncate">{asset.split(",")[0]}</div>
                      <div className="font-semibold text-green-600">{85 + index * 5} kWh/m²/yr</div>
                    </div>
                  ))}
                  <div className="grid grid-cols-2 gap-4 text-sm font-semibold border-t pt-2">
                    <div>Portfolio Average</div>
                    <div style={{ color: "#2B6CA9" }}>{Math.round(85 + selectedAssets.length * 2.5)} kWh/m²/yr</div>
                  </div>
                  <div className="grid grid-cols-2 gap-4 text-sm">
                    <div>Industry Benchmark</div>
                    <div className="text-gray-600">95 kWh/m²/yr</div>
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
                    <AlertTriangle className="w-4 h-4" style={{ color: "#112A43" }} />
                  </div>
                  <div className="text-sm">
                    <div className="font-semibold mb-1">Physical Climate Risks</div>
                    <div className="text-gray-600">Flood exposure increases operational disruption by 25%</div>
                  </div>
                </div>
                <div className="flex items-start gap-3 p-3 rounded-xl hover:bg-gray-50 transition-colors">
                  <div
                    className="w-8 h-8 rounded-full flex items-center justify-center"
                    style={{ backgroundColor: "#66DCCC" }}
                  >
                    <TrendingUp className="w-4 h-4" style={{ color: "#112A43" }} />
                  </div>
                  <div className="text-sm">
                    <div className="font-semibold mb-1">Transition Risk Exposure</div>
                    <div className="text-gray-600">Carbon pricing could add $1.2M annually by 2030</div>
                  </div>
                </div>
                <div className="flex items-start gap-3 p-3 rounded-xl hover:bg-gray-50 transition-colors">
                  <div
                    className="w-8 h-8 rounded-full flex items-center justify-center"
                    style={{ backgroundColor: "#99EFE4" }}
                  >
                    <Shield className="w-4 h-4" style={{ color: "#112A43" }} />
                  </div>
                  <div className="text-sm">
                    <div className="font-semibold mb-1">Portfolio Concentration</div>
                    <div className="text-gray-600">Geographic clustering amplifies regional climate risks</div>
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
                  <span className="font-bold text-lg text-red-600">{financialMetrics.dscr}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm font-medium">LTV Directionality</span>
                  <span className="font-bold text-lg text-orange-600">Up</span>
                </div>
                <div className="pt-4 border-t border-gray-200">
                  <div className="flex justify-between items-center">
                    <span className="text-sm font-medium">Properties Analyzed</span>
                    <span className="font-bold text-lg" style={{ color: "#2B6CA9" }}>
                      {selectedAssets.length}
                    </span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  )
}
