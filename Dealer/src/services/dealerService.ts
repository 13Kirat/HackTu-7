import { dealers, sales } from "@/mock/data";
import type { Dealer, Sale } from "@/types";

export const dealerService = {
  getDealers: (): Promise<Dealer[]> => Promise.resolve(dealers),
  getDealerById: (id: string): Promise<Dealer | undefined> => Promise.resolve(dealers.find(d => d.id === id)),
  getCurrentDealer: (): Promise<Dealer> => Promise.resolve(dealers[0]),
  updateDealer: (dealer: Partial<Dealer>): Promise<Dealer> => Promise.resolve({ ...dealers[0], ...dealer }),
  getSalesHistory: (): Promise<Sale[]> => Promise.resolve(sales),
};
