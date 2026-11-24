import type { Metadata } from "next";
import { PolicyPage, UL } from "@/components/site/PolicyPage";

export const metadata: Metadata = {
  title: "Cancellation & Refund Policy — ArkaShine Innovations",
  description: "When ArkaShine orders can be cancelled, how refunds are processed, non-refundable items and replacement terms.",
};

export default function CancellationRefundPolicyPage() {
  return (
    <PolicyPage
      eyebrow="Orders & Refunds"
      title="Cancellation & Refund Policy"
      sections={[
        {
          id: "cancellation",
          title: "Order Cancellation",
          body: <UL items={["Orders can be cancelled before dispatch by contacting us.", "Cancellation is not allowed once the product is dispatched."]} />,
        },
        {
          id: "refunds",
          title: "Refunds",
          body: <UL items={["Approved refunds will be processed within 7–10 working days.", "Shipping charges are non-refundable."]} />,
        },
        {
          id: "non-refundable",
          title: "Non-Refundable Items",
          body: <UL items={["Used devices, consumables, chemicals, and cartridges", "Orders cancelled after dispatch", "Damage due to misuse or improper handling"]} />,
        },
        {
          id: "replacement",
          title: "Replacement",
          body: <p>Manufacturing defects will be handled through repair or replacement as per warranty or AMC terms.</p>,
        },
      ]}
    />
  );
}
