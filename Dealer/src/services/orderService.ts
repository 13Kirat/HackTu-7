import api from "@/lib/api";
import type { Order, TimelineEvent } from "@/types";

export const orderService = {
  getOrders: async (): Promise<Order[]> => {
    const [ordersRes, shipmentsRes] = await Promise.all([
        api.get("/orders"),
        api.get("/shipments")
    ]);

    const shipmentsMap = Object.fromEntries(
        shipmentsRes.data.map((s: any) => [s.orderId?._id || s.orderId, s])
    );

    return ordersRes.data.map((o: any) => {
      const shipment = shipmentsMap[o._id];
      const timeline: TimelineEvent[] = [
          { status: "Order Placed", date: new Date(o.createdAt).toLocaleString() }
      ];

      if (o.status === "confirmed") {
          timeline.push({ status: "Order Confirmed", date: new Date(o.updatedAt).toLocaleString() });
      }
      if (shipment) {
          timeline.push({ 
              status: shipment.status === 'delivered' ? "Delivered" : "In Transit", 
              date: new Date(shipment.updatedAt).toLocaleString(),
              location: shipment.carrier || "Carrier"
          });
      }

      return {
        id: o._id,
        orderNumber: o.orderNumber,
        type: o.fromLocationId?.type === 'dealer' && o.toLocationId ? 'dealer' : 'fulfillment',
        status: o.status,
        dealerName: o.fromLocationId?.name || "Manufacturer",
        targetDealer: o.toLocationId?.name || "N/A",
        warehouse: o.fromLocationId?.name || "N/A",
        totalAmount: o.totalAmount,
        date: new Date(o.createdAt).toLocaleDateString(),
        estimatedDelivery: shipment?.estimatedDelivery ? new Date(shipment.estimatedDelivery).toLocaleDateString() : undefined,
        trackingNumber: shipment?.trackingNumber,
        carrier: shipment?.carrier,
        products: o.items.map((i: any) => ({
            productName: i.productId?.name || "Product",
            quantity: i.quantity,
            price: i.priceAtTime
        })),
        timeline
      };
    });
  },

  getOrderById: async (id: string): Promise<Order> => {
    const [orderRes, shipmentRes] = await Promise.all([
        api.get(`/orders/${id}`),
        api.get(`/shipments`)
    ]);
    
    const o = orderRes.data;
    const shipment = shipmentRes.data.find((s: any) => (s.orderId?._id || s.orderId) === id);

    const timeline: TimelineEvent[] = [
        { status: "Order Placed", date: new Date(o.createdAt).toLocaleString() }
    ];

    return {
      id: o._id,
      type: o.fromLocationId?.type === 'dealer' ? 'dealer' : 'fulfillment',
      status: o.status,
      dealerName: o.fromLocationId?.name || "Manufacturer",
      targetDealer: o.toLocationId?.name || "N/A",
      warehouse: o.fromLocationId?.name || "N/A",
      totalAmount: o.totalAmount,
      date: new Date(o.createdAt).toLocaleDateString(),
      products: o.items.map((i: any) => ({
          productName: i.productId?.name || "Product",
          quantity: i.quantity,
          price: i.priceAtTime
      })),
      timeline
    };
  },

  getFulfillmentOrders: async (): Promise<Order[]> => {
    const orders = await orderService.getOrders();
    return orders.filter(o => o.warehouse !== "N/A" && !o.targetDealer); 
  },

  getDealerOrders: async (): Promise<Order[]> => {
    const orders = await orderService.getOrders();
    return orders.filter(o => o.type === "dealer");
  },

  createDealerOrder: async (data: { fromLocationId: string; toLocationId?: string; items: { productId: string; quantity: number }[] }): Promise<Order> => {
    const response = await api.post("/orders/dealer", data);
    return response.data;
  },

  createOfflineBill: async (data: { items: { productId: string; quantity: number }[] }): Promise<Order> => {
    const response = await api.post("/orders/customer", data);
    return response.data;
  }
};
