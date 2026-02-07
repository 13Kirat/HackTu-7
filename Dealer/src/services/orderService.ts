import { orders } from "@/mock/data";
import type { Order } from "@/types";

export const orderService = {
  getOrders: (): Promise<Order[]> => Promise.resolve(orders),
  getOrderById: (id: string): Promise<Order | undefined> => Promise.resolve(orders.find(o => o.id === id)),
  getFulfillmentOrders: (): Promise<Order[]> => Promise.resolve(orders.filter(o => o.type === "fulfillment")),
  getDealerOrders: (): Promise<Order[]> => Promise.resolve(orders.filter(o => o.type === "dealer")),
  createOrder: (order: Partial<Order>): Promise<Order> => Promise.resolve({ ...orders[0], ...order, id: `ORD-${Date.now()}` } as Order),
};
