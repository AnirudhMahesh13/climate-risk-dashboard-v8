"use client"

import { useState } from "react"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Slider } from "@/components/ui/slider"
import { Switch } from "@/components/ui/switch"
import { Label } from "@/components/ui/label"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { HelpCircle, Settings, ChevronLeft, ChevronRight } from "lucide-react"
import { ScenarioModal, type CustomScenario } from "./scenario-modal"
import { Input } from "@/components/ui/input"

interface CollapsibleControlsSidebarProps {
  onScenarioChange: (scenario: string, customData?: CustomScenario) => void
  onPaymentChange: (method: "upfront" | "loan", loanCoverage?: number, loanTerm?: number, interestRate?: number) => void
}

export function CollapsibleControlsSidebar({ onScenarioChange, onPaymentChange }: CollapsibleControlsSidebarProps) {
  const [isCollapsed, setIsCollapsed] = useState(false)
  const [scenario, setScenario] = useState("baseline")
  const [paymentMethod, setPaymentMethod] = useState<"upfront" | "loan">("upfront")
  const [loanCoverage, setLoanCoverage] = useState(80)
  const [loanTerm, setLoanTerm] = useState(25)
  const [interestRate, setInterestRate] = useState(5.5)
  const [showScenarioModal, setShowScenarioModal] = useState(false)
  const [customScenarios, setCustomScenarios] = useState<CustomScenario[]>([])

  const handleScenarioChange = (value: string) => {
    setScenario(value)
    if (value === "custom") {
      setShowScenarioModal(true)
    } else {
      onScenarioChange(value)
    }
  }

  const handlePaymentMethodChange = (isLoan: boolean) => {
    const method = isLoan ? "loan" : "upfront"
    setPaymentMethod(method)
    onPaymentChange(method, isLoan ? loanCoverage : undefined, isLoan ? loanTerm : undefined)
  }

  const handleLoanCoverageChange = (value: number[]) => {
    setLoanCoverage(value[0])
    onPaymentChange("loan", value[0], loanTerm, interestRate)
  }

  const handleLoanTermChange = (value: string) => {
    const term = Number.parseInt(value) || 25
    setLoanTerm(term)
    onPaymentChange("loan", loanCoverage, term, interestRate)
  }

  const handleInterestRateChange = (value: string) => {
    const rate = Number.parseFloat(value) || 5.5
    setInterestRate(rate)
    onPaymentChange("loan", loanCoverage, loanTerm, rate)
  }

  const handleCustomScenarioSave = (customScenario: CustomScenario) => {
    setCustomScenarios([...customScenarios, customScenario])
    setScenario(`custom-${customScenario.name}`)
    onScenarioChange(`custom-${customScenario.name}`, customScenario)
  }

  return (
    <>
      {/* Floating Toggle Button */}
      <div
        className={`fixed top-1/2 transform -translate-y-1/2 z-50 transition-all duration-300 ${isCollapsed ? "left-4" : "left-80"}`}
      >
        <Button
          onClick={() => setIsCollapsed(!isCollapsed)}
          className="rounded-full w-12 h-12 shadow-lg hover:shadow-xl transition-all duration-300"
          style={{ backgroundColor: "#2B6CA9" }}
        >
          {isCollapsed ? (
            <ChevronRight className="w-5 h-5 text-white" />
          ) : (
            <ChevronLeft className="w-5 h-5 text-white" />
          )}
        </Button>
      </div>

      {/* Sidebar */}
      <div
        className={`fixed left-0 top-0 h-full bg-white shadow-2xl z-40 transition-all duration-300 overflow-y-auto ${isCollapsed ? "-translate-x-full" : "translate-x-0"}`}
        style={{ width: "320px" }}
      >
        <div className="p-6 space-y-6">
          {/* Header */}
          <div className="flex items-center gap-2 pb-4 border-b border-gray-200">
            <Settings className="w-6 h-6" style={{ color: "#2B6CA9" }} />
            <h2 className="text-xl font-bold" style={{ color: "#112A43" }}>
              Analysis Controls
            </h2>
          </div>

          {/* Climate Scenario Controls */}
          <Card className="rounded-2xl shadow-md" style={{ backgroundColor: "#f8fafc", borderColor: "#e2e8f0" }}>
            <CardContent className="p-4">
              <div className="flex items-center gap-2 mb-4">
                <Settings className="w-5 h-5" style={{ color: "#2B6CA9" }} />
                <h3 className="text-lg font-bold" style={{ color: "#112A43" }}>
                  Climate Scenario
                </h3>
              </div>

              <div className="space-y-4">
                <div>
                  <Label htmlFor="scenario" className="text-sm font-semibold text-gray-700 mb-2 block">
                    Scenario
                  </Label>
                  <div className="flex items-center gap-2">
                    <Select value={scenario} onValueChange={handleScenarioChange}>
                      <SelectTrigger className="rounded-full h-10 flex-1">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="baseline">Baseline</SelectItem>
                        <SelectItem value="aggressive">Aggressive Transition</SelectItem>
                        <SelectItem value="delayed">Delayed Policy</SelectItem>
                        {customScenarios.map((cs) => (
                          <SelectItem key={cs.name} value={`custom-${cs.name}`}>
                            {cs.name} (Custom)
                          </SelectItem>
                        ))}
                        <SelectItem value="custom">+ Create Custom Scenario</SelectItem>
                      </SelectContent>
                    </Select>
                    <Popover>
                      <PopoverTrigger>
                        <HelpCircle className="w-4 h-4 text-gray-400 hover:text-gray-600" />
                      </PopoverTrigger>
                      <PopoverContent className="w-80">
                        <div className="space-y-2 text-sm">
                          <p>
                            <strong>Baseline:</strong> Current policy trajectory with moderate climate action
                          </p>
                          <p>
                            <strong>Aggressive Transition:</strong> Rapid decarbonization with strong policy support
                          </p>
                          <p>
                            <strong>Delayed Policy:</strong> Slower climate action with policy uncertainty
                          </p>
                          <p>
                            <strong>Custom:</strong> Define your own energy prices, carbon tax, and regulatory timeline
                          </p>
                        </div>
                      </PopoverContent>
                    </Popover>
                  </div>
                </div>

                {scenario.startsWith("custom-") && (
                  <div className="p-3 rounded-xl" style={{ backgroundColor: "#99EFE4" }}>
                    <div className="text-sm font-semibold mb-1" style={{ color: "#112A43" }}>
                      Active Custom Scenario
                    </div>
                    <div className="text-xs" style={{ color: "#112A43" }}>
                      {customScenarios.find((cs) => `custom-${cs.name}` === scenario)?.name || "Custom scenario active"}
                    </div>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>

          {/* Payment Structure Controls */}
          <Card className="rounded-2xl shadow-md" style={{ backgroundColor: "#f8fafc", borderColor: "#e2e8f0" }}>
            <CardContent className="p-4">
              <div className="flex items-center gap-2 mb-4">
                <Settings className="w-5 h-5" style={{ color: "#2B6CA9" }} />
                <h3 className="text-lg font-bold" style={{ color: "#112A43" }}>
                  Payment Structure
                </h3>
              </div>

              <div className="space-y-4">
                <div>
                  <Label htmlFor="payment-method" className="text-sm font-semibold text-gray-700 mb-2 block">
                    Payment Method
                  </Label>
                  <div className="flex items-center gap-3">
                    <span className={`text-sm ${paymentMethod === "upfront" ? "font-bold" : "text-gray-500"}`}>
                      Upfront
                    </span>
                    <Switch
                      id="payment-method"
                      checked={paymentMethod === "loan"}
                      onCheckedChange={handlePaymentMethodChange}
                    />
                    <span className={`text-sm ${paymentMethod === "loan" ? "font-bold" : "text-gray-500"}`}>Loan</span>
                    <Popover>
                      <PopoverTrigger>
                        <HelpCircle className="w-4 h-4 text-gray-400 hover:text-gray-600" />
                      </PopoverTrigger>
                      <PopoverContent className="w-80">
                        <div className="space-y-2 text-sm">
                          <p>
                            <strong>Upfront:</strong> Full payment of climate adaptation costs immediately
                          </p>
                          <p>
                            <strong>Loan:</strong> Finance climate investments over time with customizable terms
                          </p>
                          <p>This affects DSCR, LTV ratios, and NOI forecasting calculations</p>
                        </div>
                      </PopoverContent>
                    </Popover>
                  </div>
                </div>

                {paymentMethod === "loan" && (
                  <div className="space-y-4 p-3 rounded-xl" style={{ backgroundColor: "#66DCCC" }}>
                    <div>
                      <Label className="text-sm font-semibold mb-2 block" style={{ color: "#112A43" }}>
                        Loan Coverage: {loanCoverage}%
                      </Label>
                      <div className="px-2">
                        <Slider
                          value={[loanCoverage]}
                          onValueChange={handleLoanCoverageChange}
                          max={100}
                          min={50}
                          step={5}
                          className="w-full"
                        />
                      </div>
                    </div>

                    <div>
                      <Label className="text-sm font-semibold mb-2 block" style={{ color: "#112A43" }}>
                        Interest Rate (%)
                      </Label>
                      <Input
                        type="number"
                        value={interestRate}
                        onChange={(e) => handleInterestRateChange(e.target.value)}
                        className="rounded-full h-10"
                        placeholder="5.5"
                        step="0.1"
                        min="0"
                        max="20"
                      />
                    </div>

                    <div>
                      <Label className="text-sm font-semibold mb-2 block" style={{ color: "#112A43" }}>
                        Loan Term (Years)
                      </Label>
                      <Input
                        type="number"
                        value={loanTerm}
                        onChange={(e) => handleLoanTermChange(e.target.value)}
                        className="rounded-full h-10"
                        placeholder="25"
                        min="1"
                        max="50"
                      />
                    </div>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>

          {/* Impact Summary */}
          <div className="pt-4 border-t border-gray-200">
            <div className="text-sm text-gray-600 space-y-1">
              <div>
                <span className="font-semibold">Active Configuration:</span>
              </div>
              <div>
                {scenario.replace("custom-", "")} scenario, {paymentMethod} payment
              </div>
              {paymentMethod === "loan" && (
                <div>
                  {loanCoverage}% coverage, {loanTerm}yr term, {interestRate}% rate
                </div>
              )}
              <div className="text-xs text-gray-500 mt-2">
                Changes affect DSCR, LTV, and NOI projections in real-time
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Overlay when sidebar is open */}
      {!isCollapsed && (
        <div className="fixed inset-0 bg-black bg-opacity-25 z-30" onClick={() => setIsCollapsed(true)} />
      )}

      <ScenarioModal
        isOpen={showScenarioModal}
        onClose={() => setShowScenarioModal(false)}
        onSave={handleCustomScenarioSave}
      />
    </>
  )
}
