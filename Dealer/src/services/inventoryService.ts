import api from "@/lib/api";
import type { InventoryItem, Product } from "@/types";

export const inventoryService = {
  getInventory: async (): Promise<InventoryItem[]> => {
    const response = await api.get("/inventory/company");
    return response.data.map((item: any) => ({
      id: item._id,
      productId: item.product?._id,
      productName: item.product?.name || "Product",
      sku: item.product?.sku || "N/A",
      totalStock: item.totalStock,
      reservedStock: item.reservedStock,
      availableStock: item.availableStock,
      reorderLevel: 10
    }));
  },
  
  getProducts: async (): Promise<Product[]> => {
    const [prodRes, invRes] = await Promise.all([
        api.get("/products"),
        api.get("/inventory/company")
    ]);

    const inventoryMap = Object.fromEntries(
        invRes.data.map((i: any) => [i.product?._id, i.availableStock])
    );

    return prodRes.data.map((p: any) => ({
      id: p._id,
      name: p.name,
      sku: p.sku,
      price: p.price,
      category: p.category,
      stock: inventoryMap[p._id] || 0,
      warehouse: "Regional Hub", // Descriptive placeholder
      schemes: p.schemes || []
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
      warehouse: "Regional Hub",
      schemes: p.schemes || []
    };
  },

  getCategories: async (): Promise<string[]> => {
    const response = await api.get("/products");
    return [...new Set(response.data.map((p: any) => p.category))];
  },
};
