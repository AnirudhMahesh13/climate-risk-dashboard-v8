"use client"

import { useState, useEffect, useMemo } from "react"
import { useSearchParams, useRouter } from "next/navigation"
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
  Building,
  AlertTriangle,
  Search,
  User,
  RefreshCw,
} from "lucide-react"
import type { CustomScenario } from "@/components/scenario-modal"
import {
  mockProperties,
  formatCurrency,
  formatSquareFootage,
  getRiskColor,
  getCertificationLabel,
} from "@/lib/mock-data"

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
  const router = useRouter()
  const [showBenchmark, setShowBenchmark] = useState(false)
  const [expandedCharts, setExpandedCharts] = useState(false)
  const [selectedAssets, setSelectedAssets] = useState<string[]>([])
  const [currentProperty, setCurrentProperty] = useState<any>(null)
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

  // Asset replacement search states
  const [searchQuery, setSearchQuery] = useState("")
  const [showSearchResults, setShowSearchResults] = useState(false)

  // Load property data from URL params - only run once
  useEffect(() => {
    if (isInitialized) return

    const propertyIds = searchParams.get("properties")?.split(",").map(Number) || []
    const propertyDataParam = searchParams.get("data")

    // Get property addresses for display and set current property
    const addresses = propertyIds.map((id) => {
      const property = mockProperties.find((p) => p.id === id)
      return property?.address || `Property ${id}`
    })

    // Set current property from first ID
    if (propertyIds.length > 0) {
      const property = mockProperties.find((p) => p.id === propertyIds[0])
      if (property) {
        setCurrentProperty(property)
        setSelectedAssets([property.address])

        // Update financial metrics based on current property
        setFinancialMetrics({
          assetValue: formatCurrency(property.value),
          riskScore: `${property.riskScore.toFixed(1)}/10`,
          annualRiskCost: `$${((property.value * 0.02) / 1000000).toFixed(1)}M`,
          netSavings: `$${(property.netOperatingIncome / 1000000).toFixed(1)}M`,
          ltv: `${property.ltv.toFixed(1)}%`,
          dscr: `${property.dscr.toFixed(2)}`,
        })
      }
    } else {
      // Default fallback for direct navigation
      const defaultProperty = mockProperties[13] // Toronto property
      setCurrentProperty(defaultProperty)
      setSelectedAssets([defaultProperty.address])
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

  // Filter properties for search
  const filteredProperties = useMemo(() => {
    if (!searchQuery.trim()) return []

    const query = searchQuery.toLowerCase()
    return mockProperties
      .filter(
        (property) =>
          property.address.toLowerCase().includes(query) ||
          property.city.toLowerCase().includes(query) ||
          property.state.toLowerCase().includes(query) ||
          property.country.toLowerCase().includes(query) ||
          property.clientName.toLowerCase().includes(query),
      )
      .slice(0, 5) // Limit to 5 results
  }, [searchQuery])

  const removeAsset = (asset: string) => {
    setSelectedAssets((prev) => prev.filter((a) => a !== asset))
  }

  const handleAssetReplacement = (property: any) => {
    // Update current property
    setCurrentProperty(property)
    setSelectedAssets([property.address])

    // Update financial metrics based on new property
    setFinancialMetrics({
      assetValue: formatCurrency(property.value),
      riskScore: `${property.riskScore.toFixed(1)}/10`,
      annualRiskCost: `$${((property.value * 0.02) / 1000000).toFixed(1)}M`,
      netSavings: `$${(property.netOperatingIncome / 1000000).toFixed(1)}M`,
      ltv: `${property.ltv.toFixed(1)}%`,
      dscr: `${property.dscr.toFixed(2)}`,
    })

    // Update risk data based on property risk level
    const riskMultiplier = property.riskLevel === "high" ? 1.3 : property.riskLevel === "low" ? 0.8 : 1.0
    const updatedRiskData = baseRiskData.map((item) => ({
      ...item,
      risk: item.risk * riskMultiplier,
      expenses: item.expenses * (1 + (riskMultiplier - 1) * 0.5),
      revenue: item.revenue * (1 + (riskMultiplier - 1) * 0.2),
      revenuePayFines: item.revenuePayFines * (1 + (riskMultiplier - 1) * 0.1),
      revenueRetrofit: item.revenueRetrofit * (1 + (riskMultiplier - 1) * 0.3),
      expensePayFines: item.expensePayFines * riskMultiplier,
      expenseRetrofit: item.expenseRetrofit * (1 + (riskMultiplier - 1) * 0.2),
    }))
    setRiskData(updatedRiskData)

    // Clear search
    setSearchQuery("")
    setShowSearchResults(false)

    // Update URL to reflect new property
    const newUrl = `/asset/analysis?properties=${property.id}&current=1`
    router.push(newUrl)
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
      const baseLTV = currentProperty?.ltv || 71.1
      const baseDSCR = currentProperty?.dscr || 2.21

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
        ltv: `${currentProperty?.ltv.toFixed(1) || "71.1"}%`,
        dscr: `${currentProperty?.dscr.toFixed(2) || "2.21"}`,
      }))
    }
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Collapsible Controls Sidebar */}
      <CollapsibleControlsSidebar onScenarioChange={handleScenarioChange} onPaymentChange={handlePaymentChange} />

      <div className="container mx-auto px-6 py-8">
        <MultiAssetStepper currentAsset={1} totalAssets={1} currentStep={2} />

        {/* Single Asset Header */}
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold mb-2" style={{ color: "#112A43" }}>
            Asset Climate Risk Analysis
          </h1>
          <p className="text-lg text-gray-600">
            Comprehensive analysis for {currentProperty?.address || "selected property"}
          </p>
        </div>

        {/* Top Stats */}
        <div className="grid grid-cols-4 gap-6 mb-8 max-w-6xl mx-auto">
          {[
            { label: "Asset Value", value: financialMetrics.assetValue, icon: DollarSign, color: "#10b981" },
            {
              label: "Risk Classification",
              value: financialMetrics.riskScore.replace("/10", ""),
              icon: Shield,
              color: "#f59e0b",
            },
            {
              label: "Annual Risk Cost",
              value: financialMetrics.annualRiskCost,
              icon: AlertTriangle,
              color: "#ef4444",
            },
            { label: "Net Operating Income", value: financialMetrics.netSavings, icon: TrendingUp, color: "#8b5cf6" },
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
                  Interactive Asset Climate Risk Map
                  <Popover>
                    <PopoverTrigger>
                      <HelpCircle className="w-5 h-5 text-gray-400 hover:text-gray-600" />
                    </PopoverTrigger>
                    <PopoverContent className="w-80">
                      <p className="text-sm">
                        Interactive climate risk visualization showing flood zones, temperature projections, and
                        environmental hazards for the selected property with detailed risk analysis.
                      </p>
                    </PopoverContent>
                  </Popover>
                </CardTitle>
                <p className="text-gray-600 text-lg">
                  Climate zones, flood risks, and environmental factors for{" "}
                  {currentProperty?.address || "selected property"}
                </p>
              </CardHeader>
              <CardContent>
                <div className="h-80 bg-gradient-to-br from-blue-100 to-green-100 rounded-2xl flex items-center justify-center mb-6 border-2 border-dashed border-gray-300">
                  <div className="text-center">
                    <MapPin className="w-16 h-16 mx-auto mb-4 text-gray-400" />
                    <div className="text-xl text-gray-500 font-medium">Interactive Asset Climate Risk Map</div>
                    <div className="text-gray-400">
                      Detailed analysis for {currentProperty?.address || "selected property"}
                    </div>
                  </div>
                </div>

                <div className="mb-6">
                  <h4 className="text-lg font-semibold mb-3" style={{ color: "#112A43" }}>
                    Current Asset Under Analysis
                  </h4>
                  {currentProperty && (
                    <Badge
                      className="rounded-full px-6 py-3 text-sm font-medium flex items-center gap-2 shadow-md w-fit"
                      style={{ backgroundColor: "#2B6CA9", color: "white" }}
                    >
                      <Building className="w-4 h-4" />
                      {currentProperty.address} - {currentProperty.clientName}
                    </Badge>
                  )}
                </div>

                <div className="flex gap-4">
                  <Button variant="outline" className="rounded-full bg-white shadow-md hover:shadow-lg">
                    <Download className="w-4 h-4 mr-2" />
                    Export Asset Data
                  </Button>
                </div>
              </CardContent>
            </Card>

            {/* Asset Replacement Search */}
            <Card className="rounded-2xl shadow-lg">
              <CardHeader>
                <CardTitle className="flex items-center gap-3" style={{ color: "#112A43" }}>
                  <RefreshCw className="w-6 h-6" />
                  Replace Asset Under Analysis
                  <Popover>
                    <PopoverTrigger>
                      <HelpCircle className="w-5 h-5 text-gray-400 hover:text-gray-600" />
                    </PopoverTrigger>
                    <PopoverContent className="w-80">
                      <p className="text-sm">
                        Search for a different property to analyze. You can search by address, city, province/state,
                        country, or client name. Selecting a new property will immediately update all analysis data.
                      </p>
                    </PopoverContent>
                  </Popover>
                </CardTitle>
              </CardHeader>
              <CardContent>
                {/* Currently Analyzing Display */}
                {currentProperty && (
                  <div className="mb-4 p-4 rounded-xl" style={{ backgroundColor: "#f0f9ff" }}>
                    <div className="flex items-center gap-3">
                      <div
                        className="w-8 h-8 rounded-full flex items-center justify-center"
                        style={{ backgroundColor: "#2B6CA9" }}
                      >
                        <Building className="w-4 h-4 text-white" />
                      </div>
                      <div>
                        <div className="font-semibold" style={{ color: "#112A43" }}>
                          Currently Analyzing: {currentProperty.address}
                        </div>
                        <div className="text-sm text-gray-600">
                          {currentProperty.clientName} • {currentProperty.city}, {currentProperty.state},{" "}
                          {currentProperty.country}
                        </div>
                      </div>
                    </div>
                  </div>
                )}

                {/* Search Bar */}
                <div className="relative mb-4">
                  <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                  <Input
                    placeholder="Search by address, city, province/state, country, or client name..."
                    value={searchQuery}
                    onChange={(e) => {
                      setSearchQuery(e.target.value)
                      setShowSearchResults(e.target.value.trim().length > 0)
                    }}
                    className="pl-12 h-12 text-base rounded-full border-2 focus:border-blue-500"
                  />
                </div>

                {/* Search Results */}
                {showSearchResults && filteredProperties.length > 0 && (
                  <div className="space-y-3 max-h-80 overflow-y-auto">
                    <div className="text-sm text-gray-600 mb-2">
                      {filteredProperties.length} result{filteredProperties.length !== 1 ? "s" : ""} found
                    </div>
                    {filteredProperties.map((property) => {
                      const riskColors = getRiskColor(property.riskLevel)
                      return (
                        <Card
                          key={property.id}
                          className="rounded-xl hover:shadow-md transition-all duration-200 cursor-pointer border-2 hover:border-blue-300"
                          onClick={() => handleAssetReplacement(property)}
                        >
                          <CardContent className="p-4">
                            <div className="flex items-center justify-between">
                              <div className="flex-1">
                                <h4 className="font-bold text-lg mb-1" style={{ color: "#112A43" }}>
                                  {property.address}
                                </h4>
                                <div className="flex items-center space-x-2 mb-2">
                                  <User className="w-4 h-4 text-gray-500" />
                                  <span className="text-gray-600 font-medium">{property.clientName}</span>
                                </div>
                                <div className="flex items-center space-x-2 mb-2">
                                  <MapPin className="w-4 h-4 text-gray-500" />
                                  <span className="text-gray-600">
                                    {property.city}, {property.state}, {property.country}
                                  </span>
                                </div>
                                <div className="flex items-center space-x-4 text-sm">
                                  <span className="font-medium">{property.type}</span>
                                  <span>•</span>
                                  <span className="font-semibold text-green-600">{formatCurrency(property.value)}</span>
                                  <span>•</span>
                                  <span>{formatSquareFootage(property.size)}</span>
                                </div>
                              </div>
                              <div className="text-right">
                                <Badge
                                  className="rounded-full px-4 py-2 text-sm font-bold shadow-md mb-2"
                                  style={{ backgroundColor: riskColors.bg, color: riskColors.text }}
                                >
                                  {property.riskLevel.charAt(0).toUpperCase() + property.riskLevel.slice(1)} Risk
                                </Badge>
                                <div className="text-xs text-gray-500">Score: {property.riskScore.toFixed(1)}/10</div>
                              </div>
                            </div>
                          </CardContent>
                        </Card>
                      )
                    })}
                  </div>
                )}

                {showSearchResults && filteredProperties.length === 0 && searchQuery.trim() && (
                  <div className="text-center py-8 text-gray-500">
                    <Search className="w-12 h-12 mx-auto mb-3 text-gray-300" />
                    <div className="text-lg font-medium mb-1">No properties found</div>
                    <div className="text-sm">Try adjusting your search terms</div>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Risk Forecast Timeline */}
            <Card className="rounded-2xl shadow-lg">
              <CardHeader>
                <CardTitle className="flex items-center justify-between" style={{ color: "#112A43" }}>
                  <div className="flex items-center gap-3">
                    <TrendingUp className="w-6 h-6" />
                    Asset Risk Forecast Timeline
                    <Popover>
                      <PopoverTrigger>
                        <HelpCircle className="w-5 h-5 text-gray-400 hover:text-gray-600" />
                      </PopoverTrigger>
                      <PopoverContent className="w-80">
                        <p className="text-sm">
                          Climate risk projections from 2024 to 2050 for the selected property, incorporating physical
                          and transition risks with financial impact modeling. Updates in real-time based on scenario
                          and payment structure selections.
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
                      <Line
                        type="monotone"
                        dataKey="risk"
                        stroke="#2B6CA9"
                        strokeWidth={3}
                        dot={{ fill: "#2B6CA9", strokeWidth: 2, r: 4 }}
                        activeDot={{ r: 6, stroke: "#2B6CA9", strokeWidth: 2 }}
                      />
                      {showBenchmark && (
                        <Line
                          type="monotone"
                          dataKey="benchmark"
                          stroke="#94a3b8"
                          strokeWidth={2}
                          strokeDasharray="5 5"
                          dot={{ fill: "#94a3b8", strokeWidth: 2, r: 3 }}
                        />
                      )}
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
                    <Input
                      type="number"
                      defaultValue={currentProperty?.annualDebtPayment || "2800000"}
                      className="rounded-full h-12"
                    />
                  </div>
                </div>

                {/* Vertical Layout for Revenue and Expense Trends */}
                {expandedCharts && (
                  <div className="space-y-8 mt-8 pt-8 border-t border-gray-200">
                    {/* Revenue Trends - Split into Pay Fines vs Retrofit */}
                    <div>
                      <h3 className="text-xl font-bold mb-4" style={{ color: "#112A43" }}>
                        Asset Revenue Trends
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
                                    Revenue projections under a "pay fines" strategy where the property continues
                                    current operations and pays regulatory penalties as they arise.
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
                        Asset Expense Trends
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
                  Asset Risk KPIs
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
                  {currentProperty && (
                    <>
                      <div className="grid grid-cols-2 gap-4 font-semibold text-sm border-b pb-2">
                        <div>Metric</div>
                        <div>Value</div>
                      </div>
                      <div className="grid grid-cols-2 gap-4 text-sm">
                        <div>Property Type</div>
                        <div className="font-semibold">{currentProperty.type}</div>
                      </div>
                      <div className="grid grid-cols-2 gap-4 text-sm">
                        <div>Year Built</div>
                        <div className="font-semibold">{currentProperty.yearBuilt}</div>
                      </div>
                      <div className="grid grid-cols-2 gap-4 text-sm">
                        <div>Size</div>
                        <div className="font-semibold">{formatSquareFootage(currentProperty.size)}</div>
                      </div>
                      <div className="grid grid-cols-2 gap-4 text-sm">
                        <div>Heat Source</div>
                        <div className="font-semibold capitalize">{currentProperty.heatSource.replace("-", " ")}</div>
                      </div>
                      <div className="grid grid-cols-2 gap-4 text-sm">
                        <div>Green Certification</div>
                        <div className="font-semibold">
                          {getCertificationLabel(currentProperty.greenCertifications)}
                        </div>
                      </div>
                      <div className="grid grid-cols-2 gap-4 text-sm font-semibold border-t pt-2">
                        <div>Energy Intensity</div>
                        <div style={{ color: "#2B6CA9" }}>92 kWh/m²/yr</div>
                      </div>
                      <div className="grid grid-cols-2 gap-4 text-sm">
                        <div>Industry Benchmark</div>
                        <div className="text-gray-600">95 kWh/m²/yr</div>
                      </div>
                    </>
                  )}
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
                    <div className="text-gray-600">
                      {currentProperty?.riskLevel === "high"
                        ? "High flood exposure increases operational disruption by 35%"
                        : currentProperty?.riskLevel === "low"
                          ? "Low flood exposure with minimal operational disruption"
                          : "Moderate flood exposure increases operational disruption by 20%"}
                    </div>
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
                    <div className="text-gray-600">
                      Carbon pricing could add ${((currentProperty?.value || 45000000) * 0.00003).toFixed(1)}M annually
                      by 2030
                    </div>
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
                    <div className="font-semibold mb-1">Asset Resilience</div>
                    <div className="text-gray-600">
                      {currentProperty?.greenCertifications !== "none"
                        ? "Green certification provides regulatory protection"
                        : "No green certification increases regulatory risk"}
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="rounded-2xl shadow-lg">
              <CardHeader>
                <CardTitle style={{ color: "#112A43" }}>Asset Financial Impact</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex justify-between items-center">
                  <span className="text-sm font-medium">Current DSCR</span>
                  <span className="font-bold text-lg text-green-600">{financialMetrics.dscr}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm font-medium">Current LTV</span>
                  <span className="font-bold text-lg text-blue-600">{financialMetrics.ltv}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm font-medium">TTM Revenue</span>
                  <span className="font-bold text-lg text-green-600">
                    {currentProperty ? formatCurrency(currentProperty.ttmRevenue) : "$8.5M"}
                  </span>
                </div>
                <div className="pt-4 border-t border-gray-200">
                  <div className="flex justify-between items-center">
                    <span className="text-sm font-medium">Risk Classification</span>
                    <span className="font-bold text-lg" style={{ color: "#2B6CA9" }}>
                      {currentProperty?.riskLevel.charAt(0).toUpperCase() + currentProperty?.riskLevel.slice(1) ||
                        "Medium"}
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
