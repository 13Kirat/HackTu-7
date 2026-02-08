import api from "@/lib/api";
import type { Forecast } from "@/types";

export const aiService = {
  getForecasts: async (): Promise<Forecast[]> => {
    const response = await api.get("/ai/forecasts");
    return response.data.map((f: any) => ({
      id: f._id,
      productId: f.productId?._id,
      productName: f.productId?.name || "Unknown",
      locationId: f.locationId?._id,
      locationName: f.locationId?.name || "Global",
      predictedDemand: f.predictedDemand,
      forecastDate: f.forecastDate
    }));
  },

  triggerForecast: async (data: { productId: string; locationId: string }) => {
    const response = await api.post("/ai/forecast", data);
    return response.data;
  },

  getReplenishment: async (locationId: string) => {
    const response = await api.post("/ai/replenishment", { locationId });
    return response.data;
  }
};
