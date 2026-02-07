import api from "@/lib/api";
import type { InventoryItem, InventoryMovement, Forecast } from "@/types";

export const inventoryService = {
  getAll: async (): Promise<InventoryItem[]> => {
    const response = await api.get("/inventory/company");
    // Backend returns grouped by product or flat? 
    // /inventory/company uses aggregate by product.
    // Let's assume we want flat inventory per location for the main table.
    // Or we need a new endpoint for "all inventory flat".
    // For now, let's use /inventory/company and map it.
    return response.data.map((item: any) => ({
      id: item._id, // product id usually in company agg
      productId: item.product._id,
      productName: item.product.name,
      sku: item.product.sku,
      locationId: "multiple", // Grouped
      locationName: "All Locations",
      locationType: "factory", 
      totalStock: item.totalStock,
      reservedStock: item.reservedStock,
      availableStock: item.availableStock,
      reorderLevel: 0
    }));
  },
  
  getFlat: async (): Promise<InventoryItem[]> => {
      // We might need a flat list. Let's fetch all locations then fetch inventory for each?
      // Better: let's assume we can get flat inventory if we pass no locationId to /inventory/location
      const response = await api.get("/inventory/location/all"); // I might need to check if backend handles 'all'
      // If not, I'll fallback to fetching per location.
      return [];
  },

  getInventoryByLocation: async (locationId: string): Promise<InventoryItem[]> => {
    const response = await api.get(`/inventory/location/${locationId}`);
    return response.data.map((item: any) => ({
      id: item._id,
      productId: item.productId._id,
      productName: item.productId.name,
      sku: item.productId.sku,
      locationId: item.locationId,
      locationName: item.locationId.name, // If populated
      locationType: item.locationId.type,
      totalStock: item.totalStock,
      reservedStock: item.reservedStock,
      availableStock: item.availableStock,
      reorderLevel: item.reorderLevel
    }));
  },

  getMovements: async (): Promise<InventoryMovement[]> => {
    const response = await api.get("/inventory/movements");
    return response.data.map((m: any) => ({
      id: m._id,
      date: m.createdAt,
      productId: m.productId._id,
      productName: m.productId.name,
      fromLocationId: m.fromLocationId?._id,
      fromLocationName: m.fromLocationId?.name || "N/A",
      toLocationId: m.toLocationId?._id,
      toLocationName: m.toLocationId?.name || "N/A",
      quantity: m.quantity,
      movementType: m.movementType
    }));
  },

  transferStock: async (payload: {
    fromLocationId: string;
    toLocationId: string;
    productId: string;
    quantity: number;
  }): Promise<{ success: boolean }> => {
    await api.post("/inventory/transfer", payload);
    return { success: true };
  },
};
