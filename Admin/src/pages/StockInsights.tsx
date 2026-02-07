import { PageHeader } from "@/components/shared/PageHeader";
import { DataTable } from "@/components/shared/DataTable";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { fastMoving, slowMoving, deadStock, salesByProduct, stockDistribution } from "@/mock/data";
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  PieChart, Pie, Cell, Legend,
} from "recharts";
import type { StockCategory } from "@/types";

const PIE_COLORS = ["hsl(var(--chart-1))", "hsl(var(--chart-2))", "hsl(var(--chart-3))"];

const stockColumns = [
  { key: "product", header: "Product" },
  { key: "sku", header: "SKU", render: (i: StockCategory) => <code className="text-xs bg-muted px-1.5 py-0.5 rounded">{i.sku}</code> },
  { key: "totalStock", header: "Total Stock" },
  { key: "monthlySales", header: "Monthly Sales" },
  { key: "turnoverRate", header: "Turnover Rate", render: (i: StockCategory) => `${i.turnoverRate.toFixed(2)}x` },
];

export default function StockInsights() {
  return (
    <div className="space-y-6">
      <PageHeader title="Stock Insights" description="Analyze stock movement patterns and distribution" />

      <div className="grid gap-4 lg:grid-cols-2">
        <Card>
          <CardHeader><CardTitle className="text-base">Sales by Product</CardTitle></CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={280}>
              <BarChart data={salesByProduct}>
                <CartesianGrid strokeDasharray="3 3" className="stroke-border" />
                <XAxis dataKey="product" tick={{ fill: "hsl(var(--muted-foreground))", fontSize: 12 }} />
                <YAxis tick={{ fill: "hsl(var(--muted-foreground))", fontSize: 12 }} />
                <Tooltip contentStyle={{ backgroundColor: "hsl(var(--card))", border: "1px solid hsl(var(--border))", borderRadius: "8px", color: "hsl(var(--foreground))" }} />
                <Bar dataKey="sales" fill="hsl(var(--chart-2))" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        <Card>
          <CardHeader><CardTitle className="text-base">Stock Distribution</CardTitle></CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={280}>
              <PieChart>
                <Pie data={stockDistribution} cx="50%" cy="50%" outerRadius={100} dataKey="value" nameKey="name" label>
                  {stockDistribution.map((_, idx) => (
                    <Cell key={idx} fill={PIE_COLORS[idx % PIE_COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip contentStyle={{ backgroundColor: "hsl(var(--card))", border: "1px solid hsl(var(--border))", borderRadius: "8px", color: "hsl(var(--foreground))" }} />
                <Legend />
              </PieChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="fast">
        <TabsList>
          <TabsTrigger value="fast">Fast Moving</TabsTrigger>
          <TabsTrigger value="slow">Slow Moving</TabsTrigger>
          <TabsTrigger value="dead">Dead Stock</TabsTrigger>
        </TabsList>
        <TabsContent value="fast"><DataTable data={fastMoving} columns={stockColumns} /></TabsContent>
        <TabsContent value="slow"><DataTable data={slowMoving} columns={stockColumns} /></TabsContent>
        <TabsContent value="dead"><DataTable data={deadStock} columns={stockColumns} /></TabsContent>
      </Tabs>
    </div>
  );
}
