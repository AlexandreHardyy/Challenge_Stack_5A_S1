"use client"

import { Bar, BarChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts"
import { Loader } from "@/components/ui/loader.tsx"

interface OverviewProps {
  data: { total: number; name: string | "Invalid DateTime" }[]
  isLoading: boolean
}

function Overview({ data, isLoading }: OverviewProps) {
  return (
    <ResponsiveContainer width="100%" height={430}>
      {isLoading ? (
        <Loader />
      ) : (
        <BarChart data={data}>
          <XAxis dataKey="name" stroke="#888888" fontSize={12} tickLine={false} axisLine={false} />
          <YAxis
            stroke="#888888"
            fontSize={12}
            tickLine={false}
            axisLine={false}
            tickFormatter={(value) => `$${value}`}
          />
          <Tooltip />
          <Bar dataKey="total" fill="#1AB24D" radius={[4, 4, 0, 0]} />
        </BarChart>
      )}
    </ResponsiveContainer>
  )
}

export default Overview
