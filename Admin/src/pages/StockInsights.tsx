import { useQuery } from "@tanstack/react-query";
import { analyticsService } from "@/services/analyticsService";
import { PageHeader } from "@/components/shared/PageHeader";
import { DataTable } from "@/components/shared/DataTable";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  PieChart, Pie, Cell, Legend,
} from "recharts";
import { Loader2 } from "lucide-react";

const PIE_COLORS = ["hsl(var(--chart-1))", "hsl(var(--chart-2))", "hsl(var(--chart-3))"];

const stockColumns = [
  { key: "name", header: "Product" },
  { key: "sku", header: "SKU", render: (i: any) => <code className="text-xs bg-muted px-1.5 py-0.5 rounded">{i.sku}</code> },
  { key: "totalSold", header: "Total Sold (90d)", render: (i: any) => i.totalSold || 0 },
];

export default function StockInsights() {
  const { data: stockInsights, isLoading: stockLoading } = useQuery({
    queryKey: ["stock-insights"],
    queryFn: analyticsService.getStockInsights,
  });

  const { data: salesByProduct } = useQuery({
    queryKey: ["sales-by-product"],
    queryFn: analyticsService.getSalesByProduct,
  });

  // Mock distribution since backend doesn't provide it yet
  const stockDistribution = [
    { name: "Factories", value: 12150 },
    { name: "Warehouses", value: 10020 },
    { name: "Dealers", value: 1945 },
  ];

  return (
    <div className="space-y-6">
      <PageHeader title="Stock Insights" description="Analyze stock movement patterns and identify stagnant inventory" />

      <div className="grid gap-4 lg:grid-cols-2">
        <Card>
          <CardHeader><CardTitle className="text-base font-medium">Sales Performance by Product</CardTitle></CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={280}>
              <BarChart data={salesByProduct || []}>
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
          <CardHeader><CardTitle className="text-base font-medium">Inventory Distribution</CardTitle></CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={280}>
              <PieChart>
                <Pie data={stockDistribution} cx="50%" cy="50%" outerRadius={80} dataKey="value" nameKey="name" label>
                  {stockDistribution.map((_, idx) => (
                    <Cell key={idx} fill={PIE_COLORS[idx % PIE_COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip contentStyle={{ backgroundColor: "hsl(var(--card))", border: "1px solid hsl(var(--border))", borderRadius: "8px", color: "hsl(var(--foreground))" }} />
                <Legend verticalAlign="bottom" height={36}/>
              </PieChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>

      {stockLoading ? (
        <div className="flex justify-center p-10"><Loader2 className="h-8 w-8 animate-spin text-primary" /></div>
      ) : (
        <Tabs defaultValue="fast" className="w-full">
          <TabsList className="grid w-full grid-cols-3 max-w-md">
            <TabsTrigger value="fast">Fast Moving</TabsTrigger>
            <TabsTrigger value="slow">Slow Moving</TabsTrigger>
            <TabsTrigger value="dead">Dead Stock</TabsTrigger>
          </TabsList>
          <TabsContent value="fast" className="mt-4">
            <Card>
              <CardContent className="p-0">
                <DataTable data={stockInsights?.fastMoving || []} columns={stockColumns} searchKey="name" searchPlaceholder="Search products..." />
              </CardContent>
            </Card>
          </TabsContent>
          <TabsContent value="slow" className="mt-4">
            <Card>
              <CardContent className="p-0">
                <DataTable data={stockInsights?.slowMoving || []} columns={stockColumns} searchKey="name" searchPlaceholder="Search products..." />
              </CardContent>
            </Card>
          </TabsContent>
          <TabsContent value="dead" className="mt-4">
            <Card>
              <CardContent className="p-0">
                <DataTable data={stockInsights?.deadStock || []} columns={stockColumns} searchKey="name" searchPlaceholder="Search products..." />
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      )}
    </div>
  );
}