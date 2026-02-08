import api from "@/lib/api";
import type { Order } from "@/types";

export const orderService = {
  getOrders: async (): Promise<Order[]> => {
    const response = await api.get("/orders");
    return response.data.map((o: any) => ({
      id: o._id,
      // Map backend status/types to frontend-friendly logic
      type: o.fromLocationId?.type === 'dealer' ? 'dealer' : 'fulfillment',
      status: o.status,
      dealerName: o.fromLocationId?.name || "Manufacturer",
      targetDealer: o.toLocationId?.name || "N/A",
      totalAmount: o.totalAmount,
      date: new Date(o.createdAt).toLocaleDateString(),
      products: o.items.map((i: any) => ({
          productName: i.productId?.name || "Product",
          quantity: i.quantity,
          price: i.priceAtTime
      }))
    }));
  },

  getOrderById: async (id: string): Promise<Order> => {
    const response = await api.get(`/orders/${id}`);
    const o = response.data;
    return {
      id: o._id,
      type: o.fromLocationId?.type === 'dealer' ? 'dealer' : 'fulfillment',
      status: o.status,
      dealerName: o.fromLocationId?.name || "Manufacturer",
      targetDealer: o.toLocationId?.name || "N/A",
      totalAmount: o.totalAmount,
      date: new Date(o.createdAt).toLocaleDateString(),
      products: o.items.map((i: any) => ({
          productName: i.productId?.name || "Product",
          quantity: i.quantity,
          price: i.priceAtTime
      }))
    };
  },

  getFulfillmentOrders: async (): Promise<Order[]> => {
    const orders = await orderService.getOrders();
    // Orders from Warehouse/Factory to Dealer
    return orders.filter(o => o.type === "fulfillment"); 
  },

  getDealerOrders: async (): Promise<Order[]> => {
    const orders = await orderService.getOrders();
    // Orders between dealers
    return orders.filter(o => o.type === "dealer");
  },

  createDealerOrder: async (data: { fromLocationId: string; toLocationId?: string; items: { productId: string; quantity: number }[] }): Promise<Order> => {
    const response = await api.post("/orders/dealer", data);
    return response.data;
  },
};
