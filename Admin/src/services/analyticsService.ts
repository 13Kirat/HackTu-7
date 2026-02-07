import type { SalesData, ProductSalesData } from "@/types";
import {
  salesByRegion, salesByProduct, forecastTimeline,
  fastMoving, slowMoving, deadStock, stockDistribution,
} from "@/mock/data";

const delay = <T>(data: T, ms = 300): Promise<T> =>
  new Promise((resolve) => setTimeout(() => resolve(data), ms));

export const analyticsService = {
  getSalesByRegion: (): Promise<SalesData[]> => delay(salesByRegion),
  getSalesByProduct: (): Promise<ProductSalesData[]> => delay(salesByProduct),
  getForecastTimeline: () => delay(forecastTimeline),
  getFastMoving: () => delay(fastMoving),
  getSlowMoving: () => delay(slowMoving),
  getDeadStock: () => delay(deadStock),
  getStockDistribution: () => delay(stockDistribution),
};
