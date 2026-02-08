import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { aiService } from "@/services/aiService";
import { locationService } from "@/services/locationService";
import { productService } from "@/services/productService";
import { PageHeader } from "@/components/shared/PageHeader";
import { DataTable } from "@/components/shared/DataTable";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { forecastTimeline } from "@/mock/data";
import type { Forecast } from "@/types";
import { TrendingUp, Loader2, PlayCircle } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import {
  LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend,
} from "recharts";

export default function Forecasting() {
  const queryClient = useQueryClient();
  const { toast } = useToast();
  const [triggerOpen, setTriggerOpen] = useState(false);
  const [selectedLoc, setSelectedLoc] = useState("");
  const [selectedProd, setSelectedProd] = useState("");

  const { data: forecasts, isLoading } = useQuery({
    queryKey: ["forecasts"],
    queryFn: aiService.getForecasts,
  });

  const { data: locations } = useQuery({
    queryKey: ["locations"],
    queryFn: locationService.getAll,
  });

  const { data: products } = useQuery({
    queryKey: ["products"],
    queryFn: productService.getAll,
  });

  const triggerMutation = useMutation({
    mutationFn: aiService.triggerForecast,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["forecasts"] });
      toast({ title: "Forecast Triggered", description: "AI model is processing demand predictions." });
      setTriggerOpen(false);
    },
  });

  const handleTrigger = () => {
    if (!selectedLoc || !selectedProd) return;
    triggerMutation.mutate({ locationId: selectedLoc, productId: selectedProd });
  };

  const columns = [
    { key: "productName", header: "Product" },
    { key: "locationName", header: "Location" },
    { key: "forecastDate", header: "Target Date", render: (f: Forecast) => new Date(f.forecastDate).toLocaleDateString() },
    { key: "predictedDemand", header: "Predicted Demand", render: (f: Forecast) => (
      <span className="text-primary font-bold">
        {f.predictedDemand}
      </span>
    )},
  ];

  return (
    <div className="space-y-6">
      <PageHeader title="Demand Forecasting" description="AI-driven demand predictions based on historical data">
        <Dialog open={triggerOpen} onOpenChange={setTriggerOpen}>
          <DialogTrigger asChild>
            <Button><TrendingUp className="mr-2 h-4 w-4" />Run AI Forecast</Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader><DialogTitle>Run New Demand Prediction</DialogTitle></DialogHeader>
            <div className="grid gap-4 py-4">
              <div className="space-y-2">
                <label className="text-sm font-medium">Location</label>
                <Select value={selectedLoc} onValueChange={setSelectedLoc}>
                  <SelectTrigger><SelectValue placeholder="Select location" /></SelectTrigger>
                  <SelectContent>{locations?.map(l => <SelectItem key={l.id} value={l.id}>{l.name}</SelectItem>)}</SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium">Product</label>
                <Select value={selectedProd} onValueChange={setSelectedProd}>
                  <SelectTrigger><SelectValue placeholder="Select product" /></SelectTrigger>
                  <SelectContent>{products?.map(p => <SelectItem key={p.id} value={p.id}>{p.name}</SelectItem>)}</SelectContent>
                </Select>
              </div>
              <Button className="w-full" onClick={handleTrigger} disabled={triggerMutation.isPending}>
                {triggerMutation.isPending ? <Loader2 className="h-4 w-4 animate-spin mr-2" /> : <PlayCircle className="h-4 w-4 mr-2" />}
                Generate Prediction
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      </PageHeader>

      <Card>
        <CardHeader><CardTitle className="text-base font-medium">Historical vs Predicted Demand</CardTitle></CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={forecastTimeline}>
              <CartesianGrid strokeDasharray="3 3" className="stroke-border" />
              <XAxis dataKey="month" tick={{ fill: "hsl(var(--muted-foreground))", fontSize: 12 }} />
              <YAxis tick={{ fill: "hsl(var(--muted-foreground))", fontSize: 12 }} />
              <Tooltip contentStyle={{ backgroundColor: "hsl(var(--card))", border: "1px solid hsl(var(--border))", borderRadius: "8px", color: "hsl(var(--foreground))" }} />
              <Legend />
              <Line type="monotone" dataKey="historical" stroke="hsl(var(--chart-1))" strokeWidth={2} dot={{ r: 4 }} name="Historical Sales" />
              <Line type="monotone" dataKey="predicted" stroke="hsl(var(--chart-3))" strokeWidth={2} strokeDasharray="5 5" dot={{ r: 4 }} name="AI Prediction" />
            </LineChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>

      {isLoading ? (
        <div className="flex justify-center p-10"><Loader2 className="h-8 w-8 animate-spin text-primary" /></div>
      ) : (
        <DataTable data={forecasts || []} columns={columns} searchKey="productName" searchPlaceholder="Search forecasts..." />
      )}
    </div>
  );
}
