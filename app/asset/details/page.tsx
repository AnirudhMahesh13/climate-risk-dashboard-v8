"use client"

import { useState, useEffect } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { MultiAssetStepper } from "@/components/multi-asset-stepper"
import { Calculator, TrendingUp, Building, DollarSign, ChevronLeft, ChevronRight, HelpCircle } from "lucide-react"

// Replace the mockProperties array with import
import { mockProperties } from "@/lib/mock-data"

// Update the defaultFormData to include the new field and remove propertyValue from here
const defaultFormData: PropertyFormData = {
  clientName: "ABC Real Estate Corp",
  loanValue: "32000000",
  propertyValue: "45000000", // Keep for calculations but move to Financials section
  propertyType: "office",
  yearBuilt: "2015",
  squareFootage: "250000",
  estimatedEnergyIntensity: "85", // New field - kWh/sq ft/year
  heatSource: "natural-gas",
  greenCertifications: "leed-gold",
  ttmRevenue: "8500000",
  annualDebtPayment: "2800000",
  netOperatingIncome: "6200000",
  operatingExpenses: "2300000",
}

interface PropertyFormData {
  clientName: string
  loanValue: string
  propertyValue: string
  propertyType: string
  yearBuilt: string
  squareFootage: string
  estimatedEnergyIntensity: string // New field
  heatSource: string
  greenCertifications: string
  ttmRevenue: string
  annualDebtPayment: string
  netOperatingIncome: string
  operatingExpenses: string
}

export default function AssetDetailsPage() {
  const router = useRouter()
  const searchParams = useSearchParams()

  const propertyIds = searchParams.get("properties")?.split(",").map(Number) || []
  const currentAssetIndex = Number(searchParams.get("current")) - 1 || 0
  const currentPropertyId = propertyIds[currentAssetIndex]
  const totalAssets = propertyIds.length

  // Get current property data
  const currentProperty = mockProperties.find((p) => p.id === currentPropertyId)

  // Initialize form data with current property defaults
  const [formData, setFormData] = useState<PropertyFormData>(() => {
    if (currentProperty) {
      return {
        ...defaultFormData,
        propertyValue: currentProperty.value.toString(),
        propertyType: currentProperty.type.toLowerCase().replace(" ", "-"),
        yearBuilt: currentProperty.yearBuilt.toString(),
        squareFootage: currentProperty.size.toString(),
        heatSource: currentProperty.heatSource,
        greenCertifications: currentProperty.greenCertifications,
        clientName: currentProperty.clientName,
        // Estimate energy intensity based on property characteristics
        estimatedEnergyIntensity:
          currentProperty.yearBuilt > 2015 ? "65" : currentProperty.yearBuilt > 2010 ? "85" : "105",
      }
    }
    return defaultFormData
  })

  // Store form data for each property
  const [allPropertyData, setAllPropertyData] = useState<Record<number, PropertyFormData>>({})

  // Load saved data for current property
  useEffect(() => {
    if (currentPropertyId && allPropertyData[currentPropertyId]) {
      setFormData(allPropertyData[currentPropertyId])
    } else if (currentProperty) {
      setFormData({
        ...defaultFormData,
        propertyValue: currentProperty.value.toString(),
        propertyType: currentProperty.type.toLowerCase().replace(" ", "-"),
        yearBuilt: currentProperty.yearBuilt.toString(),
        squareFootage: currentProperty.size.toString(),
        heatSource: currentProperty.heatSource,
        greenCertifications: currentProperty.greenCertifications,
        clientName: currentProperty.clientName,
        estimatedEnergyIntensity:
          currentProperty.yearBuilt > 2015 ? "65" : currentProperty.yearBuilt > 2010 ? "85" : "105",
      })
    }
  }, [currentPropertyId, currentProperty, allPropertyData])

  const ltv =
    formData.loanValue && formData.propertyValue
      ? ((Number.parseFloat(formData.loanValue) / Number.parseFloat(formData.propertyValue)) * 100).toFixed(1)
      : "0"

  const dscr =
    formData.netOperatingIncome && formData.annualDebtPayment
      ? (Number.parseFloat(formData.netOperatingIncome) / Number.parseFloat(formData.annualDebtPayment)).toFixed(2)
      : "0"

  const handleInputChange = (field: keyof PropertyFormData, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }))
  }

  const saveCurrentPropertyData = () => {
    setAllPropertyData((prev) => ({
      ...prev,
      [currentPropertyId]: formData,
    }))
  }

  const handleNext = () => {
    saveCurrentPropertyData()

    if (currentAssetIndex < totalAssets - 1) {
      // Go to next property
      const nextIndex = currentAssetIndex + 1
      router.push(`/asset/details?properties=${propertyIds.join(",")}&current=${nextIndex + 1}`)
    } else {
      // Go to analysis page with all property data
      const allData = { ...allPropertyData, [currentPropertyId]: formData }
      const dataParam = encodeURIComponent(JSON.stringify(allData))
      router.push(`/asset/analysis?properties=${propertyIds.join(",")}&data=${dataParam}`)
    }
  }

  const handleBack = () => {
    saveCurrentPropertyData()

    if (currentAssetIndex > 0) {
      // Go to previous property
      const prevIndex = currentAssetIndex - 1
      router.push(`/asset/details?properties=${propertyIds.join(",")}&current=${prevIndex + 1}`)
    } else {
      // Go back to search
      router.push("/asset/search")
    }
  }

  if (!currentProperty) {
    return <div>Property not found</div>
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-6 py-8">
        <MultiAssetStepper currentAsset={currentAssetIndex + 1} totalAssets={totalAssets} currentStep={1} />

        {/* Property Progress Header */}
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold mb-2" style={{ color: "#112A43" }}>
            Property {currentAssetIndex + 1} of {totalAssets}
          </h1>
          <p className="text-lg text-gray-600">
            Configure details for: <span className="font-semibold">{currentProperty.address}</span>
          </p>
        </div>

        {/* Top Stats */}
        <div className="grid grid-cols-4 gap-6 mb-8 max-w-6xl mx-auto">
          {[
            {
              label: "Property Address",
              value: currentProperty.address.split(",")[0],
              icon: Building,
              color: "#2B6CA9",
            },
            {
              label: "Risk Score",
              value: "7.2/10",
              icon: TrendingUp,
              color: "#f59e0b",
              showInfo: true, // Add info icon flag
            },
            { label: "LTV Ratio", value: `${ltv}%`, icon: Calculator, color: "#10b981" },
            { label: "DSCR", value: dscr, icon: DollarSign, color: "#8b5cf6" },
          ].map((stat, index) => {
            const Icon = stat.icon
            return (
              <Card key={index} className="rounded-2xl shadow-lg hover:shadow-xl transition-shadow">
                <CardContent className="p-6 text-center">
                  <div className="flex items-center justify-center gap-2 mb-3">
                    <Icon className="w-8 h-8" style={{ color: stat.color }} />
                    {stat.showInfo && (
                      <Popover>
                        <PopoverTrigger asChild>
                          <HelpCircle className="w-4 h-4 text-gray-400 hover:text-gray-600 cursor-pointer" />
                        </PopoverTrigger>
                        <PopoverContent className="w-80">
                          <div className="space-y-2">
                            <h4 className="font-semibold text-sm">Risk Score Calculation</h4>
                            <p className="text-xs text-gray-600">
                              The risk score (1-10) is calculated based on multiple factors including:
                            </p>
                            <ul className="text-xs text-gray-600 space-y-1">
                              <li>• Physical climate risks (flooding, extreme weather)</li>
                              <li>• Transition risks (carbon pricing, regulations)</li>
                              <li>• Building age and energy efficiency</li>
                              <li>• Geographic location and exposure</li>
                              <li>• Asset type and operational characteristics</li>
                            </ul>
                            <p className="text-xs text-gray-600 mt-2">
                              Higher scores indicate greater climate-related financial risk.
                            </p>
                          </div>
                        </PopoverContent>
                      </Popover>
                    )}
                  </div>
                  <div className="text-2xl font-bold mb-2" style={{ color: stat.color }}>
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
          <div className="col-span-3 grid grid-cols-3 gap-8">
            {/* Overview Panel */}
            <Card className="rounded-2xl shadow-lg">
              <CardHeader className="pb-4">
                <CardTitle className="text-xl" style={{ color: "#112A43" }}>
                  Overview
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <div>
                  <Label htmlFor="clientName" className="text-sm font-semibold text-gray-700">
                    Client Name
                  </Label>
                  <Input
                    id="clientName"
                    value={formData.clientName}
                    onChange={(e) => handleInputChange("clientName", e.target.value)}
                    className="rounded-full mt-2 h-12"
                  />
                </div>
                <div>
                  <Label htmlFor="loanValue" className="text-sm font-semibold text-gray-700">
                    Loan Value
                  </Label>
                  <Input
                    id="loanValue"
                    type="number"
                    value={formData.loanValue}
                    onChange={(e) => handleInputChange("loanValue", e.target.value)}
                    className="rounded-full mt-2 h-12"
                  />
                </div>
                <Card className="p-6 shadow-inner" style={{ backgroundColor: "#99EFE4" }}>
                  <div className="flex items-center gap-2 mb-3">
                    <Calculator className="w-5 h-5" style={{ color: "#112A43" }} />
                    <div className="text-lg font-bold" style={{ color: "#112A43" }}>
                      Auto-calculated Ratios
                    </div>
                  </div>
                  <div className="space-y-2">
                    <div className="flex justify-between items-center">
                      <span className="font-medium" style={{ color: "#112A43" }}>
                        LTV Ratio:
                      </span>
                      <Badge
                        className="rounded-full px-4 py-2 font-bold"
                        style={{ backgroundColor: "#2B6CA9", color: "white" }}
                      >
                        {ltv}%
                      </Badge>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="font-medium" style={{ color: "#112A43" }}>
                        DSCR:
                      </span>
                      <Badge
                        className="rounded-full px-4 py-2 font-bold"
                        style={{ backgroundColor: "#66DCCC", color: "#112A43" }}
                      >
                        {dscr}
                      </Badge>
                    </div>
                  </div>
                </Card>
              </CardContent>
            </Card>

            {/* Property Basics Panel - Removed Property Value, Added Energy Intensity */}
            <Card className="rounded-2xl shadow-lg">
              <CardHeader className="pb-4">
                <CardTitle className="text-xl" style={{ color: "#112A43" }}>
                  Property Basics
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <div>
                  <Label htmlFor="propertyType" className="text-sm font-semibold text-gray-700">
                    Property Type
                  </Label>
                  <Select
                    value={formData.propertyType}
                    onValueChange={(value) => handleInputChange("propertyType", value)}
                  >
                    <SelectTrigger className="rounded-full mt-2 h-12">
                      <SelectValue placeholder="Select type" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="office">Office</SelectItem>
                      <SelectItem value="retail">Retail</SelectItem>
                      <SelectItem value="industrial">Industrial</SelectItem>
                      <SelectItem value="mixed-use">Mixed Use</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label htmlFor="yearBuilt" className="text-sm font-semibold text-gray-700">
                    Year Built
                  </Label>
                  <Input
                    id="yearBuilt"
                    type="number"
                    value={formData.yearBuilt}
                    onChange={(e) => handleInputChange("yearBuilt", e.target.value)}
                    className="rounded-full mt-2 h-12"
                  />
                </div>
                <div>
                  <Label htmlFor="squareFootage" className="text-sm font-semibold text-gray-700">
                    Square Footage
                  </Label>
                  <Input
                    id="squareFootage"
                    type="number"
                    value={formData.squareFootage}
                    onChange={(e) => handleInputChange("squareFootage", e.target.value)}
                    className="rounded-full mt-2 h-12"
                  />
                </div>
                {/* New Field: Estimated Energy Intensity */}
                <div>
                  <Label htmlFor="estimatedEnergyIntensity" className="text-sm font-semibold text-gray-700">
                    Estimated Energy Intensity
                  </Label>
                  <div className="relative">
                    <Input
                      id="estimatedEnergyIntensity"
                      type="number"
                      value={formData.estimatedEnergyIntensity}
                      onChange={(e) => handleInputChange("estimatedEnergyIntensity", e.target.value)}
                      className="rounded-full mt-2 h-12 pr-20"
                      placeholder="85"
                    />
                    <div className="absolute right-4 top-1/2 transform -translate-y-1/2 text-sm text-gray-500 mt-1">
                      kWh/sq ft/yr
                    </div>
                  </div>
                </div>
                <div>
                  <Label htmlFor="heatSource" className="text-sm font-semibold text-gray-700">
                    Heat Source
                  </Label>
                  <Select value={formData.heatSource} onValueChange={(value) => handleInputChange("heatSource", value)}>
                    <SelectTrigger className="rounded-full mt-2 h-12">
                      <SelectValue placeholder="Select heat source" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="natural-gas">Natural Gas</SelectItem>
                      <SelectItem value="electricity">Electricity</SelectItem>
                      <SelectItem value="oil">Oil</SelectItem>
                      <SelectItem value="geothermal">Geothermal</SelectItem>
                      <SelectItem value="solar">Solar</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label htmlFor="greenCertifications" className="text-sm font-semibold text-gray-700">
                    Green Certifications
                  </Label>
                  <Select
                    value={formData.greenCertifications}
                    onValueChange={(value) => handleInputChange("greenCertifications", value)}
                  >
                    <SelectTrigger className="rounded-full mt-2 h-12">
                      <SelectValue placeholder="Select certification" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="none">None</SelectItem>
                      <SelectItem value="leed-gold">LEED Gold</SelectItem>
                      <SelectItem value="leed-platinum">LEED Platinum</SelectItem>
                      <SelectItem value="energy-star">Energy Star</SelectItem>
                      <SelectItem value="boma-best">BOMA BEST</SelectItem>
                      <SelectItem value="green-globes">Green Globes</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </CardContent>
            </Card>

            {/* Financials Panel - Added Property Value */}
            <Card className="rounded-2xl shadow-lg">
              <CardHeader className="pb-4">
                <CardTitle className="text-xl" style={{ color: "#112A43" }}>
                  Financials
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                {/* Moved Property Value here */}
                <div>
                  <Label htmlFor="propertyValue" className="text-sm font-semibold text-gray-700">
                    Property Value
                  </Label>
                  <Input
                    id="propertyValue"
                    type="number"
                    value={formData.propertyValue}
                    onChange={(e) => handleInputChange("propertyValue", e.target.value)}
                    className="rounded-full mt-2 h-12"
                  />
                </div>
                <div>
                  <Label htmlFor="ttmRevenue" className="text-sm font-semibold text-gray-700">
                    TTM Revenue
                  </Label>
                  <Input
                    id="ttmRevenue"
                    type="number"
                    value={formData.ttmRevenue}
                    onChange={(e) => handleInputChange("ttmRevenue", e.target.value)}
                    className="rounded-full mt-2 h-12"
                  />
                </div>
                <div>
                  <Label htmlFor="annualDebtPayment" className="text-sm font-semibold text-gray-700">
                    Annual Debt Payment
                  </Label>
                  <Input
                    id="annualDebtPayment"
                    type="number"
                    value={formData.annualDebtPayment}
                    onChange={(e) => handleInputChange("annualDebtPayment", e.target.value)}
                    className="rounded-full mt-2 h-12"
                  />
                </div>
                <div>
                  <Label htmlFor="netOperatingIncome" className="text-sm font-semibold text-gray-700">
                    Net Operating Income
                  </Label>
                  <Input
                    id="netOperatingIncome"
                    type="number"
                    value={formData.netOperatingIncome}
                    onChange={(e) => handleInputChange("netOperatingIncome", e.target.value)}
                    className="rounded-full mt-2 h-12"
                  />
                </div>
                <div>
                  <Label htmlFor="operatingExpenses" className="text-sm font-semibold text-gray-700">
                    Operating Expenses
                  </Label>
                  <Input
                    id="operatingExpenses"
                    type="number"
                    value={formData.operatingExpenses}
                    onChange={(e) => handleInputChange("operatingExpenses", e.target.value)}
                    className="rounded-full mt-2 h-12"
                  />
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Right Sidebar */}
          <div>
            <Card className="rounded-2xl sticky top-8 shadow-lg">
              <CardHeader>
                <CardTitle style={{ color: "#112A43" }}>Property Insights</CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="p-4 rounded-xl" style={{ backgroundColor: "#99EFE4" }}>
                  <h4 className="font-semibold mb-2" style={{ color: "#112A43" }}>
                    Financial Health
                  </h4>
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span>LTV Status:</span>
                      <span
                        className={`font-bold ${Number.parseFloat(ltv) > 80 ? "text-red-600" : Number.parseFloat(ltv) > 70 ? "text-yellow-600" : "text-green-600"}`}
                      >
                        {Number.parseFloat(ltv) > 80
                          ? "High Risk"
                          : Number.parseFloat(ltv) > 70
                            ? "Moderate"
                            : "Healthy"}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span>DSCR Status:</span>
                      <span
                        className={`font-bold ${Number.parseFloat(dscr) < 1.2 ? "text-red-600" : Number.parseFloat(dscr) < 1.5 ? "text-yellow-600" : "text-green-600"}`}
                      >
                        {Number.parseFloat(dscr) < 1.2 ? "Weak" : Number.parseFloat(dscr) < 1.5 ? "Adequate" : "Strong"}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Energy Efficiency Insight */}
                <div className="p-4 rounded-xl" style={{ backgroundColor: "#66DCCC" }}>
                  <h4 className="font-semibold mb-2" style={{ color: "#112A43" }}>
                    Energy Efficiency
                  </h4>
                  <div className="text-sm space-y-1" style={{ color: "#112A43" }}>
                    <div>• Current: {formData.estimatedEnergyIntensity} kWh/sq ft/yr</div>
                    <div>
                      • Benchmark:{" "}
                      {Number.parseInt(formData.estimatedEnergyIntensity) > 90
                        ? "Above average"
                        : Number.parseInt(formData.estimatedEnergyIntensity) > 70
                          ? "Average"
                          : "Below average"}
                    </div>
                    <div>
                      • Improvement potential: {Math.max(0, Number.parseInt(formData.estimatedEnergyIntensity) - 50)}{" "}
                      kWh/sq ft/yr
                    </div>
                  </div>
                </div>

                <div className="p-4 rounded-xl" style={{ backgroundColor: "#f3f4f6" }}>
                  <h4 className="font-semibold mb-2" style={{ color: "#112A43" }}>
                    Progress
                  </h4>
                  <div className="text-sm space-y-1" style={{ color: "#112A43" }}>
                    <div>
                      • Property {currentAssetIndex + 1} of {totalAssets}
                    </div>
                    <div>• {totalAssets - currentAssetIndex - 1} remaining</div>
                    <div>• All data auto-saved</div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Navigation Buttons */}
        <div className="mt-12 flex items-center justify-between max-w-4xl mx-auto">
          <Button
            variant="outline"
            onClick={handleBack}
            className="rounded-full px-8 py-4 text-lg font-bold shadow-lg hover:shadow-xl transition-all duration-300 bg-transparent"
          >
            <ChevronLeft className="w-5 h-5 mr-2" />
            {currentAssetIndex === 0 ? "Back to Search" : "Previous Property"}
          </Button>

          {/* Property Address Display */}
          <Card className="rounded-2xl shadow-lg" style={{ backgroundColor: "#112A43" }}>
            <CardContent className="p-4">
              <div className="text-white text-center">
                <div className="text-sm opacity-80">Current Property</div>
                <div className="font-bold">{currentProperty.address}</div>
              </div>
            </CardContent>
          </Card>

          <Button
            onClick={handleNext}
            className="rounded-full px-8 py-4 text-lg font-bold text-white shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1"
            style={{ backgroundColor: "#2B6CA9" }}
          >
            {currentAssetIndex === totalAssets - 1 ? "Continue to Analysis" : "Next Property"}
            <ChevronRight className="w-5 h-5 ml-2" />
          </Button>
        </div>
      </div>
    </div>
  )
}
