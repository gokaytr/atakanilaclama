// Server-safe fetch helper for the admin-editable price list
// (public.pricing_items table). Falls back to the static pricingByPlace
// array so the homepage never shows an empty price list, even before
// Supabase is configured or reachable.
import { supabase } from "@/lib/supabase";
import { pricingByPlace } from "@/data/services";

export type PricingItem = {
  id: string;
  name: string;
  icon: string;
  priceFrom: number;
};

type PricingRow = {
  id: string;
  name: string;
  icon: string;
  price_from: number;
  sort_order: number;
};

export async function fetchPricingItems(): Promise<PricingItem[]> {
  const { data, error } = await supabase
    .from("pricing_items")
    .select("id, name, icon, price_from, sort_order")
    .order("sort_order", { ascending: true });

  if (error || !data || data.length === 0) {
    return pricingByPlace.map((p, i) => ({ id: `static-${i}`, name: p.name, icon: p.icon, priceFrom: p.priceFrom }));
  }

  return (data as PricingRow[]).map((row) => ({
    id: row.id,
    name: row.name,
    icon: row.icon,
    priceFrom: row.price_from,
  }));
}
