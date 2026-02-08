import api from "@/lib/api";
import type { Dealer, Sale } from "@/types";
import { orderService } from "./orderService";

export const dealerService = {
  getCurrentDealer: async (): Promise<Dealer> => {
    const response = await api.get("/auth/profile");
    const u = response.data;
    return {
      id: u._id,
      name: u.name,
      email: u.email,
      location: u.address || "Unassigned",
      phone: u.phone || "",
      settings: u.settings
    };
  },
  
  updateProfile: async (data: Partial<Dealer>): Promise<Dealer> => {
    const payload = {
        name: data.name,
        email: data.email,
        phone: data.phone,
        address: data.location,
        settings: data.settings
    };
    const response = await api.put("/auth/profile", payload);
    const u = response.data;
    return {
      id: u._id,
      name: u.name,
      email: u.email,
      location: u.address || "Unassigned",
      phone: u.phone || "",
      settings: u.settings
    };
  },

  getSalesHistory: async (): Promise<Sale[]> => {
    // Sales are logically 'customer_order' types that are shipped/delivered
    const orders = await orderService.getOrders();
    // Filter for non-cancelled, non-dealer internal orders (if applicable)
    // For now, any order with amount is a 'sale' for the dealer's dashboard purposes
    const sales: Sale[] = [];
    
    orders.forEach(order => {
        if (['shipped', 'delivered'].includes(order.status)) {
            order.products.forEach((p, idx) => {
                sales.push({
                    id: `${order.id}-${idx}`,
                    productId: "", // Missing from order product type currently
                    productName: p.productName,
                    quantitySold: p.quantity,
                    revenue: p.quantity * p.price,
                    date: order.date
                });
            });
        }
    });

    return sales;
  },
};
