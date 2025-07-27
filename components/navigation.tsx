"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Home, Building, PieChart, Info, LogOut, TrendingUp } from "lucide-react"

export function Navigation() {
  const pathname = usePathname()

  if (pathname === "/") return null

  const navItems = [
    { href: "/", label: "Home", icon: Home },
    { href: "/asset/search", label: "Asset", icon: Building },
    { href: "/portfolio/filter", label: "Portfolio", icon: PieChart },
    { href: "/key-insights", label: "Key Insights", icon: TrendingUp },
    { href: "/about", label: "About Us", icon: Info },
  ]

  return (
    <nav className="bg-white border-b border-gray-200 px-6 py-4">
      <div className="flex items-center justify-between max-w-7xl mx-auto">
        <div className="flex items-center space-x-8">
          <Link href="/" className="text-xl font-bold" style={{ color: "#112A43" }}>
            Climate Risk Analytics
          </Link>
          <div className="flex items-center space-x-6">
            {navItems.map((item) => {
              const Icon = item.icon
              const isActive = (pathname.startsWith(item.href) && item.href !== "/") || pathname === item.href
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={`flex items-center space-x-2 px-3 py-2 rounded-full transition-colors ${
                    isActive ? "text-white" : "text-gray-600 hover:text-white hover:bg-opacity-80"
                  }`}
                  style={{
                    backgroundColor: isActive ? "#2B6CA9" : "transparent",
                    ":hover": { backgroundColor: "#2B6CA9" },
                  }}
                >
                  <Icon className="w-4 h-4" />
                  <span>{item.label}</span>
                </Link>
              )
            })}
          </div>
        </div>
        <Button
          variant="outline"
          className="rounded-full border-2 hover:bg-red-50 hover:border-red-300 hover:text-red-600 bg-transparent"
        >
          <LogOut className="w-4 h-4 mr-2" />
          Sign Out
        </Button>
      </div>
    </nav>
  )
}
