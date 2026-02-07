import { useState } from "react";
import { PageHeader } from "@/components/shared/PageHeader";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { salesByRegion, salesByProduct, inventory } from "@/mock/data";
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
} from "recharts";

const tooltipStyle = {
  backgroundColor: "hsl(var(--card))",
  border: "1px solid hsl(var(--border))",
  borderRadius: "8px",
  color: "hsl(var(--foreground))",
};

// Shortage: items where available stock <= reorder level
const shortageItems = inventory.filter((i) => i.availableStock <= i.reorderLevel);
// Overstock: items where available stock > 3x reorder level
const overstockItems = inventory.filter((i) => i.availableStock > i.reorderLevel * 3);

export default function Analytics() {
  const [dateFrom, setDateFrom] = useState("2026-01-01");
  const [dateTo, setDateTo] = useState("2026-02-07");

  return (
    <div className="space-y-6">
      <PageHeader title="Sales & Stock Analytics" description="Comprehensive sales performance and stock reports" />

      {/* Date Range Filter */}
      <Card>
        <CardContent className="pt-6">
          <div className="flex flex-wrap items-end gap-4">
            <div className="space-y-1.5">
              <Label className="text-xs">From</Label>
              <Input type="date" value={dateFrom} onChange={(e) => setDateFrom(e.target.value)} className="w-40" />
            </div>
            <div className="space-y-1.5">
              <Label className="text-xs">To</Label>
              <Input type="date" value={dateTo} onChange={(e) => setDateTo(e.target.value)} className="w-40" />
            </div>
            <p className="text-xs text-muted-foreground pb-2">
              Showing data from {new Date(dateFrom).toLocaleDateString()} to {new Date(dateTo).toLocaleDateString()}
            </p>
          </div>
        </CardContent>
      </Card>

      <div className="grid gap-4 lg:grid-cols-2">
        <Card>
          <CardHeader><CardTitle className="text-base">Sales by Region</CardTitle></CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={salesByRegion}>
                <CartesianGrid strokeDasharray="3 3" className="stroke-border" />
                <XAxis dataKey="region" tick={{ fill: "hsl(var(--muted-foreground))", fontSize: 12 }} />
                <YAxis tick={{ fill: "hsl(var(--muted-foreground))", fontSize: 12 }} />
                <Tooltip contentStyle={tooltipStyle} />
                <Bar dataKey="sales" fill="hsl(var(--chart-1))" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        <Card>
          <CardHeader><CardTitle className="text-base">Sales by Product</CardTitle></CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={salesByProduct} layout="vertical">
                <CartesianGrid strokeDasharray="3 3" className="stroke-border" />
                <XAxis type="number" tick={{ fill: "hsl(var(--muted-foreground))", fontSize: 12 }} />
                <YAxis dataKey="product" type="category" width={100} tick={{ fill: "hsl(var(--muted-foreground))", fontSize: 12 }} />
                <Tooltip contentStyle={tooltipStyle} />
                <Bar dataKey="sales" fill="hsl(var(--chart-2))" radius={[0, 4, 4, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>

      {/* Shortage & Overstock Reports */}
      <div className="grid gap-4 lg:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle className="text-base flex items-center gap-2">
              Shortage Report
              <Badge variant="destructive" className="text-xs">{shortageItems.length}</Badge>
            </CardTitle>
          </CardHeader>
          <CardContent>
            {shortageItems.length === 0 ? (
              <p className="text-sm text-muted-foreground">No shortage items found.</p>
            ) : (
              <div className="space-y-3">
                {shortageItems.map((item) => (
                  <div key={item.id} className="flex items-center justify-between rounded-md border border-destructive/20 bg-destructive/5 p-3">
                    <div>
                      <p className="text-sm font-medium">{item.productName}</p>
                      <p className="text-xs text-muted-foreground">{item.locationName}</p>
                    </div>
                    <div className="text-right">
                      <p className="text-sm font-medium text-destructive">{item.availableStock} available</p>
                      <p className="text-xs text-muted-foreground">Reorder at {item.reorderLevel}</p>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-base flex items-center gap-2">
              Overstock Report
              <Badge variant="secondary" className="text-xs">{overstockItems.length}</Badge>
            </CardTitle>
          </CardHeader>
          <CardContent>
            {overstockItems.length === 0 ? (
              <p className="text-sm text-muted-foreground">No overstock items found.</p>
            ) : (
              <div className="space-y-3">
                {overstockItems.map((item) => (
                  <div key={item.id} className="flex items-center justify-between rounded-md border border-warning/20 bg-warning/5 p-3">
                    <div>
                      <p className="text-sm font-medium">{item.productName}</p>
                      <p className="text-xs text-muted-foreground">{item.locationName}</p>
                    </div>
                    <div className="text-right">
                      <p className="text-sm font-medium">{item.availableStock} available</p>
                      <p className="text-xs text-muted-foreground">Reorder at {item.reorderLevel}</p>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
