import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Natural & Organic Regenerative Farming Practices · Living Soil Protocols — ArkaShine",
  description:
    "Natural and organic regenerative farming practices: 19 living soil protocols, plus strawberry and dragon fruit field guides from Indian farms.",
};

export default function GrowersLayout({ children }: { children: React.ReactNode }) {
  return children;
}
