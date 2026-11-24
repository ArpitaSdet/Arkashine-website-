import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "GeoLenz · Nutrient Maps & Land History — ArkaShine",
  description: "GeoLenz turns SoiLenz ticket values into field-wide nutrient maps. TerraMap adds the land's satellite history.",
};

export default function SatelliteLayout({ children }: { children: React.ReactNode }) {
  return children;
}
