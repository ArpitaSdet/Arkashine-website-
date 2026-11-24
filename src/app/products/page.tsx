import type { Metadata } from "next";
import { ProductsShowcase } from "@/components/products/ProductsShowcase";

export const metadata: Metadata = {
  title: "Products · SoiLenz 2.0, pH/EC Bottle & Upcoming Devices — ArkaShine",
  description:
    "ArkaShine soil intelligence devices: SoiLenz 2.0 portable soil lab and the pH/EC bottle, available now. Coming soon: Soil Sparsh, Soil Life and a water testing device.",
};

export default function ProductsPage() {
  return <ProductsShowcase />;
}
