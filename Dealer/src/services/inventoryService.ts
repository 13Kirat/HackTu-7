import { inventory, products } from "@/mock/data";
import type { InventoryItem, Product } from "@/types";

export const inventoryService = {
  getInventory: (): Promise<InventoryItem[]> => Promise.resolve(inventory),
  getProducts: (): Promise<Product[]> => Promise.resolve(products),
  getProductById: (id: string): Promise<Product | undefined> => Promise.resolve(products.find(p => p.id === id)),
  getCategories: (): Promise<string[]> => Promise.resolve([...new Set(products.map(p => p.category))]),
};
