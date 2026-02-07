import type { Notification } from "@/types";

export const notifications: Notification[] = [
  { id: "N001", type: "order", title: "Order Confirmed", message: "ORD-003 for 20× Hydraulic Valve HV50 has been confirmed.", read: false, createdAt: "2026-02-07T10:30:00", actionUrl: "/order-tracking" },
  { id: "N002", type: "stock", title: "Low Stock Alert", message: "Safety Valve SV15 dropped below reorder level.", read: false, createdAt: "2026-02-07T09:45:00", actionUrl: "/alerts" },
  { id: "N003", type: "order", title: "Shipment Update", message: "ORD-002 is in transit via Highway 45.", read: false, createdAt: "2026-02-07T08:15:00", actionUrl: "/order-tracking" },
  { id: "N004", type: "alert", title: "High Demand Forecast", message: "Industrial Pump X200 demand rising 35%.", read: true, createdAt: "2026-02-06T16:00:00", actionUrl: "/alerts" },
  { id: "N005", type: "promotion", title: "New Coupon Available", message: "SPRING25 — 25% off all products.", read: true, createdAt: "2026-02-06T14:30:00", actionUrl: "/coupons" },
];
