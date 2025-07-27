"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Building, DollarSign, TrendingDown, AlertTriangle, ChevronDown, ChevronUp } from "lucide-react"
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell } from "recharts"

const summaryData = [
  { title: "Total Properties", value: "123", icon: Building, color: "#2B6CA9" },
  { title: "Loan Value", value: "$2.8B", icon: DollarSign, color: "#10B981" },
  { title: "NOI Loss", value: "-$145M", icon: TrendingDown, color: "#EF4444" },
  { title: "Change to Probability of Default", value: "+12.4%", icon: AlertTriangle, color: "#F59E0B" },
]

const canadaRiskData = [
  { name: "High Risk", value: 850, color: "#EF4444" },
  { name: "Medium Risk", value: 1200, color: "#F59E0B" },
  { name: "Low Risk", value: 750, color: "#10B981" },
]

const regionalData = [
  {
    region: "Ontario",
    data: [
      { name: "High Risk", value: 420, color: "#EF4444" },
      { name: "Medium Risk", value: 580, color: "#F59E0B" },
      { name: "Low Risk", value: 350, color: "#10B981" },
    ],
    avgNOILoss: "-$68M",
    highRiskDollars: "$420M",
    lendingOpportunity: "$185M",
  },
  {
    region: "Quebec",
    data: [
      { name: "High Risk", value: 280, color: "#EF4444" },
      { name: "Medium Risk", value: 390, color: "#F59E0B" },
      { name: "Low Risk", value: 240, color: "#10B981" },
    ],
    avgNOILoss: "-$45M",
    highRiskDollars: "$280M",
    lendingOpportunity: "$125M",
  },
  {
    region: "Alberta",
    data: [
      { name: "High Risk", value: 150, color: "#EF4444" },
      { name: "Medium Risk", value: 230, color: "#F59E0B" },
      { name: "Low Risk", value: 160, color: "#10B981" },
    ],
    avgNOILoss: "-$32M",
    highRiskDollars: "$150M",
    lendingOpportunity: "$85M",
  },
]

export default function KeyInsightsPage() {
  const [isExpanded, setIsExpanded] = useState(false)

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Page Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-2" style={{ color: "#112A43" }}>
            Key Insights
          </h1>
          <p className="text-gray-600">
            Comprehensive overview of portfolio climate risk exposure and financial impact
          </p>
        </div>

        {/* Top Summary Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {summaryData.map((item, index) => {
            const Icon = item.icon
            return (
              <Card key={index} className="rounded-xl shadow-sm">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-gray-600 mb-1">{item.title}</p>
                      <p className="text-2xl font-bold" style={{ color: item.color }}>
                        {item.value}
                      </p>
                    </div>
                    <div
                      className="w-12 h-12 rounded-full flex items-center justify-center"
                      style={{ backgroundColor: `${item.color}20` }}
                    >
                      <Icon className="w-6 h-6" style={{ color: item.color }} />
                    </div>
                  </div>
                </CardContent>
              </Card>
            )
          })}
        </div>

        {/* Core Visualization Card */}
        <Card className="rounded-xl shadow-sm">
          <CardHeader className="pb-4">
            <div className="flex items-center justify-between">
              <CardTitle className="text-xl font-bold" style={{ color: "#112A43" }}>
                Risk Distribution Analysis - Canada
              </CardTitle>
              <Button variant="outline" onClick={() => setIsExpanded(!isExpanded)} className="flex items-center gap-2">
                {isExpanded ? (
                  <>
                    Collapse <ChevronUp className="w-4 h-4" />
                  </>
                ) : (
                  <>
                    Expand <ChevronDown className="w-4 h-4" />
                  </>
                )}
              </Button>
            </div>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              {/* Left Side - Stacked Bar Chart */}
              <div>
                <h3 className="text-lg font-semibold mb-4" style={{ color: "#112A43" }}>
                  Risk Breakdown by Loan Value (Millions CAD)
                </h3>
                <ResponsiveContainer width="100%" height={300}>
                  <BarChart data={canadaRiskData} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="name" />
                    <YAxis />
                    <Tooltip formatter={(value) => [`$${value}M`, "Loan Value"]} />
                    <Bar dataKey="value" radius={[4, 4, 0, 0]}>
                      {canadaRiskData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Bar>
                  </BarChart>
                </ResponsiveContainer>
              </div>

              {/* Right Side - Nested Cards */}
              <div className="space-y-4">
                {/* Key Insights Text Area */}
                <Card className="bg-blue-50 border-blue-200">
                  <CardHeader className="pb-3">
                    <CardTitle className="text-lg" style={{ color: "#112A43" }}>
                      Key Insights
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="pt-0">
                    <div className="space-y-2 text-sm text-gray-700">
                      <p>
                        • <strong>High-risk properties</strong> concentrated in urban centers with aging infrastructure
                      </p>
                      <p>
                        • <strong>Energy efficiency upgrades</strong> could reduce 40% of medium-risk exposure
                      </p>
                      <p>
                        • <strong>Flood risk</strong> is the primary driver of high-risk classifications
                      </p>
                      <p>
                        • <strong>Carbon pricing</strong> impact expected to increase 15% annually through 2030
                      </p>
                    </div>
                  </CardContent>
                </Card>

                {/* Bottom Mini Cards */}
                <div className="grid grid-cols-2 gap-4">
                  <Card className="bg-red-50 border-red-200">
                    <CardContent className="p-4">
                      <div className="text-center">
                        <p className="text-sm font-medium text-red-700 mb-1">High Risk Exposure</p>
                        <p className="text-2xl font-bold text-red-600">$850M</p>
                      </div>
                    </CardContent>
                  </Card>

                  <Card className="bg-green-50 border-green-200">
                    <CardContent className="p-4">
                      <div className="text-center">
                        <p className="text-sm font-medium text-green-700 mb-1">Lending Opportunities</p>
                        <p className="text-2xl font-bold text-green-600">$395M</p>
                      </div>
                    </CardContent>
                  </Card>
                </div>
              </div>
            </div>

            {/* Expandable Regional Analysis */}
            {isExpanded && (
              <div className="mt-8 pt-8 border-t border-gray-200">
                <h3 className="text-xl font-bold mb-6" style={{ color: "#112A43" }}>
                  Regional Risk Analysis
                </h3>
                <div className="space-y-8">
                  {regionalData.map((region, index) => (
                    <div key={index} className="bg-gray-50 rounded-lg p-6">
                      <h4 className="text-lg font-semibold mb-4" style={{ color: "#112A43" }}>
                        {region.region}
                      </h4>

                      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                        {/* Regional Chart */}
                        <div>
                          <ResponsiveContainer width="100%" height={200}>
                            <BarChart data={region.data} margin={{ top: 10, right: 30, left: 20, bottom: 5 }}>
                              <CartesianGrid strokeDasharray="3 3" />
                              <XAxis dataKey="name" />
                              <YAxis />
                              <Tooltip formatter={(value) => [`$${value}M`, "Loan Value"]} />
                              <Bar dataKey="value" radius={[4, 4, 0, 0]}>
                                {region.data.map((entry, idx) => (
                                  <Cell key={`cell-${idx}`} fill={entry.color} />
                                ))}
                              </Bar>
                            </BarChart>
                          </ResponsiveContainer>
                        </div>

                        {/* Regional Metrics */}
                        <div className="grid grid-cols-1 gap-4">
                          <Card className="bg-white">
                            <CardContent className="p-4">
                              <div className="text-center">
                                <p className="text-sm font-medium text-gray-600 mb-1">Average NOI Loss</p>
                                <p className="text-xl font-bold text-red-600">{region.avgNOILoss}</p>
                              </div>
                            </CardContent>
                          </Card>

                          <div className="grid grid-cols-2 gap-2">
                            <Card className="bg-white">
                              <CardContent className="p-3">
                                <div className="text-center">
                                  <p className="text-xs font-medium text-gray-600 mb-1">High Risk</p>
                                  <p className="text-lg font-bold text-red-600">{region.highRiskDollars}</p>
                                </div>
                              </CardContent>
                            </Card>

                            <Card className="bg-white">
                              <CardContent className="p-3">
                                <div className="text-center">
                                  <p className="text-xs font-medium text-gray-600 mb-1">Opportunities</p>
                                  <p className="text-lg font-bold text-green-600">{region.lendingOpportunity}</p>
                                </div>
                              </CardContent>
                            </Card>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
