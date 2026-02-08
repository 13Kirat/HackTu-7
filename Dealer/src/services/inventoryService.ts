import api from "@/lib/api";
import type { InventoryItem, Product } from "@/types";

export const inventoryService = {
  getInventory: async (): Promise<InventoryItem[]> => {
    const response = await api.get("/inventory/company"); // Dealers see own location or filter?
    // Actually backend handles companyId. If user is Dealer, they see their own inventory.
    return response.data.map((item: any) => ({
      id: item._id,
      productId: item.product?._id,
      productName: item.product?.name || "Product",
      sku: item.product?.sku || "N/A",
      totalStock: item.totalStock,
      reservedStock: item.reservedStock,
      availableStock: item.availableStock,
      reorderLevel: 10 // Backend doesn't return this in agg, using default
    }));
  },
  
  getProducts: async (): Promise<Product[]> => {
    const response = await api.get("/products");
    return response.data.map((p: any) => ({
      id: p._id,
      name: p.name,
      sku: p.sku,
      price: p.price,
      category: p.category,
      stock: 0,
      warehouse: "Main",
      schemes: []
    }));
  },

  getProductById: async (id: string): Promise<Product> => {
    const response = await api.get(`/products/${id}`);
    const p = response.data;
    return {
      id: p._id,
      name: p.name,
      sku: p.sku,
      price: p.price,
      category: p.category,
      stock: 0,
      warehouse: "Main",
      schemes: []
    };
  },

  getCategories: async (): Promise<string[]> => {
    const response = await api.get("/products");
    return [...new Set(response.data.map((p: any) => p.category))];
  },
};