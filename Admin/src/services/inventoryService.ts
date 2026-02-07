import type { InventoryItem, InventoryMovement, Forecast } from "@/types";
import { inventory, movements, forecasts } from "@/mock/data";

const delay = <T>(data: T, ms = 300): Promise<T> =>
  new Promise((resolve) => setTimeout(() => resolve(data), ms));

export const inventoryService = {
  getAll: (): Promise<InventoryItem[]> => delay(inventory),
  getById: (id: string): Promise<InventoryItem | undefined> =>
    delay(inventory.find((i) => i.id === id)),
  getMovements: (): Promise<InventoryMovement[]> => delay(movements),
  getForecasts: (): Promise<Forecast[]> => delay(forecasts),
  transferStock: (payload: {
    fromLocationId: string;
    toLocationId: string;
    productId: string;
    quantity: number;
  }): Promise<{ success: boolean }> => {
    console.log("Transfer stock:", payload);
    return delay({ success: true });
  },
};
