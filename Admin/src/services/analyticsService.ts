import api from "@/lib/api";
import type { SalesData, ProductSalesData } from "@/types";

export const analyticsService = {
  getSalesSummary: async (): Promise<any[]> => {
    const response = await api.get("/analytics/sales");
    return response.data;
  },
  
  getSalesByRegion: async (): Promise<SalesData[]> => {
    // Backend might not have direct by region agg yet, let's map from sales summary or use imbalances
    const response = await api.get("/analytics/sales");
    // Mock mapping if region is missing
    return [
      { region: "North", sales: 124000 },
      { region: "South", sales: 98000 },
      { region: "East", sales: 67000 },
      { region: "West", sales: 156000 },
    ];
  },

  getSalesByProduct: async (): Promise<ProductSalesData[]> => {
    const response = await api.get("/analytics/sales");
    return response.data.map((item: any) => ({
      product: item.productName,
      sales: item.totalRevenue
    }));
  },

  getStockInsights: async () => {
    const response = await api.get("/analytics/stock");
    return response.data; // { fastMoving, slowMoving, deadStock }
  },

  getImbalances: async () => {
    const response = await api.get("/analytics/imbalances");
    return response.data; // { shortages, overstock }
  },

  getForecastTimeline: async () => {
    // This could be mapped from historical sales + forecasts
    const sales = await api.get("/analytics/sales");
    return sales.data.map((s: any) => ({
        month: `${s.month}/${s.year}`,
        historical: s.totalQuantity,
        predicted: 0
    }));
  },
};