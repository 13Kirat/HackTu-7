import { PageHeader } from "@/components/shared/PageHeader";
import { DataTable } from "@/components/shared/DataTable";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { forecasts, forecastTimeline } from "@/mock/data";
import type { Forecast } from "@/types";
import {
  LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend,
} from "recharts";

const columns = [
  { key: "productName", header: "Product" },
  { key: "locationName", header: "Location" },
  { key: "currentStock", header: "Current Stock" },
  { key: "predictedDemand", header: "Predicted Demand", render: (f: Forecast) => (
    <span className={f.predictedDemand > f.currentStock ? "text-destructive font-medium" : "text-success font-medium"}>
      {f.predictedDemand}
    </span>
  )},
  { key: "recommendedReplenishment", header: "Recommended Replenishment" },
];

export default function Forecasting() {
  return (
    <div className="space-y-6">
      <PageHeader title="Demand Forecasting" description="Historical trends and predicted demand" />

      <Card>
        <CardHeader><CardTitle className="text-base">Historical vs Predicted Demand</CardTitle></CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={forecastTimeline}>
              <CartesianGrid strokeDasharray="3 3" className="stroke-border" />
              <XAxis dataKey="month" tick={{ fill: "hsl(var(--muted-foreground))", fontSize: 12 }} />
              <YAxis tick={{ fill: "hsl(var(--muted-foreground))", fontSize: 12 }} />
              <Tooltip contentStyle={{ backgroundColor: "hsl(var(--card))", border: "1px solid hsl(var(--border))", borderRadius: "8px", color: "hsl(var(--foreground))" }} />
              <Legend />
              <Line type="monotone" dataKey="historical" stroke="hsl(var(--chart-1))" strokeWidth={2} dot={{ r: 4 }} name="Historical" />
              <Line type="monotone" dataKey="predicted" stroke="hsl(var(--chart-3))" strokeWidth={2} strokeDasharray="5 5" dot={{ r: 4 }} name="Predicted" />
            </LineChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>

      <DataTable data={forecasts} columns={columns} searchKey="productName" searchPlaceholder="Search forecasts..." />
    </div>
  );
}
